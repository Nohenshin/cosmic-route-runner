import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import {
    getBlackHoleDiskTexture,
    getRadialGlowTexture
} from "../utils/proceduralTextures.js";

export class BlackHole {
    constructor(position, radius = 12) {
        this.group = new THREE.Group();
        this.radius = radius;
        this.gravityRadius = radius * 4.5;
        this.time = 0;

        const textureLoader = new THREE.TextureLoader();
        const bhTexture = textureLoader.load('./assets/textures/blackhole.jfif');
        bhTexture.colorSpace = THREE.SRGBColorSpace;

        const coreMaterial = new THREE.MeshStandardMaterial({
            map: bhTexture,
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.0
        });

        const core = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            coreMaterial
        );
        this.group.add(core);

        const diskTexture = getBlackHoleDiskTexture();

        const diskMaterial = new THREE.MeshStandardMaterial({
            map: diskTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 0.95,
            emissive: 0x220044,
            emissiveIntensity: 0.8,
            roughness: 0.8,
            metalness: 0.0,
            side: THREE.DoubleSide
        });

        const accretionDisk = new THREE.Mesh(
            new THREE.TorusGeometry(radius * 2.15, radius * 0.42, 24, 120),
            diskMaterial
        );
        accretionDisk.rotation.x = Math.PI / 2;
        accretionDisk.rotation.z = Math.PI / 8;
        this.group.add(accretionDisk);

        const haloTexture = getRadialGlowTexture(0xb56dff, 0x000000);

        const halo = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: haloTexture,
                color: 0xb56dff,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                opacity: 0.55
            })
        );
        halo.scale.set(radius * 9, radius * 9, 1);
        this.group.add(halo);

        const glowLight = new THREE.PointLight(0x8b5cff, 2.5, 70);
        glowLight.position.set(0, 0, 0);
        this.group.add(glowLight);

        this.group.position.set(position.x, position.y, position.z);

        this.accretionDisk = accretionDisk;
        this.halo = halo;
    }

    update(deltaTime) {
        this.time += deltaTime;
        this.accretionDisk.rotation.z += 0.7 * deltaTime;
        this.halo.material.opacity = 0.5 + Math.sin(this.time * 4) * 0.05;
    }

    getMesh() {
        return this.group;
    }

    getPosition() {
        return this.group.position;
    }

    getRadius() {
        return this.radius;
    }

    getGravityRadius() {
        return this.gravityRadius;
    }
}