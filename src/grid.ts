import FlexGrid from './flexgrid';

import Widget from './widget';
import { WidgetOptions } from './widget';

import Cell from './cell';

export interface GridOptions extends WidgetOptions {
    accept?: string, // accept widgets by selector
    responsive?: boolean, // when true, maintain cell size, otherwise cell size will be calculated based on grid width
    x?: number, // number of columns (default 12)
    y?: number, // number of rows (default 12)
    minX?: number, // minimum number of columns (>= 1 && <= x && <= maxX)
    minY?: number, // minimum number of rows (>= 1 && <= y && <= maxY)
    maxX?: number, // maximum number of columns (>= x && >= minX)
    maxY?: number, // maximum number of rows (>= y && >= minY)

    draggable?: boolean, // enable draggable widgets (default true)
    dragHandle?: string, // handles used for dragging widgets
    sortable?: boolean, // enable sortable widgets (this will allow widgets to be "pushed" when dragging) (default false)
    resizable?: boolean, // enable resizable widgets (default false)
    resizeHandles?: string, // handles used for resizing widgets (n, e, s, w, ne, se, sw, nw, all) (default se)
    resizeGhost?: boolean,

    // callbacks
    dragstart?: (e:Event, ui:Object) => void,
    drag?: (e:Event, ui:Object) => void,
    dragstop?: (e:Event, ui:Object) => void,
    resizestart?: (e:Event, ui:Object) => void,
    resize?: (e:Event, ui:Object) => void,
    resizestop?: (e:Event, ui:Object) => void,
    change?: (e:Event, ui:Object) => void
}

export default class Grid {
    static options:GridOptions = {
        accept: '.flexgrid-widget',
        responsive: true,
        x: 12,
        y: 12,
        minX: 1,
        minY: 1,
        maxX: Infinity,
        maxY: Infinity,
        draggable: true,
        dragHandle: '.flexgrid-widget--inner',
        sortable: false,
        resizable: false,
        resizeHandles: 'se',
        resizeGhost: false,
        dragstart: (() => {}),
        drag: (() => {}),
        dragstop: (() => {}),
        resizestart: (() => {}),
        resize: (() => {}),
        resizestop: (() => {}),
        change: (() => {}),
    };
    static validateGridOptions:(options:GridOptions) => GridOptions;

    public FlexGrid: FlexGrid;
    public Cell: Cell;
    public Widget: Widget;

    constructor(FlexGrid:FlexGrid) {
        this.FlexGrid = FlexGrid;
        this.Cell = new Cell(this);
        this.Widget = new Widget(FlexGrid, this);

        this.build();

        FlexGrid.addRow = (rows = 1) => {
            if (this.FlexGrid.options.y == this.FlexGrid.options.maxY) return; // if maximum rows reached, exit

            var from = {x: 1, y: this.FlexGrid.options.y + 1};

            if (this.FlexGrid.options.y > this.FlexGrid.options.maxY)
                this.FlexGrid.options.y = this.FlexGrid.options.maxY;
            else this.FlexGrid.options.y += rows; // update option y

            this.Cell.add(from, {x: this.FlexGrid.options.x, y: this.FlexGrid.options.y});

            this.style(); // update grid styling
        }
        FlexGrid.removeRow = (rows = 1) => {
            if (this.FlexGrid.options.y == this.FlexGrid.options.minY) return; // if minimum rows reached, exit

            var to = {x: this.FlexGrid.options.x, y: this.FlexGrid.options.y};

            if (this.FlexGrid.options.y < this.FlexGrid.options.minY)
                this.FlexGrid.options.y = this.FlexGrid.options.minY;
            else this.FlexGrid.options.y -= rows; // update option y

            this.Cell.remove({x: 1, y: this.FlexGrid.options.y + 1}, to);

            this.style(); // update grid styling
        }
        FlexGrid.addColumn = (columns = 1) => {
            if (this.FlexGrid.options.x == this.FlexGrid.options.maxX) return; // if maximum columns reached, exit

            var from = {x: this.FlexGrid.options.x + 1, y: 1};

            if (this.FlexGrid.options.x > this.FlexGrid.options.maxX)
                this.FlexGrid.options.x = this.FlexGrid.options.maxX;
            else this.FlexGrid.options.x += columns; // update option x

            this.Cell.add(from, {x: this.FlexGrid.options.x, y: this.FlexGrid.options.y});

            this.style(); // update grid styling
        }
        FlexGrid.removeColumn = (columns = 1) => {
            if (this.FlexGrid.options.x == this.FlexGrid.options.minX) return; // if minimum columns reached, exit

            var to = {x: this.FlexGrid.options.x, y: this.FlexGrid.options.y};

            if (this.FlexGrid.options.x < this.FlexGrid.options.minX)
                this.FlexGrid.options.x = this.FlexGrid.options.minX;
            else this.FlexGrid.options.x -= columns; // update option x

            this.Cell.remove({x: this.FlexGrid.options.y + 1, y: 1}, to);

            this.style(); // update grid stying
        }
    }

