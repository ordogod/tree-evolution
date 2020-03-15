class World {
    // TODO: make fields private
    readonly cells: Array<Array<TreeCell>>;
    readonly trees: Array<Tree>;

    constructor() {
        this.trees = Array<Tree>();
        this.cells = Array<Array<TreeCell>>(WORLD_CELL_COLS);
        for (let i = 0; i < WORLD_CELL_COLS; i++) {
            this.cells[i] = new Array<TreeCell>(WORLD_CELL_ROWS);
        }
    }

    addCell(cell: TreeCell, x: number, y: number) {
        this.cells[x][y] = cell;
    }

    removeCell(cellX: number, cellY: number) {
        this.cells[cellX][cellY] = undefined;
    }

    addTree(tree: Tree) {
        this.trees.push(tree);
    }

    removeTree(tree: Tree) {
        let i = this.trees.indexOf(tree);
        if (i > -1) this.trees.splice(i, 1);
    }

    raiseTrees() {
        this.trees.forEach((tree) => {
            tree.raise();
        });
    }
}

const world = new World();

interface Gene {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

class Genome {
    genes = Array<Gene>(GENOME_SIZE);

    constructor() {
        for (let i = 0; i < GENOME_SIZE; i++) {
            this.genes[i] = {
                top: intIn(GENE_BIT_RANGE_MAX),
                right: intIn(GENE_BIT_RANGE_MAX),
                bottom: intIn(GENE_BIT_RANGE_MAX),
                left: intIn(GENE_BIT_RANGE_MAX)
            };
        }
    }

    mutate() {
        if (tryChance(GENOME_MUTATION_CHANCE)) {
            let mutatingGene = this.genes[intIn(GENOME_SIZE)];
            let mutatingBit = intIn(4);
            switch (mutatingBit) {
                case 0:
                    mutatingGene.top = intIn(GENE_BIT_RANGE_MAX);
                    break;
                case 1:
                    mutatingGene.right = intIn(GENE_BIT_RANGE_MAX);
                    break;
                case 2:
                    mutatingGene.bottom = intIn(GENE_BIT_RANGE_MAX);
                    break;
                case 3:
                    mutatingGene.left = intIn(GENE_BIT_RANGE_MAX);
                    break;
            }
        }
    }

    random(): Gene {
        return this.genes[intIn(GENOME_SIZE)];
    }
}

class TreeCell {
    readonly x: number;
    readonly y: number;
    readonly tree: Tree;
    readonly gene: Gene;

    constructor(worldX: number, worldY: number, tree: Tree, gene: Gene) {
        if (worldX >= WORLD_CELL_COLS)
            this.x = worldX - WORLD_CELL_COLS;
        else {
            if (worldX < 0) this.x = WORLD_CELL_COLS + worldX;
            else this.x = worldX;
        }
        this.y = worldY;
        this.tree = tree;
        this.gene = gene;
        world.addCell(this, this.x, this.y);
    }

    branch() {
        if (this.canBranchTop() && this.gene.top < GENOME_SIZE) {
            this.tree.addLeaf(
                this.branchFromThis(this.x, this.y + 1, this.tree.genome.genes[this.gene.top])
            );
        }
        if (this.canBranchRight() && this.gene.right < GENOME_SIZE) {
            this.tree.addLeaf(
                this.branchFromThis(this.x + 1, this.y, this.tree.genome.genes[this.gene.right])
            );
        }
        if (this.canBranchBottom() && this.gene.bottom < GENOME_SIZE) {
            this.tree.addLeaf(
                this.branchFromThis(this.x, this.y - 1, this.tree.genome.genes[this.gene.bottom])
            );
        }
        if (this.canBranchLeft() && this.gene.left < GENOME_SIZE) {
            this.tree.addLeaf(
                this.branchFromThis(this.x - 1, this.y, this.tree.genome.genes[this.gene.left])
            );
        }
    }

    computeEnergyIncome(): number {
        let cellsAbove = 0;
        for (let j = this.y + 1; j < WORLD_CELL_ROWS; j++) {
            if (world.cells[this.x][j] != undefined) cellsAbove++;
        }
        if (cellsAbove < WORLD_SUN_PENETRATION) {
            let heightFactor = this.y + WORLD_SUN_LEVEL_MIN;
            let lightIntensity = WORLD_SUN_PENETRATION - cellsAbove;
            return lightIntensity * heightFactor - TREE_ENERGY_CONSUME_PER_CELL;
        }
        return -TREE_ENERGY_CONSUME_PER_CELL;
    }

    top(): TreeCell {
        if (this.y + 1 < WORLD_CELL_ROWS) return world.cells[this.x][this.y + 1];
        return undefined;
    }

    right(): TreeCell {
        if (this.x + 1 < WORLD_CELL_COLS) return world.cells[this.x + 1][this.y];
        return world.cells[0][this.y];
    }

    bottom(): TreeCell {
        if (this.y - 1 >= 0) return world.cells[this.x][this.y - 1];
        return undefined;
    }

    left(): TreeCell {
        if (this.x - 1 >= 0) return world.cells[this.x - 1][this.y];
        return world.cells[WORLD_CELL_COLS - 1][this.y];
    }

    private canBranchTop(): Boolean {
        if (this.top() != undefined) return false;
        else return (this.y + 1 < WORLD_CELL_ROWS);
    }

    private canBranchRight(): Boolean {
        return (this.right() == undefined);
    }

    private canBranchBottom(): Boolean {
        if (this.bottom() != undefined) return false;
        else return (this.y - 1 >= 0);
    }

    private canBranchLeft(): Boolean {
        return (this.left() == undefined);
    }

    private branchFromThis(newX: number, newY: number, newGene: Gene): TreeCell {
        return new TreeCell(newX, newY, this.tree, newGene);
    }
}

class Tree {
    energy: number;
    genome: Genome;
    leaves: Array<TreeCell>;

    constructor(worldX: number, parentGenome?: Genome) {
        if (parentGenome) {
            this.genome = parentGenome;
            this.genome.mutate();
        } else {
            this.genome = new Genome()
        }
        this.energy = TREE_ENERGY_START;
        this.leaves = Array<TreeCell>();
        this.leaves.push(new TreeCell(worldX, 0, this, this.genome.random()));
    }

    raise() {
        this.makeBranches();
        this.recomputeEnergy();
        if (this.energy < 0) this.die();
    }

    addLeaf(leaf: TreeCell) {
        this.leaves.push(leaf);
    }

    private makeBranches() {
        let oldLeaves = Array<TreeCell>();
        this.leaves.forEach((oldLeaf) => {
            oldLeaves.push(oldLeaf)
        });
        this.leaves = Array<TreeCell>();
        oldLeaves.forEach((oldLeaf) => {
            oldLeaf.branch()
        });
    }

    private recomputeEnergy() {
        world.cells.forEach((col) => {
            col.forEach((cell) => {
                if (cell != undefined && cell.tree === this && this.leaves.indexOf(cell) == -1) {
                    this.energy += cell.computeEnergyIncome();
                }
            });
        });
    }

    private die() {
        world.removeTree(this);
    }
}
