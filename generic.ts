const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;

const FPS = 60;
const UPDATE_TIME = 1000 / FPS;

const font = 'normal 20px Inconsolata';

const color = {
    window: '#152126',
    canvas: '#253340',
    1: '#263940',
    2: '#223D40',
    3: '#162626',
    gui: '#f0f8ff'
};

function tryChance(chance: number): boolean {
    return (Math.random() <= chance);
}

function intInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

function intIn(max: number) {
    return Math.floor(Math.random() * max);
}
