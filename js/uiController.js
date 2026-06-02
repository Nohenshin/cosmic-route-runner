import { gameData } from "./utils/gameData.js";
import { GAME_STATE } from "./utils/gameState.js";
import { GAME_CONFIG } from "./config.js";

export class UIController {
    constructor(onRestart) {
        this.onRestart = onRestart;
        this.createHUD();
        this.createOverlay();

        window.addEventListener("keydown", (event) => {
            if (event.code === "KeyR") {
                if (
                    gameData.state === GAME_STATE.WIN ||
                    gameData.state === GAME_STATE.GAME_OVER
                ) {
                    if (typeof this.onRestart === "function") {
                        this.onRestart();
                    }
                }
            }
        });
    }

    createHUD() {
        this.container = document.createElement("div");
        this.container.style.position = "fixed";
        this.container.style.top = "0";
        this.container.style.left = "0";
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        this.container.style.zIndex = "100";
        this.container.style.pointerEvents = "none";
        this.container.style.color = "white";
        this.container.style.fontFamily = "Arial, sans-serif";
        document.body.appendChild(this.container);

        this.fuelText = document.createElement("div");
        this.fuelText.style.position = "absolute";
        this.fuelText.style.top = "20px";
        this.fuelText.style.left = "20px";
        this.fuelText.style.fontSize = "18px";
        this.container.appendChild(this.fuelText);

        this.timerText = document.createElement("div");
        this.timerText.style.position = "absolute";
        this.timerText.style.top = "48px";
        this.timerText.style.left = "20px";
        this.timerText.style.fontSize = "18px";
        this.container.appendChild(this.timerText);

        this.boostText = document.createElement("div");
        this.boostText.style.position = "absolute";
        this.boostText.style.top = "76px";
        this.boostText.style.left = "20px";
        this.boostText.style.fontSize = "18px";
        this.container.appendChild(this.boostText);

        this.healthText = document.createElement("div");
        this.healthText.style.position = "absolute";
        this.healthText.style.top = "104px";
        this.healthText.style.left = "20px";
        this.healthText.style.fontSize = "18px";
        this.container.appendChild(this.healthText);

        this.fuelBarOuter = document.createElement("div");
        this.fuelBarOuter.style.position = "absolute";
        this.fuelBarOuter.style.top = "138px";
        this.fuelBarOuter.style.left = "20px";
        this.fuelBarOuter.style.width = "220px";
        this.fuelBarOuter.style.height = "14px";
        this.fuelBarOuter.style.border = "1px solid rgba(255,255,255,0.7)";
        this.fuelBarOuter.style.borderRadius = "999px";
        this.fuelBarOuter.style.overflow = "hidden";
        this.container.appendChild(this.fuelBarOuter);

        this.fuelBarInner = document.createElement("div");
        this.fuelBarInner.style.width = "100%";
        this.fuelBarInner.style.height = "100%";
        this.fuelBarInner.style.background = "linear-gradient(90deg, #3cff7a, #d8ff4f)";
        this.fuelBarOuter.appendChild(this.fuelBarInner);

        this.healthBarOuter = document.createElement("div");
        this.healthBarOuter.style.position = "absolute";
        this.healthBarOuter.style.top = "166px";
        this.healthBarOuter.style.left = "20px";
        this.healthBarOuter.style.width = "220px";
        this.healthBarOuter.style.height = "14px";
        this.healthBarOuter.style.border = "1px solid rgba(255,255,255,0.7)";
        this.healthBarOuter.style.borderRadius = "999px";
        this.healthBarOuter.style.overflow = "hidden";
        this.container.appendChild(this.healthBarOuter);

        this.healthBarInner = document.createElement("div");
        this.healthBarInner.style.width = "100%";
        this.healthBarInner.style.height = "100%";
        this.healthBarInner.style.background = "linear-gradient(90deg, #ff5b5b, #ff2e88)";
        this.healthBarOuter.appendChild(this.healthBarInner);

        this.helpText = document.createElement("div");
        this.helpText.style.position = "absolute";
        this.helpText.style.bottom = "20px";
        this.helpText.style.left = "20px";
        this.helpText.style.fontSize = "16px";
        this.helpText.style.opacity = "0.85";
        this.helpText.textContent = "WASD / Arrow keys: move | Space: boost | T: pause | R: restart";
        this.container.appendChild(this.helpText);
    }

