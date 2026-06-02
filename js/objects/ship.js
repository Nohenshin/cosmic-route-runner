import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { GAME_CONFIG } from "../config.js";

export class Ship {
    constructor() {
        this.group = new THREE.Group();
        this.time = 0;
        this.flame = null;

        this.progress = 0;
        this.localOffset = new THREE.Vector2(0, 0);

        this.forwardAxis = new THREE.Vector3(1, 0, 0);
        this.createMesh();
        this.group.position.set(0, 0, 0);
    }

    createMesh() {
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xbfc7d5,
            metalness: 0.45,
            roughness: 0.35
        });

        const accentMaterial = new THREE.MeshStandardMaterial({
            color: 0x2b3a67,
            metalness: 0.25,
            roughness: 0.6
        });

        const cockpitMaterial = new THREE.MeshStandardMaterial({
            color: 0x66ccff,
            emissive: 0x112244,
            emissiveIntensity: 0.7,
            metalness: 0.2,
            roughness: 0.25
        });

        const engineMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.5,
            roughness: 0.5
        });

        const flameMaterial = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xff6600,
            emissiveIntensity: 1.2,
            metalness: 0.0,
            roughness: 0.2
        });

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.5, 2.2, 12),
            bodyMaterial
        );
        body.rotation.z = Math.PI / 2;
        this.group.add(body);

        const nose = new THREE.Mesh(
            new THREE.ConeGeometry(0.4, 0.9, 12),
            new THREE.MeshStandardMaterial({
                color: 0xff5533,
                metalness: 0.3,
                roughness: 0.4
            })
        );
        nose.rotation.z = Math.PI / 2;
        nose.position.x = 1.55;
        this.group.add(nose);

        const wing = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.9, 2.0),
            accentMaterial
        );
        wing.position.set(0, -0.35, 0);
        this.group.add(wing);

        const finLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.5, 0.7),
            accentMaterial
        );
        finLeft.position.set(-0.4, 0.25, -0.55);
        finLeft.rotation.z = 0.35;
        this.group.add(finLeft);

        const finRight = finLeft.clone();
        finRight.position.z = 0.55;
        finRight.rotation.z = -0.35;
        this.group.add(finRight);

        const cockpit = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 16, 16),
            cockpitMaterial
        );
        cockpit.scale.set(1.2, 0.9, 0.9);
        cockpit.position.set(0.5, 0.22, 0);
        this.group.add(cockpit);

        const engine = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.25, 0.45, 12),
            engineMaterial
        );
        engine.rotation.z = Math.PI / 2;
        engine.position.set(-1.35, 0, 0);
        this.group.add(engine);

        this.flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.18, 0.6, 12),
            flameMaterial
        );
        this.flame.rotation.z = -Math.PI / 2;
        this.flame.position.set(-1.75, 0, 0);
        this.group.add(this.flame);
    }

    move(dx, dy, deltaTime) {
        const speed = GAME_CONFIG.SHIP_SPEED;

        this.localOffset.x += dx * speed * deltaTime;
        this.localOffset.y += dy * speed * deltaTime;

        this.localOffset.x = Math.max(
            -GAME_CONFIG.SHIP_MOVE_LIMIT_X,
            Math.min(GAME_CONFIG.SHIP_MOVE_LIMIT_X, this.localOffset.x)
        );

        this.localOffset.y = Math.max(
            -GAME_CONFIG.SHIP_MOVE_LIMIT_Y,
            Math.min(GAME_CONFIG.SHIP_MOVE_LIMIT_Y, this.localOffset.y)
        );
    }

    advance(deltaTime, routeManager, boostActive = false) {
        const speed = GAME_CONFIG.SHIP_FORWARD_SPEED *
            (boostActive ? GAME_CONFIG.BOOST_FORWARD_MULTIPLIER : 1);

        this.progress += (speed * deltaTime) / routeManager.getLength();
        this.progress = Math.min(this.progress, 0.9995);
    }

    forward(deltaTime, boostActive = false, routeManager) {
        if (routeManager) {
            this.advance(deltaTime, routeManager, boostActive);
        }
    }

    syncToRoute(routeManager) {
        const frame = routeManager.getFrameAt(this.progress);

        const worldPosition = frame.point
            .clone()
            .addScaledVector(frame.right, this.localOffset.x)
            .addScaledVector(frame.up, this.localOffset.y);

        this.group.position.copy(worldPosition);

        const directionQuat = new THREE.Quaternion().setFromUnitVectors(
            this.forwardAxis,
            frame.tangent.clone().normalize()
        );

        const roll = -(
            this.localOffset.x / GAME_CONFIG.SHIP_MOVE_LIMIT_X
        ) * 0.35;

        const rollQuat = new THREE.Quaternion().setFromAxisAngle(
            frame.tangent.clone().normalize(),
            roll
        );

        directionQuat.multiply(rollQuat);
        this.group.quaternion.copy(directionQuat);
    }

    addLocalOffset(dx, dy) {
        this.localOffset.x += dx;
        this.localOffset.y += dy;

        this.localOffset.x = Math.max(
            -GAME_CONFIG.SHIP_MOVE_LIMIT_X,
            Math.min(GAME_CONFIG.SHIP_MOVE_LIMIT_X, this.localOffset.x)
        );

        this.localOffset.y = Math.max(
            -GAME_CONFIG.SHIP_MOVE_LIMIT_Y,
            Math.min(GAME_CONFIG.SHIP_MOVE_LIMIT_Y, this.localOffset.y)
        );
    }

    getLocalOffset() {
        return this.localOffset.clone();
    }

    getProgress() {
        return this.progress;
    }

    update(deltaTime) {
        this.time += deltaTime;

        const pulse = 1 + Math.sin(this.time * 18.0) * 0.08;
        if (this.flame) {
            this.flame.scale.set(pulse, pulse, pulse);
        }
    }

    reset() {
        this.group.position.set(0, 0, 0);
        this.group.quaternion.identity();
        this.time = 0;
        this.progress = 0;
        this.localOffset.set(0, 0);
    }

    getMesh() {
        return this.group;
    }

    getPosition() {
        return this.group.position;
    }

    getRadius() {
        return GAME_CONFIG.SHIP_RADIUS;
    }

    getProgress() {
        return this.progress;
    }
}