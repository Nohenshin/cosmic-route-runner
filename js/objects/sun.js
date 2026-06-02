import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { getRadialGlowTexture } from "../utils/proceduralTextures.js";

export class Sun {
    constructor(position, radius = 10) {
        this.group = new THREE.Group();
        this.time = 0;
        this.radius = radius;

        const textureLoader = new THREE.TextureLoader();
        const sunTexture = textureLoader.load('./assets/textures/sun.jpg');
        sunTexture.colorSpace = THREE.SRGBColorSpace;

        const coreMaterial = new THREE.MeshStandardMaterial({
            map: sunTexture,
            color: 0xffffff,
            emissive: 0xffa13a,
            emissiveIntensity: 2.0,
            roughness: 0.3,
            metalness: 0.0
        });

        const core = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            coreMaterial
        );
        this.group.add(core);

        const glowTexture = getRadialGlowTexture(0xfff2aa, 0xff7a00);

        const glow = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: glowTexture,
                color: 0xffc04d,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                opacity: 0.9
            })
        );
        glow.scale.set(radius * 8, radius * 8, 1);
        this.group.add(glow);

        const pointLight = new THREE.PointLight(0xffd36e, 25, 700);
        pointLight.position.set(0, 0, 0);
        this.group.add(pointLight);

        this.core = core;
        this.glow = glow;

        this.group.position.set(position.x, position.y, position.z);
    }

    update(deltaTime) {
        this.time += deltaTime;
        this.group.rotation.y += deltaTime * 0.08;
        this.glow.material.opacity = 0.88 + Math.sin(this.time * 4) * 0.04;
    }

    getMesh() {
        return this.group;
    }

    getPosition() {
        return this.group.position;
    }
}