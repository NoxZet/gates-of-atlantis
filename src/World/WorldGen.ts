function distanceToEdge(size: number, x: number, y: number) {
    const middle = Math.floor(size / 2);
    const circleDist = middle - Math.sqrt(Math.pow(x - middle, 2) + Math.pow(y - middle, 2));
    return (Math.min(x, y, size - x - 1, size - y - 1) + circleDist) / 2;
}

function randomChoose<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateIsland(size: number): boolean[][] {
    const island: number[][] = [];
    for (let i = 0; i < size; i++) {
        island.push(Array<number>(size).fill(NaN));
    }
    if (size % 2 === 0) {
        size--;
    }
    // Size is always odd
    const middle = Math.floor(size / 2);
    island[middle][middle] = middle;
    for (let i = 1; i <= middle; i++) {
        // Grow to cardinal directions
        for (let [xoff, yoff] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const source = island[middle + (i - 1) * yoff][middle + (i - 1) * xoff];
            const targetX = middle + i * xoff;
            const targetY = middle + i * yoff;
            const target = Math.min(distanceToEdge(size, targetX, targetY) * 1.3 + 0.01, source + randomChoose([1.3, -2.55]));
            island[targetY][targetX] = target;
        }
        // Grow the other points using the two neighbors
        for (let [xoff2m, yoff2m, max] of [[1, -1, i - 1], [-1, 1, i]]) {
            for (let [xoff, yoff] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                for (let j = 1; j <= max; j++) {
                    const source = (
                        island[middle + i * yoff + (j - 1) * yoff2m * xoff][middle + i * xoff + (j - 1) * xoff2m * yoff]
                        + island[middle + (i - 1) * yoff + j * yoff2m * xoff][middle + (i - 1) * xoff + j * xoff2m * yoff]
                    ) / 2;
                    const targetX = middle + i * xoff + j * xoff2m * yoff;
                    const targetY = middle + i * yoff + j * yoff2m * xoff;
                    const target = Math.min(distanceToEdge(size, targetX, targetY) * 1.3 + 0.01, source + randomChoose([1.0, -2.15]));
                    island[targetY][targetX] = target;
                }
            }
        }
    }
    return island.map(a => a.map(b => !isNaN(b) && b > 0));
}