    public findSpace(width:number, height:number, from:{x: number, y: number}, to:{x: number, y: number}, x:string = 'min', y:string = 'min') {
        var info = {x: 0, y: 0};

        var cells = this.Cell.get(from, to).filter((cell) => cell.open);
        if (cells.length < width * height) return false;

        var cmp = (a:number, b:number) => ~~(a > b) - ~~(a < b);
        cells.sort((a, b) => (y == 'max' ? cmp(b.y, a.y) : cmp(a.y, b.y)) || (x == 'max' ? cmp(b.x, a.x) : cmp(a.x, b.x)));

        // console.log(cells);

        var area:any = []; // available area
        var i = 0;
        do {
            if (!cells[i]) break;

            info.x = cells[i].x;
            info.y = cells[i].y;

            area = cells.filter((cell) => cell.x >= info.x && cell.x <= (info.x + width - 1) && cell.y >= info.y && cell.y <= (info.y + height - 1));

            if (area.length == width * height) break;

            i++;
        } while (area.length !== width * height);

        return (area.length == width * height) && info;
    }

    private build() { // build grid
        this.FlexGrid.display.grid = document.createElement('div');
        this.FlexGrid.display.grid.classList.add('flexgrid-grid');
        this.FlexGrid.display.wrapper.appendChild(this.FlexGrid.display.grid);
        this.style(); // update grid styling
    }

    private style() { // update grid styling
        this.Cell.size = this.FlexGrid.options.responsive || !this.Cell.size ? this.FlexGrid.display.grid.offsetWidth / this.FlexGrid.options.x : this.Cell.size;
        this.FlexGrid.display.grid.style.height = `${this.Cell.size * this.FlexGrid.options.y}px`;
        this.FlexGrid.display.grid.style.width = this.FlexGrid.options.responsive ? 'auto' : `${this.Cell.size * this.FlexGrid.options.x}px`;
        this.FlexGrid.display.grid.style.backgroundSize = `${this.Cell.size}px ${this.Cell.size}px`;
    }
}
Grid.validateGridOptions = function(options:GridOptions):GridOptions {
    for (const option in Grid.options) (options as any)[option] ??= (Grid.options as any)[option];

    if (options.x > options.maxX) throw new Error('FlexGrid: Option "x" must be less than or equal to the value of option "maxX".');
    if (options.minX < 1 || options.minX > options.x) throw new Error('FlexGrid: Option "minX" must be greater than or equal to 1 and less than or equal to the value of option "x".');
    if (options.y > options.maxY) throw new Error('FlexGrid: Option "y" must be less than or equal to the value of option "maxY".');
    if (options.minY < 1 || options.minY > options.y) throw new Error('FlexGrid: Option "minY" must be greater than or equal to 1 and less than or equal to the value of option "y".');

    var widgetOptions = Widget.validateWidgetOptions(options);
    for (const option in widgetOptions) (options as any)[option] = (widgetOptions as any)[option];

    return options;
}
