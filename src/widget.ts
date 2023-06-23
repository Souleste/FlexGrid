import toArray from 'to-array';
import uniqid from 'uniqid';

import FlexGrid from './flexgrid';

import Grid from './grid';
import { GridOptions } from './grid';

export interface WidgetOptions {
    x?: number, // widget position x
    y?: number, // widget position y
    width?: number, // widget width (default 3)
    height?: number, // widget height (default 3)
    minWidth?: number, // minimum widget width (>= 1 && <= width && <= maxWidth)
    minHeight?: number, // minimum widget height (>= 1 && <= height && <= maxHeight)
    maxWidth?: number, // maximum widget width (>= width && >= minWidth && <= x)
    maxHeight?: number, // maximum widget height (>= height && >= minHeight && <= y)
    template?: string, // widget template html
    customClass?: {
        widget?: string,
        helper?: string,
        placeholder?: string
    },
    dragHandle?: string,
    resizeHandles?: string
}

export interface WidgetInfo {
    [key:string] : {
        x: number,
        y: number,
        width: number,
        height: number,
        minWidth: number,
        minHeight: number,
        maxWidth: number,
        maxHeight: number,
        drag?: {
            collision: boolean,
            direction: string,
            x: number,
            y: number,
            origin: {
                x: number,
                y: number
            }
            cursor: {
                left: number,
                top: number
            }
        }
    }
}

export default class Widget {
    static options:WidgetOptions = {
        x: 1,
        y: 1,
        width: 3,
        height: 3,
        minWidth: 1,
        minHeight: 1,
        maxWidth: 12,
        maxHeight: 12,
        customClass: {
            widget: null,
            helper: null,
            placeholder: null
        },
        dragHandle: null,
        resizeHandles: null
    };
    static validateWidgetOptions: (options: WidgetOptions) => WidgetOptions;

    public FlexGrid: FlexGrid;
    public Grid: Grid;

