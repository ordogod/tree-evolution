function clear() {
    c.fillStyle = COLOR.CANVAS;
    c.fillRect(0, 0, w, h);
}

function drawTrees() {
    drawAllCells();
    drawLeaves();
}

function drawGUI() {
    c.fillStyle = COLOR.GUI;
    c.fillText("Generation", 20, 40);
}

function drawAllCells() {
    c.fillStyle = COLOR.WOOD;
    world.cells.forEach((col) => {
        col.forEach((cell) => {
            if (cell != undefined) {
                c.fillRect(
                    cell.x * WORLD_CELL_SIZE,
                    (WORLD_CELL_ROWS - 1 - cell.y) * WORLD_CELL_SIZE,
                    WORLD_CELL_SIZE, WORLD_CELL_SIZE
                );
            }
        });
    });
}

function drawLeaves() {
    c.fillStyle = COLOR.LEAVES;
    world.trees.forEach((tree) => {
        tree.leaves.forEach((leaf) => {
            c.fillRect(
                leaf.x * WORLD_CELL_SIZE,
                (WORLD_CELL_ROWS - 1 - leaf.y) * WORLD_CELL_SIZE,
                WORLD_CELL_SIZE, WORLD_CELL_SIZE
            );
        });
    });
}
