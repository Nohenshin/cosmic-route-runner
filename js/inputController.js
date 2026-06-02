export class InputController {

    constructor() {

        this.keys = {};
        this.keysProcessed = {};

        window.addEventListener(
            "keydown",
            (event) => {
                if (!this.keys[event.code]) {
                    this.keys[event.code] = true;
                    this.keysProcessed[event.code] = false;
                }
            }
        );

        window.addEventListener(
            "keyup",
            (event) => {
                this.keys[event.code] = false;
                this.keysProcessed[event.code] = false;
            }
        );
    }

    isPressed(key) {
        return this.keys[key];
    }

    isKeyPressedOnce(key) {
        if (this.keys[key] && !this.keysProcessed[key]) {
            this.keysProcessed[key] = true;
            return true;
        }
        return false;
    }

    isBoostPressed() {
        return this.isPressed("Space");
    }

    isReloadPressed() {
        return this.isKeyPressedOnce("KeyR");
    }

    isPausePressed() {
        return this.isKeyPressedOnce("KeyT");
    }

}