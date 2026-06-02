import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export class Planet {
    constructor(position, radius = 4, texture = null, atmosphereColor = 0x77ccff) {
        this.group = new THREE.Group();
        this.radius = radius;
        this.influenceRadius = radius * 2.8;

        const planetMaterial = new THREE.MeshStandardMaterial({
            map: texture || null,
            color: texture ? 0xffffff : 0x4da6ff,
            roughness: 0.95,
            metalness: 0.05
        });

        const atmosphereMaterial = new THREE.MeshStandardMaterial({
            color: atmosphereColor,
            transparent: true,
            opacity: 0.18,
            emissive: atmosphereColor,
            emissiveIntensity: 0.5
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
                opacity: 0.08
            })
        );
        this.group.add(cloud);

        this.group.position.set(position.x, position.y, position.z);
        this.rotationSpeed = 0.15 + Math.random() * 0.2;
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