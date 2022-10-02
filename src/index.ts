import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { VRM, VRMHumanBoneName, VRMHumanoid, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import * as posedetection from '@tensorflow-models/pose-detection';

window.addEventListener("DOMContentLoaded", init);

let poseStore: any = {};
const webcamCanvas = document.getElementById(
    "webacamCanvas"
) as HTMLCanvasElement;

const webcamCtx: CanvasRenderingContext2D | null =
    webcamCanvas.getContext("2d");

const video = document.getElementById("video") as any;

function detectAndDraw(net: posedetection.PoseDetector) {
    if (webcamCtx !== null && video !== null)
        webcamCtx.drawImage(video, 0, 0, 480, 320);

    net.estimatePoses(video, {
        flipHorizontal: false,
    }).then(function (pose: any) {
        drawKeypoints(pose[0]);
    });
}

const modelUrl = "./models/van-kun.vrm";

function drawKeypoints(pose: { keypoints: any[] }) {
    //TODO: fix inaccurate value of x & y
    pose.keypoints.forEach(
        (keypoint: { score: number; name: string; x: number; y: number }) => {
            if (keypoint.score > 0.4) {
                poseStore[keypoint.name] = {
                    x: 480 / 2 - keypoint.x,
                    y: 320 / 2 - keypoint.y,
                };

                if (webcamCtx !== null) {
                    webcamCtx.beginPath();
                    webcamCtx.fillStyle = "rgb(255, 255, 0)"; // yellow
                    webcamCtx.arc(
                        keypoint.x,
                        keypoint.y,
                        5,
                        (10 * Math.PI) / 180,
                        (80 * Math.PI) / 180,
                        true
                    );
                    webcamCtx.fill();
                    webcamCtx.fillText(
                        keypoint.name,
                        keypoint.x,
                        keypoint.y + 10
                    );
                }
            }
        }
    );
}

interface PoseIface {
    x: number;
    y: number;
}

function getAngleFromX(pos2: PoseIface, pos1: PoseIface) {
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
}

async function init() {
    navigator.mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then(async function (mediaStream) {
            // set video tag srcObject
            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e: unknown) {
                video.play();
            };
            const model = posedetection.SupportedModels.PoseNet;
            const net = await posedetection.createDetector(model);
            return net;
        })
        .then(function (net) {
            var loadingIndicator = document.getElementById("loading-indicator");
            if (loadingIndicator !== null) {
                loadingIndicator.style.display = "none";
                setInterval(function () {
                    detectAndDraw(net);
                }, 100);
            }
        });
    //===================================

    // setting render
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("vrm")?.appendChild(renderer.domElement);

    document.body.appendChild(renderer.domElement);

    // make scene
    const scene = new THREE.Scene();

    // make camera
    const camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.1, 3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.85, 0);
    controls.screenSpacePanning = true;
    controls.update();

    // Parallel light source
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // display grid
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    // gridHelper.visible = true;

    // display coordinate axis
    const axesHelper = new THREE.AxesHelper(0.5);
    scene.add(axesHelper);

    // load model
    let currentVrm: undefined | VRM = undefined;
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";

    loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
    });

    loader.load(
        modelUrl,
        (gltf) => {
            const vrm = gltf.userData.vrm;

            VRMUtils.removeUnnecessaryVertices(gltf.scene);
            VRMUtils.removeUnnecessaryJoints(gltf.scene);

            console.log("vrm", vrm);
            scene.add(vrm.scene);
            currentVrm = vrm;

            const boneNode = vrm.humanoid?.getNormalizedBoneNode(
                VRMHumanBoneName.Hips
            );
            if (boneNode !== null && boneNode !== undefined) {
                boneNode.rotation.y = Math.PI;
            }
        },
        (progress) =>
            console.log(
                "Loading model...",
                100.0 * (progress.loaded / progress.total),
                "%"
            ),

        (error: unknown) => console.error(error)
    );

    const clock = new THREE.Clock();
    let angleStore: any = {};
    animate();

    function animate() {
        requestAnimationFrame(animate);

        const deltaTime = clock.getDelta();

        if (currentVrm) {
            if (poseStore) {
                console.log("poseStore", poseStore);
                // OK
                if (poseStore.left_shoulder && poseStore.right_shoulder) {
                    // spine & shoulder
                    let angle = getAngleFromX(
                        poseStore.right_shoulder,
                        poseStore.left_shoulder
                    );
                    if (angle !== null) {
                        angle = angle * -1;
                        angleStore.Spine = angle;
                        // if (currentVrm.humanoid.getNormalizedBoneNode !== null)
                        const getNode =
                            currentVrm.humanoid?.getNormalizedBoneNode(
                                VRMHumanBoneName.Spine
                            );
                        if (getNode) {
                            getNode.rotation.z = angle;
                        }
                    }
                }
                // OK
                if (poseStore.left_eye && poseStore.right_eye) {
                    // neck $ eyes
                    let angle = getAngleFromX(
                        poseStore.right_eye,
                        poseStore.left_eye
                    );
                    if (angle !== null) {
                        angle = angle * -1;
                        angleStore.Neck = angle;
                        angle = angle - (angleStore.Spine || 0);
                        const getNode =
                            currentVrm.humanoid?.getNormalizedBoneNode(
                                VRMHumanBoneName.Neck
                            );
                        if (getNode) {
                            getNode.rotation.z = angle;
                        }
                    }
                }
                if (poseStore.left_shoulder && poseStore.left_elbow) {
                    // arms
                    let angle = getAngleFromX(
                        poseStore.left_elbow,
                        poseStore.left_shoulder
                    );
                    console.log("angle2", angle);

                    if (angle !== null) {
                        angle = Math.PI - angle;
                        angleStore.RightUpperArm = angle;
                        angle = angle - (angleStore.Spine || 0);
                        const getNode =
                            currentVrm.humanoid?.getNormalizedBoneNode(
                                VRMHumanBoneName.RightUpperArm
                            );
                        if (getNode) {
                            getNode.rotation.z = angle;
                        }
                    }
                }
                if (poseStore.left_wrist && poseStore.left_elbow) {
                    // arms
                    let angle = getAngleFromX(
                        poseStore.left_wrist,
                        poseStore.left_elbow
                    );
                    console.log("angle3", angle);

                    if (angle !== null) {
                        angle = Math.PI - angle;
                        angleStore.RightLowerArm = angle;
                        angle = angle - (angleStore.RightUpperArm || 0);
                        const getNode =
                            currentVrm.humanoid?.getNormalizedBoneNode(
                                VRMHumanBoneName.RightLowerArm
                            );
                        if (getNode) {
                            getNode.rotation.z = angle;
                        }
                    }
                }
                if (poseStore.right_shoulder && poseStore.right_elbow) {
                    // arms
                    let angle = getAngleFromX(
                        poseStore.right_elbow,
                        poseStore.right_shoulder
                    );
                    console.log("angle4", angle);

                    if (angle !== null) {
                        angle = angle * -1;
                        angleStore.LeftUpperArm = angle;
                        angle = angle - (angleStore.Spine || 0);
                        const getNode =
                            currentVrm.humanoid?.getNormalizedBoneNode(
                                VRMHumanBoneName.LeftUpperArm
                            );
                        if (getNode) {
                            getNode.rotation.z = angle;
                        }
                    }
                }
                if (poseStore.right_wrist && poseStore.right_elbow) {
                    // arms
                    let angle = getAngleFromX(
                        poseStore.right_wrist,
                        poseStore.right_elbow
                    );
                    console.log("angle5", angle);

                    if (angle !== null) {
                        angle = angle * -1;
                        angleStore.LeftLowerArm = angle;
                        angle = angle - (angleStore.LeftUpperArm || 0);
                        const getNode =
                            currentVrm.humanoid?.getNormalizedBoneNode(
                                VRMHumanBoneName.LeftLowerArm
                            );
                        if (getNode) {
                            getNode.rotation.z = angle;
                        }
                    }
                }
            }

            // update vrm
            currentVrm.update(deltaTime);
        }

        renderer.render(scene, camera);
    }
}
