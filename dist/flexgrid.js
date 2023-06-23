/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/to-array/index.js":
/*!****************************************!*\
  !*** ./node_modules/to-array/index.js ***!
  \****************************************/
/***/ (function(module) {

module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}


/***/ }),

/***/ "./src/cell.ts":
/*!*********************!*\
  !*** ./src/cell.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Cell = (function () {
    function Cell(Grid) {
        this.cells = [];
        this.Grid = Grid;
        this.add({ x: 1, y: 1 }, { x: this.Grid.FlexGrid.options.x, y: this.Grid.FlexGrid.options.y });
    }
    Cell.prototype.add = function (from, to) {
        for (var x = from.x; x < to.x + 1; x++) {
            for (var y = from.y; y < to.y + 1; y++) {
                this.cells.push({ x: x, y: y, open: true });
            }
        }
        this.sort();
    };
    Cell.prototype.remove = function (from, to) {
        this.cells = this.cells.filter(function (cell) {
            return !(cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y);
        });
        this.sort();
    };
    Cell.prototype.open = function (from, to) {
        this.cells = this.cells.map(function (cell) {
            if (cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y)
                cell.open = true;
            return cell;
        });
    };
    Cell.prototype.close = function (from, to) {
        this.cells = this.cells.map(function (cell) {
            if (cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y)
                cell.open = false;
            return cell;
        });
    };
    Cell.prototype.get = function (from, to) {
        this.sort();
        return this.cells.filter(function (cell) {
            return cell.x >= from.x && cell.x <= to.x && cell.y >= from.y && cell.y <= to.y;
        });
    };
    Cell.prototype.sort = function () {
        var cmp = function (a, b) { return ~~(a > b) - ~~(a < b); };
        this.cells = this.cells.sort(function (a, b) { return cmp(a.y, b.y) || cmp(a.x, b.x); });
    };
    return Cell;
}());
/* harmony default export */ __webpack_exports__["default"] = (Cell);


/***/ }),

/***/ "./src/grid.ts":
/*!*********************!*\
  !*** ./src/grid.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widget */ "./src/widget.ts");
/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cell */ "./src/cell.ts");


var Grid = (function () {
    function Grid(FlexGrid) {
        var _this = this;
        this.FlexGrid = FlexGrid;
        this.Cell = new _cell__WEBPACK_IMPORTED_MODULE_1__["default"](this);
        this.Widget = new _widget__WEBPACK_IMPORTED_MODULE_0__["default"](FlexGrid, this);
        this.build();
        FlexGrid.addRow = function (rows) {
            if (rows === void 0) { rows = 1; }
            if (_this.FlexGrid.options.y == _this.FlexGrid.options.maxY)
                return;
            var from = { x: 1, y: _this.FlexGrid.options.y + 1 };
            if (_this.FlexGrid.options.y > _this.FlexGrid.options.maxY)
                _this.FlexGrid.options.y = _this.FlexGrid.options.maxY;
            else
                _this.FlexGrid.options.y += rows;
            _this.Cell.add(from, { x: _this.FlexGrid.options.x, y: _this.FlexGrid.options.y });
            _this.style();
        };
        FlexGrid.removeRow = function (rows) {
            if (rows === void 0) { rows = 1; }
            if (_this.FlexGrid.options.y == _this.FlexGrid.options.minY)
                return;
            var to = { x: _this.FlexGrid.options.x, y: _this.FlexGrid.options.y };
            if (_this.FlexGrid.options.y < _this.FlexGrid.options.minY)
                _this.FlexGrid.options.y = _this.FlexGrid.options.minY;
            else
                _this.FlexGrid.options.y -= rows;
            _this.Cell.remove({ x: 1, y: _this.FlexGrid.options.y + 1 }, to);
            _this.style();
        };
        FlexGrid.addColumn = function (columns) {
            if (columns === void 0) { columns = 1; }
            if (_this.FlexGrid.options.x == _this.FlexGrid.options.maxX)
                return;
            var from = { x: _this.FlexGrid.options.x + 1, y: 1 };
            if (_this.FlexGrid.options.x > _this.FlexGrid.options.maxX)
                _this.FlexGrid.options.x = _this.FlexGrid.options.maxX;
            else
                _this.FlexGrid.options.x += columns;
            _this.Cell.add(from, { x: _this.FlexGrid.options.x, y: _this.FlexGrid.options.y });
            _this.style();
        };
        FlexGrid.removeColumn = function (columns) {
            if (columns === void 0) { columns = 1; }
            if (_this.FlexGrid.options.x == _this.FlexGrid.options.minX)
                return;
            var to = { x: _this.FlexGrid.options.x, y: _this.FlexGrid.options.y };
            if (_this.FlexGrid.options.x < _this.FlexGrid.options.minX)
                _this.FlexGrid.options.x = _this.FlexGrid.options.minX;
            else
                _this.FlexGrid.options.x -= columns;
            _this.Cell.remove({ x: _this.FlexGrid.options.y + 1, y: 1 }, to);
            _this.style();
        };
    }
    Grid.prototype.findSpace = function (width, height, from, to, x, y) {
        if (x === void 0) { x = 'min'; }
        if (y === void 0) { y = 'min'; }
        var info = { x: 0, y: 0 };
        var cells = this.Cell.get(from, to).filter(function (cell) { return cell.open; });
        if (cells.length < width * height)
            return false;
        var cmp = function (a, b) { return ~~(a > b) - ~~(a < b); };
        cells.sort(function (a, b) { return (y == 'max' ? cmp(b.y, a.y) : cmp(a.y, b.y)) || (x == 'max' ? cmp(b.x, a.x) : cmp(a.x, b.x)); });
        var area = [];
        var i = 0;
        do {
            if (!cells[i])
                break;
            info.x = cells[i].x;
            info.y = cells[i].y;
            area = cells.filter(function (cell) { return cell.x >= info.x && cell.x <= (info.x + width - 1) && cell.y >= info.y && cell.y <= (info.y + height - 1); });
            if (area.length == width * height)
                break;
            i++;
        } while (area.length !== width * height);
        return (area.length == width * height) && info;
    };
    Grid.prototype.build = function () {
        this.FlexGrid.display.grid = document.createElement('div');
        this.FlexGrid.display.grid.classList.add('flexgrid-grid');
        this.FlexGrid.display.wrapper.appendChild(this.FlexGrid.display.grid);
        this.style();
    };
    Grid.prototype.style = function () {
        this.Cell.size = this.FlexGrid.options.responsive || !this.Cell.size ? this.FlexGrid.display.grid.offsetWidth / this.FlexGrid.options.x : this.Cell.size;
        this.FlexGrid.display.grid.style.height = "".concat(this.Cell.size * this.FlexGrid.options.y, "px");
        this.FlexGrid.display.grid.style.width = this.FlexGrid.options.responsive ? 'auto' : "".concat(this.Cell.size * this.FlexGrid.options.x, "px");
        this.FlexGrid.display.grid.style.backgroundSize = "".concat(this.Cell.size, "px ").concat(this.Cell.size, "px");
    };
    Grid.options = {
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
        dragstart: (function () { }),
        drag: (function () { }),
        dragstop: (function () { }),
        resizestart: (function () { }),
        resize: (function () { }),
        resizestop: (function () { }),
        change: (function () { }),
    };
    return Grid;
}());
/* harmony default export */ __webpack_exports__["default"] = (Grid);
Grid.validateGridOptions = function (options) {
    var _a;
    var _b;
    for (var option in Grid.options)
        (_a = (_b = options)[option]) !== null && _a !== void 0 ? _a : (_b[option] = Grid.options[option]);
    if (options.x > options.maxX)
        throw new Error('FlexGrid: Option "x" must be less than or equal to the value of option "maxX".');
    if (options.minX < 1 || options.minX > options.x)
        throw new Error('FlexGrid: Option "minX" must be greater than or equal to 1 and less than or equal to the value of option "x".');
    if (options.y > options.maxY)
        throw new Error('FlexGrid: Option "y" must be less than or equal to the value of option "maxY".');
    if (options.minY < 1 || options.minY > options.y)
        throw new Error('FlexGrid: Option "minY" must be greater than or equal to 1 and less than or equal to the value of option "y".');
    var widgetOptions = _widget__WEBPACK_IMPORTED_MODULE_0__["default"].validateWidgetOptions(options);
    for (var option in widgetOptions)
        options[option] = widgetOptions[option];
    return options;
};


/***/ }),

/***/ "./src/widget.ts":
/*!***********************!*\
  !*** ./src/widget.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var to_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! to-array */ "./node_modules/to-array/index.js");
/* harmony import */ var to_array__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(to_array__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uniqid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uniqid */ "./node_modules/uniqid/index.js");
/* harmony import */ var uniqid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uniqid__WEBPACK_IMPORTED_MODULE_1__);


