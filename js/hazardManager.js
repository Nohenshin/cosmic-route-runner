import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { GAME_CONFIG } from "./config.js";

export class HazardManager {
    constructor(planets = [], blackHole = null, quasar = null) {
        this.planets = planets;
        this.blackHole = blackHole;
        this.quasar = quasar;
    }

    applyHazards(ship, routeManager, deltaTime, boostActive = false) {
        const shipPos = ship.getPosition();
        const shipProgress = ship.getProgress();
        const frame = routeManager.getFrameAt(shipProgress);

        let dangerHit = false;

        const applyPull = (sourcePos, strength, influenceRadius) => {
            const rel = sourcePos.clone().sub(shipPos);
            const dist = rel.length();

            if (dist < 0.0001 || dist > influenceRadius) return 0;

            const dir = rel.normalize();
            const amount = (1 - dist / influenceRadius) * strength * deltaTime;

            const pullRight = dir.dot(frame.right);
            const pullUp = dir.dot(frame.up);

            ship.addLocalOffset(
                pullRight * amount * 1.8,
                pullUp * amount * 1.8
            );

            return dist;
        };

        for (const planet of this.planets) {
            const dist = applyPull(
                planet.getPosition(),
                GAME_CONFIG.PLANET_GRAVITY_STRENGTH,
                planet.getInfluenceRadius()
            );

            // Chỉ thua nếu thật sự chui vào lõi
            if (dist > 0 && dist <= planet.getRadius() * 0.9) {
                dangerHit = true;
            }
        }

        if (this.blackHole) {
            const dist = applyPull(
                this.blackHole.getPosition(),
                GAME_CONFIG.BLACKHOLE_GRAVITY_STRENGTH,
                this.blackHole.getGravityRadius()
            );

            // Khi boost, không bị damage từ black hole
            if (dist > 0 && dist <= this.blackHole.getRadius() * 0.95 && !boostActive) {
                dangerHit = true;
            }
        }

        if (this.quasar) {
            const qPos = this.quasar.getPosition();
            const dist = shipPos.distanceTo(qPos);

            if (dist <= this.quasar.getHazardRadius() * 0.78) {
                dangerHit = true;
            }
        }

        return dangerHit;
    }
}