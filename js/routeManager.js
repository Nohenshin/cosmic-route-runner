import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { GAME_CONFIG } from "./config.js";

export class RouteManager {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();

        this.controlPoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(45, 18, -70),
            new THREE.Vector3(-55, 34, -140),
            new THREE.Vector3(-90, 8, -210),
            new THREE.Vector3(-25, -24, -280),
            new THREE.Vector3(70, -35, -350),
            new THREE.Vector3(30, 18, -420),
            new THREE.Vector3(-55, 12, -490),
            new THREE.Vector3(15, -28, -560)
        ];

        this.curve = new THREE.CatmullRomCurve3(
            this.controlPoints,
            false,
            "catmullrom",
            0.35
        );

        this.length = this.curve.getLength();
        this.createTrack();
    }

    createTrack() {

        if (!GAME_CONFIG.SHOW_ROUTE) {
            this.scene.add(this.group);
            return;
        }

        const trackGeometry = new THREE.TubeGeometry(
            this.curve,
            220,
            3.2,
            12,
            false
        );

        const trackMaterial = new THREE.MeshStandardMaterial({
            color: 0x16385f,
            emissive: 0x0a1b33,
            emissiveIntensity: 0.75,
            transparent: true,
            opacity: 0.26,
            roughness: 0.5,
            metalness: 0.05
        });

        const glowGeometry = new THREE.TubeGeometry(
            this.curve,
            220,
            5.0,
            8,
            false
        );

        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x29d8ff,
            transparent: true,
            opacity: 0.06,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);

        this.group.add(track);
        this.group.add(glow);

        const markerMaterialA = new THREE.MeshBasicMaterial({
            color: 0x3ee7ff,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });

        const markerMaterialB = new THREE.MeshBasicMaterial({
            color: 0xb56dff,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const p = this.curve.getPointAt(t);
            const marker = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 12, 12),
                i % 2 === 0 ? markerMaterialA : markerMaterialB
            );
            marker.position.copy(p);
            this.group.add(marker);
        }

        this.scene.add(this.group);
    }

    getLength() {
        return this.length;
    }

    getMesh() {
        return this.group;
    }

    getPointAt(t) {
        const u = THREE.MathUtils.clamp(t, 0, 1);
        return this.curve.getPointAt(u).clone();
    }

    getFrameAt(t) {
        const u = THREE.MathUtils.clamp(t, 0, 1);

        const point = this.curve.getPointAt(u).clone();
        const tangent = this.curve.getTangentAt(u).normalize();

        let worldUp = new THREE.Vector3(0, 1, 0);
        let right = new THREE.Vector3().crossVectors(worldUp, tangent);

        if (right.lengthSq() < 1e-5) {
            worldUp = new THREE.Vector3(1, 0, 0);
            right = new THREE.Vector3().crossVectors(worldUp, tangent);
        }

        right.normalize();
        const up = new THREE.Vector3().crossVectors(tangent, right).normalize();

        return { point, tangent, right, up };
    }

    makeWorldPosition(t, rightOffset = 0, upOffset = 0, forwardOffset = 0) {
        const frame = this.getFrameAt(t);

        return frame.point
            .clone()
            .addScaledVector(frame.right, rightOffset)
            .addScaledVector(frame.up, upOffset)
            .addScaledVector(frame.tangent, forwardOffset);
    }
}