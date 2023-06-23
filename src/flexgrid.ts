import toArray from 'to-array';

import Grid from './grid';
import { GridOptions } from './grid';

import Widget from './widget';
import { WidgetOptions, WidgetInfo } from './widget';

interface FlexGridWrapperElement extends HTMLElement {
    FlexGrid: FlexGrid
}

interface Display {
    wrapper?: FlexGridWrapperElement,
    grid?: HTMLElement,
    widgets?: Array<HTMLElement>
}

interface FlexGridOptions extends GridOptions {
    customClass?: {
        widget?: string,
        helper?: string,
        placeholder?: string
    }
}

export default class FlexGrid {
    static options:FlexGridOptions = Grid.options;
    static init:(options:FlexGridOptions, selector:string|FlexGridWrapperElement) => void;
    static destroy:(selector:string|FlexGridWrapperElement) => void;

    public dragging:boolean = false;

    public options:FlexGridOptions;
    public display:Display = {};
    public widgets:WidgetInfo = {};

    constructor(wrapper:FlexGridWrapperElement, options:FlexGridOptions) {
        this.options = this.validateFlexGridOptions(options);

        this.display.wrapper = wrapper;
        this.display.wrapper.FlexGrid = this;
        this.display.wrapper.classList.add('flexgrid');

        new Grid(this);

        window.addEventListener('mousemove', (e) => {
            if (!this.dragging) return;
            this.drag(e, this.display.grid.querySelector('.flexgrid-widget-dragging'));
        });
        window.addEventListener('mouseup', (e) => {
            if (!this.dragging) return;
            this.dragstop(e, this.display.grid.querySelector('.flexgrid-widget-dragging'));
        });
    }

    public addRow: () => void;
    public removeRow: () => void;
    public addColumn: () => void;
    public removeColumn: () => void;
    public addWidget: (options:WidgetOptions) => HTMLElement;
    public removeWidget: (info:string|HTMLElement) => void;
    public clear: () => void;
    public load: (data:Array<WidgetOptions>) => void;
    public save: () => void;
    public dragstart: (e:MouseEvent) => void;
    public drag: (e:MouseEvent, widget:HTMLElement) => void;
    public dragstop: (e:MouseEvent, widget:HTMLElement) => void;
    public resizestart: () => void;
    public resize: () => void;
    public resizestop: () => void;

    public setOption = (option:string, value:any) => {
        if ((Grid.options as any)[option] == undefined) throw new Error(`FlexGrid: Option "${option}" does not exist.`);

        (this.options as any)[option] = value;

        Grid.validateGridOptions(this.options);
    }

    private validateFlexGridOptions(options:FlexGridOptions):FlexGridOptions {
        for (const option in FlexGrid.options) (options as any)[option] ??= (FlexGrid.options as any)[option];

        var gridOptions = Grid.validateGridOptions(options);
        for (const option in gridOptions) (options as any)[option] = (gridOptions as any)[option];

        return options;
    }
}
FlexGrid.init = function(options:GridOptions = {}, selector:string|FlexGridWrapperElement = '.flexgrid') {
    var elements = typeof selector === 'string' ? toArray(document.querySelectorAll(selector)) : [selector];
        elements.forEach((element:FlexGridWrapperElement) => new FlexGrid(element, options));
}
FlexGrid.destroy = function(selector:string|FlexGridWrapperElement) {}

declare global {
    interface Window { FlexGrid: any }
}

window.FlexGrid = FlexGrid;
