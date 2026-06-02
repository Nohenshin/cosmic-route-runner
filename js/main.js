import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

import {
    createScene,
    createCamera,
    createRenderer,
    createLights
} from "./sceneSetup.js";

import { GAME_CONFIG } from "./config.js";
import { gameData } from "./utils/gameData.js";
import { GAME_STATE } from "./utils/gameState.js";
import { Ship } from "./objects/ship.js";
import { InputController } from "./inputController.js";
import { SpawnManager } from "./spawnManager.js";
import { checkShipAsteroids } from "./collisionManager.js";
import { StarField } from "./objects/starField.js";
import { Planet } from "./objects/planet.js";
import { BlackHole } from "./objects/blackHole.js";
import { Quasar } from "./objects/quasar.js";
import { HazardManager } from "./hazardManager.js";
import { textures } from "./utils/textureManager.js";
import { UIController } from "./uiController.js";
import { Earth } from "./objects/earth.js";
import { RouteManager } from "./routeManager.js";
import { Sun } from "./objects/sun.js";
import { Asteroid } from "./objects/asteroid.js";
import { Jupiter } from "./objects/jupiter.js";
import { Neptune } from "./objects/neptune.js";

// Scene
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
createLights(scene);

// Route
const routeManager = new RouteManager(scene);

// World objects
// World objects
const starField = new StarField(1200,1200);
scene.add(starField.getMesh());

const sun1 = new Sun(
    routeManager.makeWorldPosition(0.10, 0, 24),
    18
);

const planet1 = new Planet(
    routeManager.makeWorldPosition(0.18, -14, 8),
    8,
    textures.planetBlue
);

const planet2 = new Planet(
    routeManager.makeWorldPosition(0.28, 18, -8),
    7,
    textures.planetRed
);

const jupiter = new Jupiter(
    routeManager.makeWorldPosition(0.40, -22, 14),
    6.5
);

const planet4 = new Planet(
    routeManager.makeWorldPosition(0.56, 20, 10),
    7.5,
    textures.planetBlue
);

const sun2 = new Sun(
    routeManager.makeWorldPosition(0.60, -16, 30),
    9
);

const planet3 = new Planet(
    routeManager.makeWorldPosition(0.70, -20, 12),
    7.2,
    textures.planetRed
);

const planet5 = new Planet(
    routeManager.makeWorldPosition(0.78, 22, -10),
    6.8,
    textures.planetBlue
);

const neptune = new Neptune(
    routeManager.makeWorldPosition(0.82, -24, 16),
    5.2
);

const blackHole = new BlackHole(
    routeManager.makeWorldPosition(0.88, -30, 22),
    24
);

const quasar = new Quasar(
    routeManager.makeWorldPosition(0.92, 28, -20),
    5.5
);

const earth = new Earth(
    routeManager.makeWorldPosition(0.995, 0, 0)
);

scene.add(sun1.getMesh());
scene.add(planet1.getMesh());
scene.add(planet2.getMesh());
scene.add(jupiter.getMesh());
scene.add(planet4.getMesh());
scene.add(sun2.getMesh());
scene.add(planet3.getMesh());
scene.add(planet5.getMesh());
scene.add(neptune.getMesh());
scene.add(blackHole.getMesh());
scene.add(quasar.getMesh());
scene.add(earth.getMesh());

// Controllers
const input = new InputController();
const ship = new Ship();
const spawnManager = new SpawnManager(scene, routeManager);
const hazardManager = new HazardManager([planet1, planet2, jupiter, planet4, planet3, planet5, neptune], blackHole, quasar);

scene.add(ship.getMesh());

// UI
const ui = new UIController(resetGame);

// Start game
gameData.state = GAME_STATE.PLAYING;

// Clock
const clock = new THREE.Clock();

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function endGame(reason, state) {
    gameData.state = state;

    if (state === GAME_STATE.GAME_OVER) {
        gameData.gameOverReason = reason;
        ui.showEndScreen("GAME OVER", reason);
    } else if (state === GAME_STATE.WIN) {
        gameData.winReason = reason;
        ui.showEndScreen("MISSION COMPLETE", reason);
    }
}

function resetGame() {
    gameData.fuel = GAME_CONFIG.START_FUEL;
    gameData.elapsedTime = 0;
    gameData.score = 0;
    gameData.boostCooldown = 0;
    gameData.boostActive = false;
    gameData.boostRemaining = 0;
    gameData.gameOverReason = "";
    gameData.winReason = "";
    gameData.health = gameData.maxHealth;
    gameData.damagedAsteroids.clear();
    gameData.state = GAME_STATE.PLAYING;

    Asteroid.idCounter = 0;
    ship.reset();
    spawnManager.clear();
    ui.hideEndScreen();

    const startFrame = routeManager.getFrameAt(0.001);
    camera.position.set(
        startFrame.point.x,
        startFrame.point.y + 2.5,
        startFrame.point.z + 8
    );
    camera.lookAt(startFrame.point);

    ship.syncToRoute(routeManager);
}

