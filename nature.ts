const GENE_BIT_RANGE_MAX = 30;

const GENOME_SIZE = 16;
const GENOME_MUTATION_CHANCE = 0.25;

const TREE_CELL_CONSUME = 13;

const trees: Array<Tree> = Array.apply(
    null, new Array<Tree>(1).map(() => new Tree())
);

interface Gene {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

class Genome {
    genes = Array<Gene>(GENOME_SIZE);

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

    static create(): Genome {
        let genome = new Genome();
        for (let i = 0; i < GENOME_SIZE; i++) {
            genome.genes[i] = {
                top: intIn(GENE_BIT_RANGE_MAX),
                right: intIn(GENE_BIT_RANGE_MAX),
                bottom: intIn(GENE_BIT_RANGE_MAX),
                left: intIn(GENE_BIT_RANGE_MAX)
            }
        }
        return genome;
    }
}

class Cell {
    top?: Cell;
    right?: Cell;
    bottom?: Cell;
    left?: Cell;
    gene: Gene;

    constructor(gene: Gene) {
        this.gene = gene;
    }

    findBranches(branches?: Array<Cell>): Array<Cell> {
        if (!branches) branches = Array<Cell>();
        if (this.top)
            if (this.top.isBranch()) branches.push(this.top);
            else branches = branches.concat(this.top.findBranches(branches));
        if (this.right)
            if (this.right.isBranch()) branches.push(this.right);
            else branches = branches.concat(this.right.findBranches(branches));
        if (this.bottom)
            if (this.bottom.isBranch()) branches.push(this.bottom);
            else branches = branches.concat(this.bottom.findBranches(branches));
        if (this.left)
            if (this.left.isBranch()) branches.push(this.left);
            else branches = branches.concat(this.left.findBranches(branches));
        return branches;
    }

    isBranch(): Boolean {
        if (this.top && !this.right && !this.bottom && !this.left) return true;
        if (!this.top && this.right && !this.bottom && !this.left) return true;
        if (!this.top && !this.right && this.bottom && !this.left) return true;
        return !!(!this.top && !this.right && !this.bottom && this.left);
    }
}

class Tree {
    genome: Genome;
    root: Cell;

    constructor(parent?: Tree) {
        this.root = new Cell(this.genome.random());
        if (parent) {
            this.genome = parent.genome;
            this.genome.mutate()
        } else {
            this.genome = Genome.create()
        }
    }

    raise() {

    }
}
