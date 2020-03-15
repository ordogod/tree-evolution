const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;

const FPS = 30;
const UPDATE_TIME = 1000 / FPS;

const WORLD_CELL_SIZE = 20; // WORLD_CELL_SIZE * WORLD_CELL_COLS must be canvas.width!
const WORLD_CELL_ROWS = 30;
const WORLD_CELL_COLS = 60;
const WOLRD_TREE_COUNT_START = 1;
const WORLD_SUN_LEVEL_MIN = 6;
const WORLD_SUN_PENETRATION = 3;

const TREE_ENERGY_START = 300;
const TREE_ENERGY_CONSUME_PER_CELL = 13;

const GENE_BIT_RANGE_MAX = 30;
const GENOME_MUTATION_CHANCE = 0.25;
const GENOME_SIZE = 16;

const font = 'normal 12px Inconsolata';

const COLOR = {
    WINDOW: '#152126',
    CANVAS: '#253340',
    WOOD: '#335644',
    LEAVES: '#366e4c',
    3: '#162626',
    GUI: '#f0f8ff'
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
