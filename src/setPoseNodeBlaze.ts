import { VRM, VRMHumanBoneName, VRMHumanoid, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

export function setPoseNodeBlaze(currentVrm: VRM, VRMposeStore: any) {
    // Hips
    if (VRMposeStore.Hips) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.Hips
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.Hips.rotation.x;
            getNode.rotation.y = VRMposeStore.Hips.rotation.y + Math.PI;
            getNode.rotation.z = VRMposeStore.Hips.rotation.z;
        }
    }
    // /*
    // LeftHand
    if (VRMposeStore.LeftHand) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.LeftHand
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.LeftHand.x;
            getNode.rotation.y = VRMposeStore.LeftHand.y;
            getNode.rotation.z = VRMposeStore.LeftHand.z;
        }
    }
    // LeftLowerArm
    if (VRMposeStore.LeftLowerArm) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.LeftLowerArm
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.LeftLowerArm.x;
            getNode.rotation.y = VRMposeStore.LeftLowerArm.y;
            getNode.rotation.z = VRMposeStore.LeftLowerArm.z;
        }
    }
    // LeftLowerLeg
    if (VRMposeStore.LeftLowerLeg) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.LeftLowerLeg
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.LeftLowerLeg.x;
            getNode.rotation.y = VRMposeStore.LeftLowerLeg.y;
            getNode.rotation.z = VRMposeStore.LeftLowerLeg.z;
        }
    }
    // LeftUpperArm
    if (VRMposeStore.LeftUpperArm) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.LeftUpperArm
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.LeftUpperArm.x;
            getNode.rotation.y = VRMposeStore.LeftUpperArm.y;
            getNode.rotation.z = VRMposeStore.LeftUpperArm.z;
        }
    }
    // LeftUpperLeg
    if (VRMposeStore.LeftUpperLeg) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.LeftUpperLeg
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.LeftUpperLeg.x;
            getNode.rotation.y = VRMposeStore.LeftUpperLeg.y;
            getNode.rotation.z = VRMposeStore.LeftUpperLeg.z;
        }
    }
    // RightHand
    if (VRMposeStore.RightHand) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.RightHand
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.RightHand.x;
            getNode.rotation.y = VRMposeStore.RightHand.y;
            getNode.rotation.z = VRMposeStore.RightHand.z;
        }
    }
    // RightLowerArm
    if (VRMposeStore.RightLowerArm) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.RightLowerArm
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.RightLowerArm.x;
            getNode.rotation.y = VRMposeStore.RightLowerArm.y;
            getNode.rotation.z = VRMposeStore.RightLowerArm.z;
        }
    }
    // RightLowerLeg
    if (VRMposeStore.RightLowerLeg) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.RightLowerLeg
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.RightLowerLeg.x;
            getNode.rotation.y = VRMposeStore.RightLowerLeg.y;
            getNode.rotation.z = VRMposeStore.RightLowerLeg.z;
        }
    }
    // RightUpperArm
    if (VRMposeStore.RightUpperArm) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.RightUpperArm
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.RightUpperArm.x;
            getNode.rotation.y = VRMposeStore.RightUpperArm.y;
            getNode.rotation.z = VRMposeStore.RightUpperArm.z;
        }
    }
    // RightUpperLeg
    if (VRMposeStore.RightUpperLeg) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.RightUpperLeg
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.RightUpperLeg.x;
            getNode.rotation.y = VRMposeStore.RightUpperLeg.y;
            getNode.rotation.z = VRMposeStore.RightUpperLeg.z;
        }
    }
    // */
    // Spine
    if (VRMposeStore.Spine) {
        const getNode = currentVrm.humanoid?.getNormalizedBoneNode(
            VRMHumanBoneName.Spine
        );
        if (getNode) {
            getNode.rotation.x = VRMposeStore.Spine.x;
            getNode.rotation.y = VRMposeStore.Spine.y;
            getNode.rotation.z = VRMposeStore.Spine.z;
        }
    }
}
