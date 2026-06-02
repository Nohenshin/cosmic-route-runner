import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { GAME_CONFIG } from "./config.js";
import { Asteroid } from "./objects/asteroid.js";

const MAX_ASTEROIDS = 40;

export class SpawnManager {
    constructor(scene, routeManager) {
        this.scene = scene;
        this.routeManager = routeManager;
        this.asteroids = [];
        this.spawnTimer = 0;
    }

    update(deltaTime, shipProgress, shipPosition, shipFrame, shipLocalOffset) {
        this.spawnTimer += deltaTime;

        const dynamicInterval = Math.max(
            0.18,
            GAME_CONFIG.ASTEROID_INTERVAL - shipProgress * 0.06
        );

        while (this.spawnTimer >= dynamicInterval) {
            this.spawnTimer -= dynamicInterval;
            this.spawnBatch(shipProgress, shipPosition, shipFrame, shipLocalOffset);

            if (this.asteroids.length >= MAX_ASTEROIDS) {
                break;
            }
        }

        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.update(deltaTime);

            const distanceToShip = asteroid.getPosition().distanceTo(shipPosition);

            if (asteroid.isExpired() || distanceToShip > 320) {
                this.scene.remove(asteroid.getMesh());
                this.asteroids.splice(i, 1);
            }
        }
    }

            spawnBatch(shipProgress, shipPosition, shipFrame, shipLocalOffset) {
            if (this.asteroids.length >= MAX_ASTEROIDS) return;

            const count = THREE.MathUtils.randInt(
                GAME_CONFIG.ASTEROID_BATCH_MIN,
                GAME_CONFIG.ASTEROID_BATCH_MAX
            );

            for (let i = 0; i < count; i++) {
                if (this.asteroids.length >= MAX_ASTEROIDS) break;

                const aheadDistance = THREE.MathUtils.randFloat(35, 95);

                const biasX = THREE.MathUtils.clamp(
                    shipLocalOffset.x / GAME_CONFIG.SHIP_MOVE_LIMIT_X,
                    -1,
                    1
                );

                const biasY = THREE.MathUtils.clamp(
                    shipLocalOffset.y / GAME_CONFIG.SHIP_MOVE_LIMIT_Y,
                    -1,
                    1
                );

                const position = shipPosition.clone()
                    .addScaledVector(shipFrame.tangent, aheadDistance)
                    .addScaledVector(shipFrame.right, THREE.MathUtils.randFloatSpread(10) + biasX * 8)
                    .addScaledVector(shipFrame.up, THREE.MathUtils.randFloatSpread(8) + biasY * 6);

                const roll = Math.random();
                let speed;
                let scale;
                let fast = false;

                if (roll < GAME_CONFIG.EXTREME_ASTEROID_CHANCE) {
                    speed = THREE.MathUtils.randFloat(
                        GAME_CONFIG.EXTREME_ASTEROID_SPEED_MIN,
                        GAME_CONFIG.EXTREME_ASTEROID_SPEED_MAX
                    );
                    scale = THREE.MathUtils.randFloat(0.45, 0.85);
                    fast = true;
                } else if (roll < GAME_CONFIG.EXTREME_ASTEROID_CHANCE + GAME_CONFIG.FAST_ASTEROID_CHANCE) {
                    speed = THREE.MathUtils.randFloat(
                        GAME_CONFIG.FAST_ASTEROID_SPEED_MIN,
                        GAME_CONFIG.FAST_ASTEROID_SPEED_MAX
                    );
                    scale = THREE.MathUtils.randFloat(0.7, 2.4);
                    fast = true;
                } else {
                    speed = THREE.MathUtils.randFloat(
                        GAME_CONFIG.ASTEROID_SPEED_MIN,
                        GAME_CONFIG.ASTEROID_SPEED_MAX
                    );
                    scale = THREE.MathUtils.randFloat(0.9, 3.0);
                }

                const direction = shipPosition.clone()
                    .sub(position)
                    .normalize();

                const asteroid = new Asteroid(position, {
                    speed,
                    direction,
                    fast,
                    scale
                });

                this.scene.add(asteroid.getMesh());
                this.asteroids.push(asteroid);
            }
        }

    getAsteroids() {
        return this.asteroids;
    }

    clear() {
        for (const asteroid of this.asteroids) {
            this.scene.remove(asteroid.getMesh());
        }

        this.asteroids = [];
        this.spawnTimer = 0;
    }
}