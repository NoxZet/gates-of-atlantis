function distanceToEdge(size: number, x: number, y: number) {
    const middle = Math.floor(size / 2);
    const circleDist = middle - Math.sqrt(Math.pow(x - middle, 2) + Math.pow(y - middle, 2));
    return (Math.min(x, y, size - x - 1, size - y - 1) + circleDist) / 2;
}

function randomChoose<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateIsland(width: number, height: number): boolean[][] {
    const island: number[][] = [];
    for (let i = 0; i < height; i++) {
        island.push(Array<number>(width).fill(NaN));
    }
    const size: number = Math.max(width, height);
    const middle = Math.floor(size / 2);
    const middleY = Math.floor(height / 2);
    const middleX = Math.floor(width / 2);
    island[middleY][middleX] = middle;
    // If one dimension is smaller, we want the pixel to fall off faster to reach shore value sooner
    const xCoeff = middle / middleX;
    const yCoeff = middle / middleY;
    for (let i = 1; i <= middle; i++) {
        // Grow to cardinal directions
        for (let [xoff, yoff] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const targetX = middleX + i * xoff;
            const targetY = middleY + i * yoff;
            if (distanceToEdge(middle * 2, targetX * xCoeff, targetY * yCoeff) < 0) {
                continue;
            }
            const coeff = (Math.abs(xoff * xCoeff) + Math.abs(yoff * yCoeff))
            const source = island[middleY + (i - 1) * yoff][middleX + (i - 1) * xoff];
            const target = Math.min(
                // We transform the dimensions to a square
                distanceToEdge(middle * 2, targetX * xCoeff, targetY * yCoeff) * 1.3 + 0.01,
                source + randomChoose([1.3, -2.55]) * coeff
            );
            island[targetY][targetX] = target;
        }
        // Grow the other points using the two neighbors
        for (let [xoff2m, yoff2m, max] of [[1, -1, i - 1], [-1, 1, i]]) {
            for (let [xoff, yoff] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                const coeff = (Math.abs(xoff * xCoeff) + Math.abs(yoff * yCoeff))
                for (let j = 1; j <= max; j++) {
                    const targetX = middleX + i * xoff + j * xoff2m * yoff;
                    const targetY = middleY + i * yoff + j * yoff2m * xoff;
                    if (distanceToEdge(middle * 2, targetX * xCoeff, targetY * yCoeff) < 0) {
                        continue;
                    }
                    // Avarge out both neighbors along x and y axis (there's always exactly 2)
                    const source = (
                        island[middleY + i * yoff + (j - 1) * yoff2m * xoff][middleX + i * xoff + (j - 1) * xoff2m * yoff]
                        + island[middleY + (i - 1) * yoff + j * yoff2m * xoff][middleX + (i - 1) * xoff + j * xoff2m * yoff]
                    ) / 2;
                    const target = Math.min(
                        distanceToEdge(size, targetX * xCoeff, targetY * yCoeff) * 1.3 + 0.01,
                        source + randomChoose([1.0, -2.15]) * coeff
                    );
                    island[targetY][targetX] = target;
                }
            }
        }
    }
    return island.map(a => a.map(b => !isNaN(b) && b > 0));
}
