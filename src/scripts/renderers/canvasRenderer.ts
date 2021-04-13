import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';

const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;

let tl;

const srandom = seedrandom('b');

export default class CanvasRenderer implements BaseRenderer{

    colors = ['#A66FA2', '#3F2D40', '#F2C335', '#BF372A', '#A66FA2'];
    backgroundColor = '#F2B9B3';
    items: any = [];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    maxSize = 10;
    completeCallback: any;
    delta = 0;
    color = this.colors[0];

    constructor(canvas: HTMLCanvasElement) {
        
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        /// add items

        for (let i = 0; i < 100; i++) {
            let angle = (i * (2 * Math.PI)) / 100;
            let x = (WIDTH / 2) + Math.sin(angle) * 100;
            let y = (HEIGHT / 2) + Math.cos(angle) * 100;
            this.items.push({pos: {x, y}});
        }

        /// end add items

        this.reset();
        this.createTimeline();
    }

    private reset() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.ctx.strokeStyle = this.colors[0];
    }

    public render() {
        this.delta ++;

        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = srandom() * 50;
        this.ctx.strokeStyle = this.color;

        this.ctx.beginPath();
        let size = 100 + srandom() * 200;

        for (let i = this.items.length - 1; i > -1; i--) {

            this.ctx.globalAlpha = 0.25;
            let angle = (i * (2 * Math.PI)) / 100;
            let x = (WIDTH / 2) + Math.sin(angle) * size * Math.sin(i * 10 + this.delta);
            let y = (HEIGHT / 2) + Math.cos(angle) * size * Math.sin(i * 10 + this.delta);
            
            if (i == this.items.length -1) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

        }
        this.ctx.closePath();
        this.ctx.stroke();

        // stroke 2 
        this.ctx.save();
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        
        this.ctx.beginPath();

        for (let i = this.items.length - 1; i > -1; i--) {

            this.ctx.globalAlpha = 0.25;
            let angle = (i * (2 * Math.PI)) / 100;
            let x = (WIDTH / 2) + Math.sin(angle) * size;
            let y = (HEIGHT / 2) + Math.cos(angle) * size;
            
            if (i == this.items.length -1) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

        }
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();

    }

    private createTimeline() {
        
        tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            onComplete: () => this.handleComplete(),
            onRepeat: () => this.handleRepeat()
        });

        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                
                tl.to(item.pos, {
                    x: `+=${50 - srandom() * 100}`,
                    y: `+=${50 - srandom() * 100}`,
                    duration: 1,
                    ease: 'none'
                }, j);

                tl.to(this, {
                    color: this.colors[j + 1],
                    duration: 1,
                    ease: 'none'
                }, j);
            }
        }

        console.log('DURATION:', tl.duration());
        
    }

    protected handleRepeat() {
        this.reset();

        if (this.completeCallback) {
            this.completeCallback();
        }
    }

    protected handleComplete() {

    }

    public play() {
        this.reset();
        tl.restart();
    }

    public stop() {
        this.reset();
        tl.pause(true);
        tl.time(0);
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    randomX(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }

    randomY(i: number) {
        return (WIDTH / 2) + Math.sin(i) * ( 50 * srandom());
    }
}