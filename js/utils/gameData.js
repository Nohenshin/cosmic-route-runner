import { GAME_STATE } from "./gameState.js";

export const gameData = {
    fuel: 100,
    elapsedTime: 0,
    score: 0,
    state: GAME_STATE.MENU,
    boostCooldown: 0,
    boostActive: false,
    boostRemaining: 0,
    gameOverReason: "",
    winReason: "",
    health: 10,
    maxHealth: 10,
    damagedAsteroids: new Set()
};