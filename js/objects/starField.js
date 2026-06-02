import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

function createStarTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");
    const cx = 128;
    const cy = 128;

    ctx.clearRect(0, 0, 256, 256);

    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 128);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(0.18, "rgba(255,255,255,0.95)");
    glow.addColorStop(0.35, "rgba(120,220,255,0.35)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 256, 256);

    ctx.save();
    ctx.translate(cx, cy);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 5; i++) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.moveTo(0, -90);
        ctx.lineTo(18, -28);
        ctx.lineTo(85, -28);
        ctx.lineTo(30, 10);
        ctx.lineTo(48, 78);
        ctx.lineTo(0, 36);
        ctx.lineTo(-48, 78);
        ctx.lineTo(-30, 10);
        ctx.lineTo(-85, -28);
        ctx.lineTo(-18, -28);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
    }

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

export class StarField {
    constructor(count = 260, spread = 1200) {
        this.group = new THREE.Group();
        this.stars = [];
        const starTexture = createStarTexture();

        for (let i = 0; i < count; i++) {
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: starTexture,
                    color: new THREE.Color().setHSL(
                        0.55 + Math.random() * 0.15,
                        0.4 + Math.random() * 0.3,
                        0.9 + Math.random() * 0.1
                    ),
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                })
            );

            const size = THREE.MathUtils.randFloat(2.5, 8.5);
            sprite.scale.set(size, size, 1);

            sprite.position.set(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread
            );

            sprite.userData.twinkleSpeed = THREE.MathUtils.randFloat(1.5, 4.5);
            sprite.userData.baseScale = size;
            this.group.add(sprite);
            this.stars.push(sprite);
        }
    }

    update(deltaTime) {
        for (const star of this.stars) {
            const s = star.userData.baseScale;
            const tw = 1 + Math.sin(performance.now() * 0.001 * star.userData.twinkleSpeed) * 0.12;
            star.scale.setScalar(s * tw);
        }
    }

    getMesh() {
        return this.group;
    }
}