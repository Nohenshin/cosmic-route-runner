export function checkSphereCollision(posA, radiusA, posB, radiusB) {
    const dx = posA.x - posB.x;
    const dy = posA.y - posB.y;
    const dz = posA.z - posB.z;

    const distanceSquared = dx * dx + dy * dy + dz * dz;
    const radiusSum = radiusA + radiusB;

    return distanceSquared <= radiusSum * radiusSum;
}

export function checkShipAsteroids(ship, asteroids) {
    const shipPos = ship.getPosition();
    const shipRadius = ship.getRadius() * 0.75;

    for (const asteroid of asteroids) {
        const asteroidRadius = asteroid.getRadius() * 0.45;

        const hit = checkSphereCollision(
            shipPos,
            shipRadius,
            asteroid.getPosition(),
            asteroidRadius
        );

        if (hit) {
            return { asteroid, hit: true };
        }
    }

    return { asteroid: null, hit: false };
}