// Update
function update(deltaTime) {
    if (gameData.state !== GAME_STATE.PLAYING) {
        return;
    }

    gameData.elapsedTime += deltaTime;

    if (gameData.elapsedTime >= GAME_CONFIG.GAME_DURATION) {
        gameData.elapsedTime = GAME_CONFIG.GAME_DURATION;
        endGame("Hết thời gian", GAME_STATE.GAME_OVER);
        return;
    }

    gameData.fuel -= GAME_CONFIG.FUEL_DRAIN_RATE * deltaTime;
    if (gameData.fuel <= 0) {
        gameData.fuel = 0;
        endGame("Hết nhiên liệu", GAME_STATE.GAME_OVER);
        return;
    }

    // Xử lý pause
    if (input.isPausePressed()) {
        if (gameData.state === GAME_STATE.PLAYING) {
            gameData.state = GAME_STATE.PAUSED;
            ui.showPauseScreen();
        } else if (gameData.state === GAME_STATE.PAUSED) {
            gameData.state = GAME_STATE.PLAYING;
            ui.hidePauseScreen();
        }
    }

    // Xử lý reload
    if (input.isReloadPressed()) {
        if (gameData.state === GAME_STATE.GAME_OVER || gameData.state === GAME_STATE.WIN) {
            resetGame();
            init();
            return;
        }
    }

    if (gameData.state !== GAME_STATE.PLAYING) {
        return;
    }

    if (
        input.isBoostPressed() &&
        gameData.boostCooldown <= 0 &&
        gameData.fuel > GAME_CONFIG.BOOST_FUEL_COST
    ) {
        gameData.boostActive = true;
        gameData.boostRemaining = GAME_CONFIG.BOOST_DURATION;
        gameData.boostCooldown = GAME_CONFIG.BOOST_COOLDOWN;
        gameData.fuel -= GAME_CONFIG.BOOST_FUEL_COST;
    }

    if (gameData.boostCooldown > 0) {
        gameData.boostCooldown -= deltaTime;
        if (gameData.boostCooldown < 0) {
            gameData.boostCooldown = 0;
        }
    }

    if (gameData.boostActive) {
        gameData.boostRemaining -= deltaTime;
        if (gameData.boostRemaining <= 0) {
            gameData.boostActive = false;
            gameData.boostRemaining = 0;
        }
    }

    let dx = 0;
    let dy = 0;

    if (input.isPressed("ArrowLeft") || input.isPressed("KeyA")) dx -= 1;
    if (input.isPressed("ArrowRight") || input.isPressed("KeyD")) dx += 1;
    if (input.isPressed("ArrowUp") || input.isPressed("KeyW")) dy += 1;
    if (input.isPressed("ArrowDown") || input.isPressed("KeyS")) dy -= 1;

    ship.move(dx, dy, deltaTime);
    ship.advance(deltaTime, routeManager, gameData.boostActive);
    ship.syncToRoute(routeManager);
    ship.update(deltaTime);

    const hazardHit = hazardManager.applyHazards(ship, routeManager, deltaTime, gameData.boostActive);
    if (hazardHit) {
        endGame("Rơi vào vùng nguy hiểm", GAME_STATE.GAME_OVER);
        return;
    }

    const shipPos = ship.getPosition();
    const shipFrame = routeManager.getFrameAt(ship.getProgress());

    const desiredCameraPos = shipPos
        .clone()
        .addScaledVector(shipFrame.tangent, -14)
        .addScaledVector(shipFrame.up, 5);

    camera.position.lerp(desiredCameraPos, 0.08);
    camera.lookAt(
        shipPos.clone().addScaledVector(shipFrame.tangent, 8)
    );

    starField.update(deltaTime);
    sun1.update(deltaTime);
    planet1.update(deltaTime);
    planet2.update(deltaTime);
    jupiter.update(deltaTime);
    planet4.update(deltaTime);
    sun2.update(deltaTime);
    planet3.update(deltaTime);
    planet5.update(deltaTime);
    neptune.update(deltaTime);
    blackHole.update(deltaTime);
    quasar.update(deltaTime);
    earth.update(deltaTime);

    spawnManager.update(deltaTime, ship.getProgress(), shipPos, shipFrame, ship.getLocalOffset());

    const shipCollision = checkShipAsteroids(ship, spawnManager.getAsteroids());
    if (shipCollision.hit && shipCollision.asteroid) {
        const asteroidId = shipCollision.asteroid.id;
        if (!gameData.damagedAsteroids.has(asteroidId)) {
            gameData.damagedAsteroids.add(asteroidId);
            gameData.health -= 1;
            
            if (gameData.health <= 0) {
                gameData.health = 0;
                endGame("Tàu bị phá hủy", GAME_STATE.GAME_OVER);
                return;
            }
        }
    }

    const earthDistance = shipPos.distanceTo(earth.getPosition());
    if (earthDistance <= GAME_CONFIG.EARTH_RADIUS + ship.getRadius()) {
        endGame("Đã đến Trái Đất", GAME_STATE.WIN);
        return;
    }

    ui.update();
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    update(deltaTime);
    renderer.render(scene, camera);
}

animate();