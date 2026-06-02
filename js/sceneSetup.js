import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createScene() {
    const scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('./assets/textures/space_bg.jpg');
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    scene.background = bgTexture;
    
    scene.fog = new THREE.FogExp2(0x040816, 0.0009);

    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        4000
    );

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    document.body.appendChild(renderer.domElement);

    return renderer;
}

export function createLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x9fd7ff, 0x05050d, 0.75);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.95);
    directionalLight.position.set(8, 14, 10);
    scene.add(directionalLight);

    const blueFillLight = new THREE.PointLight(0x3bdcff, 5, 450);
    blueFillLight.position.set(0, 20, -120);
    scene.add(blueFillLight);
}