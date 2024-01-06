const characterWidth = 14;
const characterHeight = 20;

export type BoundingBox = {
    start: [number, number],
    dimensions: [number, number],
}

export type FramePixel = {
    renderable?: Renderable,
    char: string,
    color: string,
};

export type FrameChange = {
    pixels: FramePixel[][]
} & BoundingBox;

export declare class Renderable {
    getGraphics(): FrameChange;
    public readonly boundingBox: BoundingBox;
};

export default class RenderFrame {
    protected numberWidth: number = 0;
    protected numberHeight: number = 0;
    get width(): number {return this.numberWidth};
    get height(): number {return this.numberHeight};
    protected pixels: FramePixel[][] = [];
    protected root: HTMLDivElement;
    protected renderCanvas: HTMLCanvasElement;
    protected renderContext: CanvasRenderingContext2D;
    protected renderableInfo: Map<Renderable, {
        layer: number;
    }>;
    protected palette: Map<string, {fg: string, bg: string}> = new Map([
        ['water', {fg: 'white', bg: '#4298f5'}],
        ['empty', {fg: 'black', bg: 'black'}],
    ]);

    constructor() {
        window.addEventListener('resize', () => this.resizeFrame());
        this.root = document.getElementById('root') as HTMLDivElement;
        this.renderCanvas = document.createElement('canvas');
        this.renderContext = this.renderCanvas.getContext('2d')!;
        this.root.appendChild(this.renderCanvas);
        (window as any).inputEventHandler = (event: UIEvent) => this.handleEvent(event);
        this.resizeFrame();
    }

    attach(renderable: Renderable) {}

    renderableChange(renderable: Renderable, change: FrameChange) {
        for (let iy = 0; iy < change.dimensions[1]; iy++) {
            const ry = iy + change.start[1];
            if (ry >= 0 && ry < this.numberHeight) {
                for (let ix = 0; ix < change.dimensions[0]; ix++) {
                    const rx = ix + change.start[0];
                    if (rx >= 0 && rx < this.numberWidth) {
                        const pixel = change.pixels[iy][ix];
                        const colors = this.palette.get(pixel.color)
                        this.pixels[ry][rx] = pixel;
                        this.renderContext.fillStyle = colors?.bg ?? 'black';
                        this.renderContext.fillRect(
                            rx * characterWidth, ry * characterHeight,
                            characterWidth, characterHeight
                        );
                        if (pixel.char) {
                            this.renderContext.font = '14px "Courier", monospace';
                            this.renderContext.fillStyle = colors?.fg ?? 'white';
                            this.renderContext.fillText(pixel.char, rx * characterWidth + 1, (ry + 1) * characterHeight - 3);
                        }
                    }
                }
            }
        }
    }

    protected resizeFrame() {
        if (
            this.numberWidth === Math.floor(window.innerWidth / characterWidth)
            && this.numberWidth === Math.floor(window.innerWidth / characterWidth)
        ) {
            return;
        }
        function getEmptyPixel() {
            return {
                char: 'O',
                color: 'empty',
            };
        }
        this.numberWidth = Math.floor(window.innerWidth / characterWidth);
        this.numberHeight = Math.floor(window.innerHeight / characterHeight);
        this.renderCanvas.width = this.numberWidth * characterWidth;
        this.renderCanvas.height = this.numberHeight * characterHeight;
        if (this.pixels.length > this.numberHeight) {
            this.pixels.splice(this.numberWidth);
        } else if (this.pixels.length < this.numberWidth) {
            for (let i = this.pixels.length; i < this.numberHeight; i++) {
                this.pixels.push(Array<FramePixel>(this.numberWidth).fill(getEmptyPixel()));
            }
        }
        for (let y = 0; y < this.pixels.length; y++) {
            if (this.pixels[y].length > 0 && this.pixels[y].length > this.numberWidth) {
                this.pixels[y].splice(this.numberWidth);
            } else if (this.pixels[y].length < this.numberWidth) {
                this.pixels[y].push(...Array<FramePixel>(this.numberWidth - this.pixels[y].length).fill(getEmptyPixel()));
            }
        }
    }

    protected handleEvent(event: UIEvent) {}
}
