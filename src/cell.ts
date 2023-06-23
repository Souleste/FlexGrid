import Grid from './grid';

interface CellInfo {
    x: number,
    y: number,
    open: boolean
}
// interface Cells extends Array<CellInfo>{}

export default class Cell {
    public Grid: Grid;
    public size: number;
    public cells: Array<CellInfo> = [];

    constructor(Grid:Grid) {
        this.Grid = Grid;

        this.add({x: 1, y: 1}, {x: this.Grid.FlexGrid.options.x, y: this.Grid.FlexGrid.options.y});
    }

    public add(from:{x:number, y:number}, to:{x:number, y:number}) {
        for (var x = from.x; x < to.x + 1; x++) {
            for (var y = from.y; y < to.y + 1; y++) {
                this.cells.push({x: x, y: y, open: true});
            }
        }
        this.sort();
    }

    public remove(from:{x:number, y:number}, to:{x:number, y:number}) {
        this.cells = this.cells.filter((cell) => {
            return !(cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y);
        });
        this.sort();
    }

    public open(from:{x:number, y:number}, to:{x:number, y:number}) {
        this.cells = this.cells.map((cell) => {
            if (cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y)
                cell.open = true;
            return cell;
        });
    }

    public close(from:{x:number, y:number}, to:{x:number, y:number}) {
        this.cells = this.cells.map((cell) => {
            if (cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y)
                cell.open = false;
            return cell;
        });
    }

    public get(from:{x:number, y:number}, to:{x:number, y:number}) {
        this.sort();
        return this.cells.filter((cell) => {
            return cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y;
        });
    }

    public sort() {
        var cmp = (a:number, b:number) => ~~(a > b) - ~~(a < b); // filter by x then y
        this.cells = this.cells.sort((a, b) => cmp(a.y, b.y) || cmp(a.x, b.x));
    }
}