var Widget = (function () {
    function Widget(FlexGrid, Grid) {
        var _this = this;
        this.FlexGrid = FlexGrid;
        this.Grid = Grid;
        this.FlexGrid.display.widgets = [];
        this.FlexGrid.addWidget = function (options) {
            var _a, _b;
            var _c;
            if (options === void 0) { options = {}; }
            var uid = uniqid__WEBPACK_IMPORTED_MODULE_1___default()();
            var options = Widget.validateWidgetOptions(options);
            options.customClass.widget = options.customClass.widget || _this.FlexGrid.options.customClass.widget;
            options.customClass.helper = options.customClass.helper || _this.FlexGrid.options.customClass.helper;
            options.customClass.placeholder = options.customClass.placeholder || _this.FlexGrid.options.customClass.placeholder;
            for (var option in options)
                (_a = (_c = options)[option]) !== null && _a !== void 0 ? _a : (_c[option] = _this.FlexGrid.options[option]);
            var space = _this.Grid.findSpace(options.width, options.height, { x: options.x, y: options.y }, { x: options.x + options.width - 1, y: options.y + options.height - 1 }) || _this.Grid.findSpace(options.width, options.height, { x: 1, y: 1 }, { x: _this.FlexGrid.options.x, y: _this.FlexGrid.options.y });
            if (space) {
                options.x = space.x;
                options.y = space.y;
            }
            else
                return;
            var widget = document.createElement('div');
            widget.classList.add('flexgrid-widget', options.customClass.widget);
            widget.dataset.flexgridWidgetWidth = options.width.toString();
            widget.dataset.flexgridWidgetHeight = options.height.toString();
            widget.dataset.flexgridWidgetMaxWidth = options.maxWidth.toString();
            widget.dataset.flexgridWidgetMaxHeight = options.maxHeight.toString();
            widget.dataset.flexgridWidgetX = options.x.toString();
            widget.dataset.flexgridWidgetY = options.y.toString();
            widget.dataset.flexgridWidgetId = uid;
            widget.style.width = "".concat(options.width * _this.Grid.Cell.size, "px");
            widget.style.height = "".concat(options.height * _this.Grid.Cell.size, "px");
            widget.style.top = "".concat((options.y - 1) * _this.Grid.Cell.size, "px");
            widget.style.left = "".concat((options.x - 1) * _this.Grid.Cell.size, "px");
            var inner = document.createElement('div');
            inner.classList.add('flexgrid-widget--inner');
            inner.innerHTML = (_b = options.template) !== null && _b !== void 0 ? _b : '';
            widget.appendChild(inner);
            _this.FlexGrid.display.widgets.push(widget);
            _this.FlexGrid.widgets[uid] = {
                x: options.x,
                y: options.y,
                width: options.width,
                height: options.height,
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight
            };
            _this.Grid.Cell.close({ x: options.x, y: options.y }, { x: options.x + options.width - 1, y: options.y + options.height - 1 });
            if (_this.FlexGrid.options.draggable) {
                widget.classList.add('flexgrid-widget-draggable');
                var dragHandles = to_array__WEBPACK_IMPORTED_MODULE_0___default()(widget.querySelectorAll(options.dragHandle));
                for (var _i = 0, dragHandles_1 = dragHandles; _i < dragHandles_1.length; _i++) {
                    var handle_1 = dragHandles_1[_i];
                    handle_1.classList.add('flexgrid-drag-handle');
                    handle_1.addEventListener('mousedown', _this.FlexGrid.dragstart);
                }
            }
            if (_this.FlexGrid.options.resizable) {
                widget.classList.add('flexgrid-widget-resizable');
                window.addEventListener('mousemove', _this.FlexGrid.resize);
                window.addEventListener('mouseup', _this.FlexGrid.resizestop);
                var resizeHandles = options.resizeHandles.split(',').map(function (o) { return o.trim(); }).filter(function (o) { return ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'].includes(o); });
                for (var _d = 0, resizeHandles_1 = resizeHandles; _d < resizeHandles_1.length; _d++) {
                    var name_1 = resizeHandles_1[_d];
                    var handle = document.createElement('span');
                    handle.classList.add('flexgrid-resize-handle', "flexgrid-resize-handle--".concat(name_1));
                    window.addEventListener('mousedown', _this.FlexGrid.resizestart);
                    widget.appendChild(handle);
                }
            }
            _this.FlexGrid.display.grid.appendChild(widget);
            return widget;
        };
        this.FlexGrid.removeWidget = function (uidorel) {
            var widget = typeof uidorel === 'string' ? _this.FlexGrid.display.grid.querySelector(".flexgrid-widget[data-widget-id=\"".concat(uidorel, "\"]")) : uidorel;
            var uid = widget.dataset.flexgridWidgetId;
            var info = _this.FlexGrid.widgets[uid];
            _this.Grid.Cell.open({ x: info.x, y: info.y }, { x: info.x + info.width - 1, y: info.y + info.height - 1 });
            _this.FlexGrid.display.grid.removeChild(widget);
            _this.FlexGrid.display.widgets = _this.FlexGrid.display.widgets.filter(function (o) { return o.dataset.flexgridWidgetId != uid; });
            delete _this.FlexGrid.widgets[uid];
        };
        this.FlexGrid.clear = function () {
            for (var _i = 0, _a = _this.FlexGrid.display.widgets; _i < _a.length; _i++) {
                var widget = _a[_i];
                _this.FlexGrid.display.grid.removeChild(widget);
            }
            _this.FlexGrid.display.widgets = [];
            _this.FlexGrid.widgets = {};
            _this.Grid.Cell.open({ x: 1, y: 1 }, { x: _this.FlexGrid.options.x, y: _this.FlexGrid.options.y });
        };
        this.FlexGrid.load = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var options = data_1[_i];
                _this.FlexGrid.addWidget(options);
            }
        };
        this.FlexGrid.save = function () { };
        this.FlexGrid.dragstart = function (e) {
            if (_this.FlexGrid.dragging)
                return;
            var grid = _this.FlexGrid.display.grid;
            var widget = e.target.closest('.flexgrid-widget');
            widget.classList.add('flexgrid-widget-dragging');
            var bounds = widget.getBoundingClientRect();
            var uid = widget.dataset.flexgridWidgetId;
            var info = _this.FlexGrid.widgets[uid];
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
            _this.Grid.Cell.open({ x: info.x, y: info.y }, { x: info.x + info.width - 1, y: info.y + info.height - 1 });
            var placeholder = document.createElement('div');
            placeholder.classList.add('flexgrid-widget-placeholder', _this.FlexGrid.options.customClass.placeholder);
            placeholder.dataset.flexgridWidgetId = uid;
            placeholder.style.width = widget.querySelector('.flexgrid-widget--inner').offsetWidth + 'px';
            placeholder.style.height = widget.querySelector('.flexgrid-widget--inner').offsetHeight + 'px';
            placeholder.style.left = (info.x - 1) * _this.Grid.Cell.size + 'px';
            placeholder.style.top = (info.y - 1) * _this.Grid.Cell.size + 'px';
            grid.insertBefore(placeholder, grid.firstElementChild);
            _this.FlexGrid.dragging = true;
        };
        this.FlexGrid.drag = function (event, widget) {
            if (!_this.FlexGrid.dragging)
                return;
            var grid = _this.FlexGrid.display.grid;
            var gridBounds = grid.getBoundingClientRect();
            var uid = widget.dataset.flexgridWidgetId;
            var info = _this.FlexGrid.widgets[uid];
            info.drag.x = Math.round(widget.offsetLeft / _this.Grid.Cell.size) + 1;
            info.drag.y = Math.round(widget.offsetTop / _this.Grid.Cell.size) + 1;
            var x = info.drag.x < 1 ? 1 : info.drag.x + info.width > _this.FlexGrid.options.x ? _this.FlexGrid.options.x - info.width + 1 : info.drag.x;
            var y = info.drag.y < 1 ? 1 : info.drag.y + info.height > _this.FlexGrid.options.y ? _this.FlexGrid.options.y - info.height + 1 : info.drag.y;
            var n = y < info.y ? 'n' : null;
            var e = x > info.x ? 'e' : null;
            var s = y > info.y ? 's' : null;
            var w = x < info.x ? 'w' : null;
            info.x = x;
            info.y = y;
            var direction = info.drag.collision ? info.drag.direction : n || e || s || w || info.drag.direction;
            console.log(direction);
            info.drag.direction = direction;
            _this.FlexGrid.widgets[uid] = info;
            var collision = _this.collision('drag', uid);
            info = _this.FlexGrid.widgets[uid];
            widget.style.left = event.clientX - gridBounds.left - info.drag.cursor.left + 'px';
            widget.style.top = event.clientY - gridBounds.top - info.drag.cursor.top + 'px';
            var placeholder = grid.querySelector('.flexgrid-widget-placeholder[data-flexgrid-widget-id="' + uid + '"]');
            placeholder.style.left = (info.x - 1) * _this.Grid.Cell.size + 'px';
            placeholder.style.top = (info.y - 1) * _this.Grid.Cell.size + 'px';
        };
        this.FlexGrid.dragstop = function (e, widget) {
            if (!_this.FlexGrid.dragging)
                return;
            var grid = _this.FlexGrid.display.grid;
            var gridBounds = grid.getBoundingClientRect();
            var uid = widget.dataset.flexgridWidgetId;
            var info = _this.FlexGrid.widgets[uid];
            delete info.drag;
            _this.FlexGrid.widgets[uid] = info;
            _this.Grid.Cell.close({ x: info.x, y: info.y }, { x: info.x + info.width - 1, y: info.y + info.height - 1 });
            widget.style.left = (info.x - 1) * _this.Grid.Cell.size + 'px';
            widget.style.top = (info.y - 1) * _this.Grid.Cell.size + 'px';
            var placeholder = grid.querySelector('.flexgrid-widget-placeholder[data-flexgrid-widget-id="' + uid + '"]');
            grid.removeChild(placeholder);
            widget.classList.remove('flexgrid-widget-dragging');
            _this.FlexGrid.dragging = false;
        };
    }
    Widget.prototype.collision = function (method, uid) {
        if (method === void 0) { method = ''; }
        if (uid === void 0) { uid = ''; }
        if (!['drag', 'sort', 'resize'].includes(method))
            return true;
        var grid = this.FlexGrid.display.grid;
        var info = this.FlexGrid.widgets[uid];
        if (method == 'drag') {
            info.drag.collision = false;
            var cells = this.Grid.Cell.get({ x: info.x, y: info.y }, { x: info.x + info.width - 1, y: info.y + info.height - 1 });
            if (cells.length != info.width * info.height || cells.filter(function (cell) { return !cell.open; }).length) {
                var space;
                if (info.drag.direction == 'n') {
                    var spaces = [this.Grid.findSpace(info.width, info.height, { x: info.x, y: info.y }, { x: this.FlexGrid.options.x, y: this.FlexGrid.options.y }), this.Grid.findSpace(info.width, info.height, { x: 1, y: info.y }, { x: info.x + info.width - 1, y: this.FlexGrid.options.y }, 'max')];
                    if (spaces[0] && spaces[1]) {
                        space = spaces.reduce(function (acc, obj) { return Math.abs(info.drag.x - obj.x) < Math.abs(info.drag.x - acc.x) ? obj : acc; });
                    }
                    else
                        space = spaces[0] || spaces[1];
                }
                if (info.drag.direction == 's') {
                    var spaces = [this.Grid.findSpace(info.width, info.height, { x: info.x, y: info.y + info.height - 1 }, { x: this.FlexGrid.options.x, y: 1 }, 'min', 'max'), this.Grid.findSpace(info.width, info.height, { x: 1, y: info.y + info.height - 1 }, { x: info.x + info.width - 1, y: 1 }, 'max', 'max')];
                    if (spaces[0] && spaces[1]) {
                        space = spaces.reduce(function (acc, obj) { return Math.abs(info.drag.x - obj.x) < Math.abs(info.drag.x - acc.x) ? obj : acc; });
                    }
                    else
                        space = spaces[0] || spaces[1];
                }
                if (info.drag.direction == 'e') {
                    space = this.Grid.findSpace(info.width, info.height, { x: 1, y: info.y }, { x: info.x + info.width - 1, y: info.y + info.height - 1 });
                }
                if (info.drag.direction == 'w') {
                    space = this.Grid.findSpace(info.width, info.height, { x: info.x, y: info.y }, { x: this.FlexGrid.options.x, y: info.y + info.height - 1 });
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
    };
    Widget.options = {
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
    return Widget;
}());
/* harmony default export */ __webpack_exports__["default"] = (Widget);
Widget.validateWidgetOptions = function (options) {
    var _a;
    var _b;
    for (var option in Widget.options)
        (_a = (_b = options)[option]) !== null && _a !== void 0 ? _a : (_b[option] = Widget.options[option]);
    if (options.minWidth < 1 || options.minWidth > options.width)
        throw new Error('FlexGrid: Option "minWidth" must be greater than or equal to 1 and less than or equal to the value of option "width".');
    if (options.width > options.maxWidth)
        throw new Error('FlexGrid: Option "width" must be less than or equal to the value of option "maxWidth".');
    if (options.minHeight < 1 || options.minHeight > options.height)
        throw new Error('FlexGrid: Option "minHeight" must be greater than or equal to 1 and less than or equal to the value of option "height".');
    if (options.height > options.maxHeight)
        throw new Error('FlexGrid: Option "height" must be less than or equal to the value of option "maxHeight".');
    return options;
};


/***/ }),

/***/ "./node_modules/uniqid/index.js":
/*!**************************************!*\
  !*** ./node_modules/uniqid/index.js ***!
  \**************************************/
/***/ (function(module) {

/* 
(The MIT License)
Copyright (c) 2014-2021 Halász Ádám <adam@aimform.com>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//  Unique Hexatridecimal ID Generator
// ================================================

//  Dependencies
// ================================================
var pid = typeof process !== 'undefined' && process.pid ? process.pid.toString(36) : '' ;
var address = '';
if(false){ var i, networkInterfaces, mac, os; } 

//  Exports
// ================================================
module.exports = module.exports["default"] = function(prefix, suffix){ return (prefix ? prefix : '') + address + pid + now().toString(36) + (suffix ? suffix : ''); }
module.exports.process = function(prefix, suffix){ return (prefix ? prefix : '') + pid + now().toString(36) + (suffix ? suffix : ''); }
module.exports.time    = function(prefix, suffix){ return (prefix ? prefix : '') + now().toString(36) + (suffix ? suffix : ''); }

//  Helpers
// ================================================
function now(){
    var time = Date.now();
    var last = now.last || time;
    return now.last = time > last ? time : last + 1;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*************************!*\
  !*** ./src/flexgrid.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var to_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! to-array */ "./node_modules/to-array/index.js");
/* harmony import */ var to_array__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(to_array__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid */ "./src/grid.ts");


var FlexGrid = (function () {
    function FlexGrid(wrapper, options) {
        var _this = this;
        this.dragging = false;
        this.display = {};
        this.widgets = {};
        this.setOption = function (option, value) {
            if (_grid__WEBPACK_IMPORTED_MODULE_1__["default"].options[option] == undefined)
                throw new Error("FlexGrid: Option \"".concat(option, "\" does not exist."));
            _this.options[option] = value;
            _grid__WEBPACK_IMPORTED_MODULE_1__["default"].validateGridOptions(_this.options);
        };
        this.options = this.validateFlexGridOptions(options);
        this.display.wrapper = wrapper;
        this.display.wrapper.FlexGrid = this;
        this.display.wrapper.classList.add('flexgrid');
        new _grid__WEBPACK_IMPORTED_MODULE_1__["default"](this);
        window.addEventListener('mousemove', function (e) {
            if (!_this.dragging)
                return;
            _this.drag(e, _this.display.grid.querySelector('.flexgrid-widget-dragging'));
        });
        window.addEventListener('mouseup', function (e) {
            if (!_this.dragging)
                return;
            _this.dragstop(e, _this.display.grid.querySelector('.flexgrid-widget-dragging'));
        });
    }
    FlexGrid.prototype.validateFlexGridOptions = function (options) {
        var _a;
        var _b;
        for (var option in FlexGrid.options)
            (_a = (_b = options)[option]) !== null && _a !== void 0 ? _a : (_b[option] = FlexGrid.options[option]);
        var gridOptions = _grid__WEBPACK_IMPORTED_MODULE_1__["default"].validateGridOptions(options);
        for (var option in gridOptions)
            options[option] = gridOptions[option];
        return options;
    };
    FlexGrid.options = _grid__WEBPACK_IMPORTED_MODULE_1__["default"].options;
    return FlexGrid;
}());
/* harmony default export */ __webpack_exports__["default"] = (FlexGrid);
FlexGrid.init = function (options, selector) {
    if (options === void 0) { options = {}; }
    if (selector === void 0) { selector = '.flexgrid'; }
    var elements = typeof selector === 'string' ? to_array__WEBPACK_IMPORTED_MODULE_0___default()(document.querySelectorAll(selector)) : [selector];
    elements.forEach(function (element) { return new FlexGrid(element, options); });
};
FlexGrid.destroy = function (selector) { };
window.FlexGrid = FlexGrid;

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dG8tYXJyYXkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZmxleGdyaWQvLi9zcmMvY2VsbC50cyIsIndlYnBhY2s6Ly9mbGV4Z3JpZC8uL3NyYy9ncmlkLnRzIiwid2VicGFjazovL2ZsZXhncmlkLy4vc3JjL3dpZGdldC50cyIsIndlYnBhY2s6Ly9mbGV4Z3JpZC8uL25vZGVfbW9kdWxlcy91bmlxaWQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZmxleGdyaWQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxleGdyaWQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZmxleGdyaWQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZsZXhncmlkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmxleGdyaWQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mbGV4Z3JpZC8uL3NyYy9mbGV4Z3JpZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHRvQXJyYXlcblxuZnVuY3Rpb24gdG9BcnJheShsaXN0LCBpbmRleCkge1xuICAgIHZhciBhcnJheSA9IFtdXG5cbiAgICBpbmRleCA9IGluZGV4IHx8IDBcblxuICAgIGZvciAodmFyIGkgPSBpbmRleCB8fCAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheVtpIC0gaW5kZXhdID0gbGlzdFtpXVxuICAgIH1cblxuICAgIHJldHVybiBhcnJheVxufVxuIiwidmFyIENlbGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENlbGwoR3JpZCkge1xuICAgICAgICB0aGlzLmNlbGxzID0gW107XG4gICAgICAgIHRoaXMuR3JpZCA9IEdyaWQ7XG4gICAgICAgIHRoaXMuYWRkKHsgeDogMSwgeTogMSB9LCB7IHg6IHRoaXMuR3JpZC5GbGV4R3JpZC5vcHRpb25zLngsIHk6IHRoaXMuR3JpZC5GbGV4R3JpZC5vcHRpb25zLnkgfSk7XG4gICAgfVxuICAgIENlbGwucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgICAgICBmb3IgKHZhciB4ID0gZnJvbS54OyB4IDwgdG8ueCArIDE7IHgrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IGZyb20ueTsgeSA8IHRvLnkgKyAxOyB5KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2goeyB4OiB4LCB5OiB5LCBvcGVuOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc29ydCgpO1xuICAgIH07XG4gICAgQ2VsbC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgICAgIHRoaXMuY2VsbHMgPSB0aGlzLmNlbGxzLmZpbHRlcihmdW5jdGlvbiAoY2VsbCkge1xuICAgICAgICAgICAgcmV0dXJuICEoY2VsbC54ID49IGZyb20ueCAmJiBjZWxsLnggPD0gdG8ueCAmJiBjZWxsLnkgPj0gZnJvbS55ICYmIGNlbGwueSA8PSB0by55KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc29ydCgpO1xuICAgIH07XG4gICAgQ2VsbC5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgICAgICB0aGlzLmNlbGxzID0gdGhpcy5jZWxscy5tYXAoZnVuY3Rpb24gKGNlbGwpIHtcbiAgICAgICAgICAgIGlmIChjZWxsLnggPj0gZnJvbS54ICYmIGNlbGwueCA8PSB0by54ICYmIGNlbGwueSA+PSBmcm9tLnkgJiYgY2VsbC55IDw9IHRvLnkpXG4gICAgICAgICAgICAgICAgY2VsbC5vcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENlbGwucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgICAgIHRoaXMuY2VsbHMgPSB0aGlzLmNlbGxzLm1hcChmdW5jdGlvbiAoY2VsbCkge1xuICAgICAgICAgICAgaWYgKGNlbGwueCA+PSBmcm9tLnggJiYgY2VsbC54IDw9IHRvLnggJiYgY2VsbC55ID49IGZyb20ueSAmJiBjZWxsLnkgPD0gdG8ueSlcbiAgICAgICAgICAgICAgICBjZWxsLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENlbGwucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMuZmlsdGVyKGZ1bmN0aW9uIChjZWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY2VsbC54ID49IGZyb20ueCAmJiBjZWxsLnggPD0gdG8ueCAmJiBjZWxsLnkgPj0gZnJvbS55ICYmIGNlbGwueSA8PSB0by55O1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENlbGwucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbXAgPSBmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gfn4oYSA+IGIpIC0gfn4oYSA8IGIpOyB9O1xuICAgICAgICB0aGlzLmNlbGxzID0gdGhpcy5jZWxscy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBjbXAoYS55LCBiLnkpIHx8IGNtcChhLngsIGIueCk7IH0pO1xuICAgIH07XG4gICAgcmV0dXJuIENlbGw7XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgQ2VsbDtcbiIsImltcG9ydCBXaWRnZXQgZnJvbSAnLi93aWRnZXQnO1xuaW1wb3J0IENlbGwgZnJvbSAnLi9jZWxsJztcbnZhciBHcmlkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBHcmlkKEZsZXhHcmlkKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuRmxleEdyaWQgPSBGbGV4R3JpZDtcbiAgICAgICAgdGhpcy5DZWxsID0gbmV3IENlbGwodGhpcyk7XG4gICAgICAgIHRoaXMuV2lkZ2V0ID0gbmV3IFdpZGdldChGbGV4R3JpZCwgdGhpcyk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgRmxleEdyaWQuYWRkUm93ID0gZnVuY3Rpb24gKHJvd3MpIHtcbiAgICAgICAgICAgIGlmIChyb3dzID09PSB2b2lkIDApIHsgcm93cyA9IDE7IH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgPT0gX3RoaXMuRmxleEdyaWQub3B0aW9ucy5tYXhZKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBmcm9tID0geyB4OiAxLCB5OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgKyAxIH07XG4gICAgICAgICAgICBpZiAoX3RoaXMuRmxleEdyaWQub3B0aW9ucy55ID4gX3RoaXMuRmxleEdyaWQub3B0aW9ucy5tYXhZKVxuICAgICAgICAgICAgICAgIF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueSA9IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMubWF4WTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgKz0gcm93cztcbiAgICAgICAgICAgIF90aGlzLkNlbGwuYWRkKGZyb20sIHsgeDogX3RoaXMuRmxleEdyaWQub3B0aW9ucy54LCB5OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgfSk7XG4gICAgICAgICAgICBfdGhpcy5zdHlsZSgpO1xuICAgICAgICB9O1xuICAgICAgICBGbGV4R3JpZC5yZW1vdmVSb3cgPSBmdW5jdGlvbiAocm93cykge1xuICAgICAgICAgICAgaWYgKHJvd3MgPT09IHZvaWQgMCkgeyByb3dzID0gMTsgfVxuICAgICAgICAgICAgaWYgKF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueSA9PSBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLm1pblkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIHRvID0geyB4OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLngsIHk6IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueSB9O1xuICAgICAgICAgICAgaWYgKF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueSA8IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMubWluWSlcbiAgICAgICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgPSBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLm1pblk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQub3B0aW9ucy55IC09IHJvd3M7XG4gICAgICAgICAgICBfdGhpcy5DZWxsLnJlbW92ZSh7IHg6IDEsIHk6IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueSArIDEgfSwgdG8pO1xuICAgICAgICAgICAgX3RoaXMuc3R5bGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgRmxleEdyaWQuYWRkQ29sdW1uID0gZnVuY3Rpb24gKGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW5zID09PSB2b2lkIDApIHsgY29sdW1ucyA9IDE7IH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnggPT0gX3RoaXMuRmxleEdyaWQub3B0aW9ucy5tYXhYKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBmcm9tID0geyB4OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnggKyAxLCB5OiAxIH07XG4gICAgICAgICAgICBpZiAoX3RoaXMuRmxleEdyaWQub3B0aW9ucy54ID4gX3RoaXMuRmxleEdyaWQub3B0aW9ucy5tYXhYKVxuICAgICAgICAgICAgICAgIF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueCA9IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMubWF4WDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnggKz0gY29sdW1ucztcbiAgICAgICAgICAgIF90aGlzLkNlbGwuYWRkKGZyb20sIHsgeDogX3RoaXMuRmxleEdyaWQub3B0aW9ucy54LCB5OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgfSk7XG4gICAgICAgICAgICBfdGhpcy5zdHlsZSgpO1xuICAgICAgICB9O1xuICAgICAgICBGbGV4R3JpZC5yZW1vdmVDb2x1bW4gPSBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICAgICAgaWYgKGNvbHVtbnMgPT09IHZvaWQgMCkgeyBjb2x1bW5zID0gMTsgfVxuICAgICAgICAgICAgaWYgKF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueCA9PSBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLm1pblgpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIHRvID0geyB4OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLngsIHk6IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueSB9O1xuICAgICAgICAgICAgaWYgKF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueCA8IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMubWluWClcbiAgICAgICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnggPSBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLm1pblg7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQub3B0aW9ucy54IC09IGNvbHVtbnM7XG4gICAgICAgICAgICBfdGhpcy5DZWxsLnJlbW92ZSh7IHg6IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMueSArIDEsIHk6IDEgfSwgdG8pO1xuICAgICAgICAgICAgX3RoaXMuc3R5bGUoKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgR3JpZC5wcm90b3R5cGUuZmluZFNwYWNlID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGZyb20sIHRvLCB4LCB5KSB7XG4gICAgICAgIGlmICh4ID09PSB2b2lkIDApIHsgeCA9ICdtaW4nOyB9XG4gICAgICAgIGlmICh5ID09PSB2b2lkIDApIHsgeSA9ICdtaW4nOyB9XG4gICAgICAgIHZhciBpbmZvID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHZhciBjZWxscyA9IHRoaXMuQ2VsbC5nZXQoZnJvbSwgdG8pLmZpbHRlcihmdW5jdGlvbiAoY2VsbCkgeyByZXR1cm4gY2VsbC5vcGVuOyB9KTtcbiAgICAgICAgaWYgKGNlbGxzLmxlbmd0aCA8IHdpZHRoICogaGVpZ2h0KVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgY21wID0gZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIH5+KGEgPiBiKSAtIH5+KGEgPCBiKTsgfTtcbiAgICAgICAgY2VsbHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gKHkgPT0gJ21heCcgPyBjbXAoYi55LCBhLnkpIDogY21wKGEueSwgYi55KSkgfHwgKHggPT0gJ21heCcgPyBjbXAoYi54LCBhLngpIDogY21wKGEueCwgYi54KSk7IH0pO1xuICAgICAgICB2YXIgYXJlYSA9IFtdO1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmICghY2VsbHNbaV0pXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpbmZvLnggPSBjZWxsc1tpXS54O1xuICAgICAgICAgICAgaW5mby55ID0gY2VsbHNbaV0ueTtcbiAgICAgICAgICAgIGFyZWEgPSBjZWxscy5maWx0ZXIoZnVuY3Rpb24gKGNlbGwpIHsgcmV0dXJuIGNlbGwueCA+PSBpbmZvLnggJiYgY2VsbC54IDw9IChpbmZvLnggKyB3aWR0aCAtIDEpICYmIGNlbGwueSA+PSBpbmZvLnkgJiYgY2VsbC55IDw9IChpbmZvLnkgKyBoZWlnaHQgLSAxKTsgfSk7XG4gICAgICAgICAgICBpZiAoYXJlYS5sZW5ndGggPT0gd2lkdGggKiBoZWlnaHQpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH0gd2hpbGUgKGFyZWEubGVuZ3RoICE9PSB3aWR0aCAqIGhlaWdodCk7XG4gICAgICAgIHJldHVybiAoYXJlYS5sZW5ndGggPT0gd2lkdGggKiBoZWlnaHQpICYmIGluZm87XG4gICAgfTtcbiAgICBHcmlkLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5GbGV4R3JpZC5kaXNwbGF5LmdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5GbGV4R3JpZC5kaXNwbGF5LmdyaWQuY2xhc3NMaXN0LmFkZCgnZmxleGdyaWQtZ3JpZCcpO1xuICAgICAgICB0aGlzLkZsZXhHcmlkLmRpc3BsYXkud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLkZsZXhHcmlkLmRpc3BsYXkuZ3JpZCk7XG4gICAgICAgIHRoaXMuc3R5bGUoKTtcbiAgICB9O1xuICAgIEdyaWQucHJvdG90eXBlLnN0eWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLkNlbGwuc2l6ZSA9IHRoaXMuRmxleEdyaWQub3B0aW9ucy5yZXNwb25zaXZlIHx8ICF0aGlzLkNlbGwuc2l6ZSA/IHRoaXMuRmxleEdyaWQuZGlzcGxheS5ncmlkLm9mZnNldFdpZHRoIC8gdGhpcy5GbGV4R3JpZC5vcHRpb25zLnggOiB0aGlzLkNlbGwuc2l6ZTtcbiAgICAgICAgdGhpcy5GbGV4R3JpZC5kaXNwbGF5LmdyaWQuc3R5bGUuaGVpZ2h0ID0gXCJcIi5jb25jYXQodGhpcy5DZWxsLnNpemUgKiB0aGlzLkZsZXhHcmlkLm9wdGlvbnMueSwgXCJweFwiKTtcbiAgICAgICAgdGhpcy5GbGV4R3JpZC5kaXNwbGF5LmdyaWQuc3R5bGUud2lkdGggPSB0aGlzLkZsZXhHcmlkLm9wdGlvbnMucmVzcG9uc2l2ZSA/ICdhdXRvJyA6IFwiXCIuY29uY2F0KHRoaXMuQ2VsbC5zaXplICogdGhpcy5GbGV4R3JpZC5vcHRpb25zLngsIFwicHhcIik7XG4gICAgICAgIHRoaXMuRmxleEdyaWQuZGlzcGxheS5ncmlkLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJcIi5jb25jYXQodGhpcy5DZWxsLnNpemUsIFwicHggXCIpLmNvbmNhdCh0aGlzLkNlbGwuc2l6ZSwgXCJweFwiKTtcbiAgICB9O1xuICAgIEdyaWQub3B0aW9ucyA9IHtcbiAgICAgICAgYWNjZXB0OiAnLmZsZXhncmlkLXdpZGdldCcsXG4gICAgICAgIHJlc3BvbnNpdmU6IHRydWUsXG4gICAgICAgIHg6IDEyLFxuICAgICAgICB5OiAxMixcbiAgICAgICAgbWluWDogMSxcbiAgICAgICAgbWluWTogMSxcbiAgICAgICAgbWF4WDogSW5maW5pdHksXG4gICAgICAgIG1heFk6IEluZmluaXR5LFxuICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgIGRyYWdIYW5kbGU6ICcuZmxleGdyaWQtd2lkZ2V0LS1pbm5lcicsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgICAgcmVzaXplSGFuZGxlczogJ3NlJyxcbiAgICAgICAgcmVzaXplR2hvc3Q6IGZhbHNlLFxuICAgICAgICBkcmFnc3RhcnQ6IChmdW5jdGlvbiAoKSB7IH0pLFxuICAgICAgICBkcmFnOiAoZnVuY3Rpb24gKCkgeyB9KSxcbiAgICAgICAgZHJhZ3N0b3A6IChmdW5jdGlvbiAoKSB7IH0pLFxuICAgICAgICByZXNpemVzdGFydDogKGZ1bmN0aW9uICgpIHsgfSksXG4gICAgICAgIHJlc2l6ZTogKGZ1bmN0aW9uICgpIHsgfSksXG4gICAgICAgIHJlc2l6ZXN0b3A6IChmdW5jdGlvbiAoKSB7IH0pLFxuICAgICAgICBjaGFuZ2U6IChmdW5jdGlvbiAoKSB7IH0pLFxuICAgIH07XG4gICAgcmV0dXJuIEdyaWQ7XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgR3JpZDtcbkdyaWQudmFsaWRhdGVHcmlkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBfYjtcbiAgICBmb3IgKHZhciBvcHRpb24gaW4gR3JpZC5vcHRpb25zKVxuICAgICAgICAoX2EgPSAoX2IgPSBvcHRpb25zKVtvcHRpb25dKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2Jbb3B0aW9uXSA9IEdyaWQub3B0aW9uc1tvcHRpb25dKTtcbiAgICBpZiAob3B0aW9ucy54ID4gb3B0aW9ucy5tYXhYKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZsZXhHcmlkOiBPcHRpb24gXCJ4XCIgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIG9wdGlvbiBcIm1heFhcIi4nKTtcbiAgICBpZiAob3B0aW9ucy5taW5YIDwgMSB8fCBvcHRpb25zLm1pblggPiBvcHRpb25zLngpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmxleEdyaWQ6IE9wdGlvbiBcIm1pblhcIiBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIG9wdGlvbiBcInhcIi4nKTtcbiAgICBpZiAob3B0aW9ucy55ID4gb3B0aW9ucy5tYXhZKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZsZXhHcmlkOiBPcHRpb24gXCJ5XCIgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIG9wdGlvbiBcIm1heFlcIi4nKTtcbiAgICBpZiAob3B0aW9ucy5taW5ZIDwgMSB8fCBvcHRpb25zLm1pblkgPiBvcHRpb25zLnkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmxleEdyaWQ6IE9wdGlvbiBcIm1pbllcIiBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAxIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIG9wdGlvbiBcInlcIi4nKTtcbiAgICB2YXIgd2lkZ2V0T3B0aW9ucyA9IFdpZGdldC52YWxpZGF0ZVdpZGdldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgZm9yICh2YXIgb3B0aW9uIGluIHdpZGdldE9wdGlvbnMpXG4gICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IHdpZGdldE9wdGlvbnNbb3B0aW9uXTtcbiAgICByZXR1cm4gb3B0aW9ucztcbn07XG4iLCJpbXBvcnQgdG9BcnJheSBmcm9tICd0by1hcnJheSc7XG5pbXBvcnQgdW5pcWlkIGZyb20gJ3VuaXFpZCc7XG52YXIgV2lkZ2V0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBXaWRnZXQoRmxleEdyaWQsIEdyaWQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5GbGV4R3JpZCA9IEZsZXhHcmlkO1xuICAgICAgICB0aGlzLkdyaWQgPSBHcmlkO1xuICAgICAgICB0aGlzLkZsZXhHcmlkLmRpc3BsYXkud2lkZ2V0cyA9IFtdO1xuICAgICAgICB0aGlzLkZsZXhHcmlkLmFkZFdpZGdldCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgdmFyIF9jO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICAgICAgICAgIHZhciB1aWQgPSB1bmlxaWQoKTtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gV2lkZ2V0LnZhbGlkYXRlV2lkZ2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgICAgIG9wdGlvbnMuY3VzdG9tQ2xhc3Mud2lkZ2V0ID0gb3B0aW9ucy5jdXN0b21DbGFzcy53aWRnZXQgfHwgX3RoaXMuRmxleEdyaWQub3B0aW9ucy5jdXN0b21DbGFzcy53aWRnZXQ7XG4gICAgICAgICAgICBvcHRpb25zLmN1c3RvbUNsYXNzLmhlbHBlciA9IG9wdGlvbnMuY3VzdG9tQ2xhc3MuaGVscGVyIHx8IF90aGlzLkZsZXhHcmlkLm9wdGlvbnMuY3VzdG9tQ2xhc3MuaGVscGVyO1xuICAgICAgICAgICAgb3B0aW9ucy5jdXN0b21DbGFzcy5wbGFjZWhvbGRlciA9IG9wdGlvbnMuY3VzdG9tQ2xhc3MucGxhY2Vob2xkZXIgfHwgX3RoaXMuRmxleEdyaWQub3B0aW9ucy5jdXN0b21DbGFzcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIGZvciAodmFyIG9wdGlvbiBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICAgIChfYSA9IChfYyA9IG9wdGlvbnMpW29wdGlvbl0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfY1tvcHRpb25dID0gX3RoaXMuRmxleEdyaWQub3B0aW9uc1tvcHRpb25dKTtcbiAgICAgICAgICAgIHZhciBzcGFjZSA9IF90aGlzLkdyaWQuZmluZFNwYWNlKG9wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0LCB7IHg6IG9wdGlvbnMueCwgeTogb3B0aW9ucy55IH0sIHsgeDogb3B0aW9ucy54ICsgb3B0aW9ucy53aWR0aCAtIDEsIHk6IG9wdGlvbnMueSArIG9wdGlvbnMuaGVpZ2h0IC0gMSB9KSB8fCBfdGhpcy5HcmlkLmZpbmRTcGFjZShvcHRpb25zLndpZHRoLCBvcHRpb25zLmhlaWdodCwgeyB4OiAxLCB5OiAxIH0sIHsgeDogX3RoaXMuRmxleEdyaWQub3B0aW9ucy54LCB5OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgfSk7XG4gICAgICAgICAgICBpZiAoc3BhY2UpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnggPSBzcGFjZS54O1xuICAgICAgICAgICAgICAgIG9wdGlvbnMueSA9IHNwYWNlLnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIHdpZGdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgd2lkZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZsZXhncmlkLXdpZGdldCcsIG9wdGlvbnMuY3VzdG9tQ2xhc3Mud2lkZ2V0KTtcbiAgICAgICAgICAgIHdpZGdldC5kYXRhc2V0LmZsZXhncmlkV2lkZ2V0V2lkdGggPSBvcHRpb25zLndpZHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB3aWRnZXQuZGF0YXNldC5mbGV4Z3JpZFdpZGdldEhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB3aWRnZXQuZGF0YXNldC5mbGV4Z3JpZFdpZGdldE1heFdpZHRoID0gb3B0aW9ucy5tYXhXaWR0aC50b1N0cmluZygpO1xuICAgICAgICAgICAgd2lkZ2V0LmRhdGFzZXQuZmxleGdyaWRXaWRnZXRNYXhIZWlnaHQgPSBvcHRpb25zLm1heEhlaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgd2lkZ2V0LmRhdGFzZXQuZmxleGdyaWRXaWRnZXRYID0gb3B0aW9ucy54LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB3aWRnZXQuZGF0YXNldC5mbGV4Z3JpZFdpZGdldFkgPSBvcHRpb25zLnkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHdpZGdldC5kYXRhc2V0LmZsZXhncmlkV2lkZ2V0SWQgPSB1aWQ7XG4gICAgICAgICAgICB3aWRnZXQuc3R5bGUud2lkdGggPSBcIlwiLmNvbmNhdChvcHRpb25zLndpZHRoICogX3RoaXMuR3JpZC5DZWxsLnNpemUsIFwicHhcIik7XG4gICAgICAgICAgICB3aWRnZXQuc3R5bGUuaGVpZ2h0ID0gXCJcIi5jb25jYXQob3B0aW9ucy5oZWlnaHQgKiBfdGhpcy5HcmlkLkNlbGwuc2l6ZSwgXCJweFwiKTtcbiAgICAgICAgICAgIHdpZGdldC5zdHlsZS50b3AgPSBcIlwiLmNvbmNhdCgob3B0aW9ucy55IC0gMSkgKiBfdGhpcy5HcmlkLkNlbGwuc2l6ZSwgXCJweFwiKTtcbiAgICAgICAgICAgIHdpZGdldC5zdHlsZS5sZWZ0ID0gXCJcIi5jb25jYXQoKG9wdGlvbnMueCAtIDEpICogX3RoaXMuR3JpZC5DZWxsLnNpemUsIFwicHhcIik7XG4gICAgICAgICAgICB2YXIgaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGlubmVyLmNsYXNzTGlzdC5hZGQoJ2ZsZXhncmlkLXdpZGdldC0taW5uZXInKTtcbiAgICAgICAgICAgIGlubmVyLmlubmVySFRNTCA9IChfYiA9IG9wdGlvbnMudGVtcGxhdGUpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICcnO1xuICAgICAgICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGlubmVyKTtcbiAgICAgICAgICAgIF90aGlzLkZsZXhHcmlkLmRpc3BsYXkud2lkZ2V0cy5wdXNoKHdpZGdldCk7XG4gICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC53aWRnZXRzW3VpZF0gPSB7XG4gICAgICAgICAgICAgICAgeDogb3B0aW9ucy54LFxuICAgICAgICAgICAgICAgIHk6IG9wdGlvbnMueSxcbiAgICAgICAgICAgICAgICB3aWR0aDogb3B0aW9ucy53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG9wdGlvbnMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1pbldpZHRoOiBvcHRpb25zLm1pbldpZHRoLFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogb3B0aW9ucy5taW5IZWlnaHQsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IG9wdGlvbnMubWF4V2lkdGgsXG4gICAgICAgICAgICAgICAgbWF4SGVpZ2h0OiBvcHRpb25zLm1heEhlaWdodFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIF90aGlzLkdyaWQuQ2VsbC5jbG9zZSh7IHg6IG9wdGlvbnMueCwgeTogb3B0aW9ucy55IH0sIHsgeDogb3B0aW9ucy54ICsgb3B0aW9ucy53aWR0aCAtIDEsIHk6IG9wdGlvbnMueSArIG9wdGlvbnMuaGVpZ2h0IC0gMSB9KTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5GbGV4R3JpZC5vcHRpb25zLmRyYWdnYWJsZSkge1xuICAgICAgICAgICAgICAgIHdpZGdldC5jbGFzc0xpc3QuYWRkKCdmbGV4Z3JpZC13aWRnZXQtZHJhZ2dhYmxlJyk7XG4gICAgICAgICAgICAgICAgdmFyIGRyYWdIYW5kbGVzID0gdG9BcnJheSh3aWRnZXQucXVlcnlTZWxlY3RvckFsbChvcHRpb25zLmRyYWdIYW5kbGUpKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGRyYWdIYW5kbGVzXzEgPSBkcmFnSGFuZGxlczsgX2kgPCBkcmFnSGFuZGxlc18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlXzEgPSBkcmFnSGFuZGxlc18xW19pXTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlXzEuY2xhc3NMaXN0LmFkZCgnZmxleGdyaWQtZHJhZy1oYW5kbGUnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlXzEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX3RoaXMuRmxleEdyaWQuZHJhZ3N0YXJ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuRmxleEdyaWQub3B0aW9ucy5yZXNpemFibGUpIHtcbiAgICAgICAgICAgICAgICB3aWRnZXQuY2xhc3NMaXN0LmFkZCgnZmxleGdyaWQtd2lkZ2V0LXJlc2l6YWJsZScpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfdGhpcy5GbGV4R3JpZC5yZXNpemUpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX3RoaXMuRmxleEdyaWQucmVzaXplc3RvcCk7XG4gICAgICAgICAgICAgICAgdmFyIHJlc2l6ZUhhbmRsZXMgPSBvcHRpb25zLnJlc2l6ZUhhbmRsZXMuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKG8pIHsgcmV0dXJuIG8udHJpbSgpOyB9KS5maWx0ZXIoZnVuY3Rpb24gKG8pIHsgcmV0dXJuIFsnbicsICdlJywgJ3MnLCAndycsICduZScsICdudycsICdzZScsICdzdyddLmluY2x1ZGVzKG8pOyB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfZCA9IDAsIHJlc2l6ZUhhbmRsZXNfMSA9IHJlc2l6ZUhhbmRsZXM7IF9kIDwgcmVzaXplSGFuZGxlc18xLmxlbmd0aDsgX2QrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZV8xID0gcmVzaXplSGFuZGxlc18xW19kXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2ZsZXhncmlkLXJlc2l6ZS1oYW5kbGUnLCBcImZsZXhncmlkLXJlc2l6ZS1oYW5kbGUtLVwiLmNvbmNhdChuYW1lXzEpKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF90aGlzLkZsZXhHcmlkLnJlc2l6ZXN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgd2lkZ2V0LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQuZGlzcGxheS5ncmlkLmFwcGVuZENoaWxkKHdpZGdldCk7XG4gICAgICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLkZsZXhHcmlkLnJlbW92ZVdpZGdldCA9IGZ1bmN0aW9uICh1aWRvcmVsKSB7XG4gICAgICAgICAgICB2YXIgd2lkZ2V0ID0gdHlwZW9mIHVpZG9yZWwgPT09ICdzdHJpbmcnID8gX3RoaXMuRmxleEdyaWQuZGlzcGxheS5ncmlkLnF1ZXJ5U2VsZWN0b3IoXCIuZmxleGdyaWQtd2lkZ2V0W2RhdGEtd2lkZ2V0LWlkPVxcXCJcIi5jb25jYXQodWlkb3JlbCwgXCJcXFwiXVwiKSkgOiB1aWRvcmVsO1xuICAgICAgICAgICAgdmFyIHVpZCA9IHdpZGdldC5kYXRhc2V0LmZsZXhncmlkV2lkZ2V0SWQ7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IF90aGlzLkZsZXhHcmlkLndpZGdldHNbdWlkXTtcbiAgICAgICAgICAgIF90aGlzLkdyaWQuQ2VsbC5vcGVuKHsgeDogaW5mby54LCB5OiBpbmZvLnkgfSwgeyB4OiBpbmZvLnggKyBpbmZvLndpZHRoIC0gMSwgeTogaW5mby55ICsgaW5mby5oZWlnaHQgLSAxIH0pO1xuICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQuZGlzcGxheS5ncmlkLnJlbW92ZUNoaWxkKHdpZGdldCk7XG4gICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC5kaXNwbGF5LndpZGdldHMgPSBfdGhpcy5GbGV4R3JpZC5kaXNwbGF5LndpZGdldHMuZmlsdGVyKGZ1bmN0aW9uIChvKSB7IHJldHVybiBvLmRhdGFzZXQuZmxleGdyaWRXaWRnZXRJZCAhPSB1aWQ7IH0pO1xuICAgICAgICAgICAgZGVsZXRlIF90aGlzLkZsZXhHcmlkLndpZGdldHNbdWlkXTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5GbGV4R3JpZC5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBfdGhpcy5GbGV4R3JpZC5kaXNwbGF5LndpZGdldHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHdpZGdldCA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC5kaXNwbGF5LmdyaWQucmVtb3ZlQ2hpbGQod2lkZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLkZsZXhHcmlkLmRpc3BsYXkud2lkZ2V0cyA9IFtdO1xuICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQud2lkZ2V0cyA9IHt9O1xuICAgICAgICAgICAgX3RoaXMuR3JpZC5DZWxsLm9wZW4oeyB4OiAxLCB5OiAxIH0sIHsgeDogX3RoaXMuRmxleEdyaWQub3B0aW9ucy54LCB5OiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuRmxleEdyaWQubG9hZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGRhdGFfMSA9IGRhdGE7IF9pIDwgZGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gZGF0YV8xW19pXTtcbiAgICAgICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC5hZGRXaWRnZXQob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuRmxleEdyaWQuc2F2ZSA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICAgICAgdGhpcy5GbGV4R3JpZC5kcmFnc3RhcnQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKF90aGlzLkZsZXhHcmlkLmRyYWdnaW5nKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBncmlkID0gX3RoaXMuRmxleEdyaWQuZGlzcGxheS5ncmlkO1xuICAgICAgICAgICAgdmFyIHdpZGdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5mbGV4Z3JpZC13aWRnZXQnKTtcbiAgICAgICAgICAgIHdpZGdldC5jbGFzc0xpc3QuYWRkKCdmbGV4Z3JpZC13aWRnZXQtZHJhZ2dpbmcnKTtcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSB3aWRnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgdWlkID0gd2lkZ2V0LmRhdGFzZXQuZmxleGdyaWRXaWRnZXRJZDtcbiAgICAgICAgICAgIHZhciBpbmZvID0gX3RoaXMuRmxleEdyaWQud2lkZ2V0c1t1aWRdO1xuICAgICAgICAgICAgaW5mby5kcmFnID0ge1xuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgICAgIHg6IGluZm8ueCxcbiAgICAgICAgICAgICAgICB5OiBpbmZvLnksXG4gICAgICAgICAgICAgICAgb3JpZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGluZm8ueCxcbiAgICAgICAgICAgICAgICAgICAgeTogaW5mby55XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogZS5jbGllbnRYIC0gYm91bmRzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogZS5jbGllbnRZIC0gYm91bmRzLnRvcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBfdGhpcy5HcmlkLkNlbGwub3Blbih7IHg6IGluZm8ueCwgeTogaW5mby55IH0sIHsgeDogaW5mby54ICsgaW5mby53aWR0aCAtIDEsIHk6IGluZm8ueSArIGluZm8uaGVpZ2h0IC0gMSB9KTtcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXIuY2xhc3NMaXN0LmFkZCgnZmxleGdyaWQtd2lkZ2V0LXBsYWNlaG9sZGVyJywgX3RoaXMuRmxleEdyaWQub3B0aW9ucy5jdXN0b21DbGFzcy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5kYXRhc2V0LmZsZXhncmlkV2lkZ2V0SWQgPSB1aWQ7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5zdHlsZS53aWR0aCA9IHdpZGdldC5xdWVyeVNlbGVjdG9yKCcuZmxleGdyaWQtd2lkZ2V0LS1pbm5lcicpLm9mZnNldFdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnN0eWxlLmhlaWdodCA9IHdpZGdldC5xdWVyeVNlbGVjdG9yKCcuZmxleGdyaWQtd2lkZ2V0LS1pbm5lcicpLm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5zdHlsZS5sZWZ0ID0gKGluZm8ueCAtIDEpICogX3RoaXMuR3JpZC5DZWxsLnNpemUgKyAncHgnO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXIuc3R5bGUudG9wID0gKGluZm8ueSAtIDEpICogX3RoaXMuR3JpZC5DZWxsLnNpemUgKyAncHgnO1xuICAgICAgICAgICAgZ3JpZC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIGdyaWQuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLkZsZXhHcmlkLmRyYWcgPSBmdW5jdGlvbiAoZXZlbnQsIHdpZGdldCkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy5GbGV4R3JpZC5kcmFnZ2luZylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgZ3JpZCA9IF90aGlzLkZsZXhHcmlkLmRpc3BsYXkuZ3JpZDtcbiAgICAgICAgICAgIHZhciBncmlkQm91bmRzID0gZ3JpZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciB1aWQgPSB3aWRnZXQuZGF0YXNldC5mbGV4Z3JpZFdpZGdldElkO1xuICAgICAgICAgICAgdmFyIGluZm8gPSBfdGhpcy5GbGV4R3JpZC53aWRnZXRzW3VpZF07XG4gICAgICAgICAgICBpbmZvLmRyYWcueCA9IE1hdGgucm91bmQod2lkZ2V0Lm9mZnNldExlZnQgLyBfdGhpcy5HcmlkLkNlbGwuc2l6ZSkgKyAxO1xuICAgICAgICAgICAgaW5mby5kcmFnLnkgPSBNYXRoLnJvdW5kKHdpZGdldC5vZmZzZXRUb3AgLyBfdGhpcy5HcmlkLkNlbGwuc2l6ZSkgKyAxO1xuICAgICAgICAgICAgdmFyIHggPSBpbmZvLmRyYWcueCA8IDEgPyAxIDogaW5mby5kcmFnLnggKyBpbmZvLndpZHRoID4gX3RoaXMuRmxleEdyaWQub3B0aW9ucy54ID8gX3RoaXMuRmxleEdyaWQub3B0aW9ucy54IC0gaW5mby53aWR0aCArIDEgOiBpbmZvLmRyYWcueDtcbiAgICAgICAgICAgIHZhciB5ID0gaW5mby5kcmFnLnkgPCAxID8gMSA6IGluZm8uZHJhZy55ICsgaW5mby5oZWlnaHQgPiBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgPyBfdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgLSBpbmZvLmhlaWdodCArIDEgOiBpbmZvLmRyYWcueTtcbiAgICAgICAgICAgIHZhciBuID0geSA8IGluZm8ueSA/ICduJyA6IG51bGw7XG4gICAgICAgICAgICB2YXIgZSA9IHggPiBpbmZvLnggPyAnZScgOiBudWxsO1xuICAgICAgICAgICAgdmFyIHMgPSB5ID4gaW5mby55ID8gJ3MnIDogbnVsbDtcbiAgICAgICAgICAgIHZhciB3ID0geCA8IGluZm8ueCA/ICd3JyA6IG51bGw7XG4gICAgICAgICAgICBpbmZvLnggPSB4O1xuICAgICAgICAgICAgaW5mby55ID0geTtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBpbmZvLmRyYWcuY29sbGlzaW9uID8gaW5mby5kcmFnLmRpcmVjdGlvbiA6IG4gfHwgZSB8fCBzIHx8IHcgfHwgaW5mby5kcmFnLmRpcmVjdGlvbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpcmVjdGlvbik7XG4gICAgICAgICAgICBpbmZvLmRyYWcuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQud2lkZ2V0c1t1aWRdID0gaW5mbztcbiAgICAgICAgICAgIHZhciBjb2xsaXNpb24gPSBfdGhpcy5jb2xsaXNpb24oJ2RyYWcnLCB1aWQpO1xuICAgICAgICAgICAgaW5mbyA9IF90aGlzLkZsZXhHcmlkLndpZGdldHNbdWlkXTtcbiAgICAgICAgICAgIHdpZGdldC5zdHlsZS5sZWZ0ID0gZXZlbnQuY2xpZW50WCAtIGdyaWRCb3VuZHMubGVmdCAtIGluZm8uZHJhZy5jdXJzb3IubGVmdCArICdweCc7XG4gICAgICAgICAgICB3aWRnZXQuc3R5bGUudG9wID0gZXZlbnQuY2xpZW50WSAtIGdyaWRCb3VuZHMudG9wIC0gaW5mby5kcmFnLmN1cnNvci50b3AgKyAncHgnO1xuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZ3JpZC5xdWVyeVNlbGVjdG9yKCcuZmxleGdyaWQtd2lkZ2V0LXBsYWNlaG9sZGVyW2RhdGEtZmxleGdyaWQtd2lkZ2V0LWlkPVwiJyArIHVpZCArICdcIl0nKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnN0eWxlLmxlZnQgPSAoaW5mby54IC0gMSkgKiBfdGhpcy5HcmlkLkNlbGwuc2l6ZSArICdweCc7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5zdHlsZS50b3AgPSAoaW5mby55IC0gMSkgKiBfdGhpcy5HcmlkLkNlbGwuc2l6ZSArICdweCc7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuRmxleEdyaWQuZHJhZ3N0b3AgPSBmdW5jdGlvbiAoZSwgd2lkZ2V0KSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLkZsZXhHcmlkLmRyYWdnaW5nKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBncmlkID0gX3RoaXMuRmxleEdyaWQuZGlzcGxheS5ncmlkO1xuICAgICAgICAgICAgdmFyIGdyaWRCb3VuZHMgPSBncmlkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgdmFyIHVpZCA9IHdpZGdldC5kYXRhc2V0LmZsZXhncmlkV2lkZ2V0SWQ7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IF90aGlzLkZsZXhHcmlkLndpZGdldHNbdWlkXTtcbiAgICAgICAgICAgIGRlbGV0ZSBpbmZvLmRyYWc7XG4gICAgICAgICAgICBfdGhpcy5GbGV4R3JpZC53aWRnZXRzW3VpZF0gPSBpbmZvO1xuICAgICAgICAgICAgX3RoaXMuR3JpZC5DZWxsLmNsb3NlKHsgeDogaW5mby54LCB5OiBpbmZvLnkgfSwgeyB4OiBpbmZvLnggKyBpbmZvLndpZHRoIC0gMSwgeTogaW5mby55ICsgaW5mby5oZWlnaHQgLSAxIH0pO1xuICAgICAgICAgICAgd2lkZ2V0LnN0eWxlLmxlZnQgPSAoaW5mby54IC0gMSkgKiBfdGhpcy5HcmlkLkNlbGwuc2l6ZSArICdweCc7XG4gICAgICAgICAgICB3aWRnZXQuc3R5bGUudG9wID0gKGluZm8ueSAtIDEpICogX3RoaXMuR3JpZC5DZWxsLnNpemUgKyAncHgnO1xuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZ3JpZC5xdWVyeVNlbGVjdG9yKCcuZmxleGdyaWQtd2lkZ2V0LXBsYWNlaG9sZGVyW2RhdGEtZmxleGdyaWQtd2lkZ2V0LWlkPVwiJyArIHVpZCArICdcIl0nKTtcbiAgICAgICAgICAgIGdyaWQucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgd2lkZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZsZXhncmlkLXdpZGdldC1kcmFnZ2luZycpO1xuICAgICAgICAgICAgX3RoaXMuRmxleEdyaWQuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgV2lkZ2V0LnByb3RvdHlwZS5jb2xsaXNpb24gPSBmdW5jdGlvbiAobWV0aG9kLCB1aWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gdm9pZCAwKSB7IG1ldGhvZCA9ICcnOyB9XG4gICAgICAgIGlmICh1aWQgPT09IHZvaWQgMCkgeyB1aWQgPSAnJzsgfVxuICAgICAgICBpZiAoIVsnZHJhZycsICdzb3J0JywgJ3Jlc2l6ZSddLmluY2x1ZGVzKG1ldGhvZCkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdmFyIGdyaWQgPSB0aGlzLkZsZXhHcmlkLmRpc3BsYXkuZ3JpZDtcbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLkZsZXhHcmlkLndpZGdldHNbdWlkXTtcbiAgICAgICAgaWYgKG1ldGhvZCA9PSAnZHJhZycpIHtcbiAgICAgICAgICAgIGluZm8uZHJhZy5jb2xsaXNpb24gPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBjZWxscyA9IHRoaXMuR3JpZC5DZWxsLmdldCh7IHg6IGluZm8ueCwgeTogaW5mby55IH0sIHsgeDogaW5mby54ICsgaW5mby53aWR0aCAtIDEsIHk6IGluZm8ueSArIGluZm8uaGVpZ2h0IC0gMSB9KTtcbiAgICAgICAgICAgIGlmIChjZWxscy5sZW5ndGggIT0gaW5mby53aWR0aCAqIGluZm8uaGVpZ2h0IHx8IGNlbGxzLmZpbHRlcihmdW5jdGlvbiAoY2VsbCkgeyByZXR1cm4gIWNlbGwub3BlbjsgfSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwYWNlO1xuICAgICAgICAgICAgICAgIGlmIChpbmZvLmRyYWcuZGlyZWN0aW9uID09ICduJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BhY2VzID0gW3RoaXMuR3JpZC5maW5kU3BhY2UoaW5mby53aWR0aCwgaW5mby5oZWlnaHQsIHsgeDogaW5mby54LCB5OiBpbmZvLnkgfSwgeyB4OiB0aGlzLkZsZXhHcmlkLm9wdGlvbnMueCwgeTogdGhpcy5GbGV4R3JpZC5vcHRpb25zLnkgfSksIHRoaXMuR3JpZC5maW5kU3BhY2UoaW5mby53aWR0aCwgaW5mby5oZWlnaHQsIHsgeDogMSwgeTogaW5mby55IH0sIHsgeDogaW5mby54ICsgaW5mby53aWR0aCAtIDEsIHk6IHRoaXMuRmxleEdyaWQub3B0aW9ucy55IH0sICdtYXgnKV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZXNbMF0gJiYgc3BhY2VzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IHNwYWNlcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgb2JqKSB7IHJldHVybiBNYXRoLmFicyhpbmZvLmRyYWcueCAtIG9iai54KSA8IE1hdGguYWJzKGluZm8uZHJhZy54IC0gYWNjLngpID8gb2JqIDogYWNjOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IHNwYWNlc1swXSB8fCBzcGFjZXNbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbmZvLmRyYWcuZGlyZWN0aW9uID09ICdzJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BhY2VzID0gW3RoaXMuR3JpZC5maW5kU3BhY2UoaW5mby53aWR0aCwgaW5mby5oZWlnaHQsIHsgeDogaW5mby54LCB5OiBpbmZvLnkgKyBpbmZvLmhlaWdodCAtIDEgfSwgeyB4OiB0aGlzLkZsZXhHcmlkLm9wdGlvbnMueCwgeTogMSB9LCAnbWluJywgJ21heCcpLCB0aGlzLkdyaWQuZmluZFNwYWNlKGluZm8ud2lkdGgsIGluZm8uaGVpZ2h0LCB7IHg6IDEsIHk6IGluZm8ueSArIGluZm8uaGVpZ2h0IC0gMSB9LCB7IHg6IGluZm8ueCArIGluZm8ud2lkdGggLSAxLCB5OiAxIH0sICdtYXgnLCAnbWF4JyldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3BhY2VzWzBdICYmIHNwYWNlc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSBzcGFjZXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIG9iaikgeyByZXR1cm4gTWF0aC5hYnMoaW5mby5kcmFnLnggLSBvYmoueCkgPCBNYXRoLmFicyhpbmZvLmRyYWcueCAtIGFjYy54KSA/IG9iaiA6IGFjYzsgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSBzcGFjZXNbMF0gfHwgc3BhY2VzWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5mby5kcmFnLmRpcmVjdGlvbiA9PSAnZScpIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSB0aGlzLkdyaWQuZmluZFNwYWNlKGluZm8ud2lkdGgsIGluZm8uaGVpZ2h0LCB7IHg6IDEsIHk6IGluZm8ueSB9LCB7IHg6IGluZm8ueCArIGluZm8ud2lkdGggLSAxLCB5OiBpbmZvLnkgKyBpbmZvLmhlaWdodCAtIDEgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbmZvLmRyYWcuZGlyZWN0aW9uID09ICd3Jykge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IHRoaXMuR3JpZC5maW5kU3BhY2UoaW5mby53aWR0aCwgaW5mby5oZWlnaHQsIHsgeDogaW5mby54LCB5OiBpbmZvLnkgfSwgeyB4OiB0aGlzLkZsZXhHcmlkLm9wdGlvbnMueCwgeTogaW5mby55ICsgaW5mby5oZWlnaHQgLSAxIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcGFjZSk7XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZm8ueCA9IHNwYWNlLng7XG4gICAgICAgICAgICAgICAgICAgIGluZm8ueSA9IHNwYWNlLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluZm8uZHJhZy5jb2xsaXNpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuRmxleEdyaWQud2lkZ2V0c1t1aWRdID0gaW5mbztcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBXaWRnZXQub3B0aW9ucyA9IHtcbiAgICAgICAgeDogMSxcbiAgICAgICAgeTogMSxcbiAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgbWluV2lkdGg6IDEsXG4gICAgICAgIG1pbkhlaWdodDogMSxcbiAgICAgICAgbWF4V2lkdGg6IDEyLFxuICAgICAgICBtYXhIZWlnaHQ6IDEyLFxuICAgICAgICBjdXN0b21DbGFzczoge1xuICAgICAgICAgICAgd2lkZ2V0OiBudWxsLFxuICAgICAgICAgICAgaGVscGVyOiBudWxsLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgZHJhZ0hhbmRsZTogbnVsbCxcbiAgICAgICAgcmVzaXplSGFuZGxlczogbnVsbFxuICAgIH07XG4gICAgcmV0dXJuIFdpZGdldDtcbn0oKSk7XG5leHBvcnQgZGVmYXVsdCBXaWRnZXQ7XG5XaWRnZXQudmFsaWRhdGVXaWRnZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIF9iO1xuICAgIGZvciAodmFyIG9wdGlvbiBpbiBXaWRnZXQub3B0aW9ucylcbiAgICAgICAgKF9hID0gKF9iID0gb3B0aW9ucylbb3B0aW9uXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW29wdGlvbl0gPSBXaWRnZXQub3B0aW9uc1tvcHRpb25dKTtcbiAgICBpZiAob3B0aW9ucy5taW5XaWR0aCA8IDEgfHwgb3B0aW9ucy5taW5XaWR0aCA+IG9wdGlvbnMud2lkdGgpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmxleEdyaWQ6IE9wdGlvbiBcIm1pbldpZHRoXCIgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMSBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBvcHRpb24gXCJ3aWR0aFwiLicpO1xuICAgIGlmIChvcHRpb25zLndpZHRoID4gb3B0aW9ucy5tYXhXaWR0aClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGbGV4R3JpZDogT3B0aW9uIFwid2lkdGhcIiBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2Ygb3B0aW9uIFwibWF4V2lkdGhcIi4nKTtcbiAgICBpZiAob3B0aW9ucy5taW5IZWlnaHQgPCAxIHx8IG9wdGlvbnMubWluSGVpZ2h0ID4gb3B0aW9ucy5oZWlnaHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmxleEdyaWQ6IE9wdGlvbiBcIm1pbkhlaWdodFwiIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2Ygb3B0aW9uIFwiaGVpZ2h0XCIuJyk7XG4gICAgaWYgKG9wdGlvbnMuaGVpZ2h0ID4gb3B0aW9ucy5tYXhIZWlnaHQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmxleEdyaWQ6IE9wdGlvbiBcImhlaWdodFwiIG11c3QgYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBvcHRpb24gXCJtYXhIZWlnaHRcIi4nKTtcbiAgICByZXR1cm4gb3B0aW9ucztcbn07XG4iLCIvKiBcbihUaGUgTUlUIExpY2Vuc2UpXG5Db3B5cmlnaHQgKGMpIDIwMTQtMjAyMSBIYWzDoXN6IMOBZMOhbSA8YWRhbUBhaW1mb3JtLmNvbT5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuKi9cblxuLy8gIFVuaXF1ZSBIZXhhdHJpZGVjaW1hbCBJRCBHZW5lcmF0b3Jcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAgRGVwZW5kZW5jaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnZhciBwaWQgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5waWQgPyBwcm9jZXNzLnBpZC50b1N0cmluZygzNikgOiAnJyA7XG52YXIgYWRkcmVzcyA9ICcnO1xuaWYodHlwZW9mIF9fd2VicGFja19yZXF1aXJlX18gIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHJlcXVpcmUgIT09ICd1bmRlZmluZWQnKXtcbiAgICB2YXIgbWFjID0gJycsIG9zID0gcmVxdWlyZSgnb3MnKTsgXG4gICAgaWYob3MubmV0d29ya0ludGVyZmFjZXMpIHZhciBuZXR3b3JrSW50ZXJmYWNlcyA9IG9zLm5ldHdvcmtJbnRlcmZhY2VzKCk7XG4gICAgaWYobmV0d29ya0ludGVyZmFjZXMpe1xuICAgICAgICBsb29wOlxuICAgICAgICBmb3IobGV0IGludGVyZmFjZV9rZXkgaW4gbmV0d29ya0ludGVyZmFjZXMpe1xuICAgICAgICAgICAgY29uc3QgbmV0d29ya0ludGVyZmFjZSA9IG5ldHdvcmtJbnRlcmZhY2VzW2ludGVyZmFjZV9rZXldO1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gbmV0d29ya0ludGVyZmFjZS5sZW5ndGg7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKG5ldHdvcmtJbnRlcmZhY2VbaV0gIT09IHVuZGVmaW5lZCAmJiBuZXR3b3JrSW50ZXJmYWNlW2ldLm1hYyAmJiBuZXR3b3JrSW50ZXJmYWNlW2ldLm1hYyAhPSAnMDA6MDA6MDA6MDA6MDA6MDAnKXtcbiAgICAgICAgICAgICAgICAgICAgbWFjID0gbmV0d29ya0ludGVyZmFjZVtpXS5tYWM7IGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFkZHJlc3MgPSBtYWMgPyBwYXJzZUludChtYWMucmVwbGFjZSgvXFw6fFxcRCsvZ2ksICcnKSkudG9TdHJpbmcoMzYpIDogJycgO1xuICAgIH1cbn0gXG5cbi8vICBFeHBvcnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbm1vZHVsZS5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uKHByZWZpeCwgc3VmZml4KXsgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJykgKyBhZGRyZXNzICsgcGlkICsgbm93KCkudG9TdHJpbmcoMzYpICsgKHN1ZmZpeCA/IHN1ZmZpeCA6ICcnKTsgfVxubW9kdWxlLmV4cG9ydHMucHJvY2VzcyA9IGZ1bmN0aW9uKHByZWZpeCwgc3VmZml4KXsgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJykgKyBwaWQgKyBub3coKS50b1N0cmluZygzNikgKyAoc3VmZml4ID8gc3VmZml4IDogJycpOyB9XG5tb2R1bGUuZXhwb3J0cy50aW1lICAgID0gZnVuY3Rpb24ocHJlZml4LCBzdWZmaXgpeyByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKSArIG5vdygpLnRvU3RyaW5nKDM2KSArIChzdWZmaXggPyBzdWZmaXggOiAnJyk7IH1cblxuLy8gIEhlbHBlcnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gbm93KCl7XG4gICAgdmFyIHRpbWUgPSBEYXRlLm5vdygpO1xuICAgIHZhciBsYXN0ID0gbm93Lmxhc3QgfHwgdGltZTtcbiAgICByZXR1cm4gbm93Lmxhc3QgPSB0aW1lID4gbGFzdCA/IHRpbWUgOiBsYXN0ICsgMTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgdG9BcnJheSBmcm9tICd0by1hcnJheSc7XG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xudmFyIEZsZXhHcmlkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGbGV4R3JpZCh3cmFwcGVyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMud2lkZ2V0cyA9IHt9O1xuICAgICAgICB0aGlzLnNldE9wdGlvbiA9IGZ1bmN0aW9uIChvcHRpb24sIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoR3JpZC5vcHRpb25zW29wdGlvbl0gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZsZXhHcmlkOiBPcHRpb24gXFxcIlwiLmNvbmNhdChvcHRpb24sIFwiXFxcIiBkb2VzIG5vdCBleGlzdC5cIikpO1xuICAgICAgICAgICAgX3RoaXMub3B0aW9uc1tvcHRpb25dID0gdmFsdWU7XG4gICAgICAgICAgICBHcmlkLnZhbGlkYXRlR3JpZE9wdGlvbnMoX3RoaXMub3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMudmFsaWRhdGVGbGV4R3JpZE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS53cmFwcGVyID0gd3JhcHBlcjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LndyYXBwZXIuRmxleEdyaWQgPSB0aGlzO1xuICAgICAgICB0aGlzLmRpc3BsYXkud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdmbGV4Z3JpZCcpO1xuICAgICAgICBuZXcgR3JpZCh0aGlzKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmRyYWdnaW5nKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmRyYWcoZSwgX3RoaXMuZGlzcGxheS5ncmlkLnF1ZXJ5U2VsZWN0b3IoJy5mbGV4Z3JpZC13aWRnZXQtZHJhZ2dpbmcnKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmRyYWdnaW5nKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmRyYWdzdG9wKGUsIF90aGlzLmRpc3BsYXkuZ3JpZC5xdWVyeVNlbGVjdG9yKCcuZmxleGdyaWQtd2lkZ2V0LWRyYWdnaW5nJykpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgRmxleEdyaWQucHJvdG90eXBlLnZhbGlkYXRlRmxleEdyaWRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIGZvciAodmFyIG9wdGlvbiBpbiBGbGV4R3JpZC5vcHRpb25zKVxuICAgICAgICAgICAgKF9hID0gKF9iID0gb3B0aW9ucylbb3B0aW9uXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW29wdGlvbl0gPSBGbGV4R3JpZC5vcHRpb25zW29wdGlvbl0pO1xuICAgICAgICB2YXIgZ3JpZE9wdGlvbnMgPSBHcmlkLnZhbGlkYXRlR3JpZE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIGZvciAodmFyIG9wdGlvbiBpbiBncmlkT3B0aW9ucylcbiAgICAgICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IGdyaWRPcHRpb25zW29wdGlvbl07XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH07XG4gICAgRmxleEdyaWQub3B0aW9ucyA9IEdyaWQub3B0aW9ucztcbiAgICByZXR1cm4gRmxleEdyaWQ7XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgRmxleEdyaWQ7XG5GbGV4R3JpZC5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHNlbGVjdG9yKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9ICcuZmxleGdyaWQnOyB9XG4gICAgdmFyIGVsZW1lbnRzID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IHRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpIDogW3NlbGVjdG9yXTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7IHJldHVybiBuZXcgRmxleEdyaWQoZWxlbWVudCwgb3B0aW9ucyk7IH0pO1xufTtcbkZsZXhHcmlkLmRlc3Ryb3kgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHsgfTtcbndpbmRvdy5GbGV4R3JpZCA9IEZsZXhHcmlkO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9