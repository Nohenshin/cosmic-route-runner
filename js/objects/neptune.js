import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export class Neptune {
    constructor(position, radius = 5, texture = null) {
        this.group = new THREE.Group();
        this.radius = radius;
        this.influenceRadius = radius * 2.8;

        const textureLoader = new THREE.TextureLoader();
        const neptuneTexture = textureLoader.load('./assets/textures/neptune.jfif');
        neptuneTexture.colorSpace = THREE.SRGBColorSpace;

        const planetMaterial = new THREE.MeshStandardMaterial({
            map: neptuneTexture,
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.05
        });

        const atmosphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x4488dd,
            transparent: true,
            opacity: 0.12,
            emissive: 0x2266aa,
            emissiveIntensity: 0.4
        });

        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            planetMaterial
        );
        this.group.add(planet);

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.12, 32, 32),
            atmosphereMaterial
        );
        this.group.add(atmosphere);

        const cloud = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.03, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.06
            })
        );
        this.group.add(cloud);

        this.group.position.set(position.x, position.y, position.z);
        this.rotationSpeed = 0.13 + Math.random() * 0.18;
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
        return this.radius;
    }

    getInfluenceRadius() {
        return this.influenceRadius;
    }
}
