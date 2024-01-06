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
        const topLine = Math.floor(height / 2) - 4;
        const bottomLine = Math.floor(height / 2) + 4;
        const world: FramePixel[][] = [];
        for (let y = 0; y < height; y++) {
            const line: FramePixel[] = [];
            for (let x = 0; x < width; x++) {
                line.push({
                    renderable: this,
                    char: 'O',
                    color: 'water',
                })
            }
            world.push(line);
        }
        return {
            pixels: world,
            start: [0, 0],
            dimensions: [width, height],
        };
    }
}