    constructor(FlexGrid: FlexGrid, Grid: Grid) {
        this.FlexGrid = FlexGrid;
        this.Grid = Grid;

        this.FlexGrid.display.widgets = [];

        this.FlexGrid.addWidget = (options: WidgetOptions = {}) => {
            var uid = uniqid();

            var options = Widget.validateWidgetOptions(options);
                options.customClass.widget = options.customClass.widget || this.FlexGrid.options.customClass.widget;
                options.customClass.helper = options.customClass.helper || this.FlexGrid.options.customClass.helper;
                options.customClass.placeholder = options.customClass.placeholder || this.FlexGrid.options.customClass.placeholder;

            for (const option in options) (options as any)[option] ??= (this.FlexGrid.options as any)[option];

            var space = this.Grid.findSpace(options.width, options.height, {x: options.x, y: options.y}, {x: options.x + options.width - 1, y: options.y + options.height - 1}) || this.Grid.findSpace(options.width, options.height, {x: 1, y: 1}, {x: this.FlexGrid.options.x, y: this.FlexGrid.options.y});
            if (space) {
                options.x = space.x;
                options.y = space.y;
            } else return;

            var widget = document.createElement('div');
                widget.classList.add('flexgrid-widget', options.customClass.widget);
                widget.dataset.flexgridWidgetWidth = options.width.toString();
                widget.dataset.flexgridWidgetHeight = options.height.toString();
                widget.dataset.flexgridWidgetMaxWidth = options.maxWidth.toString();
                widget.dataset.flexgridWidgetMaxHeight = options.maxHeight.toString();
                widget.dataset.flexgridWidgetX = options.x.toString();
                widget.dataset.flexgridWidgetY = options.y.toString();
                widget.dataset.flexgridWidgetId = uid;
                widget.style.width = `${options.width * this.Grid.Cell.size}px`;
                widget.style.height = `${options.height * this.Grid.Cell.size}px`;
                widget.style.top = `${(options.y - 1) * this.Grid.Cell.size}px`;
                widget.style.left = `${(options.x - 1) * this.Grid.Cell.size}px`;

            var inner = document.createElement('div');
                inner.classList.add('flexgrid-widget--inner');
                inner.innerHTML = options.template ?? '';

            widget.appendChild(inner);

            this.FlexGrid.display.widgets.push(widget);

            this.FlexGrid.widgets[uid] = {
                x: options.x,
                y: options.y,
                width: options.width,
                height: options.height,
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight
            };

            this.Grid.Cell.close({x: options.x, y: options.y}, {x: options.x + options.width - 1, y: options.y + options.height - 1});

            if (this.FlexGrid.options.draggable) {
                widget.classList.add('flexgrid-widget-draggable');

                var dragHandles = toArray(widget.querySelectorAll(options.dragHandle));
                for (const handle of dragHandles) {
                    handle.classList.add('flexgrid-drag-handle');
                    handle.addEventListener('mousedown', this.FlexGrid.dragstart);
                }
            }

            if (this.FlexGrid.options.resizable) {
                widget.classList.add('flexgrid-widget-resizable');

                window.addEventListener('mousemove', this.FlexGrid.resize);
                window.addEventListener('mouseup', this.FlexGrid.resizestop);

                var resizeHandles = options.resizeHandles.split(',').map((o) => o.trim()).filter((o) => ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'].includes(o));
                for (const name of resizeHandles) {
                    var handle = document.createElement('span');
                        handle.classList.add('flexgrid-resize-handle', `flexgrid-resize-handle--${name}`);

                    window.addEventListener('mousedown', this.FlexGrid.resizestart);

                    widget.appendChild(handle);
                }
            }

            this.FlexGrid.display.grid.appendChild(widget);

            return widget;
        }
        this.FlexGrid.removeWidget = (uidorel:string|HTMLElement) => {
            var widget = typeof uidorel === 'string' ? <HTMLElement>this.FlexGrid.display.grid.querySelector(`.flexgrid-widget[data-widget-id="${uidorel}"]`) : uidorel;
            var uid = widget.dataset.flexgridWidgetId;

            var info = this.FlexGrid.widgets[uid];

            this.Grid.Cell.open({x: info.x, y: info.y}, {x: info.x + info.width - 1, y: info.y + info.height - 1});

            this.FlexGrid.display.grid.removeChild(widget);
            this.FlexGrid.display.widgets = this.FlexGrid.display.widgets.filter((o) => o.dataset.flexgridWidgetId != uid);

            delete this.FlexGrid.widgets[uid];
        }
        this.FlexGrid.clear = () => {
            for (const widget of this.FlexGrid.display.widgets)
                this.FlexGrid.display.grid.removeChild(widget);

            this.FlexGrid.display.widgets = [];
            this.FlexGrid.widgets = {};

            this.Grid.Cell.open({x: 1, y: 1}, {x: this.FlexGrid.options.x, y: this.FlexGrid.options.y});
        }
        this.FlexGrid.load = (data:Array<WidgetOptions>) => {
            for (const options of data)
                this.FlexGrid.addWidget(options);
        }
        this.FlexGrid.save = () => {}

        this.FlexGrid.dragstart = (e:MouseEvent) => {
            if (this.FlexGrid.dragging) return;

            var grid = this.FlexGrid.display.grid;

            var widget = <HTMLElement>(<HTMLElement>e.target).closest('.flexgrid-widget');
                widget.classList.add('flexgrid-widget-dragging');
            var bounds = widget.getBoundingClientRect();
            var uid = widget.dataset.flexgridWidgetId;
            var info = this.FlexGrid.widgets[uid];
                info.drag = {
                    collision: false,
                    direction: null,
                    x: info.x,
                    y: info.y,
                    origin: {
                        x: info.x,
                        y: info.y
                    },
                    cursor: {
                        left: e.clientX - bounds.left,
                        top: e.clientY - bounds.top
                    }
                };

            this.Grid.Cell.open({x: info.x, y: info.y}, {x: info.x + info.width - 1, y: info.y + info.height - 1});

            var placeholder = document.createElement('div');
                placeholder.classList.add('flexgrid-widget-placeholder', this.FlexGrid.options.customClass.placeholder);
                placeholder.dataset.flexgridWidgetId = uid;
                placeholder.style.width = (<HTMLElement>widget.querySelector('.flexgrid-widget--inner')).offsetWidth + 'px';
                placeholder.style.height = (<HTMLElement>widget.querySelector('.flexgrid-widget--inner')).offsetHeight + 'px';
                placeholder.style.left = (info.x - 1) * this.Grid.Cell.size + 'px';
                placeholder.style.top = (info.y - 1) * this.Grid.Cell.size + 'px';

            grid.insertBefore(placeholder, grid.firstElementChild);

            this.FlexGrid.dragging = true;
        }
        this.FlexGrid.drag = (event:MouseEvent, widget:HTMLElement) => {
            if (!this.FlexGrid.dragging) return;

            var grid = this.FlexGrid.display.grid;
            var gridBounds = grid.getBoundingClientRect();

            var uid = widget.dataset.flexgridWidgetId;

            var info = this.FlexGrid.widgets[uid];
                info.drag.x = Math.round(widget.offsetLeft / this.Grid.Cell.size) + 1;
                info.drag.y = Math.round(widget.offsetTop / this.Grid.Cell.size) + 1;

            var x = info.drag.x < 1 ? 1 : info.drag.x + info.width > this.FlexGrid.options.x ? this.FlexGrid.options.x - info.width + 1 : info.drag.x;
            var y = info.drag.y < 1 ? 1 : info.drag.y + info.height > this.FlexGrid.options.y ? this.FlexGrid.options.y - info.height + 1 : info.drag.y;

            var n = y < info.y ? 'n' : null;
            var e = x > info.x ? 'e' : null;
            var s = y > info.y ? 's' : null;
            var w = x < info.x ? 'w' : null;

            info.x = x;
            info.y = y;

            var direction = info.drag.collision ? info.drag.direction : n || e || s || w || info.drag.direction;
            console.log(direction);
            info.drag.direction = direction;

            this.FlexGrid.widgets[uid] = info;

            var collision = this.collision('drag', uid);

            info = this.FlexGrid.widgets[uid];

            widget.style.left = event.clientX - gridBounds.left - info.drag.cursor.left + 'px';
            widget.style.top = event.clientY - gridBounds.top - info.drag.cursor.top + 'px';

            var placeholder = <HTMLElement>grid.querySelector('.flexgrid-widget-placeholder[data-flexgrid-widget-id="'+uid+'"]');
                placeholder.style.left = (info.x - 1) * this.Grid.Cell.size + 'px';
                placeholder.style.top = (info.y - 1) * this.Grid.Cell.size + 'px';

        }
        this.FlexGrid.dragstop = (e:MouseEvent, widget:HTMLElement) => {
            if (!this.FlexGrid.dragging) return;

            var grid = this.FlexGrid.display.grid;
            var gridBounds = grid.getBoundingClientRect();

            var uid = widget.dataset.flexgridWidgetId;

            var info = this.FlexGrid.widgets[uid];
            delete info.drag;
            this.FlexGrid.widgets[uid] = info;

            this.Grid.Cell.close({x: info.x, y: info.y}, {x: info.x + info.width - 1, y: info.y + info.height - 1});

            widget.style.left = (info.x - 1) * this.Grid.Cell.size + 'px';
            widget.style.top = (info.y - 1) * this.Grid.Cell.size + 'px';

            var placeholder = <HTMLElement>grid.querySelector('.flexgrid-widget-placeholder[data-flexgrid-widget-id="'+uid+'"]');

            grid.removeChild(placeholder);

            widget.classList.remove('flexgrid-widget-dragging');

            this.FlexGrid.dragging = false;
        }
    }

    private collision(method:string = '', uid:string = ''):boolean {
        if (!['drag', 'sort', 'resize'].includes(method)) return true;

        var grid = this.FlexGrid.display.grid;

        var info = this.FlexGrid.widgets[uid];

        if (method == 'drag') {
            info.drag.collision = false;

            var cells = this.Grid.Cell.get({x: info.x, y: info.y}, {x: info.x + info.width - 1, y: info.y + info.height - 1});
            if (cells.length != info.width * info.height || cells.filter((cell) => !cell.open).length) {
                var space:any;
                if (info.drag.direction == 'n') {
                    var spaces = [this.Grid.findSpace(info.width, info.height, {x: info.x, y: info.y}, {x: this.FlexGrid.options.x, y: this.FlexGrid.options.y}), this.Grid.findSpace(info.width, info.height, {x: 1, y: info.y}, {x: info.x + info.width - 1, y: this.FlexGrid.options.y}, 'max')];
                    if (spaces[0] && spaces[1]) {
                        space = spaces.reduce((acc:any, obj:any) => Math.abs(info.drag.x - obj.x) < Math.abs(info.drag.x - acc.x) ? obj : acc);
                    } else space = spaces[0] || spaces[1];
                }
                if (info.drag.direction == 's') {
                    var spaces = [this.Grid.findSpace(info.width, info.height, {x: info.x, y: info.y + info.height - 1}, {x: this.FlexGrid.options.x, y: 1}, 'min', 'max'), this.Grid.findSpace(info.width, info.height, {x: 1, y: info.y + info.height - 1}, {x: info.x + info.width - 1, y: 1}, 'max', 'max')];
                    if (spaces[0] && spaces[1]) {
                        space = spaces.reduce((acc:any, obj:any) => Math.abs(info.drag.x - obj.x) < Math.abs(info.drag.x - acc.x) ? obj : acc);
                    } else space = spaces[0] || spaces[1];
                }
                if (info.drag.direction == 'e') {
                    space = this.Grid.findSpace(info.width, info.height, {x: 1, y: info.y}, {x: info.x + info.width - 1, y: info.y + info.height - 1});
                }
                if (info.drag.direction == 'w') {
                    space = this.Grid.findSpace(info.width, info.height, {x: info.x, y: info.y}, {x: this.FlexGrid.options.x, y: info.y + info.height - 1});
                }
                console.log(space);
                if (space) {
                    info.x = space.x;
                    info.y = space.y;
                }

                info.drag.collision = true;
                this.FlexGrid.widgets[uid] = info;

                return true;
            }
        }

        return false;
    }
}
Widget.validateWidgetOptions = function(options:WidgetOptions):WidgetOptions {
    for (const option in Widget.options) (options as any)[option] ??= (Widget.options as any)[option];

    if (options.minWidth < 1 || options.minWidth > options.width) throw new Error('FlexGrid: Option "minWidth" must be greater than or equal to 1 and less than or equal to the value of option "width".');
    if (options.width > options.maxWidth) throw new Error('FlexGrid: Option "width" must be less than or equal to the value of option "maxWidth".');
    if (options.minHeight < 1 || options.minHeight > options.height) throw new Error('FlexGrid: Option "minHeight" must be greater than or equal to 1 and less than or equal to the value of option "height".');
    if (options.height > options.maxHeight) throw new Error('FlexGrid: Option "height" must be less than or equal to the value of option "maxHeight".');

    return options;
}
