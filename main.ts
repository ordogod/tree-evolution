let w = canvas.width;
let h = canvas.height;

function start() {
    init();
    setInterval(loop, UPDATE_TIME);
}

function init() {
    c.font = font;
}

function loop() {
    clear();
    drawTrees();
    drawGUI();
}

start();