    createOverlay() {
        this.overlay = document.createElement("div");
        this.overlay.style.position = "fixed";
        this.overlay.style.inset = "0";
        this.overlay.style.display = "none";
        this.overlay.style.zIndex = "200";
        this.overlay.style.alignItems = "center";
        this.overlay.style.justifyContent = "center";
        this.overlay.style.background = "rgba(0,0,0,0.65)";
        this.overlay.style.color = "white";
        this.overlay.style.fontFamily = "Arial, sans-serif";
        this.overlay.style.pointerEvents = "auto";
        document.body.appendChild(this.overlay);

        this.panel = document.createElement("div");
        this.panel.style.minWidth = "360px";
        this.panel.style.padding = "28px 34px";
        this.panel.style.border = "1px solid rgba(255,255,255,0.2)";
        this.panel.style.borderRadius = "18px";
        this.panel.style.background = "rgba(10,10,20,0.92)";
        this.panel.style.textAlign = "center";
        this.overlay.appendChild(this.panel);

        this.title = document.createElement("h2");
        this.title.style.margin = "0 0 12px";
        this.title.style.fontSize = "30px";
        this.panel.appendChild(this.title);

        this.message = document.createElement("div");
        this.message.style.fontSize = "18px";
        this.message.style.lineHeight = "1.6";
        this.message.style.marginBottom = "18px";
        this.panel.appendChild(this.message);

        this.restartHint = document.createElement("div");
        this.restartHint.style.fontSize = "15px";
        this.restartHint.style.opacity = "0.8";
        this.restartHint.textContent = "Press R to restart";
        this.panel.appendChild(this.restartHint);
    }

    showEndScreen(title, message) {
        this.title.textContent = title;
        this.message.textContent = message;
        this.overlay.style.display = "flex";
    }

    hideEndScreen() {
        this.overlay.style.display = "none";
    }

    update() {
        const timeLeft = Math.max(0, GAME_CONFIG.GAME_DURATION - gameData.elapsedTime);

        this.fuelText.textContent = `Fuel: ${gameData.fuel.toFixed(0)}%`;
        this.timerText.textContent = `Time Left: ${timeLeft.toFixed(1)}s`;

        if (gameData.boostCooldown > 0) {
            this.boostText.textContent = `Boost Cooldown: ${gameData.boostCooldown.toFixed(1)}s`;
        } else if (gameData.boostActive) {
            this.boostText.textContent = `Boost Active: ${gameData.boostRemaining.toFixed(1)}s`;
        } else {
            this.boostText.textContent = "Boost Ready";
        }

        this.healthText.textContent = `Health: ${gameData.health}/${gameData.maxHealth}`;

        const fuelPercent = Math.max(0, Math.min(100, gameData.fuel));
        this.fuelBarInner.style.width = `${fuelPercent}%`;

        if (fuelPercent > 60) {
            this.fuelBarInner.style.background = "linear-gradient(90deg, #3cff7a, #d8ff4f)";
        } else if (fuelPercent > 25) {
            this.fuelBarInner.style.background = "linear-gradient(90deg, #ffd84a, #ff9f1a)";
        } else {
            this.fuelBarInner.style.background = "linear-gradient(90deg, #ff5b5b, #ff2e88)";
        }

        const healthPercent = (gameData.health / gameData.maxHealth) * 100;
        this.healthBarInner.style.width = `${healthPercent}%`;

        if (healthPercent > 60) {
            this.healthBarInner.style.background = "linear-gradient(90deg, #50d05f, #3cff7a)";
        } else if (healthPercent > 30) {
            this.healthBarInner.style.background = "linear-gradient(90deg, #ffd84a, #ff9f1a)";
        } else {
            this.healthBarInner.style.background = "linear-gradient(90deg, #ff5b5b, #ff2e88)";
        }
    }

    showPauseScreen() {
        this.title.textContent = "PAUSED";
        this.message.textContent = "Game paused. Press T to resume.";
        this.restartHint.textContent = "Press R to restart";
        this.overlay.style.display = "flex";
    }

    hidePauseScreen() {
        this.overlay.style.display = "none";
    }
}