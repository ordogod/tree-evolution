let years = 0;

let w = canvas.width;
let h = canvas.height;

function start() {
    init();
    setInterval(loop, UPDATE_TIME);
}

function init() {
    c.font = font;
    world.addTree(new Tree(30));
    console.log(world.trees[0].genome)
}

function raiseTrees() {
    world.raiseTrees();
}

function loop() {
    if (years >= 90) return;

    clear();

    raiseTrees();
    drawTrees();

    drawGUI();

    // clear();

    years++;
}

start();
