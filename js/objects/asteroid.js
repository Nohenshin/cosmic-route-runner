import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { GAME_CONFIG } from "../config.js";
import { getRockTexture } from "../utils/proceduralTextures.js";

const SHARED_ROCK_TEXTURE = getRockTexture();

const SHARED_CORE_GEOMETRY = new THREE.IcosahedronGeometry(1, 0);
const SHARED_CHUNK_GEOMETRY = new THREE.IcosahedronGeometry(0.45, 0);
const SHARED_FAST_CONE_GEOMETRY = new THREE.ConeGeometry(0.35, 1.8, 14, 1, true);

const SHARED_ROCK_MATERIAL = new THREE.MeshStandardMaterial({
    map: SHARED_ROCK_TEXTURE,
    color: 0xffffff,
    roughness: 1.0,
    metalness: 0.02
});

const SHARED_DARK_MATERIAL = new THREE.MeshStandardMaterial({
    map: SHARED_ROCK_TEXTURE,
    color: 0x7a6f63,
    roughness: 1.0,
    metalness: 0.0
});

const SHARED_FAST_GLOW_MATERIAL = new THREE.MeshBasicMaterial({
    color: 0x66eaff,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

export class Asteroid {
    static idCounter = 0;

    constructor(position, options = {}) {
        this.id = Asteroid.idCounter++;
        this.group = new THREE.Group();
        this.time = 0;

        this.scaleFactor = options.scale ??
            THREE.MathUtils.lerp(
                GAME_CONFIG.ASTEROID_MIN_SCALE,
                GAME_CONFIG.ASTEROID_MAX_SCALE,
                Math.random()
            );

        this.radius = GAME_CONFIG.ASTEROID_RADIUS * this.scaleFactor * 1.15;

        this.direction = (options.direction || new THREE.Vector3(-1, 0, 0))
            .clone()
            .normalize();

        this.forwardSpeed = options.speed ??
            THREE.MathUtils.randFloat(
                GAME_CONFIG.ASTEROID_SPEED_MIN,
                GAME_CONFIG.ASTEROID_SPEED_MAX
            );

        this.fast = Boolean(options.fast);
        this.maxLife = this.fast ? 8.5 : 15;

        this.rotationSpeedX = (Math.random() - 0.5) * 2.5;
        this.rotationSpeedY = (Math.random() - 0.5) * 2.5;
        this.rotationSpeedZ = (Math.random() - 0.5) * 2.5;

        this.createRock();
        this.group.position.copy(position);
        this.group.scale.setScalar(this.scaleFactor);

        const baseAxis = new THREE.Vector3(1, 0, 0);
        this.group.quaternion.setFromUnitVectors(baseAxis, this.direction);

        if (this.fast) {
            this.createFastGlow();
        }
    }

    createRock() {
        const core = new THREE.Mesh(SHARED_CORE_GEOMETRY, SHARED_ROCK_MATERIAL);
        core.scale.set(
            1.0,
            0.85 + Math.random() * 0.4,
            0.8 + Math.random() * 0.5
        );
        this.group.add(core);

        const chunks = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < chunks; i++) {
            const chunk = new THREE.Mesh(
                SHARED_CHUNK_GEOMETRY,
                i % 2 === 0 ? SHARED_ROCK_MATERIAL : SHARED_DARK_MATERIAL
            );

            chunk.position.set(
                (Math.random() - 0.5) * 1.2,
                (Math.random() - 0.5) * 1.0,
                (Math.random() - 0.5) * 1.1
            );

            chunk.scale.setScalar(0.35 + Math.random() * 0.45);
            chunk.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            this.group.add(chunk);
        }
    }

    createFastGlow() {
        const cone = new THREE.Mesh(SHARED_FAST_CONE_GEOMETRY, SHARED_FAST_GLOW_MATERIAL);
        cone.rotation.z = Math.PI / 2;
        cone.position.x = -1.2;
        this.group.add(cone);

        const pointLight = new THREE.PointLight(0x66eaff, 1.2, 22);
        pointLight.position.x = -0.5;
        this.group.add(pointLight);

        this.fastCone = cone;
    }

    update(deltaTime) {
        this.time += deltaTime;

        this.group.position.addScaledVector(
            this.direction,
            this.forwardSpeed * deltaTime
        );

        this.group.rotation.x += this.rotationSpeedX * deltaTime;
        this.group.rotation.y += this.rotationSpeedY * deltaTime;
        this.group.rotation.z += this.rotationSpeedZ * deltaTime;

        if (this.fastCone) {
            const pulse = 1 + Math.sin(this.time * 22.0) * 0.06;
            this.fastCone.scale.set(pulse, pulse, pulse);
        }
    }

    isExpired() {
        return this.time > this.maxLife;
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
}