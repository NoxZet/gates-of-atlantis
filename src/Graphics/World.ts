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
        const islandHeight = Math.min(height, Math.floor(width / 1.5)) - 2;
        const islandWidth = Math.ceil(islandHeight * 1.5);
        if (islandHeight > 4) {
            const island = generateIsland(islandWidth, islandHeight);
            const startX = Math.floor(width / 2 - islandWidth / 2);
            const startY = Math.floor(height / 2 - islandHeight / 2);
            for (let y = 0; y < islandHeight; y++) {
                for (let x = 0; x < islandWidth; x++) {
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
