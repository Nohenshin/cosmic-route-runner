import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { textures } from "../utils/textureManager.js";

export class Earth {
    constructor(position) {
        this.group = new THREE.Group();

        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(6, 64, 64),
            new THREE.MeshStandardMaterial({
                map: textures.earth,
                color: 0xffffff,
                roughness: 1,
                metalness: 0
            })
        );

        this.group.add(earth);

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(6.25, 64, 64),
            new THREE.MeshStandardMaterial({
                color: 0x66ccff,
                transparent: true,
                opacity: 0.12,
                emissive: 0x3366ff,
                emissiveIntensity: 0.35
            })
        );

        this.group.add(atmosphere);

        this.group.position.set(position.x, position.y, position.z);

        this.rotationSpeed = 0.15;
        this.earth = earth;
    }

    update(deltaTime) {
        this.group.rotation.y += this.rotationSpeed * deltaTime;
    }

    getMesh() {
        return this.group;
    }

    getPosition() {
        return this.group.position;
    }

    getRadius() {
        return 6;
    }
}