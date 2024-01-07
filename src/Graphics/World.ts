import { generateIsland } from "World/WorldGen";
import RenderFrame, { BoundingBox, FrameChange, FramePixel } from "./RenderFrame";

export default class World {
    constructor(
        protected renderFrame: RenderFrame
    ) {

    }

    get boundingBox(): BoundingBox {
        return {
            start: [0, 0],
            dimensions: [this.renderFrame.width, this.renderFrame.height],
        }
    }

    getGraphics(): FrameChange {
        const height = this.renderFrame.height;
        const width = this.renderFrame.width;
        const world: FramePixel[][] = [];
        for (let y = 0; y < height; y++) {
            const line: FramePixel[] = [];
            for (let x = 0; x < width; x++) {
                line.push({
                    renderable: this,
                    char: 'W',
                    color: 'water',
                })
            }
            world.push(line);
        }
        const smaller = Math.min(height, width) - 2;
        if (smaller > 4) {
            const island = generateIsland(smaller);
            const startY = Math.floor(height / 2 - smaller / 2);
            const startX = Math.floor(width / 2 - smaller / 2);
            for (let y = 0; y < smaller; y++) {
                for (let x = 0; x < smaller; x++) {
                    if (island[y][x]) {
                        world[startY + y][startX + x] = {
                            renderable: this,
                            char: '.',
                            color: 'sand',
                        };
                    }
                }
            }
        }
        return {
            pixels: world,
            start: [0, 0],
            dimensions: [width, height],
        };
    }
}
