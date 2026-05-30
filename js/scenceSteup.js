import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createScene() {

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000000);

    return scene;
}

export function createCamera() {

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(0, 2, 8);

    return camera;
}

export function createRenderer() {

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        window.devicePixelRatio
    );

    document.body.appendChild(
        renderer.domElement
    );

    return renderer;
}

export function createLights(scene) {

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            2
        );

    scene.add(ambientLight);

    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );

    directionalLight.position.set(
        5,
        10,
        5
    );

    scene.add(directionalLight);
}