import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import {
    getQuasarCoreTexture,
    getRadialGlowTexture
} from "../utils/proceduralTextures.js";

export class Quasar {
    constructor(position, radius = 5.5) {
        this.group = new THREE.Group();
        this.radius = radius;
        this.hazardRadius = radius * 4.0;
        this.time = 0;

        const coreTexture = getQuasarCoreTexture();

        this.coreMaterial = new THREE.MeshStandardMaterial({
            map: coreTexture,
            color: 0xffffff,
            emissive: 0x39dfff,
            emissiveIntensity: 4.2,
            roughness: 0.15,
            metalness: 0.0
        });

        const core = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 28, 28),
            this.coreMaterial
        );
        this.group.add(core);

        const glowTexture = getRadialGlowTexture(0xffffff, 0x2acfff);

        const halo = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: glowTexture,
                color: 0x5beeff,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                opacity: 0.95
            })
        );
        halo.scale.set(radius * 14, radius * 14, 1);
        this.group.add(halo);

        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0x87f8ff,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const beamGeo = new THREE.CylinderGeometry(
            0.15,
            0.55,
            radius * 9,
            14,
            1,
            true
        );

        const beamX1 = new THREE.Mesh(beamGeo, beamMaterial.clone());
        beamX1.rotation.z = Math.PI / 2;
        beamX1.position.x = radius * 3.8;
        this.group.add(beamX1);

        const beamX2 = new THREE.Mesh(beamGeo, beamMaterial.clone());
        beamX2.rotation.z = Math.PI / 2;
        beamX2.position.x = -radius * 3.8;
        this.group.add(beamX2);

        const beamY1 = new THREE.Mesh(beamGeo, beamMaterial.clone());
        beamY1.position.y = radius * 3.8;
        this.group.add(beamY1);

        const beamY2 = new THREE.Mesh(beamGeo, beamMaterial.clone());
        beamY2.position.y = -radius * 3.8;
        beamY2.rotation.z = Math.PI;
        this.group.add(beamY2);

        const pointLight = new THREE.PointLight(0x66dfff, 22, 350);
        pointLight.position.set(0, 0, 0);
        this.group.add(pointLight);

        this.group.position.set(position.x, position.y, position.z);

        this.core = core;
        this.halo = halo;
        this.beams = [beamX1, beamX2, beamY1, beamY2];
    }

    update(deltaTime) {
        this.time += deltaTime;

        const pulse = 1 + Math.sin(this.time * 6.5) * 0.08;
        this.core.scale.setScalar(pulse);

        this.coreMaterial.emissiveIntensity = 2.4 + Math.sin(this.time * 8.0) * 0.45;

        const beamPulse = 1 + Math.sin(this.time * 10.0) * 0.04;
        for (const beam of this.beams) {
            beam.scale.set(beamPulse, beamPulse, beamPulse);
            beam.material.opacity = 0.62 + Math.sin(this.time * 7.0) * 0.08;
        }

        this.halo.material.opacity = 0.85 + Math.sin(this.time * 5.5) * 0.06;
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

    getHazardRadius() {
        return this.hazardRadius;
    }
}