import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

const loader = new THREE.TextureLoader();

export const textures = {

    earth:
        loader.load(
            "./assets/textures/earth.jfif"
        ),

    planetRed:
        loader.load(
            "./assets/textures/planet_red.jfif"
        ),

    planetBlue:
        loader.load(
            "./assets/textures/planet_blue.jpg"
        ),

    asteroid:
        loader.load(
            "./assets/textures/asteroid.jfif"
        ),

    space:
        loader.load(
            "./assets/textures/space_bg.jpg"
        ),

    sun:
        loader.load(
            "./assets/textures/sun.jfif"
        )

};