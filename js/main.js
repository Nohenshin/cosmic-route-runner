import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

import {
    createScene,
    createCamera,
    createRenderer,
    createLights
}
from "./sceneSetup.js";

import { GAME_CONFIG } from "./config.js";

import { gameData } from "./utils/gameData.js";



// =====================
// Scene
// =====================

const scene = createScene();

const camera = createCamera();

const renderer = createRenderer();

createLights(scene);


// =====================
// Test Cube
// =====================

const cubeGeometry =
    new THREE.BoxGeometry(2, 2, 2);

const cubeMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x00ffcc
    });

const cube =
    new THREE.Mesh(
        cubeGeometry,
        cubeMaterial
    );

scene.add(cube);


// =====================
// Clock
// =====================

const clock = new THREE.Clock();


// =====================
// Resize
// =====================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// =====================
// Update
// =====================

function update(deltaTime) {

    gameData.elapsedTime += deltaTime;

    cube.rotation.x += deltaTime;

    cube.rotation.y += deltaTime;

}


// =====================
// Render Loop
// =====================

function animate() {

    requestAnimationFrame(
        animate
    );

    const deltaTime =
        clock.getDelta();

    update(deltaTime);

    renderer.render(
        scene,
        camera
    );

}

animate();