import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

let rockTextureCache = null;
let blackHoleDiskTextureCache = null;
let quasarCoreTextureCache = null;
const glowTextureCache = new Map();

function rgba(hex, alpha = 1) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function makeCanvasTexture(size, drawFn) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    drawFn(ctx, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
}

export function getRockTexture() {
    if (rockTextureCache) return rockTextureCache;

    rockTextureCache = makeCanvasTexture(1024, (ctx, size) => {
        const base = ctx.createLinearGradient(0, 0, size, size);
        base.addColorStop(0, "#7a6f63");
        base.addColorStop(0.5, "#554b42");
        base.addColorStop(1, "#3d3731");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, size, size);

        for (let i = 0; i < 1800; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = Math.random() * 7 + 1;
            const a = Math.random() * 0.22 + 0.03;
            const c = Math.random() > 0.5 ? 0x8c7b6c : 0x2e2722;
            ctx.fillStyle = rgba(c, a);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 0; i < 90; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const w = 20 + Math.random() * 80;
            const h = 2 + Math.random() * 10;
            const angle = Math.random() * Math.PI * 2;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
            ctx.fillRect(-w / 2, -h / 2, w, h);
            ctx.restore();
        }
    });

    return rockTextureCache;
}

export function getBlackHoleDiskTexture() {
    if (blackHoleDiskTextureCache) return blackHoleDiskTextureCache;

    blackHoleDiskTextureCache = makeCanvasTexture(1024, (ctx, size) => {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, size, size);

        const center = size / 2;
        const outerR = size * 0.48;
        const innerR = size * 0.18;

        const bg = ctx.createRadialGradient(center, center, 0, center, center, outerR);
        bg.addColorStop(0, "rgba(0,0,0,1)");
        bg.addColorStop(0.4, "rgba(8,8,18,1)");
        bg.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);

        ctx.save();
        ctx.translate(center, center);

        for (let i = 0; i < 700; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = innerR + Math.random() * (outerR - innerR);
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r * 0.42;

            const isHot = Math.random() > 0.62;
            ctx.fillStyle = isHot
                ? `rgba(80, 210, 255, ${Math.random() * 0.35 + 0.08})`
                : `rgba(174, 89, 255, ${Math.random() * 0.25 + 0.05})`;

            ctx.beginPath();
            ctx.arc(x, y, 2 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fill();
        }

        const ring = ctx.createRadialGradient(0, 0, innerR * 0.8, 0, 0, outerR);
        ring.addColorStop(0, "rgba(0,0,0,0)");
        ring.addColorStop(0.45, "rgba(120,80,255,0.1)");
        ring.addColorStop(0.7, "rgba(70,170,255,0.22)");
        ring.addColorStop(1, "rgba(255,140,0,0)");
        ctx.fillStyle = ring;
        ctx.fillRect(-outerR, -outerR, outerR * 2, outerR * 2);

        ctx.restore();
    });

    return blackHoleDiskTextureCache;
}

export function getQuasarCoreTexture() {
    if (quasarCoreTextureCache) return quasarCoreTextureCache;

    quasarCoreTextureCache = makeCanvasTexture(1024, (ctx, size) => {
        const cx = size / 2;
        const cy = size / 2;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.12, "rgba(255,255,255,1)");
        g.addColorStop(0.25, "rgba(120,255,255,0.96)");
        g.addColorStop(0.55, "rgba(52,190,255,0.7)");
        g.addColorStop(0.82, "rgba(12,90,255,0.26)");
        g.addColorStop(1, "rgba(10,30,90,0)");

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);

        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const len = size * (0.15 + Math.random() * 0.25);
            const x2 = cx + Math.cos(angle) * len;
            const y2 = cy + Math.sin(angle) * len;

            const beam = ctx.createLinearGradient(cx, cy, x2, y2);
            beam.addColorStop(0, "rgba(255,255,255,0.95)");
            beam.addColorStop(0.3, "rgba(80,240,255,0.8)");
            beam.addColorStop(1, "rgba(80,240,255,0)");

            ctx.strokeStyle = beam;
            ctx.lineWidth = 4 + Math.random() * 8;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";
    });

    return quasarCoreTextureCache;
}

export function getRadialGlowTexture(innerHex, outerHex, size = 1024) {
    const key = `${innerHex}_${outerHex}_${size}`;
    if (glowTextureCache.has(key)) return glowTextureCache.get(key);

    const texture = makeCanvasTexture(size, (ctx, s) => {
        const cx = s / 2;
        const cy = s / 2;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s / 2);
        grad.addColorStop(0.0, rgba(innerHex, 1));
        grad.addColorStop(0.18, rgba(innerHex, 0.95));
        grad.addColorStop(0.45, rgba(outerHex, 0.55));
        grad.addColorStop(1.0, rgba(outerHex, 0.0));

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, s, s);
    });

    glowTextureCache.set(key, texture);
    return texture;
}