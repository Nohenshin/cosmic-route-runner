export const GAME_CONFIG = {
    // =====================
    // GAME
    // =====================
    GAME_DURATION: 60,
    START_FUEL: 100,
    MAX_FUEL: 100,

    // =====================
    // SHIP
    // =====================
    SHIP_SPEED: 16,
    SHIP_FORWARD_SPEED: 12.5,
    BOOST_FORWARD_MULTIPLIER: 1.9,
    SHIP_MOVE_LIMIT_X: 16,
    SHIP_MOVE_LIMIT_Y: 10,
    SHIP_RADIUS: 1.1,

    // =====================
    // BOOST
    // =====================
    FUEL_DRAIN_RATE: 0.26,
    BOOST_FUEL_COST: 14,
    BOOST_DURATION: 2.2,
    BOOST_COOLDOWN: 5,

    // =====================
    // SPAWN
    // =====================
    ASTEROID_INTERVAL: 0.68,
    ASTEROID_BATCH_MIN: 2,
    ASTEROID_BATCH_MAX: 3,
    FAST_ASTEROID_CHANCE: 0.22,
    EXTREME_ASTEROID_CHANCE: 0.12,

    ASTEROID_SPEED_MIN: 18,
    ASTEROID_SPEED_MAX: 34,

    FAST_ASTEROID_SPEED_MIN: 60,
    FAST_ASTEROID_SPEED_MAX: 105,

    EXTREME_ASTEROID_SPEED_MIN: 130,
    EXTREME_ASTEROID_SPEED_MAX: 180,

    ASTEROID_SPAWN_AHEAD_MIN: 0.03,
    ASTEROID_SPAWN_AHEAD_MAX: 0.11,
    ASTEROID_SPAWN_X_RANGE: 8,
    ASTEROID_SPAWN_Y_RANGE: 5,

    ASTEROID_MIN_SCALE: 0.7,
    ASTEROID_MAX_SCALE: 2.0,
    ASTEROID_RADIUS: 1.5,

    // =====================
    // COLLISION / HAZARD
    // =====================
    PLANET_GRAVITY_STRENGTH: 18,
    PLANET_INFLUENCE_MULTIPLIER: 2.8,

    BLACKHOLE_GRAVITY_STRENGTH: 45,
    BLACKHOLE_INFLUENCE_MULTIPLIER: 4.5,

    QUASAR_HAZARD_MULTIPLIER: 4.0,

    HAZARD_PULL_LIMIT: 25,
    HAZARD_DAMAGE_DISTANCE: 1.2,

    // =====================
    // WIN
    // =====================
    EARTH_RADIUS: 6,
    SHOW_ROUTE: false,
};