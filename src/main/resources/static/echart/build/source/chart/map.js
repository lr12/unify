define('echarts/chart/map', [
    'require',
    './base',
    'zrender/shape/Text',
    'zrender/shape/Path',
    'zrender/shape/Circle',
    'zrender/shape/Rectangle',
    'zrender/shape/Line',
    'zrender/shape/Polygon',
    'zrender/shape/Ellipse',
    'zrender/shape/Image',
    '../component/dataRange',
    '../component/roamController',
    '../layer/heatmap',
    '../config',
    '../util/ecData',
    'zrender/tool/util',
    'zrender/config',
    'zrender/tool/event',
    '../util/mapData/params',
    '../util/mapData/textFixed',
    '../util/mapData/geoCoord',
    '../util/projection/svg',
    '../util/projection/normal',
    '../chart'
], function (require) {
    var ChartBase = require('./base');
    var TextShape = require('zrender/shape/Text');
    var PathShape = require('zrender/shape/Path');
    var CircleShape = require('zrender/shape/Circle');
    var RectangleShape = require('zrender/shape/Rectangle');
    var LineShape = require('zrender/shape/Line');
    var PolygonShape = require('zrender/shape/Polygon');
    var EllipseShape = require('zrender/shape/Ellipse');
    var ZrImage = require('zrender/shape/Image');
    require('../component/dataRange');
    require('../component/roamController');
    var HeatmapLayer = require('../layer/heatmap');
    var ecConfig = require('../config');
    ecConfig.map = {
        zlevel: 0,
        z: 2,
        mapType: 'china',
        showLegendSymbol: true,
        dataRangeHoverLink: true,
        hoverable: true,
        clickable: true,
        itemStyle: {
            normal: {
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                areaStyle: { color: '#ccc' },
                label: {
                    show: false,
                    textStyle: { color: 'rgb(139,69,19)' }
                }
            },
            emphasis: {
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                areaStyle: { color: 'rgba(255,215,0,0.8)' },
                label: {
                    show: false,
                    textStyle: { color: 'rgb(100,0,0)' }
                }
            }
        }
    };
    var ecData = require('../util/ecData');
    var zrUtil = require('zrender/tool/util');
    var zrConfig = require('zrender/config');
    var zrEvent = require('zrender/tool/event');
    var _mapParams = require('../util/mapData/params').params;
    var _textFixed = require('../util/mapData/textFixed');
    var _geoCoord = require('../util/mapData/geoCoord');
    function Map(ecTheme, messageCenter, zr, option, myChart) {
        ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart);
        var self = this;
        self._onmousewheel = function (params) {
            return self.__onmousewheel(params);
        };
        self._onmousedown = function (params) {
            return self.__onmousedown(params);
        };
        self._onmousemove = function (params) {
            return self.__onmousemove(params);
        };
        self._onmouseup = function (params) {
            return self.__onmouseup(params);
        };
        self._onroamcontroller = function (params) {
            return self.__onroamcontroller(params);
        };
        self._ondrhoverlink = function (params) {
            return self.__ondrhoverlink(params);
        };
        this._isAlive = true;
        this._selectedMode = {};
        this._activeMapType = {};
        this._clickable = {};
        this._hoverable = {};
        this._showLegendSymbol = {};
        this._selected = {};
        this._mapTypeMap = {};
        this._mapDataMap = {};
        this._nameMap = {};
        this._specialArea = {};
        this._refreshDelayTicket;
        this._mapDataRequireCounter;
        this._markAnimation = false;
        this._hoverLinkMap = {};
        this._roamMap = {};
        this._scaleLimitMap = {};
        this._mx;
        this._my;
        this._mousedown;
        this._justMove;
        this._curMapType;
        this.refresh(option);
        this.zr.on(zrConfig.EVENT.MOUSEWHEEL, this._onmousewheel);
        this.zr.on(zrConfig.EVENT.MOUSEDOWN, this._onmousedown);
        messageCenter.bind(ecConfig.EVENT.ROAMCONTROLLER, this._onroamcontroller);
        messageCenter.bind(ecConfig.EVENT.DATA_RANGE_HOVERLINK, this._ondrhoverlink);
    }
    Map.prototype = {
        type: ecConfig.CHART_TYPE_MAP,
        _buildShape: function () {
            var series = this.series;
            this.selectedMap = {};
            this._activeMapType = {};
            var legend = this.component.legend;
            var seriesName;
            var valueData = {};
            var mapType;
            var data;
            var name;
            var mapSeries = {};
            var mapValuePrecision = {};
            var valueCalculation = {};
            for (var i = 0, l = series.length; i < l; i++) {
                if (series[i].type == ecConfig.CHART_TYPE_MAP) {
                    series[i] = this.reformOption(series[i]);
                    mapType = series[i].mapType;
                    mapSeries[mapType] = mapSeries[mapType] || {};
                    mapSeries[mapType][i] = true;
                    mapValuePrecision[mapType] = mapValuePrecision[mapType] || series[i].mapValuePrecision;
                    this._scaleLimitMap[mapType] = this._scaleLimitMap[mapType] || {};
                    series[i].scaleLimit && zrUtil.merge(this._scaleLimitMap[mapType], series[i].scaleLimit, true);
                    this._roamMap[mapType] = series[i].roam || this._roamMap[mapType];
                    if (this._hoverLinkMap[mapType] == null || this._hoverLinkMap[mapType]) {
                        this._hoverLinkMap[mapType] = series[i].dataRangeHoverLink;
                    }
                    this._nameMap[mapType] = this._nameMap[mapType] || {};
                    series[i].nameMap && zrUtil.merge(this._nameMap[mapType], series[i].nameMap, true);
                    this._activeMapType[mapType] = true;
                    if (series[i].textFixed) {
                        zrUtil.merge(_textFixed, series[i].textFixed, true);
                    }
                    if (series[i].geoCoord) {
                        zrUtil.merge(_geoCoord, series[i].geoCoord, true);
                    }
                    this._selectedMode[mapType] = this._selectedMode[mapType] || series[i].selectedMode;
                    if (this._hoverable[mapType] == null || this._hoverable[mapType]) {
                        this._hoverable[mapType] = series[i].hoverable;
                    }
                    if (this._clickable[mapType] == null || this._clickable[mapType]) {
                        this._clickable[mapType] = series[i].clickable;
                    }
                    if (this._showLegendSymbol[mapType] == null || this._showLegendSymbol[mapType]) {
                        this._showLegendSymbol[mapType] = series[i].showLegendSymbol;
                    }
                    valueCalculation[mapType] = valueCalculation[mapType] || series[i].mapValueCalculation;
                    seriesName = series[i].name;
                    this.selectedMap[seriesName] = legend ? legend.isSelected(seriesName) : true;
                    if (this.selectedMap[seriesName]) {
                        valueData[mapType] = valueData[mapType] || {};
                        data = series[i].data;
                        for (var j = 0, k = data.length; j < k; j++) {
                            name = this._nameChange(mapType, data[j].name);
                            valueData[mapType][name] = valueData[mapType][name] || {
                                seriesIndex: [],
                                valueMap: {},
                                precision: 0
                            };
                            for (var key in data[j]) {
                                if (key != 'value') {
                                    valueData[mapType][name][key] = data[j][key];
                                } else if (!isNaN(data[j].value)) {
                                    valueData[mapType][name].value == null && (valueData[mapType][name].value = 0);
                                    valueData[mapType][name].precision = Math.max(this.getPrecision(+data[j].value), valueData[mapType][name].precision);
                                    valueData[mapType][name].value += +data[j].value;
                                    valueData[mapType][name].valueMap[i] = +data[j].value;
                                }
                            }
                            valueData[mapType][name].seriesIndex.push(i);
                        }
                    }
                }
            }
            this._mapDataRequireCounter = 0;
            for (var mt in valueData) {
                this._mapDataRequireCounter++;
            }
            this._clearSelected();
            if (this._mapDataRequireCounter === 0) {
                this.clear();
                this.zr && this.zr.delShape(this.lastShapeList);
                this.lastShapeList = [];
            }
            for (var mt in valueData) {
                for (var k in valueData[mt]) {
                    if (valueCalculation[mt] == 'average') {
                        valueData[mt][k].value /= valueData[mt][k].seriesIndex.length;
                    }
                    var value = valueData[mt][k].value;
                    if (value != null) {
                        valueData[mt][k].value = value.toFixed(mapValuePrecision[mt] == null ? valueData[mt][k].precision : mapValuePrecision[mt]) - 0;
                    }
                }
                this._mapDataMap[mt] = this._mapDataMap[mt] || {};
                if (this._mapDataMap[mt].mapData) {
                    this._mapDataCallback(mt, valueData[mt], mapSeries[mt])(this._mapDataMap[mt].mapData);
                } else if (_mapParams[mt.replace(/\|.*/, '')].getGeoJson) {
                    this._specialArea[mt] = _mapParams[mt.replace(/\|.*/, '')].specialArea || this._specialArea[mt];
                    _mapParams[mt.replace(/\|.*/, '')].getGeoJson(this._mapDataCallback(mt, valueData[mt], mapSeries[mt]));
                }
            }
        },
        _mapDataCallback: function (mt, vd, ms) {
            var self = this;
            return function (md) {
                if (!self._isAlive || self._activeMapType[mt] == null) {
                    return;
                }
                if (mt.indexOf('|') != -1) {
                    md = self._getSubMapData(mt, md);
                }
                self._mapDataMap[mt].mapData = md;
                if (md.firstChild) {
                    self._mapDataMap[mt].rate = 1;
                    self._mapDataMap[mt].projection = require('../util/projection/svg');
                } else {
                    self._mapDataMap[mt].rate = 0.75;
                    self._mapDataMap[mt].projection = require('../util/projection/normal');
                }
                self._buildMap(mt, self._getProjectionData(mt, md, ms), vd, ms);
                self._buildMark(mt, ms);
                if (--self._mapDataRequireCounter <= 0) {
                    self.addShapeList();
                    self.zr.refreshNextFrame();
                }
                self._buildHeatmap(mt);
            };
        },
        _clearSelected: function () {
            for (var k in this._selected) {
                if (!this._activeMapType[this._mapTypeMap[k]]) {
                    delete this._selected[k];
                    delete this._mapTypeMap[k];
                }
            }
        },
        _getSubMapData: function (mapType, mapData) {
            var subType = mapType.replace(/^.*\|/, '');
            var features = mapData.features;
            for (var i = 0, l = features.length; i < l; i++) {
                if (features[i].properties && features[i].properties.name == subType) {
                    features = features[i];
                    if (subType == 'United States of America' && features.geometry.coordinates.length > 1) {
                        features = {
                            geometry: {
                                coordinates: features.geometry.coordinates.slice(5, 6),
                                type: features.geometry.type
                            },
                            id: features.id,
                            properties: features.properties,
                            type: features.type
                        };
                    }
                    break;
                }
            }
            return {
                'type': 'FeatureCollection',
                'features': [features]
            };
        },
        _getProjectionData: function (mapType, mapData, mapSeries) {
            var normalProjection = this._mapDataMap[mapType].projection;
            var province = [];
            var bbox = this._mapDataMap[mapType].bbox || normalProjection.getBbox(mapData, this._specialArea[mapType]);
            var transform;
            if (!this._mapDataMap[mapType].hasRoam) {
                transform = this._getTransform(bbox, mapSeries, this._mapDataMap[mapType].rate);
            } else {
                transform = this._mapDataMap[mapType].transform;
            }
            var lastTransform = this._mapDataMap[mapType].lastTransform || { scale: {} };
            var pathArray;
            if (transform.left != lastTransform.left || transform.top != lastTransform.top || transform.scale.x != lastTransform.scale.x || transform.scale.y != lastTransform.scale.y) {
                pathArray = normalProjection.geoJson2Path(mapData, transform, this._specialArea[mapType]);
                lastTransform = zrUtil.clone(transform);
            } else {
                transform = this._mapDataMap[mapType].transform;
                pathArray = this._mapDataMap[mapType].pathArray;
            }
            this._mapDataMap[mapType].bbox = bbox;
            this._mapDataMap[mapType].transform = transform;
            this._mapDataMap[mapType].lastTransform = lastTransform;
            this._mapDataMap[mapType].pathArray = pathArray;
            var position = [
                transform.left,
                transform.top
            ];
            for (var i = 0, l = pathArray.length; i < l; i++) {
                province.push(this._getSingleProvince(mapType, pathArray[i], position));
            }
            if (this._specialArea[mapType]) {
                for (var area in this._specialArea[mapType]) {
                    province.push(this._getSpecialProjectionData(mapType, mapData, area, this._specialArea[mapType][area], position));
                }
            }
            if (mapType == 'china') {
                var leftTop = this.geo2pos(mapType, _geoCoord['鰍漆絊絢'] || _mapParams['鰍漆絊絢'].textCoord);
                var scale = transform.scale.x / 10.5;
                var textPosition = [
                    32 * scale + leftTop[0],
                    83 * scale + leftTop[1]
                ];
                if (_textFixed['鰍漆絊絢']) {
                    textPosition[0] += _textFixed['鰍漆絊絢'][0];
                    textPosition[1] += _textFixed['鰍漆絊絢'][1];
                }
                province.push({
                    name: this._nameChange(mapType, '鰍漆絊絢'),
                    path: _mapParams['鰍漆絊絢'].getPath(leftTop, scale),
                    position: position,
                    textX: textPosition[0],
                    textY: textPosition[1]
                });
            }
            return province;
        },
        _getSpecialProjectionData: function (mapType, mapData, areaName, mapSize, position) {
            mapData = this._getSubMapData('x|' + areaName, mapData);
            var normalProjection = require('../util/projection/normal');
            var bbox = normalProjection.getBbox(mapData);
            var leftTop = this.geo2pos(mapType, [
                mapSize.left,
                mapSize.top
            ]);
            var rightBottom = this.geo2pos(mapType, [
                mapSize.left + mapSize.width,
                mapSize.top + mapSize.height
            ]);
            var width = Math.abs(rightBottom[0] - leftTop[0]);
            var height = Math.abs(rightBottom[1] - leftTop[1]);
            var mapWidth = bbox.width;
            var mapHeight = bbox.height;
            var xScale = width / 0.75 / mapWidth;
            var yScale = height / mapHeight;
            if (xScale > yScale) {
                xScale = yScale * 0.75;
                width = mapWidth * xScale;
            } else {
                yScale = xScale;
                xScale = yScale * 0.75;
                height = mapHeight * yScale;
            }
            var transform = {
                OffsetLeft: leftTop[0],
                OffsetTop: leftTop[1],
                scale: {
                    x: xScale,
                    y: yScale
                }
            };
            var pathArray = normalProjection.geoJson2Path(mapData, transform);
            return this._getSingleProvince(mapType, pathArray[0], position);
        },
        _getSingleProvince: function (mapType, path, position) {
            var textPosition;
            var name = path.properties.name;
            var textFixed = _textFixed[name] || [
                0,
                0
            ];
            if (_geoCoord[name]) {
                textPosition = this.geo2pos(mapType, _geoCoord[name]);
            } else if (path.cp) {
                textPosition = [
                    path.cp[0] + textFixed[0],
                    path.cp[1] + textFixed[1]
                ];
            } else {
                var bbox = this._mapDataMap[mapType].bbox;
                textPosition = this.geo2pos(mapType, [
                    bbox.left + bbox.width / 2,
                    bbox.top + bbox.height / 2
                ]);
                textPosition[0] += textFixed[0];
                textPosition[1] += textFixed[1];
            }
            path.name = this._nameChange(mapType, name);
            path.position = position;
            path.textX = textPosition[0];
            path.textY = textPosition[1];
            return path;
        },
        _getTransform: function (bbox, mapSeries, rate) {
            var series = this.series;
            var mapLocation;
            var x;
            var cusX;
            var y;
            var cusY;
            var width;
            var height;
            var zrWidth = this.zr.getWidth();
            var zrHeight = this.zr.getHeight();
            var padding = Math.round(Math.min(zrWidth, zrHeight) * 0.02);
            for (var key in mapSeries) {
                mapLocation = series[key].mapLocation || {};
                cusX = mapLocation.x || cusX;
                cusY = mapLocation.y || cusY;
                width = mapLocation.width || width;
                height = mapLocation.height || height;
            }
            x = this.parsePercent(cusX, zrWidth);
            x = isNaN(x) ? padding : x;
            y = this.parsePercent(cusY, zrHeight);
            y = isNaN(y) ? padding : y;
            width = width == null ? zrWidth - x - 2 * padding : this.parsePercent(width, zrWidth);
            height = height == null ? zrHeight - y - 2 * padding : this.parsePercent(height, zrHeight);
            var mapWidth = bbox.width;
            var mapHeight = bbox.height;
            var xScale = width / rate / mapWidth;
            var yScale = height / mapHeight;
            if (xScale > yScale) {
                xScale = yScale * rate;
                width = mapWidth * xScale;
            } else {
                yScale = xScale;
                xScale = yScale * rate;
                height = mapHeight * yScale;
            }
            if (isNaN(cusX)) {
                cusX = cusX || 'center';
                switch (cusX + '') {
                case 'center':
                    x = Math.floor((zrWidth - width) / 2);
                    break;
                case 'right':
                    x = zrWidth - width;
                    break;
                }
            }
            if (isNaN(cusY)) {
                cusY = cusY || 'center';
                switch (cusY + '') {
                case 'center':
                    y = Math.floor((zrHeight - height) / 2);
                    break;
                case 'bottom':
                    y = zrHeight - height;
                    break;
                }
            }
            return {
                left: x,
                top: y,
                width: width,
                height: height,
                baseScale: 1,
                scale: {
                    x: xScale,
                    y: yScale
                }
            };
        },
        _buildMap: function (mapType, mapData, valueData, mapSeries) {
            var series = this.series;
            var legend = this.component.legend;
            var dataRange = this.component.dataRange;
            var seriesName;
            var name;
            var data;
            var value;
            var queryTarget;
            var color;
            var font;
            var style;
            var highlightStyle;
            var shape;
            var textShape;
            for (var i = 0, l = mapData.length; i < l; i++) {
                style = zrUtil.clone(mapData[i]);
                highlightStyle = {
                    name: style.name,
                    path: style.path,
                    position: zrUtil.clone(style.position)
                };
                name = style.name;
                data = valueData[name];
                if (data) {
                    queryTarget = [data];
                    seriesName = '';
                    for (var j = 0, k = data.seriesIndex.length; j < k; j++) {
                        var serie = series[data.seriesIndex[j]];
                        queryTarget.push(serie);
                        seriesName += serie.name + ' ';
                        if (legend && this._showLegendSymbol[mapType] && legend.hasColor(serie.name)) {
                            this.shapeList.push(new CircleShape({
                                zlevel: serie.zlevel,
                                z: serie.z + 1,
                                position: zrUtil.clone(style.position),
                                _mapType: mapType,
                                style: {
                                    x: style.textX + 3 + j * 7,
                                    y: style.textY - 10,
                                    r: 3,
                                    color: legend.getColor(serie.name)
                                },
                                hoverable: false
                            }));
                        }
                    }
                    value = data.value;
                } else {
                    data = {
                        name: name,
                        value: '-'
                    };
                    seriesName = '';
                    queryTarget = [];
                    for (var key in mapSeries) {
                        queryTarget.push(series[key]);
                    }
                    value = '-';
                }
                this.ecTheme.map && queryTarget.push(this.ecTheme.map);
                queryTarget.push(ecConfig.map);
                color = dataRange && !isNaN(value) ? dataRange.getColor(value) : null;
                style.color = style.color || color || this.getItemStyleColor(this.deepQuery(queryTarget, 'itemStyle.normal.color'), data.seriesIndex, -1, data) || this.deepQuery(queryTarget, 'itemStyle.normal.areaStyle.color');
                style.strokeColor = style.strokeColor || this.deepQuery(queryTarget, 'itemStyle.normal.borderColor');
                style.lineWidth = style.lineWidth || this.deepQuery(queryTarget, 'itemStyle.normal.borderWidth');
                highlightStyle.color = this.getItemStyleColor(this.deepQuery(queryTarget, 'itemStyle.emphasis.color'), data.seriesIndex, -1, data) || this.deepQuery(queryTarget, 'itemStyle.emphasis.areaStyle.color') || style.color;
                highlightStyle.strokeColor = this.deepQuery(queryTarget, 'itemStyle.emphasis.borderColor') || style.strokeColor;
                highlightStyle.lineWidth = this.deepQuery(queryTarget, 'itemStyle.emphasis.borderWidth') || style.lineWidth;
                style.brushType = highlightStyle.brushType = style.brushType || 'both';
                style.lineJoin = highlightStyle.lineJoin = 'round';
                style._name = highlightStyle._name = name;
                font = this.deepQuery(queryTarget, 'itemStyle.normal.label.textStyle');
                textShape = {
                    zlevel: this.getZlevelBase(),
                    z: this.getZBase() + 1,
                    position: zrUtil.clone(style.position),
                    _mapType: mapType,
                    _geo: this.pos2geo(mapType, [
                        style.textX,
                        style.textY
                    ]),
                    style: {
                        brushType: 'fill',
                        x: style.textX,
                        y: style.textY,
                        text: this.getLabelText(name, value, queryTarget, 'normal'),
                        _name: name,
                        textAlign: 'center',
                        color: this.deepQuery(queryTarget, 'itemStyle.normal.label.show') ? this.deepQuery(queryTarget, 'itemStyle.normal.label.textStyle.color') : 'rgba(0,0,0,0)',
                        textFont: this.getFont(font)
                    }
                };
                textShape._style = zrUtil.clone(textShape.style);
                textShape.highlightStyle = zrUtil.clone(textShape.style);
                if (this.deepQuery(queryTarget, 'itemStyle.emphasis.label.show')) {
                    textShape.highlightStyle.text = this.getLabelText(name, value, queryTarget, 'emphasis');
                    textShape.highlightStyle.color = this.deepQuery(queryTarget, 'itemStyle.emphasis.label.textStyle.color') || textShape.style.color;
                    font = this.deepQuery(queryTarget, 'itemStyle.emphasis.label.textStyle') || font;
                    textShape.highlightStyle.textFont = this.getFont(font);
                } else {
                    textShape.highlightStyle.color = 'rgba(0,0,0,0)';
                }
                shape = {
                    zlevel: this.getZlevelBase(),
                    z: this.getZBase(),
                    position: zrUtil.clone(style.position),
                    style: style,
                    highlightStyle: highlightStyle,
                    _style: zrUtil.clone(style),
                    _mapType: mapType
                };
                if (style.scale != null) {
                    shape.scale = zrUtil.clone(style.scale);
                }
                textShape = new TextShape(textShape);
                switch (shape.style.shapeType) {
                case 'rectangle':
                    shape = new RectangleShape(shape);
                    break;
                case 'line':
                    shape = new LineShape(shape);
                    break;
                case 'circle':
                    shape = new CircleShape(shape);
                    break;
                case 'polygon':
                    shape = new PolygonShape(shape);
                    break;
                case 'ellipse':
                    shape = new EllipseShape(shape);
                    break;
                default:
                    shape = new PathShape(shape);
                    if (shape.buildPathArray) {
                        shape.style.pathArray = shape.buildPathArray(shape.style.path);
                    }
                    break;
                }
                if (this._selectedMode[mapType] && (this._selected[name] && data.selected !== false) || data.selected === true) {
                    textShape.style = textShape.highlightStyle;
                    shape.style = shape.highlightStyle;
                }
                textShape.clickable = shape.clickable = this._clickable[mapType] && (data.clickable == null || data.clickable);
                if (this._selectedMode[mapType]) {
                    this._selected[name] = this._selected[name] != null ? this._selected[name] : data.selected;
                    this._mapTypeMap[name] = mapType;
                    if (data.selectable == null || data.selectable) {
                        shape.clickable = textShape.clickable = true;
                        shape.onclick = textShape.onclick = this.shapeHandler.onclick;
                    }
                }
                if (this._hoverable[mapType] && (data.hoverable == null || data.hoverable)) {
                    textShape.hoverable = shape.hoverable = true;
                    shape.hoverConnect = textShape.id;
                    textShape.hoverConnect = shape.id;
                } else {
                    textShape.hoverable = shape.hoverable = false;
                }
                ecData.pack(textShape, {
                    name: seriesName,
                    tooltip: this.deepQuery(queryTarget, 'tooltip')
                }, 0, data, 0, name);
                this.shapeList.push(textShape);
                ecData.pack(shape, {
                    name: seriesName,
                    tooltip: this.deepQuery(queryTarget, 'tooltip')
                }, 0, data, 0, name);
                this.shapeList.push(shape);
            }
        },
        _buildMark: function (mapType, mapSeries) {
            this._seriesIndexToMapType = this._seriesIndexToMapType || {};
            this.markAttachStyle = this.markAttachStyle || {};
            var position = [
                this._mapDataMap[mapType].transform.left,
                this._mapDataMap[mapType].transform.top
            ];
            if (mapType == 'none') {
                position = [
                    0,
                    0
                ];
            }
            for (var sIdx in mapSeries) {
                this._seriesIndexToMapType[sIdx] = mapType;
                this.markAttachStyle[sIdx] = {
                    position: position,
                    _mapType: mapType
                };
                this.buildMark(sIdx);
            }
        },
        _buildHeatmap: function (mapType) {
            var series = this.series;
            for (var i = 0, l = series.length; i < l; i++) {
                if (series[i].heatmap) {
                    var data = series[i].heatmap.data;
                    if (series[i].heatmap.needsTransform === false) {
                        var geo = [];
                        for (var j = 0, len = data.length; j < len; ++j) {
                            geo.push([
                                data[j][3],
                                data[j][4],
                                data[j][2]
                            ]);
                        }
                        var pos = [
                            0,
                            0
                        ];
                    } else {
                        var geoData = series[i].heatmap._geoData;
                        if (geoData === undefined) {
                            series[i].heatmap._geoData = [];
                            for (var j = 0, len = data.length; j < len; ++j) {
                                series[i].heatmap._geoData[j] = data[j];
                            }
                            geoData = series[i].heatmap._geoData;
                        }
                        var len = data.length;
                        for (var id = 0; id < len; ++id) {
                            data[id] = this.geo2pos(mapType, [
                                geoData[id][0],
                                geoData[id][1]
                            ]);
                        }
                        var pos = [
                            this._mapDataMap[mapType].transform.left,
                            this._mapDataMap[mapType].transform.top
                        ];
                    }
                    var layer = new HeatmapLayer(series[i].heatmap);
                    var canvas = layer.getCanvas(data[0][3] ? geo : data, this.zr.getWidth(), this.zr.getHeight());
                    var image = new ZrImage({
                        zlevel: this.getZlevelBase(),
                        z: this.getZBase() + 1,
                        position: pos,
                        scale: [
                            1,
                            1
                        ],
                        hoverable: false,
                        style: {
                            x: 0,
                            y: 0,
                            image: canvas,
                            width: canvas.width,
                            height: canvas.height
                        }
                    });
                    image.type = 'heatmap';
                    image._mapType = mapType;
                    this.shapeList.push(image);
                    this.zr.addShape(image);
                }
            }
        },
        getMarkCoord: function (seriesIndex, mpData) {
            return mpData.geoCoord || _geoCoord[mpData.name] ? this.geo2pos(this._seriesIndexToMapType[seriesIndex], mpData.geoCoord || _geoCoord[mpData.name]) : [
                0,
                0
            ];
        },
        getMarkGeo: function (mpData) {
            return mpData.geoCoord || _geoCoord[mpData.name];
        },
        _nameChange: function (mapType, name) {
            return this._nameMap[mapType][name] || name;
        },
        getLabelText: function (name, value, queryTarget, status) {
            var formatter = this.deepQuery(queryTarget, 'itemStyle.' + status + '.label.formatter');
            if (formatter) {
                if (typeof formatter == 'function') {
                    return formatter.call(this.myChart, name, value);
                } else if (typeof formatter == 'string') {
                    formatter = formatter.replace('{a}', '{a0}').replace('{b}', '{b0}');
                    formatter = formatter.replace('{a0}', name).replace('{b0}', value);
                    return formatter;
                }
            } else {
                return name;
            }
        },
        _findMapTypeByPos: function (mx, my) {
            var transform;
            var left;
            var top;
            var width;
            var height;
            for (var mapType in this._mapDataMap) {
                transform = this._mapDataMap[mapType].transform;
                if (!transform || !this._roamMap[mapType] || !this._activeMapType[mapType]) {
                    continue;
                }
                left = transform.left;
                top = transform.top;
                width = transform.width;
                height = transform.height;
                if (mx >= left && mx <= left + width && my >= top && my <= top + height) {
                    return mapType;
                }
            }
            return;
        },
        __onmousewheel: function (params) {
            if (this.shapeList.length <= 0) {
                return;
            }
            for (var i = 0, l = this.shapeList.length; i < l; i++) {
                var shape = this.shapeList[i];
                if (shape.__animating) {
                    return;
                }
            }
            var event = params.event;
            var mx = zrEvent.getX(event);
            var my = zrEvent.getY(event);
            var delta;
            var eventDelta = zrEvent.getDelta(event);
            var mapType;
            var mapTypeControl = params.mapTypeControl;
            if (!mapTypeControl) {
                mapTypeControl = {};
                mapType = this._findMapTypeByPos(mx, my);
                if (mapType && this._roamMap[mapType] && this._roamMap[mapType] != 'move') {
                    mapTypeControl[mapType] = true;
                }
            }
            function scalePolyline(shapeStyle, delta) {
                for (var i = 0; i < shapeStyle.pointList.length; i++) {
                    var point = shapeStyle.pointList[i];
                    point[0] *= delta;
                    point[1] *= delta;
                }
                var controlPointList = shapeStyle.controlPointList;
                if (controlPointList) {
                    for (var i = 0; i < controlPointList.length; i++) {
                        var point = controlPointList[i];
                        point[0] *= delta;
                        point[1] *= delta;
                    }
                }
            }
            function scaleMarkline(shapeStyle, delta) {
                shapeStyle.xStart *= delta;
                shapeStyle.yStart *= delta;
                shapeStyle.xEnd *= delta;
                shapeStyle.yEnd *= delta;
                if (shapeStyle.cpX1 != null) {
                    shapeStyle.cpX1 *= delta;
                    shapeStyle.cpY1 *= delta;
                }
            }
            var haveScale = false;
            for (mapType in mapTypeControl) {
                if (mapTypeControl[mapType]) {
                    haveScale = true;
                    var transform = this._mapDataMap[mapType].transform;
                    var left = transform.left;
                    var top = transform.top;
                    var width = transform.width;
                    var height = transform.height;
                    var geoAndPos = this.pos2geo(mapType, [
                        mx - left,
                        my - top
                    ]);
                    if (eventDelta > 0) {
                        delta = 1.2;
                        if (this._scaleLimitMap[mapType].max != null && transform.baseScale >= this._scaleLimitMap[mapType].max) {
                            continue;
                        }
                    } else {
                        delta = 1 / 1.2;
                        if (this._scaleLimitMap[mapType].min != null && transform.baseScale <= this._scaleLimitMap[mapType].min) {
                            continue;
                        }
                    }
                    transform.baseScale *= delta;
                    transform.scale.x *= delta;
                    transform.scale.y *= delta;
                    transform.width = width * delta;
                    transform.height = height * delta;
                    this._mapDataMap[mapType].hasRoam = true;
                    this._mapDataMap[mapType].transform = transform;
                    geoAndPos = this.geo2pos(mapType, geoAndPos);
                    transform.left -= geoAndPos[0] - (mx - left);
                    transform.top -= geoAndPos[1] - (my - top);
                    this._mapDataMap[mapType].transform = transform;
                    this.clearEffectShape(true);
                    for (var i = 0, l = this.shapeList.length; i < l; i++) {
                        var shape = this.shapeList[i];
                        if (shape._mapType == mapType) {
                            var shapeType = shape.type;
                            var shapeStyle = shape.style;
                            shape.position[0] = transform.left;
                            shape.position[1] = transform.top;
                            switch (shapeType) {
                            case 'path':
                            case 'symbol':
                            case 'circle':
                            case 'rectangle':
                            case 'polygon':
                            case 'line':
                            case 'ellipse':
                            case 'heatmap':
                                shape.scale[0] *= delta;
                                shape.scale[1] *= delta;
                                break;
                            case 'mark-line':
                                scaleMarkline(shapeStyle, delta);
                                break;
                            case 'polyline':
                                scalePolyline(shapeStyle, delta);
                                break;
                            case 'shape-bundle':
                                for (var j = 0; j < shapeStyle.shapeList.length; j++) {
                                    var subShape = shapeStyle.shapeList[j];
                                    if (subShape.type == 'mark-line') {
                                        scaleMarkline(subShape.style, delta);
                                    } else if (subShape.type == 'polyline') {
                                        scalePolyline(subShape.style, delta);
                                    }
                                }
                                break;
                            case 'icon':
                            case 'image':
                                geoAndPos = this.geo2pos(mapType, shape._geo);
                                shapeStyle.x = shapeStyle._x = geoAndPos[0] - shapeStyle.width / 2;
                                shapeStyle.y = shapeStyle._y = geoAndPos[1] - shapeStyle.height / 2;
                                break;
                            default:
                                geoAndPos = this.geo2pos(mapType, shape._geo);
                                shapeStyle.x = geoAndPos[0];
                                shapeStyle.y = geoAndPos[1];
                                if (shapeType == 'text') {
                                    shape._style.x = shape.highlightStyle.x = geoAndPos[0];
                                    shape._style.y = shape.highlightStyle.y = geoAndPos[1];
                                }
                            }
                            this.zr.modShape(shape.id);
                        }
                    }
                }
            }
            if (haveScale) {
                zrEvent.stop(event);
                this.zr.refreshNextFrame();
                var self = this;
                clearTimeout(this._refreshDelayTicket);
                this._refreshDelayTicket = setTimeout(function () {
                    self && self.shapeList && self.animationEffect();
                }, 100);
                this.messageCenter.dispatch(ecConfig.EVENT.MAP_ROAM, params.event, { type: 'scale' }, this.myChart);
            }
        },
        __onmousedown: function (params) {
            if (this.shapeList.length <= 0) {
                return;
            }
            var target = params.target;
            if (target && target.draggable) {
                return;
            }
            var event = params.event;
            var mx = zrEvent.getX(event);
            var my = zrEvent.getY(event);
            var mapType = this._findMapTypeByPos(mx, my);
            if (mapType && this._roamMap[mapType] && this._roamMap[mapType] != 'scale') {
                this._mousedown = true;
                this._mx = mx;
                this._my = my;
                this._curMapType = mapType;
                this.zr.on(zrConfig.EVENT.MOUSEUP, this._onmouseup);
                var self = this;
                setTimeout(function () {
                    self.zr.on(zrConfig.EVENT.MOUSEMOVE, self._onmousemove);
                }, 100);
            }
        },
        __onmousemove: function (params) {
            if (!this._mousedown || !this._isAlive) {
                return;
            }
            var event = params.event;
            var mx = zrEvent.getX(event);
            var my = zrEvent.getY(event);
            var transform = this._mapDataMap[this._curMapType].transform;
            transform.hasRoam = true;
            transform.left -= this._mx - mx;
            transform.top -= this._my - my;
            this._mx = mx;
            this._my = my;
            this._mapDataMap[this._curMapType].transform = transform;
            for (var i = 0, l = this.shapeList.length; i < l; i++) {
                if (this.shapeList[i]._mapType == this._curMapType) {
                    this.shapeList[i].position[0] = transform.left;
                    this.shapeList[i].position[1] = transform.top;
                    this.zr.modShape(this.shapeList[i].id);
                }
            }
            this.messageCenter.dispatch(ecConfig.EVENT.MAP_ROAM, params.event, { type: 'move' }, this.myChart);
            this.clearEffectShape(true);
            this.zr.refreshNextFrame();
            this._justMove = true;
            zrEvent.stop(event);
        },
        __onmouseup: function (params) {
            var event = params.event;
            this._mx = zrEvent.getX(event);
            this._my = zrEvent.getY(event);
            this._mousedown = false;
            var self = this;
            setTimeout(function () {
                self._justMove && self.animationEffect();
                self._justMove = false;
                self.zr.un(zrConfig.EVENT.MOUSEMOVE, self._onmousemove);
                self.zr.un(zrConfig.EVENT.MOUSEUP, self._onmouseup);
            }, 120);
        },
        __onroamcontroller: function (params) {
            var event = params.event;
            event.zrenderX = this.zr.getWidth() / 2;
            event.zrenderY = this.zr.getHeight() / 2;
            var mapTypeControl = params.mapTypeControl;
            var top = 0;
            var left = 0;
            var step = params.step;
            switch (params.roamType) {
            case 'scaleUp':
                event.zrenderDelta = 1;
                this.__onmousewheel({
                    event: event,
                    mapTypeControl: mapTypeControl
                });
                return;
            case 'scaleDown':
                event.zrenderDelta = -1;
                this.__onmousewheel({
                    event: event,
                    mapTypeControl: mapTypeControl
                });
                return;
            case 'up':
                top = -step;
                break;
            case 'down':
                top = step;
                break;
            case 'left':
                left = -step;
                break;
            case 'right':
                left = step;
                break;
            }
            var transform;
            var curMapType;
            for (curMapType in mapTypeControl) {
                if (!this._mapDataMap[curMapType] || !this._activeMapType[curMapType]) {
                    continue;
                }
                transform = this._mapDataMap[curMapType].transform;
                transform.hasRoam = true;
                transform.left -= left;
                transform.top -= top;
                this._mapDataMap[curMapType].transform = transform;
            }
            for (var i = 0, l = this.shapeList.length; i < l; i++) {
                curMapType = this.shapeList[i]._mapType;
                if (!mapTypeControl[curMapType] || !this._activeMapType[curMapType]) {
                    continue;
                }
                transform = this._mapDataMap[curMapType].transform;
                this.shapeList[i].position[0] = transform.left;
                this.shapeList[i].position[1] = transform.top;
                this.zr.modShape(this.shapeList[i].id);
            }
            this.messageCenter.dispatch(ecConfig.EVENT.MAP_ROAM, params.event, { type: 'move' }, this.myChart);
            this.clearEffectShape(true);
            this.zr.refreshNextFrame();
            clearTimeout(this.dircetionTimer);
            var self = this;
            this.dircetionTimer = setTimeout(function () {
                self.animationEffect();
            }, 150);
        },
        __ondrhoverlink: function (param) {
            var curMapType;
            var value;
            for (var i = 0, l = this.shapeList.length; i < l; i++) {
                curMapType = this.shapeList[i]._mapType;
                if (!this._hoverLinkMap[curMapType] || !this._activeMapType[curMapType]) {
                    continue;
                }
                value = ecData.get(this.shapeList[i], 'value');
                if (value != null && value >= param.valueMin && value <= param.valueMax) {
                    this.zr.addHoverShape(this.shapeList[i]);
                }
            }
        },
        onclick: function (params) {
            if (!this.isClick || !params.target || this._justMove || params.target.type == 'icon') {
                return;
            }
            this.isClick = false;
            var target = params.target;
            var name = target.style._name;
            var len = this.shapeList.length;
            var mapType = target._mapType || '';
            if (this._selectedMode[mapType] == 'single') {
                for (var p in this._selected) {
                    if (this._selected[p] && this._mapTypeMap[p] == mapType) {
                        for (var i = 0; i < len; i++) {
                            if (this.shapeList[i].style._name == p && this.shapeList[i]._mapType == mapType) {
                                this.shapeList[i].style = this.shapeList[i]._style;
                                this.zr.modShape(this.shapeList[i].id);
                            }
                        }
                        p != name && (this._selected[p] = false);
                    }
                }
            }
            this._selected[name] = !this._selected[name];
            for (var i = 0; i < len; i++) {
                if (this.shapeList[i].style._name == name && this.shapeList[i]._mapType == mapType) {
                    if (this._selected[name]) {
                        this.shapeList[i].style = this.shapeList[i].highlightStyle;
                    } else {
                        this.shapeList[i].style = this.shapeList[i]._style;
                    }
                    this.zr.modShape(this.shapeList[i].id);
                }
            }
            this.messageCenter.dispatch(ecConfig.EVENT.MAP_SELECTED, params.event, {
                selected: this._selected,
                target: name
            }, this.myChart);
            this.zr.refreshNextFrame();
            var self = this;
            setTimeout(function () {
                self.zr.trigger(zrConfig.EVENT.MOUSEMOVE, params.event);
            }, 100);
        },
        refresh: function (newOption) {
            if (newOption) {
                this.option = newOption;
                this.series = newOption.series;
            }
            if (this._mapDataRequireCounter > 0) {
                this.clear();
            } else {
                this.backupShapeList();
            }
            this._buildShape();
            this.zr.refreshHover();
        },
        ondataRange: function (param, status) {
            if (this.component.dataRange) {
                this.refresh();
                status.needRefresh = true;
            }
            return;
        },
        pos2geo: function (mapType, p) {
            if (!this._mapDataMap[mapType].transform) {
                return null;
            }
            return this._mapDataMap[mapType].projection.pos2geo(this._mapDataMap[mapType].transform, p);
        },
        getGeoByPos: function (mapType, p) {
            if (!this._mapDataMap[mapType].transform) {
                return null;
            }
            var position = [
                this._mapDataMap[mapType].transform.left,
                this._mapDataMap[mapType].transform.top
            ];
            if (p instanceof Array) {
                p[0] -= position[0];
                p[1] -= position[1];
            } else {
                p.x -= position[0];
                p.y -= position[1];
            }
            return this.pos2geo(mapType, p);
        },
        geo2pos: function (mapType, p) {
            if (!this._mapDataMap[mapType].transform) {
                return null;
            }
            return this._mapDataMap[mapType].projection.geo2pos(this._mapDataMap[mapType].transform, p);
        },
        getPosByGeo: function (mapType, p) {
            if (!this._mapDataMap[mapType].transform) {
                return null;
            }
            var pos = this.geo2pos(mapType, p);
            pos[0] += this._mapDataMap[mapType].transform.left;
            pos[1] += this._mapDataMap[mapType].transform.top;
            return pos;
        },
        getMapPosition: function (mapType) {
            if (!this._mapDataMap[mapType].transform) {
                return null;
            }
            return [
                this._mapDataMap[mapType].transform.left,
                this._mapDataMap[mapType].transform.top
            ];
        },
        onbeforDispose: function () {
            this._isAlive = false;
            this.zr.un(zrConfig.EVENT.MOUSEWHEEL, this._onmousewheel);
            this.zr.un(zrConfig.EVENT.MOUSEDOWN, this._onmousedown);
            this.messageCenter.unbind(ecConfig.EVENT.ROAMCONTROLLER, this._onroamcontroller);
            this.messageCenter.unbind(ecConfig.EVENT.DATA_RANGE_HOVERLINK, this._ondrhoverlink);
        }
    };
    zrUtil.inherits(Map, ChartBase);
    require('../chart').define('map', Map);
    return Map;
});define('zrender/shape/Path', [
    'require',
    './Base',
    './util/PathProxy',
    '../tool/util'
], function (require) {
    var Base = require('./Base');
    var PathProxy = require('./util/PathProxy');
    var PathSegment = PathProxy.PathSegment;
    var vMag = function (v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    };
    var vRatio = function (u, v) {
        return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
    };
    var vAngle = function (u, v) {
        return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
    };
    var Path = function (options) {
        Base.call(this, options);
    };
    Path.prototype = {
        type: 'path',
        buildPathArray: function (data, x, y) {
            if (!data) {
                return [];
            }
            x = x || 0;
            y = y || 0;
            var cs = data;
            var cc = [
                'm',
                'M',
                'l',
                'L',
                'v',
                'V',
                'h',
                'H',
                'z',
                'Z',
                'c',
                'C',
                'q',
                'Q',
                't',
                'T',
                's',
                'S',
                'a',
                'A'
            ];
            cs = cs.replace(/-/g, ' -');
            cs = cs.replace(/  /g, ' ');
            cs = cs.replace(/ /g, ',');
            cs = cs.replace(/,,/g, ',');
            var n;
            for (n = 0; n < cc.length; n++) {
                cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
            }
            var arr = cs.split('|');
            var ca = [];
            var cpx = 0;
            var cpy = 0;
            for (n = 1; n < arr.length; n++) {
                var str = arr[n];
                var c = str.charAt(0);
                str = str.slice(1);
                str = str.replace(new RegExp('e,-', 'g'), 'e-');
                var p = str.split(',');
                if (p.length > 0 && p[0] === '') {
                    p.shift();
                }
                for (var i = 0; i < p.length; i++) {
                    p[i] = parseFloat(p[i]);
                }
                while (p.length > 0) {
                    if (isNaN(p[0])) {
                        break;
                    }
                    var cmd = null;
                    var points = [];
                    var ctlPtx;
                    var ctlPty;
                    var prevCmd;
                    var rx;
                    var ry;
                    var psi;
                    var fa;
                    var fs;
                    var x1 = cpx;
                    var y1 = cpy;
                    switch (c) {
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'm':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'l';
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        break;
                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx, ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx, ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx, ctlPty = cpy;
                        prevCmd = ca[ca.length - 1];
                        if (prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx, y1 = cpy;
                        cpx = p.shift(), cpy = p.shift();
                        cmd = 'A';
                        points = this._convertPoint(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        rx = p.shift();
                        ry = p.shift();
                        psi = p.shift();
                        fa = p.shift();
                        fs = p.shift();
                        x1 = cpx, y1 = cpy;
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'A';
                        points = this._convertPoint(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    }
                    for (var j = 0, l = points.length; j < l; j += 2) {
                        points[j] += x;
                        points[j + 1] += y;
                    }
                    ca.push(new PathSegment(cmd || c, points));
                }
                if (c === 'z' || c === 'Z') {
                    ca.push(new PathSegment('z', []));
                }
            }
            return ca;
        },
        _convertPoint: function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
            var psi = psiDeg * (Math.PI / 180);
            var xp = Math.cos(psi) * (x1 - x2) / 2 + Math.sin(psi) * (y1 - y2) / 2;
            var yp = -1 * Math.sin(psi) * (x1 - x2) / 2 + Math.cos(psi) * (y1 - y2) / 2;
            var lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);
            if (lambda > 1) {
                rx *= Math.sqrt(lambda);
                ry *= Math.sqrt(lambda);
            }
            var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
            if (fa === fs) {
                f *= -1;
            }
            if (isNaN(f)) {
                f = 0;
            }
            var cxp = f * rx * yp / ry;
            var cyp = f * -ry * xp / rx;
            var cx = (x1 + x2) / 2 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
            var cy = (y1 + y2) / 2 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
            var theta = vAngle([
                1,
                0
            ], [
                (xp - cxp) / rx,
                (yp - cyp) / ry
            ]);
            var u = [
                (xp - cxp) / rx,
                (yp - cyp) / ry
            ];
            var v = [
                (-1 * xp - cxp) / rx,
                (-1 * yp - cyp) / ry
            ];
            var dTheta = vAngle(u, v);
            if (vRatio(u, v) <= -1) {
                dTheta = Math.PI;
            }
            if (vRatio(u, v) >= 1) {
                dTheta = 0;
            }
            if (fs === 0 && dTheta > 0) {
                dTheta = dTheta - 2 * Math.PI;
            }
            if (fs === 1 && dTheta < 0) {
                dTheta = dTheta + 2 * Math.PI;
            }
            return [
                cx,
                cy,
                rx,
                ry,
                theta,
                dTheta,
                psi,
                fs
            ];
        },
        buildPath: function (ctx, style) {
            var path = style.path;
            var x = style.x || 0;
            var y = style.y || 0;
            style.pathArray = style.pathArray || this.buildPathArray(path, x, y);
            var pathArray = style.pathArray;
            var pointList = style.pointList = [];
            var singlePointList = [];
            for (var i = 0, l = pathArray.length; i < l; i++) {
                if (pathArray[i].command.toUpperCase() == 'M') {
                    singlePointList.length > 0 && pointList.push(singlePointList);
                    singlePointList = [];
                }
                var p = pathArray[i].points;
                for (var j = 0, k = p.length; j < k; j += 2) {
                    singlePointList.push([
                        p[j],
                        p[j + 1]
                    ]);
                }
            }
            singlePointList.length > 0 && pointList.push(singlePointList);
            for (var i = 0, l = pathArray.length; i < l; i++) {
                var c = pathArray[i].command;
                var p = pathArray[i].points;
                switch (c) {
                case 'L':
                    ctx.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    ctx.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    var cx = p[0];
                    var cy = p[1];
                    var rx = p[2];
                    var ry = p[3];
                    var theta = p[4];
                    var dTheta = p[5];
                    var psi = p[6];
                    var fs = p[7];
                    var r = rx > ry ? rx : ry;
                    var scaleX = rx > ry ? 1 : rx / ry;
                    var scaleY = rx > ry ? ry / rx : 1;
                    ctx.translate(cx, cy);
                    ctx.rotate(psi);
                    ctx.scale(scaleX, scaleY);
                    ctx.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                    ctx.scale(1 / scaleX, 1 / scaleY);
                    ctx.rotate(-psi);
                    ctx.translate(-cx, -cy);
                    break;
                case 'z':
                    ctx.closePath();
                    break;
                }
            }
            return;
        },
        getRect: function (style) {
            if (style.__rect) {
                return style.__rect;
            }
            var lineWidth;
            if (style.brushType == 'stroke' || style.brushType == 'fill') {
                lineWidth = style.lineWidth || 1;
            } else {
                lineWidth = 0;
            }
            var minX = Number.MAX_VALUE;
            var maxX = Number.MIN_VALUE;
            var minY = Number.MAX_VALUE;
            var maxY = Number.MIN_VALUE;
            var x = style.x || 0;
            var y = style.y || 0;
            var pathArray = style.pathArray || this.buildPathArray(style.path);
            for (var i = 0; i < pathArray.length; i++) {
                var p = pathArray[i].points;
                for (var j = 0; j < p.length; j++) {
                    if (j % 2 === 0) {
                        if (p[j] + x < minX) {
                            minX = p[j];
                        }
                        if (p[j] + x > maxX) {
                            maxX = p[j];
                        }
                    } else {
                        if (p[j] + y < minY) {
                            minY = p[j];
                        }
                        if (p[j] + y > maxY) {
                            maxY = p[j];
                        }
                    }
                }
            }
            var rect;
            if (minX === Number.MAX_VALUE || maxX === Number.MIN_VALUE || minY === Number.MAX_VALUE || maxY === Number.MIN_VALUE) {
                rect = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
            } else {
                rect = {
                    x: Math.round(minX - lineWidth / 2),
                    y: Math.round(minY - lineWidth / 2),
                    width: maxX - minX + lineWidth,
                    height: maxY - minY + lineWidth
                };
            }
            style.__rect = rect;
            return rect;
        }
    };
    require('../tool/util').inherits(Path, Base);
    return Path;
});define('zrender/shape/Ellipse', [
    'require',
    './Base',
    '../tool/util'
], function (require) {
    var Base = require('./Base');
    var Ellipse = function (options) {
        Base.call(this, options);
    };
    Ellipse.prototype = {
        type: 'ellipse',
        buildPath: function (ctx, style) {
            var k = 0.5522848;
            var x = style.x;
            var y = style.y;
            var a = style.a;
            var b = style.b;
            var ox = a * k;
            var oy = b * k;
            ctx.moveTo(x - a, y);
            ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
            ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
            ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
            ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
            ctx.closePath();
        },
        getRect: function (style) {
            if (style.__rect) {
                return style.__rect;
            }
            var lineWidth;
            if (style.brushType == 'stroke' || style.brushType == 'fill') {
                lineWidth = style.lineWidth || 1;
            } else {
                lineWidth = 0;
            }
            style.__rect = {
                x: Math.round(style.x - style.a - lineWidth / 2),
                y: Math.round(style.y - style.b - lineWidth / 2),
                width: style.a * 2 + lineWidth,
                height: style.b * 2 + lineWidth
            };
            return style.__rect;
        }
    };
    require('../tool/util').inherits(Ellipse, Base);
    return Ellipse;
});define('echarts/component/dataRange', [
    'require',
    './base',
    'zrender/shape/Text',
    'zrender/shape/Rectangle',
    '../util/shape/HandlePolygon',
    '../config',
    'zrender/tool/util',
    'zrender/tool/event',
    'zrender/tool/area',
    'zrender/tool/color',
    '../component'
], function (require) {
    var Base = require('./base');
    var TextShape = require('zrender/shape/Text');
    var RectangleShape = require('zrender/shape/Rectangle');
    var HandlePolygonShape = require('../util/shape/HandlePolygon');
    var ecConfig = require('../config');
    ecConfig.dataRange = {
        zlevel: 0,
        z: 4,
        show: true,
        orient: 'vertical',
        x: 'left',
        y: 'bottom',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#ccc',
        borderWidth: 0,
        padding: 5,
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 14,
        precision: 0,
        splitNumber: 5,
        splitList: null,
        calculable: false,
        selectedMode: true,
        hoverLink: true,
        realtime: true,
        color: [
            '#006edd',
            '#e0ffff'
        ],
        textStyle: { color: '#333' }
    };
    var zrUtil = require('zrender/tool/util');
    var zrEvent = require('zrender/tool/event');
    var zrArea = require('zrender/tool/area');
    var zrColor = require('zrender/tool/color');
    function DataRange(ecTheme, messageCenter, zr, option, myChart) {
        Base.call(this, ecTheme, messageCenter, zr, option, myChart);
        var self = this;
        self._ondrift = function (dx, dy) {
            return self.__ondrift(this, dx, dy);
        };
        self._ondragend = function () {
            return self.__ondragend();
        };
        self._dataRangeSelected = function (param) {
            return self.__dataRangeSelected(param);
        };
        self._dispatchHoverLink = function (param) {
            return self.__dispatchHoverLink(param);
        };
        self._onhoverlink = function (params) {
            return self.__onhoverlink(params);
        };
        this._selectedMap = {};
        this._range = {};
        this.refresh(option);
        messageCenter.bind(ecConfig.EVENT.HOVER, this._onhoverlink);
    }
    DataRange.prototype = {
        type: ecConfig.COMPONENT_TYPE_DATARANGE,
        _textGap: 10,
        _buildShape: function () {
            this._itemGroupLocation = this._getItemGroupLocation();
            this._buildBackground();
            if (this._isContinuity()) {
                this._buildGradient();
            } else {
                this._buildItem();
            }
            if (this.dataRangeOption.show) {
                for (var i = 0, l = this.shapeList.length; i < l; i++) {
                    this.zr.addShape(this.shapeList[i]);
                }
            }
            this._syncShapeFromRange();
        },
        _buildItem: function () {
            var data = this._valueTextList;
            var dataLength = data.length;
            var itemName;
            var itemShape;
            var textShape;
            var font = this.getFont(this.dataRangeOption.textStyle);
            var lastX = this._itemGroupLocation.x;
            var lastY = this._itemGroupLocation.y;
            var itemWidth = this.dataRangeOption.itemWidth;
            var itemHeight = this.dataRangeOption.itemHeight;
            var itemGap = this.dataRangeOption.itemGap;
            var textHeight = zrArea.getTextHeight('弊', font);
            var color;
            if (this.dataRangeOption.orient == 'vertical' && this.dataRangeOption.x == 'right') {
                lastX = this._itemGroupLocation.x + this._itemGroupLocation.width - itemWidth;
            }
            var needValueText = true;
            if (this.dataRangeOption.text) {
                needValueText = false;
                if (this.dataRangeOption.text[0]) {
                    textShape = this._getTextShape(lastX, lastY, this.dataRangeOption.text[0]);
                    if (this.dataRangeOption.orient == 'horizontal') {
                        lastX += zrArea.getTextWidth(this.dataRangeOption.text[0], font) + this._textGap;
                    } else {
                        lastY += textHeight + this._textGap;
                        textShape.style.y += textHeight / 2 + this._textGap;
                        textShape.style.textBaseline = 'bottom';
                    }
                    this.shapeList.push(new TextShape(textShape));
                }
            }
            for (var i = 0; i < dataLength; i++) {
                itemName = data[i];
                color = this.getColorByIndex(i);
                itemShape = this._getItemShape(lastX, lastY, itemWidth, itemHeight, this._selectedMap[i] ? color : '#ccc');
                itemShape._idx = i;
                itemShape.onmousemove = this._dispatchHoverLink;
                if (this.dataRangeOption.selectedMode) {
                    itemShape.clickable = true;
                    itemShape.onclick = this._dataRangeSelected;
                }
                this.shapeList.push(new RectangleShape(itemShape));
                if (needValueText) {
                    textShape = {
                        zlevel: this.getZlevelBase(),
                        z: this.getZBase(),
                        style: {
                            x: lastX + itemWidth + 5,
                            y: lastY,
                            color: this._selectedMap[i] ? this.dataRangeOption.textStyle.color : '#ccc',
                            text: data[i],
                            textFont: font,
                            textBaseline: 'top'
                        },
                        highlightStyle: { brushType: 'fill' }
                    };
                    if (this.dataRangeOption.orient == 'vertical' && this.dataRangeOption.x == 'right') {
                        textShape.style.x -= itemWidth + 10;
                        textShape.style.textAlign = 'right';
                    }
                    textShape._idx = i;
                    textShape.onmousemove = this._dispatchHoverLink;
                    if (this.dataRangeOption.selectedMode) {
                        textShape.clickable = true;
                        textShape.onclick = this._dataRangeSelected;
                    }
                    this.shapeList.push(new TextShape(textShape));
                }
                if (this.dataRangeOption.orient == 'horizontal') {
                    lastX += itemWidth + (needValueText ? 5 : 0) + (needValueText ? zrArea.getTextWidth(itemName, font) : 0) + itemGap;
                } else {
                    lastY += itemHeight + itemGap;
                }
            }
            if (!needValueText && this.dataRangeOption.text[1]) {
                if (this.dataRangeOption.orient == 'horizontal') {
                    lastX = lastX - itemGap + this._textGap;
                } else {
                    lastY = lastY - itemGap + this._textGap;
                }
                textShape = this._getTextShape(lastX, lastY, this.dataRangeOption.text[1]);
                if (this.dataRangeOption.orient != 'horizontal') {
                    textShape.style.y -= 5;
                    textShape.style.textBaseline = 'top';
                }
                this.shapeList.push(new TextShape(textShape));
            }
        },
        _buildGradient: function () {
            var itemShape;
            var textShape;
            var font = this.getFont(this.dataRangeOption.textStyle);
            var lastX = this._itemGroupLocation.x;
            var lastY = this._itemGroupLocation.y;
            var itemWidth = this.dataRangeOption.itemWidth;
            var itemHeight = this.dataRangeOption.itemHeight;
            var textHeight = zrArea.getTextHeight('弊', font);
            var mSize = 10;
            var needValueText = true;
            if (this.dataRangeOption.text) {
                needValueText = false;
                if (this.dataRangeOption.text[0]) {
                    textShape = this._getTextShape(lastX, lastY, this.dataRangeOption.text[0]);
                    if (this.dataRangeOption.orient == 'horizontal') {
                        lastX += zrArea.getTextWidth(this.dataRangeOption.text[0], font) + this._textGap;
                    } else {
                        lastY += textHeight + this._textGap;
                        textShape.style.y += textHeight / 2 + this._textGap;
                        textShape.style.textBaseline = 'bottom';
                    }
                    this.shapeList.push(new TextShape(textShape));
                }
            }
            var zrColor = require('zrender/tool/color');
            var per = 1 / (this.dataRangeOption.color.length - 1);
            var colorList = [];
            for (var i = 0, l = this.dataRangeOption.color.length; i < l; i++) {
                colorList.push([
                    i * per,
                    this.dataRangeOption.color[i]
                ]);
            }
            if (this.dataRangeOption.orient == 'horizontal') {
                itemShape = {
                    zlevel: this.getZlevelBase(),
                    z: this.getZBase(),
                    style: {
                        x: lastX,
                        y: lastY,
                        width: itemWidth * mSize,
                        height: itemHeight,
                        color: zrColor.getLinearGradient(lastX, lastY, lastX + itemWidth * mSize, lastY, colorList)
                    },
                    hoverable: false
                };
                lastX += itemWidth * mSize + this._textGap;
            } else {
                itemShape = {
                    zlevel: this.getZlevelBase(),
                    z: this.getZBase(),
                    style: {
                        x: lastX,
                        y: lastY,
                        width: itemWidth,
                        height: itemHeight * mSize,
                        color: zrColor.getLinearGradient(lastX, lastY, lastX, lastY + itemHeight * mSize, colorList)
                    },
                    hoverable: false
                };
                lastY += itemHeight * mSize + this._textGap;
            }
            this.shapeList.push(new RectangleShape(itemShape));
            this._calculableLocation = itemShape.style;
            if (this.dataRangeOption.calculable) {
                this._buildFiller();
                this._bulidMask();
                this._bulidHandle();
            }
            this._buildIndicator();
            if (!needValueText && this.dataRangeOption.text[1]) {
                textShape = this._getTextShape(lastX, lastY, this.dataRangeOption.text[1]);
                this.shapeList.push(new TextShape(textShape));
            }
        },
        _buildIndicator: function () {
            var x = this._calculableLocation.x;
            var y = this._calculableLocation.y;
            var width = this._calculableLocation.width;
            var height = this._calculableLocation.height;
            var size = 5;
            var pointList;
            var textPosition;
            if (this.dataRangeOption.orient == 'horizontal') {
                if (this.dataRangeOption.y != 'bottom') {
                    pointList = [
                        [
                            x,
                            y + height
                        ],
                        [
                            x - size,
                            y + height + size
                        ],
                        [
                            x + size,
                            y + height + size
                        ]
                    ];
                    textPosition = 'bottom';
                } else {
                    pointList = [
                        [
                            x,
                            y
                        ],
                        [
                            x - size,
                            y - size
                        ],
                        [
                            x + size,
                            y - size
                        ]
                    ];
                    textPosition = 'top';
                }
            } else {
                if (this.dataRangeOption.x != 'right') {
                    pointList = [
                        [
                            x + width,
                            y
                        ],
                        [
                            x + width + size,
                            y - size
                        ],
                        [
                            x + width + size,
                            y + size
                        ]
                    ];
                    textPosition = 'right';
                } else {
                    pointList = [
                        [
                            x,
                            y
                        ],
                        [
                            x - size,
                            y - size
                        ],
                        [
                            x - size,
                            y + size
                        ]
                    ];
                    textPosition = 'left';
                }
            }
            this._indicatorShape = {
                style: {
                    pointList: pointList,
                    color: '#fff',
                    __rect: {
                        x: Math.min(pointList[0][0], pointList[1][0]),
                        y: Math.min(pointList[0][1], pointList[1][1]),
                        width: size * (this.dataRangeOption.orient == 'horizontal' ? 2 : 1),
                        height: size * (this.dataRangeOption.orient == 'horizontal' ? 1 : 2)
                    }
                },
                highlightStyle: {
                    brushType: 'fill',
                    textPosition: textPosition,
                    textColor: this.dataRangeOption.textStyle.color
                },
                hoverable: false
            };
            this._indicatorShape = new HandlePolygonShape(this._indicatorShape);
        },
        _buildFiller: function () {
            this._fillerShape = {
                zlevel: this.getZlevelBase(),
                z: this.getZBase() + 1,
                style: {
                    x: this._calculableLocation.x,
                    y: this._calculableLocation.y,
                    width: this._calculableLocation.width,
                    height: this._calculableLocation.height,
                    color: 'rgba(255,255,255,0)'
                },
                highlightStyle: {
                    strokeColor: 'rgba(255,255,255,0.5)',
                    lineWidth: 1
                },
                draggable: true,
                ondrift: this._ondrift,
                ondragend: this._ondragend,
                onmousemove: this._dispatchHoverLink,
                _type: 'filler'
            };
            this._fillerShape = new RectangleShape(this._fillerShape);
            this.shapeList.push(this._fillerShape);
        },
        _bulidHandle: function () {
            var x = this._calculableLocation.x;
            var y = this._calculableLocation.y;
            var width = this._calculableLocation.width;
            var height = this._calculableLocation.height;
            var font = this.getFont(this.dataRangeOption.textStyle);
            var textHeight = zrArea.getTextHeight('弊', font);
            var textWidth = Math.max(zrArea.getTextWidth(this._textFormat(this.dataRangeOption.max), font), zrArea.getTextWidth(this._textFormat(this.dataRangeOption.min), font)) + 2;
            var pointListStart;
            var textXStart;
            var textYStart;
            var coverRectStart;
            var pointListEnd;
            var textXEnd;
            var textYEnd;
            var coverRectEnd;
            if (this.dataRangeOption.orient == 'horizontal') {
                if (this.dataRangeOption.y != 'bottom') {
                    pointListStart = [
                        [
                            x,
                            y
                        ],
                        [
                            x,
                            y + height + textHeight
                        ],
                        [
                            x - textHeight,
                            y + height + textHeight
                        ],
                        [
                            x - 1,
                            y + height
                        ],
                        [
                            x - 1,
                            y
                        ]
                    ];
                    textXStart = x - textWidth / 2 - textHeight;
                    textYStart = y + height + textHeight / 2 + 2;
                    coverRectStart = {
                        x: x - textWidth - textHeight,
                        y: y + height,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                    pointListEnd = [
                        [
                            x + width,
                            y
                        ],
                        [
                            x + width,
                            y + height + textHeight
                        ],
                        [
                            x + width + textHeight,
                            y + height + textHeight
                        ],
                        [
                            x + width + 1,
                            y + height
                        ],
                        [
                            x + width + 1,
                            y
                        ]
                    ];
                    textXEnd = x + width + textWidth / 2 + textHeight;
                    textYEnd = textYStart;
                    coverRectEnd = {
                        x: x + width,
                        y: y + height,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                } else {
                    pointListStart = [
                        [
                            x,
                            y + height
                        ],
                        [
                            x,
                            y - textHeight
                        ],
                        [
                            x - textHeight,
                            y - textHeight
                        ],
                        [
                            x - 1,
                            y
                        ],
                        [
                            x - 1,
                            y + height
                        ]
                    ];
                    textXStart = x - textWidth / 2 - textHeight;
                    textYStart = y - textHeight / 2 - 2;
                    coverRectStart = {
                        x: x - textWidth - textHeight,
                        y: y - textHeight,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                    pointListEnd = [
                        [
                            x + width,
                            y + height
                        ],
                        [
                            x + width,
                            y - textHeight
                        ],
                        [
                            x + width + textHeight,
                            y - textHeight
                        ],
                        [
                            x + width + 1,
                            y
                        ],
                        [
                            x + width + 1,
                            y + height
                        ]
                    ];
                    textXEnd = x + width + textWidth / 2 + textHeight;
                    textYEnd = textYStart;
                    coverRectEnd = {
                        x: x + width,
                        y: y - textHeight,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                }
            } else {
                textWidth += textHeight;
                if (this.dataRangeOption.x != 'right') {
                    pointListStart = [
                        [
                            x,
                            y
                        ],
                        [
                            x + width + textHeight,
                            y
                        ],
                        [
                            x + width + textHeight,
                            y - textHeight
                        ],
                        [
                            x + width,
                            y - 1
                        ],
                        [
                            x,
                            y - 1
                        ]
                    ];
                    textXStart = x + width + textWidth / 2 + textHeight / 2;
                    textYStart = y - textHeight / 2;
                    coverRectStart = {
                        x: x + width,
                        y: y - textHeight,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                    pointListEnd = [
                        [
                            x,
                            y + height
                        ],
                        [
                            x + width + textHeight,
                            y + height
                        ],
                        [
                            x + width + textHeight,
                            y + textHeight + height
                        ],
                        [
                            x + width,
                            y + 1 + height
                        ],
                        [
                            x,
                            y + height + 1
                        ]
                    ];
                    textXEnd = textXStart;
                    textYEnd = y + height + textHeight / 2;
                    coverRectEnd = {
                        x: x + width,
                        y: y + height,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                } else {
                    pointListStart = [
                        [
                            x + width,
                            y
                        ],
                        [
                            x - textHeight,
                            y
                        ],
                        [
                            x - textHeight,
                            y - textHeight
                        ],
                        [
                            x,
                            y - 1
                        ],
                        [
                            x + width,
                            y - 1
                        ]
                    ];
                    textXStart = x - textWidth / 2 - textHeight / 2;
                    textYStart = y - textHeight / 2;
                    coverRectStart = {
                        x: x - textWidth - textHeight,
                        y: y - textHeight,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                    pointListEnd = [
                        [
                            x + width,
                            y + height
                        ],
                        [
                            x - textHeight,
                            y + height
                        ],
                        [
                            x - textHeight,
                            y + textHeight + height
                        ],
                        [
                            x,
                            y + 1 + height
                        ],
                        [
                            x + width,
                            y + height + 1
                        ]
                    ];
                    textXEnd = textXStart;
                    textYEnd = y + height + textHeight / 2;
                    coverRectEnd = {
                        x: x - textWidth - textHeight,
                        y: y + height,
                        width: textWidth + textHeight,
                        height: textHeight
                    };
                }
            }
            this._startShape = {
                style: {
                    pointList: pointListStart,
                    text: this._textFormat(this.dataRangeOption.max),
                    textX: textXStart,
                    textY: textYStart,
                    textFont: font,
                    color: this.getColor(this.dataRangeOption.max),
                    rect: coverRectStart,
                    x: pointListStart[0][0],
                    y: pointListStart[0][1],
                    _x: pointListStart[0][0],
                    _y: pointListStart[0][1]
                }
            };
            this._startShape.highlightStyle = {
                strokeColor: this._startShape.style.color,
                lineWidth: 1
            };
            this._endShape = {
                style: {
                    pointList: pointListEnd,
                    text: this._textFormat(this.dataRangeOption.min),
                    textX: textXEnd,
                    textY: textYEnd,
                    textFont: font,
                    color: this.getColor(this.dataRangeOption.min),
                    rect: coverRectEnd,
                    x: pointListEnd[0][0],
                    y: pointListEnd[0][1],
                    _x: pointListEnd[0][0],
                    _y: pointListEnd[0][1]
                }
            };
            this._endShape.highlightStyle = {
                strokeColor: this._endShape.style.color,
                lineWidth: 1
            };
            this._startShape.zlevel = this._endShape.zlevel = this.getZlevelBase();
            this._startShape.z = this._endShape.z = this.getZBase() + 1;
            this._startShape.draggable = this._endShape.draggable = true;
            this._startShape.ondrift = this._endShape.ondrift = this._ondrift;
            this._startShape.ondragend = this._endShape.ondragend = this._ondragend;
            this._startShape.style.textColor = this._endShape.style.textColor = this.dataRangeOption.textStyle.color;
            this._startShape.style.textAlign = this._endShape.style.textAlign = 'center';
            this._startShape.style.textPosition = this._endShape.style.textPosition = 'specific';
            this._startShape.style.textBaseline = this._endShape.style.textBaseline = 'middle';
            this._startShape.style.width = this._endShape.style.width = 0;
            this._startShape.style.height = this._endShape.style.height = 0;
            this._startShape.style.textPosition = this._endShape.style.textPosition = 'specific';
            this._startShape = new HandlePolygonShape(this._startShape);
            this._endShape = new HandlePolygonShape(this._endShape);
            this.shapeList.push(this._startShape);
            this.shapeList.push(this._endShape);
        },
        _bulidMask: function () {
            var x = this._calculableLocation.x;
            var y = this._calculableLocation.y;
            var width = this._calculableLocation.width;
            var height = this._calculableLocation.height;
            this._startMask = {
                zlevel: this.getZlevelBase(),
                z: this.getZBase() + 1,
                style: {
                    x: x,
                    y: y,
                    width: this.dataRangeOption.orient == 'horizontal' ? 0 : width,
                    height: this.dataRangeOption.orient == 'horizontal' ? height : 0,
                    color: '#ccc'
                },
                hoverable: false
            };
            this._endMask = {
                zlevel: this.getZlevelBase(),
                z: this.getZBase() + 1,
                style: {
                    x: this.dataRangeOption.orient == 'horizontal' ? x + width : x,
                    y: this.dataRangeOption.orient == 'horizontal' ? y : y + height,
                    width: this.dataRangeOption.orient == 'horizontal' ? 0 : width,
                    height: this.dataRangeOption.orient == 'horizontal' ? height : 0,
                    color: '#ccc'
                },
                hoverable: false
            };
            this._startMask = new RectangleShape(this._startMask);
            this._endMask = new RectangleShape(this._endMask);
            this.shapeList.push(this._startMask);
            this.shapeList.push(this._endMask);
        },
        _buildBackground: function () {
            var padding = this.reformCssArray(this.dataRangeOption.padding);
            this.shapeList.push(new RectangleShape({
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                hoverable: false,
                style: {
                    x: this._itemGroupLocation.x - padding[3],
                    y: this._itemGroupLocation.y - padding[0],
                    width: this._itemGroupLocation.width + padding[3] + padding[1],
                    height: this._itemGroupLocation.height + padding[0] + padding[2],
                    brushType: this.dataRangeOption.borderWidth === 0 ? 'fill' : 'both',
                    color: this.dataRangeOption.backgroundColor,
                    strokeColor: this.dataRangeOption.borderColor,
                    lineWidth: this.dataRangeOption.borderWidth
                }
            }));
        },
        _getItemGroupLocation: function () {
            var data = this._valueTextList;
            var dataLength = data.length;
            var itemGap = this.dataRangeOption.itemGap;
            var itemWidth = this.dataRangeOption.itemWidth;
            var itemHeight = this.dataRangeOption.itemHeight;
            var totalWidth = 0;
            var totalHeight = 0;
            var font = this.getFont(this.dataRangeOption.textStyle);
            var textHeight = zrArea.getTextHeight('弊', font);
            var mSize = 10;
            if (this.dataRangeOption.orient == 'horizontal') {
                if (this.dataRangeOption.text || this._isContinuity()) {
                    totalWidth = (this._isContinuity() ? itemWidth * mSize + itemGap : dataLength * (itemWidth + itemGap)) + (this.dataRangeOption.text && typeof this.dataRangeOption.text[0] != 'undefined' ? zrArea.getTextWidth(this.dataRangeOption.text[0], font) + this._textGap : 0) + (this.dataRangeOption.text && typeof this.dataRangeOption.text[1] != 'undefined' ? zrArea.getTextWidth(this.dataRangeOption.text[1], font) + this._textGap : 0);
                } else {
                    itemWidth += 5;
                    for (var i = 0; i < dataLength; i++) {
                        totalWidth += itemWidth + zrArea.getTextWidth(data[i], font) + itemGap;
                    }
                }
                totalWidth -= itemGap;
                totalHeight = Math.max(textHeight, itemHeight);
            } else {
                var maxWidth;
                if (this.dataRangeOption.text || this._isContinuity()) {
                    totalHeight = (this._isContinuity() ? itemHeight * mSize + itemGap : dataLength * (itemHeight + itemGap)) + (this.dataRangeOption.text && typeof this.dataRangeOption.text[0] != 'undefined' ? this._textGap + textHeight : 0) + (this.dataRangeOption.text && typeof this.dataRangeOption.text[1] != 'undefined' ? this._textGap + textHeight : 0);
                    maxWidth = Math.max(zrArea.getTextWidth(this.dataRangeOption.text && this.dataRangeOption.text[0] || '', font), zrArea.getTextWidth(this.dataRangeOption.text && this.dataRangeOption.text[1] || '', font));
                    totalWidth = Math.max(itemWidth, maxWidth);
                } else {
                    totalHeight = (itemHeight + itemGap) * dataLength;
                    itemWidth += 5;
                    maxWidth = 0;
                    for (var i = 0; i < dataLength; i++) {
                        maxWidth = Math.max(maxWidth, zrArea.getTextWidth(data[i], font));
                    }
                    totalWidth = itemWidth + maxWidth;
                }
                totalHeight -= itemGap;
            }
            var padding = this.reformCssArray(this.dataRangeOption.padding);
            var x;
            var zrWidth = this.zr.getWidth();
            switch (this.dataRangeOption.x) {
            case 'center':
                x = Math.floor((zrWidth - totalWidth) / 2);
                break;
            case 'left':
                x = padding[3] + this.dataRangeOption.borderWidth;
                break;
            case 'right':
                x = zrWidth - totalWidth - padding[1] - this.dataRangeOption.borderWidth;
                break;
            default:
                x = this.parsePercent(this.dataRangeOption.x, zrWidth);
                x = isNaN(x) ? 0 : x;
                break;
            }
            var y;
            var zrHeight = this.zr.getHeight();
            switch (this.dataRangeOption.y) {
            case 'top':
                y = padding[0] + this.dataRangeOption.borderWidth;
                break;
            case 'bottom':
                y = zrHeight - totalHeight - padding[2] - this.dataRangeOption.borderWidth;
                break;
            case 'center':
                y = Math.floor((zrHeight - totalHeight) / 2);
                break;
            default:
                y = this.parsePercent(this.dataRangeOption.y, zrHeight);
                y = isNaN(y) ? 0 : y;
                break;
            }
            if (this.dataRangeOption.calculable) {
                var handlerWidth = Math.max(zrArea.getTextWidth(this.dataRangeOption.max, font), zrArea.getTextWidth(this.dataRangeOption.min, font)) + textHeight;
                if (this.dataRangeOption.orient == 'horizontal') {
                    if (x < handlerWidth) {
                        x = handlerWidth;
                    }
                    if (x + totalWidth + handlerWidth > zrWidth) {
                        x -= handlerWidth;
                    }
                } else {
                    if (y < textHeight) {
                        y = textHeight;
                    }
                    if (y + totalHeight + textHeight > zrHeight) {
                        y -= textHeight;
                    }
                }
            }
            return {
                x: x,
                y: y,
                width: totalWidth,
                height: totalHeight
            };
        },
        _getTextShape: function (x, y, text) {
            return {
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                style: {
                    x: this.dataRangeOption.orient == 'horizontal' ? x : this._itemGroupLocation.x + this._itemGroupLocation.width / 2,
                    y: this.dataRangeOption.orient == 'horizontal' ? this._itemGroupLocation.y + this._itemGroupLocation.height / 2 : y,
                    color: this.dataRangeOption.textStyle.color,
                    text: text,
                    textFont: this.getFont(this.dataRangeOption.textStyle),
                    textBaseline: this.dataRangeOption.orient == 'horizontal' ? 'middle' : 'top',
                    textAlign: this.dataRangeOption.orient == 'horizontal' ? 'left' : 'center'
                },
                hoverable: false
            };
        },
        _getItemShape: function (x, y, width, height, color) {
            return {
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                style: {
                    x: x,
                    y: y + 1,
                    width: width,
                    height: height - 2,
                    color: color
                },
                highlightStyle: {
                    strokeColor: color,
                    lineWidth: 1
                }
            };
        },
        __ondrift: function (shape, dx, dy) {
            var x = this._calculableLocation.x;
            var y = this._calculableLocation.y;
            var width = this._calculableLocation.width;
            var height = this._calculableLocation.height;
            if (this.dataRangeOption.orient == 'horizontal') {
                if (shape.style.x + dx <= x) {
                    shape.style.x = x;
                } else if (shape.style.x + dx + shape.style.width >= x + width) {
                    shape.style.x = x + width - shape.style.width;
                } else {
                    shape.style.x += dx;
                }
            } else {
                if (shape.style.y + dy <= y) {
                    shape.style.y = y;
                } else if (shape.style.y + dy + shape.style.height >= y + height) {
                    shape.style.y = y + height - shape.style.height;
                } else {
                    shape.style.y += dy;
                }
            }
            if (shape._type == 'filler') {
                this._syncHandleShape();
            } else {
                this._syncFillerShape(shape);
            }
            if (this.dataRangeOption.realtime) {
                this._dispatchDataRange();
            }
            return true;
        },
        __ondragend: function () {
            this.isDragend = true;
        },
        ondragend: function (param, status) {
            if (!this.isDragend || !param.target) {
                return;
            }
            status.dragOut = true;
            status.dragIn = true;
            if (!this.dataRangeOption.realtime) {
                this._dispatchDataRange();
            }
            status.needRefresh = false;
            this.isDragend = false;
            return;
        },
        _syncShapeFromRange: function () {
            var range = this.dataRangeOption.range || {};
            var optRangeStart = range.start;
            var optRangeEnd = range.end;
            if (optRangeEnd < optRangeStart) {
                optRangeStart = [
                    optRangeEnd,
                    optRangeEnd = optRangeStart
                ][0];
            }
            this._range.end = optRangeStart != null ? optRangeStart : this._range.end != null ? this._range.end : 0;
            this._range.start = optRangeEnd != null ? optRangeEnd : this._range.start != null ? this._range.start : 100;
            if (this._range.start != 100 || this._range.end !== 0) {
                if (this.dataRangeOption.orient == 'horizontal') {
                    var width = this._fillerShape.style.width;
                    this._fillerShape.style.x += width * (100 - this._range.start) / 100;
                    this._fillerShape.style.width = width * (this._range.start - this._range.end) / 100;
                } else {
                    var height = this._fillerShape.style.height;
                    this._fillerShape.style.y += height * (100 - this._range.start) / 100;
                    this._fillerShape.style.height = height * (this._range.start - this._range.end) / 100;
                }
                this.zr.modShape(this._fillerShape.id);
                this._syncHandleShape();
            }
        },
        _syncHandleShape: function () {
            var x = this._calculableLocation.x;
            var y = this._calculableLocation.y;
            var width = this._calculableLocation.width;
            var height = this._calculableLocation.height;
            if (this.dataRangeOption.orient == 'horizontal') {
                this._startShape.style.x = this._fillerShape.style.x;
                this._startMask.style.width = this._startShape.style.x - x;
                this._endShape.style.x = this._fillerShape.style.x + this._fillerShape.style.width;
                this._endMask.style.x = this._endShape.style.x;
                this._endMask.style.width = x + width - this._endShape.style.x;
                this._range.start = Math.ceil(100 - (this._startShape.style.x - x) / width * 100);
                this._range.end = Math.floor(100 - (this._endShape.style.x - x) / width * 100);
            } else {
                this._startShape.style.y = this._fillerShape.style.y;
                this._startMask.style.height = this._startShape.style.y - y;
                this._endShape.style.y = this._fillerShape.style.y + this._fillerShape.style.height;
                this._endMask.style.y = this._endShape.style.y;
                this._endMask.style.height = y + height - this._endShape.style.y;
                this._range.start = Math.ceil(100 - (this._startShape.style.y - y) / height * 100);
                this._range.end = Math.floor(100 - (this._endShape.style.y - y) / height * 100);
            }
            this._syncShape();
        },
        _syncFillerShape: function (e) {
            var x = this._calculableLocation.x;
            var y = this._calculableLocation.y;
            var width = this._calculableLocation.width;
            var height = this._calculableLocation.height;
            var a;
            var b;
            if (this.dataRangeOption.orient == 'horizontal') {
                a = this._startShape.style.x;
                b = this._endShape.style.x;
                if (e.id == this._startShape.id && a >= b) {
                    b = a;
                    this._endShape.style.x = a;
                } else if (e.id == this._endShape.id && a >= b) {
                    a = b;
                    this._startShape.style.x = a;
                }
                this._fillerShape.style.x = a;
                this._fillerShape.style.width = b - a;
                this._startMask.style.width = a - x;
                this._endMask.style.x = b;
                this._endMask.style.width = x + width - b;
                this._range.start = Math.ceil(100 - (a - x) / width * 100);
                this._range.end = Math.floor(100 - (b - x) / width * 100);
            } else {
                a = this._startShape.style.y;
                b = this._endShape.style.y;
                if (e.id == this._startShape.id && a >= b) {
                    b = a;
                    this._endShape.style.y = a;
                } else if (e.id == this._endShape.id && a >= b) {
                    a = b;
                    this._startShape.style.y = a;
                }
                this._fillerShape.style.y = a;
                this._fillerShape.style.height = b - a;
                this._startMask.style.height = a - y;
                this._endMask.style.y = b;
                this._endMask.style.height = y + height - b;
                this._range.start = Math.ceil(100 - (a - y) / height * 100);
                this._range.end = Math.floor(100 - (b - y) / height * 100);
            }
            this._syncShape();
        },
        _syncShape: function () {
            this._startShape.position = [
                this._startShape.style.x - this._startShape.style._x,
                this._startShape.style.y - this._startShape.style._y
            ];
            this._startShape.style.text = this._textFormat(this._gap * this._range.start + this.dataRangeOption.min);
            this._startShape.style.color = this._startShape.highlightStyle.strokeColor = this.getColor(this._gap * this._range.start + this.dataRangeOption.min);
            this._endShape.position = [
                this._endShape.style.x - this._endShape.style._x,
                this._endShape.style.y - this._endShape.style._y
            ];
            this._endShape.style.text = this._textFormat(this._gap * this._range.end + this.dataRangeOption.min);
            this._endShape.style.color = this._endShape.highlightStyle.strokeColor = this.getColor(this._gap * this._range.end + this.dataRangeOption.min);
            this.zr.modShape(this._startShape.id);
            this.zr.modShape(this._endShape.id);
            this.zr.modShape(this._startMask.id);
            this.zr.modShape(this._endMask.id);
            this.zr.modShape(this._fillerShape.id);
            this.zr.refreshNextFrame();
        },
        _dispatchDataRange: function () {
            this.messageCenter.dispatch(ecConfig.EVENT.DATA_RANGE, null, {
                range: {
                    start: this._range.end,
                    end: this._range.start
                }
            }, this.myChart);
        },
        __dataRangeSelected: function (param) {
            if (this.dataRangeOption.selectedMode === 'single') {
                for (var k in this._selectedMap) {
                    this._selectedMap[k] = false;
                }
            }
            var idx = param.target._idx;
            this._selectedMap[idx] = !this._selectedMap[idx];
            var valueMax;
            var valueMin;
            if (this._useCustomizedSplit()) {
                valueMax = this._splitList[idx].max;
                valueMin = this._splitList[idx].min;
            } else {
                valueMax = (this._colorList.length - idx) * this._gap + this.dataRangeOption.min;
                valueMin = valueMax - this._gap;
            }
            this.messageCenter.dispatch(ecConfig.EVENT.DATA_RANGE_SELECTED, param.event, {
                selected: this._selectedMap,
                target: idx,
                valueMax: valueMax,
                valueMin: valueMin
            }, this.myChart);
            this.messageCenter.dispatch(ecConfig.EVENT.REFRESH, null, null, this.myChart);
        },
        __dispatchHoverLink: function (param) {
            var valueMin;
            var valueMax;
            if (this.dataRangeOption.calculable) {
                var totalValue = this.dataRangeOption.max - this.dataRangeOption.min;
                var curValue;
                if (this.dataRangeOption.orient == 'horizontal') {
                    curValue = (1 - (zrEvent.getX(param.event) - this._calculableLocation.x) / this._calculableLocation.width) * totalValue;
                } else {
                    curValue = (1 - (zrEvent.getY(param.event) - this._calculableLocation.y) / this._calculableLocation.height) * totalValue;
                }
                valueMin = curValue - totalValue * 0.05;
                valueMax = curValue + totalValue * 0.05;
            } else if (this._useCustomizedSplit()) {
                var idx = param.target._idx;
                valueMax = this._splitList[idx].max;
                valueMin = this._splitList[idx].min;
            } else {
                var idx = param.target._idx;
                valueMax = (this._colorList.length - idx) * this._gap + this.dataRangeOption.min;
                valueMin = valueMax - this._gap;
            }
            this.messageCenter.dispatch(ecConfig.EVENT.DATA_RANGE_HOVERLINK, param.event, {
                valueMin: valueMin,
                valueMax: valueMax
            }, this.myChart);
        },
        __onhoverlink: function (param) {
            if (this.dataRangeOption.show && this.dataRangeOption.hoverLink && this._indicatorShape && param && param.seriesIndex != null && param.dataIndex != null) {
                var curValue = param.value;
                if (curValue === '' || isNaN(curValue)) {
                    return;
                }
                if (curValue < this.dataRangeOption.min) {
                    curValue = this.dataRangeOption.min;
                } else if (curValue > this.dataRangeOption.max) {
                    curValue = this.dataRangeOption.max;
                }
                if (this.dataRangeOption.orient == 'horizontal') {
                    this._indicatorShape.position = [
                        (this.dataRangeOption.max - curValue) / (this.dataRangeOption.max - this.dataRangeOption.min) * this._calculableLocation.width,
                        0
                    ];
                } else {
                    this._indicatorShape.position = [
                        0,
                        (this.dataRangeOption.max - curValue) / (this.dataRangeOption.max - this.dataRangeOption.min) * this._calculableLocation.height
                    ];
                }
                this._indicatorShape.style.text = this._textFormat(param.value);
                this._indicatorShape.style.color = this.getColor(curValue);
                this.zr.addHoverShape(this._indicatorShape);
            }
        },
        _textFormat: function (valueStart, valueEnd) {
            var dataRangeOption = this.dataRangeOption;
            if (valueStart !== -Number.MAX_VALUE) {
                valueStart = (+valueStart).toFixed(dataRangeOption.precision);
            }
            if (valueEnd != null && valueEnd !== Number.MAX_VALUE) {
                valueEnd = (+valueEnd).toFixed(dataRangeOption.precision);
            }
            if (dataRangeOption.formatter) {
                if (typeof dataRangeOption.formatter == 'string') {
                    return dataRangeOption.formatter.replace('{value}', valueStart === -Number.MAX_VALUE ? 'min' : valueStart).replace('{value2}', valueEnd === Number.MAX_VALUE ? 'max' : valueEnd);
                } else if (typeof dataRangeOption.formatter == 'function') {
                    return dataRangeOption.formatter.call(this.myChart, valueStart, valueEnd);
                }
            }
            if (valueEnd == null) {
                return valueStart;
            } else {
                if (valueStart === -Number.MAX_VALUE) {
                    return '< ' + valueEnd;
                } else if (valueEnd === Number.MAX_VALUE) {
                    return '> ' + valueStart;
                } else {
                    return valueStart + ' - ' + valueEnd;
                }
            }
        },
        _isContinuity: function () {
            var dataRangeOption = this.dataRangeOption;
            return !(dataRangeOption.splitList ? dataRangeOption.splitList.length > 0 : dataRangeOption.splitNumber > 0) || dataRangeOption.calculable;
        },
        _useCustomizedSplit: function () {
            var dataRangeOption = this.dataRangeOption;
            return dataRangeOption.splitList && dataRangeOption.splitList.length > 0;
        },
        _buildColorList: function (splitNumber) {
            this._colorList = zrColor.getGradientColors(this.dataRangeOption.color, Math.max((splitNumber - this.dataRangeOption.color.length) / (this.dataRangeOption.color.length - 1), 0) + 1);
            if (this._colorList.length > splitNumber) {
                var len = this._colorList.length;
                var newColorList = [this._colorList[0]];
                var step = len / (splitNumber - 1);
                for (var i = 1; i < splitNumber - 1; i++) {
                    newColorList.push(this._colorList[Math.floor(i * step)]);
                }
                newColorList.push(this._colorList[len - 1]);
                this._colorList = newColorList;
            }
            if (this._useCustomizedSplit()) {
                var splitList = this._splitList;
                for (var i = 0, len = splitList.length; i < len; i++) {
                    if (splitList[i].color) {
                        this._colorList[i] = splitList[i].color;
                    }
                }
            }
        },
        _buildGap: function (splitNumber) {
            if (!this._useCustomizedSplit()) {
                var precision = this.dataRangeOption.precision;
                this._gap = (this.dataRangeOption.max - this.dataRangeOption.min) / splitNumber;
                while (this._gap.toFixed(precision) - 0 != this._gap && precision < 5) {
                    precision++;
                }
                this.dataRangeOption.precision = precision;
                this._gap = ((this.dataRangeOption.max - this.dataRangeOption.min) / splitNumber).toFixed(precision) - 0;
            }
        },
        _buildDataList: function (splitNumber) {
            var valueTextList = this._valueTextList = [];
            var dataRangeOption = this.dataRangeOption;
            var useCustomizedSplit = this._useCustomizedSplit();
            for (var i = 0; i < splitNumber; i++) {
                this._selectedMap[i] = true;
                var text = '';
                if (useCustomizedSplit) {
                    var splitListItem = this._splitList[splitNumber - 1 - i];
                    if (splitListItem.label != null) {
                        text = splitListItem.label;
                    } else if (splitListItem.single != null) {
                        text = this._textFormat(splitListItem.single);
                    } else {
                        text = this._textFormat(splitListItem.min, splitListItem.max);
                    }
                } else {
                    text = this._textFormat(i * this._gap + dataRangeOption.min, (i + 1) * this._gap + dataRangeOption.min);
                }
                valueTextList.unshift(text);
            }
        },
        _buildSplitList: function () {
            if (!this._useCustomizedSplit()) {
                return;
            }
            var splitList = this.dataRangeOption.splitList;
            var splitRangeList = this._splitList = [];
            for (var i = 0, len = splitList.length; i < len; i++) {
                var splitListItem = splitList[i];
                if (!splitListItem || splitListItem.start == null && splitListItem.end == null) {
                    throw new Error('Empty item exists in splitList!');
                }
                var reformedItem = {
                    label: splitListItem.label,
                    color: splitListItem.color
                };
                reformedItem.min = splitListItem.start;
                reformedItem.max = splitListItem.end;
                if (reformedItem.min > reformedItem.max) {
                    reformedItem.min = [
                        reformedItem.max,
                        reformedItem.max = reformedItem.min
                    ][0];
                }
                if (reformedItem.min === reformedItem.max) {
                    reformedItem.single = reformedItem.max;
                }
                if (reformedItem.min == null) {
                    reformedItem.min = -Number.MAX_VALUE;
                }
                if (reformedItem.max == null) {
                    reformedItem.max = Number.MAX_VALUE;
                }
                splitRangeList.push(reformedItem);
            }
        },
        refresh: function (newOption) {
            if (newOption) {
                this.option = newOption;
                this.option.dataRange = this.reformOption(this.option.dataRange);
                var dataRangeOption = this.dataRangeOption = this.option.dataRange;
                if (!this._useCustomizedSplit() && (dataRangeOption.min == null || dataRangeOption.max == null)) {
                    throw new Error('option.dataRange.min or option.dataRange.max has not been defined.');
                }
                if (!this.myChart.canvasSupported) {
                    dataRangeOption.realtime = false;
                }
                var splitNumber = this._isContinuity() ? 100 : this._useCustomizedSplit() ? dataRangeOption.splitList.length : dataRangeOption.splitNumber;
                this._buildSplitList();
                this._buildColorList(splitNumber);
                this._buildGap(splitNumber);
                this._buildDataList(splitNumber);
            }
            this.clear();
            this._buildShape();
        },
        getColor: function (value) {
            if (isNaN(value)) {
                return null;
            }
            var idx;
            if (!this._useCustomizedSplit()) {
                if (this.dataRangeOption.min == this.dataRangeOption.max) {
                    return this._colorList[0];
                }
                if (value < this.dataRangeOption.min) {
                    value = this.dataRangeOption.min;
                } else if (value > this.dataRangeOption.max) {
                    value = this.dataRangeOption.max;
                }
                if (this.dataRangeOption.calculable) {
                    if (value - (this._gap * this._range.start + this.dataRangeOption.min) > 0.00005 || value - (this._gap * this._range.end + this.dataRangeOption.min) < -0.00005) {
                        return null;
                    }
                }
                idx = this._colorList.length - Math.ceil((value - this.dataRangeOption.min) / (this.dataRangeOption.max - this.dataRangeOption.min) * this._colorList.length);
                if (idx == this._colorList.length) {
                    idx--;
                }
            } else {
                var splitRangeList = this._splitList;
                for (var i = 0, len = splitRangeList.length; i < len; i++) {
                    if (splitRangeList[i].min <= value && splitRangeList[i].max >= value) {
                        idx = i;
                        break;
                    }
                }
            }
            if (this._selectedMap[idx]) {
                return this._colorList[idx];
            } else {
                return null;
            }
        },
        getColorByIndex: function (idx) {
            if (idx >= this._colorList.length) {
                idx = this._colorList.length - 1;
            } else if (idx < 0) {
                idx = 0;
            }
            return this._colorList[idx];
        },
        onbeforDispose: function () {
            this.messageCenter.unbind(ecConfig.EVENT.HOVER, this._onhoverlink);
        }
    };
    zrUtil.inherits(DataRange, Base);
    require('../component').define('dataRange', DataRange);
    return DataRange;
});define('echarts/component/roamController', [
    'require',
    './base',
    'zrender/shape/Rectangle',
    'zrender/shape/Sector',
    'zrender/shape/Circle',
    '../config',
    'zrender/tool/util',
    'zrender/tool/color',
    'zrender/tool/event',
    '../component'
], function (require) {
    var Base = require('./base');
    var RectangleShape = require('zrender/shape/Rectangle');
    var SectorShape = require('zrender/shape/Sector');
    var CircleShape = require('zrender/shape/Circle');
    var ecConfig = require('../config');
    ecConfig.roamController = {
        zlevel: 0,
        z: 4,
        show: true,
        x: 'left',
        y: 'top',
        width: 80,
        height: 120,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#ccc',
        borderWidth: 0,
        padding: 5,
        handleColor: '#6495ed',
        fillerColor: '#fff',
        step: 15,
        mapTypeControl: null
    };
    var zrUtil = require('zrender/tool/util');
    var zrColor = require('zrender/tool/color');
    var zrEvent = require('zrender/tool/event');
    function RoamController(ecTheme, messageCenter, zr, option, myChart) {
        this.rcOption = {};
        if (!option.roamController || !option.roamController.show) {
            return;
        }
        if (!option.roamController.mapTypeControl) {
            console.error('option.roamController.mapTypeControl has not been defined.');
            return;
        }
        Base.call(this, ecTheme, messageCenter, zr, option, myChart);
        this.rcOption = option.roamController;
        var self = this;
        this._drictionMouseDown = function (params) {
            return self.__drictionMouseDown(params);
        };
        this._drictionMouseUp = function (params) {
            return self.__drictionMouseUp(params);
        };
        this._drictionMouseMove = function (params) {
            return self.__drictionMouseMove(params);
        };
        this._drictionMouseOut = function (params) {
            return self.__drictionMouseOut(params);
        };
        this._scaleHandler = function (params) {
            return self.__scaleHandler(params);
        };
        this.refresh(option);
    }
    RoamController.prototype = {
        type: ecConfig.COMPONENT_TYPE_ROAMCONTROLLER,
        _buildShape: function () {
            if (!this.rcOption.show) {
                return;
            }
            this._itemGroupLocation = this._getItemGroupLocation();
            this._buildBackground();
            this._buildItem();
            for (var i = 0, l = this.shapeList.length; i < l; i++) {
                this.zr.addShape(this.shapeList[i]);
            }
        },
        _buildItem: function () {
            this.shapeList.push(this._getDirectionShape('up'));
            this.shapeList.push(this._getDirectionShape('down'));
            this.shapeList.push(this._getDirectionShape('left'));
            this.shapeList.push(this._getDirectionShape('right'));
            this.shapeList.push(this._getScaleShape('scaleUp'));
            this.shapeList.push(this._getScaleShape('scaleDown'));
        },
        _getDirectionShape: function (direction) {
            var r = this._itemGroupLocation.r;
            var x = this._itemGroupLocation.x + r;
            var y = this._itemGroupLocation.y + r;
            var sectorShape = {
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                style: {
                    x: x,
                    y: y,
                    r: r,
                    startAngle: -45,
                    endAngle: 45,
                    color: this.rcOption.handleColor,
                    text: '>',
                    textX: x + r / 2 + 4,
                    textY: y - 0.5,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textPosition: 'specific',
                    textColor: this.rcOption.fillerColor,
                    textFont: Math.floor(r / 2) + 'px arial'
                },
                highlightStyle: {
                    color: zrColor.lift(this.rcOption.handleColor, -0.2),
                    brushType: 'fill'
                },
                clickable: true
            };
            switch (direction) {
            case 'up':
                sectorShape.rotation = [
                    Math.PI / 2,
                    x,
                    y
                ];
                break;
            case 'left':
                sectorShape.rotation = [
                    Math.PI,
                    x,
                    y
                ];
                break;
            case 'down':
                sectorShape.rotation = [
                    -Math.PI / 2,
                    x,
                    y
                ];
                break;
            }
            sectorShape = new SectorShape(sectorShape);
            sectorShape._roamType = direction;
            sectorShape.onmousedown = this._drictionMouseDown;
            sectorShape.onmouseup = this._drictionMouseUp;
            sectorShape.onmousemove = this._drictionMouseMove;
            sectorShape.onmouseout = this._drictionMouseOut;
            return sectorShape;
        },
        _getScaleShape: function (text) {
            var width = this._itemGroupLocation.width;
            var height = this._itemGroupLocation.height - width;
            height = height < 0 ? 20 : height;
            var r = Math.min(width / 2 - 5, height) / 2;
            var x = this._itemGroupLocation.x + (text === 'scaleDown' ? width - r : r);
            var y = this._itemGroupLocation.y + this._itemGroupLocation.height - r;
            var scaleShape = {
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                style: {
                    x: x,
                    y: y,
                    r: r,
                    color: this.rcOption.handleColor,
                    text: text === 'scaleDown' ? '-' : '+',
                    textX: x,
                    textY: y - 2,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textPosition: 'specific',
                    textColor: this.rcOption.fillerColor,
                    textFont: Math.floor(r) + 'px verdana'
                },
                highlightStyle: {
                    color: zrColor.lift(this.rcOption.handleColor, -0.2),
                    brushType: 'fill'
                },
                clickable: true
            };
            scaleShape = new CircleShape(scaleShape);
            scaleShape._roamType = text;
            scaleShape.onmousedown = this._scaleHandler;
            return scaleShape;
        },
        _buildBackground: function () {
            var padding = this.reformCssArray(this.rcOption.padding);
            this.shapeList.push(new RectangleShape({
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                hoverable: false,
                style: {
                    x: this._itemGroupLocation.x - padding[3],
                    y: this._itemGroupLocation.y - padding[0],
                    width: this._itemGroupLocation.width + padding[3] + padding[1],
                    height: this._itemGroupLocation.height + padding[0] + padding[2],
                    brushType: this.rcOption.borderWidth === 0 ? 'fill' : 'both',
                    color: this.rcOption.backgroundColor,
                    strokeColor: this.rcOption.borderColor,
                    lineWidth: this.rcOption.borderWidth
                }
            }));
        },
        _getItemGroupLocation: function () {
            var padding = this.reformCssArray(this.rcOption.padding);
            var width = this.rcOption.width;
            var height = this.rcOption.height;
            var zrWidth = this.zr.getWidth();
            var zrHeight = this.zr.getHeight();
            var x;
            switch (this.rcOption.x) {
            case 'center':
                x = Math.floor((zrWidth - width) / 2);
                break;
            case 'left':
                x = padding[3] + this.rcOption.borderWidth;
                break;
            case 'right':
                x = zrWidth - width - padding[1] - padding[3] - this.rcOption.borderWidth * 2;
                break;
            default:
                x = this.parsePercent(this.rcOption.x, zrWidth);
                break;
            }
            var y;
            switch (this.rcOption.y) {
            case 'top':
                y = padding[0] + this.rcOption.borderWidth;
                break;
            case 'bottom':
                y = zrHeight - height - padding[0] - padding[2] - this.rcOption.borderWidth * 2;
                break;
            case 'center':
                y = Math.floor((zrHeight - height) / 2);
                break;
            default:
                y = this.parsePercent(this.rcOption.y, zrHeight);
                break;
            }
            return {
                x: x,
                y: y,
                r: width / 2,
                width: width,
                height: height
            };
        },
        __drictionMouseDown: function (params) {
            this.mousedown = true;
            this._drictionHandlerOn(params);
        },
        __drictionMouseUp: function (params) {
            this.mousedown = false;
            this._drictionHandlerOff(params);
        },
        __drictionMouseMove: function (params) {
            if (this.mousedown) {
                this._drictionHandlerOn(params);
            }
        },
        __drictionMouseOut: function (params) {
            this._drictionHandlerOff(params);
        },
        _drictionHandlerOn: function (params) {
            this._dispatchEvent(params.event, params.target._roamType);
            clearInterval(this.dircetionTimer);
            var self = this;
            this.dircetionTimer = setInterval(function () {
                self._dispatchEvent(params.event, params.target._roamType);
            }, 100);
            zrEvent.stop(params.event);
        },
        _drictionHandlerOff: function (params) {
            clearInterval(this.dircetionTimer);
        },
        __scaleHandler: function (params) {
            this._dispatchEvent(params.event, params.target._roamType);
            zrEvent.stop(params.event);
        },
        _dispatchEvent: function (event, roamType) {
            this.messageCenter.dispatch(ecConfig.EVENT.ROAMCONTROLLER, event, {
                roamType: roamType,
                mapTypeControl: this.rcOption.mapTypeControl,
                step: this.rcOption.step
            }, this.myChart);
        },
        refresh: function (newOption) {
            if (newOption) {
                this.option = newOption || this.option;
                this.option.roamController = this.reformOption(this.option.roamController);
                this.rcOption = this.option.roamController;
            }
            this.clear();
            this._buildShape();
        }
    };
    zrUtil.inherits(RoamController, Base);
    require('../component').define('roamController', RoamController);
    return RoamController;
});define('echarts/layer/heatmap', ['require'], function (require) {
    var defaultOptions = {
        blurSize: 30,
        gradientColors: [
            'blue',
            'cyan',
            'lime',
            'yellow',
            'red'
        ],
        minAlpha: 0.05,
        valueScale: 1,
        opacity: 1
    };
    var BRUSH_SIZE = 20;
    var GRADIENT_LEVELS = 256;
    function Heatmap(opt) {
        this.option = opt;
        if (opt) {
            for (var i in defaultOptions) {
                if (opt[i] !== undefined) {
                    this.option[i] = opt[i];
                } else {
                    this.option[i] = defaultOptions[i];
                }
            }
        } else {
            this.option = defaultOptions;
        }
    }
    Heatmap.prototype = {
        getCanvas: function (data, width, height) {
            var brush = this._getBrush();
            var gradient = this._getGradient();
            var r = BRUSH_SIZE + this.option.blurSize;
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            var len = data.length;
            for (var i = 0; i < len; ++i) {
                var p = data[i];
                var x = p[0];
                var y = p[1];
                var value = p[2];
                var alpha = Math.min(1, Math.max(value * this.option.valueScale || this.option.minAlpha, this.option.minAlpha));
                ctx.globalAlpha = alpha;
                ctx.drawImage(brush, x - r, y - r);
            }
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;
            var len = pixels.length / 4;
            while (len--) {
                var id = len * 4 + 3;
                var alpha = pixels[id] / 256;
                var colorOffset = Math.floor(alpha * (GRADIENT_LEVELS - 1));
                pixels[id - 3] = gradient[colorOffset * 4];
                pixels[id - 2] = gradient[colorOffset * 4 + 1];
                pixels[id - 1] = gradient[colorOffset * 4 + 2];
                pixels[id] *= this.option.opacity;
            }
            ctx.putImageData(imageData, 0, 0);
            return canvas;
        },
        _getBrush: function () {
            if (!this._brushCanvas) {
                this._brushCanvas = document.createElement('canvas');
                var r = BRUSH_SIZE + this.option.blurSize;
                var d = r * 2;
                this._brushCanvas.width = d;
                this._brushCanvas.height = d;
                var ctx = this._brushCanvas.getContext('2d');
                ctx.shadowOffsetX = d;
                ctx.shadowBlur = this.option.blurSize;
                ctx.shadowColor = 'black';
                ctx.beginPath();
                ctx.arc(-r, r, BRUSH_SIZE, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
            return this._brushCanvas;
        },
        _getGradient: function () {
            if (!this._gradientPixels) {
                var levels = GRADIENT_LEVELS;
                var canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = levels;
                var ctx = canvas.getContext('2d');
                var gradient = ctx.createLinearGradient(0, 0, 0, levels);
                var len = this.option.gradientColors.length;
                for (var i = 0; i < len; ++i) {
                    if (typeof this.option.gradientColors[i] === 'string') {
                        gradient.addColorStop((i + 1) / len, this.option.gradientColors[i]);
                    } else {
                        gradient.addColorStop(this.option.gradientColors[i].offset, this.option.gradientColors[i].color);
                    }
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1, levels);
                this._gradientPixels = ctx.getImageData(0, 0, 1, levels).data;
            }
            return this._gradientPixels;
        }
    };
    return Heatmap;
});define('echarts/util/mapData/params', ['require'], function (require) {
    function decode(json) {
        if (!json.UTF8Encoding) {
            return json;
        }
        var features = json.features;
        for (var f = 0; f < features.length; f++) {
            var feature = features[f];
            var coordinates = feature.geometry.coordinates;
            var encodeOffsets = feature.geometry.encodeOffsets;
            for (var c = 0; c < coordinates.length; c++) {
                var coordinate = coordinates[c];
                if (feature.geometry.type === 'Polygon') {
                    coordinates[c] = decodePolygon(coordinate, encodeOffsets[c]);
                } else if (feature.geometry.type === 'MultiPolygon') {
                    for (var c2 = 0; c2 < coordinate.length; c2++) {
                        var polygon = coordinate[c2];
                        coordinate[c2] = decodePolygon(polygon, encodeOffsets[c][c2]);
                    }
                }
            }
        }
        json.UTF8Encoding = false;
        return json;
    }
    function decodePolygon(coordinate, encodeOffsets) {
        var result = [];
        var prevX = encodeOffsets[0];
        var prevY = encodeOffsets[1];
        for (var i = 0; i < coordinate.length; i += 2) {
            var x = coordinate.charCodeAt(i) - 64;
            var y = coordinate.charCodeAt(i + 1) - 64;
            x = x >> 1 ^ -(x & 1);
            y = y >> 1 ^ -(y & 1);
            x += prevX;
            y += prevY;
            prevX = x;
            prevY = y;
            result.push([
                x / 1024,
                y / 1024
            ]);
        }
        return result;
    }
    var mapParams = {
        'none': {
            getGeoJson: function (callback) {
                callback({
                    type: 'FeatureCollection',
                    features: [{
                            type: 'Feature',
                            geometry: {
                                coordinates: [],
                                encodeOffsets: [],
                                type: 'Polygon'
                            },
                            properties: {}
                        }]
                });
            }
        },
        'world': {
            getGeoJson: function (callback) {
                require(['./geoJson/world_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        'china': {
            getGeoJson: function (callback) {
                require(['./geoJson/china_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '鰍漆絊絢': {
            textCoord: [
                126,
                25
            ],
            getPath: function (leftTop, scale) {
                var pList = [
                    [
                        [
                            0,
                            3.5
                        ],
                        [
                            7,
                            11.2
                        ],
                        [
                            15,
                            11.9
                        ],
                        [
                            30,
                            7
                        ],
                        [
                            42,
                            0.7
                        ],
                        [
                            52,
                            0.7
                        ],
                        [
                            56,
                            7.7
                        ],
                        [
                            59,
                            0.7
                        ],
                        [
                            64,
                            0.7
                        ],
                        [
                            64,
                            0
                        ],
                        [
                            5,
                            0
                        ],
                        [
                            0,
                            3.5
                        ]
                    ],
                    [
                        [
                            13,
                            16.1
                        ],
                        [
                            19,
                            14.7
                        ],
                        [
                            16,
                            21.7
                        ],
                        [
                            11,
                            23.1
                        ],
                        [
                            13,
                            16.1
                        ]
                    ],
                    [
                        [
                            12,
                            32.2
                        ],
                        [
                            14,
                            38.5
                        ],
                        [
                            15,
                            38.5
                        ],
                        [
                            13,
                            32.2
                        ],
                        [
                            12,
                            32.2
                        ]
                    ],
                    [
                        [
                            16,
                            47.6
                        ],
                        [
                            12,
                            53.2
                        ],
                        [
                            13,
                            53.2
                        ],
                        [
                            18,
                            47.6
                        ],
                        [
                            16,
                            47.6
                        ]
                    ],
                    [
                        [
                            6,
                            64.4
                        ],
                        [
                            8,
                            70
                        ],
                        [
                            9,
                            70
                        ],
                        [
                            8,
                            64.4
                        ],
                        [
                            6,
                            64.4
                        ]
                    ],
                    [
                        [
                            23,
                            82.6
                        ],
                        [
                            29,
                            79.8
                        ],
                        [
                            30,
                            79.8
                        ],
                        [
                            25,
                            82.6
                        ],
                        [
                            23,
                            82.6
                        ]
                    ],
                    [
                        [
                            37,
                            70.7
                        ],
                        [
                            43,
                            62.3
                        ],
                        [
                            44,
                            62.3
                        ],
                        [
                            39,
                            70.7
                        ],
                        [
                            37,
                            70.7
                        ]
                    ],
                    [
                        [
                            48,
                            51.1
                        ],
                        [
                            51,
                            45.5
                        ],
                        [
                            53,
                            45.5
                        ],
                        [
                            50,
                            51.1
                        ],
                        [
                            48,
                            51.1
                        ]
                    ],
                    [
                        [
                            51,
                            35
                        ],
                        [
                            51,
                            28.7
                        ],
                        [
                            53,
                            28.7
                        ],
                        [
                            53,
                            35
                        ],
                        [
                            51,
                            35
                        ]
                    ],
                    [
                        [
                            52,
                            22.4
                        ],
                        [
                            55,
                            17.5
                        ],
                        [
                            56,
                            17.5
                        ],
                        [
                            53,
                            22.4
                        ],
                        [
                            52,
                            22.4
                        ]
                    ],
                    [
                        [
                            58,
                            12.6
                        ],
                        [
                            62,
                            7
                        ],
                        [
                            63,
                            7
                        ],
                        [
                            60,
                            12.6
                        ],
                        [
                            58,
                            12.6
                        ]
                    ],
                    [
                        [
                            0,
                            3.5
                        ],
                        [
                            0,
                            93.1
                        ],
                        [
                            64,
                            93.1
                        ],
                        [
                            64,
                            0
                        ],
                        [
                            63,
                            0
                        ],
                        [
                            63,
                            92.4
                        ],
                        [
                            1,
                            92.4
                        ],
                        [
                            1,
                            3.5
                        ],
                        [
                            0,
                            3.5
                        ]
                    ]
                ];
                var str = '';
                var left = leftTop[0];
                var top = leftTop[1];
                for (var i = 0, l = pList.length; i < l; i++) {
                    str += 'M ' + ((pList[i][0][0] * scale + left).toFixed(2) - 0) + ' ' + ((pList[i][0][1] * scale + top).toFixed(2) - 0) + ' ';
                    for (var j = 1, k = pList[i].length; j < k; j++) {
                        str += 'L ' + ((pList[i][j][0] * scale + left).toFixed(2) - 0) + ' ' + ((pList[i][j][1] * scale + top).toFixed(2) - 0) + ' ';
                    }
                }
                return str + ' Z';
            }
        },
        '陔蔭': {
            getGeoJson: function (callback) {
                require(['./geoJson/xin_jiang_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '昹紲': {
            getGeoJson: function (callback) {
                require(['./geoJson/xi_zang_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '囀蟹嘉': {
            getGeoJson: function (callback) {
                require(['./geoJson/nei_meng_gu_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        'ч漆': {
            getGeoJson: function (callback) {
                require(['./geoJson/qing_hai_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '侐捶': {
            getGeoJson: function (callback) {
                require(['./geoJson/si_chuan_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '窪韓蔬': {
            getGeoJson: function (callback) {
                require(['./geoJson/hei_long_jiang_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '裘咈': {
            getGeoJson: function (callback) {
                require(['./geoJson/gan_su_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '堁鰍': {
            getGeoJson: function (callback) {
                require(['./geoJson/yun_nan_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '嫘昹': {
            getGeoJson: function (callback) {
                require(['./geoJson/guang_xi_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '綬鰍': {
            getGeoJson: function (callback) {
                require(['./geoJson/hu_nan_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '匟昹': {
            getGeoJson: function (callback) {
                require(['./geoJson/shan_xi_1_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '嫘陲': {
            getGeoJson: function (callback) {
                require(['./geoJson/guang_dong_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '憚輿': {
            getGeoJson: function (callback) {
                require(['./geoJson/ji_lin_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '碩控': {
            getGeoJson: function (callback) {
                require(['./geoJson/he_bei_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '綬控': {
            getGeoJson: function (callback) {
                require(['./geoJson/hu_bei_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '幛笣': {
            getGeoJson: function (callback) {
                require(['./geoJson/gui_zhou_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '刓陲': {
            getGeoJson: function (callback) {
                require(['./geoJson/shan_dong_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '蔬昹': {
            getGeoJson: function (callback) {
                require(['./geoJson/jiang_xi_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '碩鰍': {
            getGeoJson: function (callback) {
                require(['./geoJson/he_nan_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '賽譴': {
            getGeoJson: function (callback) {
                require(['./geoJson/liao_ning_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '刓昹': {
            getGeoJson: function (callback) {
                require(['./geoJson/shan_xi_2_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '假閣': {
            getGeoJson: function (callback) {
                require(['./geoJson/an_hui_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '腦膘': {
            getGeoJson: function (callback) {
                require(['./geoJson/fu_jian_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '涳蔬': {
            getGeoJson: function (callback) {
                require(['./geoJson/zhe_jiang_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '蔬劼': {
            getGeoJson: function (callback) {
                require(['./geoJson/jiang_su_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '笭④': {
            getGeoJson: function (callback) {
                require(['./geoJson/chong_qing_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '譴狦': {
            getGeoJson: function (callback) {
                require(['./geoJson/ning_xia_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '漆鰍': {
            getGeoJson: function (callback) {
                require(['./geoJson/hai_nan_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '怢俜': {
            getGeoJson: function (callback) {
                require(['./geoJson/tai_wan_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '控儔': {
            getGeoJson: function (callback) {
                require(['./geoJson/bei_jing_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '毞踩': {
            getGeoJson: function (callback) {
                require(['./geoJson/tian_jin_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '奻漆': {
            getGeoJson: function (callback) {
                require(['./geoJson/shang_hai_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '眅誠': {
            getGeoJson: function (callback) {
                require(['./geoJson/xiang_gang_geo'], function (md) {
                    callback(decode(md));
                });
            }
        },
        '凰藷': {
            getGeoJson: function (callback) {
                require(['./geoJson/ao_men_geo'], function (md) {
                    callback(decode(md));
                });
            }
        }
    };
    return {
        decode: decode,
        params: mapParams
    };
});define('echarts/util/mapData/textFixed', [], function () {
    return {
        '嫘陲': [
            0,
            -10
        ],
        '眅誠': [
            10,
            10
        ],
        '凰藷': [
            -10,
            18
        ],
        '窪韓蔬': [
            0,
            20
        ],
        '毞踩': [
            5,
            5
        ],
        '旮詀庈': [
            -35,
            0
        ],
        '綻碩慇攝逜眝逜赻笥笣': [
            0,
            20
        ],
        '奠倯眝逜赻笥笣': [
            -5,
            15
        ],
        '坒碩赽庈': [
            -5,
            5
        ],
        '拻模��庈': [
            0,
            -10
        ],
        '荻憚隙逜赻笥笣': [
            10,
            10
        ],
        '荻蔬燮逜赻笥瓮': [
            0,
            20
        ],
        '鍬阨燮逜赻笥瓮': [
            0,
            20
        ],
        '陲源庈': [
            0,
            20
        ],
        '弮鰍庈': [
            0,
            20
        ]
    };
});define('echarts/util/mapData/geoCoord', [], function () {
    return {
        'Russia': [
            100,
            60
        ],
        'United States of America': [
            -99,
            38
        ]
    };
});define('echarts/util/projection/svg', [
    'require',
    'zrender/shape/Path'
], function (require) {
    var PathShape = require('zrender/shape/Path');
    function toFloat(str) {
        return parseFloat(str || 0);
    }
    function getBbox(root) {
        var svgNode = root.firstChild;
        while (!(svgNode.nodeName.toLowerCase() == 'svg' && svgNode.nodeType == 1)) {
            svgNode = svgNode.nextSibling;
        }
        var x = toFloat(svgNode.getAttribute('x'));
        var y = toFloat(svgNode.getAttribute('y'));
        var width = toFloat(svgNode.getAttribute('width'));
        var height = toFloat(svgNode.getAttribute('height'));
        return {
            left: x,
            top: y,
            width: width,
            height: height
        };
    }
    function geoJson2Path(root, transform) {
        var scale = [
            transform.scale.x,
            transform.scale.y
        ];
        var elList = [];
        function _getShape(root) {
            var tagName = root.tagName;
            if (shapeBuilders[tagName]) {
                var obj = shapeBuilders[tagName](root, scale);
                if (obj) {
                    obj.scale = scale;
                    obj.properties = { name: root.getAttribute('name') || '' };
                    obj.id = root.id;
                    extendCommonAttributes(obj, root);
                    elList.push(obj);
                }
            }
            var shapes = root.childNodes;
            for (var i = 0, len = shapes.length; i < len; i++) {
                _getShape(shapes[i]);
            }
        }
        _getShape(root);
        return elList;
    }
    function pos2geo(obj, p) {
        var point = p instanceof Array ? [
            p[0] * 1,
            p[1] * 1
        ] : [
            p.x * 1,
            p.y * 1
        ];
        return [
            point[0] / obj.scale.x,
            point[1] / obj.scale.y
        ];
    }
    function geo2pos(obj, p) {
        var point = p instanceof Array ? [
            p[0] * 1,
            p[1] * 1
        ] : [
            p.x * 1,
            p.y * 1
        ];
        return [
            point[0] * obj.scale.x,
            point[1] * obj.scale.y
        ];
    }
    function trim(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    function extendCommonAttributes(obj, xmlNode) {
        var color = xmlNode.getAttribute('fill');
        var strokeColor = xmlNode.getAttribute('stroke');
        var lineWidth = xmlNode.getAttribute('stroke-width');
        var opacity = xmlNode.getAttribute('opacity');
        if (color && color != 'none') {
            obj.color = color;
            if (strokeColor) {
                obj.brushType = 'both';
                obj.strokeColor = strokeColor;
            } else {
                obj.brushType = 'fill';
            }
        } else if (strokeColor && strokeColor != 'none') {
            obj.strokeColor = strokeColor;
            obj.brushType = 'stroke';
        }
        if (lineWidth && lineWidth != 'none') {
            obj.lineWidth = parseFloat(lineWidth);
        }
        if (opacity && opacity != 'none') {
            obj.opacity = parseFloat(opacity);
        }
    }
    function parsePoints(str) {
        var list = trim(str).replace(/,/g, ' ').split(/\s+/);
        var points = [];
        for (var i = 0; i < list.length;) {
            var x = parseFloat(list[i++]);
            var y = parseFloat(list[i++]);
            points.push([
                x,
                y
            ]);
        }
        return points;
    }
    var shapeBuilders = {
        path: function (xmlNode, scale) {
            var path = xmlNode.getAttribute('d');
            var rect = PathShape.prototype.getRect({ path: path });
            return {
                shapeType: 'path',
                path: path,
                cp: [
                    (rect.x + rect.width / 2) * scale[0],
                    (rect.y + rect.height / 2) * scale[1]
                ]
            };
        },
        rect: function (xmlNode, scale) {
            var x = toFloat(xmlNode.getAttribute('x'));
            var y = toFloat(xmlNode.getAttribute('y'));
            var width = toFloat(xmlNode.getAttribute('width'));
            var height = toFloat(xmlNode.getAttribute('height'));
            return {
                shapeType: 'rectangle',
                x: x,
                y: y,
                width: width,
                height: height,
                cp: [
                    (x + width / 2) * scale[0],
                    (y + height / 2) * scale[1]
                ]
            };
        },
        line: function (xmlNode, scale) {
            var x1 = toFloat(xmlNode.getAttribute('x1'));
            var y1 = toFloat(xmlNode.getAttribute('y1'));
            var x2 = toFloat(xmlNode.getAttribute('x2'));
            var y2 = toFloat(xmlNode.getAttribute('y2'));
            return {
                shapeType: 'line',
                xStart: x1,
                yStart: y1,
                xEnd: x2,
                yEnd: y2,
                cp: [
                    (x1 + x2) * 0.5 * scale[0],
                    (y1 + y2) * 0.5 * scale[1]
                ]
            };
        },
        circle: function (xmlNode, scale) {
            var cx = toFloat(xmlNode.getAttribute('cx'));
            var cy = toFloat(xmlNode.getAttribute('cy'));
            var r = toFloat(xmlNode.getAttribute('r'));
            return {
                shapeType: 'circle',
                x: cx,
                y: cy,
                r: r,
                cp: [
                    cx * scale[0],
                    cy * scale[1]
                ]
            };
        },
        ellipse: function (xmlNode, scale) {
            var cx = parseFloat(xmlNode.getAttribute('cx') || 0);
            var cy = parseFloat(xmlNode.getAttribute('cy') || 0);
            var rx = parseFloat(xmlNode.getAttribute('rx') || 0);
            var ry = parseFloat(xmlNode.getAttribute('ry') || 0);
            return {
                shapeType: 'ellipse',
                x: cx,
                y: cy,
                a: rx,
                b: ry,
                cp: [
                    cx * scale[0],
                    cy * scale[1]
                ]
            };
        },
        polygon: function (xmlNode, scale) {
            var points = xmlNode.getAttribute('points');
            var min = [
                Infinity,
                Infinity
            ];
            var max = [
                -Infinity,
                -Infinity
            ];
            if (points) {
                points = parsePoints(points);
                for (var i = 0; i < points.length; i++) {
                    var p = points[i];
                    min[0] = Math.min(p[0], min[0]);
                    min[1] = Math.min(p[1], min[1]);
                    max[0] = Math.max(p[0], max[0]);
                    max[1] = Math.max(p[1], max[1]);
                }
                return {
                    shapeType: 'polygon',
                    pointList: points,
                    cp: [
                        (min[0] + max[0]) / 2 * scale[0],
                        (min[1] + max[1]) / 2 * scale[0]
                    ]
                };
            }
        },
        polyline: function (xmlNode, scale) {
            var obj = shapeBuilders.polygon(xmlNode, scale);
            return obj;
        }
    };
    return {
        getBbox: getBbox,
        geoJson2Path: geoJson2Path,
        pos2geo: pos2geo,
        geo2pos: geo2pos
    };
});define('echarts/util/projection/normal', [], function () {
    function getBbox(json, specialArea) {
        specialArea = specialArea || {};
        if (!json.srcSize) {
            parseSrcSize(json, specialArea);
        }
        return json.srcSize;
    }
    function parseSrcSize(json, specialArea) {
        specialArea = specialArea || {};
        convertorParse.xmin = 360;
        convertorParse.xmax = -360;
        convertorParse.ymin = 180;
        convertorParse.ymax = -180;
        var shapes = json.features;
        var geometries;
        var shape;
        for (var i = 0, len = shapes.length; i < len; i++) {
            shape = shapes[i];
            if (shape.properties.name && specialArea[shape.properties.name]) {
                continue;
            }
            switch (shape.type) {
            case 'Feature':
                convertorParse[shape.geometry.type](shape.geometry.coordinates);
                break;
            case 'GeometryCollection':
                geometries = shape.geometries;
                for (var j = 0, len2 = geometries.length; j < len2; j++) {
                    convertorParse[geometries[j].type](geometries[j].coordinates);
                }
                break;
            }
        }
        json.srcSize = {
            left: convertorParse.xmin.toFixed(4) * 1,
            top: convertorParse.ymin.toFixed(4) * 1,
            width: (convertorParse.xmax - convertorParse.xmin).toFixed(4) * 1,
            height: (convertorParse.ymax - convertorParse.ymin).toFixed(4) * 1
        };
        return json;
    }
    var convertor = {
        formatPoint: function (p) {
            return [
                (p[0] < -168.5 && p[1] > 63.8 ? p[0] + 360 : p[0]) + 168.5,
                90 - p[1]
            ];
        },
        makePoint: function (p) {
            var self = this;
            var point = self.formatPoint(p);
            if (self._bbox.xmin > p[0]) {
                self._bbox.xmin = p[0];
            }
            if (self._bbox.xmax < p[0]) {
                self._bbox.xmax = p[0];
            }
            if (self._bbox.ymin > p[1]) {
                self._bbox.ymin = p[1];
            }
            if (self._bbox.ymax < p[1]) {
                self._bbox.ymax = p[1];
            }
            var x = (point[0] - convertor.offset.x) * convertor.scale.x + convertor.offset.left;
            var y = (point[1] - convertor.offset.y) * convertor.scale.y + convertor.offset.top;
            return [
                x,
                y
            ];
        },
        Point: function (coordinates) {
            coordinates = this.makePoint(coordinates);
            return coordinates.join(',');
        },
        LineString: function (coordinates) {
            var str = '';
            var point;
            for (var i = 0, len = coordinates.length; i < len; i++) {
                point = convertor.makePoint(coordinates[i]);
                if (i === 0) {
                    str = 'M' + point.join(',');
                } else {
                    str = str + 'L' + point.join(',');
                }
            }
            return str;
        },
        Polygon: function (coordinates) {
            var str = '';
            for (var i = 0, len = coordinates.length; i < len; i++) {
                str = str + convertor.LineString(coordinates[i]) + 'z';
            }
            return str;
        },
        MultiPoint: function (coordinates) {
            var arr = [];
            for (var i = 0, len = coordinates.length; i < len; i++) {
                arr.push(convertor.Point(coordinates[i]));
            }
            return arr;
        },
        MultiLineString: function (coordinates) {
            var str = '';
            for (var i = 0, len = coordinates.length; i < len; i++) {
                str += convertor.LineString(coordinates[i]);
            }
            return str;
        },
        MultiPolygon: function (coordinates) {
            var str = '';
            for (var i = 0, len = coordinates.length; i < len; i++) {
                str += convertor.Polygon(coordinates[i]);
            }
            return str;
        }
    };
    var convertorParse = {
        formatPoint: convertor.formatPoint,
        makePoint: function (p) {
            var self = this;
            var point = self.formatPoint(p);
            var x = point[0];
            var y = point[1];
            if (self.xmin > x) {
                self.xmin = x;
            }
            if (self.xmax < x) {
                self.xmax = x;
            }
            if (self.ymin > y) {
                self.ymin = y;
            }
            if (self.ymax < y) {
                self.ymax = y;
            }
        },
        Point: function (coordinates) {
            this.makePoint(coordinates);
        },
        LineString: function (coordinates) {
            for (var i = 0, len = coordinates.length; i < len; i++) {
                this.makePoint(coordinates[i]);
            }
        },
        Polygon: function (coordinates) {
            for (var i = 0, len = coordinates.length; i < len; i++) {
                this.LineString(coordinates[i]);
            }
        },
        MultiPoint: function (coordinates) {
            for (var i = 0, len = coordinates.length; i < len; i++) {
                this.Point(coordinates[i]);
            }
        },
        MultiLineString: function (coordinates) {
            for (var i = 0, len = coordinates.length; i < len; i++) {
                this.LineString(coordinates[i]);
            }
        },
        MultiPolygon: function (coordinates) {
            for (var i = 0, len = coordinates.length; i < len; i++) {
                this.Polygon(coordinates[i]);
            }
        }
    };
    function geoJson2Path(json, transform, specialArea) {
        specialArea = specialArea || {};
        convertor.scale = null;
        convertor.offset = null;
        if (!json.srcSize) {
            parseSrcSize(json, specialArea);
        }
        transform.offset = {
            x: json.srcSize.left,
            y: json.srcSize.top,
            left: transform.OffsetLeft || 0,
            top: transform.OffsetTop || 0
        };
        convertor.scale = transform.scale;
        convertor.offset = transform.offset;
        var shapes = json.features;
        var geometries;
        var pathArray = [];
        var val;
        var shape;
        for (var i = 0, len = shapes.length; i < len; i++) {
            shape = shapes[i];
            if (shape.properties.name && specialArea[shape.properties.name]) {
                continue;
            }
            if (shape.type == 'Feature') {
                pushApath(shape.geometry, shape);
            } else if (shape.type == 'GeometryCollection') {
                geometries = shape.geometries;
                for (var j = 0, len2 = geometries.length; j < len2; j++) {
                    val = geometries[j];
                    pushApath(val, val);
                }
            }
        }
        var shapeType;
        var shapeCoordinates;
        var str;
        function pushApath(gm, shape) {
            shapeType = gm.type;
            shapeCoordinates = gm.coordinates;
            convertor._bbox = {
                xmin: 360,
                xmax: -360,
                ymin: 180,
                ymax: -180
            };
            str = convertor[shapeType](shapeCoordinates);
            pathArray.push({
                path: str,
                cp: shape.properties.cp ? convertor.makePoint(shape.properties.cp) : convertor.makePoint([
                    (convertor._bbox.xmin + convertor._bbox.xmax) / 2,
                    (convertor._bbox.ymin + convertor._bbox.ymax) / 2
                ]),
                properties: shape.properties,
                id: shape.id
            });
        }
        return pathArray;
    }
    function pos2geo(obj, p) {
        var x;
        var y;
        if (p instanceof Array) {
            x = p[0] * 1;
            y = p[1] * 1;
        } else {
            x = p.x * 1;
            y = p.y * 1;
        }
        x = x / obj.scale.x + obj.offset.x - 168.5;
        x = x > 180 ? x - 360 : x;
        y = 90 - (y / obj.scale.y + obj.offset.y);
        return [
            x,
            y
        ];
    }
    function geo2pos(obj, p) {
        convertor.offset = obj.offset;
        convertor.scale = obj.scale;
        return p instanceof Array ? convertor.makePoint([
            p[0] * 1,
            p[1] * 1
        ]) : convertor.makePoint([
            p.x * 1,
            p.y * 1
        ]);
    }
    return {
        getBbox: getBbox,
        geoJson2Path: geoJson2Path,
        pos2geo: pos2geo,
        geo2pos: geo2pos
    };
});define('echarts/util/shape/HandlePolygon', [
    'require',
    'zrender/shape/Base',
    'zrender/shape/Polygon',
    'zrender/tool/util'
], function (require) {
    var Base = require('zrender/shape/Base');
    var PolygonShape = require('zrender/shape/Polygon');
    var zrUtil = require('zrender/tool/util');
    function HandlePolygon(options) {
        Base.call(this, options);
    }
    HandlePolygon.prototype = {
        type: 'handle-polygon',
        buildPath: function (ctx, style) {
            PolygonShape.prototype.buildPath(ctx, style);
        },
        isCover: function (x, y) {
            var originPos = this.transformCoordToLocal(x, y);
            x = originPos[0];
            y = originPos[1];
            var rect = this.style.rect;
            if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) {
                return true;
            } else {
                return false;
            }
        }
    };
    zrUtil.inherits(HandlePolygon, Base);
    return HandlePolygon;
});define('echarts/util/mapData/geoJson/an_hui_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '3415',
                'properties': {
                    'name': '鞠假庈',
                    'cp': [
                        116.3123,
                        31.8329
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??nJ?UXUV?∼U??nU@mlLVaVln@@bn@VU@xlb@l?LnKl???VI?J?UVxnI@lVL@b??∼VX@?b?x?nVVUnVVnU??@kX@VwV@?al?UUnUWa@?@w?U?LU?lKUa@aUI@alLVaU??an?WkUKm@X?V@VaX?lW@aU_UWVU?I?@ma?W???I@UU@WWU@U@@UU@VkV@@WUUm@UaU@??lK@IUK?L@KWmXUWaXI@?@a@a@U@U@KV?lw?k∼b?JVIVKlV@UX?la?Ul`?UVLVVVU?J?U@Lnm@_VK@KUIW@?J@Xk@WW@U??m?m?XmWk@?kK@aUU?Vmmk?UwUmWL???@WmU@??UJmUULkKWakLWVkI?l?wUL??W@X∼l?UJ@∼UL??WV?wmJ@bmb?Vk?m@@W?kWm?w?L@lkX?WmX?ym?UImJUbkV?@Vn??@V@lUb?@mk?@maUxmlUbULWn@J?LmKUkWKkwUK?bm?X?WxkVUKmLkVV?@JUUWL@xkJUU?V@X@VVlUbVX@xk∟?x???xWxn??nn@???JVb∼aVn?@?mlnXU?JlbVlkz@?l?U?l?XJmxVxXnWxX?WlU?@?UxU@VX@xUL@?U?mLnV@lWXk@@JlbXblnlJ'],
                    'encodeOffsets': [[
                            118710,
                            33351
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3408',
                'properties': {
                    'name': '假④庈',
                    'cp': [
                        116.7517,
                        30.5255
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n∼?znW?XlW@k?K∼xXn?l@Xn@l?∼Una@anI?xXU??VK@?VIk?W?X@??VK?x?klJXUlKXblLVKnVVI??V@Xn?@??XKVnVxl?nn?UlmV@?車UkV?lW?b??l???n@VVVIn@lw@WVIXblV?@?x?aUaVIVVnKVL?K??ln@b?K@?U????????b?K?a@Im@????@kW?kkmK?n車J?U???W@w??@w?????UkK㊣l?U??U?k??U???????J?IU?VbUl??V?VJU?Vb@bkLUl@?VJ@bUX??@lkVmXmKkLVx?????V?L@VkVV?Vl?zW?kbmLUUUbVbUV??l?nJlUnLllUL@bU?Vx?l?LXV???VU?WJ'],
                    'encodeOffsets': [[
                            118834,
                            31759
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3411',
                'properties': {
                    'name': '壹笣庈',
                    'cp': [
                        118.1909,
                        32.536
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??@`nnl@?x?K@X∼KXV?IXVlbXVWnX?lL@????LVan@VJ?那VVn@??X@la?bVa?yn@?_?xnWVXnWl@VnUVkI@l?nXKVLVV@V@?kW@LlV??@J@bVnnKnkVa@?l?@?nw?Kma?UUUV??@n?mWXalI@alVn@VwUaVU?@?nla?JnU?VVXlJ?aXXVK@U?V@VWx@nXVW?XV?UlLUbV?ULVVnUVbUbVb?@@a?K?nnKVK@U@UU@@a?@V?∼??JVIl?@a?a??UaVKU_@mkxUI@a?UlyU@@??wkKWmUbUnUVWbkJW_?J@b?n@Vm@@KULk@V@@bVb?m@LW@UVVbkK@UkKWL@VULUKWIUJUbkK@_WVXU?Jka@X?V?a@k?y@aVIUUW@@m?UlL?KW?UKVan@UkVmmIXK?aVaUwVU@UmykU?@㊣UUL@WUIV?UU@KkIWa?aU@kUUa??U?車?mK?k?@?y@kWK@bkI?`mn?l?XWlkVUzUJlbUbVJl@nnm?@VULV`XnW??bmUUn?JmUkn?J?km@?yk@kU?x?L@VUbmnn∟lX@`?z@JmaULUVl@Xn@xllkXWa?aW@UVmU?b?@mVX?WxXbWbU???nVVnVVUL'],
                    'encodeOffsets': [[
                            120004,
                            33520
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3418',
                'properties': {
                    'name': '哫傑庈',
                    'cp': [
                        118.8062,
                        30.6244
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vb@?XL?JXxlIXxlVlV@I?∟?nlUnV?U@VULWVUJ@Lnb@lV@UnV@@VVVlLnbnJ?UVkUUVWn@@anUVnVJVIV??@@nUJVbUb??@VUbVK@bn@VbnIlxkllXVlXKWUXUlL∼∟UVVb@b??UlkXW??xXz@??Ila?Ul?nUlJVInV?J?U?LVUnV?K∼@VnlVnxV@XLlK@wVL@KnUlJXU?bnKVLX?l?Uw@?VWlLXKm@@a?@VLnmlIVVnKn@?kVa?Vlwk@@a@k@?VIUa??@?maUa@wna@kmW??UUmVUIV???@a?Km??a??kU?J@In?mUUaVa?k?lX@Vk@m@?VU@wnK@alKVUkUkK?bmUkm?@U?WVk@@U?b?b?a?x@b?@WVUa??@wVwUUV@VwnK@KWa??@K?IUyUI@WmX車?UbWa?Km??@km@IUy?IUaWK?x@zUKUL@llVUnkLVVkJWX@VUKUV?IkVWakb@VWb@n@JkXUlmL@xkL@`Vx?LU?UJ@Vm@@bmIUlUL@VUVVbknm@mKUw?KV?@J@L?V㊣kkJUI?l'],
                    'encodeOffsets': [[
                            120803,
                            31247
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3412',
                'properties': {
                    'name': '虞栠庈',
                    'cp': [
                        115.7629,
                        32.9919
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V?n??@?a?k∼a?㊣@???@UUI@aUmlwUU?x?b@?XU@mmI@a@Kn@@_W@@W?I@m?UVVXUl@XaV@?K@I@a?LX?@aVI∼K@KVL?UUw?yXk?K@k?K?bXnlK@k@a?JlU@w@U@?@aXKW?n_?JXkVKn?@?∼LlKX?W@?U??@aUK@kmJUw?V?IUJ??k?mL?K@kka@wUVm@@am@UkUbkK@nmV???VU?WV?VmI??ULk@??ma@kkK??@nUbUamU?`UUVUkKVkk?W@@bkm?n?mUXVKXV?L@V?bU?m??bVX?J@nmK?I@KWKUXVJUL@VUKUX@KUKWL@LUJmaXXm@kVVV@L@VUL@VlK@L@V@LUK@VUb@UUU@∼@nVxU`?Lkn@`@XVJ@X?Vm?k@UKmV?LVV?n㊣W??m@Ub@JlLUl?@VLk?@lmVVn@bnV@V∼IV??aVJXI∼K∼V@XXVlVVU?n?KVlU??bWXnV@bV`U??@@?m@@??@nxmn@bXVlL@∟nb?Ul??VVUnJVU?Vl@@b?L'],
                    'encodeOffsets': [[
                            118418,
                            34392
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3413',
                'properties': {
                    'name': '咑笣庈',
                    'cp': [
                        117.5208,
                        33.6841
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@UWU@bkW@aWU@aUIkWV?lLXb?lVIUVV@?mn@V_n@VaUK@I?@Ua?anJVU?@lV?UVnnKVVlaUa?I@wnK?Lnll@nVlk@wVKXkl@@b?bUJ@V?U@U?UUyVk@aVUXwlWXX?WU?@aU?@WUI@mlU?n?J@Il@?aXbV@VKl@XxVL@W?I?Jlb?@?al@?IUUm@@aVK@???@mU??bW?k?Vm@a?km@Va?@UVWa?@U??JWk?J?U?bWbU@Ul?Xk@?amV@K?nk@?lU@Uxmz@bU`?bUb?Vm?U@Ww?x@akLUK@UlakwUJWVkLmaUal@n_?mVUnKVUUm?XWa?@kJmx@XUJ@bVLXxl@VVUVV?UbkLWbU@@lUVV?VVX??K@XkJ@nU@@bV@VxUVlb?U@xXLW?n@UxVbV??V@b@XV`mnkJ@kUKmb?aU@Vbnb?x@XU@@`k@@bl??@@bkL@W?akXWaU@Vmkx@XWW@?@wUUUb?J?U?V?@??U@WxX?lL@bkb@?lVln?b?JW@kkU@mbkaWJ?IVlmz?`UnU@mb?@@??`@bkVl?nV@b@?V@?aVxn@Vx?KXnl@nbVK?bVK@a?_V@V??w@W?LlwnK@UmIU@VW?@?U?@lKnal??w?@@V∼@?aUmlUUw@???V@@UXK'],
                    'encodeOffsets': [[
                            119836,
                            35061
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3410',
                'properties': {
                    'name': '酴刓庈',
                    'cp': [
                        118.0481,
                        29.9542
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lXnlWX@VUJVnUJVzXJVx?kVJlI?l?U@K@IU??LVxnLn@lmUaVU@UVKVknJ@an@@UVIV??KUw@_lK@wnKVklW@I@mXa@UlaXblU?JVUVL@UXWlIUUlKVmkU@kVKVL@y?wXLVb?JVz@Jln?@n??LXbVa??nW@?la@UVWUa@?@a@mk@WIk@VwUa??m@UUVK@ImK@aX???kK???V?a???_@㊣?akXWW?L???nU@@a@?mK@L?J?UWwUV?VmbXX@lWLn`mzUJUb?L??k@makVWmkX?ambkKkn?a?@?a?b@?U@Unm@??WV?@??VbUbUJWIk@@lmL@∼UVUVm?n??@@kmWkb@x?_m@@aU@?b@Jl?Uz?lWxXn?@?b?@l`?IVl?UlL@V?K?nVbUl@VlIn@@b?bVWUk?@@bX@Valb@bnb∼Vn@?xVKlbVn?V@V?x?L@ln@UXVV?L??'],
                    'encodeOffsets': [[
                            120747,
                            31095
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3414',
                'properties': {
                    'name': '陴綬庈',
                    'cp': [
                        117.7734,
                        31.4978
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VV@blL@?XlWnn?n???@VXXl@@W?IX@VJ@L?x?xln??@bXJVblX@VVbUVn@VbUVlb@LnJVbVLV?XL??VL???V?bVIVylUXk∼W?knm∼_lJ@aXL@l?z∼@?lnL??V???VUUaVKU?@WW@@UUa@knmVLlaV@?a@k?ak㊣@UmwkKmk????UUkL@mlIVmn?WkkU?@?K???a@??mma?@mX?∟?U?w@?@?UU@bU㊣㊣L@akm???LUKmLUUUJVb?b?w?@kUWaUJ@Xkxm@UJUUm@??k????akXU?Vl㊣?U@kn'],
                    'encodeOffsets': [[
                            119847,
                            32007
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3416',
                'properties': {
                    'name': '渫笣庈',
                    'cp': [
                        116.1914,
                        33.4698
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lU@Un@@anUlw@KVmUwlaX_lKna@KU@@kWKUU@ankW?XK?@@V?VVI?U@al@Va?amK@wU?@klaU?V@X?VUU?WUUbkmUkV?mk@a?w@mWU@VkIkVWKU??X??U?l?@kkLWm?a?L@l?LWl?zVx?VUK@L?LUJ@bW??K@b@J?LU@Wbk@WVUU?V@n?J@XX@@`m@@L@bnJ@nWV@??a?wVVkxVn@bVJ@V??@????b?l?b?@m?U?U???@???Xb?UV`@nnxUxWLkUkVWKkV@XV@@VVL@VX?@lVV@L@blL@`?L@xXKVL?@?VnU?@lwnU@ml@XnV@@UVW∼Lnal?UI@aUK@a?a@U?kXW@I@mWL@UXK@UVW@U?@@k?Wn??@@V?@XblaVx?L@bVKXb?IlJ'],
                    'encodeOffsets': [[
                            119183,
                            34594
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3417',
                'properties': {
                    'name': '喀笣庈',
                    'cp': [
                        117.3889,
                        30.2014
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@?V∼∼??@x??@x?X?∟?V?I?mnLllX?@l????n@@J?b?L?a????∼VVUUKVanK@UV@VL?VVn?ln@?xnklxXamk@WV@Xa?@naVk?Kl?k?@mkUWwkJWw?IWK@?UaUwWIUyVIUmVI@UXWmkkW???KUUVWm@@k?K?w@U?UUmkaUL?wm@?Uma@akaUbW@@a?@VlUX?a@am@kJ@UVkUa?m?L@UkK?VUk?Jk_㊣@?a?@WmXw?kkaVaUa㊣??wV@Vk?wnyUaW@UU?amLk@m??@kmmU???K@L@lUX??WlkX??Vb?b?VUL@J@LVKn?lJXnlb@`nXlalV@bnL@Vnb??@lXbWlkL?K@zUJmIUxUVUVmX',
                        '@@llUL@Vlx?L@a@U?wXa?@'
                    ],
                    'encodeOffsets': [
                        [
                            119543,
                            30781
                        ],
                        [
                            120061,
                            31152
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '3401',
                'properties': {
                    'name': '磁滔庈',
                    'cp': [
                        117.29,
                        32.0581
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?L?xV??L?k?VlVV?XaWaXwW?nU?@?anVVUX@?bXblWkk@wWmk@VUVKnb@I?y@_kWm?nmVa@U?K?wlVl@?zn@∼l?IlmnV?IVmnV?aX?WmU_VK@Un?mmk@UIVaka?a?U??UK??WKU?UKUamI@KkaVUUam@VUUa@UkWUaWI@a??km身w?wUL@`mn@K?V?IUVUUUK?Vk_?VkbW?@VkUULUJ㊣I?a?lkxU?@L@V@V@b@b@?WJXbWVXn@L?KVL@JkL??V@Vbn@VV@XU@UlV@@VV@V@XXV@@V?J∼?∼Xnb∼@?JUVVXV`@bkXW?UbU@W?n@VLXlm?∼bV?UbkK@bVJ@bVbkLV??K?V@x@?XbmVVVk?'],
                    'encodeOffsets': [[
                            119678,
                            33323
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3403',
                'properties': {
                    'name': '培硎庈',
                    'cp': [
                        117.4109,
                        33.1073
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V?XLlUlJ@UXV@n?x@bnlU?VllnVaXVV?UVW?U@V??wVV@Vl@?VnwlI?@Xb?WVnUVmLUV?nm`k@VbnblKXUVIlxkb@VVLlK@b?wXxV@n∟?UVa?aV_@anyVwV@?kl@∼m@LnU?bl@?WVkV@Xa?a?V?IXl?IV??@XbVU?@XKWwUkmW@_UmnIlJXkWKXmV@?w@_XV@Kl@kU@KlX@?@UUUUKWL?m@klJVUUmk@mXUWmX?w?`m@?zUb?akbW@??m@UU?谷UIm@Ub?K??@?kKW?XmWUkaWU?JWU?L@W?L?wk@mm@_???l?UVkmWUn?V@VWLUb?b???l'],
                    'encodeOffsets': [[
                            119543,
                            33722
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3402',
                'properties': {
                    'name': '拶綬庈',
                    'cp': [
                        118.3557,
                        31.0858
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?bVaV@XllLXU∼?lL@V@VUnVl?Ik??VUVU@@b@lUXUWmb?n@??b???L?@lVXlm?UnkJ@nlKVV??XklWVaVI@aUKn?lL@Kn@?XXwlm@mn?∼@?V@?Wy?wX?lWVk??@aUaVU??kKWVXVWLUkkWlkkwmJUam@@aULVa@U??VaUaVI@m?@U?UJUIUmmV@bm@UXVVUl?VmImakKUU@UU@VmU@@kma@KVIXUVK@U?VmUkV?m㊣?@JkU@nl?k??LUlmb?@WbU@@XnlWb'],
                    'encodeOffsets': [[
                            120814,
                            31585
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3406',
                'properties': {
                    'name': '輕控庈',
                    'cp': [
                        116.6968,
                        33.6896
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@lnnK@?n@@V?V?@@VV@nIV?V@VW?a@b@bVnUVVV@V?z@l?@∼U?V?IVaVV@x@?XX@WlwUnV@XblW?b@XlK@a?@k?@al@@_V@@W?wmaUaV@?bnaVL@llInmU_@W@a?UU?UaVwm@X?WK@w?VkaVUUwU@@aV@@mlI@W?LW?UUU?VU@kV@XalKVaU?VUUUk@WwUK@aVI@W?Uk@@UUU㊣xkb@lV?@xnL?bUbk@@b?VUJ㊣U@U?@WLX?ml@bVVXL@lV@@LmbkLW`kbVxUn@LkxmV@bm@@VkV'],
                        ['@@VVVkV@??@UV@U@VUUJ?kWakKU?lXVJ@bXV@blX@aXV@V']
                    ],
                    'encodeOffsets': [
                        [[
                                119183,
                                34594
                            ]],
                        [[
                                119836,
                                35061
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '3404',
                'properties': {
                    'name': '輕鰍庈',
                    'cp': [
                        116.7847,
                        32.7722
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼k?貝?aVaXK@U?UVmnXUl?V?kVKUUUmmU??kU?U?l?KU??w?K?bU@UxW@@l??mVUUVmUU?m?w?aW?kL?K@?m?ULWl?Im`X?WL@b@?@V@xkV?I@b@l@lk?V∼???W'],
                    'encodeOffsets': [[
                            119543,
                            33722
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3405',
                'properties': {
                    'name': '鎮偽刓庈',
                    'cp': [
                        118.6304,
                        31.5363
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??nllLnxV@laXLVKma?aXbVI?bVKVVVIVyn@n_??W@@??UnJlUVVX?lLnaUWl?V@VV?IXW@_W@XK@K@UVUUwVam?Xmmw?w?KUnUK??U@?J?U?@m?@nknWx?Wm@@LkKm?VL@bUJUbkXWl'],
                    'encodeOffsets': [[
                            121219,
                            32288
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3407',
                'properties': {
                    'name': '肣鍬庈',
                    'cp': [
                        117.9382,
                        30.9375
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??V∟@?V?@aVV@?@??x∼V??nW?@nbnaVXVW@k@aV@VU?Ul?∼JUkVm@U@UkK??WVkKWkU@Ub?akwml?wm@?kUm?UUKU@@VmLUbVLUV?U'],
                        ['@@?LllUL@Vlx?L@a@U?wXamK']
                    ],
                    'encodeOffsets': [
                        [[
                                120522,
                                31529
                            ]],
                        [[
                                120094,
                                31146
                            ]]
                    ]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/ao_men_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [{
                'type': 'Feature',
                'id': '8200',
                'properties': {
                    'name': '凰藷',
                    'cp': [
                        113.5715,
                        22.1583
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@HQFMDIDGBI@E@EEKEGCEIGGEKEMGSEU@CBEDAJAP@F@LBT@JCHMPOdADCFADAB@LFLDFFP@DAB@@AF@D@B@@FBD@FADHBBHAD@FAJ@JEDCJI`gFIJW'],
                    'encodeOffsets': [[
                            116325,
                            22699
                        ]]
                }
            }],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/bei_jing_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '110228',
                'properties': {
                    'name': '躇堁瓮',
                    'cp': [
                        117.0923,
                        40.5121
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@vIHZDZQtDLNMXIbHRCXXITbJ@H`LGPRDDJNCLHTOCWFGvGBUJMKGFO^IHWXITQCI?Y^AXGfR?DXF`DJOLB~G\\DZIHHpErUVMhHb]\\M?BVF@FTP`@zTbD\\@~M\\K`H^EVODWICAakAQXoIcCOCIgGYNWFWNGGKKGaJEGMEIKYJUT_J_Go@_SyQaSFMEGTcYOQLIIi@EKAUPCV[EEXQCW|aMUMAaYCYNIDGGACIMGGSKDQGaF_C[GaB@GOIiOKAYL?mI@CN]F[SWWAcKKI@HMUimEKbeYQYISNUOcBKPIFBNgvDPGZYFSf]CMSIWGEUFgDIQ[MeDMJS@RR@LphFPCHaBAJKF@J]IBJO@HlO@@RKAMPJHCNDJTHFP@ZGNANBRFH@J_fM^ONJNF\\VTDJHDON@X?RND\\XRCPVETCLBVKDFJINHRGPRV@\\CLJN@VbXbLVT'],
                    'encodeOffsets': [[
                            119561,
                            41684
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110116',
                'properties': {
                    'name': '輒�慳�',
                    'cp': [
                        116.6377,
                        40.6219
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@JHTVHXCHPfnDJGHNDJSB[JSBGVSAOH@PMPuDEHHXZN@PHF@ZLJ@LHVYJA\\OFWP]BMtMBSRGV[JeVAPQVIFENMD??@^NV\\JH@NNL@NM\\kTQ\\I^FNIpBHGTBFFAZQfKDIXQTLXFXNNVMVHRGpCFLlRLEVBBH`IVO\\G`RDPAXLXBXORHZEHTDLLN@VGTMrQNFPeASKG@GMOAKBYMK@GTUHUXSHMVDNMOUEOZMJML@^KRACMZEZMRQLUHE@OFENPR@DI\\ChMHIDG\\GJMDWHCKGMDCIQCHO_K@GaIJSWWQDaGWJMNCKRsCYGYuJUSaKaW@UIMDK@[QUHOGQJMEILCAUDKFSOUQD[WMC?Q@WPMGCCIUSE[IMPMN]`e@IEGAQBMHM@YEOSGCIDMIGNOLB@QP@GkP@AI^J@ILEBIbADGEOog@KQQWSekWQQUOFKZLF@PUNmIaHIUeBCTSHENcJa@_IWSaGu`GLSBKJQFOXGDXVQVOBIHcDSJWBEFGTMH[^mLaXcHiKElTRKtFXZ`MHMPCNRDxZ?B\\ICIHK@K?HbIVFZ@BPnGTGbDXRDJaZKRiGEFSFEJhjFNZFjn'],
                    'encodeOffsets': [[
                            119314,
                            41552
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110111',
                'properties': {
                    'name': '滇刓⑹',
                    'cp': [
                        115.8453,
                        39.7163
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@h@bl@HRJDZ``TA\\VVD^H`\\pF\\J?`JGv@ZO\\GPSTEjPTR`FnEbDTDHEhLFMTK@ETSPULKEI@OVISKSJACEQNQbV?IXGDIN@dMB[IIBcN]ZHNLP@XOWCFW?CNRHTpATD@^NVNLED@Rh@jCEF}E[OOHUEW]W@QGGDIQSH_MmFmCUT_K]i@MH?CMW?FCF?E{BMHMPOHKS]CFNGBELDH_@BcAKOACESAOBELaXAROB@FODMEDWJAG[aE@UM@DImEWJMC@OeCA{aE[@{L@MINUCQXKfUJORCHqJBF@TCXWNQX]M[EAJO@@KMBQJIC]EWMCCUBEBFHKDOTMBGNGF]MWDBRDdMDQVyE@LPVHDCP@JVVMTG~HNSH[CmRUvHPHBbA\\PTNRC\\YNJ?PRARPJDDR'],
                    'encodeOffsets': [[
                            118343,
                            40770
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110229',
                'properties': {
                    'name': '晊④瓮',
                    'cp': [
                        116.1543,
                        40.5286
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@^AXOPEB[ZIGU@KKI@YGE@OYMGWFGvCNO@OPGTBHUTA\\ITACIGMIHmCOeDGGWSUIGimYEEMgiFITEFEjHLQbYCIWQaCSHmHAOY@UEaJ?G@LGLDJ[J?AwYQCDMNONGY_EWLsSQFkMO[NWAIGaIYL@HMBOKiOQDWEUDMQSF_QIUBWdg@[NaAKQ@M]OQ@WhgLUMMFYQDIRCEUZOOCIOJ[KIUMKL@HIDKVEBM`HJAJSJUdBLGNEdMBMO[BYEWJSNKNaD]PE\\SjOT_RQVEZPp?NQXf?NA~lNG`@PNLp?RFLfbdKbATUh@FSNWjGFZVLFHVA~X“PPROfFJbNJPLFbENJPrEFNPFRHDDJdENJLVEPBJTVTHGHFRFH@PXP\\ORQHW\\BjWFDERLPPBbB\\E`B\\D\\L`@F]FCnJ^AZL'],
                    'encodeOffsets': [[
                            119262,
                            41751
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110109',
                'properties': {
                    'name': '藷芛僱⑹',
                    'cp': [
                        115.8,
                        39.9957
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V@XMnGPY??JQNEhH\\AZMPDVTTDZCPiJkHSHCjIdFtEHITCNITQEKUAMCEIKCECABYESKFWAKBEIIHABGDCKCAIHMHALKEI\\CFIBILIJQZS]BBEECS@E@@C]COKI@CABAAEEDMG?CH]A[M@CJWH?JaUMRFRBDTITLUJ@PFJKLOVST@FSLENgKGFSCaCmF_ESQiOSFOT[HYPu@IH?_[IoE_[]GUC[USB__CYQI@Gakg@qZeHQNMNV\\FVLPgJAFJPRLCH[XcPELUT[JiV_EELFTADBXRTRLJC@fHXHHbPd`fR@NfT`@TLplHMpCEJHJBVLF?@JT?VnG^KXDXHNVGRLRXFJVdDHSNWLGfEzA'],
                    'encodeOffsets': [[
                            118635,
                            41113
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110114',
                'properties': {
                    'name': '荻す⑹',
                    'cp': [
                        116.1777,
                        40.2134
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VNLJI\\JPPDYPFVQDCJZRNEVNhKXgR@^P@NLRbB\\Mh@XcVARJE`RTCNFV?XRCjPPLNA@GZKbJJHXB\\MNPjLdGbWnK\\]NGHSFEXATIdCJGPARUWUHCPWRELITAHKv_E@iYCaW_BQ\\Y@QIO@QDCIGZCEMWGFMFAFgHEDOCSqKCCFGAMKEAC@ODGCGs@WH@KQA@EE@CE@GEA@EH@GGUEEJEAYD@JM@@DAA@FHD@FTJEHUC@JUBKCKG@G[CIIQReAYhO@OXGDO@@FF@IHJFCPEBACBIAAKDOABXARHP?NEHGbQAAKQFGIAM[C@WHKaGiCEGOA?HUKCIokSCUSOCYN[BgGMFIR㊣?OZmHWNU@ShbbXDHVXXGJ^lZ@PZ\\Nb@\\FHJAD'],
                    'encodeOffsets': [[
                            118750,
                            41232
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110115',
                'properties': {
                    'name': '湮倓⑹',
                    'cp': [
                        116.4716,
                        39.6352
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@F\\E~DFN@BDFEpHFCHBBEGCDCJBHUDSBB@ELCPbF@B\\J@BJVAFJ\\ADKTCBGECFMT@BMN@@FH@DaNBEnvB@FPBATK@FHEFIAKFBFL@@PKBFJHC@FXBRAFCDMPDTOL@JIVFDHH@DDH@BGRFCDLD@N^@@CNA@KNOAEBCECFEGCFGMGFIPMOEJOLBADBBHGG@GCHIECY@INC@DMGS\\AIOZAAEYA@GT@KKMBEETCGMVINFxA@MJADB@FlA@HJA@NND@DFA@DVAZBBOFKH_JA@K^GBC@EFE?G@gAENMXKJigC@IbSJMqGOP?RGSMGE@kbQFDPEFiBSGGSBK]I{CDWCIDOic[C_G@SuSO@EWKCO@MNY@\\uZOPENQD[LKESSKGBKEG@EJGAGHoH?CqhifeJkX_XFFGHFNEDFPENKHM^IFIVL^S`DVEnNnG`RTCJHH@R^XFXGVPP'],
                    'encodeOffsets': [[
                            119042,
                            40704
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110113',
                'properties': {
                    'name': '佼砱⑹',
                    'cp': [
                        116.7242,
                        40.1619
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@EhEBENXHFNYDJHCD@RJP@R[ZARX`DbjZF@bHXT`Jb@dIFMTGDSfAJVbGnJVM@OKELYPERVXRflXTT@NIfC\\NJRhCVEHFJXNT^DTeZEHYCOhuAMJELOdAVPTMOWBWNMNEJgl]@WGUFIC[T{EEDEHGCIGMI@SECUQI[D{A{GQESPUH]CsiMCmHUeoHENcAaDGCMDGMQCACCBaCGLMAHB@DIEQLOAAEEJ@CW@CDINGAAGKQOCgV@LG@BEGDKNeREFBNCFIDOPKD[@YRW@GFWDAFE@EHDDrLDTCPGF',
                        '@@KrJEH[\\B@FF@CHFBHUN?AJKADGECBCMAG^E@EbI@BEGP'
                    ],
                    'encodeOffsets': [
                        [
                            119283,
                            41084
                        ],
                        [
                            119377,
                            41046
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '110117',
                'properties': {
                    'name': 'す嗷⑹',
                    'cp': [
                        117.1706,
                        40.2052
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ZJZRafFLjn?VGNJ@LLBdXX\\T^EDMJ@?nZKLBjPPJ@HbA\\H`DbERHLCFK^BZaFWXQLAGMHa\\OLO@SBIpBdCL?VQfElO@GSAKEDQTC@GEBKG@ORIJBDAPDFA@CaOq@GGQAAEJK@KMUGAAGEAa@MGMBGCGSIIW@WSUCMDOJeWOM@IUF{WMWaDIMgIoRoCOKeEOEAG_I[cg@wLIFENQFDVTFJ@HNDJGHCFFFS|D\\EJHV@Xk^IhMFMNAXPX'],
                    'encodeOffsets': [[
                            119748,
                            41190
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110112',
                'properties': {
                    'name': '籵笣⑹',
                    'cp': [
                        116.7297,
                        39.8131
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@FDAJTGDNDCTDDEDBBE@DT@@EHCDGJ@EIZ@@FDBR@ATFBBVFFE@@HNA\\VE@CLIFNJFNJBCP]A@LJFA@HJEDD\\C@DBCHLAEPF@@DH@APHAERDF\\GIxDTM@CFLBBFJ@CNUPMHECGDBF]BMFPDLRBHHBJMDCX@@DFIBFPBRKJF@CGANBHKbDDABDRDHNNCHDbCdBFMpGHiOYMefKJMC}HWAUNW\\NNBNA?kNU|]HMTMN@MZBLFFF@RIRUT?BMFIEGaAGGAOIIUGTSFcYKS@MSLYPKRUBU]EWDOI]CKGASgW@MTWKIMCS@uMAKKADMECGAKVUTSDy@IjWLMNBF@h?HEF@FAD]H@LIBG`ELAPYAUB@CEB@CMC@MIB@GkB@ECAIB@NwBMEUJHNSDFFNALLS@@HZBBFYBJP[BHTCND@JMZ@FDGJHDH@GHAABCKAIPPFONEJNHEHHDEFFDADBFMP@L'],
                    'encodeOffsets': [[
                            119329,
                            40782
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110105',
                'properties': {
                    'name': '陳栠⑹',
                    'cp': [
                        116.4977,
                        39.949
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@bFGHBHFBFIVFHHG@@FFB@HDFF@@FRB@LXGt@DHCH@PBDLFBNF@BEXCHEX@ZQ\\@LCPOJCDEAMFEfQLMHCAFH@@KhUNE^AAEHCFDNGVODMI@AEKADEN@CSJw[HCEFQGBBOG@@CE@FOKBDGCAD@C[FCGIB@IE@K^BDOIAEMMIJEDKF@[UMB@GF@EEAUEABSQ@CA@EY@FJI@CHGD@FS@@CAFCACFSCCDCMSHBIECMB@D]@@MKCDCQEAHG@CCG@CGUEIJK@SPOCCNEDQBDNDB@DJCDLFCBBALJB@BVGPBKVO@KHCCCD@FE@BNA@FNCTDDJA@FGB@NBDW@CL@hT@@ZHHQDDDAFSAANBC@HG@EFS@@DE@@PCB@Ue@CADNJB@FCBWA@LI^ix@FIHrH'],
                        ['@@HUN?AJKADGECBCMAG^E@EbI@BEGPKrJEH[\\B@FF@CHFB']
                    ],
                    'encodeOffsets': [
                        [[
                                119169,
                                40992
                            ]],
                        [[
                                119398,
                                41063
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '110108',
                'properties': {
                    'name': '漆蛭⑹',
                    'cp': [
                        116.2202,
                        40.0239
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@plDJVL?GPBFHjDbHGL@X\\DBNHJREBLRBHaFG?MGOBQAWPBLCBBAJBDFADOIEJGE@@EP@HCPWP@ZgfBRQJJ\\D@HLHLDVA@IVDFGSI@EGC@EBB@CN@@IZCAGHGaEqGJG@EjwJ]@K@GSA@e_I@NE@CA@Kg@KC@ENCF?AKQAW@WIMK@V?@I@@F@^EDFB@HcIaDYCBRRDCHD@EFLN@FE@CJUPEJOJMTBPEDIFCMIAKNOGMRFJNDVBFLSRMJSDGJsFcEiJGDGTIlOjYD'],
                    'encodeOffsets': [[
                            118834,
                            41050
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110106',
                'properties': {
                    'name': '猿怢⑹',
                    'cp': [
                        116.2683,
                        39.8309
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@hMN@NFTQCFRCBJFA@HJ@@HJ@HJ\\FTACD?@@UNLXJX@@MA@@IECAQlDFEHBDI~D@GXCFMVDFCH@@NF@ANJC@FnAB@AMF@@EDCDDLGP@LUOAUH@AIABKAAEDCKID@CCACMWA@EGDEILA@OK@AELEJBFEEGL@BSOA@EuAFmMACbG@@EM@ANS@ENFDAHSDCL[BEIUBAII@A[E@OaKD@FAACTGVIACDHDAFGAEDoGEFACM@i?g@@QFCMKMU@]SCoBGSMQ?DEXXDWPO@MKYGM^AdJJA\\cNB\\G^?DNHFCBFABDBJ@PL^D@DF@T@FDAF^A'],
                    'encodeOffsets': [[
                            118958,
                            40846
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110107',
                'properties': {
                    'name': '坒劓刓⑹',
                    'cp': [
                        116.1887,
                        39.9346
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@NQPHLMJBDNJEFCAONSPIFIVODIF@@EKMFEC@DGQCAQZDbCdJ@GEAFC@]@EJ@DCSB[EGII@@GI@@GEBAIQDDESRMEM@gNYTIRKJAJEJ[DFJKLGBGNBJLDCDAHGBJJAFBLEXTLZFBAFDLD'],
                    'encodeOffsets': [[
                            118940,
                            40953
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110102',
                'properties': {
                    'name': '昹傑⑹',
                    'cp': [
                        116.3631,
                        39.9353
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XBDA@EIACM@IJAD]BC@SFABISAD]H@@O?AEDQEW@BLE?MD@FLDh@@LDBF@@M`J@fTB@H'],
                    'encodeOffsets': [[
                            119175,
                            40932
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110101',
                'properties': {
                    'name': '陲傑⑹',
                    'cp': [
                        116.418,
                        39.9367
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@DBf@@VDA@OF@@CT@FEH@@GADBMTBBECCRCGG@YS@@gDK@A?C@PG@C^TBAJEB@TADC^IB@J'],
                    'encodeOffsets': [[
                            119182,
                            40921
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110104',
                'properties': {
                    'name': '哫挕⑹',
                    'cp': [
                        116.3603,
                        39.8852
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@RBX@RFFC?BFU@aK@WA}CCJGAEFkCBRFD@JB@@N'],
                    'encodeOffsets': [[
                            119118,
                            40855
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '110103',
                'properties': {
                    'name': '喟恅⑹',
                    'cp': [
                        116.4166,
                        39.8811
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XBL@@bEV?D@BX@AC@MHA@EIBCCDSEMmB@EIDBME@@MG@EDUCENWD@H'],
                    'encodeOffsets': [[
                            119175,
                            40829
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/china_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': 'xin_jiang',
                'properties': {
                    'name': '陔蔭',
                    'cp': [
                        84.9023,
                        41.748
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@?老????車????車?????????耒???@?@車??????車妖??????????@耒????車??@??耒???????車???????????耒?老??車?????身車???車???車?????@??????????????????????車車???@??@??????車????@車???車???????@?車?????車?耳車?????辰???@??@???辰???辰???車?????@耳老?@?????耳@?耳?????@??????????????車????????車??車?????耳??????@???耒??????????@??????身????@?????????'],
                    'encodeOffsets': [[
                            98730,
                            43786
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'xi_zang',
                'properties': {
                    'name': '昹紲',
                    'cp': [
                        88.7695,
                        31.6846
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????車?????????耳???????????????????耳?????????@???@?辰???車?????耳????@???@???@???????????身??????@???????????????車????妍?????妖耳考???耒????@???@?車車車???車???車?車????老?????????身車??????車?車車?耒?@?????????????@????????????????@???@車???車???車車耒?@???老???車?車??車???妍車???????????????????????車?????????耒妍@耳????'],
                    'encodeOffsets': [[
                            80911,
                            35146
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'nei_meng_gu',
                'properties': {
                    'name': '囀蟹嘉',
                    'cp': [
                        117.5977,
                        44.3408
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????????車??@??車?????@??????@??????????????????????????????????車?????妍??????????????車???@???????????????@???耳?????@?????????@????????妖?身???@????車????車???車???@???@????@?耒???辰?老???????????@??@?身@?@??車??耒?車????車耒?車????老????????????車??????車老?@????????????妍???車車??車???@????@?????????????耒?車??@??車?????車妍????????辰??車??@??@????老?耒?????車???@?考???辰????車??????車????車????????耳???老車耒?車?????車???車?????????????????老????車?妍?@??????????????車??????車?車@?????@???'],
                    'encodeOffsets': [[
                            99540,
                            43830
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'qing_hai',
                'properties': {
                    'name': 'ч漆',
                    'cp': [
                        96.2402,
                        35.4199
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@??????@耳?辰車????????妍?車????@???@?????????耳???????????@??????????車???????車??????????????????耳?車???車車???車車?@??????@????耒?@?????老????車而??????@??辰??車耒?????@????車@???車???@???耒????車????????????????車妖?車??????車???????車?@?車?車????????????車???@車辰?@???@??耒???車???????@???@???車???'],
                    'encodeOffsets': [[
                            91890,
                            36945
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'si_chuan',
                'properties': {
                    'name': '侐捶',
                    'cp': [
                        102.9199,
                        30.1904
                    ],
                    'childNum': 21
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????車????妍???身???????車車???車??身????@???辰???@身?車????????????????????????耒@車車??老??@????耒???車???老???????耳車?????????@????車???車?????老?車???@???????車???@??妖????車?耒?????????@?@???@?老????車?????妍??@???車????耳??耒而?妍老???車?????車???車?????耳???@???????@?????@???車?耳車???辰辰?'],
                    'encodeOffsets': [[
                            104220,
                            34336
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'hei_long_jiang',
                'properties': {
                    'name': '窪韓蔬',
                    'cp': [
                        128.1445,
                        48.5156
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???妖???????????車??@車??車?耳?車車??車????妖??車???????????耳@???????老??????耳@?????????????@??@?????老老車??????車????????????耒???????車????車車?????????@??@?妍耒@??辰??????車??車??身??????車妍?@????@?@?車?車@@車????????????????耳?@??????@???@?車???????????????@車?老??妍??'],
                    'encodeOffsets': [[
                            124380,
                            54630
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'gan_su',
                'properties': {
                    'name': '裘咈',
                    'cp': [
                        95.7129,
                        40.166
                    ],
                    'childNum': 14
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????@身????@???車??????車??????車????????@?妖?????車???????????辰?老???????????@@??@耳?車????身???????車???@????????車??@??????@?車???@??@@???車?車???車??@@??車?車老????@車????????身????????????老車車?@身????車???車??辰??車??????????妖????車?車??@車???考???????????@?耳?車????@????@?????????????耒????車????老?????車?????????????????辰?老?@????????車老?耒???老?????@??車@???耳?????????????????車???'],
                    'encodeOffsets': [[
                            98730,
                            43740
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'yun_nan',
                'properties': {
                    'name': '堁鰍',
                    'cp': [
                        101.8652,
                        25.1807
                    ],
                    'childNum': 16
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????@???@???????@????妖??????????@???@辰@???車身????耳?????車??妍@???????????@身車車?車?????車??車?????????????@??????????妖???車????????????辰?耳@??@??身車???耒?車?老?????????????????耒?車?????車妖????車??????????耳????????????老?????車?車@@????耳??@???????車?????車???????'],
                    'encodeOffsets': [[
                            100530,
                            28800
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'guang_xi',
                'properties': {
                    'name': '嫘昹',
                    'cp': [
                        108.2813,
                        23.6426
                    ],
                    'childNum': 14
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????@?????車??????@?車????????@?耳?車??????????????@??@???老??????妖?????車????@?車??@@????耒????@?車??@@???車?車?@???老車辰妖??@??@車???考?耒@??@???車???車?????@?????@???耒@?車??????車身??'],
                    'encodeOffsets': [[
                            107011,
                            25335
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'hu_nan',
                'properties': {
                    'name': '綬鰍',
                    'cp': [
                        111.5332,
                        27.3779
                    ],
                    'childNum': 14
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@??妍?@???車???????????辰????辰???辰???@???車???????車?????車?@??車車???@???車????車???身耒????身@???????車?車身?????妍??車?????@?車辰?@????????車?????車??辰@???老?車??妍車?@?車?'],
                    'encodeOffsets': [[
                            111870,
                            29161
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'shan_xi_1',
                'properties': {
                    'name': '匟昹',
                    'cp': [
                        109.5996,
                        35.6396
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????車車???車??????????@????????@??@??車???????@?@?????????????車???車???????而?@?辰???車???@???耒????妖??@??車????@???@??????車?????車@???@?耒@?????@???????車???車車?車?????@??身??'],
                    'encodeOffsets': [[
                            108001,
                            33705
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'guang_dong',
                'properties': {
                    'name': '嫘陲',
                    'cp': [
                        113.4668,
                        22.8076
                    ],
                    'childNum': 21
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@@???????@??@??@?????車耳??@??@??@?????????????????@?????耳???辰????身車????????????????身?辰?????妖@?????耒???車?????車???老??????????身?車車?老?耒????身???????@車????????@?身?@?@@????妍@@',
                        '@@X??aW??@l?'
                    ],
                    'encodeOffsets': [
                        [
                            112411,
                            21916
                        ],
                        [
                            116325,
                            22697
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'ji_lin',
                'properties': {
                    'name': '憚輿',
                    'cp': [
                        126.4746,
                        43.5938
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@?妖???辰?身???????????身??辰?耳@?妖?@@?????????????辰?????????耳?@???????@???@?車???????考耒?@?老?????????身???耒老車????耒耳@???車?老?@??@????老??車??????????????????耳???????耳?'],
                    'encodeOffsets': [[
                            126181,
                            47341
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'he_bei',
                'properties': {
                    'name': '碩控',
                    'cp': [
                        115.4004,
                        37.9688
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????????車?????辰?????車??????妖?????????@??耳???????車?????@????老?@耒妖耳????老????車???老???車?@??????@??@??@@???????耒??????身?@車??????????????????@?妖??@身???????妖?@???辰@??@?老耒????????身車???????@?????????@???@???????'],
                        ['@@??@???@?車?耳?']
                    ],
                    'encodeOffsets': [
                        [[
                                117271,
                                40455
                            ]],
                        [[
                                120061,
                                41040
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'hu_bei',
                'properties': {
                    'name': '綬控',
                    'cp': [
                        112.2363,
                        31.1572
                    ],
                    'childNum': 17
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??耒?????車???耳@@???@??????車???????????辰?身?????車???車???車?????@???????妖@???老?????????車?????@?????辰?????????老????????車?????@?妖??車??????耳車????車???車辰??車耳??車??'],
                    'encodeOffsets': [[
                            112860,
                            31905
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'gui_zhou',
                'properties': {
                    'name': '幛笣',
                    'cp': [
                        106.6113,
                        26.9385
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????身?????@????????車??@??@身??????@????車@身而?辰耒?@@???@??@????@????妖?車????@?????????????????耒?@????車車??車???@???????車??@???????????車????妍????????@?車?????'],
                    'encodeOffsets': [[
                            106651,
                            27901
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'shan_dong',
                'properties': {
                    'name': '刓陲',
                    'cp': [
                        118.7402,
                        36.4307
                    ],
                    'childNum': 17
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??耳????@@??????@?妍???@耳妖??@????@?????????????????身?@??車老????車??車@????車???????妖??車??車????車??@????????車?耒妍??車????@????????????????'],
                    'encodeOffsets': [[
                            118261,
                            37036
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'jiang_xi',
                'properties': {
                    'name': '蔬昹',
                    'cp': [
                        116.0156,
                        27.29
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????????車????而??身??@???車???????????@身???耒@???????????車??????????????????身辰?老??????????????身??辰?????????@???????@?????'],
                    'encodeOffsets': [[
                            117000,
                            29025
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'he_nan',
                'properties': {
                    'name': '碩鰍',
                    'cp': [
                        113.4668,
                        33.8818
                    ],
                    'childNum': 17
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@耳????????@@??車?????????????身???????????????????@@?????耒?????車?@?????考?@???????????老車車??@車?????車????車??車??身????????@???@???車?'],
                    'encodeOffsets': [[
                            113040,
                            35416
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'liao_ning',
                'properties': {
                    'name': '賽譴',
                    'cp': [
                        122.3438,
                        41.0889
                    ],
                    'childNum': 14
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????妖??????????@????????????????????@@?????車?@?耳耒??????老??@??@??@??老???耳?????車????@??????????耒?耳妍'],
                    'encodeOffsets': [[
                            122131,
                            42301
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'shan_xi_2',
                'properties': {
                    'name': '刓昹',
                    'cp': [
                        112.4121,
                        37.6611
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????耳車???????@@??????????????老老?車車@身??@????老??老?@?????車???????@??@??????耒???@???車妍車?耳???@?????'],
                    'encodeOffsets': [[
                            113581,
                            39645
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'an_hui',
                'properties': {
                    'name': '假閣',
                    'cp': [
                        117.2461,
                        32.0361
                    ],
                    'childNum': 17
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@車???@???????耳????????車???耒??????@???辰???車?????????????@???????耒車@???????????車車??老車@?????考???@??妍??老???????車??車??車???@?而?????@????車??耳?'],
                    'encodeOffsets': [[
                            119431,
                            34741
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'fu_jian',
                'properties': {
                    'name': '腦膘',
                    'cp': [
                        118.3008,
                        25.9277
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??車?????????耳?????車?老?@身??辰??車?身?????@???身??車????????@@車??@???車???????@??妍????車???車???????車???車???????????????'],
                    'encodeOffsets': [[
                            121321,
                            28981
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'zhe_jiang',
                'properties': {
                    'name': '涳蔬',
                    'cp': [
                        120.498,
                        29.0918
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????@?耳?車?????@?????而?????????????@?老????@@耒?車@??@???車??耒車@????@????耒?????????????@?車耳??@???'],
                    'encodeOffsets': [[
                            121051,
                            30105
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'jiang_su',
                'properties': {
                    'name': '蔬劼',
                    'cp': [
                        120.0586,
                        32.915
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????耳妖???????????@?????????車@???????????辰?耳???@車??車??????老考???????車???車????????????車@?????老?車耳?車車???????耒?????'],
                    'encodeOffsets': [[
                            119161,
                            35460
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'chong_qing',
                'properties': {
                    'name': '笭④',
                    'cp': [
                        107.7539,
                        30.1904
                    ],
                    'childNum': 40
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??辰????????@????耳?辰?????耒????車車?????????車耒????????@????@@??車@??@?耳考?@?????@??車??車?@?車?車@????車?耒?車?????????????耳??????@??車???耳@????'],
                    'encodeOffsets': [[
                            111150,
                            32446
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ning_xia',
                'properties': {
                    'name': '譴狦',
                    'cp': [
                        105.9961,
                        37.3096
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????耳?????耒????車????@??@@????車@????????@???車車???車???車@??車???車???????耒??@@??@'],
                    'encodeOffsets': [[
                            106831,
                            38340
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'hai_nan',
                'properties': {
                    'name': '漆鰍',
                    'cp': [
                        109.9512,
                        19.2041
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@耳?????耳??@???@而??????妖?車???@??????@?'],
                    'encodeOffsets': [[
                            111240,
                            19846
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'tai_wan',
                'properties': {
                    'name': '怢俜',
                    'cp': [
                        121.0254,
                        23.5986
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????老??車身車?老??妍????????'],
                    'encodeOffsets': [[
                            124831,
                            25650
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'bei_jing',
                'properties': {
                    'name': '控儔',
                    'cp': [
                        116.4551,
                        40.2539
                    ],
                    'childNum': 19
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@車車車?耒車??@?車車?@????老車??車??????????@車?????耳?????'],
                    'encodeOffsets': [[
                            120241,
                            41176
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'tian_jin',
                'properties': {
                    'name': '毞踩',
                    'cp': [
                        117.4219,
                        39.4189
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????@?????????@車?@@????@車???@??車?妖?車??@???車妍'],
                    'encodeOffsets': [[
                            119610,
                            40545
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'shang_hai',
                'properties': {
                    'name': '奻漆',
                    'cp': [
                        121.4648,
                        31.2891
                    ],
                    'childNum': 19
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????車耒??????'],
                    'encodeOffsets': [[
                            123840,
                            31771
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'xiang_gang',
                'properties': {
                    'name': '眅誠',
                    'cp': [
                        114.2578,
                        22.3242
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@車??@老@車??????@?@@身?@'],
                    'encodeOffsets': [[
                            117361,
                            22950
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ao_men',
                'properties': {
                    'name': '凰藷',
                    'cp': [
                        113.5547,
                        22.1484
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@X??aW??@l?'],
                    'encodeOffsets': [[
                            116325,
                            22697
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/chong_qing_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '500242',
                'properties': {
                    'name': '衃栠芩模逜醮逜赻笥瓮',
                    'cp': [
                        108.8196,
                        28.8666
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XJ∼?lJX@lbl@XbV@VLnJlxnb??UU@IVK@lVIVwnJlU@n@J@L@Jn@l_nWVLVln@@blL?mV@@x???`n??xV??Llx?LVxVV??V_U?VWn_m?XwVmnX∼?lmUUVw?aV??k@a@mmIUa@?mwk@??m@@U?a@UV@@K??@ykkmwkV@kU@???VkKWL?amaU?m@kyU@WkU@Ua?IUa??VaUUmUUa@aVLXKWa?UUbmJXnWnX`l@@xkzW?@V?LU??x@b@JkIkJ@LmbUamJ?wm@車x?nk@V?@x??VnUVmVU?V?UbVlUbkXW?'],
                    'encodeOffsets': [[
                            110914,
                            29695
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500236',
                'properties': {
                    'name': '畸誹瓮',
                    'cp': [
                        109.3909,
                        30.9265
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@WVXb?UnK@x@b??kxmKkl?_?VV∼?VU?@bnKVVV@@nk?@n?bn?@?∼@VL?U?@∼WV@V?nU@InKV?l@nU?b?KnX?WlknLlKUwnalL?a?VlUXmWk@UU@UWWIUy??XaWW@?X??KUIVm?U@W@UVU@KV@n?VkUk?mUmVIUmULUbm@?wUa?Kkkm???UL@bWVnx@VmxUI@?klmkkK@a?K@IlJ@I??k@mak@mnkJVL@bV@Ub??W`UUUV?I@V?U@VVbUJVLUVVbUX?VVxk?VJUnVxnVVU?JV@Ubl@@bXV@L'],
                    'encodeOffsets': [[
                            111781,
                            31658
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500238',
                'properties': {
                    'name': '拵洈瓮',
                    'cp': [
                        109.3359,
                        31.4813
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nLWbX?VLVU?V@K?IVl@b?@lb?U?VnU@J?U@V@n∼K?Ul@Vb?K?V?@?_?V?KXU?U@KX?@wlkkU@mWKUU@U?J@XV@?aVm?IVaVL??@?km?@?UkL?U@aU@WW?LUUU??Kkb?wWa@KU@ka?XmW?L?amVk@U?mL@JmVU?U@?X?@?VUK?@?nWK?LkKULWK@UXK@wW@?LkV@bVL?lXn?`?xU?∼Ln?lV@n∼Lnl'],
                    'encodeOffsets': [[
                            111488,
                            32361
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500234',
                'properties': {
                    'name': '羲瓮',
                    'cp': [
                        108.4131,
                        31.2561
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n@na?I?w?@@VVK?LVbVxnV?UnanKW?XamKmk?K@mkUm??KV?∼w??@Wm@UIUUlKUU@a?KWanwmUXamKk?U?WUnU@K?kUwWKXaWLUWkImaUUU??Kka㊣?k@l??w?wmbU???kXm@UJkIW?XX?b?m??UJ?XUV@∼?Kl??lVX?V@xmbnV@blV@V??U`UL@V?a@bULlb∼VXb??@V@b?L@J?xnLVb@lVb@V?@@z?bXW?X?KVLV??@@bUVVL@b??lVna@ll@?zl@@J'],
                    'encodeOffsets': [[
                            111150,
                            32434
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500243',
                'properties': {
                    'name': '鱖阨醮逜芩模逜赻笥瓮',
                    'cp': [
                        108.2043,
                        29.3994
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?Jlb@nVV@bXb@?lL?Ul`n?VKU?VxkbW?nlUxlXX?@?∼∼WnnJ@VUn@J?k∼L@VlV@nUJ?x@bVVVz@VnLla?KnalVlIU???@nV@@anKUwVal@U?lJ??lI@akU@UW?XKVI??Uak@@KmkXW?kX?WykIWwXw@?laXamkVUUym_XmlkkmmakwmIUKU@Wak@kaW@kI??WIk?V??UU?maUV@XkVUV㊣aUb?b??m@@ImJ?@m?mL@kUKUkkJ?bV?'],
                    'encodeOffsets': [[
                            110408,
                            29729
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500235',
                'properties': {
                    'name': '堁栠瓮',
                    'cp': [
                        108.8306,
                        31.0089
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lb?LV?VVnblJVXXKWbXLVx?l@LmVXVV?l?nLWbnVmxXb∼L@bVVkLVVVJn@@X???_Wm?kUK@alU?KX@@xWL@VXLVKlL?KXL?m@?m??a@ml?@mU@UUmL@aV??UU??U∼`lknLlw?㊣@a@wmL?VWaXU@KWU@ak@VaU@?IUVmUUwVmUIl?Uw?UVWUaVUUKVIUa@UUUUJ?UUm?k??nl@?@VWV@L?aUb?Ulx?@@b@VULUx@VUxVV?U@bU@mxU?U@mUV?klkk?@Wxknlx?K@amL?KU??K'],
                    'encodeOffsets': [[
                            111016,
                            31742
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500101',
                'properties': {
                    'name': '勀笣⑹',
                    'cp': [
                        108.3911,
                        30.6958
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??VI???n?aWWX?lJVIn@lW??V?na?x∼xk?l@???LV??LnK@b?LkwlmXw?@lllkU?nVV@V?nwV@@a?VUUVw@UVwVK@U@a?@kw?VVa∼b@KXU@U@?mk?????aml?kUVmn@VULU?m@kUVkUa?wUWm@Uw??mKUUmVUUULUKU?W@XbWVkaWwkUU???k@maUbmbVlk??xUVUIWVU?kJVVkL@UmJ?UUVU@lLUVU?lx?@@?Vb?J?U?L?∟@V??'],
                    'encodeOffsets': [[
                            110464,
                            31551
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500229',
                'properties': {
                    'name': '傑諳瓮',
                    'cp': [
                        108.7756,
                        31.9098
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VK@w?L@m@U?V@ImV?U?Vka?@@aUk?J@L?UUVUKmLmb?VmUUwUa?KUL@U?@?x?Jmbm@?nVJ@X@VkV?n?l?LXx?@?b@bUV?LU`Un?bU@@?mVVX@JX@VLVV?klV???`@bUL@V?LVKn@?U@?UJkn@lmLmK@X@Jn@mb?n?WVXnJ?k?K???@VK@kna?mX?lU?W∼k????@a@y?_Vm?UnU@K'],
                    'encodeOffsets': [[
                            111893,
                            32513
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500116',
                'properties': {
                    'name': '蔬踩⑹',
                    'cp': [
                        106.2158,
                        28.9874
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?InWUUlU@LVa?lX@∼?l?XxlK@Ul@@Un@UaVJ@I@W@U?UUVUwVIUKUa?UU?Vwn@?x@XUlnn?b?J@?VklKUUlk@ynU@kV?UUVWnI@?V?VWVIUKU@UV?a@n@Vm@@n?lUaVkUw?J@blLkLW@XWmXkmmLn?@m@U@UVm@??UV?UUlakUVa??VkV@@wnaWUk@Vwk?lmVIkUUxmJ@U??@K?Ikx㊣V@IUm@K@IUKkbWKUbn?m?@bmVnbmb@xkxUJ@?ULW`@bX@WVXL@V????mk?@UJ@VmLUaWnX@WJ@nkKkxW@UIV@@KkImmkK@UW@XaWIU@U??IkbWb?xX?lLVbnV@bWlX@VxVLnl@n??V?'],
                    'encodeOffsets': [[
                            108585,
                            30032
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500240',
                'properties': {
                    'name': '坒翐芩模逜赻笥瓮',
                    'cp': [
                        108.2813,
                        30.1025
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??@kl@??UbmVXJ@bV@nxVIVJULVVk@@LWbnJVU@bVbUJ@blLXnWV?@mbnV?@V??bn@VJVLnaVanbl@??V?lVXxlbXUWaX@V?UUVwUUVm@I@WmI@a?mlL??lK@alwnUV@k車Va???k@UlbVK@?VU??V?U?UVWU?@U`ULkwm@@KmU@knK??V?kJkUmb?LkbmK@UUyUU@a?wm@@XXJ@VVLVVUbVnUJVX@K??k`WXXJWXUbmW@bkL?Um`Xn?b@JVL@LU@?∼VVXKVnUxVLUbmJ'],
                    'encodeOffsets': [[
                            110588,
                            30769
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500237',
                'properties': {
                    'name': '拵刓瓮',
                    'cp': [
                        109.8853,
                        31.1188
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@kV?U?bkKmbVxkLmKkllbV@@LXb?xla?LV?VV?KXXV@@b?VlK?V?@ln@?∼KXa?U@Ulw∼JXalIUa??W?XW@kVU@?VUVWUUUamU?w@aVamwn@VUU?lLXWm?@w??kKklmLU???Wn?@??㊣?kwma?Wm?U@@LUV@V@X?VUnVJ?LW?@?XXWb??VzXJVXV@@VXlWn'],
                    'encodeOffsets': [[
                            112399,
                            31917
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500102',
                'properties': {
                    'name': '腺鍬⑹',
                    'cp': [
                        107.3364,
                        29.6796
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n豕Vbl?VVnL???@?x?V?n@n?J@L?UVVX@lbUJV@@nn@VVVK@z??V@nzVJVUlmX@@_VVVbnaVal@@knW@wna??VK@aVI?J@?kUVW@??wXUVJ?am?@Ik????_X??@WwkKkwm????kUx?n?mm????WV?@Um@UlVL@JU@@X?@UVkKVk?KVk?Kkb@bmJVXU?VVUbU@@`W_UV?b'],
                    'encodeOffsets': [[
                            109508,
                            30207
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500230',
                'properties': {
                    'name': '猿飲瓮',
                    'cp': [
                        107.8418,
                        29.9048
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?豕@XUK@LlV@blbUJ@??V@bnV??@VVVXU@?lbXal@VXnKV@maXU??@amk@aVKXV?anb??∼mnIVaUKVwUmWLUU??V@@KUK@I?aWmn_?VlK@anXVaXWWIXWl_??@LUWVIUmVaUUUK@UWI@Wn@VI@mkU@U?K?l@ImV?L?wU∟車bUU@wW?Xkmm@LU@@VUIWVUL@JUn?a?x@Jn??bUIWV?x@?UXlV@∟?IUJ@bUL??mb@xmX@lk@UbmbUaUU@`W@kn'],
                    'encodeOffsets': [[
                            110048,
                            30713
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500232',
                'properties': {
                    'name': '挕癒瓮',
                    'cp': [
                        107.655,
                        29.35
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l??w?bVm@IVKXUVJ@UV@@KnnWlX?@xVV?aV??x?KnUVm@UmIXm??@?W?kWVwmkX?laUwV?ULm?k_?VkK@?Wa@aUU@mka?I?b@?n??nm??_@mmK@U?LUV?VmI@aUJ@XWJ@?U`UIkm㊣kk@@lULmUmKUnV?nlUVmI@VkVlx?bkI?VmLUxkKU??X??n??n?mVw?l??n?lxlLXx?@W??`??'],
                    'encodeOffsets': [[
                            110262,
                            30291
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500119',
                'properties': {
                    'name': '鰍捶⑹',
                    'cp': [
                        107.1716,
                        29.1302
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V?UbVJVUn@VLX@WVXVVI@VUVWxU@m?@?X@@?V?∼aVUX`@_V@VaUUV?UWnI@ala?LUl?LUllLVU?@@WV@@IUKVkn@@VlLVwnK?UlJ?akwlU@UnJVUmkU?VmXa@wVK@UUw?@V?VI@ak?@alInwlKXUmaUW@wWLk??KVak_?aU??V@?Xb?LVxUlWIk@UK@V?@?kU@VbUVUlVn?LUV@lVXmxkV@L@V@Vk@WbUwmL@JUI@xVxkx'],
                    'encodeOffsets': [[
                            109463,
                            29830
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500241',
                'properties': {
                    'name': '凅刓芩模逜醮逜赻笥瓮',
                    'cp': [
                        109.0173,
                        28.5205
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XlV@lzn@V?nb?bXKlL?U??V@@llUnxll@z??@LU@@V∼b@Vn@??l@V?U?nK@U?U@aUa?kVm@K?w?klmnn?Ul`nI@almkIUwmWVkUa?kkJmUUa@K@aU@@_m@@wUyVUUa@Um?@a?wl?@Wka㊣?UkUykIWV?b@bUVk@?aU@UXU?UIWakUWmUxUV@nUVWb??@XXVV?mXX?@V?bVLkVWx'],
                    'encodeOffsets': [[
                            111330,
                            29183
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500114',
                'properties': {
                    'name': 'ン蔬⑹',
                    'cp': [
                        108.7207,
                        29.4708
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VX@V@LV@VJUL@lVnnxlb@VXV?XV@@W?@UIVK@kUKna@?VWUaVUUalIVJVIUW?_lm@bXKV@mn@J?UUw@KnIVll@VanLVmUkVKXLVKUIVamw@?UaU_lw?KlwUWV_Ua@aUa@KU??wm??_??@wU@?nkK@am@UkUKmXk`m@@I@K@I@mkVmIUxUJ@kUL@JVV??lnklWnn`VzUVnlWbkb@?WxXxlJXzW??lWXnl@Ll@Vb?∼UJWLX?@VlV@bkJ'],
                    'encodeOffsets': [[
                            111106,
                            30420
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500117',
                'properties': {
                    'name': '磁捶⑹',
                    'cp': [
                        106.3257,
                        30.108
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XKVXlK??VL@UnV@aValXXK?U@WVwUaVU@IV@@aVW?L@U@anVV@@bVK@UVL@bnJWL@VnUnb?@@JnIlV?l?@@bXIWbn@UKVLVKXLlaV@VVnK@bVL?m?IV?@KmknUUWVI@aVJ@_?WU_VmUw?U@K??Va?k@am?mJU_UJUkU@W?kIV`UI@JV?@LmmU@@m?bUz????@?VK@nUK???b?akb@UWK@bkVVbV??@@`?Xk@W?@n@lXL@bmb@VVJUn@JnUlnUlmX@`XLlbkJW@kzlb@`@b@b'],
                    'encodeOffsets': [[
                            108529,
                            31101
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500222',
                'properties': {
                    'name': '鐏蔬瓮',
                    'cp': [
                        106.6553,
                        28.8171
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@??@X?lVX@@UVKl?VUX@lanVlUVbXWVXV??VVUnKVUlwUwU@UJ@nmVkUV?lwXam@VaUUUw@W@kk?mV@UmKkwVKVUU@@LUKVI@mV@XVWxnXVKUUUK@wWU@UUWnUlLXa?mUI?am?@w?I@K@amIm?UUkI@m?akUkKWUUan?@w?amLVxk@UVmUUL@Vm@kV@I@ak@@bWVXJlLVbVL@?@bn@@`Un?@WbUKULWVXb?@UVmbX?WV?b@b?VmxUKU??V@?Un@V@V@nm?nKlnnWWXX@lKkK@a?IVxUlVb?k@mn@@U@m?bVUV@VLUJUXU∟'],
                    'encodeOffsets': [[
                            109137,
                            29779
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500233',
                'properties': {
                    'name': '笳瓮',
                    'cp': [
                        107.8967,
                        30.3223
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VL???U@W??@?V??@lk@w?ml?VU??ll?VnI@VlKUUlIV?XUVJVU?wl?UkUKUIm@?aU??@mUna?@XUWmkK@aVIUa@aUVmIXa@Kl@UUVKUIUJmwU@@aWInUVa??k@@l???n?∟ma?bWUUL@bnl@b??WVnbU@mLUWk@Wbka@?WVUU@U??mUmVkUULV?lVUx?l@L@V?b??lb'],
                    'encodeOffsets': [[
                            110239,
                            31146
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500228',
                'properties': {
                    'name': '褽す瓮',
                    'cp': [
                        107.7429,
                        30.6519
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XLV@VV@b∼∼n??nkb@b??nJWVXblIUV?xWnUJnVVLVU?JlUnLVK@UnUVJ??nKVbVKla@aX?lJ?k?Klb??@U∼??K?V?IUa@??@kwV?VUkKV@VUkk??UVk?㊣n@xkl?@U?@???@X?V??UJnxWb?@UX?KkVUbUKWUkVmkkLU`?b'],
                    'encodeOffsets': [[
                            109980,
                            31247
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500113',
                'properties': {
                    'name': '匙鰍⑹',
                    'cp': [
                        106.7322,
                        29.4214
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nxnVlJlUXL??@x@Vl@nKVVX@V_V@@KlVXU?@lKlxXIl@??@Vl@n_VJl?n?Vlnb??VVVJV?VmUUk?Uam?U?@?W@@?n?V@XwVU@UUJWUXUW@UKm@UVUIVaU?UVmLUV?UU?UWWXUakVmUkbW@UVk?UL@VW@kUW??@mJUXVVU?@lmV@zklVVkLUl@??I'],
                    'encodeOffsets': [[
                            108990,
                            30061
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500223',
                'properties': {
                    'name': '噉鰍瓮',
                    'cp': [
                        105.7764,
                        30.1135
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@a@a@_kalyX@lIkaWK@_nWVkkmmV@IVmUI@Una@aWK@k@mkbWaknmJUk@mk@@kUal@Ua?@Wa@aXLlwUKlkk?@KmI@VUJ@Lk@@VUUmL@amJU?kKUaWakLmU@bVVUbnbWV@xkL@bUb?xUxVbXJVbUVWIUVU@kLWxkKWV@n?VUbU@@VVX@VmaUL@VUK@VVbn@lVnI?@@lnLULm@Ub@?l@na?@lK@XVVkJ@b@zl@@VnV@bVb@J@bnXV`lXXmVI@W@InbV@@aVKUblKVLUanLlmnLlK'],
                    'encodeOffsets': [[
                            108529,
                            31101
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500118',
                'properties': {
                    'name': '蚗捶⑹',
                    'cp': [
                        105.8643,
                        29.2566
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@b??nWVLX?lxV?VxXxlVn@@bVblK@a@UnLVJV@@UnLVU@VXaVKVX?@n`W?U?@IUKlaUUUkWyU???@mmkUKUwW@Xk@amUUakKW??wXa?K@VVLkl?XVlkxV?UL@bm@Vxn`?IVxUVkLV?U?l@@lkXmm?VUn@VV@Xb'],
                    'encodeOffsets': [[
                            108192,
                            30038
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500231',
                'properties': {
                    'name': '菜蔬瓮',
                    'cp': [
                        107.4573,
                        30.2454
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??∼∟n????aV_lKnllUXVVLValU?LVW?@XamwVIUKka???a@U@K?kVwkUU?VKlVnU@a?U@?VIka@akU@KVL@W??UV@Vmb??@L?K?nnJW??VkxlL@VX@VxmnXVWxUb@bkn'],
                    'encodeOffsets': [[
                            109812,
                            30961
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500112',
                'properties': {
                    'name': '趵控⑹',
                    'cp': [
                        106.7212,
                        29.8499
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@bVVXL?a@lnbWn@L?@XVlK@VVLUVlbkLUKVVVL@V?nX?VL@VV@UbVb@x@?UxVb@bUJ?L@L?VVxlK@?nk@U@W?UVLlKXV?@VblU@UUKVU@wn@VJVanLlkX@VaVK??@a@U@U@?VaUK?kUU?㊣maUkm@UUkbm@@Vk@@J?wU@Ub@I@JmwUL@a?@@KkV?Lk?Wk?@kUU@@xUVmKUnllUb'],
                    'encodeOffsets': [[
                            109013,
                            30381
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500115',
                'properties': {
                    'name': '酗忭⑹',
                    'cp': [
                        107.1606,
                        29.9762
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VV?U?bX?lX??l@XnVmlxUx?@@blVnn??lm@aVaXwWUnmUwW@@UkKlw?UX?mI?m?L@K?∼na@UUImyU@??@yULUUm@@mU@VIkaW@UU?V@K?I@m?m?U?w?@??mKUnU?UI?lVLUb@?@V@V@b?∼ULUbW@klmKUbUIm@@xUVVL'],
                    'encodeOffsets': [[
                            109429,
                            30747
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500225',
                'properties': {
                    'name': '湮逋瓮',
                    'cp': [
                        105.7544,
                        29.6136
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XUmaVaUU@anVlKXbValU@aV@@IXK?@@bV@VxVK@UXLlU?JXa@_?@@aVK??WVkwWa???wUa@am@kUWLU@kWmX@ykI@W@UV@na@LlLV@U?kwW?UKmXX`mIVl@bXLWVkbkk?x@`VXm@@J@U@UUKUxk@WbUIVl@VXLW??JUkUlUImxXlmb@X@VUJUnVb?W@UV@@VVX@bnW@LVxUnlJUV@n?@VxVIn@l`?UVVVL'],
                    'encodeOffsets': [[
                            108270,
                            30578
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500224',
                'properties': {
                    'name': '肣褽瓮',
                    'cp': [
                        106.0291,
                        29.8059
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VblLV∟nI@bnKVV@Ul@@KVI@UnJ@Ll?klVLkxWK@bXb?@Vbk@Vb@ll@@nVlnIlmXblaX?l@?W@_?@U?UalU@aXL@Vla?b?a??VL@mUL@?UU????XUW?X_Wa??U???m_?@UWULWb@UUVmK@VU@UImK@V@bkL?x??XblxXU??UL@b?@@`Wb?IkVWK@VULUwU@@a?@WL@JU@@bkVUb'],
                    'encodeOffsets': [[
                            108316,
                            30527
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500226',
                'properties': {
                    'name': '�椏�瓮',
                    'cp': [
                        105.5127,
                        29.4708
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VI@U@WnaWknwVJVkVl?IX?WK@UUkVJXal@VwVL@V@V@In@UW@_?wlllaXUWK@aUknJW_??@aWaU@@UVm?UUaUImJVn?UmV?Um`kUUVWLnVU@VVmX?K@?nxm?ULkx?ImJ@nU`@X@Vkn@`@nlV@nVJVaX?VLnK@bVV@nV@lbXW?@'],
                    'encodeOffsets': [[
                            108012,
                            30392
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500227',
                'properties': {
                    'name': '韏刓瓮',
                    'cp': [
                        106.2048,
                        29.5807
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XzVlVVkbVL@JV?X???V???XbW`X?WV????VV??VkV@@UXa@alK@I??U@UKW?UyUI@wVUUWVak@VUk?W?@WXI@yVIUK@kWwk??㊣W@?kUb@KkVVVmX?J'],
                    'encodeOffsets': [[
                            108585,
                            30032
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500109',
                'properties': {
                    'name': '控縸⑹',
                    'cp': [
                        106.5674,
                        29.8883
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@X?VLV@??@JkL@bWb@VU@Ul??Vy?a@nV@nn@KU?@IVJU_lJX?V@VlVIV`nIn∼@b?lUb???KVI@aUaVw@?@wUaVaU@@UUKW??m@UUKUUVLlKkaVUUK@UkLWU?@@KXmma@k?bWKUU@aUamLn?@VWLk@@Wm@ULU@@U?KUVWI'],
                    'encodeOffsets': [[
                            108855,
                            30449
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500110',
                'properties': {
                    'name': '勀呏⑹',
                    'cp': [
                        106.908,
                        28.9325
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VIV@@wVJ@InKVxXal@@U@U@KlUnwUW@kVU?KUmVkUa@I@KW@@bk@@m?U@m@k@a@a?IUxmJk@?wUL?wkKmVVX@VXV@xVLVVULmWXwWUU@@nUJVL@KV@UVULlxnL@VnUl?@l@XVxVVUbn@WbkxU?lVnU@m'],
                    'encodeOffsets': [[
                            109452,
                            29779
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500107',
                'properties': {
                    'name': '嬝韓ぞ⑹',
                    'cp': [
                        106.3586,
                        29.4049
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XK?L@V?@XbV@lW@UV@@VXIV@U?VKlL@Kn?nJ@VV@VU@I?@@mVUVWUUmL@V?LUK@UV@UU@a@U@yU@WLUK@X@KUVmL@?@aXI@w@ammVk@W?wm@UxV??VVbVLUJVxVU?V@V@X@JUIVbm@@Vk@@VkL@lVLUJ@zWJ@X'],
                    'encodeOffsets': [[
                            108799,
                            30241
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500106',
                'properties': {
                    'name': '伈ざ商⑹',
                    'cp': [
                        106.3696,
                        29.6191
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@X?l?UVl@UbVXUV@xVJVzXJVU?L@VV@VKn@@Xl@XK@Um?nKVbVakkVm@k??UK@UmIm?@LkKULV?U@WJ@UU@@VkXU@Wa?@@U?KWL'],
                    'encodeOffsets': [[
                            108799,
                            30241
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500108',
                'properties': {
                    'name': '鰍偉⑹',
                    'cp': [
                        106.6663,
                        29.5367
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VV?JVL@bUVVnl`XIlwXJlw∼nnl?IXW@U??k@WJkwkL?@WVkU@LU@U`W@UXUV@n'],
                    'encodeOffsets': [[
                            109092,
                            30241
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500105',
                'properties': {
                    'name': '蔬控⑹',
                    'cp': [
                        106.8311,
                        29.6191
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nLVU@wV@lV?@Xll??KlU@L?@@bVKnx@I@JVaV@?x@Il@@Un@laVVn@m?k?UIm`k@WX?Jmk?mkxWIkxWJk_UmVUUK?@UU?@??@l'],
                    'encodeOffsets': [[
                            109013,
                            30319
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500104',
                'properties': {
                    'name': '湮傾諳⑹',
                    'cp': [
                        106.4905,
                        29.4214
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@k@@U@w??WKkVkImUmw?a@b@xWJ@b@?nKVU@L@WVLXKV@@z@V@bVVU@@VVL∼K@U'],
                    'encodeOffsets': [[
                            109080,
                            30190
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500111',
                'properties': {
                    'name': '邧Э⑹',
                    'cp': [
                        105.7874,
                        29.4928
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@WwUwU@kK@KmbU@@V@XlJ@znWlXV@XK'],
                    'encodeOffsets': [[
                            108372,
                            30235
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '500103',
                'properties': {
                    'name': '趵笢⑹',
                    'cp': [
                        106.5344,
                        29.5477
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VL?@VV?@VL@aUK?IUU?@@JUVU@'],
                    'encodeOffsets': [[
                            109036,
                            30257
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/fu_jian_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '3507',
                'properties': {
                    'name': '鰍す庈',
                    'cp': [
                        118.136,
                        27.2845
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@kny?k@??KU??wV@nk?W?zUmk@@?lKUa@aVI@U?KUamKUUVaUI??@X?@UV@K㊣IUVVlUbUbUL@KWUXmWk@KkXmmk??KU??a@amU?bkUkKWUnwU??wV?UU??UKV?U?@?nKWwXLVKm?@wUXkmWk@?@wX@lU?@?yVImaXwV??@k??nU@mbk@mlUX?mU@mV@n@bnW@bUIWJ?ImVUKWbUK@nkK?aU@W_?VUUmWmL@UU@?bUWUL@V@bmVUz@`mUUVVbXL@V?L@lmLUxmV?amXkW@xWbU?VbUxkU㊣@?UmmkLUbW@@`kLknVlV@lbXxlVUXVV??U?U@UbW?kIWVUUUJkI@llbUxVL@V?V?UU∼ULUmWXUV@VULWb?@?xm@UaVLVKUa@??w@V?bk?mV?ambUUm@@VkK@?@b?xlxX@??n∟@X?@@lkLWV@?n?V?kb@bWJXLWx@nkxmm?bXn@VWVUn@VnJ@bVXl@??VJXnWbX`lL?UlJVI@??@VXV@Vl@bn@@?mn@V?xXU@mVIlx?V??nI?l@nVJ?aXI@mlU@aXkVm∼klmnVV_na?∼@V@x??XK?V?nnUlVXbVK?LXKV@naV@@?VVl@@lXblX?WnLlbVK?n?@@?VLUnlV@l?X?x?∼?V@UnaUUlKXLVUVVUbVVlUnJVX?@VW@an@lb?@n?l@VU@an??UVW@k?aUm@InVVKVU@?kUW@Uam@km@kVa@a@?nw?U@WlI@mVI@WXaW_n?@?n?lkkW@U??@kV@Uw@wU??@@IXK??VIn@nU@`@Xl@VV?Lna?W?bVaUwnU?@VI?KlV'],
                    'encodeOffsets': [[
                            122119,
                            28086
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3504',
                'properties': {
                    'name': '��隴庈',
                    'cp': [
                        117.5317,
                        26.3013
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lL@Un@VVna?bnUl??a@U?x@?VbULUKVbn@?w?@XaVK@UVUXWVnVKV??V?U@UUKVwka@klJVIVVXUlJX?VaV@V???UUVWkUWwkaU@UklmlK@_X@ValKnn?V?@lVVwUaV?Xa@wlXnW?bnUVwnK@k?K@UWKUaVUnV@_VynU@a@UVKVX?aV@@VnKnXVV?UX`V@?blL@mVLXaVLnU?JXIVJ@amX@a@mnUV@?nVWnkl@naV@?ml??@@Km??KUam@UU@?@UlKU?Vk?U?K@aVaUwV?U?UIkJ@wmI@?mbkwkVW@UX?KULU`?IVKUa@L?kkVmUU@WlULUW?U@I@?WW?nU@@w@a@?Uam_XyVIVWkk?@mwVKXUV@nw?VXkW???U@?a?U?KUn?K@???mU?LX?VLnWVbVbUVm@Ub??W@?am??`kb?amLUUU??aUXV`@x@XmJ@n@L@xkJUU@kU@mWm@kUUwUUVWl@VUkI?y@kkaVUUm?IWVXbWxU@k?mVkK@nWVX?WxU@@bkx@VU@W?k@?kUbmJUUmkUW@_kKWK?@knV∟kIUKWLUbV??@Wbk@@VWL@VkI@lUXVxUVU@@mWI?V@a?nUa?aUV@??J?b@b?∼VbU?@X?aUVmL@?VX?bl?nV?∼?n@Vnx?@VUUUlK@InJVb@?Vlnn@V?L@VWJU??x@XlJUVV?Vl@LUUUJ@L??@lUL∼?k?V?VnV@?xV??l@blLnl?LVaXll@?nVUn@?xn@nml?∼?X@lb'],
                    'encodeOffsets': [[
                            119858,
                            27754
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3508',
                'properties': {
                    'name': '韓旂庈',
                    'cp': [
                        116.8066,
                        25.2026
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?a?I@?VU?bVb∼m@b?UXJ@nV@VUUwVW@klJ@UXK@Ul@Xa?@U?VaXKVLlJU?lm?@XLlL@`VXnlVVnIVa?ll@X?V@@Ulw@aV@XwW?XU@mlLnUl?V@XwWaXU?JVnUVlb@l?zlJUVk@UXVVVxlVn@nXV@@lVVlI@w@K@mnI@W@wU_VW?bV?VVnK?bla?_n??bX@∼?Van@VUUaUamXUKW??K@a@Uk?@wWkX?WW@wUU?K?w@_ly?wUkU@@U?@kamVm?Xa?UVUka@?Wk@?UUUV?KkbWU?VUbk@mk?xk??KnIVUmW@kUKmXUmVaU@kU@?m?@K?UWVkIWJ@?U@UI@wUUUa@KW?nU@mVkUmm@XwWU@?UUmL?@?w@mn?V?UU@aWak@@amxU@UxULWVXbVLU`mbUImVU??bn?V@@bVn@bnVWx?LmyUb?IUK?@?a?Vm??akbV?UXW?Ul?KWbkV@?WLUlk@@n?b?b@lkKmU@?UIWJkw?UUVVxm@@XkbWx???X?K?lUzWJkUUL@bmKkV?@@VUIUlWV@X?K@VkbWx∼xUb@LUbk@@VWb@LXJ@VWXU@@bUVV?VVn@VVlLn?@l?@?xk?Vx@bVJXb?n@JlnXxV@@?nJ@X@V@lmx?bUn@xVL@VVKlL@l??nLVaVL@xkl@L?xVl∼??X?WVX?Vl??JW?nxlJ'],
                    'encodeOffsets': [[
                            119194,
                            26657
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3509',
                'properties': {
                    'name': '譴肅庈',
                    'cp': [
                        119.6521,
                        26.9824
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@LVKVaVaUkVU?J@LVU?@@W??VJUbVVnLVb?L@VUJ@bVbkL@?l@Vn?y?XmlU@?xV??L@??lmz@lnL@bVV?bVb@l?n?KVk?Vl∟@zXV@?l@XJVLVKnXVK?VnU@wUm@??KU?@UlVlw@U@U@?UaUKlU@kXKlmXIWKXaVIVUVK@KU@@k?JVUnLVJUL@V?IVa@VnL?KUnl`Vb?V??V@??Vbn@Vzn@lKnVlI?VVKUalkXJl@XXVWVLVUUmVU@Unm??lK@Uk@WUXK@U@WVwVk???k??∼aU?Uwma???U?a?w?㊣V?XalK?x?@?UVa???V車b?L?Jm??Vk???k@mamXkKU?UL?akbk@mV@LkJWb@Vk?mXk@UVmaUV@amLUKUamI@KUaU@WbU@UUU?UIWJUkm@???w?Kk?VJm@kx??V?UK?@mUVUkmlkkVm@?amw?LVWU@UbVLk?Ub?@V?mK@?XaVWU_VJnwV@@kUmWakx?@kwWakIWxnbUJ?z?@kVW@@x@?XllnVW@xn?ULWKXxmL@?V?U∟VL??VVU??xV?mxXVlLlV?anV@b?bV??Ll?nnlW@LXlWnXV'],
                    'encodeOffsets': [[
                            121816,
                            27816
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3501',
                'properties': {
                    'name': '腦笣庈',
                    'cp': [
                        119.4543,
                        25.9222
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lxna@?nJ@xlIVJV?U?VxUb@b?L?VUlV?kL@V@?VVn@Vb?Ln?@LU?lJXblx?@lwXbVn@lU@mxUIV`UXWb@?nLU??@Val?UKVaV@UX?Knx?bn@lUkllnUVnV?@VLU???lwn@UIl??L?x??n@VlXIVJV?VVV@XaV@Vb@LnJVbVLnK@bVUnbVUl@nWl?@UXalI@KnUl@la?bVKV?lLnWnbl@??l?∼Un??I?K?a?U?a@UUw?W?IUWU?Vk?m@?@?@KmLU∟UL?J?kU?V?UU?@?V?KUk@?∼w????@貝?谷@???m貝?km??@?V?V車∼身?U∼?n@bVJXVVL@bU??akLmx@xmxXzW`XbWnXV@bWL?@?a?@?aXbWVka?wU@ml??WKkLWWkLUKULW@kVmVUU??UamV?∟?n@xUVUzkJV?lJU?'],
                    'encodeOffsets': [[
                            121253,
                            26511
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3506',
                'properties': {
                    'name': '桫笣庈',
                    'cp': [
                        117.5757,
                        24.3732
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@bl@Xb@bVVU?m?@n?x?@nKVV@?XVWxn@VnUl@nmVX?@LVbVV@xVJV@@?XIlJXU?V@Ln?@?lVV@UbVnnWVL@lnXUVmJ?Ll??wnll@Va?UXVla?LVUVV@?Xl@?lbUV?VWbn?nUlb?@@VV@?aVU?ml?Ua?Uny@kU@Wkk@WaUVk@@ammk@@U@UlU@aUa@wl@?mXLllnL?U@anVnU@L@VVV@KlXnWVnVanU?w@w@wm?n?@w?aUam@Uk?mU?l@@a?a@U@??k?K?w??∼w@?kw?a?K???k@?身?????UKW?k??LU@Ul?w@∟Vz?VUbkKUbmLmlULU?UxmbXl@bWV?b@bUnV?U?VbULU@@VkbVL@`U@WX@?XV@b∼?@b??@∟@Xm@@b@`U?VVUL'],
                    'encodeOffsets': [[
                            119712,
                            24953
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3505',
                'properties': {
                    'name': '�肯楟�',
                    'cp': [
                        118.3228,
                        25.1147
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vl?xkz@`?x?LVV@xXXW?Xl@xl?@V@bnV∼?@??LVm∼L?V?bV@??X?Wl?UmxU@WVULnx?@llUXUJWzn`Vb@?@b@xV@?mXX@?@J?VVXVKXkV@nVlU?l@KVbUL?JV_VK?LVWX@lUV?kIU?lIVyVU@w?m??nUVWU?@a?m@U?mWw@UX@@am?VUn@@aUUlUVanaWUXWmUnk?K@V?UlVVUUw?@XLWWX?ma@knm?bVb?VXbVL?@XJlInl?L?w?mX車?w@?V????a??車?車K?∼n?U??U?W@??x?∼??l?V?n@ll?a?@?L?b?`?@??V?XV??Vx@V@bULVJU?k??@???XUKk@mmULkaWbk@?x@UkL@a@K@U@UmKmbU@kV@UmVUbUmmXkW@LUU@U@KmVmU@b?VmKkkWK?nk@@xVb@bkV@V@Vl@nn@bl@VUXbl@XlV@@lmz?VVbk??nUV?b'],
                    'encodeOffsets': [[
                            120398,
                            25797
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3503',
                'properties': {
                    'name': 'な泬庈',
                    'cp': [
                        119.0918,
                        25.3455
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vb??VVnUlUX@VKVLlKXXlKXL??nkV@?xlbXUWa?b?@?b?@XK@aWUXmWaX_Wynw@wnwlK?bV?@aUKWUUI@a?mV??????U?U?@n??a?谷@??n???K?車車@??U?@豕?xW??n?x?KmkkJWI?@UKWa?UUa?amn@lnbW?XXWK?@VxUVkU?V@U?LmlnVWXXVmbUbkVVV@bm@UVn?@bW@@VXx?n@V?n@bV?UX'],
                    'encodeOffsets': [[
                            121388,
                            26264
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3502',
                'properties': {
                    'name': '狪藷庈',
                    'cp': [
                        118.1689,
                        24.6478
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@VlUV@nanL@V@V@L@blK@V?wl@XalbVKnnl@VL?W???@l?V?UIVK@a@UUw??WUU????@?_?a?K?@?bkkm@U?k????x車L?l@?@V?b@bk@V??nVln@Vb?b@xm?n?@x@x?x'],
                    'encodeOffsets': [[
                            120747,
                            25465
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/gan_su_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '6209',
                'properties': {
                    'name': '嬴�羌�',
                    'cp': [
                        96.2622,
                        40.4517
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?n?a?@?U???U?????WU?UU㊣JkkUw?y?I?x???????Uk??U??㊣??IUx?U???????∼?K?n?∼?U@??@Vn@?????Wn?∼XLWlnVnbWn?VXxmb?a?b車U?l?UUa?IUmlU?????k???wkk???a@???U?∼mV?k?V?nKl?身???U@kl?U??kU?nUW?@????k???mWV?UKnU?mUw?w@?UIVaX??wm??mmwn????L??U??JUal?ka㊣V?a@U?k@?????Wmn?Ua?∟??m?n??m㊣x@w車x?L??Ux?V???JUb車z???K??身l?U??W??l?n?b?@???L??mV@???k?m???kV?L?m?X車∼@??bV?車V???@?a??UV????V?UV?wmb?J?w杗a?Xm??Kkkm??bX?m?V????∟????????n????L??U??x???迅???n????∼??????????????b?豕??@??????∼V??b@l?????里???K????????@????車??巡??w@?????VV?V?車??@???V@?貝?@∼??V@???∼X而??@?a??????n?車?V?U??????a㊣V?U????'],
                    'encodeOffsets': [[
                            101892,
                            40821
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6207',
                'properties': {
                    'name': '桲珒庈',
                    'cp': [
                        99.7998,
                        38.7433
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????k?mLU?l?U??nV∼??@∼?b???a???l???LVU?@??@?Um?@@??V???m?L????????∼VVw?J?????Vl??V???∼???w?J?zVxll?IVVV??X?∟???V∼??V?@?b?m迅L?????a???m??U?l??k∼?Xy?U迅V??nmV??a@?nK∼?n@l?@????∟m???@??U@m?mVk?U?㊣??∼??w????U????V?a????????n_∼x?Klx?klx?@?w???@?m?b???Llk?WXa???a???K㊣w@w?U??V㊣Uk?@@????x?U?㊣㊣UU∼身xVx??身∼車?U???車b???@??車UV?Ux??@?V?UV?w????車Vkk?J??kmmL@??K?x@bk??@U∼??車`?????mn?∼?Uwl?kU?`???????z@??n?∼U??KmVk??J???????∟UL?@mn?`???nUx?@???U@??k??@x?@m?車Jk???V???車??l?∼??U??????@?x'],
                    'encodeOffsets': [[
                            99720,
                            40090
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6230',
                'properties': {
                    'name': '裘鰍紲逜赻笥笣',
                    'cp': [
                        102.9199,
                        34.6893
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????nKln?wX?W?Xk?x?Un?∼a?VnUUKl????WXn??????@?nmVL@∟∼?Vz?J?anU@a?wna@k??U??yX_?a?b???w?谷XkWw?a??V?m???U??I@??@?m?b∼a???U??@??knw??∼I∼??mVU??Xa@w?W@w??V???l?Uwnm@k?aUa車Kkk@??a?b@???Wa?I?x?am??VU??x??l?@z???b?a?V?w???W?z?J??mJn?m??U???@?∟?b@?n?ml?@@???U??LVx?V??U??lma?b@??∼?l?@WIU??@m??@??車????@U??z?y?X??U??VUUVLkbWakVWmUbkk?KU???n???∼Knk@a?UVm?nk?l???lw@_kKVU@?na?@lUk@??mV@kmb?W?b???a@mkU@?k???kU@??`@?車車?bl?Ux?n???lV??x@blVkVVn?`X???@??K???JmUUnU?mlU?mKUn?V?aUw?U?`?n?wW?nxV???@b?n??kI??kXU?㊣??x??@?X?∼`l??V?I???V???VVan@Va?UVa??Vm?blk?W??WIXa?alL@wVb???V??lL@l??n??U?nk??L@??k???K?b??W????V??ULU?k?l?Ux?x?UUx???x?@Xb?L@l?@??lXVln@?bm??J@??n???x@bn??m?xVXmb?豕@????W?w'],
                    'encodeOffsets': [[
                            105210,
                            36349
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6206',
                'properties': {
                    'name': '挕哏庈',
                    'cp': [
                        103.0188,
                        38.1061
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@㊣???@klwU?????mw?Km?????@??kV?UL?lV?UK???m@a@U?@X?∼l∼L??@a身V?w???KU?????WJ??lm@??VWa?@kl?Uma?LUana???k?J????㊣KkX車??x????@??nU??b∼@??kL???X??@x?n?xWx???∟?I@?n??VV?VlU??豕?V@x?x?L???b?∼Wb?Xkl???@l∟?X?`?wl@???m@b?nV?Ub??@????L?豕??U???l??`∼????b???????n?谷???????@@l∼l???????K????????m??y????@????m?U??n???UaU???????'],
                    'encodeOffsets': [[
                            106336,
                            38543
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6212',
                'properties': {
                    'name': '瞻鰍庈',
                    'cp': [
                        105.304,
                        33.5632
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???@l`U?mV?????@nn?wVlnVVa?LV??_????@n?a?x?@?l?_?@VxnK@llLnxm??JnbUx?I∼?l@n??l?IlmX??k∼@?k?J?k?谷?@k?laUaVaU@@?nIW?nmnx?k?????aV?∼?V@nw?K?x?b???V?U?b???Ln?m?Vw?I?J∼?@?nb@∼∼I??Uk?KV???@???l??Lnm??@anK@???n?@?mL@??yk?UUmbU??@ky?b車??XUx?WVz?b㊣m?bXa?wUamL??@wUKVwm??J∼?UWVk?KVk∼w?V??V??lU?????kmVamkn?Uw???b???K?k?Kk??V?Vk?kKVw???a@k車y???Vk?車w???X身???車w???U㊣?k??@?x?I???Vm?n??@n∼?bUb?V??UnnJ??@?m?nV??@??L∼JXb??@??a?b@?ll?LVb?b@lmnVxk∼??U∼??@x?X@xWb?∼UV?n???J??mx?l@?'],
                    'encodeOffsets': [[
                            106527,
                            34943
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6210',
                'properties': {
                    'name': '④栠庈',
                    'cp': [
                        107.5342,
                        36.2
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@kw????Vam??V?w?I車Vkl???Km??V身??WkL@b?K身?@???@??L?x?@?b@l?a@km@@l?nm@Ua?@??車WUXm??n?w?`@UUx???∼??@?VJ?_n??IV?nalxkX?JWn??nV?L?xl∟nnVbklVX@xnxmV@bUK@nm@@x?V?∼㊣a?n??kUWnUa?x@m?n@??L???mU?lU@l?V@blLUblxklkI?x?∼?UXb?aV?Un?V@∼?LUlnb?X@`∼?nVmbn?m?V?kLmK??U?@X?y@kl@U?∼K@?XbW???@b?WnLVa?V??Vz@xlV??lbUx??lV?U@n?W?n??VJlU???Lnm?LXa?n@m?w@wlUlV?m?blw?V??lL???㊣@?lVnUlxnkma@m?k?J@kXV?U@mn@??VXU?V?lLnmVb?aV?nWV??Ul∼???In??U@kk?mKk???k?@?m?k??@車?l?@?Vykkl?Uml???@w'],
                    'encodeOffsets': [[
                            111229,
                            36383
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6204',
                'properties': {
                    'name': '啞窅庈',
                    'cp': [
                        104.8645,
                        36.5076
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VKU??l@??豕∼?n??Lnx????V?kx@l???∼?車???????@?x?a?xlw?V?a@??a???Jk?l?nU?@∼???@y?wl?lIX???nw@??Wla??lL@?Uw?ak?l?@???mwna∼J??V?nUV???m??車WaU??@車?U?V??kkW@??xV@X?lK@wX@Vmm_@w???KU??wVw?K?V?k?J???XkWVa?Im??Uk??lV???V∼mx車?k?@?車?Wx??U@Ub?z?J?k?@??nVl??@k??x??@?WL???K@a?Imm?@?IUa?@??U??那U∟??V??x??V????lk@Wb??UbkWV_?y?L?a車?k?@b@nmbkx?∼'],
                    'encodeOffsets': [[
                            106077,
                            37885
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6211',
                'properties': {
                    'name': '隅昹庈',
                    'cp': [
                        104.5569,
                        35.0848
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?a?V?wVJV_@??Llan?ll?????_?ln?Wa?k?xU??bmV@??∼l豕?nk∼l??`@nnL?@?l?I?yVaV@??Xw??@?l???nwU???U??kl?∼Vn??JUblX?W???I?l∼U??V???@aVVVmnL@?l??UUw?mk????bV?VUVw????la?????mk??LUy?L@?WlkKW_XaW??m???U@a?k???akXkmVwm??V?U?b?W?車n?mwnWW??K?nV??????_k?lW?bU??V∼a?bnaVwma身In?mwkK@kmLUw?@?`?k?@?w?b@m?????`U??KUbmUUk?xmm?@????nUV?k_?@?????V?豕?b?a?n?@@??JV?∼?n?U??∼?bXxWl?那?x???a?bW`?zV∼??@lmb?x@bmV?b?I?`??@?UVUI@??L@b??@???@??lmxnL?∼UL???????∼kLU??L?∼?xV??n?KV?l@?zX@'],
                    'encodeOffsets': [[
                            106122,
                            36794
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6205',
                'properties': {
                    'name': '毞阨庈',
                    'cp': [
                        105.6445,
                        34.6289
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Uy??V?VUnn@?VU?`Ublz?Jnk?@Vb?KU?∼l?w???W∼?nkV??U?l??∼V@?n??V?kl?kU?㊣U???n???lw?UkwmKU?lmkUmnkym@??@U?mW??U∼l∼an?lJ?kUKlU???m@kmWV?kk?LUWUx㊣b??@?ma@????I?JUxn?m??K???a?V?U?∟車a?w?LmxU@??U??b?????lmwmnX?mJ@?V@UbVbkbl??@㊣那?l?I?l?@?lW?kn?J?km?k@???Jmb車a?b?UV∼?akXl??`????U??m?LX∟mXnxm????X?a?V?Un?UxlnlW?b???l@b?V???nX?WbX`lLXk@?∼KVz?Kl∟?n????kb????'],
                    'encodeOffsets': [[
                            108180,
                            35984
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6201',
                'properties': {
                    'name': '擘笣庈',
                    'cp': [
                        103.5901,
                        36.3043
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@lW?L????∼I?l??mbVb?Knb?Vlk?@Xb?U@?kn∼?XI????V??L???x?Ul????b∼K?zU`lXVa??Xal@?k??U?∼??wU???V??谷V????@Vb?J?@nn?J@b?L∼?XK@貝?車?wl??@k?mU??mK@m?_k?l??mk???@?nU?aV??w車lXbm??k?`???豕kkm?kb?K@?U`UI㊣x?U?bWlX?mbVb??車lk??IWJk??@?z?K???@?xUx車????LWb@?????㊣?U`nb??U?Vb?L???U'],
                        ['@@??lwna@m身??K?kW∟?@@V@b?n??VLU?∼k']
                    ],
                    'encodeOffsets': [
                        [[
                                105188,
                                37649
                            ]],
                        [[
                                106077,
                                37885
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6208',
                'properties': {
                    'name': 'す褸庈',
                    'cp': [
                        107.0728,
                        35.321
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@?LUx?xV∼?L??@xn`?@X?@n???wnJmwUx???aUk?w@V@w?aVmlLX?l@X??V?mV?∼@nl@UUUWK@w??VI??lm?@n???VV@n?J∼???U?m@k?V?nK???∟?K?bl?nKllVk?a?????車Vw@V?_?x?mn?VW?X???@Vbn@∼m@kn@@l?b@k?a?@?w?K@???@??UlKVa??WX?W??l??w@_∼?n@@_lK???W??@?mLUW?n???@?l?_?`???mm∼?bWb@??VWb?UU??K???a?lmk?U?l???L?l?Um?@??U?∟?k?VU?ml???X???x?kV??LUa?@ml?IkyVa?_UV@?mmUVU???VzUxUVU??a?∟l??nVx?Vk?@?mKUnUU@b??U???',
                        '@@@???@?mlk??k'
                    ],
                    'encodeOffsets': [
                        [
                            107877,
                            36338
                        ],
                        [
                            108439,
                            36265
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6229',
                'properties': {
                    'name': '還狦隙逜赻笥笣',
                    'cp': [
                        103.2715,
                        35.5737
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@???L?y?@l?XI?Jl??k??UanaW?XkW@?yk@U??L?mU??w???KV?lK????????VK??mKnw?k@???@???@a?K@?VJVU@????_Uy??@?UKmn@???車???Wm?X??k?VLmV?U?bm??V?wWlX?W??xkmmL??????㊣U@V????@???W∼X????yU?n?W?nX?xUx∼lV?XJl??V'],
                    'encodeOffsets': [[
                            105548,
                            37075
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6203',
                'properties': {
                    'name': '踢荻庈',
                    'cp': [
                        102.074,
                        38.5126
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????∼b?U∼?V??里??巡?n???身?迅a?????_k???V??????K??@???VaU??m@a身n??k@?x?_?Wk??@??㊣K??㊣a?n?@???x?@kw?lkw身L?wm`'],
                    'encodeOffsets': [[
                            103849,
                            38970
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6202',
                'properties': {
                    'name': '樁郥壽庈',
                    'cp': [
                        98.1738,
                        39.8035
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ll?x???l????kVVn?JVb巡V?k?V?a?bnaWw?UXmmamUXkWK身?Xm∼??????@UV?K???k???b'],
                    'encodeOffsets': [[
                            100182,
                            40664
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/guang_dong_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '4418',
                'properties': {
                    'name': 'ь堈庈',
                    'cp': [
                        112.9175,
                        24.3292
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l???k??aV???Va?U?????Ilx?mnb?U?xl??U?l∼k???Wl??@??VwUanUl@?xVk?aX??kU??a??㊣?@kka@?UwmUkw?Jk????㊣k@???L@??WUwV????x?U???X@m???@@y??VmUw????Un?lUnWU?`Uk?@@??x??@b?xX??VV??L??k??L???@V????ln?W?kV??kU??UK@??U@a??車??UU??@??k@Vx?KVb?n??@?????l?@x???bW?nlU?lx?lV??∼??@???@x??Wx???V???K∼?????n??k?@??m??K@??k@??@?n?V'],
                    'encodeOffsets': [[
                            115707,
                            25527
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4402',
                'properties': {
                    'name': '屻壽庈',
                    'cp': [
                        113.7964,
                        24.7028
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@W?Xk㊣?@?Uw?mUw?wlmn@?wn?m?kI????@??a?車n?nWWw??V`?@??nVml@x???IV??kUmkamUkVWw??m車??UV?Kmn@x?@kbmm?a?Xka?V?aUb??????l??IlxnVVx@?lb@l???∼?bV??lW??bUl?wk@mVVbUx車??@k??X???l車k?Vk??w?Vma?nkw?J?????VUb??U∼?bl?∼?k?@x?????∼@?∼???車a?VU?lUlbX?l@n??V??nKl?nIV?∼W??∼U@bnm@??IV??Ul?∼VnalzXyl_Vy??l??Llx??@??b?Km??knVWanw??Vw???@n_?V?aV??I?l@??K????VJ@a???@??@??km??aV??W@_?a?Kmbk?kLmw?@??'],
                    'encodeOffsets': [[
                            117147,
                            25549
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4408',
                'properties': {
                    'name': '梲蔬庈',
                    'cp': [
                        110.3577,
                        20.9894
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@?kX??@a?UU?lk?J?k??@wVJXUWk∼W@?nKnwlUl????blU@?lI?l@?XbW??xnm@?lW@w?wU??JX?VU∼`?車杗k??k?@?m???mw?a?V?xU???∼???n?m車X?????@∼??U?㊣?U∟?∼????n?U???V?@豕??@???U?l∟n??b?那V?∼??y?zVaV?nU?L?a?bVl?w?@'],
                    'encodeOffsets': [[
                            113040,
                            22416
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4414',
                'properties': {
                    'name': '繩笣庈',
                    'cp': [
                        116.1255,
                        24.1534
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??n??lW??x??@l?Vl?lLk豕?a@z?∟????UxlnUKUb?lU?lb@?Vx?V?klJ?wV??@?l???n?bk?????U??klm?L???L?W????nKUkVa∼V?x@IVV@x∼bUk?a?a@mV@??@y?w?L??UwVU?V???U?b?VVann?@Xw?????aVamkXa??@?nw@??UXa??kbWa?KUw@?m@kwmLU?UU?J@kmU@UUWU??@?y?anwm??l?????U??mKUm?wV?km?X?bW@XW?b?k?@㊣??w@?U@W??@????U?U@???IU??akJ???那?∼???Xkam?@??_?J∼?m?@X'],
                    'encodeOffsets': [[
                            118125,
                            24419
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4416',
                'properties': {
                    'name': '碩埭庈',
                    'cp': [
                        114.917,
                        23.9722
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼VlmX?la??lm?@???V????@??klyn?n?lW∼z?W??∼?Vb?V@l?bnn?J?kX??V?a???W@??UUw@?kaV??kVaVLkmVw??????@y?bl?kKk??U@k???wX??km???@Wn????I?`@?n?lb?W?????谷??lI@?XUmWUw?@@?UJU???mKUV@x???k???LW??nUx?K@?㊣?Vw?a??@∟WX@???@∟?I??WxX??@Wx?w??UnVb?豕mV?a㊣??UWl@?k?l??∟n???XxlUnVlbVn?lU??J車?@wnkmU???@U_?∟XxmXm∟???b@?????lJn?'],
                    'encodeOffsets': [[
                            117057,
                            25167
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4412',
                'properties': {
                    'name': '欷④庈',
                    'cp': [
                        112.1265,
                        23.5822
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l@???@V??V????@b?V@?VL??lV?車lUX?m?∼k??U?∼@???Kl???∼KU??UW??w@a???w@??@nm@w??k?VUVn?K??k???Vam?@nkKkb??ma?kmLU??Um??wmVU?mU?J???aUx?In`mb@??b@?nJ@nl?U?V?lVU??L?W???`?_?`m??I?b?W?z?x㊣J?x????U??_k@???J@Umb??X?lL??n?@??xlUX??xUb?L???UnV?wl?U??b@?lW?X??m???@?WxX??Unb'],
                    'encodeOffsets': [[
                            114627,
                            24818
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4413',
                'properties': {
                    'name': '需笣庈',
                    'cp': [
                        114.6204,
                        23.1647
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lb?W∼bnnla?@@wnm?LVUk?l?@?Xk?V?㊣?bnU??UaVm???xXw?@W?Xw???J@???@?XW@?∼??bUx??@??LVw?mX?∼K∼??l??@wVUnL??V?VIky㊣wk??KU????k???X????lwUwlm@m??nKWa???m???車?m?b?al?Uw?bmb@l??Vn??m??@V??bV?UnmakLm`@x?kklV?VJVn?lV?UnmJma?LUbl??zm?kL?a??身@@z??V?U?V?kJ?n?U@?VXU??L@?lJ?L@b?∟UnV??b@xVnlK??Vx∼V?xlI?lkVl?k∟@n'],
                    'encodeOffsets': [[
                            116776,
                            24492
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4409',
                'properties': {
                    'name': '簿靡庈',
                    'cp': [
                        111.0059,
                        22.0221
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?Ln?lk?Knk?L???Um??xlU?Jl車∼n@??an????a@??@X_@m?車車U@a?aU?mL????k?V???Vwkw@?V㊣??@???@??alw?㊣Vk@m??m??????I?`身??_UVW∼?IV??x@xkX@?mn?wX?Wa@??kkJ@?kV?a㊣?k?kVmxmL@??XXlWVUI@x???l?IklV??V@b??lW@?@nUxVb?lVxk?lx??n??y??nI???∼?aXwlK?bVn??Xb?L?∟?k?L?豕?VV????Il?VX?ynz∼KVx∼@Vl?LlblK??'],
                    'encodeOffsets': [[
                            113761,
                            23237
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4407',
                'properties': {
                    'name': '蔬藷庈',
                    'cp': [
                        112.6318,
                        22.1484
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lUXx∼JWnn??XV??W?X@???VLV?nU?Vnb???x?aXmW?XI??Ub∼xlK??l??K?xX?∼??X???@????U?????n車?Vma?x??U?U???@???@?@???UmU?㊣??K?x?_?J?k??車??nm豕k???Wx??mnU??∼@??@?x?Lk??aVnUxV???VlnIlbn??KX?'],
                    'encodeOffsets': [[
                            114852,
                            22928
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4417',
                'properties': {
                    'name': '栠蔬庈',
                    'cp': [
                        111.8298,
                        22.0715
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼?nKV∼?b@b?V??@n?Vl???Unlnn@lmkmVk?a?k????k??????KXkW??Lm?kamJUk??U?VwUm?bl??K?w?@@???V?nm??Xw??l??@kbW??a?@車L?l???@???Ln∼??@nUl??kx?b@???@?身∟U?@?lxUx??U∼l???'],
                    'encodeOffsets': [[
                            114053,
                            22782
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4453',
                'properties': {
                    'name': '堁腹庈',
                    'cp': [
                        111.7859,
                        22.8516
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@V?I??l@?`V?∼????w?I?w?y?X?a∼Jn?∼_?`?_∼??X?KV?kUU?V?k?@mmI@?∼a@?nam_?JVwl?X@??lU?車ma?UmVU∼UK??@??W?XU??Wm?Xm?IWwkVWl?L????l??????l?bUllnknm@kmVm車?k??UW`?@@??b??m??b@??mk??IkV?wn??V???Kml?Lklm??K???V?K∼??`n??∟n?U??bWl?xVx?LUx@∼nXm`V?klVxmnnx'],
                    'encodeOffsets': [[
                            114053,
                            23873
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4401',
                'properties': {
                    'name': '嫘笣庈',
                    'cp': [
                        113.5107,
                        23.2196
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??VxUn?∟@z?@??@n?W∼??V?w??U?Vx?X@??K??l@??Va?b?U@ml?k㊣lU?kkJ?w?UUw㊣?kLUm@w?aU?Vm??@a?KkI@??KV?UW@??V?mlIU㊣V?U???@y?z??????????n貝㊣m?@???l?∼@n??車?Ull@Xn?VU?mVV∼??V??J?n?b@∼mbn???@????wVw?@@nmxX∟?L@?VLU?m@@l'],
                    'encodeOffsets': [[
                            115673,
                            24019
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4415',
                'properties': {
                    'name': '囟帣庈',
                    'cp': [
                        115.5762,
                        23.0438
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@??@VxnXWV@??bV??J??V@??U??x??UWU??w?UU?WVUk??nkV`∼LV??w??nU@???lb???Vnal??@@?kU???a車??a?L??U?my??車@??車??w??XbmL??@nknVxkx?????W???l??V∼?Ll??xlz'],
                    'encodeOffsets': [[
                            118193,
                            23806
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4452',
                'properties': {
                    'name': '課栠庈',
                    'cp': [
                        116.1255,
                        23.313
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V??????@X∼V@@??x??∼@?l?aWXX@?a?WlnU??xVnnL??∼V??@k?m??l?@??ak?@mlk∼aX?㊣?nwm㊣???JV??@?wW??_m??a??V??U@m??U????Jl??a?bVn?l?Ll???㊣w?@?x車?@豕?@k?mb?U?∼ka??@?mV???xU??KU_ml??VlXUV??V?xV?VX?∟?wV???'],
                    'encodeOffsets': [[
                            118384,
                            24036
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4404',
                'properties': {
                    'name': '紩漆庈',
                    'cp': [
                        113.7305,
                        22.1155
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@?豕@??∼V?V??∼?wnb?U??n???@?nx?∟??llU∼Vn?J??∼U?谷??Ukl???VV?K?V∼?n??????y??m?kw?b???@?n???V??身????J@?',
                        '@@X??km豕VbnJ??'
                    ],
                    'encodeOffsets': [
                        [
                            115774,
                            22602
                        ],
                        [
                            116325,
                            22697
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '4406',
                'properties': {
                    'name': '痰刓庈',
                    'cp': [
                        112.8955,
                        23.1097
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?b???InVV?nU?xn??VV?nK?lnb??lalL@mn?Ub?∟l????LUmUVl??∟@xmnVl∼_XVVm?kVm??@kn@V?UK@?∼KW?nw@m?@Ux∼x∼?@㊣??m?na@??a?m?IU???U?nUV??UWmk@Vk???Ukn???W?????@???W??W??w?Lk∼??kL?wVa??WJX?Wn?b?wkV??W@k?'],
                    'encodeOffsets': [[
                            115088,
                            23316
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4451',
                'properties': {
                    'name': '陰笣庈',
                    'cp': [
                        116.7847,
                        23.8293
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼??kn豕mx?b?z?@V?VX@VnV@l?IVVV?nKlxn@@?Vx∼LXbla??Wb?V∼???W?@?nW@??aU?V??wW???@???U???車V@里??kUVm?IUw?VW?X????@W??bkl@nl??b@?k????n@l'],
                    'encodeOffsets': [[
                            119161,
                            24306
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4405',
                'properties': {
                    'name': '囟芛庈',
                    'cp': [
                        117.1692,
                        23.3405
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@U㊣∼I?㊣n?mx???@??W?X??UVx?JUnlV??@??U迅?V?n?Vy??Vm@?ka?U??車????K??X???Ww?k???@?w?K?kUm?a?bk??I??V?∼?@n?VU????bn??`X??x'],
                    'encodeOffsets': [[
                            119251,
                            24059
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4403',
                'properties': {
                    'name': '旮詀庈',
                    'cp': [
                        114.5435,
                        22.5439
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?L??@x?bV??V?K∼?X?∼K??Vw@anU?豕????lk?l@wn_lKnbVmU??aU??@n???Um???U?bk?@?kx?@?a?X?w?J???L??U??車??車那W?@b?nm???'],
                    'encodeOffsets': [[
                            116404,
                            23265
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4419',
                'properties': {
                    'name': '陲搛庈',
                    'cp': [
                        113.8953,
                        22.901
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@???blKn??yk?Va?KnbnIVmU??kUmUIU???????mV@bUx車??LW????L?UU??a@w???K?????????y'],
                    'encodeOffsets': [[
                            116573,
                            23670
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4420',
                'properties': {
                    'name': '笢刓庈',
                    'cp': [
                        113.4229,
                        22.478
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?X??lm?V∼?????@m??∼k?㊣?@@aX??V???IUmV?kk?㊣??mw@???m豕??m????豕V?'],
                    'encodeOffsets': [[
                            115887,
                            23209
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/guang_xi_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '4510',
                'properties': {
                    'name': '啃伎庈',
                    'cp': [
                        106.6003,
                        23.9227
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lklWXL@V?I?l@XnJn@VUUal?k@mK@kny@UlU@a∼???UU@VmaU@Ua@UWw?@?n@KmL?m@alk?mnI?m@an@VIUamW?ImwU@@a@K?X@JVL?UVmUaVkUa@m?@@Ulmkk∼?UaVUlKXbVwVIkaVmUk@KVk@a?aW??m@w??la?X@Kma?kVmnUl@nxVK?InU@yVaVIV@na∼KlxX@@_lmX??UV`VIV?V@??n@l??bn@@WUkValK@??yl@??VUV@@K∼L@KU@@UVaXIVVV@naVkVa@K@UUK@UUa?LWa?w@m@K@UV?V?@mV?UUVKnL?mVL?K?bVK@UUIk?mI@mUIVK@IUK@VkL?@WU@m?U@WmUk@?I@V?Jk@WwX_@amK@UUWkI???K@LVb?@mVmakL@J@bU@Ux@x?bmI@`?I?wm@UbmKUa?UWa?UkJWV@X?JUU?LUmV@ma@kkamK?w?LUUmWVkkm@aVUUkVKnVVUm?XK@UW@km@Ukkm@@W@U?kUy@I@aUUmb?∟U@kUmL@bmJU@Ua@wkLWWkL@U?@VaU@?LUakKWbkUWVkKkLVLUV@JVb?z@V???@?VmUU@kVmK?@V?U_?VWakVmIUKUaU@@bml@XU@@V@LmKUV??mVUK???K?bkaUX?KUL@x@V@l@?mxU??V@?lL@V@Ln@@VV@?nlKUaV@nLUbmJnL@VWLkbmV?@@L?W??XLlx?VVIVV@x@V?blUVm?LVU?K@kWWXUlV@Xl`?LX?l@@V???n@VnbV?@lV?UVU?Vb?@@`UXU`l@@XUVm@k?@xmVknUJVXUbmKULmb?x@VlJ@LVbkKUbVL?UUV?UVmU@VaUkUK?VUwmLkUUVVl?bka?Xmw?KU?VVU@@??V㊣Uk@VWUUm?XamU?b?Kk??`???U@UnWW_kKmbUVUVmnUV@?nJVUl?UbU@UV@n@JmI@VmbnVUXlx??kKmnVV@L@V?bkV?Umm?@Ub?Lml?U?L@VWLkmkLmmn?WmnKU_mW???bnbmx?@U?UJU?@Xmlk?@?mnUUm@@Jn@lV??VJnIVW?I@a???K@I@aVK?Il??nnl@nl`nb?X?l@xV?@llbVn??VVl@nn?V@IlW@Un@@kVa∼K?n?mVaV?XUlaV??U?Vlw?UlynIVa?an@lVXb?I?@n?la@K?_n?@b?x@XnJV?nKVz@`VXV?U`@b??UV@V?Ilx?UnV?K?X?b?Vll?bVbnVn@'],
                    'encodeOffsets': [[
                            109126,
                            25684
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4512',
                'properties': {
                    'name': '碩喀庈',
                    'cp': [
                        107.8638,
                        24.5819
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lLVl?bVV@nXVlI@JVX?m?n?W∼b?IVV@?ln?@nalVUb?nW?@?kVk?lbVKn?∼bU?lV?@?X@`nb?aUI@?∼wlU@aXJVI@aVK@wUamIXm?@XUV@@bV@Vm?Im?nUUwVaVKXU?nVK@ak?VwV@nL@UV`n@@X?lnIUJl@X??V@aUIVm@an?V@UwnL@VlbVL@KVVXUW??wUUVUka@UVJnUlbnalbVVn@∼??LV`?@?XVxV@@bVlUVVbXnWlXnml?@XXWVXJmbUI@V?llUVkn@@VWV@Vnb?@VXUJVnn`lLVk?a??lV?Lnw@WV@lInw@WnU@U@m?knUV車?K?wUmUXU?U@@wVJVIl@XKVVVbVI?J@Un@l?VLnm?b@U@Ul@nU?∼VUVJnnVJV@??@mVU@?@wkUVwkKWk?yUUkU@alk?@lJ@x?Il?@UUWVkUw@Kn@@kma?VUl?UUL???UUKl@UUmL@aXU@mlUUwmK?kUUVKVU?a?KU?nK@U@Vl@XUWU?KlwX@?b@K?@XkV@UwWJka@aUwmV@U?@@U@wUm@?kLWVkIW?XnmV@VkbmK?LUbk?Va@a?a?@@aVU@aVak?@?㊣UkVU?V?UU?JV?UI?@kxmUmWUb?L?w@K@aU@@aVU@??Kma@aka@_VWkk@UWVUKULWKULU?@KUn?wVaUK?xU@U?ma?L?m@kVmVa@Uk?mI@?@KmIkxU@@K?U@mmakI@V?LkmWkkJ?_U?@V@L@n?xXb?KVb@VVL@V@LUbUlmbU@UUWJUb@VV@@L?K@LU@UV??k@㊣z@?kLUbVl@Xm@?ak?m@??U@U?UJU_?VW?kn@`W@kw?LmbU@UJUb@zmV?JULmwk@mVUn?lnb@L?Wkb??@x∼nX??b@bUl@LVlUnlbUJUxWakLUVVb??llkn@V?@@nVbUlVbUn?VUK@I?W@L@bV@nx?JnXVbUJm@@b?nmJ?nkl@b?nnK@L?m?@Xx@VVbV@nb@UVV????@bkV@Vmz@lnLl@k?VbUVm@mI@W?k?J@UWKkXkl'],
                    'encodeOffsets': [[
                            109126,
                            25684
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4503',
                'properties': {
                    'name': '屢輿庈',
                    'cp': [
                        110.5554,
                        25.318
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nU@J?X@`XLm?Vb?`l?VXXW?@Vbl?nV??lanLnmVL?K@_Va??@kUa?@VmVb?aV@XVVzlVVK@knKVmX?VK?Llbn?@b@llL@x??XaV@∼?@∟?bn?V@@Wl_?V?U@W?nVamw?wVbn@?K?V?LX@VmV?UxlV@?nVV_nK@m?I@Wn@@I?U?@@wVWX@@I∼VVm@wmU@m@IU?V?k?lk?Ummk?V@@aV@@Wn_UKla@k?aV??lVanb@k?@@KlVn@@aV@nIWW?UUaVU@?kKmwU@UImKk@UU@w@W@???k?@?UkW?@mk_W@Ua@a???@???mV?@m?UUam@?kWak?Vama@UUm@?nw@alaUmnUlVlI?V???LVyk?Vm@k@UUJk??K@kmKUw?Kk?WK@UXImyVwnI@m??kUlkUKkUVm?w@kkJWU?m@_k@@a?aW@U?UJUwU@@IWKk?mUUV@nVl@bVb@bU?UX?akw@?WUkbkK?bm@?xUlkLm@@wmKUX@???UaVW?XVmU@@UUU?xkmWXkKkUWaUaUb?L@`UL@LV`UXmK@VmakLVbkL?xUJUIVbUVVb?K?V@Xnl@?lVXbm?nV@L@VWKkVUIWJkI??UamUUbm@U?kU@JUbW@X?WxUam@kbVVUnUJmUUV@b?U@UUV?@?Vk@?b?mULV?U@V?U`VLUL@xVbn@UJ@nWJXXV?VV@bkxVbUx?L??@x??@?U?lXUVVlULV@@?n?U??b@xl?nJVnlVknUlV?Ubm?U@?bV??x'],
                    'encodeOffsets': [[
                            112399,
                            26500
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4501',
                'properties': {
                    'name': '鰍譴庈',
                    'cp': [
                        108.479,
                        23.1152
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lKnbnU?@Ua@K?L??lJVX@VnL@bW`Xxl@?I@U?Jl@nV@X?V@nXV?@lK@UVL@JULVJ@nnJl?VJ@VUL?a?LUK?nmKULVVU?@nU??`lIXlln?K@UlJnb@n?V@LV@lwnJ@L@?nJl?@VUbUn@l?n?KnbV?V@?wVLUb?xVm@LV?VKXLVKVLXU@VllUX@`lb@bnb?L@?UV@bV@@b@L?x?KVanXV?UUmVUUUaVUky?UUa?ImK@mUUVUkKU_@W@UVVVIUW?UVaVU@UUKn?@k@al@ll@bnL@b?VUV?X@V?@@b?Knblmn@V_@aUalL@a@akK@kVKUKlwUUn?V?VmU_VWVIVaX@Va?al??K@LVJnalL@LnK?wlVUw?mX@VX??lLUVnblaUmVUVwXU@Wm?Va@??Knw@w?m?k???UVW?a@_mW@U@I?y?LVUUKW@@??LX@VUV@@yVU@UV@nwUUmJka@IU@?m?VkaW@UwUX@`?@kLWUk@m?kUUm@k?UUWkU?kWxk@@V?K@n?V@UVa?UUJmIkV?@UamLUbkVmamLka?@???kmL??WI@w?Jmw?x@akU@aUKmbkaW_nW@_U@Wm@a@wkwUKm?k@?bkb?w?@mKUkkU@J@bW@kVWz@b?VUa?VUx@?ULkJWbXVVX?`@?mJUVU@@Lk@WbU@UJlnXlm?Vx@Ln@?b@K?LX?WJU?UW@k?aUVUbmV@nnV@n@lVL?VmLX?mXkV㊣@kx?L??Ub?JWI?J@I?mXalkUamKk?kL㊣aVw?K?UU@m?nbWJX?m?@l?bmKULWUUVka?bnn@Vl@VV?V@V?bVbnLWLXJWxXLV@@VV?'],
                    'encodeOffsets': [[
                            109958,
                            23806
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4502',
                'properties': {
                    'name': '霞笣庈',
                    'cp': [
                        109.3799,
                        24.9774
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?wU??aV@n?VaU?VklmkUUmmIk?@w?aV?m?@?U@VKUkVUkWV?@???@w???KVwUalw@aUUU?WWXI@mVIm@Ua@wVKUKV_U?V@U?VK?n?al@?U?@VU@V?V@aVUnVVIVmUUlan@VbXwW?X@Va@IlVV?n@VanVVb??lJXIVJlUXL@U@KmUn?WakU@?mk?JUI@mk?@wUmmUV?@JXaWIXWmaUI?J?kk@W?nJ@??aUak@?kkJ@kUKU_?@myU?車WUkm?kUmL@KUKm@k_UmVa@?k@@UmU@mm_?JWIUVU?WLUl?bV?UJ?VUIVw?KUVk@mU@n@lUL@Km@@l@L?V?z?JmUU∟m@UbV?U`U@@?Vn@x@V?@@VnUVx@blbXIVxU@Wl?@@L?aW@kx?LXVWVk@@U@VmLV??L?bUVULVV?lnLVxkV@nWV@bnKVVk@VL?V??VK?VVk?Unb@lm@@LVxUlVX@Vk??J@wkI?@kl@blVVV?zXllLUxlV@x@?UV@n??U@UImmUIUV??mVk@@V@V?amnUKk?m@@V?IUJUaUUWLk@UJUI@xV@V?VWVn?x?LU?mVV?@VkVVVUnV@UVkL@VVV@bVxla@bkXVJVn?`nU@b?b@bVL@VnJ@?l@?V?aU@@_lW@UUU@Un?lll@XLl@@UX@∼bVWVanLlknVV@VVX@VV?nU?VLmbXJ@nllXX@`VX?lma?XVWk@Wk?w?J@?VL@J?bnU@bn@@bVKUnVJVIVVVL?a@bV@@Vl@nUVakalm??UL@VUL@V?a@mX?l@nK@UlK?L@Vl@@nkllb@??Vnn@??nV??V∼l??VInwlKXxlU∼?n@@??I@UnVlak?UJWkUK@anUWK@_?J@U'],
                    'encodeOffsets': [[
                            112399,
                            26500
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4514',
                'properties': {
                    'name': '喟酘庈',
                    'cp': [
                        107.3364,
                        22.4725
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@JVz?l@V@Xn@ll@VlnX@@VWLn?UVmUULVlUV@blnUlnXVV?K?xnLlb@lnbU@Vn∼KVV?I@WXUlI∼VXb?VVbnLVan@?x?J@_nJ?a@wVwV@@a@IU?@UU@WKXwWIXKmKUa?a@U?UUUk@@Umm?albVUXVVKnL?a@kn?W?XIman?V@?V?LUx?blKl?nLVbklWb?n@J?IXJ?IVa???Klw?@lUnWW?nK?UUK@k@mmU@mnUVaVU?b@lVXV?XIW??K@L?am@@KUwn?WkkmVIV@Xal@@KV@VUnI@??_UWWUkam@kkm@ka@m?k@wkJWIU?U@WXkW?XkWWLUU?@UakL?W?XV㊣VIVWUU@anUWaUK@IU@Vak@@UUKWa??@m@ak@@wUkla@mUaUklakwV???@WWUkLkKma??kLUnV`UxWX@Jkn@bml?akkk@?b@l?bm??b?J?b@VXn?bVV@??b?JUkkKWVU@m??VUUW@UVUJWXkVkKm?UL@WW@U?Vl@XXKW?XJ@XVlmbUxnnm@UlVnV@XVm?VJ?b@?mLkK?bXblVkn@l@bWnX`V@@IVV@?V?V∼n@@_na?VVbUVVbUJnzlVUl?XkV@Vlx@X?Vnx?b?KUK@b??VVUV?L'],
                    'encodeOffsets': [[
                            109227,
                            23440
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4513',
                'properties': {
                    'name': '懂梅庈',
                    'cp': [
                        109.7095,
                        23.8403
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nVlw?@VJU??IVVU?V∼lU?V@?l∟Ub@bUV@b?@?b@bUbl?Va?KnLla@UnUWmX?lJXUlKV@V_U㊣Van@V?nV?I?y?U@K@kn@@LVK@k@mnVl@VU?LUxVJ?UVIU??aVkXKV?VUXJ?In`@nnV@Vl@@?UbVnl`n@VL@LnKlVn?Vl?XV?nz?@V`VL@llI?ll@Vb?b@?mIX?l@?l?IVJnbWXXJWb@IU?nVVn@xl?@nVJ?I@W?U∼LUaVUUaVJVI?wlKUalKnb@UnLVWU_@KVK@_?KVa?@VKU?VLVKn@la?aUkU@maVU?J@k?@Um@XmbkyVaUIUU@KV@laVn@KXKWUkUk@?aW?UUVw@aXKm?VaUUk?mI?lUU@wUa?xUmmU???U@W?LU??mVIUym@U?VmUa@wmw@??m@aWLU??JUIUamKmL@??a?x???kU?U@㊣?k?UVmKU_mJUbkKm??L???_@WWUXUmaVUkK??UWW@?nVxkU?xmL@KkKmbUI@K?Lk??bUbW@UbUJUXV`UnU?m?VVkxVLUL@llL@b@bkKVb@bU`m@knma?L@a?@@U?WVU?U@amK@akkk@@b@lm?VL@VUVUb?VVXUJUU@V@XV`lLUVVV@nnL?JVb?VlzUVVbVVnUVVU?'],
                    'encodeOffsets': [[
                            111083,
                            24599
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4509',
                'properties': {
                    'name': '迶輿庈',
                    'cp': [
                        110.2148,
                        22.3792
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VJUXVVXlWX@V?xVnX@@`??ULW?UX?bWK@mULUUmJ@n?b@l@VULVx?x?XU`VXXJVI?V@nm`@nU?VXn@lWVn@b@Jn@nU@Lm`@Xn@WJ??U@@VnL?lV@@Xl`nIlJnkVL?w@KVK@U?aVL@bVKX?lUUKVK@I?V?L?a@U@W?LUlVL@bU@@blb@VlbUxVbXUVJ@xVL?U?lV@VU?bVLnKl?XJ@L?b@an@VanL@`VL?KV_UWl@U_?a@WVInlVUUUVm@I@W@wVakIWm@U@?XwlaVbnI@?m?Va@aXaVL?U??@aVa@k?KkL@KmU@W?zUK@wU@VWUUVUUKUa@?mKmbUK@_nWVaUkVaUaVUVLXKV?VUVmVI@UkKkLm`UkW@Uw?WW_??UaU@WakXmK@xUX?Jk?UUWUk@Wl??mJ@km@@aUK?zmyVk?a@kkWVUU?lmU@@w?kkmV@Vk@m?I??Uk?a?@Ub?@m@UUU`m?UbWa?Wmb?X??XKWIXUWm@???@y@UkIUJUUWLUW?L@UkVUxW@kaWb?KWnXxW?n?m`XLVlUbVbUx?I@JmLUKUb@VW@@bkL@b@VlU@xk?@L@l?xXxWXX∼V@VVVbUVV@UVVbULVnVJUb?b?aUb@VVVVInlV@VnXaVU??lI?VUb'],
                    'encodeOffsets': [[
                            112478,
                            22872
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4504',
                'properties': {
                    'name': '挀笣庈',
                    'cp': [
                        110.9949,
                        23.5052
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VbXblVlLXWln?wVV@VV@Un?WUXVb??@?VWXa@kVK??UaVaVk?UlyX@Va??VmUwUaVU@U?ymI@aU?∼@??nWV@VaVa?w@IV@VmnLVK@kmmna@???VbVI@aV@XbW`U??LUVVx?@VbUV@bl@VLXblJn?lL?∼∼@n?@K@UlLnK?a∼LWbnJ??U?V?UllLlVnKnbWnn?V`?w?@@?Xa㊣?n?l@XKV_?WVkVa@kVyUa@wU?UW@?UIVW?@@a?wWaX_WKkVmUULmak@UJUI@㊣m???k@m?VyUIm?nmmwnkUmVaVIU?n_mW@?Vk?@VwkmmUXa@I?aV?m???m?@Wm_U@??mIUW車LmUk@laXmmkUK@UmKULUUmWUL?@VakU?@Ub@b???VUKWb@bUbn?@?mJUakbWx@?@VXnlJUb@x@X@JUnVVUVmkUJ@X?bV`k@VXU`?LUK@_mKUbm@@b@?U`@nlV@b?UnbVbn@@`VbUbVV?bm@@?mJXb@bVnUllVXUlbUl@LU?VVm?kLVb@b?l@V@XlK@V@nUJUz?∼m??wmLmlXbWVU@UUUl?IU@VVmV?@@??bXbWxX?WlXVWL@LUmkbU@@LVVVJUblzna@WVn?@@l?IUVnbV@Vl?bkbm@ULUKV∼UL?@'],
                    'encodeOffsets': [[
                            112973,
                            24863
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4511',
                'properties': {
                    'name': '種笣庈',
                    'cp': [
                        111.3135,
                        24.4006
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nL@xn@lKVk?wn@?alLlaXV@?lx?bVWV?@aUa@aUk@mVUnVl?XL@JV@VxVIV?X@?b@bl@@`?nXVlI@l?xUnlVVLkllV??@nmJUxnzWJ@VXLl??LVxnL@l?Ll?VI@V@lUnl∟Uz?K??@?Vl@??L?l?Ln??b@VnVVU@k?a?Knxn@VkVJ@??UlakmWIUaVanm@_UK@UVWUa@kl?Xam?U@Vm??VIXW?@lUVknVlKVLX?VX?W@b@Vl?nnVL@KXL?Kn@lb@UnW∼@Va?X?WVb∼aVa@I?aUkUaVKVw?aXk@a?a??@wkm@alanUVw@alK@?Umkw@U?aUmU@WXUaUK@UW@Ua?VWI@?Xa@w@?WW??V?Xw??U@mKUXUWVU@a?kl?@akU@UULmK?VUVW@U_m`U@@xVbUz@lUbUl?XU`WLk@m???Wb@??@?xU_m?XmmamLkUkKVkU?V???mIXa?K?bmLkK@V@Lm??@??kKm?kIWaUKk@@aVUUa?@UwVU?KV?X_WaU@@bUJUa??@?mbnn@lULmKUnU@@J?xUbUbU@mX???@V?@bnJ?z@VUVVbVxUn??UbW@kz?VUlUbVb??UL@lWb'],
                    'encodeOffsets': [[
                            113220,
                            24947
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4507',
                'properties': {
                    'name': 'м笣庈',
                    'cp': [
                        109.0283,
                        22.0935
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@IlVVlnL?@?xla?al@n?VLlx@x@bXnV@@`mXX`lbnaVL@blV@b?wnx?I@xXJ∼?nK?l???@lbnKnblUVanKVb?@lUnJVI?VUb@V?U@m?L@Ul@Xw?llVVX?V@lVnlVn?l@XVlK?@@_VWVxX@lb?U?nV@@JlbnIlmnVV@UwVK@U@k∼a@mnIVVVK@nXL?aVWX?VK??@_W@Um?w@UXWWkUUVWUIVa?UkJ??UVWbUmU@mkUJUU@UVa?b㊣aVaUIUmVKUaVUU@VUUaUUU@W?XWWw?w@k@Kl?@wkV@U@alK@aX@@UmIUWUI?@mmkXU`U_WJUnUJmUk@@amLU@UVW@UkU@@V?bUWVUk@@wmKkUWLUW?X@JmI?lUkkKWKkLWU?@UKWa@bU@@a@_UKW??UUUmJmw@?n?V_@??K車LmbU?V?@xUX?@Um@wklVnUn?lkaUV@?lV??WVklWXXbWlkVkIm`UU?L?UU@UW?x@XU@@lWLU@kbUbV`UXllUV@bmb@LnKVbULm???nVVIV`X@'],
                    'encodeOffsets': [[
                            110881,
                            22742
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4508',
                'properties': {
                    'name': '幛誠庈',
                    'cp': [
                        109.9402,
                        23.3459
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n@VzUJ?nV??K@X?V?∼nVVn?wVb@xVV?knJl?VVUbn?WL@bUxVVX??bl@lVXkW?XwWa?a@??@nUUUV@?JVkVVV@XUWanknK?xn???VyVI@m@UkL@W@U?k@aUalKn?UUV?@KVkkaWVkUVkUm@aWanI@?n@∼aUUVaUa@_m@Uama?V@akU@mV_@??a@KWIk?mLUK?aUVU@?k?VUK@wUIWVUaVwka@Uka@aV@@aUKVk?K@X@V?b?K?U@JULVLkVW?UL@aUK?b@VUL@L?xUKmlkImJk_@WU@?kmK@UV@??XIm@@Wn_@KmVm@@I@aUmkXm@UWV?@mn_@m?UUJWIUWV_?W?wU@mUknVVmxU@@VUV@zU@UVW@?K@?X@VLUV?K?z@J@VnX@`㊣bUX?V???l?n@xmx?L@?Ubn∼@XWVUxUVVnkbWVXV@X?`???Kn?lLVanIV`nLVUl???V@V??l∼??w?b@?nKnLVbVJ?IV?XK@b?n@豕nx@xVbUnV?'],
                    'encodeOffsets': [[
                            112568,
                            24255
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4506',
                'properties': {
                    'name': '滅傑誠庈',
                    'cp': [
                        108.0505,
                        21.9287
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XV@X∼∼U?lxkbVlVb@nkbVl@xl@@b@n??XbVL@Vl@UbV@@JVLXbmV@bVVUXUJU??W?XlKVb?@VVXKlX?WlXXWV@V?XJlI@x?l@nlbn@lln@lbXalIVK@?Vw?UVb?U@aXylUX@@aW@U_UJmU??n?VKUamL@Kna@aVUkkVWU_ValaV@XK@kV@@W?wVXV@?V?KVVn_lJlUXkWaXWlkXU?㊣kU@?VUlb?kVmUmlk?????W?@mb@?VxULm?kJUU@?ma?w?mkX@V車J㊣bUVUX?Wk??lWXXl?xUa?b?I???@U@mVUKkkm@UJm@XnWV@x'],
                    'encodeOffsets': [[
                            110070,
                            22174
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4505',
                'properties': {
                    'name': '控漆庈',
                    'cp': [
                        109.314,
                        21.6211
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VaVLnK@I?JVwUaVaUkWKn_m?X?WwXm?LXalbU?UyV???@??wm@?∼?l?L?U?mk?mw?a?L?UUm@???V_??@?U??U?V????U∼W???VbXb?x@b@bmV?@???U?@@?U`m?@?nxnIVV?VX?VL@`@bV@@aXbVL?@XVlKXLlLVl?knJ@I?WVXXKlVnL@xl@UVVX?a@UV@VlX@VUV@nK@bl@nVVIVmXIV`V_lWnn?@VJVXnJ'],
                    'encodeOffsets': [[
                            112242,
                            22444
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/gui_zhou_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '5203',
                'properties': {
                    'name': '郩砱庈',
                    'cp': [
                        106.908,
                        28.1744
                    ],
                    'childNum': 14
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@@UnUlJn??w?JU∼VL@bnV?U?wlJ@X??XVlU@klVUJknl?UllL@bUJ@xULUl??UblVkblbnw?UXmla@??wV@VK@L@UXaVKVLXW?UVa@U@Im@@W@?UKUakKWIXU@al@@llUnL@W@Un@@VlUV@VIUanKl@Xb@lmxVb@b∼b?b@nlJVVn?nJ@b@L?V@ln?@LmV@V?x@blnVK?nlJXIlw?J@??b@nlK@Un@UL@VVVVUUUVK?l?@VUVL?J@UVUUw?@Wm@??UV??VlbUb@J?Ll?X@@x???Lm?k@@nlx@bUJUzVJ?@@LVxUV@bWxnLnVVK@_?K?xVbV@n?@aVI@b?@l@Va?Knb@n?`n??mm??W@?U_?wV@VlVV@Vn@n??@nI@Jn@∼?VaUU@??mV?VWVaU??U@aVKn?VbV?UmmU@a@kUw?m@aUUmUUJ??lakU?aXaWUUaV?kk?am?kmUnVlUL?VlJ@XU@UJWUUw?k@aU@WbkW?L@U@WU@@XUKmV@aU?VwU?UJUamUUVU?m?nIVJ@kl@XalJVn@KVL??@UWIXWmU@mV?UKnUWLUKUaWUUKVU@U@anUny@UlUkK@w@a@aVU??UkVw@Wmk?J??mUUVmwXalLXWWUnam@Xk?J@UVU@U@W?@@U@I@Wl@?nlw@KXLWb?lVUkalKUU?VVaV@@wnIlaUmkU?KWU@KkUkLWa?KU?UWUn@V?K@LnnWJUI?VkUWVnV@V?@@X?K@VUIUJ@IWJkX@VVJ?I?VkK@I@UVaUWk@m?@wnUWKk@mxk@@?lV@b?xmb@x@V?UmLkU?J@nVV@b@VkLVbU`?I?l@?U_UW@UU@???K?wm@?x?L??kI????@bkb?@Ua@??m@kkW@XVbmV@?kV@bWbUbV@???xXlmVk@???bkaWL@KUImK@wUK@VUI?b@bmK@L?y@akXW@kbWlXblL@?ULUb?`@U?kUymX?@m?UJU?UJ?L@Lm@@W?X@lU?Vl?Xll?@l@?k∼V∼??X@VU@UVll@XUJVXUVm@@VXLWlnV@X??k@mVULnxV@@bm?kL@VWLUbU@UVm@?b?@??UnmJ@UUV?kkJU?l?U`UIW@?∼kLUlUI@WVI?U@mWKkXk@??WU@bX?W?@J@x?X@l@LVl@x?LVxXX@x?KnxVknb?KVV@U?L?WlXU`@nUl?X@llVX?VU?KlkUKlI@anKVLXKVaUIVWV_VK@VnLlU??VKVL?m'],
                        ['@@@KlKkUUVVX']
                    ],
                    'encodeOffsets': [
                        [[
                                108799,
                                29239
                            ]],
                        [[
                                110532,
                                27822
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '5226',
                'properties': {
                    'name': 'ン陲鰍醮逜雇逜赻笥笣',
                    'cp': [
                        108.4241,
                        26.4166
                    ],
                    'childNum': 17
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        [
                            '@@VV@XkV@bUbWJU?Vb@Vnb@b??@J@b?L@LV@UV?lUI@a?KULVb@bkJmx??lLVxknVJk??xnKmnnL@bn`WIXlWLU@UxVbUVmKV?XI@JVIVJ@U?L@W?@@UmUXUlV?UVJXImm@K?L@UVmVXV??LXblKlV@LXV?LlVVnkbmJ@xnXl@?bXa?@Vana???L?m?VnIl???∼k@b?@@lV?nJlUn??VX_?@lVlK???V?UUxVLVWVIXJ?UlnnWlI@KUaUUVKn@VaVXV@na@?mw?@mUkJUamI@lk@@am@@I??UmVImUU??w??@anUVaUU@LU@Wa?WUXWW?wV@VwnU@L@ynbl@@X@a?J@nW@@Vn@?lVLlxnI?l?@@UWKU?nIlJXIVllIVV??XK@aVI?V?@@bn@VKXLVKVVVInw?J@UWI@mX@WKnI@KmU?UVJUL@V?KW@@k??@aU@@W@InJWUXwWI@W?@?wkaVaUIl@n?ValIXWWI@UUm@anwWkXWWIUbk@UJmIUamKVUUU?VVama?VkIV?VUlKnXVwX@@WVaUUVa@Il??aVm?kna?wk?UU@?U@mUV??UVw?l∼LVbnJVU??la@mX@@UWKXU@aV_V@@JlkU??@V?nK@km??k?U@?WU?W@?mm?U@?kmlU@wkL@W?UkL@VmL?J@b@V@bknUUVK@UVKUK@Uk@Wa@LUVVnUbmVk@@UU@@a?V?K@U@UU@WmUL@aU@WV?w@??I?xXll@UX?K@KXXVJna@wWa??naUKV??m@UU@mUma?lm@@XkVm@?U@V?LmWU@kkWxU@@bVV@VkXVl?V?@UUk@@?mI@KUw?m@UmV?UUwU@lwkV@IUa@mUaVIVKVa@w@U@?UJkb@n@bmJ@Xml?VUxWXkJmUkUUVW??xUlU@?aULU?mbU@@?WXkm?L@xUV@nUx?m@?XLWbnl?nV?nnUV??U?nVVz?@lbUVVlULVb@V@nUJkwm@Ux@bWbUK@UULka?J?b?U?U@U@lUK@XUJmn?J@bU@UwWa?x@zkJWnUJUUV?VV@bXn@xVb@J?L?m@X?w@`@bkb@VmXUV?L@mW@@n@V@??L@K?IW@@a?aUx?@U?m@XbW@@L?V@bnVWVkKUzlV@b?a@lnI@VV@@LnVVKUaV_VJVbnU@bn@??nX@yVIVxXKVLlUVaXU∼J',
                            '@@@KlKkUUVVX'
                        ],
                        ['@@UUVUkUmV@ln@VXVK@K']
                    ],
                    'encodeOffsets': [
                        [
                            [
                                110318,
                                27214
                            ],
                            [
                                110532,
                                27822
                            ]
                        ],
                        [[
                                112219,
                                27394
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '5224',
                'properties': {
                    'name': '救誹華⑹',
                    'cp': [
                        105.1611,
                        27.0648
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@UkV?@k?W@Xn@@K?KVIV?VIn?∼@nWVz?l@V?_VaVK@?kKWaXklaX@lW@b?z@KnL@a?aVJ@UVL@xnLVJ@LXKlb?a??l@nUWk?w??U@VaXa@amLkU?Km??k?mkIUa?KUIW?kKm?@anw@mlwXI?m?Uk?@a@amU?`k?kKWVkxmUUak_mJmw@w?mXUW?X??_@WnI@aVwkWW???U@WLkU?aUbVV@lUVVnm@kUmV??kK?L?wmV?UUaWV?a?aWw?w??@VULUVUU?K@nWJkI?l@Umxnbm@kbUJ?a?bUbVxmLUV?aU?@VUUWxkVVV@bUV@XWbnlUb?bUJlbUV?b@z?`WbXnmb?a?wUwVW?U?bUxmbU@Uam???@?V?k?V??a?wVaU?WI@mUK車z@lUl?@WI?b@xXxml@XklULWKU?mwUa?KUXWJkaULmKkLWbkKUV?Im???Wa@kUaUL?W?L?K?@kb?L@b?x@J@bmnnlU?lzU`U@@U?b@?m?n?∼bU?Vx@bkVm?mx?@mk?mVV@bkxVn?aVV@bU@mL@b?`lIVV@lXLl??bVxn@@bl@XllIV?nbV?n∼∼wlbXw@mVa∼?lVnU@m??VLVbn@@b?@@WVnUV@Xlxn`VznJVb@L@bV`V@?Unw?U?@WUXKV@UUlmUUlaXalL?m?b?IVbnJVIlVVaUUnWVXn?VL?k@?nWnblnlb?x?xVKVXlVXLVW?LlUVJna@wVL??@JVX@`@nnx@nWJU@Vx@XXK??UblxU??∼?LVKVVlL@KnbVUnJ?IlU??nKl?VW?x?IlJ@n?V?UVVnb?VX@V_∼lnK',
                        '@@@UmWUwkU@Um@@VkL@V@???V?VkV@nbVa@?'
                    ],
                    'encodeOffsets': [
                        [
                            108552,
                            28412
                        ],
                        [
                            107213,
                            27445
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '5227',
                'properties': {
                    'name': 'ン鰍票甡逜醮逜赻笥笣',
                    'cp': [
                        107.2485,
                        25.8398
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?V@I?alK@UV@@KUaVIVV?LlaVbVWnX@?@LnUlxl@naVLXVVaVU?J@?lUUanWWI?@VlV@Xb?b@V?n@VmVVbk@kU@V?V@X?J@zn`ULW@kK@_WVUK@LUb@Jlxn@nnWlU@@b?x@XVVU@UbVb?@n`VI@VVLUlUIUV@KmL@VV@XIV@@lVLVmXV?@WLXLW@U`?nkb@Vl@UL@VVV?L?llX@`lIXb?J?IXW?L?aVL@?XXW????b@bmK@L@∼@Vnxmx?n?K@xVn@VkL@V?L?akbl`VnnxVnUl??V@@VVXV`@??k∼JV_UalK@U@aUU@m?IlVnK?V@U@wna?w@akU@?l@nwl@XLmV@xn?l@VXUb@V@JlL?U?JUI@UlWU?nLVUUaVwV@XKWkXJm_@amKnmmL?wl?UIlmUwkK??nwlI@aUaVK?L@bVJ?kVUU@@K?K@a@I??@ama@UUaV?XIVa@alU@WUU?IWVUbkVUKWLUwUJ@zmW??m@@amVUaUIU`VbULmU@KU@@UmJ@k?b@akUVylLXUmU@a?U@KX@Wan@V?∼@Vw?b@bX@?J@L?K@?@U@mX@@n∼KVUnW@Ula@a@_?x@W?n?K@IUa@wWm@aUUU?VVVIXmlI@y?wXbVxV@@a?InmVI@WVL@k@V?V?V?a?IlbVK@VVLXa@aVwn@lxVI@m@UUaVKUkVUka?@UymUV???VUmmU??mmkXaWK@??nVw@mVU@w?KlnXW@?V@naV?VKUk@KVIUW?@mk@KXU@Um@@l?V?k@UVJna@UWa?L@a@?Xa@kmmVUUk@mkk?amJ?ImJUUmI?m㊣aUUkambkamVUU@VlbUbVV?xX?WVUU@VUakU@UmUV?U@mnUVVnUbVJ@b?UW?kLVamV?kUaWJU_UVWKk@@nl?UVVJUX?m@Vm@UnVlmbn?mJUbULU@@UUKWV?IWxnJVb@xUL@bUJWIkx?bkb@xVJ?bmU@k?W㊣LkKUkVa@a?am?ULkal?lKXUW?X??aVakImV?@ka@?UU?J?a?X?mmb?KWU@wUU?aUa?KmU@UXlWb??WLUKUb∼?UlVbkbVL@V???J@nVlUbUXmJ@VX@lbUbU@@bWb@VnLVJ@bVVUz??VL@lnL@b?VVVULmKUk?Jkbm@?xVb@V?k?KVnnV@b@?WXU??nV?l??VVXVJUXlVXbWV@VU@Ubk@@KWbUUmL@JnXV∼XJ@_?`UbkXVVl?kb?@VLXVV@?V@k?KXX@`V@@n'],
                    'encodeOffsets': [[
                            108912,
                            26905
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5222',
                'properties': {
                    'name': '肣�妗媋�',
                    'cp': [
                        108.6218,
                        28.0096
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼a@a?bVUlU@aVKnVV??VU?lyX?lWVa@?U?V?nUVU@m??@mU?l@?m?w?@?xnIVbna@KVI?J@k?wV??UX?VkVW@kkKWU@aXUWmnIVa∼VXbmL@VVbnVVVUb??Vb?JVbVKXkVKVanU@aW?nWU?Wa@U??nk@mVIVK@wXxlLXbVJV?lK?bl@VI@m?aXalVV?VbX@@a?alnkx@b@V?b@Vnx@bVVUXn∟WXn@Vl@Vlzn@?`@I@KUU@?V?nam?VkXa@aVK?nnU@anVlK?a@UUU@amk@?k?U?@a??VWnkWmkImU@akaVm@?VUV@UKnkW?XWlkUKnIWa?@nmlIXmWUnwUwWm@wULmaUJkIUa?aWa?klwkwmJmU@bkJ@XUJ??W@XbWbUKUkWJUUVKnn@UmmXUWa@mU@@U?I@WmXVykwm@kaULWwU@??lKUUVU@mU@UkmaUbmV@b???xV?nVUJVn??@Jn@@bl@@knJVblInV∼@nx@?mbU@UWUbm@ULVVVb@LkJmXkm?VWIUJUXUKVw?V?U??kLkU?@W`?Um?kVmIU?@k?@@a?l??k?mJ?U?n?K??mbUb?@Wb?ak@mWU@Ub?UVVkLlbUV?kXaWK@Lkx?mk@@X@J@V?@@X@VUV@V?IWln@mbXVWXkKWbnxVUnV???Inl@XUxVl??UV@b@b@xlLkV@VmzmV@b@VUVVLXVVbVLXKmVVLU?@nnVWXXJ@V??UK@LUmkIWbk@@lUImJn?V?VUnVVbVIV?UxV?@bnUVL@WV@@X@V?KlXXaV@@b?lVxXVVIV@@WkI?UVKUkVmlnn??bllU?VbXVWb?blVkb∼?VInVVV@b?nVx@l@bnVVnU?Uam?UL@b?VV?UbUXU??n@?VVUb'],
                    'encodeOffsets': [[
                            110667,
                            29785
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5223',
                'properties': {
                    'name': 'ン昹鰍票甡逜醮逜赻笥笣',
                    'cp': [
                        105.5347,
                        25.3949
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VL@Vl@@IXW@kVUVbnW@XlKVVnU?VlL@b?aVb?b@xX?∼?UxV@kbm@VxkxWJ??V???@?n?VK?xW?XJmV@n??@xVbn@@blLk`VX@b??la?JVUlnn@U㊣lw@wnw@mlwVIX@@m@klKnk?a?KnwmmXk??Vm?U??l@nb∼?n@?aVwVmVIV?nI@a??@m?U∼?l@@VnI@JV@UV@b@IUbVJmX???zllUbVa@aXUl@?U@llLnKVaUa@UmK@U?wV??bnKV@VwVK@UX?V@Vbn@?w@U?WnX?@?a@m?I??@UUKlaUaVk??VaVLXK??XaWk?m?k?wmW?@mI?Vkw?JUI??VwU?UkVKk?m@UkmU@W?wm??V??m∟?IkJWa?_?lUbmJ?z?Jk??U?VU???@bU??n?m?LUb@`mL@VkL@V?Ummk@UU㊣?Umka@kU?@??ymUkk@mmk?mUaUakImV@V@V?L???JUXmJX?Wb@n∼??x??nV@LlbU?UbmL?@?bV∟nbVx@bUVlblI??@KVVUnVJUn@VlLUlmLUUUxmK@I?@@VW@@bU@UJmUkLVVUl@b@V'],
                    'encodeOffsets': [[
                            107157,
                            25965
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5202',
                'properties': {
                    'name': '鞠攫阨庈',
                    'cp': [
                        104.7546,
                        26.0925
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?yVL@nXJV?Ub?x?bU?l?U?@???n?VbV@naVw?a?VUXVx?x?bnaWmXa?_@y∼aVUkaVI?aVamkXa@WVU@aUUlUXwVV@UV??bVUnKUwVa∼a?bVIlan@manw@V?klJXI@m?LVVVUVK@U???k@KUa@UkaVU@UVWV_XWVXVWlLXKlLXa?K?wVL@akKm@Uw?@@XUVk@V?UI@wWK@aUV?I@UkK@?mL?W?@kImJ?U?VmkXUW@UJkx@nmx@xkxV?m@kmUV㊣Ikb??@aUWl_kK@am@Ua@w??@mnUWIX??wULm?@???U???XIlwUwn@laU@Vw??W?@w?aUa?b@akK?UmVUUkL@WmXUaUV@lWX@Jk@@UUKULmLUJmzkKmVX∼V?UnWKUL???L@mU@UnVJ@b@?UV@X?`m_@l?@@bmbXJmnn?@∼?wnn@?VLX@V?@nVl@nk@@b?l@nn∼WlXzW`XXVKnUlxVbUb@?V?Xb@???Vx?bVlnbmn@?kVUL@???mLUVVL'],
                        ['@@@?@UmWUwkU@Um@@VkL@V@???@?V@VkV@nbVa']
                    ],
                    'encodeOffsets': [
                        [[
                                107089,
                                27181
                            ]],
                        [[
                                107213,
                                27479
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '5204',
                'properties': {
                    'name': '假佼庈',
                    'cp': [
                        105.9082,
                        25.9882
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lL@bUK?x?LWbkKWLkKUXUWWXU`UX@VUVlb@VVb@L?l∼xXx?b?bXUVb?VnU?x?KlL∼?nUlVn@UmVU@kUUVa?blVXKV@??X?lXUxnU@mVK@_@ml@UU?@?blU@KnLVyUw?@@Umk?WVw@UVK@VXzVK@n?VVUUW@kVJn?la?@nKW?kaWL@U???b@J?U@mU@@_WW?L@l?UU@WUUK?@lak?UUlWVa?_@`WIU?mW@InKVVXa@Ll@VaV@@UXUWakUVWUIUW?Uk?U??mV?XW@?@amUUm?L?l@UUa?wn@la?IVlnLVKUU?U@amK@kUK??VyUU@aUImK@UXa@aV@VakaW@@UnIVWVaUk?b?@mW?X@V?xm@UaU@W?@VULUxU@mL?aU??x@VnL@VVbUbmLkK@k?Vk@WV@bUbVakk?y??nWUIVa@J@aVUU@@ImJ@Uk@???V@n?∼@bmJU?UJUnUx?bm@??mak@???VUn??Wlnnmx?L?bmlkL@l@nWVnl?U?VnIlJ?@?XnK@?lL@V?JVU@bXL@xVJU?l@VU@W?@Vxn@'],
                    'encodeOffsets': [[
                            108237,
                            26792
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5201',
                'properties': {
                    'name': '幛栠庈',
                    'cp': [
                        106.6992,
                        26.7682
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n?lLX?VJ?LVblJ?n∼ln??LlVnKlU@?nUUa@WlX@l?n@?Vb?@la@a????lJ∼??K?wn@∼x?LVkUmmwUmk_la?b?K@UlK@UUm@w?L?mnwmw@U@?@KnL@a?a??X?WW@?UK?b?KWX?J?IWakJ@_kW?k?KUU@UVKk@@Ula?mV_X@WKXK?@WUUnUK@kU@WJU@@UnK@LVUVJVkUK@UUJm_?@UaVaV@UU@W?w@aV@Xkmmm@kw@IVa@KVLXU@`lLX@VKm_@y?I@W?U@UlVl@UanU@U?m@U?aWaU@Uk?@XJmXVbkV@??IUVUbWUUKmbk@kwmV@K@?mWUXUakb?KUUUJVb@LU@@VkL??@VXKlbX?mL?@kbm?UI@lVXUV?U@mULWy@UUL@VUx?Xnl@V?@VxUzmK@LkV?a?@VVk@@n@`UL@nmV@bmJ@X?`W?X∼WV?n@xnxnIl`VbnVlwXUlLl??_nV@b@bl∼?V?nWJkx@nmx@b'],
                    'encodeOffsets': [[
                            108945,
                            27760
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/hai_nan_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '469003',
                'properties': {
                    'name': '棇笣庈',
                    'cp': [
                        109.3291,
                        19.5653
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@角??jpnr?``?pRVH???∟?Zt^J?A?[?C?lT谷bQhRPOhMBcRSQiROE[FYdGNOEIH]MgEAMLLIAG_WMCSL@ED]PCLYC[ZIHgjSxJTMbHNEFCMEE_HSDFHSLECRNSFDRICHNADGPI\\RZGIJTIAHLDQOHG`GTNCOIC@eIGDWHIS[kiE[FMbEC?ZS@KKS[FDWsCeRuU_DUQNOE[LKGUBM“EDQP@HWHGDIm?X?Cog?_~?I_fGDG|QDUWKBC\\ore|}[KLsISBHVXHCN`lNdQLOnFJSXcUEJMCKSHOUMDIm_?DI`kNDIGEYFM\\YPEEIPMSGLIKOVAU_EBGQ@CIk`WGGDUM_XcIOLCJphHT_NCISG_R@V]\\OjSGAQSAKF]@q^mGFKSW^cQUC[]T}SGD@^_?aRUTO@OHAT??'],
                    'encodeOffsets': [[
                            111506,
                            20018
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469005',
                'properties': {
                    'name': '恅荻庈',
                    'cp': [
                        110.8905,
                        19.7823
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?h?∟??LQDaF?L[VQ足w?G?F~Z^Ab[??ZY?pF??lN?D?INQQk]U?[GSU?S_?c?}aoSiA?c????EiQeU??qWoESKSSOmw???Wk?角mJMAAMMCWHGoM]gA[FGZLZCTURFNBncVOXCdGB@TSbk\\gDOKMNKWQHIvXDJ\\VDTXPERHJMFNj@OwX@LOTGzL^GHN^@RPHPE^KTDhhtBjZL[Pg@MNGLEdHV[HbRb@JHEV_NKLBRTPZhERHJcH^HDRlZJOPGdDJPOpXTETaV[GOZXTARQTRLBLWDa^QAF`ENUPBP?\\Eji`y?Ev?角'],
                    'encodeOffsets': [[
                            113115,
                            20665
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469033',
                'properties': {
                    'name': '氈陲燮逜赻笥瓮',
                    'cp': [
                        109.0283,
                        18.6301
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?VLP`@PEdNRAHOPEAKHEVL`GZBJfvdTAXNNTZJFPrHHNpKTD\\ILHbEVd^J?OHLh@NNBnHP`\\xH@NBRLJTl?Nv_^CTLd@bNDVFbxdFV?UPBTKOGEOUO@OEBXQP[H_EI\\EbeYa@UO_J?MEJ_IEDKJUGMDcNUd_FMTEJSGoZ]EIYGO[YW?gEQ]a@WHEDQKUSDUGAbYBUpSCYNiWqOSQEoF[UcQISWWN?MSDe_cLQ_UBiKQOOASQAWgS?芋]Za?SP?Z]XMXS?[^oV?NgNKlE?R?E?'],
                    'encodeOffsets': [[
                            111263,
                            19164
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4602',
                'properties': {
                    'name': '��捚庈',
                    'cp': [
                        109.3716,
                        18.3698
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??hTBXTRPBRPjLVAR`dKf`TC?NXMTXRJVdE\\FpTRrPjXZMTDVoZABaVHTCLVCRGF@X^bFR?hZXP\\ZHHMA[^wBWXJlW∟EJ[bCTOF?WWMm@ILMGWQ@DQ^QNWFSHEbF`OXNbO?VNKTEPDTLTCCVTREfvfEHNbRAENH^RJXCFHNFRpVGHWISDOTMVCZeGamaLoL?D???gsia{O?E?Tt?l??wr}j?R㊣E{L}j]H?K?T[P'],
                    'encodeOffsets': [[
                            111547,
                            18737
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469036',
                'properties': {
                    'name': '⑤笢燮逜醮逜赻笥瓮',
                    'cp': [
                        109.8413,
                        19.0736
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@bRFnHNbH?gN@NPEnbXP@bND`NT\\@\\QZb@`@J]V@Xh?DpW?n?CJGHGXO@CR∫FANHVKLF\\MPVR`CvVfQtDPKpGHG@S`WJP~^dSTHWX\\RHTFACQTIAUPOU@MG__IaYSFQK?NSbORHXCZeTFJg?B`YBMNMFi~IVDV[tGJWXGDQRGF]?JrALgESLSAYDGIaFeXQLS\\MKSLSQYJY}eKO[EHiGSaK[Yw[bmdURgEK^_kcSGEOHKIAS]aFSU@Y]IWFUTYlkP_CUOUEkmYbSQK@EMWUuAU\\M@EpK^_ZMDQ^OXwC_ZODBrERURGVVZ\\DTXcFWNIAWJWAYUUFYEWLQQaCIZeDM`cLKRGpanJZQd'],
                    'encodeOffsets': [[
                            112153,
                            19488
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469007',
                'properties': {
                    'name': '陲源庈',
                    'cp': [
                        108.8498,
                        19.0414
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??x?JYZQ?I?YXLl@dR\\WZEn]bA\\S~F`KXaDeTiNO^EEKWEDQXITBXaWaDQMUJOIaTWf@NJV@dSxGZ?Fu_?@WMKAU?}AQ@MwG_[GOAmMMg@GK?P]IUcaFKG[JSCoLGMqGEOYIMSWMSBucIeYA_HUKGFBLOFGPQBcMOF_@KO?UAtERadwZQ\\@?J?g辰U?RlR∼K?V?LJ'],
                    'encodeOffsets': [[
                            111208,
                            19833
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4601',
                'properties': {
                    'name': '漆諳庈',
                    'cp': [
                        110.3893,
                        19.8516
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@里Z?t????Fuz?j_Fi?[AOVOFME_RBb]XCAKQKRSBQWSPY\\HbUFSWSPoIOcCOHIPkYCQ]GdGGIFQYgSOAQLK`MFUIGa@aQ\\GGUFcHKNMh@\\OYKAigsCgLSF]GOQO]@GM]HyKSHKPW@Pxi@EMINYREXWRQ@MQcFGWIAwXGRH\\yDI`KJIdOCGRNPNtd\\UTMbQYi@]JeYOWaL[EcICMUJqWGDNZEXGJWFEXNbZRELFV]XQbAZFrYVUBCLNFCHmJaMIDDHXHEhQNXZ_TARFHVB@DTQIRR@YHAJVnAbKFUEMLd\\c^??'],
                    'encodeOffsets': [[
                            112711,
                            20572
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469006',
                'properties': {
                    'name': '勀譴庈',
                    'cp': [
                        110.3137,
                        18.8388
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@^J@ZTVbET^JBGLFPTHld]`FLQhcVanx\\\\ZbLHTGj\\FLP~fIZRZPVTQFSVAFJE^NDLEE[~LjsxVTG\\NZZNGlLRRGLJTV@hPZANN^@T\\NEPPbDZXO`d^HSvcJDIV\\XZAJUFCLNP@PQ∟@[?K?L?I?]?E㊣I{u??Y?U?FcYUmsVeBSVgB[RO@aYYPO^]@UVaNeDShMLG\\EfFVE\\F`'],
                    'encodeOffsets': [[
                            112657,
                            19182
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469027',
                'properties': {
                    'name': '割闐瓮',
                    'cp': [
                        109.9937,
                        19.7314
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@T\\GJCXJH@fJDDPNCNJENN^NLHBNSx@DDYbBLLDRbjZTj@`XXTlG^Xr@PJLW\\WLTlWR@HDJTD@X_PO@STMDNTMVV@NLDM`M\\XM\\JNBH[PYZ?迆Yz?`?\\??d]c[NKVFLEBaUmBIZGQ@JQSR@CUAEGBQ`SWYRMFgWGCGJCbNnIDGMEDKVAZUEqBYRa^WEUFKYQMaFWXEHIFWMYHCrXVIIiaK@aMCUYNSIISTwXALKH@XWXIEIJQCG[IEQDE_XSBaa[AIPW@]RS[FWS[CD]PEBYNGFSaSyJG]@ugEUDQlGHiBKHUIoNSKqHFaPMICK]UUHIPDJMuCA[SCPIDIOILGAEmU[POPBVSJDREBGS[QXWSGcT}]IO_X@TGHoHOLCX\\ELT@LYTD?aFENF\\lj'],
                    'encodeOffsets': [[
                            112385,
                            19987
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469030',
                'properties': {
                    'name': '啞伈燮逜赻笥瓮',
                    'cp': [
                        109.3703,
                        19.211
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@D\\RV]dTXELnHr]^@LETBBRTHPi^[@U`QTHDJ`MGSogDIPKdJ`WVNHCXHl_DJR@AH`FBVPUJLHKNTJOFFZON[ZEHFCJlMJ_?Cn`CJVNGPLTNDFIdVTWEIPmRKMc_kDMWGGUTAtJLK~\\f{pqD[LAVXRCH{HC`e?J`}@W^U@I@_Ya[R[@MSC_aMO@aWFmMOM@?haGGMEmaQ[@MESHaIQJQ??MckBIw[AOSKKAMPSDSLOAV_@@`KJRbKRDfMdHZERgAWVsDMTUHqOUr@VQXTT@T?fg?L^NH\\?@heTCZaESNObHP?HeZF\\X^ElM^F^'],
                    'encodeOffsets': [[
                            111665,
                            19890
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469002',
                'properties': {
                    'name': '⑤漆庈',
                    'cp': [
                        110.4208,
                        19.224
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@TP\\pATHTGlZDJGAQjE\\Rb@jVBDCN`JZ[NCNHNXbULPrP\\KNbMTLjJJRFP`?pNLZz^FLRHjVPZ@hxVKbHBHMNNJFRlLzGPnNHhIrHHADcPWdUAmEMVQDSKYHY\\EhBN^HpXGNDBNNBnI????_g{?So]??@ORO@KMEDIVYB[WJUICudGTc]P_YWaCOOMFS[]@MMYBgOU@ISHKQQkKMHYY[MSHwUit}KF\\KFMCF]EIUBETSROUKTLT[NKTWREfJbCHBZKTFTKh'],
                    'encodeOffsets': [[
                            112763,
                            19595
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469031',
                'properties': {
                    'name': '荻蔬燮逜赻笥瓮',
                    'cp': [
                        109.0407,
                        19.2137
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@`Z?d?`辰邦????BSPGP@VSbQ`?@]HC~T^SE]N]FkW]E[fY?GGOPaTMbFDYfS@g[?MGK]h??e@SSSRW@UVqrPVGNStCXUhBFQGYNcCeLQQaLI@_`@EUwcEaCUaMc@SK]Du`?MSkKI?~BVNL@X`?EvY?wHcTU@MIe@SXJbIPNVCRXbWbSAWJCRXFFL]FMPSjCfWb_L}E[TaBm^YF[XcQk@WK?Z?JYRIZw???'],
                    'encodeOffsets': [[
                            111208,
                            19833
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469028',
                'properties': {
                    'name': '還詢瓮',
                    'cp': [
                        109.6957,
                        19.8063
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@jD`hNd\\^dZ?d?H?Op@?迄ZY\\OAGIMN[[W_NCNMKU@NUMSNCTSP@`O@WSCCI@GXQSkXKX[IK@OWqH]SkWW@_SiiYQaKCAKZaCCw@MTGAMKM]FMMIMDSM_HGHRPKCBGSJJIYH[QOJCHMBDGQJECMTDQKFGTCEGTF`NFEDMFaGSNwIiTGhYJD\\KZODC^@FTKND`XBHKJNKFBNhG^FJMPcHEZF\\QPRjQTAdgNOPgQaRS那'],
                    'encodeOffsets': [[
                            112122,
                            20431
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469034',
                'properties': {
                    'name': '鍬阨燮逜赻笥瓮',
                    'cp': [
                        109.9924,
                        18.5415
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@R]NC`YL]FoN@V[vBXVFNL@TRZalnVFVP`DlOZkVSXEE_F[EUFeH[NKTgfCbMVU^@P]ZObZP@\\QhATUfAtUas??i芋EoI]eY?@aKmae?WuC?K?KpnbHbYfUDSNCPJTRAHJTDJSfDNLHXC``VBNGTYCQDIXMDSP@xLNEFRNXBIpVNLXah@RgF@`qOML@LJNSPLbaHAh@Jdj'],
                    'encodeOffsets': [[
                            112409,
                            19261
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469026',
                'properties': {
                    'name': '迋荻瓮',
                    'cp': [
                        110.0377,
                        19.362
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@\\OnVBFKHPJCJOJTDB\\vDINOCGJVVL^JDONEbrGTLpMVJLGjAHGRkVChF@vH^zIbTETMHAZOFC^\\DXT\\EffAP\\PdAV@UIYfS|S@YPICMeM@sC[_A]VQEwyHSMuNcAUlQJMVGMS@mVBZPFO\\CS?FQK[LqDMACiUa@[QiFBRIHYCHkGSBS[oSOqB?IE^QHCRWHIXsHU\\UC}JEjMNAN_Z?AIhSEYfWDQGaPMTL?ERZTJb``NHV@'],
                    'encodeOffsets': [[
                            112513,
                            19852
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469025',
                'properties': {
                    'name': '隅假瓮',
                    'cp': [
                        110.3384,
                        19.4698
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@JjDNdJ\\FbKPXfZ^Ij@RZNaVSc[MsMOHQPDJcLIJ_zCG[HQxWJBHXdENRR@XQFWZQQGOFSWUCI[WCJuRGLXNMPLhCl[Ta@SqGgJMGOmyHkKEQMINMAGaGULgwY@UOGiKQ]EYyMK?oO_QEIIKiNSMa[LqOKOaVMWMGMDY\\_IKrL\\ERT?[DEPYOUA@nNTUHINkRBVMdNvGTxzRF^U`BD\\@tfNDNOJ@Z{TeTJZ@VU?cB[OBOeeQT@^OXBJb\\AbWTF`RCJFH\\RDJIJFXW@WLGBKxWTSJJMTVZND@bbL'],
                    'encodeOffsets': [[
                            112903,
                            20139
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469035',
                'properties': {
                    'name': '悵秅燮逜醮逜赻笥瓮',
                    'cp': [
                        109.6284,
                        18.6108
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@FJp@fxpQ\\ApN\\GNPNBM`HLMrXLXj\\PEHnI@WUCEM\\GTc\\GZYHTPBHRCPTd?H\\K\\@HXi?BJILJJAVNTOZJNtFPC`YxDPWci@IBgbGKaTOIM@KNKrP@_hE@QbgKWUMJoWAQMFEKM@wTONCJWRCZDHSAM_UD_GWMKeCITSCGIQBGXUHQoMEEGWDQIG]FMQBMaFGueFeSQDUSDSKOCSFML?UaPWM_PaEGFETMX]RCRR@HXKN@JNnXXE?SPaDI\\?FkXWIAX]xB\\GN'],
                    'encodeOffsets': [[
                            112031,
                            19071
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '469001',
                'properties': {
                    'name': '拻硌刓庈',
                    'cp': [
                        109.5282,
                        18.8299
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@TCNOLBTLBPx\\AJdl?NR?RIbJTGNF\\@RcIYbmHoLQdKN_fCJYbDRRXKZFVEZVXBXIJBXMdESW[CUYHUVQFQAqsEIMPYMSBUIIJKAIj?GW[@[LGScDOGQOAGSYZ[HSd[HFNVD@XmJFG[OWiWKNqGKN_MAMO[HoM[BoRewo@Y^HpITSFENc`MVCdHNIVCLJFI`NFI?P`@VZbaf[FFJG`O\\WRFA@PVPFPPH'],
                    'encodeOffsets': [[
                            111973,
                            19401
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/hei_long_jiang_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '2311',
                'properties': {
                    'name': '窪碩庈',
                    'cp': [
                        127.1448,
                        49.2957
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V???@?kx?nX?∼V?a∼V@k?w?b???JV?kXlVUx??@?lL@xkVV∼??Vb?xlVUnVxk@???Kk?Vb?Il???@∼kVl?@??l?nkll@@V??VX???@V??bUl?VlV?U?V?n@nkJ??lkVb?@?x?V@n∼VUnlKU?n`@n∼bWLnVUblVUVVbknV`∼kk?l@@V∼@nz?J@X?xlWXb∼n@b??lbXb?bVb?J@V?b?a@??@lbUb?Vmn?@l?VmnIW??@Wb?@?n@x∼@???a?谷?n???l?????wm?@???U??mm?Xy∼UV???@w????k???U???U????kV????????U∼n???U?x∼m∼??V???x∼???@y?U?n???@??∼K???W?kWU?b??@???W????U@?n??UUKVamanw??m??J?k@J?IkaVaUU?bka??kWm??U????@??wnU㊣?@?kkV??KUk?J??U????@車w?a??V?Ua車@?wm??_kV?w????mmn_V??a@U??Vw?車??U??L?谷車X?m身L???x?k????k?makbU?∼@W???@b????@??L?l@?∼J??m?kl?L??㊣L?amJ@????V?U車??UX??b?里Vbk??I@llx?k∼V??V@Ux???L@b??@b?`???zk?車k?∟@?????W??L???Lmm?n?VkbUa?L@????bU∼?L???@'],
                    'encodeOffsets': [[
                            127744,
                            50102
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2327',
                'properties': {
                    'name': '湮倓假鍛華⑹',
                    'cp': [
                        124.1016,
                        52.2345
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?k???m?那?b???@@w?m?@XV@Il?l@?bUxl??VlV?bV@ULVlUV?_kx?VVV???J@???U??lm??x@x車???m??W?x?@Uz??Wwn?Uw??@kn??W??車V?UUw?y車?WI?Vmm?I@㊣kw?@@b?@??車@?w車@?a車??K???aUwmWUw?I@a?K車@Ua?L?a?V?w身?UU?l㊣I?∟Vx?x@zkJmnn?mbnz?xl??l??kJl??∼@?kb??mx@x?@k那mVn?Wx?X?xU∼?bWL車J?n?W??V????UUb?b???K??k???VU㊣aXm??Uw?K??k???Vxk??Kkb?I???XWl?b???X?K?b?????V??n???lxU?∼n∼辰?b???xVb???@??Vx@??V???l??∼K???I∼∟?I??辰??n?K???W???wl?nKVXmbX`lb?w?kVW?XX??L∼a???a??n?∼@∼??z?????alw?k?J?a@??K???bU∼?x?V?U????VI@?XU∼x∼Ln??w∼UmwXm??V???∼@nU@m????lK???w@a?U??Ua?IkmV????nn@??@Uk?VK?@??@??kVm?a@_?J車?m?巡??w?車?a@al?Uw?w???k@w?WXUW?X?Wa?m@_???谷Xa?wVa@??KkUWkX??k?KXx?n@l?V@???m?n??w??'],
                    'encodeOffsets': [[
                            130084,
                            52206
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2301',
                'properties': {
                    'name': '慇嫌梆庈',
                    'cp': [
                        127.9688,
                        45.368
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼`?_?JlU??@??@V?∼JU???nL??ln?@@??aU?Vbkbl∟?zk∼?V??∼IlVUV?U?x?U??@b????@??b@l???UVl?@∼??x?nXx?V???@?x?K??l?V?∼U??lw?@????∼?lanV@??V?Ull@b?n?m?w?@la@??b∼UXb?l?????k?V?I@?nJn???∼kn??b?wna@a?k?K???a?????IVbU??w?wk??xnL??V?kaU?㊣IUm?n?W??∼W???al?????@?W?X??a?b?a㊣X???L?aV?m?kL車??bka?VUKVkkKV_@a?ykk㊣L@??U@yV_?aU?車w?x?@UkV?n@l?k?lw?WVwUk?mkklW@??a?bVwnWW??wWL??@U???U???L??m???@w?J???L??@??_@a?y?UWw???U?x?a?XVm?aU?車㊣??nw?a?車?V?Xman??U??lUXkWa@mkI?????a?m?Ikl?U??k????zkK???lU?身?l???@?nX∼@llUx??mK?VWwk@UbUK@bmVmI???Vmw?aWxXlW???m????bUxV@?里W??LkWUb?aWzkb?`U?㊣Lkl身wUV???UW`Uwk@mk?Vka?VX@Wb?L?K@X??Wz?x?K@lmX@bkVV?k?Vbk@Vn'],
                    'encodeOffsets': [[
                            128712,
                            46604
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2302',
                'properties': {
                    'name': 'ょょ慇嫌庈',
                    'cp': [
                        124.541,
                        47.5818
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@???KV??a∼?@??KVbla?U?mnn?K???KX?∼???@????ll??y???_@a??@a?K??VwU@㊣??U?lkw@k?Jl?Ua∼??aW??V???V?U??@?nI?b?K??∼Klkn?∼??I@??k?K@?????@a??X??@V?la??VamI@a???????J????km???@kx?@@l?aVk???貝?a?k?????JUaW?U@@w?a???KUk?kUm?Umw?㊣㊣UUbU?UX?wW??w??k?lkUanaWwnKl?kal?ka???a?k?x?a?@?amb?V?l?w???V@x??m那V??VV??a?V?w?x@??x??V??V?lmX@??L@?Ua?LmV@??∼X??K?V???@U??@??@w???IU??km??w???lmn@∼kxVV@?車am?n?l@nx?l?V車?mx?n??????????迅那?∼????∼?????????∼w@?nymwnkUUV???Vmk??mUUVa?mVIkm??lxkX???bl??l@?kV???V?xV@??V?@???U??nn??J'],
                    'encodeOffsets': [[
                            127744,
                            50102
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2310',
                'properties': {
                    'name': '警竣蔬庈',
                    'cp': [
                        129.7815,
                        44.7089
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@U`lLUlVL?Ulb?a??lKn?U??b?K∼??W∼b?a?b?knyU?lUkam??L@m∼@l??m??n`??lK?x???KnxV@??l@????XyW_k@?wm???m?X???????l?∼????????????_WW@U?al??wU@@w?UV??@V?XI@w???????aU_@mUkly@??車V?XmWUXUWmn?m?nUUaWLk????I?a?w?a?∼?nUa㊣a???@??????@??@?b?xU??n??lb????車?m??@㊣?U?k@Ww?a?xU?V∼?xXb????UV???K@??KUa?@身??X?a?l??l?kal?U??????akb???nl???@??VUx@x??W?????m??????Vk???mx?∼??V∟?bUn?W∼b?w∼V∼?Xx?V∼z@b?`@????K???I@x??n????K???V??@V??XK?xX?mXUx?a?b@?kXll?nVlUx?Xkxl?k?m@U?Vl?@?w?xV??bU`@z?V@??Kll?z@b'],
                    'encodeOffsets': [[
                            132672,
                            46936
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2312',
                'properties': {
                    'name': '呦趙庈',
                    'cp': [
                        126.7163,
                        46.8018
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????@bnJUb??nbl??????l?w迅??K?n?W?那?KV?????Ux??@V?bU?m`nn?????xlU?mkaV??L?w?@∼?U?mb?Km??U?wUmVknKUUl??KU??U????nK@??kX㊣lX?∼?L@???@wV_m???Ww?L??Uk身??V?U?l?w?V車?㊣??a?Vka∼wVk∼m??????l????k?U@?mUkb????㊣?車@kx?車?VU?k???㊣L?w?@車??UWw?m?w???@Uk?V㊣?@k?a@?????@a???V?w車VVUkU?J?車?Ul??yk?laUaV??b@??@km車?mK??V??IU??@@???kV?I?`@????blU?l???b?b@x?Kk??a??身@???V?K@z?@@??Kn??@@a??Uw?w?nU??@?_?V∼?@?klV??nULVV?bVl@∼?@nx?n∼L???lV???mU?@Vm?L?x?n?xkW?z?J?wnLmbXbW∼???????@???x@??JVx?L????∼I????@?n?'],
                    'encodeOffsets': [[
                            128352,
                            48421
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2307',
                'properties': {
                    'name': '畛景庈',
                    'cp': [
                        129.1992,
                        47.9608
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?K??kWW??l@?mL?????VV??Lk∼VVmLUlVn?x?Vn??LnaV????@?x?KU?lb?n?`n??x?@VbU????b?x?@??V????IVl∼LU?ll@???mV?x@??????Vn?lX??lb?aVVUblb?J@I∼l?In???mxnbUbVL?Vm∟@??V?∟X???@????aXV?aXbW?nz?a???K?b?Ulw@?na?KnUU??a@mkkVU?m??????巡??K??∼L?l?I@?????Va?k@?Va?lnUVw???車ma?@?w?@?a?V?x?amX@a?@Ua?L?aVW?_nWm?nWm_?V??m@m?車∟???????almX?????VWU??w?m?@@IV??WUw@a?I@??k@w??W?????Va?K?Ika@?lUkUlw?wVy?wWU@a?U∼m???@U??aVa?mV??w?Ul?Uk?V@k?mUk??X??w∼@@??a?I???am??am??l??m?mI@??J?U?l㊣?身??kWa?V?a@?kb?@?x?n?m@akk身V身l㊣?k??????∼?nUl?xlb?U∼b?????U?x?k?V?U??Vl∼??KXx?∼n?U`@x∼?@?'],
                    'encodeOffsets': [[
                            131637,
                            48556
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2308',
                'properties': {
                    'name': '槽躂佴庈',
                    'cp': [
                        133.0005,
                        47.5763
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n??b???J?b@??@?xW∟??Vl?n@l?UVlk??V?xU?∼nUb?bV豕?@??nIn??@???ml?Uw∼????VUn@lnL@V?b?w??l??J???l?w?w?xV?VU?????x?L????∼`nn?w?J???w?J??@∟Xn???l?n∼??∼l???U??b?x?@?l@???m∼?l?w?L∼???∼??n?@?w?`?I?V???U??@?VJ?b???@∼??K???J?a???@??∼n?∟?b?U?@Vx?mUw@a????????@??貝U???@??mV???X???@???U????KWV?kUV??Um???x?a?x?U車L?a㊣車身b??????V??_???a@U?K@wm@Van@UmmLVa?@VImmXUW??U???KUw?UU?kV?k@l?X???_?J?k?Jm??L?a@?U@?V?z?@?`@???mx???K?k@㊣la?@@Xm@??@x?@W?n????@@a?@@n?b???@?_U?kUW?kb?w?U@??Wlw@anI??ly?X∼m∼V?a???m@??mVw?K∼??XlaXmm_?@U?kw?K@?VI??XmV??I@a???W?b?aU_?JU???????k?身`㊣n??k??b車??X???X?mVn?JV?lbU豕??mK?wl車?x?xV?Ua?J?????b???L?l@bmb?x'],
                    'encodeOffsets': [[
                            132615,
                            47740
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2303',
                'properties': {
                    'name': '憐昹庈',
                    'cp': [
                        132.7917,
                        45.7361
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?L?KVVnk?bV??b???U∼VnklVla?L@anU∼?mXV`?n?L?豕?xl??LX??L?a?VVm?X@??lnU??l`???@??∼U@x?KnnV?mlnnUl?lVnna?wlV???@n??LV?∼l?wVk?L?a??l?n???@xmL?∟Wn???W?LVVUxl????WVaU_VK?KXU?bn??n?K?b?w∼b?WXam?Vw?K??Uw?WUk?UlJUwV?Ua?@@kmy?zm??w@kVw??k???W??KU_Vm???x?U@aW@@?kK@w?a@K?@@kVU?aky∼_Vm?kna?K@??L?w??k@@I?車X??wVakmV@mwXUWan?l??@??Uw?K??車?????m∼?@?w??@?㊣b?W???WVw???kVm身b?w@a?wmV?UUb?V?IkaVw???xk??b@VXX車`車???????車???k???????W?n???n??xl@X`Wz??'],
                    'encodeOffsets': [[
                            133921,
                            46716
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2305',
                'properties': {
                    'name': '邧捊刓庈',
                    'cp': [
                        133.5938,
                        46.7523
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?U??Uw車?m???U??Ukmm??yV??貝????U???m?kaWb?X?a?x?a車L?mm??aWV?LULV`Ub?X車?k?VwUU?K?X??Xm??nK@w??m?k????b?KUl?x?kU??Km??@??kU身xmbUm?kVkmmnkU?mm?L@w?V???@??k_??mV?k@?Vx?V?∼lLkll?Ub身w?n?VW?nlUx?XmWUn?@?x?U車??J@LVbkJWnkb?W???LUx?n@??n???b?U?n?Wkz?∼mJ@bkx?X@豕?V?xlaX?lVV??`∼@???a@m?@@b?@??m?X身?@@w??n@@W?@kb@??l?L??nw??@??_∼@?y∼UV@@??b?Kn??I∼l?I?`??∼W@k?llUV??VVx?L???VX?WVnnUJ?@UbnKVnm@Ubn@@x?L@V?b???`U?????∼??a??∼b?K?V?w∼b?w??Vn?身VU?lXU'],
                    'encodeOffsets': [[
                            137577,
                            48578
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2306',
                'properties': {
                    'name': '湮④庈',
                    'cp': [
                        124.7717,
                        46.4282
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@m?@???∼??J㊣????KUw?I@??w???@?㊣????X?WanamK?x?I?ylX∼w?m?w?KUn㊣@nV??U??k???K?mmw?@@?Uk?aUUVK?mU?lk@????U?`?@V??m?xVx??@b?@m??L@??@@y?L?U???@???bl??L@w?a?a???kkV?a??@車?_?J?w?a?Xny?U????@w?b?a?Lmm?@@??VU?lb?Vm???X?m_?`?_Ux?m?L?a?b@m?a車??k?∟V?@b車JknVx?VXx㊣a?LUbVxkLVl?LWl?@nX@V?bWl?n?x?bW??bm?@x?bml∼b??XbW?XVmnn`?Lm?nbmb@?k@mwU@@??Jlbk∼lbk?mLXxmbVbkll????xX??xVWV?Va?V??nx?VVn?lVl?L???b@xV@X?Vb?I?∼???l?b??∼?Ul?b@k?@lw?@??ln???車?I??'],
                    'encodeOffsets': [[
                            128352,
                            48421
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2304',
                'properties': {
                    'name': '禍詣庈',
                    'cp': [
                        130.4407,
                        47.7081
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????n?n@∼??Un`mXn∟mX?`UX?b?KVb?@@bnW?b?w?U?b?@?x?@nb?WV?m??_mm@?車?Um???WXk??????n??w?@???K∼b?Un??K?????b?knJ???U?V∼I???V???w?aV???k??????m?k??Wm@???車I?x??身I?xmm?_?????K?w????UVU??w車x?x?k???Ik????x車a@UmK@kVm?U????Vxk??n???@m?mJ?n∼V@bXV?xUz?xkxlVkV@?lb?J?LUb????X?身?@x?l@??J@bVx?XU?@J?@?n?xV?UX????W∟kn?b?∼'],
                    'encodeOffsets': [[
                            132998,
                            49478
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2309',
                'properties': {
                    'name': 'ほ怢碩庈',
                    'cp': [
                        131.2756,
                        45.9558
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?m?_l???????V∼∼IV`?b?a?X?∼@b?JU?Wn??UJ@??LlxV??@n`lIUa@K∼I???V?w?@VmnX∼WVwmkX??U?m?xVak?lkkK???UUw?WUn?U㊣b?KW??Kk??w??車K?mU_nW??mV@b?KkbkUml?U㊣V???aU??amlUU?L?K??k@??U@mw?L???wkL車?m_?㊣?nk??@@n㊣Kn?lbkVV?mz?lW?X?@??∼'],
                    'encodeOffsets': [[
                            133369,
                            47228
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/he_bei_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '1308',
                'properties': {
                    'name': '創肅庈',
                    'cp': [
                        117.5757,
                        41.4075
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lLnlmxn??IVVlUnb@VVxXJWL@L??VnnV?J?_@wkm?K?b?x?wXk?WXX?Klb?K@nVVVb?L@WlU??lKVnUJVz@VVb@l??mVUVnb?aVX@∼Ub@lWbX?@b@bVb∼x?@Vx?LVl?a?@?b?k∼@lVU?@Xn@VW?LXb@∟VX?KVVVLnm∼_?∟@aUIVa?alkX?∼k??V@?alwU?Vy?U@k車?∼?na∼UVUUmU??w@mkLVU?WVI?W?Lnn@xlVnK??myU@?U∼UXaV@U??U@U??@aVUkWU??aU@WLUV@bkbmKULmKkUVUkmVIUwlWV???Uml?∼U@W?LUwVm@UUK@_?KUU?aXw@?VKUU@mVIUUlmnIVVVb?VlKnbVK?@nI?@nVnwVLVK?K???Vnb@aUIVW@In?∼@lVnI?@lW?@∼UVL@b?@VyUU?a@w?@WUnU@W???K@?UkkJWa?bmk@mVa?U@amk?W?@mXUKk???@a?kl@Um∼UXwla?al@nmlXnW∼znW@a?wV??@?akb??VmU@?I?V?U?J?kUmWU?K?bmkUa?KkUVU@KV@@klw??WaU@km?XV豕nbmlUU?K?X?Jkb?I@JmIUWU@?Lml@XkJ@U?k?K@aVK?wWa?IWw?m?U?@mU@J?@Ua?U?aUU?VkI㊣?k@UU?@UbVVm@UV?K?L?lkIWaULUW?XUJU??@WbUb@lkXUxm@@JVn@J@b?n?b@Vkx@b?LU??n?J?aVXnKVVmzX?∼V@_lJXxWX?K?b?amU?@?lUI?b?J@L?KkI?`kxWL@??@@bUVUb?xWKk???VlULW@??n?Ul@I?lmUUUVm@?kW?nkKma?XUKWmnwVw?L??m??VUbUVWb@Lnxm??xV?mbXx??@?nb@`???V?@kb?LU?mVUlkbVXk?mnm@@xk??b??l?'],
                    'encodeOffsets': [[
                            118868,
                            42784
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1307',
                'properties': {
                    'name': '桲模諳庈',
                    'cp': [
                        115.1477,
                        40.8527
                    ],
                    'childNum': 15
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@k????al?@wn@nml?UWlaVknUV??Kla?@?U??@_ma@???WwnaU??wn?mw@KXaVUVa?Un?mWUk∼?l?nUVUXWVw?IWV車KUI@W?X?xUU@mma@kUKWLkw@yk@?aVkUU?aUU@Wk@Unm@UVmL?m㊣IU?kJ?kW?@a?I@m@U??V??Ula?@VXV?XmVwnkWK?KU_k@m??mX_?JmnU@km@U@KmU?V?U@U?@Umk@@L?mW@??W?ka@wk?@a?I@mmk@mUa@UmU???I?w?W@aWU?bU@kb?@kw?@makVUk?U@a?m@aU@mxkU?b?KUXU?㊣KXVWLUK@wkU@V?@WXUa?@WbUx?J?I??@?V豕VVX@㊣那?KUI?`?UULVx@V?@UK?I?VkLmVkKm?@nUJ?bkIUJVX?VVxVbU?VJ?Un?∼bV?mlU∼?XnK@Ul@lV?VUX?x@W?@VX?V?K?b?n@VnbV?m`?U?x?kW@UVkL?Km?@lUnUJVnV?XV@Vm@@LV?kl?Ikl@V??Wl??ULWKUL@?mJ??@blbUVUlmzUJUxm@U?Ub??k@Ub@V?LVV???bV?m?UKUkU@m???@VlVn?WbUJ?@@?∼?nIll?l?@nX?WlL?k?J@bkxlxkxlXUlk?lJ??XL@bW?n`@n??XxlL@xl@Xb?L?KlVlIXblVUbUJW?@lX@VL@VV??X?J?w?n@WnL∼K?bVbl@VI@K??@U@?nmVmV@XUWI@aXm@?VUUkWmn@lmUUk@mUmK@UnwV?@??mU_V@XJ?VVU?LVUn@?llUnJl_n@?ml@X?lLlw?LVJUL@VmbVb?lVXmVnl?@???nn@??@b?l?@@XV`?Unb@VlLVb?J?Xn???@??@'],
                    'encodeOffsets': [[
                            118868,
                            42784
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1306',
                'properties': {
                    'name': '悵隅庈',
                    'cp': [
                        115.0488,
                        39.0948
                    ],
                    'childNum': 23
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VbXW?@@UlV@xVLXKWU?LV?VW?L?alVnwV@@b?n@b?VVllUnb?@lx?@laV@?aXV@b?X?x?J??nV@VVb@nnl@n?J@bl?l@?a??U_VWUwVU?kUm?Ukb㊣mVw?U@?VIUW@UWk?@VU@ynL?m@IV@?bnK?LVaVmnIlaXwV@@WVL∼@@xnX?@V`V@VbUVVLVKnwnL@ll@@_V@VVna?@?KVX?@n?@w?KmU??Wm@?km@k?KXU@?W㊣nIUwV??Kla@I∼wU㊣k??kmm?m?_?J?n?a?w?W@IVaUama@w?U??mU@mVw@aXk@mWa@?km@a?_kVmUnWW@?b?kUmk@??V?m@@kUU?KUU?@UVUamVUaWIkb@xU@@amUkK?Vkam@@kVUkUWm?KmUkLUb@xmJ??U@UImV?VmnUw?J?U@V?X?@UWm@Ub∼?U?mxklmX@`ULU@@UW@@xkn?@makV?UmxUb?∼?lU??bUb?nUJ?UUV?a?LkbUU?JUU?@mUUU?Jka?@?xUIWJ?U?n?J@V?z?@kb@`@bln@l?b??@X@?@??@Xl?bnbVb?@??VJlInl?bVw@U?K??l@lbnan@Vb?J?Ln?UzlV@l?LVbVK@LVx?VWXX`WxXz?bV`UXV∟nx@??bVlVnVlUL'],
                    'encodeOffsets': [[
                            117304,
                            40512
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1302',
                'properties': {
                    'name': '昄刓庈',
                    'cp': [
                        118.4766,
                        39.6826
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@VVl@??lJ?UVV?b?VVb?@@InV?@?V?nXx?JXb?xUL@b?L?l@VlI@Wnk?KV@VXnJ@I?Jla∼I?W?LVVnkmaU??WVk?a???@nV∼wnJlaV@VUnUUaW??wXWWwna@?UaWKU???@aVUkKUamUU?n??an??IVwUWlk?@?LlWVakU@K?_l??b?U∼@?y∼n?@?K?kWW?????身?k?WUw?????w?w?@kK@k???w?b?∟???V?l??W∼@??x@VVVULVLkl@V@X?`Ub@Xm@UW?b?k@?VbnLWV@lnXUbl?@X?lmU?VkKWLkK@_UK@U@UmmUxmVXLWVULkU@`W@ULUK@XlJXzV@@xml@VU@UX@Kk@WbUK@Xn`?XmJn?m?kxU?VbUVlVVxUbV@nKlL?kVK?bVKXI∼KV?mVUIUKULVxVJVLkV@V?@UbU@WUU@UbUK@b@n?V@VkLmb@b'],
                    'encodeOffsets': [[
                            120398,
                            41159
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1309',
                'properties': {
                    'name': '終笣庈',
                    'cp': [
                        116.8286,
                        38.2104
                    ],
                    'childNum': 15
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@ln@U???l@Vn?l∼aX@mXnVlU?`@bln@∟Xb@nWl@bUx@nnV???V@xnbVbUb@J?X?x?b?mXa@k?UVwlW?k?K??Vm@w?kkK@kl???m?VKXkla∼@XVV@VI@ml@@Vn@VX@V@J?@VxUzVV???blVk?@??@@??@VK@V?LlK@XnJ@alIU?l??a?VVb?@?n@a?U@WUIV@mUn@mKXml@lL@LnW?b@XV@@a?VVb?V?@VV?IVW?b?I????lW?aVU?U????Um@kVU?WVk?aUwma車U?JUU??U?mk??Ua?K?n?y車XmW?X?a?b?a?J??W???U????a車車?Um?@I???VVl@b?LUJWLX@@x?XUxl∟V@V?nVUV?XVbV?@??@@VVn?∼V?@??U?V?Um??UWV@mUX?a?bUKUwUa?Kn??Vk?Wb@VnLmV@bkV@n?xW`?_UV?V@b?UklVX@VmlU??x@VVL@x?VWV?L@VW@UUm@'],
                    'encodeOffsets': [[
                            118485,
                            39280
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1301',
                'properties': {
                    'name': '坒模蚽庈',
                    'cp': [
                        114.4995,
                        38.1006
                    ],
                    'childNum': 19
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@la?@?y@U?I?m?VXIVJ?w?@lb?IVVnV?@VV?IVVla?K?bVU?VVI?mVa?aV??k??Vanw?VlUnb∼@lm@wX@@VV@VK@_nWlknwV???Van@VX?@?W@U?V?IVxnm?UnUVJV@??nI@wValKnV@k?mU?na@mVk∼K?LVa@UU@U?mknWWkXU@aWW?@@km@UaU@@klK@UkaWaU?namm@U?a?wW?U@Uk?L@?Un@x?V?lUXVJUb?LmU@aUWUkmKkLUUm@mW?X?a?mmkkWU?m@@U?JUUm?kU?@mK?x?w???L?U車?mwkUUUWVkKm?kKmLX?lxVLVxXJ@nVJnz@VWL@`nX@??x?@kVUUmJmIXx?JV??nUV?@UVV?@LU??`UXVV???lXL@l@b@VmX@b?xn∼?U?bkKWLXlW@@b?K??mKULmakLUlmb@?Xb@xmXU`V??b@`lL?x@nWVXL@?∼?WlXnlb?KVK?XVb@?X@l_lJ@V@Xn??I'],
                    'encodeOffsets': [[
                            116562,
                            39691
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1305',
                'properties': {
                    'name': '俵怢庈',
                    'cp': [
                        114.8071,
                        37.2821
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nKlLn?lLXUVVlVnx???V?K???x?wnL∼@lVn?VV∼I@Vn@V?lXnl?n?b?WnXn@VVlKnLVlVX@bnV?KVaUIVW?k?U@wVm@??@U?VmU_∼l?K?k?w@LX?Va?U@w?U?UUKlU車W@UVU?Ul?∼K?wlKU_na?KVnlKkk?WWa@I?JVa@IlJnU@??KVUUmV?laXUl@lm@kXW??nk??㊣?k?@w???@@U?@mK?LmV?J@zmln?WL?U?JU_?@@?mJkXUVlbkl?@?a?b?@??㊣J?w?aUU@?kU?@mV?I㊣bUK?L?WUX?Jka?L車KULWbUVkKmnk@@bmLU??l@b?@mnmJkUUL?a?bn?mn@lVV@?n@?l@b?znx@`Vz@b?xnV@xl?lbnKVx'],
                    'encodeOffsets': [[
                            116764,
                            38346
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1304',
                'properties': {
                    'name': '漯策庈',
                    'cp': [
                        114.4775,
                        36.535
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?bVKlVnInm?@@a?kV?nK@al@nmlLVUXaVK?L?Klb?IVW?X?KVL?a?JnU?@lV@?VV?b?x?I∼?∼@?a?b?@lkkaVUlWnI@??@V`?I?VXKm?nk@y?InU?K??kUUamUUk??@aU@U??k@WUwVkVJVkkw∼a@???mK@UX@VV?LVW@w?wVa@?X?m@@lUIWaU@UWkXWmU@UwmUkKmn@lkV???V?aULUVmJUUUw?Lma@?UmkIUm?L?mV?mx@b?LUamK?L@VmbkU?K?amzkJUb㊣Vkb?L@lU@WIkJ?zkKmK?nUa?lWkkKW@@nkbk@WW?XUVUJ@XlJ@X?@XlWLkU?`VUnaWa??UV@UVI?aUxUUmV?K@I@W?@??U@@U@b??@nmK?Xmx?@UxkVWUX?@`VLlL@`?zX??b@b??@VUVkIUJVz∼KVlnLlKnL?xlLVVUVlXUJ@nn??I@mVUlbn@@?m?@bV?nV'],
                    'encodeOffsets': [[
                            116528,
                            37885
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1303',
                'properties': {
                    'name': 'п銘絢庈',
                    'cp': [
                        119.2126,
                        40.0232
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lnV@Xb??kx@lU@@LUVlV?LVbnl?a?LXVVn?l?I?V?U?JV@Un??la?b?@nJ∼Um?V@?wn@VU?JVI∼bnWlXnWVLVK?b?akk??lI@aUaV?UwVUUalaVwnUVak??X@W?k?LV?m??mUK@_lW?@n_UK@al?@???????m?@????l?L?@?m?z?@?V?ak??`@LlVUbkX?K?@klVXUx?Jm??bm?V?nVVblLUV@b?∼V∼XLVb@∟mbXxWX∼xX?VbmVUVU@kbmI?xmU?@?∼車bUl'],
                    'encodeOffsets': [[
                            121411,
                            41254
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1311',
                'properties': {
                    'name': '算阨庈',
                    'cp': [
                        115.8838,
                        37.7161
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?KVlV@X?∼x?b@VnnmbV?Xblb@VkL@lV@Vbn@@l?@XX@bWVXlmXnlV?V@@VUb?K?LUl@nmbV∟?n@l?LXnlVUV@ln@lb?UlLnV@bV@@wlaXJVbnUVbVU?@VV?LVVn@VVX@@U?KXU?U@wUK@U?wV?nk@UUWlk?V@a?UVU?`X_?w@mlU@anUmK@UXal??Um??LVbVxVL?a?bVW@nXU?Vn??V∼U?V@?U???Um@U?@@?U?Ua?WVUmUU?U@k?Vw?W@wW@XK?IUa@wU@@al@UK@_mKXK?bUU@aVKm??@Xm??㊣@kb?akL??VaUw@a@?mkUJ?k@ykw@???WX@lknk@WVkbU?VnUV?L@?mVkI@JUb?I@JXb?XllkLUm?LmbV`kL?x?Lk??VUV@V?XkVVL?V?V@x?VUbW?@K?x?l?L?kV`UnV?∼@'],
                    'encodeOffsets': [[
                            118024,
                            38549
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1310',
                'properties': {
                    'name': '檀溶庈',
                    'cp': [
                        116.521,
                        39.0509
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@la?U???@?UnL@VWbklWxnIVV?V@X?JlbUl?XVbn@@K?mV@@X∼WVInJmn?@lmVbnL@amKV_kwlmX@@LVamaXa?aVU@UnJVanLlUkaW@UaVakK@IlKUU@an@ln@alKU?kIVa@a@klaUKUV@UkUV??KV?V@kUm?U@@a?ImJUU@VV@UL@U?@@WXUWa@Ukwm?@?X@@w@al@@aVIUmVUUUVWUknK@I@?l?kU㊣a??UUVyUw?@@I@UUWm@@Uk@@nUJU@WU?@kbWlULn???k?@llL?l@xUn車??L?lkXUx?V@lWb?I?`∼nnn?ll?V??x@Jkb?LU?VxmJX?@?WV?L@lln@?Xn??nV?L'],
                        ['@@@kX@Vala?a@KWI@UXW@?WanaUIW@UaUK??k_W@UVUKU?@b?@UamxVXnJUbWVXLVbn@W∼kb@U@W車?mIU?k`V?@bVbl@?lX@lU?VlU?IV`lX?Vn@lUlVn@?l@UVa?IUWl?Um??VWU@@UUKlUUUn?VL@K?UnLVWUa?@?U']
                    ],
                    'encodeOffsets': [
                        [[
                                119037,
                                40467
                            ]],
                        [[
                                119970,
                                40776
                            ]]
                    ]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/he_nan_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '4113',
                'properties': {
                    'name': '鰍栠庈',
                    'cp': [
                        112.4011,
                        33.0359
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lKl@nVV@?bn?@VVnm?nL?LXx@???VLlKVU?IXW?@??lbl@XU?UlwnW?L?w?m@??UVmnVl@nX?JXLm@VnnJla?I@VkxVb?@V?ln?J@knKVn?@∼aVanal@XK∼b???@??VJXI??VK@al@nV?k?@nK?a?b?@XL@blVVKVLXK?@VaVI∼mVaX@V_@a@yUkVw?V?IVa?J∼?@anIlaV@nKnX?m@wUUV㊣UUW?UKnaWwXUWm???V?am@kakIm?UK??lan@VXXa?W@???@UlUUa@a@UlwU?V@Xal@@anIVaUK@V?XmwVmUmV??LXl?@nalLnal@??nKlkV@@UnJ?UXnl@nVl?V@@VnJ@nUVVVVIn@Va?J??n@@K@m?k?a@kmWVaUI@a@?k@@aUL@mmaVIUKUV?@@IU@m?UmmL@K@U?UUU@mW@@nU@??mVmbk@klW@UXnV@L?Jm??lUnUJ?UUUW??@UnkK?xmL?a@??@@lUU?bmUVWk@@nkUmam@UakJU_?Vm@?l?LUVmVUwUL?KU@?k@U?VUlU@@U?@UaUUWa???z?J?aWLkl?b@bmL@?kK?a?bW?UV?_?@mV@b?JmXUbUK?∟?LUU@b@JkLWmkUWIkJ@VmX@JUbVXU`??VV?blK@LXKl?UV@Um@@Uk@kxW?kb?L@KkbmL@?UXmaU@@l@x@blX@xUJ@bULUlUL?@@V?nU`W@@n??U@@VmKUkm@VVX@@x??@bUbVb@VX@@x?LUb@l??XLlbUlVVU?Ub@n'],
                    'encodeOffsets': [[
                            113671,
                            34364
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4115',
                'properties': {
                    'name': '陓栠庈',
                    'cp': [
                        114.8291,
                        32.0197
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VllInJlknJVkVU@mX?lU?`VnV?VU@U@y?@nXlKV?nJVkXKWaXI?b@yVk?VUkVwn@?K@?nW@k?KlUXVVUlbnUV`n@V_V@llX@@V?b@bV@@nlVUb??WLnbmb@?nLnK?b?U?bVWnLlaX@VVUX@Vln@`kL@ll@VXVJ?IVl@X?J∼Una?LlylU@UXKlnn@lanLWWnbVI@KXKVL@LVWVL@UVKUIVWX@@X?J@In`@?lJVI@a?W??nK@UlK@UU@VK?nlm?nXal?UllLUbVV?knJ@nV@Vm@a??l@@xnV??lJVUU@?w@a?k?@XW@_mWnUl?UmVKV?@?V?XwW?X?WaUwnkWUk?V?U?U@@?@WlaUkka?IWVkm?xmIUm?LUV?aUI車?m@?mmwXk@a?mk???l?@w?mkLmmU@UbkUWJ@XUb?J@b@l@zn?mK@Xk@Ub@lm@?I@akmVKUUVUkU@U㊣JUbk?@IWmkx?a@UUV?UWVkIUaW@Ul?LWn@VkJ?I@VkK@L@bmK??kJmUUaUKWXk?VxnJ@?V@@VULV??@@UkaUlWL@U@W@IkKmL@KULUWULWKUXUJmI?b?K????UW?nWKUUkLU?mUUam@UU?@?mUL@xkV@?VV@bmV@Vk@mwkU?VUx@?mbX??nVb??UL??W?nUVLVb@xnlWnU@UVU?VVUbVVlVkn@llVUXUWUXVbUJ@bmLUJnb@nVK@bl@@?@bVJUbnX@l?b'],
                    'encodeOffsets': [[
                            116551,
                            33385
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4103',
                'properties': {
                    'name': '醫栠庈',
                    'cp': [
                        112.0605,
                        34.3158
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VVUllLXl@LWn@J??@b?KUVmn?L@`VblLnbV@?b@JmL@LnV@VV@??VJVnXL?@nm@a?@?a?k@m?I?mVbXL?ynL?k∼@∼aVJnUV@UVVXk@WJ@VXLlUnJVnn?∼U@?∼U?wl@?b?WmUX??@VLXU@m@U?a@I?mkb?a@?naWW@_@WXUV@@U???@?K@I㊣U@?kKWL車L?l?a@?Um@kWKXU@mlLXUVKUU㊣J?_@`UL??Wmk@Wa?kk?lUn?VUVaU?@KUU@mmK@_?a@KX@VaUIm㊣?k?aVKVUkw?@ka??W@kbkL㊣UUa?K@UUKVak??@UmmL@l?IkmU??@Ualw@U?JkbmIUmn@WK?ImWk@mUUn?V@??n?x?KmXkx?VWVk@ka???@WX?JUV@z??m?VWnbUbVb?LlUn??lU?n?WV?VWnk@@Vm@kxm@Un?l@Ll@@V@?Xn??kJV??V@nlVXx?U@l?n@a?@VLnW??nx?@lbVKXLl@??VL??XJl@XXl`lIXVl@Xl?XUV?K?wV@lanx?zUbVJ@VVX@b'],
                    'encodeOffsets': [[
                            114683,
                            35551
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4117',
                'properties': {
                    'name': '蚺鎮虛庈',
                    'cp': [
                        114.1589,
                        32.9041
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n@?b∼U??XnVlnL?@VL?m@n?@na@J??m@k?@lV?VxXX@?V`lLV?XVV@VV?LVV∼??@la?bnxV@@b?L?mlm?_VWnIWUna@l?L?bnV∼?VL@K?V?LVUVaVLXK@m?Xna@wVm?a?@Xw@KlL@a?@Va@wU?kaW?nIV?la@Kn@V?n@VUl@nKVn?J@LnK@aVkVUUW?@VakUVanI???X?W@UUU∼KnUVLl@XaVK@a?U@KUI@W@_lm@KkLUKV_U?@?@UVJ@XV@@mVL@K@U@Kk@VwUUm@kmWL@VkVkz?Kmb?V?I@WUk?JUIUWk@@klK@_km@UVWUUW@kbmKUX?a?V?amLmK@?namaXK∼?VakU@mU@@a?a@UW@kkU@U`m@U_mVkaUVWUkV?L@lmX@??Lm@UxVl?UUl@z?aWJXbWLUlmIU?kLmW?@@z@VUVU?Um?_kVW?@nUVUlmIklmIkJUk?l@n@Lm@???IUbm@UJUUVU@mmI@UU@k?mUk@Wm?VmI@VU@klmL??k@mbkKmb?@Wk?KU?VnUnnx?W@UVLUbmJ@bk@WbU@V?kx@V@bVbkV@V??@??XWbUWm@kb??VLn?lJlb'],
                    'encodeOffsets': [[
                            115920,
                            33863
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4116',
                'properties': {
                    'name': '笚諳庈',
                    'cp': [
                        114.873,
                        33.6951
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l?nb@xlJ@UnLlKXUlJl_?KnV@xVL@bkbVVU豕@?Wb@?Ubm???k?V?mbX?VJnUl@?a∼@@b?LVb?lXx?InmnLVw?anJ?w?IlmnXVl∼VVb?aVb?@lkn@VWnLlUVm?UUkl?k?VkUaVaVaUw?K@kkaVWmw?_??l@nU?VVb@b?aV@VV@zXJl@@kl@?l?k∼WVn?bnbU?VJ?I?@VKVm@k?K@_kK@a@aU@@wW@@k@aUW@IUWVUnLlUlVXKVwmk@W@??VWa??@k@?l?n?UI?KUaU@?UUVmIUV?Uk??Vma@?k@Wanwm??@@?n@@?m@UIV?kUVamUXW?aV?U_?@?mUVUImW@aUI?K@VmI?b@lU@@n?J?kU?@K?IUmmLk@UVm@U?m@@LkbU?mJX?lbV?@xUb?@@bkK@LWx?@?bUn@xmb?W@nWLUKUbUV?K?U@LUK??mU@?VV@xULU?VL@bU`W?Uz?aUamKUa?@@xkX@x'],
                    'encodeOffsets': [[
                            116832,
                            34527
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4114',
                'properties': {
                    'name': '妀⑧庈',
                    'cp': [
                        115.741,
                        34.2828
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XVl@lL???@VkV@V?Uan?W?X@Va???@?aVX@xVJXU?U?aVL?bXKl?V@?m∼Vn_ny?XX?mUk?lK@a?_@y?InaVKVa∼_@WXI@?@K?VnIlbnaV@?l?@?a@_?w@?lwUKm?Xa@UV@??V??w@kUKVUUm@w㊣VUXUKUwmJUU?@?km@@㊣mXkmUI?@mm?KUwkbWakLWaUIkJm??X@l?@@VUX@JWbX@VbULWb?lUVULknlV@bVJk?mb?KknWmk@@nmVkx?@?VmU?KUnUL?@?JUIV?ma?aUm?X?l?kk@@lk@WI@yUUU@?b@aUa?UmVk@???`nxUXlb@l?LVxUbUbVbUll?k?Vl?VUnkVmKUXm@kl?@?nUx@xnx?n@`VX@V?x@V@b@?Wl@zU`V?UVVb?L@V?b?W@bkXllkLWV@V?@VV?wlV?@@X?K?Llb?Wnn?L@VnJWn'],
                    'encodeOffsets': [[
                            118024,
                            35680
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4112',
                'properties': {
                    'name': '��藷狤庈',
                    'cp': [
                        110.8301,
                        34.3158
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@WKUmUI∼?U@@UmU@KnK@I?aU@makKUa@_?KnmVU?L@a??@IXm@KWkkKVkUU@aUW@UUIVa?ymwkbU@?x?LVU?WWkk@WUkJk_WWk@WI??UK??k@WKULka?@mw??mXUK?@@b?m@k?VWwkU@m?UU?lI??Wm@?@Uk@@K?kVmn@lwn@@Ul@Xm?UXUm?V??km?kV?KUaVamaUXn???@ykLUK??@?Ww?KmKn?Um@Um??aU@mUk@kL@l?x?xUnkVmnXxWb@`kzWJ@V?LmVUn?lmU?L@lW@Ub@V?XUb?`VLUbUJ@nmnUlUUm@@bUJlnU???U@lxkb?@@X?JUn?@kb?VVVmlXXlJlzn@VlkVW?@bkK?bm?k?UbVb?l?XVx?K?n?w?l?Kl??VnKlwX@lL@xlUnVn?@?l@lmX@???b∼??wVJlx?_∼x?a?l?U?xlUnbVxnL@lll?bm?n@nb?@@V?L@V?@@?VL?JnIVVlKnV?_'],
                    'encodeOffsets': [[
                            114661,
                            35911
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4107',
                'properties': {
                    'name': '陔盺庈',
                    'cp': [
                        114.2029,
                        35.3595
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XVlL?K∼bUblbUb?l@nX@W?XVVKVk?@@?mb@?Ubn?W`kL?L?V@VVLnKlVXIlV?@@a?@l?nWl?k?Va?@∼bnUlLVlna?bnUVUXKlU@?@?lk@a?I∼y?@?kUU@w?m??nkWakml?UkVmkUlmUUm@nkUKWanamU?LXW@U?VnUln?`l??blL∼KXV@??J@L∼??J?UVw?anK@UUImm??kK@?㊣U?m@IVmUmm?n?WaUK?aUk?w@W㊣k?V?x?U?V?w?n?JUIWa?J車I?bm`?b?ImJUI???@mU?U?JmnUV車Ukl㊣V@zXl?bWVXL@bm?m??@@XmJUXU∼llk?@nWJk@U?@?U`m???Wx'],
                    'encodeOffsets': [[
                            116100,
                            36349
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4104',
                'properties': {
                    'name': 'す階刓庈',
                    'cp': [
                        112.9724,
                        33.739
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l∟UbVL@V?LVb?VlKlaX@??lb?@lxUVUL?b?ln?VJUbW@@L?b@`nL@nVV@LV?UbUVm?kVl??lXbl@Xn∼?VK@_∼`?IVVV@VUVJnInaWK@U?@?K?L?@nmlXXWVUUw@klKVa@knyVkVanI?JXUl@XbVUl@@a?a@mXk?bnK@UlK@UUUVaXaWmkUm?n?WmXaWa?kl@Vm?b?KVL@aVI@mUwVm??@K??m谷UL?KVaUk@kUK@U?WXI@VlKXU?@VVnInVV@VLlK@UU?kKU_@?WWUwU?@kl?n@??@Imb?@@m?nUK?@mKUkWVXxmbVLX?VVU?VV@x?nmWmLU@kbmJ@b???IUb?J?UUxVl@z@bU`W@Ub?nUJUb?@WLUKULkU@aWK?@?a?bmL?@?lmUk@@bUL??WJUI?∼?@???aWLk@mbUb?b'],
                    'encodeOffsets': [[
                            114942,
                            34527
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4101',
                'properties': {
                    'name': '痑笣庈',
                    'cp': [
                        113.4668,
                        34.6234
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@nWVUK?@W?nVnI??V@?k???wV@?nn@lx?ln??J?zXJl@nalU?Vl?l@?Ulk?VVUnm?I∼VnV∼@∼?VJnI?J?an_VmU?@ama?@kU??kaUklw@?UIV?kVUI@?mmU?mU?l?wVU@amU?JWbUakV??V谷?Im`?k?@?wVWmLkU???XkWmLmx?@UU?bm@@x?J@L?bW@UUVWUkVK?@ka?IUamKUkkmmL?UkJUVWXkWmn?@?K?L?@@VXLmbmJUIUVU@ULWVkK@nWVXL@lVn@∟?b?k?KXKlL@??V@J?L㊣@??@VU@WV@X@`XXmb@??bla?n@J?b@V'],
                    'encodeOffsets': [[
                            115617,
                            35584
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4105',
                'properties': {
                    'name': '假栠庈',
                    'cp': [
                        114.5325,
                        36.0022
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼kVaV?k?VmUkWk?WVkVKUwkkmKUU@a?wWWX?WakKWkXmla?IVmX??U@a?@W?nK@k???V?I??@K?I@?WU?LkK?ak??_kmmV?U@VWX?KnVmbXbVLmln@VVknlVUnVlk?lnXbmlmlXbln?lWbn@@n?K@V?L?bVV∼VVz?ln?@V?x?I?b??U@WLUa?V?UkW?@?kk?mxk?l??XUlVbVLnlULmU@l?LkVUl?X@xW@?mU?@UmIUW?L@aXa?kU??an?Wk∼@k?kKmmUIWa?ambUkkKmV?a?@Ubl?k?mXk∟?@@b?@UbULWVnb@lUVVnm?nVVU?J@bWXX@WJkL@blVU∼UV@XlWnXUbW@UVkV?VWbnLUJWLUK@Lnn@blVU??nUblxVUVJXU?a?@Ub?LnUVV@mVIVVn@UbV@??XbmbUV?_lVXUWanJVI@WkI@WVIVU∼WXXl@la@mX@lLXl?kVb?m?X?ylIXJV@@k?Kla?UVa?IVy?b∼LlVna@U?KnLVb?K@anwU?'],
                    'encodeOffsets': [[
                            117676,
                            36917
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4102',
                'properties': {
                    'name': '羲猾庈',
                    'cp': [
                        114.5764,
                        34.6124
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lUVbXa?InV@bUV?x?knVV?nn@?VJlUU?VJ@?kxVllb??lV?@nb@bV?Un?a?J?IXbVJ?I?m?x?U?V?w?U?l@X?xVl∼bVLXb?`XklUnmVblL?@lm?x∼LVK@UXIVa?WlL@Uk?∼Kk?VaVUXmmI@U?Kmm?Xka㊣K?L@W?@kU?xUU?@@UXUlKkklW@a?X?a@U?KUaVUU?V_@yXk@?@a@U㊣w@UUW@_?mmw@wVw?mUa?bUa?UUkmWkn㊣J?xmI?bUxmKmn?JWw?kUa?K@a?@?bk@mVUIW??Lmwm@Ua?@WJUb@LUl?@UUmLUbWJ@V?L@VmX?WWzUJU那??'],
                    'encodeOffsets': [[
                            116641,
                            35280
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4108',
                'properties': {
                    'name': '蝴釬庈',
                    'cp': [
                        112.8406,
                        35.1508
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V@VL@x@bX?WV@Xk??lU?WX@J?@nI@KlL?K?UVaV@?JlL@KUk@K?L?l?_?@nWlL?UVV?@nLWVUJVn@anV@a?w?UVLVx?b?@lW?@lbXn?Vn@@??L∼m?KVn@bnl@nVK@blb?L?W?U@VWLXV@nlKn@lVVbXw∼?n?V_@?V?l@XI@ml?kkV?VWnI@W?@n?n?@aWKXU?aWk@yk@k??UkVmbk@WI?y車Im??kkwm@?mU@?x???lU@??mJ?X?ak@?x?V@??Vm?UmmIkVWK@UXIl@UWVUU@mVUI?b?@?lmK?zWKUa?n?J@n?l?b?@@b'],
                    'encodeOffsets': [[
                            114728,
                            35888
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4110',
                'properties': {
                    'name': '勍荻庈',
                    'cp': [
                        113.6975,
                        34.0466
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lI?VnKlnVlnLVb?Jlb?@ULVlUXVVX@?a@K?I@wn@?aVV?@nwnKlX?W∼?lVnKUX?x?@?ln_∼JVIXy?XnW@U?K@UXIVanKVV?@Vk@KVaXI?@Vbn@nx?KnaU?l???n?Va@?Xa@?V?UUla@aUK@wmU?Lk`kIWVkLmK@V@XUl?n@JXV@nm??bU?車I?mUa㊣@@?車VUUk@U?lKVU@akWVUU?lUUaUK@UUKWbUk?J@XWa?@XbmJ@nUJ@bUK?L?aUnk@?lXbWbXnm?n?lVXnWbUbVV@VkL@VmL?aWl@n?b@bk@UVWak@WV?ImJUbUlmz@lUbkL@lVx'],
                    'encodeOffsets': [[
                            115797,
                            35089
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4109',
                'properties': {
                    'name': '憪栠庈',
                    'cp': [
                        115.1917,
                        35.799
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lLXbW?XX?x@bVVnLllVxULUl?XXlVlUnl?U?Ub?l?n?K@V?bVb@?XbVL?KVxVVnIla?b?a??lU@wnalLnVVlVLXnlWVXn@@lVI@WnU@m??W??aW_k@WwXy@km?@wU??m?????lUxVLV@Uw?J∼x?@VX?@Vb?@?`VX@VX@ll?IVbnJlI?b?V?l???J@???m??L車a@??KUa?k???X?@UK@wU@?lWUU??ImW?a?LUKU@?k???k@m?w?a@UnKWI@?UU@akVWK?k@a㊣??b車UWKXUmk?KU?mL?bUx??@lmLX??@@b?VW?Un?JkbWnXl'],
                    'encodeOffsets': [[
                            117642,
                            36501
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4111',
                'properties': {
                    'name': '僽碩庈',
                    'cp': [
                        113.8733,
                        33.6951
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@L??UnVxnIWa?@Xb@W?IVlXaVL@VVLVbkVV?UVlX@bUVkLV?l@VV?U@??@Vb?n?JV??an?@mWU@I?mVk@WkI@wmak?@wlW@w?@VbnLVb∼bVyX?V_@aUKV?VK@wUU@??a?K@kmbXVmJUX?`kn?n?K@aU@mw?akb㊣@??UU?KUUU@WU@VkLUKU@mUmJUU?@WVkL@UWJ?X@VVL@lVlUb?LVKn那??'],
                    'encodeOffsets': [[
                            116348,
                            34431
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4106',
                'properties': {
                    'name': '禍族庈',
                    'cp': [
                        114.3787,
                        35.744
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@車??n@xVV車l?@?z?J@bkl@?@?kVWLUVmVXbVJnnlLl??@Xlm?∼bV??lWb@b?KVXnJ@VV?∼nX@@w?WVklU?K@knVVKmkUKUaVk?Wk?l?nwl?∼l?@lX?V∼UVbXKV@???a?J?w@Um??kUy?UUU?a?K@U?L@mm@Xa?kkmWank'],
                    'encodeOffsets': [[
                            117158,
                            36338
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/hu_bei_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '4228',
                'properties': {
                    'name': '塋囥芩模逜醮逜赻笥笣',
                    'cp': [
                        109.5007,
                        30.2563
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VK?bX@lbUVnL∼?@VlVnUl@VUX@?aV?maX?la?UUU@wmaVUn@V?nmmk@m?U@kna?aU?Vam?X_@W?U??mW@_k?VaVKnL?l?@V?Val@k?@kUW@kUKVUlUV??W@k?aU?Va??lmkUVUVak?@a?V?_@W?UkmVUlU@a???alI@akkVWUaW?XUWw?WVb?@???l?alIVK@U?m@?UU?W@al??a??Ua??m@?bkk@w?@@W?aULmx?IU????b?@U`UX?JmL?a?K?X?WUL@aknmK?@?aWUXaWm@I@U?mVU@??aUV@b?V?I@WkU?bXkm@VakwUKULWKX?mJ@XUK@?mL@KUwVaUI@KU@mmn?mXka@?V@@UUa?w?yVk@?UUVmmk??U@mWUnmx??mlUbV?Ul?bWVUL@UU??IUm?KV?VbUVVxkn?LUxV`VX@???kJVVUXWaUVVlUnmKUbkI@WULmK@L@LVl?LnmUIWV@akn?`VXUJ?IVlUVVbUX@∟mbnLm?m@UXk@mm@Uka??@kV@@KkU@aUKWbkLWVkIV?k@UbVlmX@bU@@mmL@bn`@Ln@llVLVk?@XVVU@`VXU???k`V?ULka@VllVIn∟V?U@@bl??bkx@bkL??kK?n@bn@@b@JUnV`UnVbVKlVXUlbn@∼?Vx?@@b?nVbUllVn@V?VK@UnW@UVU?lnk?V???xVb?VVI?xVa?@@aka@UVaU@@a?k@Wl@nbVI??@Jk@?L@VlXnlla@?VJnw@UmwXU@aVK∼?n?llnLlb?xnKVaV@l??nVl@llL?x@XVV?????@na?x@U@al?XUVa?L??V∼XxWXkK@?mLnlUb@b?xnLVlVVkb@?UJ@xWXX?'],
                    'encodeOffsets': [[
                            112816,
                            32052
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4203',
                'properties': {
                    'name': '坋桋庈',
                    'cp': [
                        110.5115,
                        32.3877
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@@a@w@kV@nbVK@?nUla?@la??l@nlVakwWX@WkL?aVm?wV?@anK@UlIXmWkk@@mmLkWlwk@U_mKXwWK@U?K@UU@?VUa?km?kI?yUUVUmanU@mlwk?@_mWXa?UWU?@??@U@aUaVwUKUI?VkK@UWIX?maV@k@Vm@Unwl?Uamk@V@?ULUamxUJkU@I?`WkkK?XWak@@W@IUV?LWJkXka?VUK?@kUmbmUU?UK?bkKWUkI@?kK?@@a?Um?nI@m?U@UnWV_@aUmWbkLUl?b@a?kk?k@WkkJm_k@UV㊣@?J@b?nU@@W?IUJVbXL@nlJkx@?Wn@VkJmb?LmU?`VbUL@xVn?@XV??@?mVVnnJVbU??x@?V?nVUbVV?x@?n??bUK@b??@b?J??m??VU?lbXzVJV??JVbn@@Xmb@V@bVJ?@?Vnkn@∼aVVV@?X?KnalLVm?UnnVKVlnLWlXX?Klk∼???X?W?kLUVVV@nU@ml?nmbk@W`?@mb?LWm?U?xn那V豕k@mb?V?nUK?@kKmXk@@JUI?l?LllnbVnlJ@LULnl?aVLn?V@nkVJ?@lk?@?b?m∼w?L?WV@VX?K?VXI@W∼??V?K?b∼U?JVIVV??XKVL@l?InaV?nUl@@bX@??nmVL@lVL?lVLVUnbVW@xXn?b?U∼∟V@???a@kWKUUn@VlnL@UV@??@mX@V_?aka?@VK??@kkW'],
                        ['@@mUkUUm@nllVKXXVK']
                    ],
                    'encodeOffsets': [
                        [[
                                113918,
                                33739
                            ]],
                        [[
                                113817,
                                32811
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '4205',
                'properties': {
                    'name': '皊荻庈',
                    'cp': [
                        111.1707,
                        30.7617
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼`?U@bl?UbUVlVkn??UbV??b@l?XU?kVUVVL@lVX@ll?k@UbU??@?kmKULUbl?@`nX???V@XW`n?UbV??bmb@l?V@nnlmnU?m@UVnb@xVV?VkbW?nb?Vn?Va@an@UaVU?JXnWlXX@l??@?lK?X?bX?V@VV?@∼?∼xXx?XV@nV∼UVWU_VWXkmaV?nWVkn@lln@lb@UVLXWlnX@?aXUmaVK@UXU?U@WVI?W?XXV?U@?VK?@?U?????a?LlV@kV@UanKma@UVUnK@UVLXyVL?knJ@UV@@UXKWUXaV@Vb@mVLnKW??m@aUUm@@UkK@Ula?LXKWaXI@alKlmUk@wVKXL@m@?WWn?@UVa@K@wna@aW_XWWkXbVW@k@U?WWwka@UUaVIV?kU@m㊣@U@@wVKka?_@VV@XUVwU????yUkm@?V㊣?UKk??L??m?mLk@車?kmWw?m@U?Ik?WKXwWU@?kL?wkbma?bkK@V?LkmWIUKkUU??I?J?X?JULV??LUV?@UK?@kI@WVI@?Ua?WmXVVUL?`㊣k?LmKk??k???@Ua?XXxWVX?VbUXll@bkJ?b??@bkVUVln?V@X'],
                    'encodeOffsets': [[
                            112906,
                            30961
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4206',
                'properties': {
                    'name': '盷榆庈',
                    'cp': [
                        111.9397,
                        31.9263
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@@Xl@Xb∼WlLXl?_@JlVVInwVbVK@?@UnlVbk?mx@VUnl@U@nbW?XJ@VlL?UVJVLUxVb@b@V???@XV?VWbnX@`l?kx@nmVnbUVVV?zlJn??lVb?UV@@V∼L@VXLWxnLV`l@kxlXnK@nl@XlWn?`Xnl@@UVa@V?K??VLVanW∼U@UVU?@?`VIn??mV@?nV@Xa@aVW@U?alkXK?blI?y??XnlJXbl@@VV@nklU@`?nVK?LVKVb@V?U@U?K?UVK?IlUX@V`lIVbn@nblVVmV@@XXJ?UVV@knKVn@`@X?VnK?wlLVmUUU@?U@aXL@WlU@UUW@UmU@KkLWaXkWmXUWm@U@?nk@UmK@U@U?aU?VUUKV_@al@namWUI@KU??K@aV?@WUI?b??ULUJkIm??K@U@K?V@U@a@UkU@K@wVaUwlU@mU?ULmKUkV@@anIWmUK@I??mKkl@LUb㊣lUakLmk?@WwUK?VUIm`?n@Uk@makJU_@??Jma?ImwUVkK?b?aU?@wWaU@VU@mXIVmmUkJkwm@mI?lUKWzUK@VmLUV@VnbmLVbU@@lkU㊣K?b?????V?@UL@??VWU?W?XUJ@X?VWV@VULnbWV?bW@kmWXUK@Vkam@kkm@UlmXU?nbWlUXV`UX?VmUU@Ul@Lll@nnJ@L?n?Wmbm?@b???`??',
                        '@@kUUm@nllVKXXVKmU'
                    ],
                    'encodeOffsets': [
                        [
                            113423,
                            32597
                        ],
                        [
                            113794,
                            32800
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '4211',
                'properties': {
                    'name': '酴詳庈',
                    'cp': [
                        115.2686,
                        30.6628
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VVUnWVXnVJ@??U@V@VX?V@@IVJU?n?@V@L@KlIVlVanLVbnVlI??n@@a@Kl@@I?JlI@aXU@KlK?kVblJXU?VlU@V?bVkVKXn@VlxVa?I@VlVUxln@b?JXklaVWnLm?@y@k@a?I@W@aXIlVVaV@nnlKnLVW@IUa@a@K?UVVlI@wXKVV@IU?la?@lUXwW?n?nalLlxXLll∼@XwVKVaXIl?nb?@nln@Va@U@k∼?Um?UVaXI?JV??U?mmkU@Wa?Kmak?Vm@U@aVKkkmKkVmIk?∼?@aUUVaVVnKlkX??mk?@?lUVaX@@Um@????UmlUXV?UVU@w?K??Ua@I@UV?l@U?V㊣UIU?∼?VkUmVI@a@U?m?????V㊣b???a?L?lm?kX@?車?@?m??那?b㊣WkL?n@xXx@?@b@V@LW@Ub?l?X?`kxWnX????V@L@JVL?xkK@V@bkz∼l?lXz@J?UlVla@XUV?bVKXnW`XXV@laVV@V?X@V?x?x@xULVbUJ@n@LU@VmmakbUK@b?IWWUUVkUmkLm@VJkb@nUJ??@`V@kX?aUaVmmLkUmJ@Uk@U?㊣lkzmJUb@b?VUxVXU∟?L@J?X@VlL@JkLUVU@mnUl??@V'],
                    'encodeOffsets': [[
                            117181,
                            32063
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4210',
                'properties': {
                    'name': '麾笣庈',
                    'cp': [
                        113.291,
                        30.0092
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?JV?lVVLXJln?K@UlL?anbla?xlK@?XVWxXLl??J@V?nXxln?∟l@nKn????Kl?VL???Un@Vl?z??V?UxWVU@@U?`lbUL@xV@?@@nlVU?UJVb@VlbXx∼XVWX_VKUwVKVa@UVKUUVk@KnblaUU@wnWl@UX@l?@@a?IVmUk???xVJ?U?b??@Uk@WWnk@?V???Vm@I@m@Un@m?XUlVlUnJ@knJVU∼@@a?LX@?llL@?nJV@XblLVa?U@UlW?@VX@`@LV@@bXJlIXml_lJ?U∼b?K?LnVVl?@??V??mXaVI?llUlVnLVlX@@b?a?nnx?V?L?bn@∼???Xmmk???w㊣????U?@?K????????Uw??m???k@W?kV@?UIUJW?kb?U?wk@W`@?U?nb@V??l?@VU@????UWWnU?UnmJkU??VWUI@aUU@WkI@U?a@JW@k?kaWVUKmnkK?b?kkVWb?VmUU?mwU@kk?@UakUUa@V@nlx@lUb㊣lUbnnWLUyk@Uam?UK?@mlk@Wb@VXL@x@xWI@a???V@bVn@LkKmL@`?XmKmVU@@bkL@V㊣bk@Ua?a?L?KUV?I???W?X?amVVbUK@b@Lm@UWkxULWVUnm@UlUX'],
                    'encodeOffsets': [[
                            113918,
                            30764
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4208',
                'properties': {
                    'name': '麾藷庈',
                    'cp': [
                        112.6758,
                        30.9979
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n@lxlInVUnWJ@nUVV@Xb@xV??b?alLVUnx∼Jnb?I@?V`lInbl@@V∼mn_VJ?UVLXx?@nllKVb?kVa@KlknL∼?@JVLXnmJ@bU@VlnLVKV?@nX@lU?KVaXal@VKn?@?∼L@Unw?bna?V@KV@VUX@lVXI@KW@@IXWV@laVL???KlaXUVVnkVWV@lwXblIXWVkVm?aU?VaUmVIkU@y@?WakKUamU@UUK@kmK@w?@@?mK@L?V??U@WwkmUL?amV?VUU@??I?bUKUa?km?m@UakLmxU@U?WlUL??mwkIUm@a?k?blW@U?V?UUk@JW@XkWWUkUKUIlw@aUWknWUUmnIW??aUwVa???a?VUI?w??VlUn?J@b?@@kVWk@mX@xVVkbma@LUlVVUL@VUbULVxULW`UX@V@lUXWaXlWXX`@bmb@x@LUb@Vm?XX@?@nWKUL@xVlknkL@bWJXbWL?Kkb@VlL@Vn@VV@b?nX?mLUK@nUaU@WbXVWL@VU@@V'],
                    'encodeOffsets': [[
                            114548,
                            31984
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4212',
                'properties': {
                    'name': '玶譴庈',
                    'cp': [
                        114.2578,
                        29.6631
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???L?@?V????∼x??nlWn????m@?a?K@??∼?n?J?wn?VIUa?J??@w?wV?XW@aV_l@?V∼l?wlaXL?wlUkalVVaX@lVXI@a?UXJ@U∼UU?VIVKV?k?lanLVa@V?IV?V@nk@aVa@mV_@a?K@klKUa@UnKWk?@@lU@@UW@@nUWUwmaVIX??lV@mLXblJ@kV@kk@KU@W?kUWV?wkLmW@UmL@lUL?KUL?ak@maUU?wUJ?I?b?KUU?@???aWK@kUWVkUwVw?@?m?@?I@wkW@a?w?w@LU??k?J@nVJ?IkVVnkV?UkyUIUl@xWUkaW@@∼kz??WxkLUWmzk@@bVVV??b@?@XlV?@Vl@bVbUn?`Wn?@Wb?VVI@`?LVbXLV`mnU@@l?L@LU??ak@?Lk@WbUJn?@lVb@xVb@n'],
                    'encodeOffsets': [[
                            116303,
                            30567
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4213',
                'properties': {
                    'name': '呴笣庈',
                    'cp': [
                        113.4338,
                        31.8768
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@n??`lw?k???UmUVWX@lk?@VanU??V@@mX@@nVV?VXLmJVLnK@b??V@@J?@VUn@VaVUUUVWVLV@@Kk_@alm?aVkUU@WV?VUVLXmmk@wUaUKUV@?∼?@kmaUa?mW??mU?VklaX@lVnxl@@UnaUk@?VUVwVK?n?@VVn@VbVJUknUmmVmk_Vw?KUUm?Vak?@UVKVIkW@UmIVWkIV?kmmLkwmVU?@L?UU@VVXL@JmLUbmK@UUKm?kKUUmVUaUn?lk???mJUnmLUaUJUaWL@UkJ???U?@?aklkU@?@KWLUmUUWVkb?L??UKkbU@WX@JX@@LWJkUW@UVU@@L?Umb?amx@V?K@?m?ULk@WbUb?LkVW@kVVxUb@x@LlV@V@b@V?U@L@V?Ln?lJVIVK???aVJ@XU?@b?LV?@LVJnXmbk@@bU`VLUVV??b@V@VnL@Vml@?@VXnWVXnWlXblK@LnV@VVX@VkV@XWK@b?VV@VV'],
                    'encodeOffsets': [[
                            115830,
                            33154
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4209',
                'properties': {
                    'name': '苠覜庈',
                    'cp': [
                        113.9502,
                        31.1188
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VnXK@L@∼lVlk?b?@?V??lI@VXKVbVIVbnKVmnI∼?l??kVmVbnUVVlLn?VL@VnLVanK@IWKUUV@?V@KV?nUlxnKlnU?lJUXnJ@VlXUJUL@Vl?Ubn?VV?LUxl`UnnnmVVln?VK?b?mVX@a∼?∼L?aXJV@VUnKVXVK@LnKlLUbVVX@VwVJVn?@@UU?V@@UUK@?maU?V?UkkJ@L@K@Um?V?UI@JU@W?@U@U?V@?UIWmXUVmUU?@UVmI?lmnmakK@akaW@UwVUkKV?nUlKVwk???V?U_WKUkVW@UXaWkUa@w@?VU@?XaW㊣@Ikb?K?b?L@W?XkW?@UakL@UV@UmVUmL@UXWVL@a?U??VUUUVU@yUU?IUa@wUKWVU@k???Wk?UkwVK?LUx?K@nVxUlUUWV?Umw@w?UUy?XWlX?WbUV@?U?@blbUVVbXX?l@lVL@bk@lxkVVnVx???`UnkL@V@L@??@@xnL@lVL@VnVVblLXb@?@zlVUJVnUbV∟?bUnUlWXkJWakxU@UXml'],
                    'encodeOffsets': [[
                            116033,
                            32091
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4201',
                'properties': {
                    'name': '挕犖庈',
                    'cp': [
                        114.3896,
                        30.6628
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nbnm?knJVU?@@U??VknmV@VUlK@IkK@U?W@I?KV?UWVw?U@aVanIly?kV?l@@VnIlVnKUnVb?blWU@@_??VI@mlaUIn@lKVnUlVVXX?J@aVLlanbUnV@@K@mVIUaVK@w?w∼w@U?W@UUUkbU@WWX_WmUL?aVU@WkbkU?V@IWy?k?kly@a@UlL?wUK@I@K?UW@??㊣U?m@wl?ka?@@_Vw@??a@akw@?kKW?X?VUVwVwUaU@VUU??xWKkb?x?k㊣Uk@U`@bWXU??x@x???IVbUJm??x?I?m??@??Umx?nUVVbnJV?@L?@@?kV@bVn?@UVULlx∼VXl??l?V@XUVL@xVb?JVV@zUVVVUV???V@bUKWX@VnKUVVnU@@VlKVb?@lX?W@X∼K?a?Lla@JX?Wb@?UV@?@xVbXlWb@VUXVlXLV`U???l?UxkLmVU?lLUVVxX@lb@blL'],
                    'encodeOffsets': [[
                            117000,
                            32097
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4202',
                'properties': {
                    'name': '酴坒庈',
                    'cp': [
                        115.0159,
                        29.9213
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V?UVV@VbUx?aWU?blUVmnKlX@bXJVIlVUxVVVIU??zlx??@?VbnL@x?x@UVaXK?b?@Xk?WU_Vm?klW?XVK??l@nXV@@w?mlK?X?a?谷n?@???@?lWn?∼kUKmmU???Umm@?wkImWU@UakL@bVLUV?@?bUK@alIXKWK@?nXnKmkU?Vw?@?b@L?lUL㊣W?n@KULUaW@kL@l?L@bU`@nUb@bmlU@U??J@UUbmKkbl?U?ULUJV??V@VWI?V@bWJkUW@UbkUlbkV'],
                    'encodeOffsets': [[
                            117282,
                            30685
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '429021',
                'properties': {
                    'name': '朸觼殤輿⑹',
                    'cp': [
                        110.4565,
                        31.5802
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n`lIXll@l??l@b∼aVklKXaVn@bU`mX@V?V@nmJn??V@b?@lL@?lJXVlL?aVLV?nVnalV?@VL?UlblWXI?KVU@J???_??@an?na?X?m@KmI@mkk@KVk?WWw?w?∼?@UUU@W??a?WkL@???@kWWXkWm?IUVVbm@@bUbm??UU??bW@UVk@mVkU@U??mKVUkaW@?aUL??Vb?b@V?@Un@V?LWl?L??'],
                    'encodeOffsets': [[
                            112624,
                            32266
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '429006',
                'properties': {
                    'name': '毞藷庈',
                    'cp': [
                        113.0273,
                        30.6409
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@K@UlKVm?_??UwUmlUkwl@@aUK@k?kWWUaVUka@aV?@?VUXaW?Xk@WWIklm@?xmI?V?Ukxka??@bWJ?aUL@?W@?l?UULU??b?kV?Ua?bm∟Un?UkmU?Ux?b@VkX?a?l@bVnlJnx??VKXkV?V@nwlKVbn@n??lVbVL?a?J@?VV?UnU?bVKlnXxV@∼??U@KnL'],
                    'encodeOffsets': [[
                            116056,
                            31636
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '429004',
                'properties': {
                    'name': '珈朊庈',
                    'cp': [
                        113.3789,
                        30.3003
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VK∼V?kX@@?VK?bXI@a??lblw?V?UnJ?wn@lkXJ@X?WVz?V@xnx?VXUVVVkUw@m?LVw?KVU?@Um@alU@??@@KU?mIUaVU?mnwmw?m?b@aW@UkmKkUkV?kUJWb?nU????@UkmU?K?L?a?VkIk`WnkJ??@xVLUVVbUbk@WlXbm?VxnxUblbUV?@@VUV@nVL'],
                    'encodeOffsets': [[
                            115662,
                            31259
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '429005',
                'properties': {
                    'name': 'Д蔬庈',
                    'cp': [
                        112.7637,
                        30.3607
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@UbVx?bX?mJVnXVlmVX@bkxVJVLVlXXWlX@@IVl?V?U?aVwV?ln?VVmn?∼aVbU??l?aV?UK@mVU@U?@VUkaVamwUwn?WaXkl@VaUaVUUK@w??WI@aU@@K@_UW?@kX@V㊣VUbkKWaU@mI@?kK?kW@?K@b?@UVmI@lmIkVkUWVn?m@@V@n@JUn??U?@?mlXXl@@V'],
                    'encodeOffsets': [[
                            115234,
                            31118
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4207',
                'properties': {
                    'name': '塢笣庈',
                    'cp': [
                        114.7302,
                        30.4102
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼?W車Xmlw?_?W?kVaX@@K@U@a@?WwU@mWk@??UL?WkX㊣lUnV`?XWl?@?aWLUb@V?w@wmKUa@?∼?kw?yV?UJUUVwkUUJWI@akWmLUnkV?aXV?bUxUVW?X∟lL@?lx@b?b@?Ux@`?@lbk?@x?n?V??X@'],
                    'encodeOffsets': [[
                            117541,
                            31349
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/hu_nan_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '4312',
                'properties': {
                    'name': '輒趙庈',
                    'cp': [
                        109.9512,
                        27.4438
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@@n??@b@XnJ@k∼x@aVUnl?UXnV@@VnJW?UJV?nIVV∼?UbVVVL@??LU?Va∼V@aV@nm?UXblLXWVXVmVLVK@an_?`@X@l∼?VlXXW`nX@Jmn@b?@nV@Lm`?bUb?n@VUVl@nIVbUl?V@LkJUnVV@xVblVUbU@?zUKU@mx@xUnn@@WV@lbUb@?nVWXX?V@VIV@VUnJ@VUz@JWbXllI@VXVVL@?Vn@??Wlb@???l?XVlL?aV@VJ@XX`?kVwVl@bk??bU?lVXIl?nLVa?mVwV@@nV@XaVJVbX@lwV@n?@nV@VWnIVVU??@Xx?a@I?UUKmk@mV??IXmWU??VJnUVU@anaVwk??U@UXa@W?@m_@a?@@K@UV??bnK@blIlbXa@WW_n@V?U@?bmy?Uk?UJ??@W?U@kWK?w??nm∼KVkmankVWnXVWV@U??wXkV@m??UlLna??VaX@VUn@VnVK@xlnXW?U@a?@@klak?Vw?mUaV@?wmI?`m?@mVUXmlIX?V??I@K@aU@UaV_UK@wkUmmUKWX??mVkU?L@m??U_nK??@aVU@Ukak?@U??@ymU?????UU?VKkam@?nka@?mwkLWb?mka?_VaVKU??IUw@?kKm?U@WK@Un?maULkU@wUalWV?U@@WUI@WU@?_@W@U?@m?U@Wb?bUK@Um@@UmbUw?WWkk@WU?a@anUUwlWUwUU@wlJVUnnV@@mnI@m?K@U@w?a@wUm@_m?VUUaVUk????_k?Uk?VWL??@mlU@kn?W@Uw?UWV@V?U@lXLWVUbVLXlVIl?knmU@VUJk@@??@??kVmwmVkxU@@XmVUb@xnKVLl@VxUxkIU`@bWVXX@JWL@bkb?∟@bmUUU?K?kmb@V?VU?VVn@@?Vb@`ln?xmb?lUn?bk?@xU?mV@bmW?bU?V@VJ?Il@nVUb?K@nn@VbnJVIlJVkXJ@X@lmx@bnnWVXJWXU@UlU@m?k@@llb∼x?IUbnJ@VWbXVmI@JVX@bk?@bWL@JUXUK@U@U?`n@@Xm@XVW@@nX@@`?ImxU@@JUI@K?LmK@U?UUV@VW@??kUU@UamVUUmJ@n?xmL?K?kmJkwkKm_mKXU@a?U@b@Wk@ma@zUJVUmbUlU@?xnXlWlXXblK?∟V@@nUVVLkV??l@Xb@VVK?nXKVx@znW@X?@@lVK@X@JXbWbnn@JUamLVVXIVxnK@aWUX@?x@VnI@WlI@anV?IVxk?l@lbXX?xVVVJVInbV@@ln?ml@XXVWbkJWb',
                        '@@XLVKVXVKUa@UUUmV@l'
                    ],
                    'encodeOffsets': [
                        [
                            112050,
                            28384
                        ],
                        [
                            112174,
                            27394
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '4311',
                'properties': {
                    'name': '蚗笣庈',
                    'cp': [
                        111.709,
                        25.752
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lxUXV?lXUVnlV??JVbUXVJV@XUW???VIUK@klW@Un@?nl@V`XUVL@l@?Vx@?XXW`UnUb?xUlVnU?V?lb@VnJ?UVVVInJlU?VnwVklKnw?LVJV?V@nIV@nbVa@KVVVUUa?KV_nVVJ@_VW?nV@n?lI@an?l?X_VKlwVlULUVVV?@?U@VXL??@IUmn@VU@wmKXUWU@m??l@VIXWWk?WUkWlkIVamUXamUnmWUU@@Un?lK@?XJl@k?V?Uk@mWKXkl@@aVU@UVWUUVa?In`VUVLnw@U@K@U??@w@UVmUU??∼K@UnV@bV@Xk@KVm@amk?aU?VWUUmUUwm`UbULka?KXU@kVmU?@aV_UWVIn@?y?XXK@klmV???V_kWVUn@WUU@U?maU@?wnwWanUmmXk?am@UakLmK@b?xUUUU@Km?Va??@?k?UaVUlm?UU?@mUU?mUk??Uy?b?bUa?XUWWb?LmL@V?a?L@WWXUKmmk?@a@UUK?XW?kU@V?UkxmVkUWbUJn?VJ@nVJXzWxk?@lVbUX@VVL@`mbUn??Un?VV?k@Ulm@mw?L?b@lmLUK@U?am??W?k?K@?Ua@??UkJkUmbVlkX@bWbU?V?nnUVl?@b?bVK@VX@lb?V@nU∟?x???Knblb@x?V??@?l???@b@l@XWxnVl@?VV@XLVl?LU?UXV`?bXXmJU@@bm@UUkLW@UlUKWUUb?wUm?L@nklVVmVXXm@@bUKl?n??XkllVUVVL@nUbV?@V@nnV@xUn?U@JW@UX@x?@?`m@@L?V@b'],
                    'encodeOffsets': [[
                            113671,
                            26989
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4305',
                'properties': {
                    'name': '幵栠庈',
                    'cp': [
                        110.9619,
                        26.8121
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XIlJ?I?VVK@?n@VVVKnLVwVmnLVK@U?@?w?J@wVI??∼?X@???U?xll@kn@VwVaXJWXn@@WVL@UUKVKV_U@@aVK?x@U?aV@lk?@XylbUaV_?Vnal?@W?U@a?I@aV@@aVUl@Xm?UX?WaXml@@kk@ma@?V_U?nUV?UUWJUa@kkaWLUmk@@LUVWUkJWk?K@?UnWJ?IkV@b@JUIm@Ul?V??m@Uw@a@k?W?XWKUknW@?WUU@k?mx?UkVmIUJUU?VmI@UkaU?V?UmVk?wVaVmX_WW@?Uw@?@kUKWVU_k@?mm@@VkX@lVLUJ??X∼WVU@UIVWUa?IU?mkVUkWU?VWkwWXk`mI@?kUV?U?Un㊣@?m?XkWknV?UVmmU@@X?V?Uk`@X???k@???mb?車@mkU@kU????KmX@?UnmL@lULkKU?WUU@?bUaUn?@Vb@l??Ub@l?@UKmn?KUnl?UVVbUVn?@`Vn@x?b@x@V?L@nmJ@nU@mmUVkI@xVVVxkXVxmV@b?bXVl@Xl?XVxna@Vn@@VVL?aXaV@n??@@V@X?`V@@XVJ@XV@U?kXVb@xlVVKnbm?@VXLV@n?lL@?Vx?JV?ULUb?`lb∼nXalKnx@?lb?mn@lbULV??V∼???nV@z??@Vl?lb@VUV@b??mLV`??@n?KlVnU??XWVLnnlV@xVLU`VbV@'],
                    'encodeOffsets': [[
                            113535,
                            28322
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4310',
                'properties': {
                    'name': '頂笣庈',
                    'cp': [
                        113.2361,
                        25.8673
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?zVaVlnVl@n?Vk?Jl_XJlIVmnL@mV@VXn@lV@?XzV@lyV??U@UlJ@XVKnVVIXl@UVLV`@n@J?I@mlI?KVLnUlVUVVLXa?KVLl@nb@?W?XV∼KUnVV?L@xVJ?L@b@LUVVVU??VXbmbVbn@@lUbm@?x@XVVV?@?@?@bkImx@Vm@Xb?b@l∼XU∟?a?L?mnL@bl@@?VUX@VxnV?anLn?W???XKVwnUW?XmVIUW?LVx?L?w@wVmlU@?X?WUkwl?n_Uw?WV@VU∼wn?U??y@aV??kVlnL@lVn?w@VlJ@b?X?x@bVKnb@U@WVUl@@Vnbl@XLlK@aVLVKnx?n@a?LlmUaVU??m@?knUmaUKmVk@m?kk@UlWUkVm@w@kUU@W??U???@w??@aVIlUV?@kUWU@UUm?@k?@mKVkUKUw?aUaUa?@k?kUWJkImaU@UK?@maUzk`@z?y@XmJkL@UUJmUkV@z?@k?kVmK@?UbWL@a?@UbmKmwUK?Xk?VUUkmVkw@UUKmL@WUIWa?JW_k@@WmI@mk@W?kWULUUVKUUVm@??U?b?@??nU??@U@w??V@Ua@a?L@ak???l@k??U?J?w車@@L@V@??`@??J@xnn??mV@bkJmU車@?n?JW?UUm?U@UV@Lk?WlnnmVXbmx?xV@nbV?V@XVm@UVlXU`??U?kn@lWL?W?zm@UJVXU`@bV?Un@lWV?LlbVKVan_VxnVVVUXV∟?bnl@bUn@LWlU@@amU@V?L??VVUn@V@x??@V@L@VmxUKUVm_?JUbVV'],
                    'encodeOffsets': [[
                            114930,
                            26747
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4307',
                'properties': {
                    'name': '都肅庈',
                    'cp': [
                        111.4014,
                        29.2676
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l?U?mkUwUyV??@VW@?Va??VmUU@KVUVUVLnaW?nkU?V_@mVU@??w@?ka@kVm?UmK@IkaUamKkXWaUW?@WUk??@@KVU@aU@?L@J@X?VUKVak_mWkLWakVUbmLUUml?UVKUU@kUWW@UImJ@xkLkKm@@X?@車??@UUk@UK?V??UL?K?XkWWbka?IU??WU@mUk@WL?aUJ???@@X??VIl??Vnz∼aV@U?m@X`@XWbkakJ@amL?aU?@V@L∼@@bn`?@@XWb@V?Vl?Uxmb@bUVmVUI??XVWn?JU?@nnlVL?V@J?bWzk`m@U?VK?V?x?k?LVl?@Vn@V??∼xVKVk?VVlUblx@bU????@@nVnUll?kx@VW@@VkLWxUL@b?@kKkV?V@bkXVVUV?@?VkUkV?LkV?a?@@????xUxmX@JVb?∼WXkK@Vm@k?Vb?bn∟?xUXkJ?blxnX?K?l?_@Wna?n@?UL@b?JnIlV?@lU?@@??@lW?IVKVm?U@aXaV@lwVXn@@K@UVKUUnU?bn@lW?X??lJnU?L?KV@??l@?a@UlK@aV@naVX?WV_nKlL@KUm@a∼U∼?@VXL@a@wWmXal@?k?@VLn?V@@bl@VnX@mwVa?aVU@mk?@?'],
                    'encodeOffsets': [[
                            114976,
                            30201
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4331',
                'properties': {
                    'name': '盻昹芩模逜醮逜赻笥笣',
                    'cp': [
                        109.7864,
                        28.6743
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@K?L@wnK㊣?n?nm??@WUk????n@n?@mVamk?m?U??l@V?nmmU@wUan?VK?Ln?VWlInyWU?I@WWk@KXU?n@mnUmU@W??mkV@?kXa?aVaUm?Ik???@?ka?X@?Um@?UKWU@UkJWkXa@IVy@UmIUVU@UJU@W?XWmU@?VakaU@@Xm@Vm@wnwV@VL?yV@VakUUa@wUUVmlI@K?UVkUamJk@VU@U?mVa?an_@KmU?@@anm@ImWX_WWUk??@k@W?_m`@bULUKUnUWWXkKWa?VmnU@@b?UUbV?㊣K@?UKUUVa??UUmJU?VIX?mI@UU@Wm?VmkUV@b?w@lmI@W@a??@m?LXbmJVLklWL@V@XX?mbVVU@@VU?Ul@VlX@b?`Xx?zUmkUV?l?@bXLWxXVl?@V?bkLma@nmV?mULVbmVUb@lnzmbU?Vl@∼nLV?lJkn@bmJk_?Vmmkblx?x@LUb?xVb@V?n@JmLV?U?@?nV@?VbnJ@?lVVbkx?bm@UxVLV@n`UnVVV?kl∼z?xVb@VU@@?lXnWm?nbVK@XVVUVVl@X?KUV@nVL@WnIW?XLVKVLlxUbVKXVWbn@@UnKVLVb?J?U@aVU∼b'],
                    'encodeOffsets': [[
                            112354,
                            30325
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4304',
                'properties': {
                    'name': '算栠庈',
                    'cp': [
                        112.4121,
                        26.7902
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l?V@XV@?mXVlXL?W?X@l@bVxn@???UVkn@VJ@I@alU?JXIVm@??LXllIXVVU@Kl@VnXKlb@lVbXIVVU?mVV?U`@?nbl@@lXLVVVKVbnXWJ@VXbWxXb?Ul?VK??nLVVUVVb?b?K@U?LnK@Un@VxlUV`UnnL@VVL@JV@VUnxnKVbV@@V?IVUnJU?VUl@nW?Xl?lIUa?KVb?LV??`V@VIUwlaVmXa@IWanK@U@m?kV?VUVaX@l?naVL?@??@kkJU?WJUa?XkaUm?wV?XJ@_lWUU@?n_?Kkam?UK??@amK?n?K?bV??W@k?aWan@@UnwlJ@a@?@?U?UU@W?wn@Va@km@UanaWa?UV?UUVU@K@a?KUI@w?KUUVm?LWUX?@?mak@UK?LWbUKVUkUmVUK?LkJ@n?J@I@mU_UK@VWkUJmUUL@WkI@V㊣VU∼kzU@Wy@?kUm@UWU@@nmKUnkJWIk`?IUlm?k@mUUkUb㊣yUX@VUV@bk@WlXL@nVlU?l?k@WI@?kLm?@VV@XVmnnVWbnVUblJXkVl?XXlWXUJk@㊣?@nXVWVnL@xUVm@Vn@J??WK@U?V?@UUVUVKUkkxULW`k?m?@bkJm?U@?mUX@`UImUU`?LVbUVUU@LUbmaU@mJU@U?UI?KmxkLUl'],
                    'encodeOffsets': [[
                            114222,
                            27484
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4306',
                'properties': {
                    'name': '埬栠庈',
                    'cp': [
                        113.2361,
                        29.1357
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@wUklmU?UmU@@UVm@wUaV_mmUKmwkIkJmUUnm@???@UU?bUKU?m??amm?xVLkb???U?VUzkVUl?UUKWLX?W@?VUUUa?KUbmL?Km?@akU@a?mVaUUVIVWkk@wk??@@xmL?lm??wmbVlXl?IWVkK@kkV?L@VWKU@Ubln?a??m@?b@b?nW`@XUJk@UUWK?k@U?K?nn?@xmLUVm@kbVbV?nV@V?b??@KnV?LW?X??V??Vbl???n?UJWz@??V車UVbkV?a?x@?lVUbVVknWK??k@?w?K?VU????l@zkb@`m_mJ@xX?mbVb?@llV@n?@llbXL?UXalU?l?alVnwnLVKl?VbX@@I?V@blJ@bVL@VVVUX?∟?VnkV?Xmlbn???VKk???@UmaV?@㊣XUlI?xlV?@VaX?lUVVU?VJn?V@∼∼n?∼?Vx??∼??b??lJ@U@aUK@kUm@_m㊣VIXal@?Kl@?bV?@K?K@k?m@UmUUa?K@_UJ?aXU?@Xm?_VmUk@WUk?@kU@a@m@U?aU?UU@al@ny?XXWWwk?ly@?n@@bnV@k@mVI???VlUUmlU?JUw?I?bX?VaUal?@K?b@?VKVkXVl@VkUU@ylU?VVaVL'],
                    'encodeOffsets': [[
                            116888,
                            29526
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4309',
                'properties': {
                    'name': '祔栠庈',
                    'cp': [
                        111.731,
                        28.3832
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???xXL@l?V?@??VI?bXKl@nVV@?XV??JlbXalX?W?LVK???UVLl@VV?@???@@Wn@lLlK@wnIVJX@VX@lVVUL?VnkVVnKValUXblKnXl`UbVL?U@W@I?KV@@bUV@L?@l?XV?@VXXblWnLVblb@JnL?VUn@llb@??x@?UV@nU`V?mlX?mbUKUVUV@LVVUn??Ub@∼UX?@U?VzVxnlV?k?VnlVnaW?@wnIn`@_la@y?k??V??U?L?xl@??XLlmUUVakU@??w?blUUa?V?U@?XyVIm???k?Ua???UW?X??KmU@L???a@UmUU?Ualan@VUnK@wm??m?L@V?lXLVVl@VI@WX_?m@a??mKU?kwW?UK@_UWWLUVkUWL@WUIkV?U@J?wkLUUmJVI@WkXm@VmkKUIU@mmm_@VUV?@??kJ?wUU@K?UWkkW@IWW@?km@klwkWVkkU?V?m@kWLU`mIkmkXm@@`@L@xUKWkU@VL@J?UU@mbUKVa??WVnL@`lXUVkU@xW@UbUWVU@U?J@?lnU@m?n?mV?a@bUL?wUb?@@VkxmUU???UV?K@I??U?mk@akm@wmI??kK@b?VWXkm@wULUmm@UVW@Ub??mbkK?Vn?U@Wl?xV?U@UXmWUXmlnbUl?Lmn'],
                    'encodeOffsets': [[
                            113378,
                            28981
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4301',
                'properties': {
                    'name': '酗伈庈',
                    'cp': [
                        113.0823,
                        28.2568
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lVUllXkx@lln@?XX@JlXXl?V@LVV?xlI???@VU@Un`nnV@VJlLUnn@lW@XUJnIVVlK?x@I?VlUVJ@XXKlVVUXKVX@`VLX?lxV?nL?∼?an@???bkmVaV@XL@U?KlU@llLXU?JWkUkna?xn??knK@w?@l?@xllUXUJVVUb?n@blV@bn??LnKVa?LVbVV?UX@W?XKVL?VVklUVy?U?V??laUK∼wnn?bn?V?VL?aVV?@??n@VmnVlIlJna?@Valkn@na@amwm@?UXw?K@aUUVUUaVa?wWK@kU@UaW@kKUU??@k?W?XWan?@k??mm?@@I@U@KmLkaVU?KkLWVU?k@UVmU@am@kkk??U?VUK??maUb@?Ub?I@a?KkkWm?@W??K?b@VmaULVxUXlVk@UxVJVbUb@xUL?@ULWW?L??mx?VVL@?Vb?KUw?a??WwX@@W?UWLU@VbkV@aU@@VUnmJ@VUn@V?LUK@U?mUIk@U?m?U@@UW@?J@L?bUmVI@aUmW@@bkXUx@lmLUbm@UbkJ@V@XmlUbkKm@ma@kUaVU@aUK?@mImJUIkV?U?VUakbWwka@UWKkLUamKUXm`?_U???ULmaU@@lUV@X'],
                    'encodeOffsets': [[
                            114582,
                            28694
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4302',
                'properties': {
                    'name': '絁粔庈',
                    'cp': [
                        113.5327,
                        27.0319
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@X??Unw???KXXVK?@VK@wVaUaUIVwl@kUVWUwVKnb@U∼a∼LX??@Xnll?L@b?JVa@?Vanb??VL?U?V@al@@UV???@Ummk??w@??yVwnUVVVUk?mWV?nKVU?a@WXkVKn@lUVU?VVVXIlV∼VnI@VlKnV@?mwVm@LXKWkU??wWw??@k@m?X@KX?V@VUVa@VnKWk??V@VUkm@aWa@wkUWwkmV?V?XUVL@mVIXa辰@nW@a?U?@@am?@aUU?Um?XmWUk@??n?UW@_maVm?wU?kamaUL@a?w?W@akI@U?xUm@kmKUk?lU?@b?zV?m??xUVU@?XVxm`k?lxXVW?@?kVUn@x?x?KUw?KVXUJWnX?mVUxWL??X?m?mK?bmUUwW@UV@?k@??VLn?lb?Lm`@?VVkX@`WIU??xVnlb?WVbXIV?lI@l???@UKmbk?W@UbUVU??l@n@VmLXb@JWbUnkbVxUJUxWXXlWL@V@V@XXJWx?zUVVVVKnXW`@bkIUl??nLVJUbUIWVXlWV@XklVbnn@xl?'],
                    'encodeOffsets': [[
                            115774,
                            28587
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4308',
                'properties': {
                    'name': '桲模賜庈',
                    'cp': [
                        110.5115,
                        29.328
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@InWVw∼w??@??@?blU?KlUlV?U?@VUUUlW@a?UlUlL?@@aVKXwlK@UX@@Ulwk?VkUm@m?@??V?@akwVaUk?UUlUL?w??@UUm?@Uk?K?l?w㊣UULV?n@l_XyWw?@V?UUmJUXU@@mm?U@kxW@UaUIWbU@@mU@Ux?nUbmKk?WJkUV??al?@aUkUx?lW_@WUIU@?bkKWU?JVnUb?bWb?lU@nl??@XnVmV@n?mWV@LXl@X?JXVmzkJUXm??KULm∼Vb@xnVmnU?k@???V?nnlUb@nm?m@????Vl@X??mnm???mL@x?K@LUl@nUL?x@V@VXVWbXX?l?@nLlm@bVK?X?W?L∼bnU?@VaVU?@?m??Vw?JnwVK∼zn@V?Vb?a?@??'],
                    'encodeOffsets': [[
                            113288,
                            30471
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4313',
                'properties': {
                    'name': '礎菁庈',
                    'cp': [
                        111.6431,
                        27.7185
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lL??nJ@xln@bnlV???@J?LVU??V?nVlw@U?@Va?xVK@a?bnUm?n?V@km@??I@VUVVXVaX@@wlVVUkW@_mKXU∼?UbVLnaV@?V@IUKV@XlVL@w@K@_n@lWlnnJV_XK@l∼n?U@WVU@kV@nbVK??V?l?@?nLl??LXU@?lmkw@nW@UKVa?IV?n@@aVUUKl@nXVKVn?a??XblKnLlmVI@KUU@akLUaVa?UXm@a??@wVUVKnLnWlXl?n@@U@anUVm@U?Inm@IUK@UmKVmU_kVUwm@@VmL?K@V?L?aUaVUUUmK??ULk??VWaXwWa@UXImWUaULUUWKk@WnXbW??VWnk@UV@bU@@b?J@b?V@Xk?mb?UU`VbkaWz?@klU@?b@V?wUL@bV@U`ULVL@VUK@Xm@XWWIUbUxm@@lkk?w?V??W@????UJ@x?I?x?@@VULmKUnUxmKULUUm@@?UL?U?JkIWJ@b@L?JU?W?kJWnUV@nn??_nJ?xU@Vb?nUxl?kb@l?@'],
                    'encodeOffsets': [[
                            113682,
                            28699
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '4303',
                'properties': {
                    'name': '盻抾庈',
                    'cp': [
                        112.5439,
                        27.7075
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?`n_VWnLVblKXL@VlbXxlaVb?U?VlUVJnInJ?@VL@bUVVb@lnbn@lLVank@W@UlIVan@VanK@kVwlW@aX@Vn@bUJVn?a@K?IX@@VV@n?V?l@VJ?n@VVL?K@UVm@UnIVm@UV@@blUUaV@XK?V@XW@Xx?㊣?bVx?LUa@?UKW?k?@wmmUalk@WXUWkXUVJVaUImK??VklJ@aX_mWULUUVU?yXwWI@W@U@UXKWkXWVwU@㊣_U??KUa?LVbkJk??WmXk@UVV?mIUV?J@UU@UamLmwUVU@mn?J@VUnmV@b@Vm@k?kWmXmKULUV@x??@bWn?VUbVblK@bVV@LUJknmKkLWa??㊣bUmULmWk@VLUV@bm@U?∼JUbVLX@@mlxkn@?WV?Kk?mK@?k?'],
                    'encodeOffsets': [[
                            114683,
                            28576
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/jiang_su_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '3209',
                'properties': {
                    'name': '敆傑庈',
                    'cp': [
                        120.2234,
                        33.5577
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?n@?∼??∼@?ULWKkx@bkLWb@lUlVXXJVb?nUKmxXV@bm@@X???L????XlVn??mzVJ@n@????k???a???wn??車?谷V?n??貝????@身@K?UlU@?kkl?????l?X?@U???aU@U_?W@n?@kaUL@VW@kKmkUV@bkbWW@bkzma?@?JWI@KUKUL?@U??`@XUJ?U@KmX?w?KXkmy@aUIWJXXmV@K?UU@@bVL@∟VLXbV@@JVXVK@??JVn@bkKmakVVXUVVVlI@`U@nzVV?b@∟n@@UlKXLVV?I@V@nV@V?@?Ux@?車V身??k?W車@mU@bk@?wk@WbXxm@@J@zV@kV?bV?nLWVUX?WUXU?WLU??@Wl∼z@VkxU@UVWI?xWJkb???nW@@bUl'],
                    'encodeOffsets': [[
                            122344,
                            34504
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3203',
                'properties': {
                    'name': '剢笣庈',
                    'cp': [
                        117.5208,
                        34.3268
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XKVX@WnIVx@K∼Lnll@@I∼K?nVa?U∼x?mlx?@VanU@a?k@akmV@@w?@Ua@aUwVwUw@w?@UK@?ka?l車I?Vk?㊣@@kUKmVkIkxW@Ua?UUm@UVI@WVI?JV?@?@Um@Uana?U@m?I@J@XV@XaV?lkX?VaUUWLUyVIXmWak@?XkJ車k?JUL@KWkk@ULU@Wa?lUIkJmI?mk?VbV?@lV∼kXUKWKULU?mb@VUlVn?b@V?V@IVKUUmU@ak@@bmV@xkl?U?U@U?KmV@n?JVbkX?KUamLUJ?UUVmI?bVV?Ll`@L?LU`m@kXUVU@V?lxUK@xkIWbUK?x@?V?kVVn?b?@@U?@?xk?mbkL?K?b?@@XnJ@LmVkl?@@X?lU??Vkx?akVVb@bVnUbU@@x?VU?Vb@???nI?`?XVV?J?_?K@xlU?Klk?U?@VaV?V??m@kVUVmnamUUaV?XIVJ?@??@?nkVLn??@@XVK@VUX@JVUV@UnVJVLUJVLUVl?nI?b?KnU@m∼?VanI@anV?KVL?an?lK?bl??K?k@?@∟@?VKnLVK?L?KVzlW?LX@VmV@VbnU∼@Ualk???WXLVU?KW?kUUW??@?Wa'],
                    'encodeOffsets': [[
                            121005,
                            35213
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3206',
                'properties': {
                    'name': '鰍籵庈',
                    'cp': [
                        121.1023,
                        32.1625
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VJ@bnzWl∼L?xnW@L?VVI@W?_V??@VKVL@LXJ?I?@nbly@aXXla@aVUnllLX@@UVKlb?@@m?XV`V@?b??lk???????wn?V?V??U?U????l?X?V?@㊣身L???l?b???xk@?k?谷?n?@?????@kVVlUb?L@xUL??車LU?l∟@nkVV∼VLkxVb@l?aUXUKW?klVX@∟U??Ukb'],
                    'encodeOffsets': [[
                            123087,
                            33385
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3208',
                'properties': {
                    'name': '輕假庈',
                    'cp': [
                        118.927,
                        33.4039
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?n?U???豕??l?n?V?kbm??X@xVlVL@xUb@bUJVnUx????lKVL?x?m?zXV@lW@XV?b@b??Vxnb??VIXa∼L?a?VVaXUlK@aXI??VlXKVUlIXalK@alwXLVK@?????@??mVk@aX@?m?貝laXI?wXJVUV@lw@U?y?b?U?a?U?U?aUKVkna?m@kUm@w?IV㊣nL?w??nUUk??@??U?J?I??Ul@b?@@VVL@l@L?L?m?L@b?@UaVaUWmLUKV??K?LWKX?WI@mXk@UmaUVUU@VmL@W?bkIUW?UmV車Ikbmm?@UbVLUxmJkU@bkJWbnXU`Wz?KU??lVb?Lmx@?k豕@?'],
                    'encodeOffsets': [[
                            121062,
                            33975
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3205',
                'properties': {
                    'name': '劼笣庈',
                    'cp': [
                        120.6519,
                        31.3989
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?豕?VnX∼∟??lx???@?x@J@b@X?`nIU??UUV@bl@VVnL@L@x?J@X@blJXnW@@`XbW?kV?@UbVx?XUxkV@L車xVbUVW???VJ?klU?@????∼@?m?貝∼?????ULUU㊣a@bU@???U@KnImUVWUk?mXUVU@?lIVaUU?VWKUbUkWKU?n?WakJUkUL?K?L?Kk?VIn@VaU?VUU??UkVk@?U@amUkJ?@UUlwX?W@@UkVmk@JUakL?@kk??mJUn@nmVXlmbVVkn@?UJ@?㊣WUxV??a?K身b???xUx??U?UlWL'],
                    'encodeOffsets': [[
                            122794,
                            31917
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3213',
                'properties': {
                    'name': '咑ヮ庈',
                    'cp': [
                        118.5535,
                        33.7775
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XbWnUJVzXKVVUbW?klU?WbU@@W@I?J@n?VmbVbn@@V@?U??IUJ@XUJ@VVn∼VVbX@lwlJnUVL@l?@l??U?J?klb@∟VL?@@xVxUxVx@bVb?@@xU@ln?mnX?mXLVmV@X@lxVnVJ?L?LXa?x@b?@@KVL@bn@@m@?@alLUUVaU?nIV㊣?I@mXI@aWWXU@LlUXWW_XWmaUw??@a?aWUX@@kWU?y?n?wUKkL????VwUmVI@aVa@wUKUk@w?Wn?laU?m?k?????車??V?mmzkVmm@a@I車?k@@LWU@`??WbXLWlkImJVn@`nXVbX?mL@Vn@?l@nUVl∼Xx∼U@LV?@z∼?@?UV@Xn@VJmV'],
                    'encodeOffsets': [[
                            121005,
                            34560
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3207',
                'properties': {
                    'name': '蟀堁誠庈',
                    'cp': [
                        119.1248,
                        34.552
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@?lzXxm?V??@@??@l`XnlK?XXm?KnLla?b?@?xmbm@kL@V@Vl@@VUX?JX?mb?@@?∼?@豕?zlW∼X?Jl??`lInb?WV_@m??@UU?n??w∼??mnaV?V?Vm???w㊣?@?@mUIny??UmWk?????K??@Wn@@aWUnwVL?mUaWIUWVk@kkJUVWLUk??WJ@bkLWVUb?U?b?KWbUJ??WXX`WXkV@KWVXX@bWJ@n?JU?mJV?UbVVkK@b@?@nm@@aUK@L?@@a?wWb?K車KUIUmkwW@U@UnWK?nmW?n@b?l@bmVUb?@kw㊣n?w?VUb'],
                    'encodeOffsets': [[
                            121253,
                            35264
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3210',
                'properties': {
                    'name': '栨笣庈',
                    'cp': [
                        119.4653,
                        32.8162
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VUXblVVV?b@xV@kz?V@l?wVLUbVV@VU@VbUb?l?b@nk?∼I?V@???VlmV???xmKU??J@xVn@l?nmbUlVL?b?V?V?b?V?aXk?@V?XKV?VW?XVWXUmKU??aWaU@??@?XW?UU?V@@ynam_VWkUVUna@??V@mnkWmXkWU?W@k?@@akkl?lWUI@UnKl??I@V?Vma@a@I@U@a@anK@UmK@?VUnJl?kI@aVwka@mVIUW@UWL@W?bmI??ULka?UW?UxkLUKWlXL@V?Im??V?U?m?L?U車l?I㊣l@?UbVbUVVXUJUnVV@lnbl@'],
                    'encodeOffsets': [[
                            121928,
                            33244
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3201',
                'properties': {
                    'name': '鰍儔庈',
                    'cp': [
                        118.8062,
                        31.9208
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@k@ma@kUUVmVIUWVUUaVa@??k∼J?k@Wmk?KmX?aUakK??WU?@XU?LXaV@@mUaV?UUl@VmkaUXm@?WUUna∼Il???mV?m?IUW??@Uk@@aV@VVX@?V?I∼?nm?U@?VKVan@m?UaU@U_@WlIUa?aVaUala@?n@??kaUkUUWKU@mwkUUmmL@K?@?LmUUV?K?V?ImU?J???VkVVL?豕VLVU@W?L?V??@nV?ULV?UL@bW@XbWbkJ?UUVUxVXmVk@W?UUkVmI?V@?nbnVWb?JU?kUUL?a@Jma@XkK@VVL@L@J?LUVU@V??nXl?bm@kbUKmn@lVb@VXXV?UV@b@LVb?xXbl@@lV@U?VV@XVK?VlI?`??UbVbUlVVn@WXn@@VUV@?@KmbVLX??LkK?V@nX@VVUV@b?nVllb?mnb?IWVXU@`lLlknVnmlLlbUmVInK∼nU?U@l@VU@Vn@??@alI?`VIXaVaVa'],
                    'encodeOffsets': [[
                            121928,
                            33244
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3212',
                'properties': {
                    'name': '怍笣庈',
                    'cp': [
                        120.0586,
                        32.5525
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lUU@@y@In@WwXal@?xl@@anV?@?X?l???U@?Vw@?U?U@@m@U?JUUWKkL@Vm@@??aUUmyV@@_kJUUVUUWlUnblL@aUm?I@?ULUW@IU@WaUK@?UK@aV@∼V@LnUWWXIla?VV?@?UWlkX?VLVW?b@kUalwUKU?lU@mk?V??K??VK@w?KVaUk?lUI㊣????U??????m?????@XXK@VVXUJ@nlbUx@blJk?mIUV@?nL@VmL@b@b@V@J@bnb?U@U?Jk?mL@VVJkXk?ll@b?@@l?XXVWlXnml@n?U@?mbUVlVUXn`mb@zU@V??VWX@∟??V@Xb'],
                    'encodeOffsets': [[
                            122592,
                            34015
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3202',
                'properties': {
                    'name': '拸柈庈',
                    'cp': [
                        120.3442,
                        31.5527
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nL??lxUVkL?am@??kVWUULUxVVVbUV@bVLU?nn???V??X?VUUa?w@KlUVw?WUwVa?@lUX?Wa@_X@WmkI@a@W?I@w@KmKUUk@@aVU?VV?mJ?_@W@a@I㊣w?@??kw㊣???mW?U車??K?VkUWK@XkV?UWa?b?mUa?UUb?lln@b@x?bX?W?X`@?VxUblL@bn@Vb@`m@XbWnn@l∟?n@xnVlU??VL?W?kV@Vb?J?_n?l@nKVU@aU?U?@mVk∼WVLUV?bV?X??bXlVn@VmL@x?V@bl???@?nW@X@VVJ@?VJVU'],
                    'encodeOffsets': [[
                            123064,
                            32513
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3204',
                'properties': {
                    'name': '都笣庈',
                    'cp': [
                        119.4543,
                        31.5582
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?L??nxUbVV?L@xnnW?nn@VVXn@?y?Imx??∼??L?a??n@Vk?KVw?W@nX?VJ@b?@UVn??@UnUV@L?b@`VLklV?n??@VaXLl??J??mmV?UK@aVUUaUUVwVKXVlU??n@?blKVUkw??mKUVUI@㊣UI@U@WmX@???k?@a?U@wnK@UUmWk?aW?U?∼aVUUK?XUl@nV?V?@bUVmLk@m??`?IUaU@?l?XUK??kVmU@w?mk?m@XmWan@@_Uam@@akKVaUw@?W_X?W??a@w@akmm@mL@U?JmnUK?@@XnJWLkKUb@?Vxk?W??L?aWVUImVULUK@L@lkLVVVllb??m@@∼kbVbUb?bVbkJ@XV`V@Vbn?'],
                    'encodeOffsets': [[
                            122097,
                            32389
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3211',
                'properties': {
                    'name': '淜蔬庈',
                    'cp': [
                        119.4763,
                        31.9702
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?V?K?n?V?Un??J@UWKXkVLlKVwX??VlbVK??nJ?a????n?∼車?Ik?WKUb?@m?U?lkUK@_?a@KVUVm?@m?VU?@@aUIW?@m?XUx?LUlm@???b?K????nw?J?zm@UW@UmmX?mm@w?KUUVamw???Km@UbUL@??Vmn???J?UW@UUU@@bl@@V??VX?J?nnU??k??JmbVV?Xn@VWlbUnk@VVU?Vb@nU@Wb?KWV?@XV??lLVb∼bnW∼Lnl@X'],
                    'encodeOffsets': [[
                            122097,
                            32997
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/jiang_xi_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '3607',
                'properties': {
                    'name': '該笣庈',
                    'cp': [
                        115.2795,
                        25.8124
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?`l@?bln?@?KVLl@?V@b??ln?KXkVlVL@?lJnb??VKVVnX?W@w∼@VU?mln?UV`?U?bVUV@?xnKVI∼KXKVkVL@al@Xa?LVlULWV?VVL@b?x@VXVmb@x@V??VV@nn∟??lb∼b∼KXXWbX`lbXx?z@x?`VIVUnK?L?x?WXLVKVbVLVU@wnW∼b?@nalX??mXVJn@U?mKkVl?U@@xln?aVmlKn?@JVLl?nV??l@XX?豕VlUX@xVLXV?b∼W@wnUWmXk@K?LVwUmUkUKUw@wVaVK@k??@WnkUKW?kwlmXL@KVUlLVKXmWU?L@a?L@m?alaVk@a?a?a??nX?@VVUblb?Jn???Xa?V?wn??K@UWmUk@?UaWI?V@b?JW?@K?mmU@aUUUkmKk?VKlUU?nKVU?lVaV???WUUK@UkUUw@?m@mIk??UUW?L?K??Uw∼?@wUKUb?Km?@kkKUL@UUKV?U@manw@k@U@Wm@@?U@Wwkm?wWaUU@UUmV?kw?@@km?kKkUW@UK@?V@XWWkXa@Ul@Va@KVaUUU@?aXwla@UkVWaXk@K@?lmkUmV@Vmbk@??XI??VUk?VUVU@anKVU?KUalU@wX@??@a@K?@?w?L@?Un?lUIkJmn@??bVV?b@VmnkL?V?U@?㊣l?IWm?@kaUI@a?U@K@KUIkbWb?JUIUy?X??UbU@m谷UUmUk?WK?xWIkJm@V?U_UJUwmVk??UU@???@kn?wm@Um?kWJkL@n@VW@@?U@knm@kUml@x?x?@@XUJlb?@VX?JVxn@lbV?@lULnV@Vl?nV@bWV@bXL@lVLVb?V@blLn@Vl?K@xln@bX@la?LVbnKUVVb?KlXVVkx?V@nnVUb?lV@@z?∼WWkb?Ik?WL@LUJ@bUI@b?`@UmI@mkK?XW??mUV?@UUVUUam@@VULWU?J?Im`?IUJ???KUkW@Uxn?WbnnmlXbmIUVmV@Vnb@V?LUKWLn?VVV@V?UL@?kJUV@b??@???V∼??@XVV@l@xUz'],
                    'encodeOffsets': [[
                            116753,
                            26596
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3608',
                'properties': {
                    'name': '憚假庈',
                    'cp': [
                        114.884,
                        26.9659
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lxnb@V@bV@ln@?n???lIn?@blVXK?nk?@VUKWL@b?L@`UXU`?@V?XL?@lJ??@?nV@l∼nn@?mVXna?@nb?K?n@l?IV??@VanJ@_lKVVn??L@L?K@Vn@Vb?UVanKlLnbnJVb?nWVnVVanI@?Vb@L?bVKVanXVbVJVU@aXLll?b?l??XxVLVK@Xn@?xnVVVmb@LnVVKVXV@@mnaVXUVnV?K@_UaUm?wnKV_?anKVL???K@???U@??U?@?kWlUn?lknK?VnaUkma@?UIUwl??w@?VwV@n???n@?XlKVmna@kVw@anm?@n_WWk@??mUk?UK@Im?kLUn?bkm@wV@k?lUnLV㊣m@UInW??kWmb?@?amX@xUVUKUaULWK?X?w?KmLUVUJ?_@w?yWwkaW_XaWW?L?aka??m?@mUU??@U@wnaWU@U?w@aUK?UXUVKUk?KWbk@@bUKUlWL?LUJmL?wU@UV?a?VU_?Vkm?nUV?@@x?XmWUUUL??makI@?UKUkWl?Lkm??@a?Uk@UK?L?@km?ak@?_VlkL@`lbn?lLVanLnbmV?ln@??kJlbknmKUb?mmwULUK@bkLWKULUUma@Kk@UV@L@llbVz?xUxnl@bVLm???@IVJX?Vl?LV`@bn?@J?@?V@Xmb?@WbUJ@bm@@LU?U???lV@xXb@blnUV'],
                    'encodeOffsets': [[
                            116652,
                            27608
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3611',
                'properties': {
                    'name': '奻�騫�',
                    'cp': [
                        117.8613,
                        28.7292
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??@?V????I∼`n?m∟??@bVJUVVXUl@Vmb@xV@XbmVV?@lkLmbn`VbnU?@Va?UnbVllUXV?a@w∼?VW@_VW?L??nVlb?LVbnl?K?nVK@IUW@_@am@????U車lK@U@WU@VwU@UI@aUU?aX??@kwmJV?@yX?@k?an???@mkwVmmI@aUU@aUUW@k?VkV@@anK???XVWnIVUl`@_?W@wlU?V@UWKnU?bn?∼InJl?UV@VnI?b?Wn@VklL@l@Vn?m@U`kI@bWJ??nV@∼VXnJm?XVmx@VVL@bkLmWULUmU@?bW?Xb@llnX@?xkxVV?nVV@∟nL?nVxnJVXX@???bn`VI?b?@?blmlLnaV@?blWXnlUnbl@???KVanUVmm_XK@kWWna?U@UnaWUXa??XamUkKmXUW?LX?WakKm?nUWwXa@KW_?aXWW_@WnIV?l@XU?LnWVknK@ImyUU?bXK??@W@I?Un?V?lkVK@mUIVwkUVaUm@aVIVyXI?a?wm?mk@Unan?VUm??a車?lw?W@kkUVmUK@?WK?L?UmWULkamK?Lk@Wa@wk@UU@?U@mbUIWV?KUXWmkUmV?m?U@LkakK?w@w@U?????UUn?l@bmn@xkJWxkL@VkI@m?kmJUI@V@b@VVxnbWlk?kV?L?bkKmV?L@V@?nxW?kLUL@xlKVx?bX?mVn?WJ@??∼@n?xUKUw㊣??`UImVmnU@kalm@akw?U@UUJmxU@@U?@kU@Um@@Kn???Vm@k?KmkU@@WUnkLWxkVUwmKmLkU?bmKUbV?@xUnkJ@n㊣???UxVXU?WJ@LUb?lUnm@?W@nknUJUVm@kXllknVb?K?VVb??V?@?Ul'],
                    'encodeOffsets': [[
                            119194,
                            29751
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3604',
                'properties': {
                    'name': '嬝蔬庈',
                    'cp': [
                        115.4224,
                        29.3774
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@WUkVUkma?VUb?@mVUam_nalK@kU?nUWaU@@wna@UVkUWVUUI@a?㊣n?m??_?J??U?@?????Ul@?UV?Km?mL?lm@??m`Uk?@@UVK??@UUK@amkmKkVV?Ua@UkU?K??Ua?L@VVXUJ?@?n?@???WUb?nVb?V@L?l?I?J?k??m@Ua?WUU@UmUXmmwV?UU?KWUX㊣m?Uam@kW?zUaVm?w@a?LmK?X??U?WKkL@W?I?wVw?lkU?J@Um@??W??KUxWk?aUU@KkLVl@?UKUX㊣KUb@nVVUbUVmaUlUL@??aUL@?@nUlWzX`@?V@lx??@Vlb@b?V?@∼nl@UxVL@lUbVV@n?xVUVmnU?b?a?J@I?V∼xnbl@nb?@VwnK@VnXlK∼xnUlVX?V@Vl@L@lk@W_XK@K?kWxUL@J?nVx@aX@VVUa?IXlmL@bVVX@VbnK?a?XVW?k∼a?@UnV∟nbmLmW@?XbmJUbVL?a?K?L@K@U@aVKlbV@nXlJ?xV@Vn??V????K?b???mV@?????x?I??V@?????Vl?V?nxln∼J?k?LXWVUVUVwnJVI@yn@lXlaXmWI@w??ma@UmK@akKkXmW@_kaWakKW?k@@K@I?W?kUa??'],
                    'encodeOffsets': [[
                            119487,
                            30319
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3610',
                'properties': {
                    'name': '葷笣庈',
                    'cp': [
                        116.4441,
                        27.4933
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼V∼Un?@n@lnLlV@b?V∼L?lnLllVzVVXlV?V@@L@xX@WlX?m@UV?L@V@n?∼?kVmVUnKlaXxVb?nlU@lVVnaVI@aX@V??J?@V?@b?b@?Vb??@X@lUL@?@VlIVm@wU?VanL?alVnKnLVxlUXwlKVm@k@Una@mWIXKWU?V?k@a@UVWn@@kl@@W?XlW@_Um@UVK@a?LnalInWV@@xnI@??K???m@?kKm?nk@mlI?∟laXbVblknV@U?KXVlUXa?@@Unw@㊣mU@ak_㊣a@?UJUI?V?KW_Xa@aWU???K@mmUVa@IXa@UWm?annlmX?WKXwVUVw??@?XUlK@klJXa@k??kmm@Uw?w@??W??kw@WmbUL?aUUU@mVUU?WmkUb?KmkkK@a?kU???U?l??m@akU@m??@KVIVV@KUkU?VUka?UWb??m??IkaVaUU?@mW???b?b@bUlkb?b@n?K@b?KXVWnULkKUV@LWKknlxX?VLml@X??@lULUb@xVxVLVlVnUx?K@LWlXnmV@x?X?aWUUK@wVWUk??m`?@mn@bUx@lmbUnkL?Wm@??m?U@Ux@??xk?VxVJ@?nbVlmb?UmLklm?kVlX@?V???V@∼?'],
                    'encodeOffsets': [[
                            118508,
                            28396
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3609',
                'properties': {
                    'name': '皊景庈',
                    'cp': [
                        115.0159,
                        28.3228
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@VlbnK@b@J?LlUnx㊣?Xx?W?X@l??@V?@@blJ@nX@?xUbVVUbVV@b?VmnmJ??@bmbm@klUb?Lmb??@lVb@xUX@bVVVbV∟@LVV?bXlVw?LX???n@@V?IlV?kUx?x∼J@XlKXLV????WnL?K@b?xUnVb?ylXn@Vbn?W?XV?LVVU?nxWnnV@VVV?XVbn@???l?I?J?k@K∼UUa?mVa@UUU??@wV@V?kkUKUVW?U@UmW@@aXkVUnVlKVV?UUkVmU?@kWaUanU?VVamIX?W@@aUaU?VW@_mW@UnIVVn@VbVm@bVL@anKVUk?WK?UXV?Ikx?@na?bVK?b@nVJ?_V?@?Vw??VUVVXUlUUaV@X@Vbla?bnKlkVaXa??@m@U?KVUn@W?XkW@@w@KU@U?WkUUUykkmK?k?K?U@akUmK@k@mm??V?U@??L??UKmL?bU`mL?xVnVb@`?LmUVUUWmb@nU@UWULmU@KnaUUmU?wmJ?IUJWIkVkaWVUIUlWaUIUVkKmbUI??lVUnn?@VlLUJ@bUX?@?aWVUKUX?KUbm@Uw?KWa@a@VkUWn?@Uak@mbX?WJXbm@mL?aWVk@?w?L@WmanU@knwWmkaWL?KWUXa?U@?l??UVVVbnw??nKV???@aUk@a@U?J@k?m?Lma?@mbUW?nm@UL??@LXnmxU?m@UbkbW@@akLmWk@UXmJmUkV@VUXVlULmKUxkL@lmXnJ@X?l∼Vnb@bU@Wb?KUX@VmKUX'],
                    'encodeOffsets': [[
                            116652,
                            28666
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3601',
                'properties': {
                    'name': '鰍荻庈',
                    'cp': [
                        116.0046,
                        28.6633
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?X???@?m?@VIUW@U?KVb???LlV@VVbU?lUnLnl@bVL@V∼?UL@V∼@Vln_??n@?knKn??LVU@?Vk??Vk@?U???Ua?U?LUalmkklWn@VUVIlm@m?Xn@Vm?kVa@KXIV?UWVw????@m@U@?VK@k@W??Ua@??a@aU??@?IU?W@@bUJmbUU@kkV?mUaWwkbmLUVUn?lWbUbklmL?akbUaW@U@VbkVWVUUUV??Ux@?U??`UI@m?aUL?amb?@lw?JWU?VXLl?UVmL@bUK@aUnUam@UUmJ@VnX@`UXV?Vb@bX@W?nJUb?UmVVbXb@lV?UnVl?VUUkLmUUVWl@bX@VnV@X∟VUVLllU?U@@x??VV@V'],
                    'encodeOffsets': [[
                            118249,
                            29700
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3602',
                'properties': {
                    'name': '劓肅淜庈',
                    'cp': [
                        117.334,
                        29.3225
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VVX@Vbmz?xUlU@mbmL@V?xVbUVVblbX@?V?kVyk?ValKVI@bn@n`l?VWnX@l?L@?WKn?VIVa@?nK@alIXJVIVWUw??n@nU??nK@alI@a@anKm_?a??W@UWmIUw?mmK@?UU?mUUlw?wW@km@kWaX??aV@VnVKnXlK@aUK@UnwWUn?mIUW@?mU??XI@alJV_n@m㊣@U@kkKUlm@?X?amJ@UVUk?mI?Jm??amVXL@V?UkV@x?X@`k_UVmJUX?W??mL@bU@Ull?X@VV@bVV@bnJUnlx@n??m??b@lW?@zU?nIlx?@W??bVV@bVJV@UxV@@X@VkLV?????n@@b@`VX@J'],
                    'encodeOffsets': [[
                            119903,
                            30409
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3603',
                'properties': {
                    'name': 'じ盺庈',
                    'cp': [
                        113.9282,
                        27.4823
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VWnL@UVW?LXaV@@ama?U?k@WmInW@klKVwnLVKUkVW@UlUnVnIVWl@nXlK@bX@laVan@V?nwWm@K??VK?m@kmU@???kI?@WKU??@V_VW@_?K@aXKVL@Ul??mWLkU@am?kJ??m?@?kmU@@a@UmakwU@??Xl?@VXk`UIW?kWWX@???@l?xV?XlW@Ubn?@?mUkL@UmJ?UkUWVUa?U?lm@UXWl?nUJ@LmLU?nXll@bUVUUmVUn??@??xl?nn@V??U∼kbV?VxllnL@VnVVUl@V??anL'],
                    'encodeOffsets': [[
                            116652,
                            28666
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3606',
                'properties': {
                    'name': '茈抾庈',
                    'cp': [
                        117.0813,
                        28.2349
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@XV@nl?L@lUn??m?@Ln@@VlV?@@VV@nwVI@V?Vlx@bknlbV@nmnUVJ?_??VxVL?w@m??@?XIm?nUW??aUwkL@wVKlKX?mw@㊣@U?KnUlL?a?KlUl?XkmaUw@U@a@U???UkwUJ@zWJ?w?@WbkVWU?L@VmUklUaWakb??kJ@nmln?lL@??n???L@?mJ@wU@mXkJmb?K@bUL@VVn@`kX?W@Xk@@lm@UX@V@b?l?UXVWLXJ@nmb@V@l'],
                    'encodeOffsets': [[
                            119599,
                            29025
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3605',
                'properties': {
                    'name': '陔豻庈',
                    'cp': [
                        114.95,
                        27.8174
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@m@@WULUKWw??車k?akkWK@bUVUIUamWUbUL?a@KUa@?mJUbmUXU?mUamImakKmLUb?VUam@@U?L@K?Km?UUkL@`mIUb?@U?@V@bVl@b??U?mL??mxUaUU?Vk?@??VWbXV?LXKlbXnmx@lmVnb@X?K?xl@XU?bnKn@WaXIW?nal@Vb?@XmlV@U@bXb?LVxn@Va?LVWVLXU?b∼@VW@aVIkK@Um?VmkU??VJnalLVUVJXbVkVJXUlblUXJVI∼JnI'],
                    'encodeOffsets': [[
                            118182,
                            28542
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/ji_lin_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '2224',
                'properties': {
                    'name': '晊晚陳珅逜赻笥笣',
                    'cp': [
                        129.397,
                        43.2587
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Wx??m?@?車∟V?X@@x?????xWx?V?V@?XV?????bW?Xlla?U∼??@???L??Wan?V???n?∼???X?∼?@w∼w@?∼?k?∼m???m?b?????K∼z@?kxl?UbU∟???klV?K???@@b?V@nVVUl??lUll?VlU∼?U?V?∼w?bXxl@V????@n????車∼?kmVk???w@wV????@@????????@???bnb∼m??∼V∼??Jm?X?mam?U???U?laU???@w?Kk?l㊣n@@w?k?VUUl㊣?I?b?a?l?@??kLmakb?@???谷∼??b∼??谷k??Lm??wX??a?b@bVl?bVb??VbUb?UUanw?akbV?UV?ak???U??LmxV∼Uxn??X@J?Xkl?bkb?a?b?WU??@?k?WUU?@@klm?@@???@a?wW?X?lKkI@?WbUaVIUanU??@????K??mUnWUwm@???豕kUmbUmm@@nkJUalwk@@nmWUan_車aWmnw㊣K?I?wl@Um?I@an@@mlU?mV_?KUk?@U`@_?KU?mU?@U??mmb?@kb?ImV???Lkb?K???@?n?J車a??kb@??x???ll??@???V????UVV?U??∼X?車xlV??lV@b?V@n?x?@?∟@???nxV?kn?J?n?KX∼??Ul?nVbUb?Vn?WVX?ll?b@l∼?VJ??nLVb?bX?'],
                    'encodeOffsets': [[
                            131086,
                            44798
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2202',
                'properties': {
                    'name': '憚輿庈',
                    'cp': [
                        126.8372,
                        43.6047
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?l?z?a?V∼??K@?m??LWl?n??VxUV??@???U?n??L?a???Vm?kV@???nU@b?V@b?@nl∼UVn?a?J@b???V??mlk??bmVXx?@Vxm?nb???b?K?V@b?L?w?y?n?mnb?@nn?V?x@n?K???J@k?al@nx?U?L?㊣Vwkw?LWWU???k??貝Vw?w??∼y??V?∼w?Vlk??@wW@U???@?n???XwW??aUamK車?UI??@k?akkW?XUm??UVaUa?mVk??W??L?m?IlmU?mw?身@???kJU??k@??am??y?UVw?a@w?x???K???X∼???U∼?WUL?a㊣b?@Uk?Wm?V???kIUl車????`車I?lX?W?Xxmb?U?L???b?@?x?b???l@x???z?a?∟@n?m?VWb?bmn?J??@n??'],
                    'encodeOffsets': [[
                            128701,
                            44303
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2208',
                'properties': {
                    'name': '啞傑庈',
                    'cp': [
                        123.0029,
                        45.2637
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@車???@WlwUa?w???谷?am??K??身?@I????V????????U???w車車?@???L?ll?@??V@?m??b@nmlU?Vx?lUn?@VbnW?b?bk????n@豕lnl?U???∼L?x@??b@???U??x???豕nLVx???b?J㊣a@_?J?n??Vb?Kl?nU??@?U??xXV?n?m?V???J??V??w??Xw∼xWL?x?KV??U?wV??車????????k?V??x??U?lVn????a∼w?b∼@?b?w?l?L?`?z∼@V@@?nJVnl@@?nUmmn??@mwnmmUnk@mlwUa?Ln??wn?∼an?WakI???mXw?amUXUlJXa?UUklKUknm?V@??K@?VW?@VkUwV?'],
                    'encodeOffsets': [[
                            127350,
                            46553
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2207',
                'properties': {
                    'name': '侂埻庈',
                    'cp': [
                        124.0906,
                        44.7198
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???豕??U?車???@J?????Ln??b?那???xVbkx@X?????k?`???W?b@n∼a?b?K?nVw∼`?_X`W??????IkmV??akw?K?x∼U?b?U@l??l@∼??VW??a?b?x?I@mVI@?V?k??UWK??nL?a@??@???@∼??@nU@K?alkUwV谷kUWw??kU?Vkk?Jk?@?車k?V???I@b???@???w?nmm?L?w?V?U?y@U車w?Lkmm@@U車xkk??mL?wVwkWWX?m?L?m@k?㊣V_????????@?Va??V??a?V??lm?w?U車????Jkb?a?LW@nx?∟kz?y?X?m@V???X?????nU?nLVlU?mV'],
                    'encodeOffsets': [[
                            126068,
                            45580
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2201',
                'properties': {
                    'name': '酗景庈',
                    'cp': [
                        125.8154,
                        44.2584
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?U∼x?Knn∼m?x??∼@?車@a?J∼??U?l@?l∼?Ill?UlV??XxlVU那Vxklln?UVll@Vx?I?∟VUlVnI?l??lw?_???bVa?LX???@K??@w?a??n???W?XyW?Xw?Umm?@ma?n車m?z?x?K@a?U?L?a??man?Uw∼@WwnU?al?nk???U??@a車I?bUm?Vmk?@@a?U@amV??@?lUn?㊣U???b車Km?V??貝@???VUUw???mXk?Kn?@??L???U?b?y車k身豕@b?n@l?X@x??@??U??V_maXm@a車??JWxnX@?VVn?VnUJ@n身???V?kx?Lkl?w@x?x@zV`?bmx?U㊣xU?nnm?kn???U?bU???Ub@??∼??車???U`??@l?n?K?nXWlXUx∼xnK??ll?w@Vn@ln?K?x@V?z?V'],
                    'encodeOffsets': [[
                            128262,
                            45940
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2206',
                'properties': {
                    'name': '啞刓庈',
                    'cp': [
                        127.2217,
                        42.0941
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@U?l?k??∼?Il?U∟?z??lJ??U?n??XVl∼@?a?bVK?XV?∼???∼W???L???w@x?bUx∼V∼zn??b@??lV?lI?@?w@m?U@akU∼?kU?wW???V?U?VU????㊣U???@k??k???w@?la???U??@??Kn???@W?aUaVUVkkw@a??@??????VXnW@@WkXmK@xkKUb@bW@Uw??mm?b@?WKUbmU?bUaWb?J?IVW@I?l㊣Lk?mU?bUm?@?nkKWa?n?@?`Ubma???L@b???@W`?L@n??Xb?@kb@x?L???@V?kL㊣???mlUIU?mL@l?x@_la??@U?a?V@kmm?K?????L??mKUn?KVbm?XVl豕?UUbml???∟?Il??b???l?@????@x∼?l∟?n?a?l@x?b'],
                    'encodeOffsets': [[
                            129567,
                            43262
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2205',
                'properties': {
                    'name': '籵趙庈',
                    'cp': [
                        125.9583,
                        41.8579
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?lXn?x?∼l?∼??K?∼kXm?@?Vbk??J?n?∟k?V?VVk??b∼y??@w?k??∼a?w?@?a???K?VnaWwX?W??k?J?_????Vk??車yV?k??J??l?k?V??a@w?k?b?mk???@w??車??@?k??∼ak??J????nkVa?Vk?WUn?Ua?LVmnL???KU??㊣@??m@a?U?bmV?m@_?K??U??a???W車??@UanmWak@@wmI@y???@mk?JVa?@Ua?IkJ@n?@Um㊣kkx?m?Ik??b?m@?∼bXn?V@?∼?ml???XV??Lm?kWW?XLmVVlkn?@@l?nW???Vx?bm?n?m??l?aV??豕@?V??b????∼?UV?J??kx?I?x???IV∟??Xxmn'],
                    'encodeOffsets': [[
                            128273,
                            43330
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2203',
                'properties': {
                    'name': '侐す庈',
                    'cp': [
                        124.541,
                        43.4894
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?n∼W?zly??mwX@?K?bla?I?∟???V?xn?mmV??w?Vnw?aU_@y?w@w?xlk?KlwU?????@mVIUmm?UU@?mWXw?I??@bWnnbU`???V@?∼車@w?W@k?m@a????@m∼?∼Inm㊣aXa?U?n@m??U?@????aU??aU??????J身U?車kU?@???ak?mUVak@@a???aU?m??`Xb??@n?`?I?x??身?ml@?Ub?@Wl?_?Jk??U???b@n??llUb??㊣a@???W??J????Un車?m∟?x?aVn?x?I@x?V@bm???@lnLm????xVb??'],
                    'encodeOffsets': [[
                            126293,
                            45124
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2204',
                'properties': {
                    'name': '賽埭庈',
                    'cp': [
                        125.343,
                        42.7643
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???V?I????V??bV∟∼b??@?V?????l?UUU?l????m?Il?Ua@?n?lW???L??k????wWm?k?U?VU??bWlXlmn?bUx?xVVknl?UbV??KUb@??VnbmlnzU?㊣b??mJUbW?n豕m???@?X`WL'],
                    'encodeOffsets': [[
                            127879,
                            44168
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/liao_ning_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '2102',
                'properties': {
                    'name': '湮蟀庈',
                    'cp': [
                        122.2229,
                        39.4409
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?I?mVk@wXW?bnwlLnU?@??nLlbXW@a?wnbl@XL?a?@??@LULnJ@xVnmV@VXXV@VJkn@V?KXX?Jlb?xl@?IVbnJVLUbn?lnVw?JVU@?XU?aUUlwn@∼?n?VKnV∼_VJ?wl@nwlV?IXWlIVVnK@IWmkIVaVU@W?UlmU?@U?WUalkX??@kI??mm?ak?Um??U?V???V?@aUU?I?`?@?k?w@?U?mw???@?W???I???b?Lkymb?I?w?m?bmbU?????k?Vb?xnXV?n????b?∟U??x?n??m?V??∟???b???????????b?VVbX??∼?∟'],
                    'encodeOffsets': [[
                            124786,
                            41102
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2113',
                'properties': {
                    'name': '陳栠庈',
                    'cp': [
                        120.0696,
                        41.4899
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@na@UVI@m??W?kaV?UI@wl@?a?b?m@wVa?k?@@K@k??@a@UUm?UUalmU?@K?U?㊣?@㊣kUKVkUa?a?U@?m@@?k@WLUmkn@mmIkm@amU@wVmkU@Klk@U?m?aXIWWUL?aULVb?mk@UUmUk㊣?_Uym@mbkImaX?WW???xWK?zU@W?kJWwkV?@U?m@UbVVVVXb@VWX?@W?@Vkb@V?nUK㊣aUUlwX???WKknU@mmUk?LUV?VUUV?Ua?w?bkKmwnI??kJ@nmb?`?kmVkLWwUm@UUU?K@UmaUa@UUaWK?@mU???Wkk?VmUU??xVXUVmL?ymXkWUbmXUK?VknWx?JVnkL?l@VVxnxl?VL?WlX?l@b?VUn@bnl?aXblIVl@??@??@VmbXV?@@x?VVnUn@`∼@VnXU@K@?VV@VmbnVn@ln@b?x?∼Ub@b?LV`?n??W@@lU?nnWVU@Vbkl@Xl`XxV?Ubl?kX@?∼?V?UVVbUlkV?@UbVbkLUxmJkX??@b?b?xVK?lXX?bn?nala@?Uk@U?VVklKVUXKVU∼KVan@VUnL?KVL?WVaU_@mmUXa@m?wXwVkVWXk?k@??k@klm@wXKl@U?@KVUUUVaU?V@?alL?xUx@b∼∼VnnV?xlIXJmx?LUVlV@bnX@V?b?aVx?@XJ@b?n@V??VX??l@llX@lU?V?∼∼@??Vbn@?V?k?@VW'],
                    'encodeOffsets': [[
                            123919,
                            43262
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2106',
                'properties': {
                    'name': '竣陲庈',
                    'cp': [
                        124.541,
                        40.4242
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lzXJ?U@??x?@@V??@bUVmKUn?∼n@lnVK??nV@n@VlV?∼WbXn@?Vz?J@?@bkb?bUl@bkb?J?z?WULWbklV?nb??VJ@??K∼U?kl@@W?bVn∼@?V?m?U?nX`?U?LXmVXlKVbUVVnUbn??X@VUL@lUbWx?@?kl`n@V?lb?@nUVWVLVU@aV@?bl@?m?xWX?V?U?JV?l@??la?WnX?K?k?@Va∼b?m?@XV∼IVV∼Unal?VUn@UwVU?@@VVJ?I@bl@XK@wWmXU?UVbkJVXnJVI@m?knwlKXL@`l@VI@UUaVK?n?aVm@a??XW?U@a?UU@mbkKm??@?WW??L@?@Kk@kl?U?bWKUkUU?U????mUUaVU?U@WU_W@kVkJ?_WKkV@bUL????㊣mk?????@Umw?KUa?k???a@a??m????IUWmk@w??m??L?K?b?KW?klVb?X@VV?kn?V@XUVUblJXn@J'],
                    'encodeOffsets': [[
                            126372,
                            40967
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2112',
                'properties': {
                    'name': '沺鍛庈',
                    'cp': [
                        124.2773,
                        42.7423
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XJm@??mXUl?nVbUJ?U@bV@UJWL@VXLmJVbkXlJXxVL@b@V@n@b@`Vbk@lxknV@VV?V@bUL@bV@@bVK@VXLWLXJ@LV@nbWJ@IUV?x@LVJUXVxVx@VV@@LXJWL@VU@@L@VnL@bVVmVX@@VVInJmbnLWVnVULVVU@VVm?X@@JVz?l@?nVVKVX??@mk_lm?UUWV_nJlU???VVUV?VL?UVJ@I?Vna?@@KV@XwWknwnKlalU?w?a???w?Jl_@aUa?KUUU@WU@WXU?@@UVK@?n@UnVV?blK@b?llb@b?bW@Xbl@UlnLl∼∼b??nKlVnI?V@UWU@WXk?w@am@nm@aVw@I@KUaVIm㊣X?lknJVnVJ?aX_VaUaVKmwnkmmn@lU@U@mna?XlKUmUIVmk?laUK@UlUVU?W@U?kVm?a@UUU@JmUU@@bmb?KWV?XUKm@ka@UVKVk@aUKmLkKUU?UmbXb?J@k@WU_@m??@klm@UXKVaUI@KWUXa???W?k?aWUkWUL㊣U@lU?U@?U?J?I@V?JmIm@@aU@Uw?a?@UV@VkI?V?aUk?Wkb@bVL?@@VVVUXW@Ua?@@b???bUV??@??LmUkVUbVllLUV@L??X?WbUXm@U`@?kxlnnJlbnIll?LX?lVlUXmVK?n?V@L'],
                    'encodeOffsets': [[
                            126720,
                            43572
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2101',
                'properties': {
                    'name': '朻栠庈',
                    'cp': [
                        123.1238,
                        42.1216
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???∼?b?L?l?xUbUn㊣?@?nV?L@xnL?lUV?b?xkImJkn@V㊣LUxkV@b?b?KVKnzVl@L∼@Va?x?Ulb?xVV?@@V㊣bn?@?llXL???X??nal@nkVJVI@aU@@aVK@a?UUUU@lmkwl@Ua@_@a@m@U@aUKWwkIlWUanIWK@UXKVIU@@a?VVIUa?mVknW∼?n@WI@K?U?mULWnkVkUW??KkkmJkamIkmlw@?V_n@VWXaW???@KVUkKUkValUnV?K@???VU?a??@a?@VbX@VWUU@U?@UK@ala@IkKmUUa@U@?V?kk?WVwU_@K?UXbl@V?XUVm????Xa?k??l?UUkIm`UIUJW@UI?Kmkm@?UUJ?ImmU@?VUXU`mIUbUK@L?JUU?l@X?@Ub?J?kU@??n?m@Uam@@??aU?mL?K?w???mWXUK@kUa?a@JUIUa@a?KVU?UXm??Uy?_@lmbkLUKWLX`?n@bVL@JXL??WX@Vnb@Vm@UbnVmL@V@x@LUbVV@V@L?UVl?@mb?U@xU@UVVV@X@VVblJ@bn?VKUn?x@lln?L㊣∟?b@?k`VX?K@?kV@?kl@bWIUl@VmLnbm@@JXXmb'],
                    'encodeOffsets': [[
                            125359,
                            43139
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2104',
                'properties': {
                    'name': '葷佼庈',
                    'cp': [
                        124.585,
                        41.8579
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?XVl∼b?UlJ@UVU?@?bVxV@@bn@nJ∼I@U?J?I?VV@V?@k?VVKlXXV?b?l?X??WbXV@LVJUbWL@Vkn@l??@nV`@X@l?IWana?VVVlLnKVL@bUlUL@Vlbn@VL∼WXU?Lna@aV@nV@IVV@V?bUn?l@V?XnKVa@U?UnyWkXa?aVk@a?a?bnm@_WKXmWanU@alaU?l@XJVLVxX@?wnKnVlw???@V_@a??@UkKWU?aUU?anK@I?aU?@WUaVw@klUVyUUVUU?@I?b?a@mnUma@kXa@UWak@Wa?l@a??@W?U?LmU?@U`mIUU?`mUk@@UUK㊣nkJ?bUam@kwm@@a@UU@Ua@?@K@?VK@kmKU_UK?UUa?WmkkL@`?L?nmlkLkbmK@k?@Ulmb@b??@??xUV?IUlmVXX?xm@?JUUk@WUk@?akx㊣@?x?Umb?KUUVmUU?UmVVn?Wk????lWb????UnWVU?k@Wa?V@LV`Ux?XllU?@?@VVbnVlL@J'],
                    'encodeOffsets': [[
                            126754,
                            42992
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2114',
                'properties': {
                    'name': '綵竄絢庈',
                    'cp': [
                        120.1575,
                        40.578
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ll∼X??nV?@XLVb@VVbnb@V?LVV@VVnXxlKnU?l?_na@mlI??mJnxlL?a?xVbU?VV?UVU?KVlnnV@lmXL??W?kxVV?bVL?m@Ula@UX??@XW@UWaUUUUVan@V??@lUXxlIX?V@?yXL?w??XXW∼nblJnan@Vz?`l?nVVVl@?nUaVK?bVKnXVaUaVU?y?nXK@kVK?@X?@m@m?LXa?LW?U??w@??a@UVw??∼?車??y????U????w?I?m????UUl????K?????m?w@mU_車mk?VnU`㊣IkbVl?nn?U?㊣Lk`@X?Wl?UbmVUxkXVlkbllU?Vb@bkVmx@XVV@J?b㊣aULkKWXkWmX?aUJmIkVm@?xU@n?'],
                    'encodeOffsets': [[
                            122097,
                            41575
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2109',
                'properties': {
                    'name': '虞陔庈',
                    'cp': [
                        122.0032,
                        42.2699
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?Xnb∼l??VlnXVJ?LlVnl@z?xnK@b?blKVLn@@V?aVLVK@L@Vl@XVVInVVKVwlUXwlK?L???VVb@aV@X?lUXbVW@n?lWnXKV@@V@XUVVLUVV@@bVVV@@ln@VbVUXV?I?xVanJ@U?IVW?L@UV@@∟V@nInw?W?k?lnIVx?lnzUV?J??VV?L?UnW@aV_?W?XXa?Knkl@nm?L?a@alUVw?K@UlmnIlJ?w?aVU?kmK@w?KmU@???VmVa?w?k?K?a?????????@kUWk?貝???@@akU?K@KWIUm?n?U?JmwUVmIkJ?L?m@?UImJUU@aW@U@@nUb?J?a?bXVWn?@UVmX@V@b??@l@L?@?lUb@x?n?a?bk@@xVJU?lbX???@nUJ@Vmb'],
                    'encodeOffsets': [[
                            123919,
                            43262
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2107',
                'properties': {
                    'name': '踞笣庈',
                    'cp': [
                        121.6626,
                        41.4294
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nJ@nlmVnXKl@@∼n@@??V?bVbUlVL?l∼@???V@LV?knVb?VVnnWVU?@XmWU?a?b?IVa@mV@X@@bVVnIVJ@??n?KlInJVUnx∼I?V∼mVnXJ@L?LlV@b?@????XllV?@????naWW@In@manK@UVkXJ@alk@?lU@??LUWl_@??a???Kkm@k?wVmULm?@akIUa@U@WUUVU?a?@???wk??m??UW?@@b?L@m?a@_mK?l?XUw?K?L??@UWw@K@U?I@m?U@UV??@∼UnJ∼@@_?KUw?W@UnaW?UmmI@m???wUa?L車V?w??UUW?????Ux@V?b@??xV∼X??KWb?K@n@nW??@UL@lWL?m?zUVVbUbmWXXWJ?b?n@Vkl@LlVUn@xnV@bln'],
                    'encodeOffsets': [[
                            123694,
                            42391
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2103',
                'properties': {
                    'name': '偽刓庈',
                    'cp': [
                        123.0798,
                        40.6055
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l??x???@?bV@@w∼Vna?@Uk?V@K@UUUVa@K@w@UnKmUVan@@Uma@UXW??WK@IUK@a?mW_XKVLlKna@kmKVak@VU?@Vm?U@anI?an@?a??UVnb@blLV`?LlU?bna?Kn@naVU@?∼IVK@anUUKVa?UVak??@mJ?kX??UVwk?VUUa∼U@W??@WlkXWlIXUlJla?x?IVVXL?ll@nLV@lLXl?K?z??maU?lkXaVK?X∼y?Ila@aVk?ala@a@??IUy@?WmXa??kU@U@mmU??ULkmm@??VmnLVU@a??@U?@㊣w@??VWIkymLUUkJWX?JkUmxk@?xUI?`mUULm???m@kxVV?bWV@?UV?IUx@bk?V?VV?xUbVV@V@z?JVXU?lnk@@lkL?l?LUU㊣Jk?m@UIUV?LUVU@?K@U?nnV@l@Ll??aUJ@zn`@nWl?IUVUUUV㊣Ln?@nmL@VUVkLVlUxVLVl?Xma?@@akLmWUX@JUnVJVkXJ@X@`WX?VUVUIlb?W@bVUVL@`Un@?U`@bUV@z@Jm@@XV`?LUL?J@IVKmK?I@J?nWVnLn?VxV∟?z@bmV@VUV@bUL'],
                    'encodeOffsets': [[
                            125123,
                            42447
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2105',
                'properties': {
                    'name': '掛洈庈',
                    'cp': [
                        124.1455,
                        41.1987
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lb@Vn?lnVVUb@?VJ@nnJ@bmXUx@xVbkbk?WLUxnl@Ul@?xWx@nUV@?Ull?knkK@bmbnl?LVJX@VIVJn_lJVV?XUmnU∼VVVUnVV?Lna∼V∼w?@lw?bl@XVl@VV?In@?wWWnUVk?JVU?w@???@anaVk?@@lnLlalKnk?m?K@_lKnl?XVb?VVLV`nL@lUL@?@L@?VbV@@V@bn@lxn@Vb?alI?mVL@Vl@nV?_VVnJV_?@nV?K?V@X??@b?kXbl@XblylUUk??@?Xa@UVIlK@UUWVU?Llm@UUUnKWU@K@UXm?XVa@U∼KVUUWUk@a?UVKkaWk?KUknaWa@U??@?m@m?k@?aUJk@@_WKkLmx?l@nUJmIUWlIUa?VWVXn@xWLk@@a?JUI@U?@UVVxm@UVk?mb?VUU?JWU?@?n?aUb?@?l?LmW?Xkb??k@U??I?V?UXW?w?nk@㊣aU@@bUVUKUXmV?@kaU?m@k_㊣l?@XwVa@kVK@U?Wm?VaUmVUUakLUWWn?K?VW_?m㊣V?n?U?@Um?a@Xk@?l?V'],
                    'encodeOffsets': [[
                            126552,
                            41839
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2108',
                'properties': {
                    'name': '茠諳庈',
                    'cp': [
                        122.4316,
                        40.4297
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????n∟??∼???W???@xXb?wnKl@nX@VUV?KmL@VU@Ux??@Vlb?x?U@VUb@b?k?`?IUlVUn?V@@UV@@JnXlK@b?@nb?WUkUKVwUklKVU@UnK@mm??KVUVVVU?JXk@mm_@yVI?bk?@K@kmU?m@V?LV@VU?KVUVJn@l??IVV?K?klK@kl@kmV?UW?I@y@UUUVa?wUUU?l?@akmm?VaUKmIUa?Jk@?wka車IWW?L@UlmUIU@WW@UnUUm@wmIVK@K???@?bWKk@ma?x@bWXkamK???@mVkKmx?aWX@xUl?n?J'],
                    'encodeOffsets': [[
                            124786,
                            41102
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2110',
                'properties': {
                    'name': '賽栠庈',
                    'cp': [
                        123.4094,
                        41.1383
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?`Vz??Wn?VUV?L@bVbVJ@I?bVb@lVLXW?n???x?LnKV??b@?n@Vbn@m???V@?l?IVa?@@W?kVV?I@KVLVanJV_VW?UV@nn?JVI?Vn@na@alLlmk?Vk@?VU@mXw?wk@@VmkVwXKl?laUa@wVwnW@amI@mUI@?VaUUkmm?@Uka?L@?UI?y?LWkkKU@mKk@?kWKUU?J?wkbkIWVkJWXkl@X??@X?VVbUVl?Ux?VW??lnI?@l?Ub?VUbVLmV@bUL?J@?UVmbm@?Lmb?akV?KU_kK@amaVU???bm@?bmJ@b?VUn?@UVl@UbnL'],
                    'encodeOffsets': [[
                            125562,
                            42194
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '2111',
                'properties': {
                    'name': '攫踞庈',
                    'cp': [
                        121.9482,
                        41.0449
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vb?x??@nnJVnX?mb@V?XVx?L@`?@mI?V?@U?@V?V@n?J@V@LXx@V???K?LVx?W?knL@`?b@n?K@a?@VX?∟?nVK@aVU@UnU@a?yU?Uwm?mKXU?m@I?JnLUL@J∼IVK?KU_@Wn@@I@yVU@aV_@?Vm@_UKUV@a?XkaVJVU?UXW@_@WWIUlUIVm@IVW@IU@@VU@m?UVVk?J?_?l@aVa@U?V?wka@U??VwV@@UnK?LVU@UmWk@mL?xWa@w車?UVUI???????x?J'],
                    'encodeOffsets': [[
                            124392,
                            41822
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/nei_meng_gu_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '1507',
                'properties': {
                    'name': '網豐探嫌庈',
                    'cp': [
                        120.8057,
                        50.2185
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?m@?k????kl???@?kJ∼?????車∟?L??l???W?????車?lwk??谷??車?∼??xV∟??W??l??耒?????杗??????????@?kWKUKm??@?JU@????身???@L@???VLn?@V身?WJX?@J?bU@??mVU@??車bkWWL??????UW??km車?㊣U??V??????????x?????K戎????????????身??㊣???U???m???????巡K????迅n????@??b?????@???????x???L㊣????U?∼U?∼???∼??那??V?∼@??nx?豕?b??????l??Ilx?l??m?????l???m??那V??x?????Vm???????????∼????b?y?@???X??m??w∼?k??m???kk????谷X_?W巡貝?a?????@?????L???V??????車aU???∼mk?∼?U???k?∼m???????W?????x???????????al?∼??㊣?z???K??m∟??@?∼?ny?U?貝巡??言∼@????@???k?l???kxk??JX???U??@??k??車?貝?@l??Jl?車?@??????an???∼谷??'],
                    'encodeOffsets': [[
                            128194,
                            51014
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1529',
                'properties': {
                    'name': '陝嶺囡襠',
                    'cp': [
                        102.019,
                        40.1001
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??n???????∼??V??????@????????車??@?ky??@貝???wl??????谷@????x???UU?身L????車?n?車?@??車@????????WU??身??@谷???K???V???aW??????????迅l???m?車?????@?????n???????忍??車??戍??????車?????l?k?∼??n??l??????k?車?W??z???@???lU????n???K???b∼???@???m???身??b??身x@?車??l㊣??貝X????那?K∼???@???????@????????車?豕?U?∟?_???????L???車?J??@??a????'],
                    'encodeOffsets': [[
                            107764,
                            42750
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1525',
                'properties': {
                    'name': '柈輿廖毚襠',
                    'cp': [
                        115.6421,
                        44.176
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???I????@?????????車?U????豕n??????U????????迅??豕?????????V?????V?那U??x???????∼?m??U??l?@???n???????U∼l?wUb∼∼∼V???l???L???n????n??a?貝???I??l?k??????????谷n??????x???@????車?????W??ml?車a???b?yV???V???U??K?????n??????身Um??????w?b?????w杗?????∼?kw@車???w??V??U?mW?????V????貝@???n??@??n?V?車J?w??k??w?nk??a車???V??`?????@mwn??m㊣@車??K???㊣U????a?l??身??k?豕?????n@???k∼?x@??`??∼?@????wm??@??n??a?????n???V車?車k???@?k???a?∼?@??U?車b??@???V∼?@V?杗L??????V???????身b??'],
                    'encodeOffsets': [[
                            113817,
                            44421
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1506',
                'properties': {
                    'name': '塢嫌嗣佴庈',
                    'cp': [
                        108.9734,
                        39.2487
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?L??V??kkl@???W里??????lz@??????????∼k????n@∟?U?豕?b??X??Ll??x???∟???J??∼U?????VW??J???bk?V@??lbn??y?zV??a?b@????Ul?∼y???m∼??k?㊣lbn?∼@???JX??V???J@k?L???l??????????車???@m??mLU?車??@???L@??`??m?????㊣??l???w???????I@㊣????身∼Uw????????㊣b?????wn?車@??@??????車n???車??b????V??Im?身KU??L?㊣?x????V?㊣??∼???l㊣??@W?????妖??豕????∼???V?'],
                    'encodeOffsets': [[
                            109542,
                            39983
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1504',
                'properties': {
                    'name': '喪瑕庈',
                    'cp': [
                        118.6743,
                        43.2642
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????w?身??∼_?????U??l?????V???????????????U??wVW????W???m??????身??V???身??谷??車??VV???@??@????V∼?x??????∼???????W????w????㊣mn???杗V?bU????x?L???bW??x??U∼?V車?l??@???????V@?㊣`???????@????V?身????∟V????????x???Lk??l??m????@m?∼?@?????U?????X??n?VU????x??@?lx?????????x?????a?x????n??V?????∼?m巡????LV∼??U???U??z?a?∟?bk??nX??豕'],
                    'encodeOffsets': [[
                            122232,
                            46328
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1508',
                'properties': {
                    'name': '匙栫儷嫌庈',
                    'cp': [
                        107.5562,
                        41.3196
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@戌????????????U???????U?????谷?????????身?ak車?車?a@????aV???∼@?谷l????w身x車?k㊣??V車@??a車bU??y?zm?ka車?U@l??a車??IX∼㊣U?????V???I???????wk??KW????a???V@??m??l??????車???∼??@?????㊣??U?∼??????m???'],
                    'encodeOffsets': [[
                            107764,
                            42750
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1505',
                'properties': {
                    'name': '籵賽庈',
                    'cp': [
                        121.4758,
                        43.9673
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????豕?@???w??????V??@??@??????J??k???X??身?貝∼aX??????????a?????L∼??@???????VX??a???K??????@??????Vn??V?wX???∼????wV?????㊣???????m????㊣?Im????@???JV??U???U??U???車a??l????貝?K?????L???@身?身???n???X?????UX∼xV???????????????U?車?∼?k????V??身里?`?????x????身?'],
                    'encodeOffsets': [[
                            122097,
                            46379
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1509',
                'properties': {
                    'name': '拫擘舷票庈',
                    'cp': [
                        112.5769,
                        41.77
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????a??????U????????KU??@U???@????aV????@???b???l?@???l???U???m?????bm????@n??x??@??????_@??wl????L??????????@??b?????w????U?車a???a????kw∼???l??k???∼???a車????k??車??????????????Ul∼?x∼n????車n???∼?????V?∼∼????J?里??車???????'],
                    'encodeOffsets': [[
                            112984,
                            43763
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1522',
                'properties': {
                    'name': '倓假襠',
                    'cp': [
                        121.3879,
                        46.1426
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?Xnl?∼@LVL???x?U??nU????V@?aW?XI??????@K@w@K@I?????????I?@X@V?nX∼l?@?????????????bV????x?????那?Kn????@???Un?l@U??a?貝杗????x@?㊣kX????谷V?杗?l身???????????V@????∼???????m?????????b?????谷??V????ml?身?V???V??????U?y∼k??V?????∼a@?k??K??車??b??????車?W∟?b????W∼??l??∟?I?∼身?@?㊣??@U???????????m∟?那身∼??????l?k???∼J?里???∼??n??bV???@?車??∟@∼?n?l'],
                    'encodeOffsets': [[
                            122412,
                            48482
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1502',
                'properties': {
                    'name': '婦芛庈',
                    'cp': [
                        110.3467,
                        41.4899
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?x??迅??V???????身???????I???貝??身m?????????I???V??l???????Vm?nn?W?kW??X??wU????????㊣㊣??k???K@l?I身??UW??I???@m?ka???l???n?㊣?zk??V??U???l??∼?w?x??k?㊣那?@?∼U∼?b車?@?∼b??l??b???????????那????'],
                    'encodeOffsets': [[
                            112017,
                            43465
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1501',
                'properties': {
                    'name': '網睿瘋杻庈',
                    'cp': [
                        111.4124,
                        40.4901
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?U?????????m?貝???m?wk??V∼?????????????車X????車a@n?????????????∟??V??xW???lXX豕m??mUn????車?k????U???J??∼????∼?n'],
                    'encodeOffsets': [[
                            114098,
                            42312
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1503',
                'properties': {
                    'name': '拫漆庈',
                    'cp': [
                        106.886,
                        39.4739
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?∼?貝X???@?lk?lU?㊣貝?K身?V???X???@??那?∼??k∟?x??@?'],
                    'encodeOffsets': [[
                            109317,
                            40799
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/ning_xia_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '6403',
                'properties': {
                    'name': '挔笳庈',
                    'cp': [
                        106.853,
                        37.3755
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nLV?@?VL?a?bn@@l??@bU?VlUV?zVx?∟k?V豕?Xn??@nm∼a@U???@V?XnV@Va?U??VKUUU@@U?@@KVa@U?@?wXkW?nk?㊣lLnU@UmmVKnIVWnI@?UK?@UK@?@UVKXkmW?LWUXmlkVwUyVa@w?w@aVI?K@aV??w?KlLVV@LnV?VVnU???∼W?IU?@n????@??@U?UVW@UxUxVn?b?K?b??U`Vb??V@XX?VVl∼InmnU??∼??anam??WVX?KXm?k?aVU@?Vak@@wma?n@K@U?UWKXU???@UI?b@alW@akLUKV@@Ukw㊣I??nL@kmwkWmk@JUI??Vmn?nU@m@U?K??VKlkUwk??nV?UKmbkI㊣??K?kmVkK?b@U@a?VkUmn?`kIlaUK@UUKmbUI??Ua@mUa@a??m@UUULUK@bmKkbWI@WXwlkX?Wa@k@?kK?LVkkK@L@JUVmzUKlwUUnW??XVlKUwVU@aXI@aWaUw@W@_nam@??UkWVkUWaU@nwmJkUV?kWVUmUkJ@ImbUa?@@W?_mJknmak@@m?X?aUV@??xU???@???@VUnkV?@Vn@`ULUbWLXVW@kbUJ@XW`?@?n??WJ?@??m∼@x?x?bn?Ua?w?l??∼x?IVVUL??Wb?bkVVX?`UbVL?@kx∼LlV@V??Wb?J?n@bl∟ULV??∼@lmL@???U@@aUwmKULVxUVVx@??@kU?@mK?L?a?@'],
                    'encodeOffsets': [[
                            108124,
                            38605
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6405',
                'properties': {
                    'name': '笢怹庈',
                    'cp': [
                        105.4028,
                        36.9525
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼@?b∼KnL?@lV?@@?UwVUUwVKnLVx@bV@?∟@?nK@k??U?VKk?@a?m?IXa??@UkU?Klw?@UKVa?_UWlU?aXa??VKUU?J?w??㊣k?xVbm??a?w@wn????@XI???m?@X_@WVIlaX@WUXKVaVK@_Um?@lUVm@U??@???V??w@?VU?wm@@W@ImKUkU@Ua?aX?@wWaUKkw@UVaUamLU?nk@?㊣`?@k?W@Ua?ykb?I??@VWJkLWUkJ?wU@?n?∟mL?wm@Um??XVWbnV@bmx?VkxUblLUV@?kVWKU???kU?@mn@JnV@bUnmJUn@?k?@Xlx?LVVnKlLVV@?@LkKULVbk`WL@lkXW@kV?@U?Ul?X?lkaUbmV?@@L@??V@bkb@x?lW??b?bW@??㊣@UJ@IU@mVk?VxV@@l?Ill?n@Vm@?VUbl?@J?LmK?XmVkU?KULU`@L?w?KUX?lVUl@Vb?JX??b?x?x?????a?@'],
                    'encodeOffsets': [[
                            108124,
                            38605
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6404',
                'properties': {
                    'name': '嘐埻庈',
                    'cp': [
                        106.1389,
                        35.9363
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@Vnn@∼xnK???mV@?xlIXVlKXI@U???Jla?zVbX@l?∼@?_@?mlV?nKVbUb@VlxVLXb@xW??bVbV@VlnL@J@Xn@?x?b?W@nl@nblmnI?`@X?@Vbna@aVUUWVk?@kbWakbU@Vw?W@_l@nmn@@alVlk@UkmVak@@a?UXa?L@?@KVa@a?xWI@KnkVaVJn_lJ@?X@?m@nVanUVb@mXLlJ??VWnLla?VVaVX@KXVVkVKlknKVa@aVU@KXb@klJUknUm?@K@_UW@alIUamaU?kJma@IUK@U?@@UW@@aXLV?VJVaXI?KlaUkUV@ambU?UJkIWJ@wUI?V@JU@UwV@@Um@?nU`@UkUmVUxWUUV@a?b@aWXkKUU?UUaWK@wnm@IVU@aXwm@UmVaUalk@anKUwl?Uwl?kK@wma?UkmmIk@VmkUUbW@UVUnW@kV@xkVmbVnU??@UbUV@a?k@kkW@?kLW∟@?nV@VU@W_UV?UU`VLUV@IUV?VULU@UUUJ@wmkUJ@?WI@l@bkKkbVV?bVbUL@UUJ@Vm@@L@x?bVVVLVlVwX@Vb@bmUkbk@@JWIUV?w@Km@UkWKXxWL?@UVUnWK@xkVW?@KUL?wWVXVWzXVVKVXkV?V@VUbV@U?VV@?@LXxVL@V?b???LnKVLVxXVmb@l'],
                        ['@@@J@a?U@LWK?UUxVVn@???LU?W@UbUUUa@KUX']
                    ],
                    'encodeOffsets': [
                        [[
                                108023,
                                37052
                            ]],
                        [[
                                108541,
                                36299
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6401',
                'properties': {
                    'name': '窅捶庈',
                    'cp': [
                        106.3586,
                        38.1775
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?U?wVK@UVW?U?b?w?V@knV?@@KU_VK@K??n@W_XWlL@Vn@?w@Ula?@Wanam貝@a???車@a????UaV_∼??a?L?aUmVwVwX@VUV??@@?????@mV??J?X?㊣V?Um?UmU@KUUkK?L?xU?@b?LUJ@b?x@xUbVzUxklWnXV?KnXWlUL@V@?VL?@VL@?mJUXmJULnn@VmVkK??mlX?Wl?x㊣@@VUb@L?@@VV@VVUL???VUbU@WmU??@??@V?bmn?@V???@lVnU?nVW?X?Vl@?VVUn@x??@?XL@??lXx??Vb'],
                    'encodeOffsets': [[
                            108563,
                            39803
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6402',
                'properties': {
                    'name': '坒郲刓庈',
                    'cp': [
                        106.4795,
                        39.0015
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@U??車㊣?????mbXb?@kb@V?xm@@UkKWXX`m@??@LULV`@L?@mU@l?U?x?a?VUX@VUL?x?VkLWV??@J?nVLXVl?UV@zl?VL@V@b??n@lU?WVLlLVbU?VxUx@x?L?x???k?K??Va?U@wXa@?W???Ua@??b?k?m@?'],
                    'encodeOffsets': [[
                            109542,
                            39938
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/qing_hai_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '6328',
                'properties': {
                    'name': '漆昹蟹嘉逜紲逜赻笥笣',
                    'cp': [
                        94.9768,
                        37.1118
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??V?∼??@la?X?㊣?w???@?Ul??a??n??K?w@U?a???a?L?m?L???xlaUa?w?m?b?U??nJ∼a?k????kw?V?w?@?kkV??@?辰????n??XImw@mVw?a@??w??mLkaW??w??l?k??車??@?W?????@???????Uw車?V車m??????@V??k????k?∼?UklkU㊣?I???k?㊣@????J???@U??Ik@W??V?????n?KULn??X??@???mU?@W??m車Kkn身b?x?@??U@kw@??L???Uk?mw???k?l?V??U????LkUWl??@a?@??㊣U車??????m?@@wkw?Kl?U??@??l?U????_??Wa???l車?Vbkn?K???@??身∼?@??W??xUUm@???X??W?ULU豕?@mbUa?L?bUW?x?IUJWz?a?b?y?@身?車LU`?XUl?U?V?n?m?b?Lkl?U?V??車a???b?K?nkb?mmn?W?????X?W車?kU?l?U???U??@∼??????V?n?mJ@??n車JUb?XUlV?kL@lVxnnmb@∟Vz?`???@?Vn??JV?∼b?U?Jkzl?kl@?車?@??∼k????b?U@lmb?XV?kz?V????X?l里???@?谷?@?里?∼?bU?l??_∼?@x????kbVb?K???V??∼@???l???K?b@n?x???@???L@??b@?nn?W?b?x?Ina?xlU@??㊣??VU???b?@???UU??WV????W?n?a??@?nmnI???K∼xUX?@?a∼m?kX????V?k?∼?L???yVa?IlwX?∼UVw???K?w@nV@?m∼nm?n?????Vbm?Xn?∼??@x?x@V?b?UlbkxVn?JUnVV??∼K??m∼nx?nn∟㊣?@?UXVV@??lV??bmVV???Vx???∼?I?b?a???bVw?@??VL????@??????k??'],
                        ['@@?@???@n?辰V?a?w?bVx?x?a?V?_?J?IVm?L?a∼@??X?lK@??k?l?KVbUb?@nU?n?a?@lm?????n?mn???Vy??巡????In??@@???@?∼??V?K?bVI???@?車??@?n貝WK??k??k@??????a?X?㊣V??w@㊣??@?????n?Wm?w@???@???V?UUW??K???a㊣Vkk?V?w?x@?UJ?x@bkn?b?m?@Uw㊣U??U??Km??I???????@?????@???n?J?b?豕?n???K??????W??lm?@∟n????b@b???l???@???∟W???nV@x??∼@Vx?@lbUblbX?W?????l?U?@???V?@b?lVxUbVx?bV??bm??VV?']
                    ],
                    'encodeOffsets': [
                        [[
                                100452,
                                39719
                            ]],
                        [[
                                91980,
                                35742
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6327',
                'properties': {
                    'name': '迶攷紲逜赻笥笣',
                    'cp': [
                        93.5925,
                        33.9368
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???V∼?∼V?klV???X?W?????Xnm?nla?m?L?a???b???U?Vlk巡K?a?n∼m?U?VVk?WV_?K???@?z∼a?bXyVI?J?wVX?a?KVbna∼@V?VKX????W??n@VV?wX????@?????@???LlmUa???k?㊣Xb??∼`??V?k????@V?k∼?Llx@x?@?n???????V???@@b??XklV?K??V????U?k?l??nxl???????@㊣??m??w?J??@???V??m?Il谷?a∼?U???@k?V?K??W?∼w???K???y?????Vmw??kkW??JWU?V?w?L?m?@@?mw?kn?V???∼?∼@@????Lla?J??nV?U???U@W?Um???k@WykU@??wV??kVw??k??wW??????K?????a?b?I?lU??@kw?W?XU?∼w?㊣@U?Kn?W??KWx?k??V??amwXw?@??Wmnk@a?Vk??b?L?l?Imm?wU?????Wx?n?Jn?@???kw?aX??????V?∟mk?x?k?????VW??VU??@V???@?∼wn?@?m?@??@UbU???mn@??@??VaU????V?@?l???x???lV??V?x???∟Vx??kK@??@?x@?kV????kIWbX??x@n?x?UW`?_?@㊣?Ua?LUx?K??WbkVlb?bm??L??WIUw?Wkw?V@?kI???谷Ub?UUk?V?Km?k@Um???m???m?L?????Um???UxkKm∼?L?w??k@k??Vm??K?VUk?@?a???m車KUU?x?Iml?n???bX豕VVU?∼?@???@??xXnm?????@??∼@??xU????W?b∼???@??ll???XLm?@?????∼@??UJ?a?L車U??@∼??@??@m??J??????Uz??m??n?m?∼??kn?@?b?mmV?@VaUa?L?k?l@?kLW?身??@?b?KUn?J?I車`?U?b?wUw㊣a?x?b?Um??@???@?b?a?b???Xm???????Vb???bl?U??V???U?∼?VUx?@U?V??@l`??nL@??LW??∟kX?W?XUVVV??UbVb@∼kVVx?a?@???b?a?J?U@?????V??l?@Xk?aW????@la?U?b?m?L?????b???a?JVbm?'],
                    'encodeOffsets': [[
                            93285,
                            37030
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6326',
                'properties': {
                    'name': '彆醫紲逜赻笥笣',
                    'cp': [
                        99.3823,
                        34.0466
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?V???K@?lxV@???@?w?alm?L?nX??@nV?∼@???∼Wm?VK?L?m?????UX?l@?JV??@???I@w?W∼???n??k??Vw?????@l????a?Jna?LVw∼kny∼Unk?V???ll??V?@@?nU?????In?∼X?w?K??VWV???@?∼車k?㊣I???am?Va????V?∼?@m?k??l@???m@a??U?mwX?@w?x?m?_?`Vn?b?KVw?@@?nUV?VmVV?Il?l@@??m??U??w∼@V?U???m??J身??L?a@???㊣`U_k`???車?kX?lK@??ak?????W?k???kx?J???w?x?xmI?x??@k㊣J@????∟U?k?mV?∼???xkwm??n?VU??????lm?車Xk∟??UK???@mVkK@kl??貝??m??VUb?W???b???am?mVX?m@k∟?X???b?U???J????@??bVXV??∟V?kx??V???@l?V??Wx??W???mK?nl?k???U???@n?U???@?????U???U?????z㊣辰?L㊣??xX?㊣??L?U@l??V????bk那?J?nU???@????I?xn???@??豕???豕'],
                    'encodeOffsets': [[
                            99709,
                            36130
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6325',
                'properties': {
                    'name': '漆鰍紲逜赻笥笣',
                    'cp': [
                        100.3711,
                        35.9418
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vx???里??@?????X?∼U???m∼?nb@?@LUUW???@nl??????V∼UXb?V???谷?@?kWanm∼@?x?z?K∼??V??V?kw?Lnm∼k?x?a??@??wn???@??_l??_Vw?m?豕???U@??Wn?@?mKU?n??K@?∼?U?V?nm?Ll??U?U?谷㊣車車kkm?n?akV@?∼車?X?W???I?xmm?V?UV???n?Wy??k?V???∼Wnk?a???_?K∼?W?na@??mU??w?l?IU∟UX車??L?x?Wm??J????mV@??@?Uk??k???Uml?Vmz?lUx?Kmb?I?b??k??@?豕車?Ux???lm??????X@x??@????l???JV?klVl??l?????∼lU巡?@????n?U???'],
                    'encodeOffsets': [[
                            101712,
                            37632
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6322',
                'properties': {
                    'name': '漆控紲逜赻笥笣',
                    'cp': [
                        100.3711,
                        37.9138
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@身m?x??Um㊣L?????@kxmW?b?I??mIUx@b?b?V???k?b?l?I???U?m@????@?a?車?Ul???@w?????wXa??車∼????kU?aV??b?w?lmn?KlxU????U?∼?L?y?w?@mnXb?l?@?那???UWa?V?U?∟??k?@m??X?VV@K@?ma?∟?n???V@?????l豕k????xX?lbnK???x@??bUx@nnxWJ???m????@?∼?lU?l?@?x?Ulx??車??l?bmI???V?a?n?xVbkb?w???K?n㊣K?b???b@V?x?Lm????bk??V車@???x車??Wkb?@??U∟????@lUX?∼l??U??lLX??a?V∼w?xUb∼x???KVk?mlw?k?K?w?K??VU???????Il?na∼LV????y@w??∼??wlw?w∼㊣?_lVk?@∼?b???z?????@l_?@?㊣l??Vl?Ua???LV?nKln??∼Ill?a?w??∼x?UU?@w??V?km?L???K???a?????m?????mU???V??l∼?∼a??V??@@w?amm@?n@????V???@W??????l@??@Uk@'],
                    'encodeOffsets': [[
                            105087,
                            37992
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6323',
                'properties': {
                    'name': '酴鰍紲逜赻笥笣',
                    'cp': [
                        101.5686,
                        35.1178
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?l???那?V?Vk??KmnU∟V??∼@??Lm?V?nL?L@alb@al@n?∼V?_XmWU?amaVIn@n??aV??車VW??U?∼a?x??@??a?w??@車?a???bm?@k?w@m?a?w@??In?mm?@UkkW???@@k????Vk?J?kVyk?l?@????U??X?辰??mmX???lmU@??Wl??y?XW??b?l@a?I??k@klm@UxUU?V???X?l?aUn???I@x?@???K???UU`車?l???@∟???J?k∼xV??n@?mbX????L?`???bml?X??U?l???Xzm???U??V?Unn?w?J???X?W??@?lU?b?mln'],
                    'encodeOffsets': [[
                            103984,
                            36344
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6321',
                'properties': {
                    'name': '漆陲華⑹',
                    'cp': [
                        102.3706,
                        36.2988
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@??b?∟?I∼?U??∼U?nnWx??@b?L@lUUWbXxWl??nxV?Ull??XV?U?nL@l???KVn???wV???@m??n?????mL???KUaV????WVk??????@?Xw∼@????@a∼w車UU?mIk??aVm?wmkny??V??n??m?X???naV㊣???w@a?b@a?m???V車?k?WKU?U@WanU?b@????x?b@????w?bV∟??UX??U∟?bm?m@UJnb?bXVWn?`?Um?k@@bka@b?K'],
                    'encodeOffsets': [[
                            104108,
                            37030
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6301',
                'properties': {
                    'name': '昹譴庈',
                    'cp': [
                        101.4038,
                        36.8207
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@kmKV?U??Wk?VkU?mw??XkWwXaVV@k∼K@a??XwmmV???V??車?J???am??X@??V?????nUx?`k??`@???m??x@???U??blV???豕????Wb?x????@x??k??V???b?@?∼@??n?V∼??J?k?a?l???U?a@aVwnJ∼?∼J?anXlw?@??'],
                    'encodeOffsets': [[
                            104356,
                            38042
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/shang_hai_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '310230',
                'properties': {
                    'name': '喟隴瓮',
                    'cp': [
                        121.5637,
                        31.5383
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@u?u?GPIV㊣???{\\qJmC[W\\t???j?p?n??㊣??|豆?e`????nZzZ~V|B^IpUbU?{bs\\a\\OvQ?K?s?M防?RAhQ??lA`G?A@?W?O?'],
                    'encodeOffsets': [[
                            124908,
                            32105
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310119',
                'properties': {
                    'name': '鰍颯⑹',
                    'cp': [
                        121.8755,
                        30.954
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@`y??N?Dw????LxCdJ`HB@LBTD@CPFXANC@@PGBKNECCBB@EBFHEDDDSNKAUNBDMNqf[HcDCCcF?@EFGLEBa@ACoCCDDD@LGHD@DJFBBJED@BGAEGGFKIGDBDLBAD@FHBEF@RFDMLE@SGANFFJBANPH@@E@FJjRIACDMDOEKLFD@DbDAJI@AP@BGHFBCBGDCC@DCA@CECGH@FKCEHFJGBFDIHACEDNJDCVFBDCRKRLDLITB@CjNJI^DBCfNVDHDFKHAFGDIICDWBIF@@CFAjFJNJBBHD@CJ@AEFJ@@DH@BFBCPDBMFEQGDIFCNDHIP@HDABFACBJFHEBSZC@DP@@JDB?~'],
                    'encodeOffsets': [[
                            124854,
                            31907
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310120',
                'properties': {
                    'name': '畸玵⑹',
                    'cp': [
                        121.5747,
                        30.8475
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@~T~JjZdDbLXDLCB_J@@FHFZJJIAGH@HGR@BENBLID@@LFCDF\\FpDBDb@FAHKFE?@dEDDdC\\GreNMACVMLBTMCCFCEGFAA@DAFDLMHA@OD@BMEWDOC@AS@KGAI_DcKw??赤s????ctKbMBQ@EGEBEJ@@MBKL@BJB@FIBGKE@ABG@@FMFCPL@AjCD@ZOFCJIDICIlKJHNGJALH@@FPDCTJDGDBNCn'],
                    'encodeOffsets': [[
                            124274,
                            31722
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310115',
                'properties': {
                    'name': 'ひ陲陔⑹',
                    'cp': [
                        121.6928,
                        31.2561
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@EN@JJLNHjLJNR^GRYVBNZJRBV@PDvbLNDN@LGNER@nCNQNuT_TIVFV\\Z\\XnDrI|[????JUHO?}CA@IO@@CYDATGFIEDAEBBAGCO@GJMCEDCJRHEFANOCADAEG@@CI@FE@BDIC@AGIAIMiEEB@DE@AJCXJDCJEHGBELGCUCeMAD]CIJiM@DSAKJKCLQDQACUECDMIFCBDJGECHAEIWCK@GLMCCGEACNKCEJG@MMBMC@@CIJUINT@JAJSTEPZZCP'],
                    'encodeOffsets': [[
                            124383,
                            31915
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310116',
                'properties': {
                    'name': '踢刓⑹',
                    'cp': [
                        121.2657,
                        30.8112
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@L@BIHFN@@EE@@EFBDGDAADVDD@@EF@CA@IIsRE@GDAF@BF@CV@|FBCHBLCNHAFCADBMDCFZXHILBVEEQA@MWFARJJ@DCX@@TEFBLHAAERE@AJABRPBNK\\BrJ\\VHGND@CNADKDADQjGAGNC@GJ@FCFFHC@JF@@dLBDSFADHVG\\DTEPDDHJALIJkJDJCDIPE@YDCBiK@DONE@EH@BAF@HLJA@EIA@ALKNA@@FIFAFHR@NALads??yQY@?A㊣D?XUVI^BF@FFF@HBJEDFFGFEBSRkVEXGHFBMFIVW@GAEEFOIAIPKABGWEKFSCQLQBSEIBC\\FdBLRR@JGACFDDEF@AWB@LJJYNABBA@CUEGPaO_AIE@MYMFIGAEFECHSAAKAO\\[JEDB@E@MMA@@AGBKMGDFFCDDFEDFJF@NPBAFLHFH@EDDHBADDC@DDCDHHCDDFDABDAD@FEFOBCJ[D@HEDDNJBDDHABJIBBvGLBJAH'],
                    'encodeOffsets': [[
                            123901,
                            31695
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310118',
                'properties': {
                    'name': 'чひ⑹',
                    'cp': [
                        121.1751,
                        31.1909
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@RUNKdOFDJCbRFMLAHPLDN@JGL@@APBWYCKN@TU@SHGCEJIDIJKVIZVNM`iNY@CIE@CA@KBOEGEUFCCSADEIEFCDDDIDDHC@CKIeDCG@IG@DHWFEEGCH@@GO@@O]CNpeEQDBFME[JC]DGF@CKOA@QSB@GB@@GW@@ED@AQIJIAAFE@@DO@CFI@KNG@CDACAFEGKGBEGBDCCAIFCCLIECFI@MBCLDHGNAHSF@DMB@EEKBA@@C]DEICFG@ADBHGFKCDAKKHKD@@FHGAANGEEFCHKCECBCKG@ADKCNE\\[A[I@@mGBDQQEO@BCE@AI[AML@JGACLOAFKEMM@EQKC@CUCBCCBCHEA@FF@@FM@GEAJK@GNF@EXPH@FD@M^@HIADJCFDBER@DK@@DE@CAKFOCCBDHIBCNSB@GFC@GQEEOWFICGDUAEJIDBTAHJHEB@DIF@NE@H|HBDBEH@DKBAHEF@HEEUB@FGFGCCCE@AHOB@NH@PRLVNNFBX@RC?PbAvMtBfH@DJF@ELBFA@EH@HNED@FFB@HLC@CJ@@DJ@PIRf@HE@CFF@GPHD@DKE@FFBEFFD@DEFCA@DD@IjCRFBAHFDKD@HF@@PM@H@BlbDJDBFEF@DLXB@HCD@@IFCBIFEJD@FDC@FBALLF@PAACJERACAJCBD@EL@JD'],
                    'encodeOffsets': [[
                            124061,
                            32028
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310117',
                'properties': {
                    'name': '侂蔬⑹',
                    'cp': [
                        121.1984,
                        31.0268
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@DLDFRN@FNELPBDKHB@INK\\BBJF@ADP@RFCRHA@nJ@B\\[\\MFLDBCH@DLDADFGLEDFFMHBBGH@EC@GLLLCBLDHEAGBCH@DEFJ^C@DB@LAFFA@CNE@GTMBGHKCAD@NEJFDKJDDJEDBCDHAAFLHFHBEBDDCH@LMJ@DEP@@CF@BEJBJIBRC@@FX@@HA@@HTA@RPBDLE@CHD^\\INFAERCfFMo^D@PP@@HG@HDFFXECGH@@JDHfCLJ@DGDCCCJCCEDJFCFTBDDVEHFPFLAB@NBFCFKFC@CHIACNOHWHCAAFIDD@CDAGEI@ACFMF@R@R_@GQED@EGFEQEDE_IAHKAE?XCQUOQCUDEN@ZI\\DDmAMHCICDSOC@EG@BKHIGMIBCGOCSF[CUHCGEBCTKA@cE@@IGDEEEDI@@HMDBHiHCRCBCLMB@DMCGH[UqI[AMLOAAQIB@BQFBFGBAKFE@SW@CDI@QIEBNXB@FRUFKAGJYWDENCCADBBEMGKDGAAD{EU@@DAEE@CB@HQFJt@JDBE@@FC@'],
                    'encodeOffsets': [[
                            123933,
                            31687
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310114',
                'properties': {
                    'name': '樁隅⑹',
                    'cp': [
                        121.2437,
                        31.3625
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@F@LI@IDKJADKIEJICADGACFECCJ@HKCAFOHAJI@aCBEE@ICAEB[GFGCKL@FGEIFADMLCAEJM@ELQECEIG@BE^QKKLQCA@EHBIGQ[GEHOMGGDHKH@JOECFCjCBEFDNCACMBCILGTABDLEEOEIG@GFIMM@CGKFBFCDE@@GEAGEEACIcGaHMFITIHDN[AKF@FS@OA@BK@IHM@KCGOKBENaQIDECcPMLQVFHFB@BFBKLGD@FAJOVGIACQ@A`LPCB@JEF@RU@ANS@@RCL\\HIFpRBFRBBDKLLDADJDGBFDABHBEDNF@DGBBBADKDAHC@\\JJFBDEH[DEFDH\\LX@XLBLbT@DNJLDCEL@VJABJNDHB@HBHYFBAA@GNFB@@AFB@AFABFLFBHFCL@HJBAFBLC@DN@HN'],
                    'encodeOffsets': [[
                            124213,
                            32254
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310113',
                'properties': {
                    'name': '惘刓⑹',
                    'cp': [
                        121.4346,
                        31.4051
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?m?o?i??[s[YEUJU`SCIEBCCWJY_LIICDWU@@FaBCJIB[ICH[@@CDKEE@MK@@IMCAEBCH@AMFI@SMGEFGB@FK@BHCAIFJNQD@FEBDFMBKGACG@ECWH@@CDDTOEEBGEK@GC@EE@GPHFR\\JHGA@FDBKRLL]RAFH@FJFDKR@FINBFKDCNEBFJEHK@DLEH\\HFADB@JFFDA@bIJGBEPDBGLI@DDEFBDCHDBIJJFCLIBCL@JKJE@ADHDBHJ@HIBBDFHBBAEIJ@BJFAVL??'],
                    'encodeOffsets': [[
                            124300,
                            32302
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310112',
                'properties': {
                    'name': '蓖俴⑹',
                    'cp': [
                        121.4992,
                        31.0838
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@T@@ELE\\BCMJGJSNEbGdHDJFBJAFIEIFCEWG@@gMENSFCVJFAxR~B@IH@AIiI@GE@FGEAFQPDRiV[\\DFSGMHAXHDOMCJCDETBBNVJJI@DD@ANNNH@FILDDMFBDHNDHKL@XDFGLD@EHGFD@DDB@CDDHCDAEAHG@ABOJ@BIaC@CECLKPFNCDCJBiQEIF@@@OGBMIAEEBMTHF@NKEC@QFEGA@EBCKAACHCLJHEFHHB@AFCAIEACIC@HG@KCCDC[ECEED@KC@KJMAAFQ@GHG@BHIJYIGE@EI@A`KDWCaKcCiY}I}S[CYJM@CFDVPRRVWDF?LBBG`JCFRFEFFHC@RF@HQ`Q@E@ENBDJ@HFCB@DCCEJBBGDGXMPBDGJ@DEDELEDMA@DJF@DMZ_jMNYUUJILCJIJDFGH@TSVM@DLXZ'],
                    'encodeOffsets': [[
                            124165,
                            32010
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310110',
                'properties': {
                    'name': '栦ひ⑹',
                    'cp': [
                        121.528,
                        31.2966
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V@CXJDKJZ`XIDDFADJvSRMDM@mFQHM@KCMKMuaOCU@BDAJSX@HKJGD@PNJCJWAGT@R'],
                    'encodeOffsets': [[
                            124402,
                            32064
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310107',
                'properties': {
                    'name': 'ぱ邲⑹',
                    'cp': [
                        121.3879,
                        31.2602
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@F@@FHDL@HFFAPFCSDC@@XGFDH@BDLHNACEFA@ERCIMJEDBAGL@@EHAFENHHJ\\ONQBQCIBC[MKACKI@GGGH@I_G@CW@[DMHCDIBMTDHN@JNHEH@FJFPKFACSBKHDJNABDMDECAFiDEDFDIPG@GLHCNH'],
                    'encodeOffsets': [[
                            124248,
                            32045
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310104',
                'properties': {
                    'name': '剢颯⑹',
                    'cp': [
                        121.4333,
                        31.1607
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@RADL\\NCPHFfLJaJ@FWLGMGIK@IFMDOYYFOTSBI@IMSAMSACFIDNDCPWGGBHNET[CU\\QjOCERFBEHF@@HjJBJG@@J'],
                    'encodeOffsets': [[
                            124327,
                            31941
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310105',
                'properties': {
                    'name': '酗譴⑹',
                    'cp': [
                        121.3852,
                        31.2115
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@HFFB@HF@DCAELENSJADCNG\\CX@@D`H@JHGHHJ@BINBFUGEDO[MCKQB}AwQEBUIEDMTNF@hH@FXEDFJEJIB'],
                    'encodeOffsets': [[
                            124250,
                            31987
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310108',
                'properties': {
                    'name': '掅控⑹',
                    'cp': [
                        121.4511,
                        31.2794
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@CSG@BQGODUPWTOBQAAFMECKBGEMFKEOHADDJARMR[PGI@TEJBNG@ADBFND@JL@@NFFCL@D\\@DG\\JJADI'],
                    'encodeOffsets': [[
                            124385,
                            32068
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310109',
                'properties': {
                    'name': '箇諳⑹',
                    'cp': [
                        121.4882,
                        31.2788
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@bA@E@QHSXBDIMI@OHCLI@GTWBIACQAYIOFGCENBBARSPOXCVHPARH@DT'],
                    'encodeOffsets': [[
                            124385,
                            32068
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310101',
                'properties': {
                    'name': '酴ひ⑹',
                    'cp': [
                        121.4868,
                        31.219
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@NEHFLAFDHDPEAMZUHQQ]IMKJG@EPERABHBGRUCCNGV'],
                    'encodeOffsets': [[
                            124379,
                            31992
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310103',
                'properties': {
                    'name': '竅俜⑹',
                    'cp': [
                        121.4758,
                        31.2074
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VDHQGABAFQFOH@LIiKKHEXI@IbAFZB'],
                    'encodeOffsets': [[
                            124385,
                            31974
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '310106',
                'properties': {
                    'name': '噙假⑹',
                    'cp': [
                        121.4484,
                        31.2286
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@DLLB\\NPGLFHUDMYABEeKEVMAAJ'],
                    'encodeOffsets': [[
                            124343,
                            31979
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/shan_dong_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '3706',
                'properties': {
                    'name': '捈怢庈',
                    'cp': [
                        120.7397,
                        37.5128
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?L?LllV里?豕∼x????l????b??V∟?Xn?l?V??????∼???豕?L?㊣@?n?VU?????k?V?k???k?VVwUUVmUa??@KkU@?mUmmk@UwUkmW@UVIXa@?mw@a?KUL?a?x@Uk@UbWU@yULmK?@kX?VUwm@@JUUknWKUV?LUbU@?wWykI?a@w@mUI@a?UVynIWa?k?@@W?bl@@knm?K@wnIl?∼Kna@?V??@?U????@U身J?X?∟k@?wmI??k@mw?ak@@?lX@bUJ@V?bknWxkLkxl??LVlkLm??b@bU@?bU@VbU`Vb@n?L@?mb?U@?VnUVmnU@mm?@kIUWVIUK?VkkUJUnmL@VmLUa?VWaXamU@??U@KUUmV?U?J?U?V?w?n?m?@mX?V@l?xn?'],
                    'encodeOffsets': [[
                            122446,
                            38042
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3713',
                'properties': {
                    'name': '還疺庈',
                    'cp': [
                        118.3118,
                        35.2936
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?bXl?l@zlV@lXXm?kbVVl??U@Vn@@Vmb@X?K?VX?WJ@XXl@????bVL?Ul`?@XXV@VVUxVbUxVb???@?WnXVJ@bnVUzl@?∼?x?U?KlU@mUUnUlUVWVUnVV@XX∼V@V?ll@Vk?aXVl@Ux@bmbXLlKlb@b@bUJn@@??b@n∼x∼K@an@@UlLVKVbXb@bVVnK∼LVa@UVa@?Xw?KVxnL?U∼@naV@UWUkW?ULmV?w?KUUla@a車_@m?K@aUU@??WU?kwVm@aVI∼W?@@IUw@a㊣?@?kUVU?m@a?wkw?@?K@kVKk@maXalI@alL?WXblaVLVU?V@LnK?@?l@w?aXa?LlnUl?L?mV@n?∼J@_VmnIVym?UKmI@WnIVm@anUVm?_k??I?WUX?m@U@???@??@naW??IVW@IkK@klKn@naWI?mk@?a?bkKkLWn?WkLWmk_?@UaV?UKmLUw@mn?WwUmU??a車V@UkUm@UKULUwmJUX@WW@X??zVblJX?WXk@UVWK?X?∟UL@xU@?@?VUaU@@XmVkLmWkXUy?LmKXnV?@n@l?x@bWLnVVn?`knULmxUl??WLX?Vb@V?K@z?x??Wx?KUn@bk@?l?VVV?z'],
                    'encodeOffsets': [[
                            120241,
                            36119
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3707',
                'properties': {
                    'name': '峆溶庈',
                    'cp': [
                        119.0918,
                        36.524
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l@@U?K@?@L@bX@@VlL@J?LUVnX@`?Xn`V?mJ@bU@@n?b@l∼xnn?V??∼@?????@lWn?nk?Jm車∼w@kk?V?@???k@V@kw@wVm?a???m?a????XI@mln?Kla@mV_UK?@kUkw@alW?IU??m??@WUIl㊣UU?U?bkJ??@a@wUKUaVI?mXIWaka@m@Ul?XKVw@?UI?JUkmJ??V?kU@a??WK?ImV?@UxmL@bX`WXU@U`?kUak@@∼UblXk?mLUKmL@VUL車??Vk@@Vlbn@Ub@??aUJUb?IUlVLUVVbVKX?VlVXU@mb?@?VmKUw?LWx@?Ub@VUb?KmLUU@aWaUaULkK@Vm@@b?L?w@m?a@?m@UUU@U?lJUX?V?mkb@nm?XVW?kb?IVxUV@VUbWLXV?LW`Ux@nk@Vn@x@VkJ@?V`mXk?@V?xV?@lV??I@VUL??VU?IV`∼bVXXx?V@VWVnL@xV?Ub'],
                    'encodeOffsets': [[
                            121332,
                            37840
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3702',
                'properties': {
                    'name': 'ч絢庈',
                    'cp': [
                        120.4651,
                        36.3373
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@nU?JXL??@blVU???nIVl?IVJ@?UxWLk∟@V@nlbXbWJ?nUJVbVL@x@b??lI?a?VVVk?VJ@X???nV??JkX@blxlV?@VLU`@nkb?Lkm@nWJ身?車∟?b?n???bUn@xlxU@l@??@?U?l??UnW?@?n?m?x?U?V?I?VnUVV@L?V@?nVWbXb?UVbnK@UnKVmVIll?UVLUJVXlJ?@nnV@nmVUUm@??Vna@??K@mUaV_UaV@?aV@@a?an?lKUk?Kk?lwlKXwlm?a@UVI@akW@?l@?bnxl@∼?nJ?xl@∼??W?IU?n?la?m????VaUUk?mk?W?IUU?`?@kk@???V??_?@???∟?L?m???車?wUW㊣貝?k身a???k?m車∼?bW@UKkLUa?Vmz@V@?UxVn'],
                    'encodeOffsets': [[
                            122389,
                            36580
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3717',
                'properties': {
                    'name': '監屙庈',
                    'cp': [
                        115.6201,
                        35.2057
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@??IVU?m??@UlU@Un@VW@UVmkk@aVUUKV?@UVknK@UV@VVnIV?@wn?mwmKXaWaXI@UV@Vy?blkVKkam?U@kb@Um@VmUkm??KmkXKWwkU@Ul?@UnK@UVUUm?KXw?UVL?w?K?U?@@Wl@@wUkV??@@I@W@_V@VWUw@UUa@a?aWa?@@_mKUw?l?amzmV?@WK?nU@k?WL?aUK?b?VmV@?UW?b?@?X?∼UbW@X?m?Vlk?UJUbmL?x?WUzl??Ll?@VkK?XUbWJ@bU@?@??kb?LmKka??@l?_W?X?VbUz@J?n?V@∟lX???nV∼?Ln`WbXL?VlKVU?xXn?lXLlU@bVV@?XJWLUVnVV@??@n?l?∼nn?V?K?bVX?JU∼VnXV?kV@@xVL?@?Wlb'],
                    'encodeOffsets': [[
                            118654,
                            36726
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3708',
                'properties': {
                    'name': '撳譴庈',
                    'cp': [
                        116.8286,
                        35.3375
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nam_nKl?VLXa?Il`?_@KVVXI@m@w???@@k@K?n?@n`VbV@@L?L@KVVn@VX@?VL?Jl??@VUU?U@Uam@Uk?w?KWaXam?kJmIU?VU?bla?UnV@kVKl@@lXL∼kVJ@V?nVJUX@V?LXl@xVLnU?@VK?V@a?IUaV@?b?U?x?K?kVJXUlV???UVa?I@WUI@KlUnw?mWk@WXIW??U?L@Wna@Um@@U?Vk?UUlan?WW@kkU@y?kWk?aWVUl?bUU@k?JUIU@@??Jma車k?L?K??UUkKWLk@WbkUUa?bmKn?∼?V@XwV@VanaVaU_@Wlk@W?@VU?VV??m?ak?lK??lLVUX@lK@aX@@kV@VmV@VwnJV_UWUw?X?am@kW@wVUkKVIUUVmU@UV@IVK@aUL@a?V@Lm?UKmx@???mLkUWJ@?nXmlUxUL@Vkn?VU?U?@V?L?`Ub㊣LkV@kUK?b?@?U?W車_mJ??@Wk@@X?@?V?L?xUK?VWx?LVnUV@VmL@Vk?@VlVXxWLnl?Ln?VlUnn@@VlaV@n?lbULkl㊣aUzU@@VWJXbWbnLnxm?@xU?mJUUU@@VmLUl@VU?VLUV@bllUn@VUXm@@VkV@V???nUV?J@?nn?lnVlL@??b∼KVV'],
                    'encodeOffsets': [[
                            118834,
                            36844
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3714',
                'properties': {
                    'name': '肅笣庈',
                    'cp': [
                        116.6858,
                        37.2107
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?∟@VmbVXnVVbVJ??X?@?ll@z?lVInl@?@bVxUb??l@?bla?I?xXVWb@L?@n?ULWVXX?WWLnL@`@LUVVL@lVn?J?U@UUk?a??n??V???b∼?V???X????I?b?a?b?W?X?W?z?mnLVJ∼?nlV?lbnW@?@U?UV??mnwmkkKW??kla@mVIUKUa?aUwmn?JU@@amIk@@bVlkX@mmUk?lUU??a@_UaUU?V@w?w?WkXmW@I@WUa?U@UXaWUU@UUVW@UUUWUn?nUVa@m@k@alU@wk??LWa?@UUm@@wn?mU?wla@anKn_@alK@??_?@@WUUUml?ka?I?yU@UwU_Wa?yU_mWUwkImm@InWWUk@@UVWV?kW?U@V?L@b?b@l㊣?@?VV@lUbV?@?kxVnU?l?XV@b@lV@nIWxnb???@UU?L?x?xm??aU??wU@mU?V?KULm@?bmKUX車@'],
                    'encodeOffsets': [[
                            118542,
                            37801
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3716',
                'properties': {
                    'name': '梆笣庈',
                    'cp': [
                        117.8174,
                        37.4963
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vb@`?bV?kVl?nV@nlWUk@al@nJ@bV@?InmVx?bVbVLUJ@nkb?lX?lLnlmx?nU??V@V@?mXn?lb?@nnVx?b@lnXV@UJ@nVx?xnxVb?Vn????@@w??U?l?VI?b?@??mk@?k@UkUK@aWakU車JW_UW@wkkWK@U@K?@XU??UkmUUalKXala@U@kkWlk?l@k?V?mVIVmU_?a???wnwVW@w?wU?@wU??wkJWI?yUI㊣bk?V?UJ@nmV?Ukl?Xmx@lnbW?kV?UkLW??xkKUUmUkb?J㊣??L?xUKmkUmkkW??a?mUaVk?J?_?K?@U??W@w?U??nUWw?K@a?Uk?VaVK@akLW????I@bnbVx?JW???WbUL@???nV@VmbkUUV@I?ak@@bWak@WJU??JWL@bXV@??@?V?Jlb@zUlU?UIm?nbV?mz@∼UV@V?bV@@V@L@x?LmKUnmJVX?J@VkLW@UVUL@b'],
                    'encodeOffsets': [[
                            120083,
                            38442
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3715',
                'properties': {
                    'name': '謐傑庈',
                    'cp': [
                        115.9167,
                        36.4032
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@VWnL?an@VK?L?UnVV@?xV??bn∼?w?w?KVV?@??maXwmJU@@k@aWUk?V?Umlw@?U?Va@kUU@???@k∼a@a?K@U??U??@mmm@車w??㊣??@@w?Kmw?I??kU?UmakJmIUa?VkKUkm@VUUa?U?@Ua?KUK?@?w?UV?UIUKVw?k???w?bV?@xn?@lWnXxlL@`?XlJX?l∼XxW?@?Ul?n@??@@Um@@VXVmx@??bllUnUJ@VULVn@b?xV?VL@b??VlnVVblV??nVlIVJ?L??lJ@xl???'],
                    'encodeOffsets': [[
                            118542,
                            37801
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3705',
                'properties': {
                    'name': '陲茠庈',
                    'cp': [
                        118.7073,
                        37.5513
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?U?l?@∼U?w∼身????????X?@w?w?a????kwV??@???Umm?w@k?a@mV@@anIU㊣m_?W@_mWVU?K@IkK@UW@@a@K@??L@Vk@㊣U?@UV@lm@mUU@kLm??xV∟@xV??x@xUXmx?x???bV`UnUJ?n?U@l?kkllX@l@VkbWbkLVbnVVl??WV?@@L@VXLll@xVXX`?IlVXb@bVLVll@@?nl???@?aUJk?V??豕@x'],
                    'encodeOffsets': [[
                            121005,
                            39066
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3701',
                'properties': {
                    'name': '撳鰍庈',
                    'cp': [
                        117.1582,
                        36.8701
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????xn@nn?@V???∼VlXU?UX@Vl@XVmX@JnnlJVxnXV`∼zXbV`VxV@?z?Jlbk?VnVV@X?@?`@?kL@bm`mL@bkb?xnVm?@xn@VV?@Xb?Kl?@xkV@b@l@nUbmVm?XVVV@VUXVVV@XVWb@V?VVb@X@JnXlW?X?x@x?UVV@aVKVUX@lK@U?IUWnIVmnL?K@w@K@UU@?a@UVU@?nyU?man?VJV?Vk@yka?I?U?@@?WU@aXK?IV?XIl@Xb@al@?b@JVUlVna@UmU??@?VKXa辰?X?∼IUwma@aU@UU@wVW@??w@a?I㊣`kb?Ukw?UmJ@Ukm?UUkmKknUV?@mJUk?aWk?a@K??mKkU?LmyXa?_@WmImm?b?LmUkVUbUV?J?b?UkkWJkU?l?IUm?k?L????lK@knaVmkI@mWa?LUK?UU@@VmLUV?LWK@UUU?WUkkVmx@?Vl??'],
                    'encodeOffsets': [[
                            119014,
                            37041
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3709',
                'properties': {
                    'name': '怍假庈',
                    'cp': [
                        117.0264,
                        36.0516
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n???W?nx?L@x∼@??Uk@?nwlUVl?XVV@VXL?KVUnK@UV@?VVL?KXb@nlJUnmb@lkL?????K?lVn?J?klVXIll?V?a?IVUValUnV?K?annnJ@X∼`Wbnz?KlVnL??@L?bXl?bVlnI?@VUU@UmV?@U@U??@?VmV@@_Ua@m∼@@??kmUUm@UVmn@nX?@@a?anJVUVL?mlIVJn@nkVLVa@KVmVLXVVL?@@U∼bn@VaV@@K@aVk?bWaXUVymU@aUImW?X?@??UaVwUaVwUUU@WW?@k_?VUK?a??@??nmxkV@LVJ@X?JUb?V??kUWVUI?l?L?w?V?aU@Vb?J@b?UUL?@mVUK@wWk?K@UVWUI?m@UUI?lWK@kk@UL@lmU?Vkb?aUVV?nJlIn?WbXb?L?xVln@VbV@V?UV?@k??IUK@?UWm@UU@L?K@KU@Uam_車@?m@L@l?@??@x@nWJUU@L?`k_?JWbUKk?mLn`mb'],
                    'encodeOffsets': [[
                            118834,
                            36844
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3710',
                'properties': {
                    'name': '哏漆庈',
                    'cp': [
                        121.9482,
                        37.1393
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VbUnVVUx?????@?????W?L?U?W??U??身????k????車??車L???U?wm?k?mkkK車b?@U?@?mb?Lk?mJ@x?Lmn@lk@?a@X?@?lXbmJUz?V@bVJ@n@x?blJXz?xV@Va?KVUXLlmVV@In@Vx?UlW∼@nLVK@zXVVal@@V?w?bVK?L@bnx@?WbUJ@VnXVlVxl@nnnV@?lV@L??'],
                    'encodeOffsets': [[
                            124842,
                            38312
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3711',
                'properties': {
                    'name': '�桽梛�',
                    'cp': [
                        119.2786,
                        35.5023
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@UaVUUKVk?JVaVI?b@?Vam@ka@Ul@?U??VK@UnKVLnKl?kWVa@?l@Vb?lV_V@XWW_@anKVwUmVw@?@Uny?UVblKVLX@?a??車?m?????????l?U貝???K???b?V?U??U??XmakJUnmV@bUnmJ@XnJVLn∟UzmJUn@`?Im?U@?n?KVkkm?KWb?b@x?k?@mL@K?UUVUKkbWa?XkK@bkJWbnbl@UL@l?L?@lx?x@b?nUVlV@??∼@bVx@J?@?XUJ@bUnlxV??X@?VV@b?L@n?`@bkbVV?L?xnU'],
                    'encodeOffsets': [[
                            121883,
                            36895
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3703',
                'properties': {
                    'name': '谹痔庈',
                    'cp': [
                        118.0371,
                        36.6064
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n?lKV@nVn@@kVU?@?VVaU?@wmKXU@U?UWwUW?aU_?JUV??VK@U?JU?@kU??w@Ul?nWU_@?lI@U@wUml@@mVwX_?KWUXKVa@UVUUw?JlaX?WUn?@mla?n?UVWkIV?V@VVVI@a@akakLWKna@aVwk@WU?bUlk@?k@U?UWWU@mUUVUXkVmVVV@nkV?L?V?w??k@WVXb?aUl@bV@@b@xkVVXVxkJ@nk@@?VLUlVb?VXUVVUzV??LVbUbV??VWVkLm?kJ@n㊣@UxU?VVkV@b?x@?UX@xVVV@∼J??X?lK@bULUbl??V@b?LXxmV???V@x?XV??@㊣L?`?IUlVb?n?bX?llVnnlVL?w?K???IlanVVVlL?wX?lK?VlUX?ma@knw?Wlk?VnU@mVIU?l??aVJ?zXJlI'],
                    'encodeOffsets': [[
                            121129,
                            37891
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3704',
                'properties': {
                    'name': '娹蚽庈',
                    'cp': [
                        117.323,
                        34.8926
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?yUU?U?kl@@aVm?LXw∼?∼w@y?L@UUaW?XK??VknwVKlm?_UmmUXK@a?w@k@mU?WmUL@?@?@?@K?b?V@akw?aULm??bUK?LUU@lm@?∼mL@nUJVxVXU`mIUxU@UnU@@lW@@bkLW@UVkK?∼kLl??b?nU??UUV?@@Xkl@XV`UbmbUbU@WxU@??m∼nL?aVblVXal@XKlLVV???L?K?lnb?I@?V@VJ?I@lVV?aVkXU'],
                    'encodeOffsets': [[
                            120241,
                            36119
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3712',
                'properties': {
                    'name': '應拶庈',
                    'cp': [
                        117.6526,
                        36.2714
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lmnLVl?Vln@VnI?Vlx?Vla?_?JlUUUV?Vw?@@mlIn?lKXU?UU?VaUa?KU?VyUUWV?UUaVkUK@?l@@mlIUwUWlU@w@aU@@LU@Ubm@?a@V?@UKWUUKUn@LUbUKmlm@UIkJ?nUKUVmI?b@b?@mWm@Un@VVnnV?l@??@@nVb@`U@Un@???@V@VU?VnV@'],
                    'encodeOffsets': [[
                            120173,
                            37334
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/shan_xi_1_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '6108',
                'properties': {
                    'name': '衼輿庈',
                    'cp': [
                        109.8743,
                        38.205
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??V?nIW??W@?kU?L???U???IUWW??UWwX?m?@?n?@???????@a㊣k?㊣?w??mw???mU??kk?Vy?Im???@????Wnw?V???a?zmm??車?kVmx?xU?V?kVm_UlVlk?∼IV?k?mJ?a??k??Lmm?V@XmKn?lU???VXb?b?@Ua?L?????w??mKnm?w?@Uk?bma?V???n@m?aU??Jm_k?@kW?Xyl@@k?amw?LU?????mW?zUK???Uk?㊣@?b@nnK?bX∟mzV???Vx?n????@?knW??VUbk?????Wkk@Va???U@?mUkb???@???bk??XV`kL??Vm?alUUa?nV㊣nwmk?J@In?∼KVw?Un?@????U㊣b?UU?㊣??mWb?KWn?Um`U?VK@bmn?m????@V?L@x?xm???∼?n?@VmK???Vl?lKk??@?那?V@VXLlm??U??V∼?????@??@?????I?m?nnb∼b?KV??Ll??@U?????∼IV?????l??x@???W???Ux?豕??@?∼?Xn?l??∼m?n??V??V∼????a????@zll@b???l??nK??車??b?㊣?I?????V@?lxnVlk?JlaXw????@Vn????l???U?L?豕???x??lU?@?xlaU???Xm?IWmnk?VV??VW_@a?WUUmk@???Vm????㊣W??n?V?mkXw㊣?Vw??'],
                    'encodeOffsets': [[
                            113592,
                            39645
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6106',
                'properties': {
                    'name': '晊假庈',
                    'cp': [
                        109.1052,
                        36.4252
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@kk?mI?mUwVkU??U?Wm??Vkm@?m`mI??U?Va@?m?X???V?V?kyU???@?l_Umn?W??KVk?????a?w?@??@a????Wa?kUm?a???a㊣?kx?mmxUw?@?xmU?b?K?w車??@kmm?Ub@lklVbmnnVUV@x?Ukn?JUX@??L?Wkw?L???wWJk??Lk??xWz?JUn??k?@?k????K?豕@∼l???k?l?n@l?@l?L?∼UU?V?∼???`m?mXk??bUa?V@U?x@?????UUmlmU?Vm?nnmlkw?@@??????Lmx?Ikl??@?m?∼VUx?Lm?@J?InlmxU??mVbkV?bUn??lKU_?Wl貝?a???@??lanV@??V??Ubl@Xl????l?Va?UX?lm@?∼????mUw??U?nyW??amL@m?a?@l??V??VL?ynX????V??Knx?b@lk@WzX?@ll?n`?IV?∼b@n?m???Unb?aVl?@?xmnnL?∟?x?????KVb?@?aWa?U?車kVm?nL@W?Unn?Kl????bnIl?U??Jl?UkVkn`lUU?V??wnwlU????nn?y?b'],
                    'encodeOffsets': [[
                            113074,
                            37862
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6107',
                'properties': {
                    'name': '犖笢庈',
                    'cp': [
                        106.886,
                        33.0139
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lKnb@n?lWb∼bkx?wVb@??nl??????L@?X?l???Vbl??K?b?ak?Vw?ml??`?n?@?nVK?l?k?x??∼?VU?J?w@?n?W???VkU?車?@?kw???Um?X?W???k?@?UymIUwlUn??mUk?a∼?V?@??V???????Vl??@l?@a∼㊣@_kamm?b?a@???m@???Kkn???@m????L?w???LVxmb@?kV?@mw?wVakKW??X㊣??Vkx?b??W?@n?x@x㊣b車akb?@?mU??@???L?k?VUm?k?∟?LUl?@?z???x@x?∼???b?m?X?aUJW??k@b?W?w?wWx?@X?Wl?b@???V??Ulw?Lnl∼VlU???U∼∟V?UxVXUxlbkVVl?I?∼??VlU∼m@k??U?xUl?LUlVL@b?∼?In?∼?nK??@x?a?n?aUy?XUKVk?W???a?z∼JXUV?V_?JV??z@?nb'],
                    'encodeOffsets': [[
                            109137,
                            34392
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6109',
                'properties': {
                    'name': '假艙庈',
                    'cp': [
                        109.1162,
                        32.7722
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?b?a?豕?w???????b∼a?XV??VU??@?aX?m?kImx???V@anU@U?谷?L@???V?m?@??b?K???X∼w?????b@x?blx?????m?UV??n?@???L????n?∼Vnn?K?a?_???wU??aX?m?nW????kl?LX???身??a?Vmb?Un?㊣w?谷V??an????U??∼am?????@??wVw??nU???UmmVw?m?I?a車VWxkblb@b車l@????∟?X???X?xk??@車??x@??x?_km????kblb@`??@bk??@k??U???????U@?U??∼㊣bVl?nm?kVVxnJVz@?l???X?W∼n??V??lx@???V?Ul??X豕m?@豕'],
                    'encodeOffsets': [[
                            110644,
                            34521
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6110',
                'properties': {
                    'name': '妀醫庈',
                    'cp': [
                        109.8083,
                        33.761
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?nl??b??∼aVwnK?I?`∼w?X?w∼V?∼@??????V?z?K@x??@a?L??@b@?nLl?@?ln?mnLVw?a?bV??VnbU??V?∼?bl??b?@???b?@n?@amI?yUI@???Vm??U???VwkwlanJ??lw車?@an?∼J?_???@??n車?車@?l?Uwma??@??Um㊣V_?J???J?UW??@?_k???mU?VU豕?b@wmL???Vma?I?∟?IUW?X?K???a?JUb?I?lU?車Vmk@W???@?mU??V?n???∼kw?a@w?a?????x?W???L?a@?n?U∟∼?@??K?那@VmV@b?U∼∼nwlJn?W??b?@V?'],
                    'encodeOffsets': [[
                            111454,
                            34628
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6103',
                'properties': {
                    'name': '惘憐庈',
                    'cp': [
                        107.1826,
                        34.3433
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@???@?∼I?b@?∼yn??aU?l?U??Um????@@ylU?@@?kWU?WaU???V??@kb?w?n???kU?nU??@??㊣?kUL?m?@?m㊣_k?車nUxl??b?a?Lk?Ua??k?W?@??K????k??m@?Ua?xlw?aXa?k@mmakL@?m???@?m?@l?XV`?n?KU?∼∼@??∟U??@Vxm??x?Kl?VV?aVw?Xla?Vlx@?UVn??nk∼?VVL?lkI???J?k?V@?kn??n@lznmlVkzV??VVx?@Ux?z@x㊣?Vx?xU?l?kb?@???k?VXl?k?V?w?LUKlw?J@a?IV???n??n???@nk?l?k?@?∼?aVbnI@????n'],
                    'encodeOffsets': [[
                            110408,
                            35815
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6105',
                'properties': {
                    'name': '弮鰍庈',
                    'cp': [
                        109.7864,
                        35.0299
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@??L?xU?∼??@m??nl∟nU?L?wX`@??L??U?mL?????bVbn?ln?@???x∼L?anV?w?@Vxnw?nlw?∟?b∼∼?bVn?lXb??車?@b???@?x?b????V?X???W????車@?車?????X?m????kU??@???車?k?a???@?ak??a???UV?ma?UU??a?bUxmK?nkm@?k?mK@??x車@?n?K??@??豕lxkx∼n???KU??W?L@V?IUb?yWbX??∼'],
                    'encodeOffsets': [[
                            111589,
                            35657
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6104',
                'properties': {
                    'name': '玶栠庈',
                    'cp': [
                        108.4131,
                        34.8706
                    ],
                    'childNum': 14
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?IXy?wl??Kl?XIVa?????a?????aVU@a???w?身?a?L???V?Uln∼W??W?Xa?zVa?J@U??@??b?wly@?k??㊣W??@ka?IU??n?@??車m?U?b?U?l?I?b@∟?@kV@z?@??n??VV∟k?V??bm??z@∼?a?J@??∟@??bUx?b??@`?xU?㊣?VX?W??UnUJ?L???Klblm?X?∼?U??∼L??lk?K?@?xl_∼?U?kbl?'],
                    'encodeOffsets': [[
                            111229,
                            36394
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6101',
                'properties': {
                    'name': '昹假庈',
                    'cp': [
                        109.1162,
                        34.2004
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼?@???mVV??l???m∼xla?@U?∼?V∟XbV∼lX?a?J∼k?V?a?V?n∼??@?mV??Jlb?@X???l?@∟kz?x?a@∼???K∼XV?∼L???mlwkw??@車??∼L∼m?@?w@a???K@b??@w?L?y?U????@????U車x?W?x?_?JmLUx?b??車ak?㊣m?UU??W?b?a??車?車??x???b?a?x?IUV??身?㊣w?l'],
                    'encodeOffsets': [[
                            110206,
                            34532
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6102',
                'properties': {
                    'name': '肣捶庈',
                    'cp': [
                        109.0393,
                        35.1947
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?x???Klx?X?K@?VW?Ilm?V@wVUmUnmUalk@kVaUa車a??車?nKV????K@?W_?x車KmVk??mn??@??V??w車K@??Xkm?V?U㊣??K?b???x??@bUV∼b???∟?b????Ub'],
                    'encodeOffsets': [[
                            111477,
                            36192
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/shan_xi_2_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '1409',
                'properties': {
                    'name': '陏笣庈',
                    'cp': [
                        112.4561,
                        38.8971
                    ],
                    'childNum': 14
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vx@lnbn?WlnnU?m?∼??V??V?VVVnUn??lz@l??@J?@kXWVXl@L?a@??KUL??lbnKlLnK?LnK?Xn∼?bVV@bUVl∼Un@LnaVJUbW@UX?l?@?wlVVI?Wnk?a∼??anV?Kn?∼?UW?@?aVUVk@Un@?aV@ValwUanmWU?k@WVUUanaVwnLVl∼@nk@mVU@UVK@w?LVKVU@??K@UUKVUV@@bnL?a?V?a??lIXmlKX_∼KVV@bVV?@?zV`kblI?V?Ul??L@bnV@V???ll??VlIXW@k?a?U?blK?VnIlJ?albXXlWVn∼Jn?nL@l@XlJlaX@?X?W?@l_VmnK?U?blU@mnkVK??@U@?ma@kX?V?makk?L???a@a?@WIUUV?X?WWnk@a∼a@kkm@kUUmJm?@WUUUIk`m@V?kaWWkX?Km?Xk??@?WK?Lkak@㊣b?w?@?a?a@aka?@ma?@?L?K??kKWbkm???㊣?U?LUK?VVk?m?LUVVb??UwUW?bm??U?L?xWJ?@?klmkUm@@KnwVkVK@akw?@@a?b?Kkn?VUI?b?mmbk@UbmKUL@xUU?@klmLU?lVXI?VVVUVU?U`mLXVWbXnW`??∼xm??xU@m????wU@mbU@U?mbkVW?kJ?@?X@`?Im@UlUVVn?b@bWJXnmb?JUU?UUa?@UamIka?x?@@x@b'],
                    'encodeOffsets': [[
                            113614,
                            39657
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1411',
                'properties': {
                    'name': '臍褽庈',
                    'cp': [
                        111.3574,
                        37.7325
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@a@w?@?wlbnJVb?@Vb?VVV?InaWmXI@a?aUmVUVkn@∼J@_?W?@lIX?lUnaV?V@naV@?x??n?V@?wn??w?㊣X_WmXaWUnKV_V?VUUU?UWJkUV?nKlk???@@kmKUa??㊣KkU@WmI@WUIlUUmVwX??w@??UlUVw?V?@?Lnb?W@anU@U?aVk?@l?n@na?JnU?LVa??UUVm??VKV??L@mU_lK@UVWkU?a@a@U?aUa??車?Ub???Kk@@a?k?mVaUwV???kWU?mK@UUKmXUW?wUa?LUU@aWJUUU@Ua??U@WL@V?KVaVI@WnU@alIVK???@kI??mIkJ@?m@???@@_?K@x?@kaW@U?@Vmn@?UK?@mI?JUXV∟XXWlkK?kkK@XmJVakImJU@車??LWKUV@nUV?LkxmKkLma@kXKmm?L?a?b?LmK@V?@mXV?Ux?X@`nL?aV@@VmLUVnLlL???b@???∼?nx@b?VUxlb@V?bUV@zV?XV?XVx@lVn@Vnnm?U?@LlJXV?z?VWVXb?V@bmn?VUVk?????@XVxmbUlV?Uln?W?@?Xl?@VLX?@b?J∼??L?辰?@nU?b@∼?X@?XbmVU?V?nb@x?x'],
                    'encodeOffsets': [[
                            113614,
                            39657
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1410',
                'properties': {
                    'name': '還煆庈',
                    'cp': [
                        111.4783,
                        36.1615
                    ],
                    'childNum': 17
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nW?@@UnL?K?a?b?KnnWL@lnblKnLlw?KVU@mVUXL∼K??V@nIlJUbnI@WlL?llLXkWWU?VW?InJ?@VL@?nm@UV?X@lb?@@w?L@`?@??n@V@lw?@n?VmVX?WmwnUl??a@_lK?wVlUn∼xVKVXXWlU?VVI@K@K?n∼K?wlVlU@kna@?V_?Wn??m?UVm@kXml_@m?LlKXw∼m@_?JVUV@X?l@UaV@Va∼I?lk?VwUkV?mw?UmmV?n@V?@K?U?wmK@U?wUV?@mJ?U?nWK?@@UnKVa?_lykUmK?nm@?x@?UUlwVk??XW@??a@U?@@K@?kIV?nammVakUl?@wX@@k???@?VVbml@??∼UbULmlVbnb?K㊣??V?KVXUJWa?@ULWaU?U@@U@aWK@UkxUK?LUUUJ㊣UkL@V㊣kk@kam@UV@l@LWl@?n@VVUx?LlUUx@VUV?U@a?IUl?L@∼mLU??bkUUaWUUaUU@aWK?LWJ@bUL@VUVVbU@m?@a@??kmKmn?lUK?X?WUblb?xmIk??U@xWb@lk?Vx?LX?mzVV@bklVVUzm?@bk?@?Vx@xl?U?@lUbV?nl@?Wxnl@n@?UbV?mL??m??b@`X@lUX@@xlnkLWaUJnnWV?Vn@l?@bULVV@l?V@XnJVX'],
                    'encodeOffsets': [[
                            113063,
                            37784
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1407',
                'properties': {
                    'name': '輩笢庈',
                    'cp': [
                        112.7747,
                        37.37
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@?lInJ??lJ?@??ULkJ@bmV@XUJUb?L@UXKV@??VbV@VVXI@bVV?KVb?xVXnWVL@VnLV?lX??U?VxUb∼n?l@bl@?L??Va????Vb∼b@VnLnnV@lmn@lb?U?V@??J?UVV?Xkl@lUzmJ@x?Xkl?bUn?JV?Ub?nU?lb?V@nlLX@lak?V`Ub∼?@XVJnU?L?KlxnI@KV@lbUbVV?KnVl@?zlm@U?@n??I@WUaV?l@@mVU?@XkW?@?nkVKV??_Vw?y@knwVa?@XalU?@?Vnml@?X@V?L?KVa?bnnlJ?I?mVKn?VVVInVlU?@?m@?m?XK@UmyUI@mWUUakamw@wUwmLkakwV?mK?w@wUam??y@am_?W@?UU@knmm??amU@WUa@knw@??UUUUV@n?Jm?@mVUkKVUUUkKmw?KUL?KUImV@lUn?n??m@mbUK@∼?bUnmbUmkk?WUb@am@UXkK@a㊣@?V?@????V?UXVxUVkLWl?@@bULUlm@@nm`?X?lWakIkm?VUbUL@Vm@kI?@@K?m@?VaX??I@W@aU@kU?VU_?K?b?Jkk???b@nkKmL?w?W@kVUU?VU@WUI?JmIXmma@_kyVaUUlkUm@?kU?x?L?m@L@LUJ?UkVWXUWUL?wVmUk?xkL@`?bk?mVnx?XUWUnm??@kxU@'],
                    'encodeOffsets': [[
                            114087,
                            37682
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1408',
                'properties': {
                    'name': '堍傑庈',
                    'cp': [
                        111.1487,
                        35.2002
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?Vl?nJ?wkaVa?X?WVL?knmnL?l@?@bn?V@UaVU@UVK@aXI?KXL@bVVVbXVVblV?aV?nK@??KVk?J@b?VVU@UVwkV?KVwUUm@@?Xk@K@kVUn@lbl@?l@UlK?VVIVV?KVLlw@VXL@b@VV@V?XbVK?@XbVIUW?L?U???LmaUankVKVa??@?nkUa?U∼@????n@@kWa?UVaXUW?@IXKVw@U????WU@W@?@UU?U@mn?@?`m@UUULkUmJ?IU??@@U?K@U?@?an??ak_@wmKUwmakV?kmK?V?k?b?w?`kwUI?x???a??mn?@@?m?mUkV@wkKW@kxmL?Uk??L?k?x?w?l車VU?mV@?VVX?W∟kz@`Vx∼?????@?Ul@x?那??∼∟V?VlXLWnXxmV@nUl@?'],
                    'encodeOffsets': [[
                            113232,
                            36597
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1402',
                'properties': {
                    'name': '湮肮庈',
                    'cp': [
                        113.7854,
                        39.8035
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???yl@????@b???b????X??a?K?nn@??ll?x?nVn???V@b?nXllL∼K?bVb@J@b????@?U??xlKXLlKl?Xk??@Ulk?JlkU?VKXU??VIVm@_n??L?a?l?w?VnU@UUwma@a?a?a?LmUk@@W?@U@@X?wVW?UUUk@@VmL?KV?nwUw?aUL@`mz?JUIV?UaUw?KUaVIlJ?an?lLVUn@?a?@VV?@@UUwVK∼Vn_lJ?L?谷W@UUU?@?lm@a?IVwXW?UUkkm@U@a?U@?mwU?VWU_kWm?XwW_∼yUkkK@U?K@kkUVym?車K?U@KWI?bUak@mJ@bkbmLk??Um?kVU?W?@lnb@?@V?∼ULml@nkV?a?VmLUnk`㊣@?X?WW@kb??X???Wx?I@xmbmxXlWV??@b??Uz@J?b@b?b??U@Wbk@?xk@WX?V???W?b?UkVUU@alI@a@akLWa?m@U?UUm?L@K@aU@?VUk?KmX@`@?kJ@nV?Ub@?lbV?XVW?ULU`VbkLUV@XWl@bXJ?@??VbV@Vl'],
                    'encodeOffsets': [[
                            115335,
                            41209
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1404',
                'properties': {
                    'name': '酗笥庈',
                    'cp': [
                        112.8625,
                        36.4746
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Uk?Lky@I?JVa??@m?aW??y@_?W@_W?XVlUVw?@nw∼K@m??U?Va?mV?kU@mmmnLVUmKXa?U@IlKVUnK@UmWkX@WV_V?@akU@a?KWIXy?IUVmUn?Ua@?WaXUVKVmkUWVkU?LU@@V?b?K?b?IUm?@mbVL?x?WUUkn㊣V?w?b?JUbmLkbmK?K?bVnUb?V?KUb?KUbmL?Km??b?a?KkUm@U?nn?VnxU?VlUxl??k?JUbU@Vbk@W?U@UV車I@`?nWxkL?K@nk`Wn@lUn?V?nm??XU`@?mb@lkV@?VnklVVUblz@`nbWnnJ?IVJ@XUVV?UV@l?X?xnKlL@m?a??ll?I?a?LV`?UlVV@@b@X?JW?Ub@??n@L?@lJn@@UVKVa?UlnlJXb?k?Wn_@mn@VkVK@a∼@XklKVUUwVWU??????@?U?@@blLVWn@@bVa?XllVnnaVm?a@?VLnan@???mVm@knUVJ'],
                    'encodeOffsets': [[
                            116269,
                            37637
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1406',
                'properties': {
                    'name': '侇笣庈',
                    'cp': [
                        113.0713,
                        39.6991
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XXWVXVWnnlnn@豕??@??xl???V?nbl???V???UVl??@?bln?L???mUkU@Ua???@WI@aXk@WVUlKUaV_VKX?WUU?ka@?VaU?@mlI@?@_nW?LVl∼UV@@b@L?KVn∼V@V?nXblK@b@bkJ@bVVlU?V?a?X??∼UXWl@?wl@XaV@???a@a?a@IVy??@a??XUWknwna@w?JXw∼?W???kI@W@kmKm??IUmkXWWka?bkImJ?UkL㊣a?V?b@lWXkJ?Uk??k??@UmU@a?Kk??V?UkJlaU_?y?@UU@aUU?LW`kLWnkJ車??b?U?bmK@aU@UVVL@V?L@?UVUL?K@xUL@VUV@nml?@UkmKUxmbVbUV@X?lXVmnVbkxUbU@?bm@@VUlUV?b∼@VX??m?'],
                    'encodeOffsets': [[
                            114615,
                            40562
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1405',
                'properties': {
                    'name': '輩傑庈',
                    'cp': [
                        112.7856,
                        35.6342
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lV?L?b?an??LnKVa?LVa?L?UVaUm?a?LnLlanKVa?I?a∼x?UlmVV?X?wUKna?@Vn?J?a?L?a@UV@@alUkKVKnkmmVwUk?w@??@kxWUX?W@@m?k@aUa@a?a?LkKmwkUm@kL@K@aWIXm?V?X?WkUVakL@UVK?w@aUK@UUKmLU@?n?KUwV?UIWJ?UWmka?@UX?J?k@UkmW@kLWK?V?x@bmI@VUaVU@a?@UUmV?KmX?@㊣`?k?KVxUL㊣akL@V?b?LkKmV?@X?WVUb?VXb@lm@??@lW@@xk?lVUbnnmbU?lJ@?@L?@@V?b@?WX??UlkxVV@??wn@?mnLlVkz?`UbmL@V?@XL?m?VnI?@VU∼x@VnL?x?V@LU∼'],
                    'encodeOffsets': [[
                            115223,
                            36895
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1401',
                'properties': {
                    'name': '怮埻庈',
                    'cp': [
                        112.3352,
                        37.9413
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@VV@wVKnLVal@na∼n?aVJ?Ulm?L∼a@b?@lx@bULUlmx@Ln@lVkn?l?@XI?w?K?Vn?∼aVXVx??UaVU∼K?nUl?UVL?K?V????lnXalL???L?KUaVkUanmWU?a?@WwkUWU?y??@anIl@@aVU?m?I?ymU?LUUVakaU@@LmJkw㊣L?KmVUI@W??VaU_l?kbW@kK@m?UkaV??mVaU??IVm?alk?W@wnIVy@klk?WUU?V?I@??U?Vkam@knU@mmmK@b?blVUX@VkLV`@n㊣KU?UL??UnVV??Ub?KmV?Imbm@k?車@Ul?b@VmV@b?Xma?K?@?UUxkV?V@??xW?UxVnkVVJ@XnJ@XlV?L??VbnL@l?@∼?'],
                    'encodeOffsets': [[
                            114503,
                            39134
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '1403',
                'properties': {
                    'name': '栠�羌�',
                    'cp': [
                        113.4778,
                        38.0951
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼@nb?@lb@b?b?b?@?x?al@lb?KXU@m?kUWkkmUU?VwV@XUW?@?naVklKXblKnL??nLVanImaXKlL?a?V@U@KUKW??al?XK@?WKXUV@VU??UUVW?_V?@W@?@K?@??U??IWmXUm?UL?n?JkImm?aUb?L?K@U?Wk@mn?U?@kVWb?@Ubmx@l?zUx?`U?ULml@?X?Wl?@UV@nk@U?Vb@X?Jm??@@Vkn?yk@?z?J?nUV@bk@mJ@b∼?∼zXVlVXx?@?bXVmnVbUlVb'],
                    'encodeOffsets': [[
                            115864,
                            39336
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/si_chuan_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '5133',
                'properties': {
                    'name': '裘谻紲逜赻笥笣',
                    'cp': [
                        99.9207,
                        31.0803
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?aXam??wm?@㊣∼wUwV@UaVw?K???U@U?U???a??@????x?Knkm?X??IU???Uwlk∼V??@????KUwlkUyV??m?x?Xll??W????l?w∼U??n????J??l?∼V@w?IV?n?nUll?L??V??L??X?W?@㊣??@?k_?J?kU谷?k???wXa@??Llw??Vx?b?m???xlL???VW?n?m???U?l?kwl???m?ULmwUJ??@wkm@?lUX???????Va??U???@w??kbV?mnU@@y?I?K?V@??a?谷@k?m?U∼?@a??@anKlblU??@車??@??w@wk?la???㊣k?㊣@??U?m??w?@kb㊣??akXW?kXU??U?∟X_?w?V@∟?XU??b?U???IUl?Uk??@?aX?mlU?l豕UV@?mVk?Vx??@?㊣??????anlW??n???w@w∼KVak?m@kl?Kkn?U??車K?貝laUaV??@???@??U?V?????X???l???l???WU?J??mx?L????X??VlUll?bl???l??x車nn∼??U?mJU??n???V@那?∼U??w?@m?@??km?Xam??aUw?KU???m?n?Wmn???n㊣????X那㊣?n???U?l?k?V???Vn????n???@?k∼V∼??Vlk?Vxm?X???@?VxknW?∼?U??n????@`?????????zn?mX@x?豕∼K∼??U??車?????車??那???bm?k@V?????@??l@n???那?x@?ml???J??車x?∼??m??L?豕??@???l∼?????X@xm?kV@z@???∼bl?n?∼J@bn@??UV?U車?車L?∼X∼?L?xUn?∼???n@lnL@??@?n?K?xnUnV?In?m?nx???I?車?@???bU??mV???l?k??wnL?m????X??w?U@w?wU???@alUU???U?Vkkm∼aU?∼?∼w∼U???b∼a???K?????@?b???a???XVm∼In?????k?Vb?a?J????V??an??k????n??U@anKn??b?m????nI?谷????'],
                    'encodeOffsets': [[
                            103073,
                            33295
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5132',
                'properties': {
                    'name': '陝商紲逜Ф逜赻笥笣',
                    'cp': [
                        102.4805,
                        32.4536
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l@@??I@l??VL∼wnJ∼U???豕?Ilw?V∼∟n??∟??l豕?L@???@x?l?豕???_??V??J?貝lbX???V?kx?V??n∼???b@豕@nn@@∼?U??W??_Uala??U??k???mVwk??k?∼VxlL@∟?_@x?`?????b??@l?alX?a@bnK∼?VK@nnWmx@nUnl@@l?l??k∼l∼UXkmW@Un?`k??L??W???Vx?VVlVk@l?IXb@ylX?W???W?z?y@?mI?????J???@n?∼@V??J∼a??@??kV??k?aUw?KVw??V??@nkm?@㊣?k???J???In?m㊣nI?????X???x?U?b?y??V?kw@kVUV??m@??a???b?m?UXw?x?Un?@?∼????a?JVk?aW??@W??U???@??kU??@a?I@mmanw???W@???mw∼?U?k?㊣W?xVx??U∼?z?W?w@?∼?V?k?@??y∼a???@?m?nl??a???akwU?㊣a?Iml?n@?m@kkV???m???∼x??l??@??XV?ml????U??mw??VaUw??X??????aV???lwU???U?車?㊣??x?V㊣??n?m???Lm?n?m??@?_kJWa?XmwU??K???@mwX??U??kK?w???n?aUw㊣?kx?K@?Wb?x???lV那?l?Il`@???@?X∟W?車??KU????KkkmVm?U?車J@x?Uk∼???I??m?身??V?x?k??X???kk㊣W?w?nU?VzklVx?L??@????UklVx??V??JW?n?ml?L車w??@∟???b???V@V?V??㊣LUxVbU@Vx?x@?n?∼xn?Wb?b'],
                    'encodeOffsets': [[
                            103073,
                            33295
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5134',
                'properties': {
                    'name': '褸刓眝逜赻笥笣',
                    'cp': [
                        101.9641,
                        27.6746
                    ],
                    'childNum': 17
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?車?Knw∼∟?IXV??k???k???W?????U?V???∼@???@U∟Vbkb???L???Vlm?Llkn@l∟Ub?L@x?x??∼mX?mk∼b?∼∼???@???Uwl?nU@?VUk?V?nkW??b?@l??VVk?J???V?aV??W@??U?xW`???VV?lWX?lW∼b??la?@∼xn?V????@l∼???豕kbl?@x?x@??豕nal?nU???@???K?nn∟@??∼U??nV??XU??bn??UVbUlV?∼LX??@lV?豕?UnK@_?y?XVyUwmIU?V??k????kkV?m㊣n?@?n??anVV??z@??b?w?b?m@w?a@k?mk?@??a@?VUU車?w?@nb∼m??X?mnVb??V??anw?J?ak?lw???L??n?@wl??I???@U??L??kV???車?kVmmw@?n_?Vn?∼L??@谷???貝V??@??U??a?V??????l???l?@車????@?nkU???m㊣?IV?Uw車KUn㊣??K?w???K??V?nl@?車xUw??????Um?????K???U?lmK???UV?@???W???@??nny?@n?m?V???@∼Vbl@VlnUUwl?∼a@???@llnk∼lbnKW?n?U?VxU?????m????????aU?Vb??@?m`m車X??Umm?x?@㊣?n豕???U??m??V?m@w?U@w???m?L?a@??V?Uk?l∼??VlkV??U?mx?aULU豕Vx@?kIUxmWV??Vm???U?nl???@m????VWx?b??W@k?m@kVV?mlnn@?身?l????xk?'],
                    'encodeOffsets': [[
                            102466,
                            28756
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5107',
                'properties': {
                    'name': '蹴栠庈',
                    'cp': [
                        104.7327,
                        31.8713
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?里lV∼??@???VX??U???J?w?@??m???∼K?k@?n????@?w∼JUwnw@w?bVb?@Vl?LUw?a???aUklyUUVakwW?XwW?UxkL?mn?m??wk??UX?lJ?w@a?Ik?∼X??W???l??aU??Ilmkkl??L@m∼nlWU??aW??@V??@UaV?@a?k@?k??K@a?K@k?Kk??X@VU@kx㊣V?豕kIWwUVUkkK?@?a@wkml?@kUWn?Wa?aVwnaV??w?@UaWx?n?J??UxU?ma@L@?mbU??U㊣VVnkxU???V?m@k?kKW∼?X@∟?Uk??nU???k?mLVw?K@U車b???V???L@?㊣那X?mV??k??nWU???@k????w??n?∼?U?lln@@??mnk?J?bV?lx?b???bk??m?n?@?∟?b?z@?l∼U???@??x?X?yV?∼?Uw?w?Xl?V???nx??@??X??mxnb@n?J@b'],
                    'encodeOffsets': [[
                            106448,
                            33694
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5117',
                'properties': {
                    'name': '湛笣庈',
                    'cp': [
                        107.6111,
                        31.333
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Uxn∼?bn?lUn???nn@n?∟?LnxlU???V@??l?x∼XXxl`X??VW??L?豕??㊣n?b??∼b@??x∼K???∼??V?lJnU@????J???m?L???xU?lb?V?ann?al??V??X@ln?V?mU?ma?X?a@aWm?@??@w?JV?kk?kkm?nk@?mna@??al??K???J@??w?m????@ambkU??@??KU??K?U@m?ak?㊣??a@a???aVw?Xlw?㊣??V?l@@a?k???@@??m????車nWV@??n???x?Umb?aVkk?k@m???@m∼???Xm?ak??貝?@@?mb?@@xm?nb?@mx??k?WL@??b@WUXmW??WKkbm@kx?Xmm@LUl?xl那車K?nU??all?L?l?L車∼m??JV?U??K??@x?K????l∼'],
                    'encodeOffsets': [[
                            109519,
                            31917
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5108',
                'properties': {
                    'name': '嫘啋庈',
                    'cp': [
                        105.6885,
                        32.2284
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?L???x∼????W???L??@x?K?∼?nVx??l?nJ∼a@w??V?l@X?WknKnw?V??∼XXa?lX∼VI∼b?W?n?a????@??w∼?n@?y?@nk?@∼?lJn?∼I?l?U?lX?@?lUV?VUU???UU?@Uw?JUk?m@???lk?WUwVw??WJk@V?UK??lUkaV?U?mLk?m@???@U??Ik`@??UmlUkV???XK?_mm?@U??`kwm??l??㊣KV???Vk㊣Vk㊣kzma?KUn?㊣?bk?㊣?X????Wl??J@b?xkIW??Vl??xn?m??nlKVwX?WxX?lxUbVVkzVl?b???bVx?KUk?@Ua?a@xmxVx?I?x?@??m?@??l?L?∟n?'],
                    'encodeOffsets': [[
                            107146,
                            33452
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5118',
                'properties': {
                    'name': '捇假庈',
                    'cp': [
                        102.6672,
                        29.8938
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ln@x?豕VInxVKn???k?lxk?V???n?m∼nx?@???LV?nx?WXblI?`?@n?m?n??K????l?U?mU?K??@???V???V??W???UVmX??bnw?KU????@UmmIUb??Uw?????m????manUm?UU?l?k?∟?a?bV?U_W??m???㊣?Ul?U?l??V??kU?@W??KU?VkUa?Vm??aV??WU??mV???@?m??m?L??㊣@??mVk∟mb@???kVkamL@b∼?@b???V?n@l?那?b@??U?L∼J@zV@nmU?la??@x?∼V???Ub??車???W?kV@?'],
                    'encodeOffsets': [[
                            104727,
                            30797
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5115',
                'properties': {
                    'name': '皊梅庈',
                    'cp': [
                        104.6558,
                        28.548
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Vl?nl?XnWLX`m??nV?@b∼x??ln?Vm?nn?@@?∼?Uz?lV∼n???kxl??w?`UnVb?m?L@alb?K???m??∼@X???@wmW@??K?L?lV??LV????L?㊣??kw@?U??y@?lKX?lKVa@w???@?w@??a??U?n?@?@w?ak??a身????K@???VakUWm?wkb??mL?ak??@???∼?xVV?@V??xV??VWx?XlxU??@k?WV??ULm豕ULV?kl??V??JVx㊣n????mw?@m??l?kkl㊣@k?Uk@?㊣??K??kxl∟?b?Imx'],
                    'encodeOffsets': [[
                            106099,
                            29279
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5111',
                'properties': {
                    'name': '氈刓庈',
                    'cp': [
                        103.5791,
                        29.1742
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@k?V?k????k?V?Ul??Ilx?LX豕?lU??XU?mk?bV豕?x∼@??@?∼Knnn@m??IUbnJ@bVI∼b∼㊣@?nK@mVakk?Kl?nb?m???豕l@Vn?l?UUw?wmwnm∼??L??lLn?U@Va?Imbk?mK????nk@m?b???LV??JVUU??VnkV?mb@a?JUa?kk??IW??Klw??m?U??kVy??@??@mmn??Ukm?豕?w@aU?㊣mn?W_XKWmk??mUk車bU???UanmW????nma?@?xV?UV@??b@?l??n@l?b@x?n?a?x?a@??yU?mU?bm∼@?m?n?U∼ll?????lU?V?nJVxUz?W?z@`mL'],
                    'encodeOffsets': [[
                            105480,
                            29993
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5113',
                'properties': {
                    'name': '鰍喃庈',
                    'cp': [
                        106.2048,
                        31.1517
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??Vm?Lnblyl??UUl?∼U∼?L???kn?lx?_V?∼@nn?`WL∼?U?Vlnk?V@?l_?JV??@??n@l?nKV??????UV??m?@laX??U??UbVx?@Vk?JU?∼Jn?@??wUk∼wn?U?V_nJmknmm?Vwk?車?㊣??L@w???LV?U?kU?bX?mykI@a㊣Kk?ULmaX??Vm??K?z㊣?klUIVb?J??kL??l??U???U?lU?kJ?Um?UUkVVklKk@@a?U@??J???x??k?@?㊣?XnWb?x?U@x?x@l?L@b?Ll?@??l@bU?Vb?@U??@X??bV?kX?m@n?Kk?llkn?JV?'],
                    'encodeOffsets': [[
                            107989,
                            32282
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5119',
                'properties': {
                    'name': '匙笢庈',
                    'cp': [
                        107.0618,
                        31.9977
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V?U?lbkV??VLU?l@XI??UxVx?Xkl??@??nVl?IVx?@VV??V?UVU?kV@?W????@V??n?@Va?b?W@??K@?XUm?UW∼?∼Ina@y?_lWn?lLUb???Kla@?nkUy???x∼@??n???@?mVkIU????????L㊣w@??a???a?m?????KX??UW?k_Ww?W?w?k@??U??kVmw?K??@mmm??m?kVm??amnnlmIU`V?m??xVl?x@?m??IV?車IUl?@UwVa???VW?kb?@?nU∼?V????U∟'],
                    'encodeOffsets': [[
                            108957,
                            32569
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5105',
                'properties': {
                    'name': '蜚笣庈',
                    'cp': [
                        105.4578,
                        28.493
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@VVXwVKn??wnV?n?l@b?xmKUbVn∼∼X∼@blL?豕nV?@Vn?l@U?LnmmUna?VV_?V@wnJ??l@@kkKV車laUwnJm??wU?lm@a??Ua?KV?nJWb??@V?wVLX?VV?_?`?w??W???mmnIn?W?@k?WV??@?∼kI???Lk??@k∟㊣Xk??nm??Ul??KWV?k?lUwkL???@U?@??w@?XV???WX??@UbVb??V??_k?V?lU∼lnw???a??nmm??U??m?nkVmk?l_車??U?l?@???L?k?`???LUy?@mw???∼?_??U∼ml?n?VU???@????_?JUnV?UX?bl??b@x@?m?V∼???b@??x?@??@xUbkLW?kL@??zV?@?lx??㊣?'],
                    'encodeOffsets': [[
                            107674,
                            29639
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5101',
                'properties': {
                    'name': '傖飲庈',
                    'cp': [
                        103.9526,
                        30.7617
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼n∼m?∼?U?w????V?∼?V?kx??U??b????la?L????@k?wV??@??n?????U?∼Kl_?V∼U?`Vbn@Vb?L?aVU@???V?nIl??UUa?㊣lIk㊣?@V?nKm??@Wa?K???lV?身?kK???@maX?mw?IU?@k?V?wUmVI???????U㊣??@??@x?K@w?LUb?K??@m??@y車U車車UxkI@WlIUa?b?a??V??Lmx?aW?Un?V???XU??∼U???@?㊣??LnVV?k?車?'],
                    'encodeOffsets': [[
                            105492,
                            31534
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5120',
                'properties': {
                    'name': '訧栠庈',
                    'cp': [
                        104.9744,
                        30.1575
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?豕??UJVn?x?U@lV?∼JnxW?nb?@??lL??U??k???LXb?@n?mLU?@zlbXmlnVynL???JVb?Un車mUnamU?an?lKV_?aValW??n@n??bV??K∼?VblW@kk?lUnlV?∼W@w?UXk∼KVw?mV?kwVyVI@wkm?V?_Umm@U?mbk??xUaVw㊣V??V∟kLWxU@Uk?b?y?X??車m?∼V@@z??kK?n?㊣U@@_VVk??aVwnLWa?lm@@kkVVl??kIV`㊣n@w?K??k??a?VUUV∟?nkxmUkVWVnLUbVb?`kUU?mLU?mX@`?b??XbWLX??n'],
                    'encodeOffsets': [[
                            106695,
                            31062
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5104',
                'properties': {
                    'name': '戀皉豪庈',
                    'cp': [
                        101.6895,
                        26.7133
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?b?K?n??@x?V@x?n?Un?∼??V?㊣m????@?wnn?VW?n?n_@???UaV??b??????n????㊣V?UwV?m?X?mLkal?km@k??@??bk?VxmVUkk@Ua@???U?n?m??@mz?m@貝??X???@??xU??????Ukx@?lb?UWVX?mV@x??㊣@@??xU??Ln?m??x@nXL㊣lUUVw?KWak@Wxkb?????bUn@??@@x車???'],
                    'encodeOffsets': [[
                            103602,
                            27816
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5114',
                'properties': {
                    'name': '羹刓庈',
                    'cp': [
                        103.8098,
                        30.0146
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??Vx∼?VanJVn?@?b?aVbkJ@XlJVw???V@z?∟@n???LVa?K@x?L@w∼??@???V???mW?XKWa???a@_nWV?nKV?lV?_UaVamKXUWwnmmw??m?@ynU?kW??UkWVkkV㊣?kJm?kK???K??mnnx?xVx?V?kUmk@?????nmak∼?LllUb@nmL@????aUJ@amIVa?Jn?m@mm?L@????@?wU??anlV??WV??kW??Kkw?Jk?㊣V?U?l???V?????nX?V`U?∼a?b???l?kVVn?mVnb?豕???n∼?'],
                    'encodeOffsets': [[
                            105683,
                            30685
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5116',
                'properties': {
                    'name': '嫘假庈',
                    'cp': [
                        106.6333,
                        30.4376
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?VlIV??k?V???Vk?∼?lK???IUaVJlk???y?Ln∼?UW?nbVKl??L@blJnzW∼?alV∼In????K?k?Kkk?bV??m?Lk谷?wVk@Knn?Wlwn@laXL??nXVW@X∼a@?XKl???nw?@man?@w?@na@??@?w?????wU?kUWb@mk@????mU?b㊣y?n@bml@?kV@??lknVbmVnlm??b?k?bWyk@V_UamJ@I?@Wa?VXamIVWkUkbVa?UUx?@VnkVU??bkKUxmK???@W??xnV@n'],
                    'encodeOffsets': [[
                            108518,
                            31208
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5106',
                'properties': {
                    'name': '肅栠庈',
                    'cp': [
                        104.48,
                        31.1133
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nUW??谷@??K???U???a@V?LUxnKl?∼?V??ml??V@??WX?lLl?n@U???V?lwUm?U?VV?na@?@KnbV?Vw???I?mXwW?kIVw???VUa?I?豕mKUzkmWnka@y?@l?kJ??Vb?Vk?mJU???@?UV?b?KUam@Ua?_?V?Uk`?LV?????m????@U??x@l?????KkbW???VxUb??nx???V'],
                    'encodeOffsets': [[
                            106594,
                            32457
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5110',
                'properties': {
                    'name': '囀蔬庈',
                    'cp': [
                        104.8535,
                        29.6136
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?豕lUUllX?VX??lmV@zn∟??nxmnXxlUnVlw?mU?VV?U?bl㊣???L@x?mU_lJ??UklU@ln@?kXbmKUx?bl?UU@`V@???mlL??@yU@???n???W?z?aVlV@XwlKU????aVaUwm@mwUVUwk?l?V??Ll??KV?m_@y?kUm?@mU??kKmxkIU???@LUJ@n㊣?k??LXb??@mmIXa?@mamnkW???KU??x?_U`UklwUw?mUb?V???akb?mkn@`?Um???VxUb?I?`U??a??'],
                    'encodeOffsets': [[
                            106774,
                            30342
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5109',
                'properties': {
                    'name': '咘譴庈',
                    'cp': [
                        105.5347,
                        30.6683
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??UxlJX?Vb∼@?xU?mbUx?bXbm∟VX@lk∼ln@x?b?@lLVlVUXxlJ???UlwV@@U?Wl??L?w@w?V?wXaWm??@?l貝???w?㊣?I@??V@bl@kLUllUVVn?@mmU?wX??bVb?@VUkbmam??W@k?a@??k@?laUa?@?b@??mmw車@@lkXUa?∼?LU??am?m@車?kXUb㊣bU`kLm??bnVmbnVm?'],
                    'encodeOffsets': [[
                            107595,
                            31270
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5103',
                'properties': {
                    'name': '赻僚庈',
                    'cp': [
                        104.6667,
                        29.2786
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lI???bV??_?JVaUw??n??V@_lm?nla?b?㊣?UVa?nVxkxVlV_?`?wV??L??lXnmnb?@WbnJ@n??Wa?Kl???@mVI@K??V?lJnw@aW???UmVanL∼w@a?k?mmU?xm?ULWxUU?K身豕U??KU??k?K?L@?nX@x??W??@???n???Lka@b?K?nUaVm?_?xk??LX??Jl??lVb∼I@bnaU?ml?UV?UV?IU??K???a@nml????nLl?na?JUbV@'],
                    'encodeOffsets': [[
                            106752,
                            30347
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/tai_wan_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [{
                'type': 'Feature',
                'id': '7100',
                'properties': {
                    'name': '怢俜',
                    'cp': [
                        121.0295,
                        23.6082
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@\\s?@pS?}?aekgKSu??SsM?`?CqZ﹞be@Q^o@?gieMp??]}?}?c_Kk?{?迄??A?r?[uom@???Jiq?m?q?Bq]?YgS?k_gwU?isT?E?????iqiUEku?e_?OSsZ?aWKo???q?yc?Y?w}????S∫Z?S?N?SyL??㊣Ks^IY?Pd?Y[Uo?Fp}?\\?\\j]?e??辰?∟??芋?a\\bn?U????s?j?[c赤?E???`?f???K|V?D?dKGpVnU?FjpH?F`?B?[pM?x?jbp?xp???|????C?????Ap?ZG~??d??角V“|??`|??tx~\\~|dFf^zG???h?dL\\h?????O?P?lV`p\\]Xpll??∟?CpQ|oF}fMRi?NSon_?q?m?M?NM?\\?'],
                    'encodeOffsets': [[
                            124853,
                            25650
                        ]]
                }
            }],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/tian_jin_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '120225',
                'properties': {
                    'name': '撒瓮',
                    'cp': [
                        117.4672,
                        40.004
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@EUDAEI@WNMNCBFAHFFNACDJDPBD@@GD@DIFFHEFGDBDEQOFG@EI_KG@OcJQM]RMEKBGPG@[LaCIICBWK?CEEG@WBQHCDFD@HSLEJI@IHWECFGAAEKCGDBFCBSBIDCKKHEADMJMFABKOKEQAA@IEEG@GIQAEK@OZEESMOL?lu@SLUTYFQCMG@@SQUAYKAACA@IB@BDB@B@DC@@BGAEFAA@BEGKJCC@AGAIHA@@JC@QEIP@@A@EGIDC@O@C@@@@CJCWKABFLBBEBSQGBAAMIEM@AKBcJEN@BEBCFMAEFEF@J@BG@BFABECKFG@AFQ@@F@BEB@@A@@AAAKAE@GFGDECEFEECBKIKDELDFEDYH@EIACDCHKBEB@BAAC@ADBHABKJIAIJICEDGDCD@@A@A@DHCHJHDFEFGBKRKBGIK@GIMHSBCH_BOJECCJCFKKMD@DNJEDEGC@OJCJHRUL@HRJ@H[DCNKDZHCTFDHCFFKR`TANVDFZRDLFARB@HPAPG`ILAR@TERNDFNHDLCLDDCXDYbHF@FEB@LDDVE@JPNfXPINCVDJJD@NJPAJHLXHDNANHhB@DPNLRMTBFRBHHr@`NBFEBOCCBIAQJDHCHLHFA@HSDCRLFTB@HEFLNF@PELBDJALFLTC@EPFLLP@tUHQJDfIHGTB^JTCPDLKAIBATFPADIEGECEMJ@JIAIHGECFEAGDI\\SPOXAFCL@BQTQBBTMZECYGAHA@GJAE@HCAEME@IECFKJADDBABLTHHG@ILEAMNDJCDHEBF@@JNFJELDFKTOT@JETBFFHBHEHKI@@IJEJ@XKEOUMS@AF@CEB'],
                    'encodeOffsets': [[
                            120575,
                            41009
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120114',
                'properties': {
                    'name': '挕ь⑹',
                    'cp': [
                        117.0621,
                        39.4121
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@FW??@IFCLIB@EHNBp]AGEAKAEDMGZKFGBGME@ILGP@HEFB@BXMEAHUGC@IHCLOD@X[NWHWPKAEF[@EKIOL@EKGBNMJ@EIEHKBIC@BAKMIACCFQZCF]DB@ERAKADIHGEIBCGIIECFaGLZO@EFCNGAGDGAKL@BMG@IE@ADSDEH[JGC@CGA@BMDeK@EIACFE@@GG@FIAMM@CCGC@EM@ADE@CFMAAGHBDKIEAJG@DOGCDEKAGIS@KFCHKAEHIE]BeKNO[IFIOELC@A]GMBKVYCDDgGAICARc@MW@AQE@DGI@@AQ@@BKBAIQQYEFW@CEADIGGBCEIiMEMF_LGEKMBBDWEBGRC@E_CHYGCH_IAED@FFBQh@FGJaJ}AHRAREF@bE\\C@CT`FHC@\\BBF@BID@HGDDJ@@FAHKBARECKDAZBJIVNHCTA@EREAMLHDAFFBVFFC@RNRETHD@FOJMACH@CAB@P@DF@@FGDWE@FFSIEMKQDYCCHKb^JADOCIDGNDBdBCFJB@EC\\A@BJEA@JAAAD@HHD@LFBCFF@BERDHNhZQHMBGHOACCEBWEGD@PSJKCGEUD@CINLFGHE@AJK@HDABBHTB@F`DBFLBBHEDARCFG@ABJBAPVFE^FBGLGCFG_BMLEXGAAFE@@JNRVJHFALFBEHQJCTbNDHCF@PlFLJSXCHFHfVBTNJ\\BPJXC^FAVNFCHFB@FFH@JF@\\ABCFD\\BDMCAAJKQBGAILOEGHILECQLWFENJHADC@QxNHFJNLDFA@CBA@D?U?mR@FBL@BD'],
                    'encodeOffsets': [[
                            119959,
                            40574
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120115',
                'properties': {
                    'name': '惘貁⑹',
                    'cp': [
                        117.4274,
                        39.5913
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@TZbB@JHD@DODCLM@AP@LL@BNH@ETFN@`E@DNG@CHLBCJA@AICFKDDBKA@\\N@AFNAGRBFjFFFL@DHLBLFQPcXAZMJ]GAVHAIZJFNE@JpDRRDCLFDGXA@EFF@CFFPDfEBDB@DCHCFCJDJIJBLI@I@CB@@ADBB@FALADGDC@@H@BB@FZGFCCE@@FMLALJDAFFFEFDFCB@@AHCF@L@@BBB@BB@FC@E@@R@BEL@HEFD@G@AH@AIB@@@FEFEBALDDEFAFO^IF@JCBBFPNJJ@D@PRDCEKBAXL@BIFD@T@JE@BHHJORFDI@@B@JGH@@B@BDDLIFFHCD@D@DEE@BAAAB@DAF@B@H@NGLJLMRDNMfGIEPMI@GDAKK@KIDIJ@GE@CFDN@FE@GFEPGV@TCDFKHBBF@RW@DD@@ID@TJFKIKLI@EP@IGBCLAEKLEN@KSHIGYACSD@SEAMBBMGEBMQBCMIGKFB[D@HDLPHDBC@IFITDLG@IIIFGVBNJDLN@VIRI@YIAIHIC@CLKZCBEE@JECEIHEAKGDGECBGEEM@@DA@CCCBBEGA[GEDBBoNAAH]MKiIAWKQoIIPMFQAEEDMH@FMSUYIeF@EK@BIOEKJEBICFKaKP?FAFSE@LWCCFMHDDEKESBOGBKIEIODLG@CCDEQCEDWEMDIEIB@EHGEEDAEAa@@HqDEJGF[AECCFa@WCEIKAAEQB@FCAE^YDERDDJBLNABD@AJGLJF@FNIAMLH@FPKLJ@FE\\BFOLGXMXW\\C@KPGD@JHDGVFBWN@AEAGFO@KH@JNFAHEHYLNHFCLBFBBHo^MAFGA@KJED@J車?EX'],
                    'encodeOffsets': [[
                            119959,
                            40574
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120223',
                'properties': {
                    'name': '噙漆瓮',
                    'cp': [
                        116.9824,
                        38.8312
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@NGFMDATCNDR@CCbINEHNJA@C\\EEGVE@IhE?[?w?epc?﹞??^QEKIEKIgiQDkehY?uSDBMkUDOJDHC@GF@CAFBFEN@C?Q@BeP@@G@HD@@MHQKi@[IGCOCESE@GMA_OcCGDu`a?@VZzKDkJBLNXGDqKEWE@cFEFA@?ISIi@@KMABJGBcMuFEzGVH\\ATSEUBeA?LCEMG@CEBUHUCGXaBPtUBBFIBFTDFF@DDKBFNGBJPHXDDMDCLJ^mBIHIL@LR\\@LCR[@@z@NFD@LLBNb@RHDBNTPT\\F@BJF@BXCFBHHBDLFB@HODADE@@JHVXCPDHCFTLBBFNCDCCCU@@GAABEHHZHBCAEdEjFDD@GfD@DXFCHF@ERFDLBH@'],
                    'encodeOffsets': [[
                            119688,
                            40010
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120221',
                'properties': {
                    'name': '譴碩瓮',
                    'cp': [
                        117.6801,
                        39.3853
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@BFLBFJXDb@DEFD\\BHEFIrC@Gb@FBCBFFGH@FJAJFNCXFFCRDCFDDH@CKJPJFALPHTALFCFGCENDDKXF@ETEBO?bLELJDFALIPFAJL@@FfEZJTVENG@CNFFRBNEJOpJLRBXjJNLG^BBpMAAFC\\HHBAFDADDB@@CN@FFAHFDCHLHFBJGFCFUNKJJTD\\XUXF\\^F@DDDQXXBRLRCBDFEVCDLVDpUl@LEDJHAPRFGL@CETGPBTCDDVI@CFF@GFDCCVGLKEK[Y@MECISG@BKNSCGCKWEAaEBEKNGFSECO@GGM@GYI@D?CMLHPTF@DJHAVVNKEGDETJ^[TJNNd@NOAMFYJ@@GFANDPEJB^aOadSTQSI@MHBDIEOKCG@EEFCKCqXO@@DMFENCDDHCCGJ]AKFoDaGGHYFDHKJiCMFGC@EQ@AEHGAC@IEAATKOHGIC@IXIFEo?GE[JCFCDHNmRADFZMF[EEBMO{GU@AOW@@]ZeHBDEHBKEfQkuIWBs?@EC@d[@[^EDMTKCEEcI@cDAB@FCBCACmOCG{PYHeBgPwPFDDALFFFCHQGSD@BHFAR[TaFYXMASUiGFL@DQNCJI@@D@PLDN`ETEFIGMCGBCE?~CAIFDPEHGEQPHJADFJGHCJLB'],
                    'encodeOffsets': [[
                            120145,
                            40295
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120109',
                'properties': {
                    'name': '湮誠⑹',
                    'cp': [
                        117.3875,
                        38.757
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@JFFL∼_`ONJKDDFIFZN?xlb~yFVNR?rdJGzDPVFBCTNND\\UR@E`F@@Ip@IWGUoawOEE@?DgK{?EEMF?C?b??@?KwOCDHHKBDJCDEEEAGHOABFABMCgDLSQ@CFEB?MgYIDQINE@AUSwSAdYEHQMEyK[KI@GRMLE@@OqOoBOnpJ@BmEAFHL^FDB[C@BBDVFAHFJENB@sNEjQAMYsUgCSBGDJH@\\LjGR@NC@@G@HO@AfR@D?M@EFEADBE@@HGDICCPlVANTC∟vgZlfRChjLJ'],
                    'encodeOffsets': [[
                            120065,
                            39771
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120107',
                'properties': {
                    'name': '攽嘗⑹',
                    'cp': [
                        117.6801,
                        38.9987
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@|ODHnPBDADEDA@CB@ddJFFLDNSFC\\]\\@@cFD?@nACOMW@M@ITURBRZNHNWRQ?oO?j?f?cq?AqeiD??y??FL|Ch@?FFxPpbHVJXo@@JCTR^BPABQA]^MB@bE@@FQBFVJRH@FXtPNZSBAja@@N?DT?LJrQTHFXZFB`'],
                    'encodeOffsets': [[
                            120391,
                            40118
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120111',
                'properties': {
                    'name': '昹ч⑹',
                    'cp': [
                        117.1829,
                        39.0022
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@LHAHRHATh`LHNHDG`HDGZ`D@FQDAHXFACNAFLVRTBFOfHDCVBFQH@HSXHEPFB@LDBF[bDbLFKJBFLADBDjLvCPEI]FGEIGCBEUSjcFiBIVWfaHCjN^HtwBBFGPBJGjFBEGECGDONMFAP]TDHQOWCMGAMHKIJEIGQ]aDlUG]VGEGDC?{PEbBZmE@@GH@BCA@FMQCFMYMJECELCMI_P?`]R㊣???od?f?x?\\gF@JUFFH[F@DIBGMMFaJDDQ@MCSDCBENMH'],
                    'encodeOffsets': [[
                            119688,
                            40010
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120113',
                'properties': {
                    'name': '控魚⑹',
                    'cp': [
                        117.1761,
                        39.2548
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ROHFFGCOJEDB?}DFHANDJHFEFSM_KC@O@CJ@DIRM@CEKKA?L?FKACHoLSJSIBETDJaEIIE]E]K[MYUYQILC@GF[MGNKEK@A@BCWECAIFEFYAGFOMI[OFuDiKACBCEKIAELaKaCE\\CA@KEAFOWGGTG@ERUACDeGEPSAUQKHE`FNjNFJADHHCJFB@DEXZFRRBJLA@AR@@BJ@CHF@BRX@@NQdDBBJhHCCZDLUNA^H@BKDPFEJ\\JMPfL^AJFFGLBDGLET@HJLBCFHDCPH@BIJFCLGABHNBDEF@BCN@@FHDDDN@BNEJH@@HF@DEJB@FfLNC@AHB@DHD\\IFGTCBCF@@JNH@ALKHBHCHBDMFEP@KYbHDEJF'],
                    'encodeOffsets': [[
                            120139,
                            40273
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120110',
                'properties': {
                    'name': '陲璨⑹',
                    'cp': [
                        117.4013,
                        39.1223
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ZV\\N^L^FJFFJIbSCAFTJTIpKDGLB?E?KLBjHTVNBZWbE\\SBQGE@ATCRHDGEEKECBECxOhOfAZGA_YEEWSGqRKIS??C@Mb@BiTAMYsOEWG@IQEURA@EF@@acUOXQRYCUDCHDTEF[SUEgAYDcVGJM`iAWDWLQRMHUHgDsDBLHJFCFDFGHBFFVEAGHCJN@RJF?PIhBD\\FENCPWA@LFBAFHBEJUEARCDIAEDQBRNa^'],
                    'encodeOffsets': [[
                            120048,
                            40134
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120108',
                'properties': {
                    'name': '犖嘗⑹',
                    'cp': [
                        117.8888,
                        39.2191
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@LMEI\\MTABKN@FCDMH@COAcH[Ao言A?M?Wa[Meq??pQRMXMGQYQASV@J@NNXDPmBAtJXlveRLFGACFGAYf@^X@BPV@|HNPFA\\FNEEYBCnQGMDCDE\\IHFp?EFWJ@JJDGHLPBSFB@JBDGHBFR@@FHDNEjDLICGZEHGbHpCLE^BHIDDCGDCFMNE@CP@rWLDEDFFH@'],
                    'encodeOffsets': [[
                            120859,
                            40235
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120112',
                'properties': {
                    'name': '踩鰍⑹',
                    'cp': [
                        117.3958,
                        38.9603
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@TLv@CNHFFBHGZFETNPhCVGNGRQXKXCjBN_HIdUZChBVF\\TFECSDGVCZDRQPWdVNA^]RBBAAOQ]DSE@F_Q@[VMCSMADUECOHycI?qMQEU}zka?wENRDENB@ADG@@HF@YnaAOF?|CDFHUHH^kVbCR^JHIFLJNGHBDNPXGRSCO^EBMNCPDHHFAFiEIHOAEH'],
                    'encodeOffsets': [[
                            120045,
                            39982
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120103',
                'properties': {
                    'name': '碩昹⑹',
                    'cp': [
                        117.2365,
                        39.0804
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@d@hZNFdcLYXKRCtCMOFSYEGHEAGEDMu@SKAAsx]GMTGt'],
                    'encodeOffsets': [[
                            119992,
                            40041
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120102',
                'properties': {
                    'name': '碩陲⑹',
                    'cp': [
                        117.2571,
                        39.1209
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ZBVFFIGABEEA@KXBDOFM[EACJg?OIE@QIMGDBHUFEEGAEHECEDGIAKQDWLKZcdQPEP@FOFBJTJ@HNORJf@DBCN'],
                    'encodeOffsets': [[
                            120063,
                            40098
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120104',
                'properties': {
                    'name': '鰍羲⑹',
                    'cp': [
                        117.1527,
                        39.1065
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@NMVDCG\\E^B@HlB@YEDS@C?HsNSiMGDebUXAJEjidVTAFHDFJ'],
                    'encodeOffsets': [[
                            119940,
                            40093
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120105',
                'properties': {
                    'name': '碩控⑹',
                    'cp': [
                        117.2145,
                        39.1615
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@DBXFADB@L@LFHM\\NHED@JKZRb]QMRAFCJBDCBQYADMCAe@QIMP@GSIAIPE@E[EGH@ZEF]^HJAXK@KF'],
                    'encodeOffsets': [[
                            119980,
                            40125
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120106',
                'properties': {
                    'name': '綻Э⑹',
                    'cp': [
                        117.1596,
                        39.1663
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@J\\PNHEZBFEJELEL@BWGI^]FEkA@G]A[FDHUCMNEHJ^'],
                    'encodeOffsets': [[
                            119942,
                            40112
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '120101',
                'properties': {
                    'name': '睿す⑹',
                    'cp': [
                        117.2008,
                        39.1189
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@D?T@FCHG\\FFOROMEgYc@'],
                    'encodeOffsets': [[
                            119992,
                            40041
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/world_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'offset': {
            'x': 170,
            'y': 90
        },
        'features': [
            {
                'type': 'Feature',
                'id': 'AFG',
                'properties': { 'name': 'Afghanistan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????邢?????????M???????????i????汕??????????????????℅?A????攸??????竹?曳?抖抖托??????????朽????????????D?????忙??????????????????????牝?????'],
                    'encodeOffsets': [[
                            62680,
                            36506
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'AGO',
                'properties': { 'name': 'Angola' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@???????????????????????H???Rf???迂????????邦百s???????妊???????Z???????????夾???????~??妨???????????????????????阱???????????扼??見???g???['],
                        ['@@?????汛????????竹']
                    ],
                    'encodeOffsets': [
                        [[
                                16719,
                                -6018
                            ]],
                        [[
                                12736,
                                -5820
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'ALB',
                'properties': { 'name': 'Albania' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????弛?i????步?妊??g????均????????牟忘??????????'],
                    'encodeOffsets': [[
                            21085,
                            42860
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ARE',
                'properties': { 'name': 'United Arab Emirates' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?∟?????u?{???????????G??????E???u????抓????'],
                    'encodeOffsets': [[
                            52818,
                            24828
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ARG',
                'properties': { 'name': 'Argentina' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?∫???x?@A???把??????扭'],
                        ['@@?????????????????聿????????????忪?扳?i?????????????T????????????糸∫完?????????????投????????????????????迂????E??????????????????????旬“????式?h?????車??耳???抆????豆?缶????邢?收????????????????E???o???D?????????????????????忱????????']
                    ],
                    'encodeOffsets': [
                        [[
                                -67072,
                                -56524
                            ]],
                        [[
                                -66524,
                                -22605
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'ARM',
                'properties': { 'name': 'Armenia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????杗朴???l??}??H?聿C???u?????孜??'],
                    'encodeOffsets': [[
                            44629,
                            42079
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ATF',
                'properties': { 'name': 'French Southern and Antarctic Lands' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????q?????'],
                    'encodeOffsets': [[
                            70590,
                            -49792
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'AUS',
                'properties': { 'name': 'Australia' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????????????言???????????????t???'],
                        ['@@?????曲夾??????扶?????????????竹?????????灰????????????t???均???????j???聿??尿???忍???扶?????’???????????肉?????????????????????抆尿????妓??完????????屁??????????~??????????z?孛?芋???????????????q????????????批?妝杗???B????l?抗?????????????????s?????????而汍??我???a?快??????????把??????????孛????角?????????邦?o??????????v???旭?朴邢???妥肉????忘??扯?`?而?d?而?妍??????M????坏?????百???????e??????????????????????快阱????????扭?尿???????????B????????走????????妍??貝???????????t????宏?????托?忸????']
                    ],
                    'encodeOffsets': [
                        [[
                                148888,
                                -41771
                            ]],
                        [[
                                147008,
                                -14093
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'AUT',
                'properties': { 'name': 'Austria' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???C見??????s投??????????????x????????抆???????夾}???????里??????????????????'],
                    'encodeOffsets': [[
                            17388,
                            49279
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'AZE',
                'properties': { 'name': 'Azerbaijan' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??肉DG?????投????v'],
                        ['@@??????????????????????v戒?????忱???℅??k???朽?????邪?????????????忌???????']
                    ],
                    'encodeOffsets': [
                        [[
                                46083,
                                40694
                            ]],
                        [[
                                48511,
                                42210
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'BDI',
                'properties': { 'name': 'Burundi' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????T?????????'],
                    'encodeOffsets': [[
                            30045,
                            -4607
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BEL',
                'properties': { 'name': 'Belgium' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?芍???羊?????????????????`???迅'],
                    'encodeOffsets': [[
                            3395,
                            52579
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BEN',
                'properties': { 'name': 'Benin' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????尾?????????缶尬??????F??????????妊?????t???'],
                    'encodeOffsets': [[
                            2757,
                            6410
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BFA',
                'properties': { 'name': 'Burkina Faso' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????????有o???????妍?扛????????弛?????J芍妊?????妖??m???宏??糸???l????肋???q???'],
                    'encodeOffsets': [[
                            -2895,
                            9874
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BGD',
                'properties': { 'name': 'Bangladesh' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@i??????????妞戎???邦???朱????????????????????????汍圾??????^?????????????F??'],
                    'encodeOffsets': [[
                            94897,
                            22571
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BGR',
                'properties': { 'name': 'Bulgaria' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????我?????????????????U抖???????|??扼?????????妊汛‾???'],
                    'encodeOffsets': [[
                            23201,
                            45297
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BHS',
                'properties': { 'name': 'The Bahamas' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????????????J?'],
                        ['@@???????{~?'],
                        ['@@????`???C???']
                    ],
                    'encodeOffsets': [
                        [[
                                -79395,
                                24330
                            ]],
                        [[
                                -79687,
                                27218
                            ]],
                        [[
                                -78848,
                                27229
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'BIH',
                'properties': { 'name': 'Bosnia and Herzegovina' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?F?考妙?迂?????步?迂????成??????宏??弛?????n???\\??'],
                    'encodeOffsets': [[
                            19462,
                            45937
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BLR',
                'properties': { 'name': 'Belarus' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?M?????????????????????壯???????????阱???????????????抒???????????j???角?m??坐?e?????L?????'],
                    'encodeOffsets': [[
                            24048,
                            55207
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BLZ',
                'properties': { 'name': 'Belize' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@O????????ZH迂?Ga??汍??????貝投??????@角?P?'],
                    'encodeOffsets': [[
                            -91282,
                            18236
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BMU',
                'properties': { 'name': 'Bermuda' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@OEMA]NOGNG\\Q^McMOI_OK@CQSGa@WNLVWHFLJXVFGJ`ZRTDLeeWKIHGIK@@[MQNi`]VDTBHCJAPBJLVFjT^LV\\RJZRn^RH`TfJjZHHOTTFJP_NOX[EYQQKMEJOLANJH@HQHAARF@ZEPS[U_IcRQXE@EEKKOCGGCQCOGISKYGUC'],
                    'encodeOffsets': [[
                            -66334,
                            33083
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BOL',
                'properties': { 'name': 'Bolivia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????????????局???汐??????把h?∟??????赤?n?????????????????????????T????走?Z污?a????迂??????????老????a????^??圻?s?????'],
                    'encodeOffsets': [[
                            -64354,
                            -22563
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BRA',
                'properties': { 'name': 'Brazil' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????j?批?快?辛???B???????????????????????????????????豆????????bY汛???????S???巡?????????????????????m???????????v????????忙???A???????????????????p牟????L???邢言????Y??k???‘走??????????????有?????????????????????????????????考?????????抑????尾??辛???????赤???????邑????????缶???????坏???????????????x???????????????宋?????????????????????????忸????????g????????’????????灰???F?????????????????完??????????????肉????????{????'],
                    'encodeOffsets': [[
                            -59008,
                            -30941
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BRN',
                'properties': { 'name': 'Brunei' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????岐﹞?坎?????'],
                    'encodeOffsets': [[
                            116945,
                            4635
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BTN',
                'properties': { 'name': 'Bhutan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????{??????k邢???????q羽?'],
                    'encodeOffsets': [[
                            93898,
                            28439
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'BWA',
                'properties': { 'name': 'Botswana' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@邪???????D??????????????????坐?????∟坎?旬?孚??坐??扭?????邦?????A???|??????????D??????'],
                    'encodeOffsets': [[
                            26265,
                            -18980
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CAF',
                'properties': { 'name': 'Central African Republic' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????g????有??????邦??????攻???????F??忙?????羊??T???戌汍?????‘???p???????}???扶???????走?????????攸迄????????????????????????旨????扯?'],
                    'encodeOffsets': [[
                            15647,
                            7601
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CAN',
                'properties': { 'name': 'Canada' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@???x岐????朴?????妊'],
                        ['@@孚c?????????戍|?'],
                        ['@@抒???????????????????????忱?????'],
                        ['@@??????????????????????早????????里???????????~????竹???????????????'],
                        ['@@@@@@@@???????D????折??而????'],
                        ['@@??聿????????k??'],
                        ['@@???n?????Si?'],
                        ['@@?耒?????????????????????????????忱??????'],
                        ['@@???尬朴?????X?????'],
                        ['@@???????????汎????????'],
                        ['@@G?????????????∼????迂?抄?戒?????孝???????批???羊?????曲??????????㊣????????迅?汍???????旬??????????????????????????????????糸???????????????????}??????????????????????????????????????????????????P?????肋?????????????局??杓????扭????????????????????????????B?????????????朽??????A?M?????????B?G??????e??抖?????@????n???????????????迂??@?????言???????????????????S???????????????IE??B?A?@?@?@?@?@?@?@?@?F???汛???????朵????i??妞w????????????????????羽???|J?N????妨???戌?????而???式?????????????????﹞?托???????改?戒?????????抆?朴?????????????????o??????K????u?????????????聿???尿??'],
                        ['@@扶????投??????扳弛?????????????快???考?????????????????芋?????????????????????j?????[??????????'],
                        ['@@??????????'],
                        ['@@???|?j????????妒??豆??'],
                        ['@@???????????????抑???糸?????????????????????????????????????????????????????????孛?????妥`????????d?????抉???????妓?????????????????????????H‘?????????'],
                        ['@@???里???圻?汐?????那????j??????妓'],
                        ['@@??????`抗?朵??????????'],
                        ['@@?妨?????有???????????㊣???早??????@糸'],
                        ['@@?????????????’'],
                        ['@@??????????j????????????'],
                        ['@@???????宏?????灰?m????Ｎ?????????????????????'],
                        ['@@???F???????????????????????????????c???????忪?缶????????'],
                        ['@@????????????@@?????[??'],
                        ['@@?y??阱??]????'],
                        ['@@????????????'],
                        ['@@???Bb???????'],
                        ['@@??????芍?????????'],
                        ['@@?戎??????????????????'],
                        ['@@????????????^????O??????????羊??“????????'],
                        ['@@???????阱?灰?????J???????????豆?????忌????????????l????????????夾??忌????污????????????朽???????????????????????????????????????????????']
                    ],
                    'encodeOffsets': [
                        [[
                                -65192,
                                47668
                            ]],
                        [[
                                -63289,
                                50284
                            ]],
                        [[
                                -126474,
                                49675
                            ]],
                        [[
                                -57481,
                                51904
                            ]],
                        [[
                                -135895,
                                55337
                            ]],
                        [[
                                -81168,
                                63651
                            ]],
                        [[
                                -83863,
                                64216
                            ]],
                        [[
                                -87205,
                                67234
                            ]],
                        [[
                                -77686,
                                68761
                            ]],
                        [[
                                -97943,
                                70767
                            ]],
                        [[
                                -92720,
                                71166
                            ]],
                        [[
                                -116907,
                                74877
                            ]],
                        [[
                                -107008,
                                75183
                            ]],
                        [[
                                -78172,
                                74858
                            ]],
                        [[
                                -88639,
                                74914
                            ]],
                        [[
                                -102764,
                                75617
                            ]],
                        [[
                                -95433,
                                74519
                            ]],
                        [[
                                -123351,
                                73097
                            ]],
                        [[
                                -95859,
                                76780
                            ]],
                        [[
                                -100864,
                                78562
                            ]],
                        [[
                                -110808,
                                78031
                            ]],
                        [[
                                -96956,
                                78949
                            ]],
                        [[
                                -118987,
                                79509
                            ]],
                        [[
                                -96092,
                                79381
                            ]],
                        [[
                                -112831,
                                79562
                            ]],
                        [[
                                -112295,
                                80489
                            ]],
                        [[
                                -98130,
                                79931
                            ]],
                        [[
                                -102461,
                                80205
                            ]],
                        [[
                                -89108,
                                81572
                            ]],
                        [[
                                -70144,
                                85101
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'CHE',
                'properties': { 'name': 'Switzerland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????w芍?聿??????????妣?汐???坎?^??????????M????'],
                    'encodeOffsets': [[
                            9825,
                            48666
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CHL',
                'properties': { 'name': 'Chile' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@B??@?w????尿???????????????????????????'],
                        ['@@?????????忍????????????????????C???p???F??????????????????托????糸????????抑’??耒??????g?弛??????P妨?????曳o????@@??????抒???朴???????????????????????????谷?旭?????有???????????????????????屁????曲????']
                    ],
                    'encodeOffsets': [
                        [[
                                -70281,
                                -53899
                            ]],
                        [[
                                -69857,
                                -22010
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'CHN',
                'properties': { 'name': 'China' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        [
                            '@@????????????????',
                            '@@?妝??y?忘????o??考考??'
                        ],
                        ['@@???????C?????????????????????wL攸?????汐?????????????????????????????????????????????????u???????批??????????_????????????‾?????????????????抄?扼?????﹞????????????????妨????貝?J???迂???x‾?}???汍??????見??????????{?糸????????收???早????????羊??r???????????????而?迅?夾??????式??????????????????????????????????????????走???????????????????????????????????豕???????????灰?????????????n?????????B?????????????????????迄??????????????????????????????孛?????Q而????W????技???v???????汐????']
                    ],
                    'encodeOffsets': [
                        [
                            [
                                124701,
                                24980
                            ],
                            [
                                112988,
                                19127
                            ]
                        ],
                        [[
                                130722,
                                50955
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'CIV',
                'properties': { 'name': 'Ivory Coast' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?U?辛?W???????v????}?曳扛‘??????妍???B?缶????????????邑??迆???O???g??????????????????????旬???牟???'],
                    'encodeOffsets': [[
                            -2924,
                            5115
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CMR',
                'properties': { 'name': 'Cameroon' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?∼???????n??????????X??????R???b?????忖???抆???????????????????????????????T????????米???????抒??????早??????????????????????'],
                    'encodeOffsets': [[
                            13390,
                            2322
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'COD',
                'properties': { 'name': 'Democratic Republic of the Congo' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????㊣???O?????????????????邑??????????????聿??????????足??R???朵???????????邦?q???r????牝t????????????e??Q辰??G???????????????????????\\???h???????米?????????S???????宋????牟????妙??t???????走?????迆????????????????????抉???~???????o????????????????'],
                    'encodeOffsets': [[
                            31574,
                            3594
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'COG',
                'properties': { 'name': 'Republic of the Congo' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????污?????????????妝??????????汎??邑?????缶???????????????㊣﹞???????????s??杗?妣??灰??????完???????T????'],
                    'encodeOffsets': [[
                            13308,
                            -4895
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'COL',
                'properties': { 'name': 'Colombia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??尿????????_???????找??我?旨????????????????妥?????????????T??????f???谷?抓??妍妞?????????扭?????????????????????谷??????????????????????邪?????改抖???????????杓???lZ??言??????K?????o灰??扭??p????????????????????阱芋'],
                    'encodeOffsets': [[
                            -77182,
                            -155
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CRI',
                'properties': { 'name': 'Costa Rica' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????迅????????????????L????????防????杓谷???????????次??L???????????'],
                    'encodeOffsets': [[
                            -84956,
                            8423
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CUB',
                'properties': { 'name': 'Cuba' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???W?????????????\\?????????????????????????????????????走???“???[??快??????????見????'],
                    'encodeOffsets': [[
                            -84242,
                            23746
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '-99',
                'properties': { 'name': 'Northern Cyprus' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?J???Y???朱???????j??i????V????'],
                    'encodeOffsets': [[
                            33518,
                            35984
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CYP',
                'properties': { 'name': 'Cyprus' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????宏??????????U??j????i????'],
                    'encodeOffsets': [[
                            34789,
                            35900
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CZE',
                'properties': { 'name': 'Czech Republic' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??壯??????????????旭???????見???貝???????????????????岐?C????????w??言?b??'],
                    'encodeOffsets': [[
                            17368,
                            49764
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'DEU',
                'properties': { 'name': 'Germany' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@d???S????????杗?忸?????????????????????????旬??????????????圻~??????抑??㊣?????N里?抆??????????????@??????走??∼???志?????身??'],
                    'encodeOffsets': [[
                            10161,
                            56303
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'DJI',
                'properties': { 'name': 'Djibouti' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??式???????????b_???????????'],
                    'encodeOffsets': [[
                            44116,
                            13005
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'DNK',
                'properties': { 'name': 'Denmark' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?????弛???批'],
                        ['@@???????孚??????}??????????????步????']
                    ],
                    'encodeOffsets': [
                        [[
                                12995,
                                56945
                            ]],
                        [[
                                11175,
                                57814
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'DOM',
                'properties': { 'name': 'Dominican Republic' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???I???t???h????尾?????????????????????∫?j???????車?'],
                    'encodeOffsets': [[
                            -73433,
                            20188
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'DZA',
                'properties': { 'name': 'Algeria' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????U?????????????f?@?Q????????找?????辰??????????????????????????扮????P????????????????R???????∼???????辰??戍????????????'],
                    'encodeOffsets': [[
                            12288,
                            24035
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ECU',
                'properties': { 'name': 'Ecuador' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???缶???????????????????????`??????尾?????????????????扣抓???芍w????忖'],
                    'encodeOffsets': [[
                            -82229,
                            -3486
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'EGY',
                'properties': { 'name': 'Egypt' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????????迄?????????????????????@?@?@@?@????????夾?b???????杓???那???快??????忘???'],
                    'encodeOffsets': [[
                            35761,
                            30210
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ERI',
                'properties': { 'name': 'Eritrea' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????X????????????汕???????抆??????孝????????忘????辰'],
                    'encodeOffsets': [[
                            43368,
                            12844
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ESP',
                'properties': { 'name': 'Spain' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???牟?????N???????????????????????????????????????_?h????宏那??????谷???????????汛豕????Z????扳?????C?屁?迂??'],
                    'encodeOffsets': [[
                            -9251,
                            42886
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'EST',
                'properties': { 'name': 'Estonia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????????|???????‘?D??老???'],
                    'encodeOffsets': [[
                            24897,
                            59181
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ETH',
                'properties': { 'name': 'Ethiopia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????W???????????肋??角?`??a?????????妨?????N???????e???B???扣?忙?角???w’T???@??@?????????改孛?????r??[??????????我????????'],
                    'encodeOffsets': [[
                            38816,
                            15319
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'FIN',
                'properties': { 'name': 'Finland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@迂??????????????????????芍??????????妊?均???????言?????u????尬??????????屁?????曲?'],
                    'encodeOffsets': [[
                            29279,
                            70723
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'FJI',
                'properties': { 'name': 'Fiji' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?????????而??????'],
                        ['@@????抉?杓∼??@完??'],
                        ['@@谷?@宋???妝']
                    ],
                    'encodeOffsets': [
                        [[
                                182655,
                                -17756
                            ]],
                        [[
                                183669,
                                -17204
                            ]],
                        [[
                                -184235,
                                -16897
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'FLK',
                'properties': { 'name': 'Falkland Islands' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????????扭?'],
                    'encodeOffsets': [[
                            -62668,
                            -53094
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'FRA',
                'properties': { 'name': 'France' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??????邪?????'],
                        ['@@???角?????j????抑??????邦????]?圾??老???????????灰?????????????????????????攻????????’????????????_??']
                    ],
                    'encodeOffsets': [
                        [[
                                9790,
                                43165
                            ]],
                        [[
                                3675,
                                51589
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'GAB',
                'properties': { 'name': 'Gabon' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????邪????SO??????防???糸???豕??汍????????????妒??????????'],
                    'encodeOffsets': [[
                            11361,
                            -4074
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GBR',
                'properties': { 'name': 'United Kingdom' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?????[????????'],
                        ['@@?????I???????????????????????????R???辛???????邑????OB???????????‾D@????_\\??????????﹞?投??????芍?足']
                    ],
                    'encodeOffsets': [
                        [[
                                -5797,
                                55864
                            ]],
                        [[
                                -3077,
                                60043
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'GEO',
                'properties': { 'name': 'Georgia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????????????圻????????????志????????????尾??'],
                    'encodeOffsets': [[
                            42552,
                            42533
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GHA',
                'properties': { 'name': 'Ghana' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????灰???旭?????r????????芍??戌?C????????抄????'],
                    'encodeOffsets': [[
                            1086,
                            6072
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GIN',
                'properties': { 'name': 'Guinea' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?t???J????戍????m??V??????收???D???o??貝??考老??????巡??迂????孛?e???D??????d?妙U???l???芍?????B??????????????邢u?????扣???步??????????????????????﹞糸?A'],
                    'encodeOffsets': [[
                            -8641,
                            7871
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GMB',
                'properties': { 'name': 'Gambia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???z??杓`???I????汍?牝d?????Q???l'],
                    'encodeOffsets': [[
                            -17245,
                            13468
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GNB',
                'properties': { 'name': 'Guinea Bissau' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?成早???L?????????????c??????身?C???f?孚'],
                    'encodeOffsets': [[
                            -15493,
                            11306
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GNQ',
                'properties': { 'name': 'Equatorial Guinea' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????mP??T??'],
                    'encodeOffsets': [[
                            9721,
                            1035
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GRC',
                'properties': { 'name': 'Greece' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??????q??????赤T??見?朴'],
                        ['@@?????|??????攸??A??????把壯????忪?^??????????Y?米???????????妥????j??????g?????{??????V技孛?']
                    ],
                    'encodeOffsets': [
                        [[
                                24269,
                                36562
                            ]],
                        [[
                                27243,
                                42560
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'GRL',
                'properties': { 'name': 'Greenland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????????扮??????????????????????????????????????’?????????????????E??\\????????????????????????????????I??????????????[?抑??????????????L??????改??????????????成???????????????\\????????????????????X扛???????℅???????????????妒?妒??????????忙??????R???????芍?步????'],
                    'encodeOffsets': [[
                            -47886,
                            84612
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GTM',
                'properties': { 'name': 'Guatemala' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???f?巡??r?????妞??Ft??????????DB??B?UO????@??辰?????????????????????}?'],
                    'encodeOffsets': [[
                            -92257,
                            14065
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GUF',
                'properties': { 'name': 'French Guiana' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??坐???????糸???辰?????芍???????????????'],
                    'encodeOffsets': [[
                            -53817,
                            2565
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'GUY',
                'properties': { 'name': 'Guyana' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????z??o?完??????∼??????A????????步阱??????尿??????抆?????????而????????i???????????'],
                    'encodeOffsets': [[
                            -61192,
                            8568
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'HND',
                'properties': { 'name': 'Honduras' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???辰??????考??????邢?足??芍辛???????????\\?????迄?v?????????n巡辰???k?????????j?????A???????{???Ra????????????P?ql尿迂Q????'],
                    'encodeOffsets': [[
                            -89412,
                            13297
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'HRV',
                'properties': { 'name': 'Croatia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??杓??????[???m?????式尬????????戍???????????????旨e????污??n??b???????gG???????杓???????'],
                    'encodeOffsets': [[
                            19282,
                            47011
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'HTI',
                'properties': { 'name': 'Haiti' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????i????????????????????牟P?????'],
                    'encodeOffsets': [[
                            -74946,
                            20394
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'HUN',
                'properties': { 'name': 'Hungary' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????D?????????邢?~孛???????????????????????????????????‘????V'],
                    'encodeOffsets': [[
                            16592,
                            47977
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'IDN',
                'properties': { 'name': 'Indonesia' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@托e???辛??????'],
                        ['@@????????????f???'],
                        ['@@???豕?朽?????P???P??'],
                        ['@@迂?????E?????????'],
                        ['@@?????妝???????????w????????忙??????????﹞??弛???'],
                        ['@@??????????C?'],
                        ['@@??????????'],
                        ['@@?????足??????????'],
                        ['@@?????????B??????b?b????邪???}朴?????圻????那???孝?車??G百?尾???g???D????曲忱????????'],
                        ['@@?????走??????????????竹?牝?????????Q?????妙?????????????????????????托P??????扳???????????????'],
                        ['@@??????????????邢??????車??'],
                        ['@@??????????u???????????抖????妍??????扶?圻????????????????抓夾????????????@????????'],
                        ['@@?k????????戒?????????????????車??????????忙???_???????????s??????孜?????']
                    ],
                    'encodeOffsets': [
                        [[
                                123613,
                                -10485
                            ]],
                        [[
                                127423,
                                -10383
                            ]],
                        [[
                                120730,
                                -8289
                            ]],
                        [[
                                125854,
                                -8288
                            ]],
                        [[
                                111231,
                                -6940
                            ]],
                        [[
                                137959,
                                -6363
                            ]],
                        [[
                                130304,
                                -3542
                            ]],
                        [[
                                133603,
                                -3168
                            ]],
                        [[
                                137363,
                                -1179
                            ]],
                        [[
                                128247,
                                1454
                            ]],
                        [[
                                131777,
                                1160
                            ]],
                        [[
                                120705,
                                1872
                            ]],
                        [[
                                108358,
                                -5992
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'IND',
                'properties': { 'name': 'India' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????????????????尿?????忸?芋???b?????汕??足?l????????|?????????????旨???托??????豕?????~???∫孚?????????曳忍????E?????????????]??車?坎∟?汎???????????????????Z??????????????C?抖???????????曳?I?????????????????????????????式???H?????????妒????????C???攻??????????????_????忱????屁汕??????'],
                    'encodeOffsets': [[
                            79706,
                            36346
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'IRL',
                'properties': { 'name': 'Ireland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????????????????\\??'],
                    'encodeOffsets': [[
                            -6346,
                            55161
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'IRN',
                'properties': { 'name': 'Iran' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????{而????改??????辰?????百?????角???????忪????耒x?坏?那???????????朱?圻????妖??????????????????S??@??????????扯?????????走???????抓????~???????忍?????????批??????'],
                    'encodeOffsets': [[
                            55216,
                            38092
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'IRQ',
                'properties': { 'name': 'Iraq' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????抒????????????@T????∟?那????????????????芋???????????夾???'],
                    'encodeOffsets': [[
                            46511,
                            36842
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ISL',
                'properties': { 'name': 'Iceland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????????肉?尬?見??????????????????'],
                    'encodeOffsets': [[
                            -14856,
                            68051
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ISR',
                'properties': { 'name': 'Israel' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????p?扶?????????????zV?C???\\`???hM'],
                    'encodeOffsets': [[
                            36578,
                            33495
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ITA',
                'properties': { 'name': 'Italy' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????????忸??????????辰'],
                        ['@@????????????????把?'],
                        ['@@???岐?朱?????戒???忸?折扯????L??????????????????早?????戍???戎?H????????扮式??汛??汍???????????抄???????忙??牟?里????????汕?妙?????均?????肉???????????']
                    ],
                    'encodeOffsets': [
                        [[
                                15893,
                                39149
                            ]],
                        [[
                                9432,
                                42200
                            ]],
                        [[
                                12674,
                                47890
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'JAM',
                'properties': { 'name': 'Jamaica' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?‾?????e????????收???'],
                    'encodeOffsets': [[
                            -79431,
                            18935
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'JOR',
                'properties': { 'name': 'Jordan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????批??????????汍?????抉?o???@?'],
                    'encodeOffsets': [[
                            36399,
                            33172
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'JPN',
                'properties': { 'name': 'Japan' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????????????R????貝?收??'],
                        ['@@???扼?????????????????e?????早妖??????????????????????坎??????????????}???b?'],
                        ['@@???有???????????]??忱???????????']
                    ],
                    'encodeOffsets': [
                        [[
                                137870,
                                34969
                            ]],
                        [[
                                144360,
                                38034
                            ]],
                        [[
                                147365,
                                45235
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'KAZ',
                'properties': { 'name': 'Kazakhstan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????羊??K??????孚N????????????????????????????聿?㊣??戌???????????芋???????????????考??攸??????w???????????????t?????旭?j???????????孛??????????宋????弛????????谷???????????????????妞???朵朽????????????????????????????批????x???旨?????????老'],
                    'encodeOffsets': [[
                            72666,
                            43281
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'KEN',
                'properties': { 'name': 'Kenya' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????戎??????????????????S???忘???考??找????????@????@???S?x?貝???忖?扛???A??X?'],
                    'encodeOffsets': [[
                            41977,
                            -878
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'KGZ',
                'properties': { 'name': 'Kyrgyzstan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????早???w??扳??迂??????????????????????????????????????????????'],
                    'encodeOffsets': [[
                            72666,
                            43281
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'KHM',
                'properties': { 'name': 'Cambodia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??抑?????????????????????而???????'],
                    'encodeOffsets': [[
                            105982,
                            10888
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'KOR',
                'properties': { 'name': 'South Korea' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????P?????????????聿??????迆??????朵???'],
                    'encodeOffsets': [[
                            131431,
                            39539
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'CS-KM',
                'properties': { 'name': 'Kosovo' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???P??????????????????????見??L?????℅????'],
                    'encodeOffsets': [[
                            21261,
                            43062
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'KWT',
                'properties': { 'name': 'Kuwait' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?聿?????u?均?????谷'],
                    'encodeOffsets': [[
                            49126,
                            30696
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LAO',
                'properties': { 'name': 'Laos' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????????y????o???????灰????????w?????????O????????????????????????'],
                    'encodeOffsets': [[
                            107745,
                            14616
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LBN',
                'properties': { 'name': 'Lebanon' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?[???D??技?f??∫??????'],
                    'encodeOffsets': [[
                            36681,
                            34077
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LBR',
                'properties': { 'name': 'Liberia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?Q?均???????????????n??成???走??I???s???妖????杓?有扣~?????'],
                    'encodeOffsets': [[
                            -7897,
                            4470
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LBY',
                'properties': { 'name': 'Libya' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????汕老????????????成??里?????????宋??旭?弛????孛?????收??????????扣?抄孛?夾????孜?????????I???????圻??????@?@?@??GY扣??????'],
                    'encodeOffsets': [[
                            15208,
                            23412
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LKA',
                'properties': { 'name': 'Sri Lanka' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??扣?????????????妍?'],
                    'encodeOffsets': [[
                            83751,
                            7704
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LSO',
                'properties': { 'name': 'Lesotho' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???孝????????????????缶?'],
                    'encodeOffsets': [[
                            29674,
                            -29650
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LTU',
                'properties': { 'name': 'Lithuania' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????聿????????????????妊?????????N????'],
                    'encodeOffsets': [[
                            23277,
                            55632
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LUX',
                'properties': { 'name': 'Luxembourg' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@邑??老?i?辰????'],
                    'encodeOffsets': [[
                            6189,
                            51332
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'LVA',
                'properties': { 'name': 'Latvia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??尾??????h?????????C妞??妊???????妥??????????'],
                    'encodeOffsets': [[
                            21562,
                            57376
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MAR',
                'properties': { 'name': 'Morocco' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?朽????百U?????????????????????扼??????R??@@@p??????@???豆????壯???????????aD????????????????p???????f\\扯?????找????????????????????I'],
                    'encodeOffsets': [[
                            -5318,
                            36614
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MDA',
                'properties': { 'name': 'Moldova' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????????戍???????℅?|???????????????????‘旭????'],
                    'encodeOffsets': [[
                            27259,
                            49379
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MDG',
                'properties': { 'name': 'Madagascar' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?朽???????妝?????????朽??????忌??????????曲??????????迄?????D?坏?????????????技?????而\\?????扯??朴???f?????'],
                    'encodeOffsets': [[
                            50733,
                            -12769
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MEX',
                'properties': { 'name': 'Mexico' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????完???完邢??????忌???扣????????????豕??????????????妨???????污?????c?Y??????P??V?AA??C????????s??E妨?????q???????????折????????????圾??????忙???扼??孛??????J???迄??抓????孝??????????孜???????孜??????^??????????圻?????????????\\邪??????忸???老????妞?????q?早??J?????妓?????????????????????????????????????????????妊???P?@D??@???’?考???????????h??扳??????????????|'],
                    'encodeOffsets': [[
                            -99471,
                            26491
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MKD',
                'properties': { 'name': 'Macedonia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@里O?????????b找????????h????式???里?'],
                    'encodeOffsets': [[
                            21085,
                            42860
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MLI',
                'properties': { 'name': 'Mali' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????杓p???巡?????^????妣?妣??d??????????V???F???赤??????????I?????式??????扣?妖???迂???p??曳???????????h???P???迄?????????????扛?????v???????????????A????赤???????'],
                    'encodeOffsets': [[
                            -12462,
                            14968
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MMR',
                'properties': { 'name': 'Myanmar' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?灰????旬?妍??????????批????_?????妊???????????????汍??批??????????????????????j?忱??有????????“孛??}???????????????缶?|?????????????????汎???~???????'],
                    'encodeOffsets': [[
                            101933,
                            20672
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MNE',
                'properties': { 'name': 'Montenegro' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??灰岐?杗????汍巡???????邦?????豆???????車'],
                    'encodeOffsets': [[
                            20277,
                            43521
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MNG',
                'properties': { 'name': 'Mongolia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????]?????????????????????托?????身?妝???T?????????????那孚??????里?????????????????????????迆?????????????????????A?????????m?????????????牟??????????'],
                    'encodeOffsets': [[
                            89858,
                            50481
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MOZ',
                'properties': { 'name': 'Mozambique' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????里?t???a?????????????局?????????妊????????赤???迅?Z???{??????忙戍?????老??旬??赤??R????赤?????坐??????迆??????走?E??????????g??芋????圻?邦????????????汎?赤?扣????]????'],
                    'encodeOffsets': [[
                            35390,
                            -11796
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MRT',
                'properties': { 'name': 'Mauritania' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????坐??U完?抄??????忘?????抗?技酉??汛???M??????????F????c妙?妙??????]????????‘o????'],
                    'encodeOffsets': [[
                            -12462,
                            14968
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MWI',
                'properties': { 'name': 'Malawi' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????^??扛???汍?????℅???﹞??????夾????????邢?????????邪?????'],
                    'encodeOffsets': [[
                            35390,
                            -11796
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'MYS',
                'properties': { 'name': 'Malaysia' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@角?????????收?????????????e??????????????????有???老'],
                        ['@@?????@??????????圻車?投????????????邪???????屁?????圾???忘??扮??H?抑?牝?????????完']
                    ],
                    'encodeOffsets': [
                        [[
                                103502,
                                6354
                            ]],
                        [[
                                121466,
                                4586
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'NAM',
                'properties': { 'name': 'Namibia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????m???????????????妞????}???????圻??????????P谷???C????????{???B?A?????????????坐忍'],
                    'encodeOffsets': [[
                            16738,
                            -29262
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'NCL',
                'properties': { 'name': 'New Caledonia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????????汕[??耳???'],
                    'encodeOffsets': [[
                            169759,
                            -21585
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'NER',
                'properties': { 'name': 'Niger' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n???妍?????妥????????????E????????汐????????`杗忖?????????污?忖?C??m?????杗?m?????????????~?朱?q?????b?????????????????E??'],
                    'encodeOffsets': [[
                            2207,
                            12227
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'NGA',
                'properties': { 'name': 'Nigeria' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????l???????Y?B??s?????妥???迅????????????????????a?????r?朵?}???﹞?????????n???????????????????抑???忙?????a???Q????'],
                    'encodeOffsets': [[
                            8705,
                            4887
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'NIC',
                'properties': { 'name': 'Nicaragua' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????旬?扼????????????Rk尾?r?O??????????b??Q防??|??邢??里?B?????i??∫?????豆??耒??t???????????????????‘那??????'],
                    'encodeOffsets': [[
                            -87769,
                            11355
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'NLD',
                'properties': { 'name': 'Netherlands' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?y???????@?????羽?????????成'],
                    'encodeOffsets': [[
                            6220,
                            54795
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'NOR',
                'properties': { 'name': 'Norway' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????????????????局??肋??????????迂??????H???????????b?????改????耒???????????’????????????????羽???????邑'],
                        ['@@?????????邢????'],
                        ['@@???????????????????????????\\??????'],
                        ['@@???????????d??????????']
                    ],
                    'encodeOffsets': [
                        [[
                                28842,
                                72894
                            ]],
                        [[
                                25318,
                                79723
                            ]],
                        [[
                                18690,
                                81615
                            ]],
                        [[
                                26059,
                                82338
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'NPL',
                'properties': { 'name': 'Nepal' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?汐?????a???????????尾??????弛????????圻???考????'],
                    'encodeOffsets': [[
                            90236,
                            28546
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'NZL',
                'properties': { 'name': 'New Zealand' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?????曲B早???????妝?Y????????扶??l???????????????????????????朱'],
                        ['@@??l???????????攻??????j阱??汐迂???戒?????戎???????z?????????v?坎???戍??角???酉??']
                    ],
                    'encodeOffsets': [
                        [[
                                177173,
                                -41901
                            ]],
                        [[
                                178803,
                                -37024
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'OMN',
                'properties': { 'name': 'Oman' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@???????改?????F???孚???P??J?妤?????????????????v???F??辛??豕??H??????????????C?????旬?'],
                        ['@@????????芋?']
                    ],
                    'encodeOffsets': [
                        [[
                                60274,
                                21621
                            ]],
                        [[
                                57745,
                                26518
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'PAK',
                'properties': { 'name': 'Pakistan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????局汐?????忍??`????????????????改邑??D???????????e??????谷?坐?w??耳??快??????????車?忖?????C????????㊣?朴??????????技收?技?有?米????????'],
                    'encodeOffsets': [[
                            76962,
                            38025
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'PAN',
                'properties': { 'name': 'Panama' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????抖?羊?????????圾????????????????????C????巡足???????K?????i???????尾?朵??????﹞???????????迂???????妊'],
                    'encodeOffsets': [[
                            -79750,
                            7398
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'PER',
                'properties': { 'name': 'Peru' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????????????????????????妤??????忙??x?????扛投?????????????????????????????????????o把?????????????????B曲??忖??????????u??????????????g??扭????汕???'],
                    'encodeOffsets': [[
                            -71260,
                            -18001
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'PHL',
                'properties': { 'name': 'Philippines' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?????????改?????????????式???????????????????v﹞???那抒??'],
                        ['@@????????????????????芋?'],
                        ['@@??屁?????????????'],
                        ['@@???Bg戍?曳???????均'],
                        ['@@????j?????????????Y????m??'],
                        ['@@???抉??????'],
                        ['@@????邦??式????????????????????言??尾????????抖?“???????忌??米?????????A']
                    ],
                    'encodeOffsets': [
                        [[
                                129410,
                                8617
                            ]],
                        [[
                                126959,
                                10526
                            ]],
                        [[
                                121349,
                                9540
                            ]],
                        [[
                                124809,
                                12178
                            ]],
                        [[
                                128515,
                                12455
                            ]],
                        [[
                                124445,
                                13384
                            ]],
                        [[
                                124234,
                                18949
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'PNG',
                'properties': { 'name': 'Papua New Guinea' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??汍?老?????????妓?????'],
                        ['@@?????????B????那????角?夾?r???????????f邪?g???'],
                        ['@@???????肋?????早?????????????????羽????里???????a?a????????抒???????豆??'],
                        ['@@?阱????????????????收??托????']
                    ],
                    'encodeOffsets': [
                        [[
                                159622,
                                -6983
                            ]],
                        [[
                                155631,
                                -5609
                            ]],
                        [[
                                150725,
                                -7565
                            ]],
                        [[
                                156816,
                                -4607
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'POL',
                'properties': { 'name': 'Poland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??角????????????????????Y???^?豆???肋??K?????f?扯?豆?戒???????????????折??????忘???????酉?????辰??'],
                    'encodeOffsets': [[
                            15378,
                            52334
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'PRI',
                'properties': { 'name': 'Puerto Rico' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????L??﹞????K'],
                    'encodeOffsets': [[
                            -67873,
                            18960
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'PRK',
                'properties': { 'name': 'North Korea' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????灰?????????????灰?灰?????考??朱????????迄妊????谷??酉邦???耳?????????????????????????汕????'],
                    'encodeOffsets': [[
                            133776,
                            43413
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'PRT',
                'properties': { 'name': 'Portugal' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????局?D?????批??Y??迂??污???????????那???????????????????????k有????'],
                    'encodeOffsets': [[
                            -9251,
                            42886
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'PRY',
                'properties': { 'name': 'Paraguay' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??t?夾????]??b????????走??????????????A??????????????????肉????????'],
                    'encodeOffsets': [[
                            -64189,
                            -22783
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'QAT',
                'properties': { 'name': 'Qatar' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????d??????巡'],
                    'encodeOffsets': [[
                            52030,
                            25349
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ROU',
                'properties': { 'name': 'Romania' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@汛????G????????旭@????杓旬???老?次????????p?妤???????????戒???????????????????????????????????'],
                    'encodeOffsets': [[
                            23256,
                            49032
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'RUS',
                'properties': { 'name': 'Russia' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????????y?????????????????????????????u???'],
                        ['@@?]???而????肉?????'],
                        ['@@?????????竹?言s????~?????牟?????????????曳@???????'],
                        ['@@?????戌@?'],
                        ['@@??@?防??E??????'],
                        ['@@?M????????????'],
                        ['@@????????????'],
                        ['@@???z????????????'],
                        ['@@?車??????迂????????????????????????????戒????????????'],
                        ['@@?忍???Y?完??????????????????而??????????????L?????扣???????????????????汎???????????????????v?????????????????坎?糸@§MK?考??????????酉?????????????????????????????????????忖汐????????????????妒????????????????????????????????言?????尿??????????忘????抉?????????????????????????Y?孜??????K??x?????????????????????D???????????汕???????u???抖??X?????R考?????谷?????????????S???妒???????收?????????????????????^??????????????朱朴??妨???????????????????那??????????式??完????????????孚???????????i?旬?????s???????????????x??????????????????????肋????????????????夾????????????????????u???????????????W????U??????l辛?牟?∟谷???????????????????????????????????????????????赤妥妨??杓?????????????????????????????????邦?????????????????阱??????????????防妓????????????????????尬?????????N????????均???????????x????????????????????{???????}??????辛???????杗?????????????????忪???????那??????????技n?????????????????????????????x?我???????????a?汛?朵????????'],
                        ['@@????????????'],
                        ['@@?身???????????~???X??????????'],
                        ['@@?????????迅?????折????']
                    ],
                    'encodeOffsets': [
                        [[
                                147096,
                                51966
                            ]],
                        [[
                                23277,
                                55632
                            ]],
                        [[
                                -179214,
                                68183
                            ]],
                        [[
                                184320,
                                72533
                            ]],
                        [[
                                -182982,
                                72595
                            ]],
                        [[
                                147051,
                                74970
                            ]],
                        [[
                                154350,
                                76887
                            ]],
                        [[
                                148569,
                                77377
                            ]],
                        [[
                                58917,
                                72418
                            ]],
                        [[
                                109538,
                                78822
                            ]],
                        [[
                                107598,
                                80187
                            ]],
                        [[
                                52364,
                                82481
                            ]],
                        [[
                                102339,
                                80775
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'RWA',
                'properties': { 'name': 'Rwanda' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????角????????????'],
                    'encodeOffsets': [[
                            31150,
                            -1161
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ESH',
                'properties': { 'name': 'Western Sahara' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@o??@@?e?E??????‾?????N????bC?????????????????????@????'],
                    'encodeOffsets': [[
                            -9005,
                            27772
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SAU',
                'properties': { 'name': 'Saudi Arabia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????????貝???????????∼???????????抖I????????汎????????????扳???????????????v??忘????托???????????????????????投???????????????????∫?????m?迄???尿?旬老杗'],
                    'encodeOffsets': [[
                            43807,
                            16741
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SDN',
                'properties': { 'name': 'Sudan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?hd技????????????????????抖??????????????@?????????????????????????????忖E?????Z???U????????戌??????????????Z扛?H@??@?@?@????????????抑???????汐????????戒????????D?'],
                    'encodeOffsets': [[
                            34779,
                            9692
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SDS',
                'properties': { 'name': 'South Sudan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@X????q????攻孚?????????????F?????????????????????杓????戎汎??S????????????????????赤???????@????????????技?????????????????????c抖?g'],
                    'encodeOffsets': [[
                            34779,
                            9692
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SEN',
                'properties': { 'name': 'Senegal' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??扶?耳?妓?????抗?宋??V坏?????????迅??????????????k??妣V???????????k???R????百c汎??????J??‘_???y'],
                    'encodeOffsets': [[
                            -17114,
                            13922
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SLB',
                'properties': { 'name': 'Solomon Islands' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@???N????邪?'],
                        ['@@?m????????????'],
                        ['@@???????@???妝'],
                        ['@@???朴???????????‘'],
                        ['@@??羊???“??曲??']
                    ],
                    'encodeOffsets': [
                        [[
                                166010,
                                -10734
                            ]],
                        [[
                                164713,
                                -10109
                            ]],
                        [[
                                165561,
                                -9830
                            ]],
                        [[
                                163713,
                                -8537
                            ]],
                        [[
                                161320,
                                -7524
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'SLE',
                'properties': { 'name': 'Sierra Leone' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???????????而?????p???C???托????U???????????'],
                    'encodeOffsets': [[
                            -11713,
                            6949
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SLV',
                'properties': { 'name': 'El Salvador' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???^???邑????~?????????????????而???????'],
                    'encodeOffsets': [[
                            -89900,
                            13706
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '-99',
                'properties': { 'name': 'Somaliland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????M?????妞????????辛??戍抗G??????我?????KaE?A?@?'],
                    'encodeOffsets': [[
                            50113,
                            9679
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SOM',
                'properties': { 'name': 'Somalia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????Fp???H?????妨???????????????????????W??????f??????????@?B?F?Lb?h??'],
                    'encodeOffsets': [[
                            50923,
                            11857
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SRB',
                'properties': { 'name': 'Republic of Serbia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??角???????????????妥污???杗?????a?????????K???????????㊣????豕?????迂???????妣??而?E??‘??????????杗'],
                    'encodeOffsets': [[
                            21376,
                            46507
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SUR',
                'properties': { 'name': 'Suriname' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????????車??托??????????‾??豕??身??B肋?????????'],
                    'encodeOffsets': [[
                            -58518,
                            6117
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SVK',
                'properties': { 'name': 'Slovakia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????扮?????????????????????壯?豆?孚??}??????忸????里???a??x??????????D'],
                    'encodeOffsets': [[
                            19306,
                            50685
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SVN',
                'properties': { 'name': 'Slovenia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??抓??t???U見???????H??h???????迆?朵?忘'],
                    'encodeOffsets': [[
                            14138,
                            47626
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SWE',
                'properties': { 'name': 'Sweden' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????????????????????‘?????耳??????攻?????a???????????G?????????宏??v?????'],
                    'encodeOffsets': [[
                            22716,
                            67302
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SWZ',
                'properties': { 'name': 'Swaziland' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???豆??S???????扮????肋'],
                    'encodeOffsets': [[
                            32842,
                            -27375
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'SYR',
                'properties': { 'name': 'Syria' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????gN??_????????“????????∼????????F???a????????????'],
                    'encodeOffsets': [[
                            39724,
                            34180
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TCD',
                'properties': { 'name': 'Chad' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???nD?忙?汛?????????忙?_???????＃?＃???????????????酉戎??????V???Y???改?????????????曳??????h??????????竹??????????S????????'],
                    'encodeOffsets': [[
                            14844,
                            13169
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TGO',
                'properties': { 'name': 'Togo' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????阱??抗??????D?戎????k???????尿邪?????'],
                    'encodeOffsets': [[
                            1911,
                            6290
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'THA',
                'properties': { 'name': 'Thailand' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???e???K芍???步???????????????????????????忪??妤?????????妥?????`??????扳????????妖?旭??????牟??牟???????p??????z邪???????????步?????????'],
                    'encodeOffsets': [[
                            105047,
                            12480
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TJK',
                'properties': { 'name': 'Tajikistan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????芋??????????????????B??????????????????汐????迂?j???????????????耳?????????????v'],
                    'encodeOffsets': [[
                            72719,
                            41211
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TKM',
                'properties': { 'name': 'Turkmenistan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????攻??考??|??????????????????????????????肉????????∟?\\?扯??????????????忘??????宏??w?????????????????????'],
                    'encodeOffsets': [[
                            62680,
                            36506
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TLS',
                'properties': { 'name': 'East Timor' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????????羊??e??迅'],
                    'encodeOffsets': [[
                            127968,
                            -9106
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TTO',
                'properties': { 'name': 'Trinidad and Tobago' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????迆??i?'],
                    'encodeOffsets': [[
                            -63160,
                            11019
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TUN',
                'properties': { 'name': 'Tunisia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@次???Q???車?????????????}抑????扭局M???身??抒???a??????孚??????式?旬完?'],
                    'encodeOffsets': [[
                            9710,
                            31035
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'TUR',
                'properties': { 'name': 'Turkey' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@???????????尿???孝????????????圻????防?????b???E?????走???????????赤???????????式?????e????孛??圾????收????????l??'],
                        ['@@????\\?????孚????????????㊣次?']
                    ],
                    'encodeOffsets': [
                        [[
                                37800,
                                42328
                            ]],
                        [[
                                27845,
                                41668
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'TZA',
                'properties': { 'name': 'United Republic of Tanzania' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??????????????~??????坐???????????b???s????????????????????戍???????????????????S???﹞??????????[?角'],
                    'encodeOffsets': [[
                            34718,
                            -972
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'UGA',
                'properties': { 'name': 'Uganda' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?\\??????P????????????????????????E?????扼而???岐???T???'],
                    'encodeOffsets': [[
                            32631,
                            -1052
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'UKR',
                'properties': { 'name': 'Ukraine' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????那????灰k????????V?步X???????????????????????尬?????????????????????????????????壯????????????????{?????????成??????????????旬@?????????H??污?????走?????酉???我???抒?坏????n?????i???????????扯????'],
                    'encodeOffsets': [[
                            32549,
                            53353
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'URY',
                'properties': { 'name': 'Uruguay' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????|??????聿???汍????邢?豆??????????S?????'],
                    'encodeOffsets': [[
                            -59008,
                            -30941
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'USA',
                'properties': { 'name': 'United States of America' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@????|????????迅???e????????q?????'],
                        ['@@????貝豕Q????芋????'],
                        ['@@??|??忘?'],
                        ['@@???Z????????那???'],
                        ['@@?????????ij?'],
                        ['@@???????????????T?????????????????見???邪??@?????壯??邢???壯???m言?????@?????技f?‾??辛???H?A???角?????N?B????朴?????????????A??????妤????????S???弛s????????妝h??竹????????????C|?????????℅?????????^??????????????汍????????????????????扶?改?????????????????L汍??????????岐???????????????????????妊?????????????a????身???????????????????污?坎??U?“圻???{????????????批????g???????????而?????@C??@?O???妥?辛????????????????????????????聿?????????????????????’????走???????????@?@?@?@?@?@?@?@?B?AF??J'],
                        ['@@????????????有???'],
                        ['@@?????????迄??'],
                        ['@@????????谷?????????????'],
                        ['@@???????????????芋????????@@M?I??{???老??????????????????x??妨?????????????r?????????赤???朵???????????????????????????妊???戍???肋??????????????????????????志????邢?????????????攻???技???B????????????I??????????????妙???????????W??????????托????成?宋?@?扶???????把?朵?????????孜????????????']
                    ],
                    'encodeOffsets': [
                        [[
                                -159275,
                                19542
                            ]],
                        [[
                                -159825,
                                21140
                            ]],
                        [[
                                -160520,
                                21686
                            ]],
                        [[
                                -161436,
                                21834
                            ]],
                        [[
                                -163169,
                                22510
                            ]],
                        [[
                                -97093,
                                50575
                            ]],
                        [[
                                -156678,
                                58487
                            ]],
                        [[
                                -169553,
                                61348
                            ]],
                        [[
                                -175853,
                                65314
                            ]],
                        [[
                                -158789,
                                72856
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'UZB',
                'properties': { 'name': 'Uzbekistan' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@x????尬????岐???????豆????????抒?[???????????????角????孛M???????L羽????????????????????u??????杗??????耒?????????N'],
                    'encodeOffsets': [[
                            68116,
                            38260
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'VEN',
                'properties': { 'name': 'Venezuela' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@y?????Y?耒???汛?????∫??????????_?????Q????????X????\\?????℅?岐???n????車???????j??????????????????????酉??????∼????曳????????????????攻技??????角????????????????里?????那????芍????????????????把??'],
                    'encodeOffsets': [[
                            -73043,
                            12059
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'VNM',
                'properties': { 'name': 'Vietnam' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????????????????????????????????????考??????????????????????????P???????I????妞?????均???'],
                    'encodeOffsets': [[
                            110644,
                            22070
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'VUT',
                'properties': { 'name': 'Vanuatu' },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?身??????'],
                        ['@@????????i?坏?']
                    ],
                    'encodeOffsets': [
                        [[
                                171874,
                                -16861
                            ]],
                        [[
                                171119,
                                -15292
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'PSE',
                'properties': { 'name': 'West Bank' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@???????????????'],
                    'encodeOffsets': [[
                            36399,
                            33172
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'YEM',
                'properties': { 'name': 'Yemen' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????o??旬????耒㊣???式????????????快l???“??z???????邢∟?????缶???旭?尾???迆?n?????“??????????????'],
                    'encodeOffsets': [[
                            54384,
                            17051
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ZAF',
                'properties': { 'name': 'South Africa' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@??曳攸??????????????????快??????????????o曳??f汐?????L?步???s???抒?AF??坏忱????????????B???????????把????坏孛?旭?圾????????坏???????????U妍?????坏???????折???芋???T????????Q????酉??投',
                        '@@糸??????????????????孜??'
                    ],
                    'encodeOffsets': [
                        [
                            32278,
                            -29959
                        ],
                        [
                            29674,
                            -29650
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': 'ZMB',
                'properties': { 'name': 'Zambia' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????????????????????????????o??????O那?????????????Y赤??????妥???q???r?????????????朱???Q?????????????肉????????成???????'],
                    'encodeOffsets': [[
                            33546,
                            -9452
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': 'ZWE',
                'properties': { 'name': 'Zimbabwe' },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????妖??V??????C??????????????貝?p?????角?????????h????均???F??????????迄????'],
                    'encodeOffsets': [[
                            31941,
                            -22785
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/xiang_gang_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [{
                'type': 'Feature',
                'id': '8100',
                'properties': {
                    'name': '眅誠',
                    'cp': [
                        114.2784,
                        22.3057
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@}ScT?@cWuJ??]?l?RLj?B?角???H@TOHCTDDDHDNAT@PEHDDNJLX@BABALHFF@DKHADBBLDHHFBLEJB@GDBBFBADDB@@KFAFBBJJA@BB@@FFDDADFF@FADDDBJC@AFBD@@DDD@DAA@D@DB@DHHBFJBBFEHDFAN@DGDC@DLCBDDCFDlAFBFCBEF@BC@GDAB@FD@DZJ?X?H?Mja@?`?p_PCZ@lLnRGSDMFK|a\\?Y?}??∫????M?n'],
                    'encodeOffsets': [[
                            117078,
                            22678
                        ]]
                }
            }],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/xin_jiang_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '6528',
                'properties': {
                    'name': '匙秞廖濕蟹嘉赻笥笣',
                    'cp': [
                        88.1653,
                        39.6002
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?@???anw?V?????????身???谷???L?車???a??㊣??Um??m??V???W????谷???????貝?貝@??w???L???V???????V∼w???k∼????@????迅@?????L?車???L?身???車?K@貝@IU???m??????????身@???V?身K??戍????????L???????V@??U?????L???J㊣?X??身l?U????K??∼?X??㊣n??V??車aU??U身????㊣????l?k?∼?k???n??L???U???l?∼@?身?X???V??L??????車∼?J???K???????@?x?U???@ky???`U??V???a???@????車@???J?w?n車??W?????w????????身@車?????????????身豕?X??車@??n?????V???U?????????V???∼?n?V???m???W∟????@∼?XV??豕n??b??????㊣??`?w身???mVV?????車@????@??bX??mV??`?_???b??∼??W???m???k???U??n??V?????∼n?????'],
                    'encodeOffsets': [[
                            86986,
                            44534
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6532',
                'properties': {
                    'name': '睿泬華⑹',
                    'cp': [
                        81.167,
                        36.9855
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???豕??成??bU????身????V???U?????m????@???W????∼???∼車????????n?m?????車U???@㊣w車L?∼?L㊣??V???b?V?????bk??Kl?????@???車K@??a?X???x?????那?K@??a???K???V車a車n?w?車?谷U??b車???l??aU車?KW???V???n??????n??車x?w???∼?w?∼??X???車b㊣?k??J??m??x@???????n?車?n∼?bU?㊣?X????Xmw???z??m?nxmx??m??bn??那U??那?V車?車U?????∼????l??L??n???@?????@??∼V???忪?????'],
                    'encodeOffsets': [[
                            81293,
                            39764
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6522',
                'properties': {
                    'name': '慇躇華⑹',
                    'cp': [
                        93.7793,
                        42.9236
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@Wn???L??????lx?????????豕@???U??里V∼??X??m?b???a?????L????n?????n??a??????∼???la????迅w??l?妍?n?m?????Uw∼WU車????∼?V㊣車??谷?????谷身巡?????w??????V??谷@??L???????K????車K@?@∼身???l???車??lV????∼k???????????m??`@???n?'],
                    'encodeOffsets': [[
                            93387,
                            44539
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6529',
                'properties': {
                    'name': '陝親劼華⑹',
                    'cp': [
                        82.9797,
                        41.0229
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@V??x?????∼n???∼?V??V???????K???V?????豕???W???V???bl???n_V??lm?nV?_???m巡??谷??W∼∼??J?k???w∼∟??lx?z???I??迅U?∼?@????U?nU?????x?_??????∼??am身??U??W@?????X???n???U杗m??????a戍???∼xW?Ux???∟?w???身車???㊣∼?@??????',
                        '@@身?忍w???∼???V???那???l??m??W@????a?x?b???I妍?nI????????'
                    ],
                    'encodeOffsets': [
                        [
                            80022,
                            41294
                        ],
                        [
                            83914,
                            41474
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6543',
                'properties': {
                    'name': '陝毚怍華⑹',
                    'cp': [
                        88.2971,
                        47.0929
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???I????U㊣??k身∼???車???X車??????????@??K?@@?V??把??V???@???車??@?????ml???X?W??????????????V???U?∼∼豕??U???車?V????那?l??∼`n????a????∼㊣k??mm??@∼?????Va??Vm?????b???@????n????U???@?貝?W??巡W???I???L@??X?mm?????k??身@?∼m??'],
                    'encodeOffsets': [[
                            92656,
                            48460
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6531',
                'properties': {
                    'name': '縝妦華⑹',
                    'cp': [
                        77.168,
                        37.8534
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@?@∼??????@??@??@???lV??WV?車?X??那?@????l豕?V@??Ik∼??@???@????@??@??l?_@?????身?@b??n??lV????W???????@???wW車?㊣?z???????I???b??????V?∼xU??∟?_???I@l?X???l?????????_???????????x????VwX??w????????身???快???U???@身????@???m????Kk????????貝???V???U?谷V??谷m??an?㊣?nwmwn????y???l?k?豕?m身??K???K?豕?z????mx???I@????K?∼@???V??@????U???n??????Jm??J??@??xV∼?L????@?m@??車m???????????K?x?w?????L????U???㊣?????@?????@迅?x????',
                        '@@V????∼?U???mk?車??I???b???a㊣???lKU??_m?nw???m@????b?∼㊣????∼??V谷'
                    ],
                    'encodeOffsets': [
                        [
                            76624,
                            39196
                        ],
                        [
                            81507,
                            40877
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6542',
                'properties': {
                    'name': '坢傑華⑹',
                    'cp': [
                        86.6272,
                        45.8514
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        '@@?n?????@????@??身U????扭U??L?K@??@?????????LV????@???nm???n??@n???@?車m車????a?車????身Umx?b???@?bU??X???bV??n?w?∼??V????@kx㊣U???n???K??????U∼?L@∼?xn??????L????????k?????????U??∼??????∼x@∼?????V???L∼??b???車?l?w???V?w?x?????L???@',
                        '@@車K??V????????zXl∼??L???????迅??l??∼????????m??????貝V???∼?@??I????m?n??a?????b??V??w???@U?身a???J????k???l???'
                    ],
                    'encodeOffsets': [
                        [
                            87593,
                            48184
                        ],
                        [
                            86884,
                            45760
                        ]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6523',
                'properties': {
                    'name': '荻憚隙逜赻笥笣',
                    'cp': [
                        89.6814,
                        44.4507
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@?L@?∼???????????W??b????????W?∼?U???V言㊣?@車??????????kw???????K??Xm??投w?∟??@w車?身V???????a㊣???車豕?IV???k∟車??Jmx???U???@????????m???'],
                        ['@@??∼b?????n@∼?里??k???U??K???????∟?@@??L?K@???l???W??V??@??言U???@?????k???V?車?X????K???那?豕?????里']
                    ],
                    'encodeOffsets': [
                        [[
                                90113,
                                46080
                            ]],
                        [[
                                87638,
                                44579
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6530',
                'properties': {
                    'name': '親谻毚劼螞嫌親谻赻笥笣',
                    'cp': [
                        74.6301,
                        39.5233
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????∼UU??㊣??m????身杗身?wU?㊣???∼??@?????`????????身k???W@k?J車??`??V??wU?∼?????∼a???J?????貝?y??X??x???@???????X?貝U??km???@a???貝??@??`?k@????@??@???@???l??J@??Uk??????@?谷W???U?車XU??k?∟?@@?身?車@車??????@@??∟k?????k??KX??w???????IV????U????n????b∼??VV??∼??車∟V?∼?V∼?那?l???U???????VV?巡I?????谷?n?W???a???w㊣貝???∟?????w???U???谷巡?????l?k?∼x∼??x???V??迅??b∼w????∼n???V@∼???豕???b'],
                    'encodeOffsets': [[
                            80269,
                            42396
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6521',
                'properties': {
                    'name': '苂糧楓華⑹',
                    'cp': [
                        89.6375,
                        42.4127
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?K???a??l??@?那∼????????b?車???∟?U??@x??迅?抓x??m???@??_n??身????????l?????U??k??∼?k?????@?@㊣?車???@?????@???∼車l???x?U???????U?∼?K車??x@?身?????車???迅那?∼X???U???杗nn?㊣V?∼?U???b?迅??@??a??'],
                    'encodeOffsets': [[
                            90248,
                            44371
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6540',
                'properties': {
                    'name': '畛營慇�蠵匋婐挋�',
                    'cp': [
                        82.5513,
                        43.5498
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??????m???X∼㊣?@???∼?????W??b???U??mwVU?車?@????n??Jn??????L?車????迅a巡??a???L?x???L???m???Vlw?@??U???∼?巡x?mU??a∼?∼WV??a????m?∼??車???Um????V???l???n???X?????a???`㊣_U㊣?nW??a@??車?????V㊣??J???ykw?????x???l?I??X????那???n???`㊣?k?@?????@?∼x???I??Ux身???迅??lU?'],
                        ['@@??l??????K???????b??V??w???@???J']
                    ],
                    'encodeOffsets': [
                        [[
                                82722,
                                44337
                            ]],
                        [[
                                86817,
                                45456
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '6527',
                'properties': {
                    'name': '痔嫌坢嶺蟹嘉赻笥笣',
                    'cp': [
                        81.8481,
                        44.6979
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?????????K?身??m貝?w@??KV???∼??w?K車??b???b???∼???K????m??Im?????車@??UVnx???V???a?b???∼l?車x???k???y?那?m?xV??????X??成???????∼LX??????b'],
                    'encodeOffsets': [[
                            84555,
                            46311
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6501',
                'properties': {
                    'name': '拫糧躂ょ庈',
                    'cp': [
                        87.9236,
                        43.5883
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??W???U???l????巡@???@?l??XV?????V?k?車??豕k????@??n身???身?????@?㊣?V??nw?I??l???U??J???車?貝?谷車@k?㊣??b??車L???b@??車???a???V???b????'],
                    'encodeOffsets': [[
                            88887,
                            44146
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '6502',
                'properties': {
                    'name': '親嶺鎖甡庈',
                    'cp': [
                        85.2869,
                        45.5054
                    ],
                    'childNum': 2
                },
                'geometry': {
                    'type': 'MultiPolygon',
                    'coordinates': [
                        ['@@??????Va??m??????貝V???∼?@??I????m?n??a???L∼?車K??V????????zXl∼??L???????迅??l??∼'],
                        ['@@?I??@UUw身a???J????k?']
                    ],
                    'encodeOffsets': [
                        [[
                                87424,
                                47245
                            ]],
                        [[
                                86817,
                                45456
                            ]]
                    ]
                }
            },
            {
                'type': 'Feature',
                'id': '659002',
                'properties': {
                    'name': '陝嶺嫌庈',
                    'cp': [
                        81.2769,
                        40.6549
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nI????????身?忍w???∼???V???那???l??m??W@????a?x?b???I妍?'],
                    'encodeOffsets': [[
                            83824,
                            41929
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '659003',
                'properties': {
                    'name': '芞躂戺親庈',
                    'cp': [
                        79.1345,
                        39.8749
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@V谷V????∼?U???mk?車??I???b???a㊣???lKU??_m?nw???m@????b?∼㊣????∼??'],
                    'encodeOffsets': [[
                            81496,
                            40962
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '659004',
                'properties': {
                    'name': '拻模��庈',
                    'cp': [
                        87.5391,
                        44.3024
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????l?U?????U??Wk?@?V里??@里???UX???'],
                    'encodeOffsets': [[
                            89674,
                            45636
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '659001',
                'properties': {
                    'name': '坒碩赽庈',
                    'cp': [
                        86.0229,
                        44.2914
                    ],
                    'childNum': 1
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l???m??@m???n∼?m???@'],
                    'encodeOffsets': [[
                            88178,
                            45529
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/xi_zang_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '5424',
                'properties': {
                    'name': '饒⑻華⑹',
                    'cp': [
                        88.1982,
                        33.3215
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???b???wnx?b?∼?@?????I???J???U???∟迅L???@???bl??L?????∟?L???I???x???????XV????K?????IU???????V??????w????巡x??㊣??aU???U???U身???wW???㊣??車??∼I?㊣m???m???∼Un??????w???w??????????∼車???a?m??@?∼w迅?巡?∼????????????b????∼@?w???J???b??∼那?U??l???V??K??????????U???k?@???k?l???l???V?車?@?∼@????V?????n?U?????m??b??@?∼??b??????kx???Jk??aU??車??k??n??????車??mn?m???@???V????k@?車w?????㊣?L身???V??豕???豕㊣b@???U?車ak?l???@??L@??lU車???a?????L?????@W??x???nW∼??U?????V∼???迅?L????k??????????V?w????身??????m??W??Kk車???W@?㊣k身????b@????a???a???k車??????a?????@????m??x???lV????b???JU??V???W?z身?身??W?n@豕??車Vkw?nk?????????????Ux??n豕㊣b???????w?w?@m??V@??∼???x?a???X????車W@?kxln?xV?車?k???@∼???L??㊣??V???V???????ak???@豕??????∼??L???K???V?????∟??V???U????L@???l??n??U??@????W∼?∼X???@?????????@???W???U?????∼??@??V∼?bU?nzm∟????'],
                    'encodeOffsets': [[
                            88133,
                            36721
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5425',
                'properties': {
                    'name': '陝爵華⑹',
                    'cp': [
                        82.3645,
                        32.7667
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????n?myV??aU??車?@??????V?車?X??車@?????????@???W???X??????@V????mk???@車?K??V???U車?????????U???L?車?K???????身@???l??b???????U???U?身???K∼?@?UK㊣????b身?m????車??車b???車??k貝??車l???K??U???V???n??m??????@???車x?k??U∟?b@????x???Km∼??k?l??Kn?????W???m??∼身U?∟U???∼??K???????????????bm?U??l?Um??l???w???a?n???k@??K??身??n?a???nkml???U???k?????V??車∼L?貝?U?????z㊣K?∟??身∟???U??V??車???w????k∟車???W?????V??V車??????∼k?㊣VU㊣??U????JV???XU?U??l????????w???@???l??車????nU???lx車l????㊣??L???L@???X??U??車a車∟??X???車Lk??????????K???????????Im?∼?n∼??l???n????K????k?l??????I????n?m??ln?車?@?車???????n∼?∼??U??bl?車?@?巡?∼U??∼X???????l??????m?∼?@∟??X??bl??zk???mX???WV?車?n∼l??x?a∼??L???b@?∼X???x???a???∼?@??@豕?????W??k??@V?∼l?k?㊣???U??∼a???b???b???I?l???V?U???b?k??n?mnXb?辰???@????????????'],
                    'encodeOffsets': [[
                            88133,
                            36721
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5423',
                'properties': {
                    'name': '�梲耒繺媋�',
                    'cp': [
                        86.2427,
                        29.5093
                    ],
                    'childNum': 18
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??X?????l??????x????U???∼V∼????㊣???L?y?巡???V車??K車?U?????l???V???k?ln?m???b?m?????L@∼?l???m?b???x∼∟?kn?∼V?kV?n?∼a????????迅?????身L??身?V????V??n???X?????m貝?Lk?l???n??L∼??w∼?@??aV????l?w??@?????∼??nm???U里??V?車??L?豕?k?∼l????????a??????n豕???a????VL??l???U??wkmlw@車?X????∼W???b?w????@??Un??@?x?x?里?????am???Vw????∼???????l??mlx?U∼?@??m?X?????y?X???UV??I???a??U?∼k??迅wn??????@??∼??b???????l??∼b???b??@??a???UU?V??????aV???∼??mn????V??㊣???V???k??身?w@㊣??∼?V???@??a@??L???????a?∟?I??U???身????車k?車?????U???X????k?∼V∼車??豕W???????k???車wm??J???J??身VV??a???@???????_?????Vnx??車n???x???V???V??車???㊣??????L?????????V?nV∟??@∼???∟????m??x車K????U??那V????W???a身?車??l????n???V??????@m????mm??K???b?????b???Lm??x?∼?U???Xk??m??W??K??kn?aV??豕?K?里?Kn???'],
                    'encodeOffsets': [[
                            84117,
                            30927
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5426',
                'properties': {
                    'name': '輿皏華⑹',
                    'cp': [
                        95.4602,
                        29.1138
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?V??V??k@?∼K@???k∟l??bV???@??a??????U?????迅K???????x@??l???Ul??LV????J?∼?n???w?bX那?V??∼??anaU?∼w????W?∼m???am????@???bl??????x??m???????V??身?身n車???貝?IU???∼??L??V???@??b??W??@V??車?K??U??wV??nW??x???l???身?x??@???U????@?∟∼??谷∼k∼l???車@??????kk?車??X????@?車???∼?車w??㊣??JU????w?∼m???㊣akx??n???l??K@??lU??UV??車??m身?V?????W???@?????z????車lm??????U????杗?車??身???b?w?∼??k????nU?????k迅?豕車@??@?身里?y?z?a?∟?I?∟???????∟?b車??車㊣?U?∼∟???Vn??????∼?????z?豕V????????X???∟車w??k???U??z?@?????x@??@?∟?U??U?∼x?U'],
                    'encodeOffsets': [[
                            94737,
                            30809
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5421',
                'properties': {
                    'name': '荻飲華⑹',
                    'cp': [
                        97.0203,
                        30.7068
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??V?m∼????U∼?????@@???U???k???k?l???@?l∼??V?車??????a?????wn?身w@???∼??mV?∼wn??w?w?w@??m??∼w???k??l???∼@???wV車?al@n???n∼@????UX?迅??V???K?????????@l????_m??z巡?l??aU??wV∼?????a?l@???????n??I?x???@????????k?????車??@???V??????m言??????V?∼?V???∼?n???m?????車?U?∼m???@mxU??豕??∼?????U?????@∼?????k?l?那?∟???@?豕V∼??@?㊣∼?w???∟?k???wX??mU??xV????L車?U??@X車???a@???U??∼?K????V??J????m?????U???????n???車w????k?車a???@?∟n??b???nX??????xV?mb?b???∼?UW谷?a?x???m???I??U??Kk∼?V?貝??U∼??@??∼n?m∟?n?????????ml?????V??bl∟?I??lw???????a?貝@???∼an??∼'],
                    'encodeOffsets': [[
                            97302,
                            31917
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5422',
                'properties': {
                    'name': '刓鰍華⑹',
                    'cp': [
                        92.2083,
                        28.3392
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼?U?∼??????L巡??????L???那?@U??U?∼????∼W??m????yV???l????x∼????W??????U????y??車?身?????m??U????V㊣??∼????a∼??????????J???b?y?z??@??㊣?@??l?????V??m??l??車?????????????y???言V???∼?m??V?????a??車????豕??l?k∟?X@`??????身????KU????∟@??l??????車??m車x???V???K@??b@???U?????@??x??l∟'],
                    'encodeOffsets': [[
                            92363,
                            29672
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5401',
                'properties': {
                    'name': '嶺�鑫�',
                    'cp': [
                        91.1865,
                        30.1465
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@???l@∼?X??l??LX?∼∟?n???????????x?U∼???????l??????K??∼車U??㊣迅?V㊣?車X??m???wX貝∼@∼????K????∼b?????U?V?wV?車??V???@@㊣?w?????@??n身???X???∼???VV??@?谷???K???????K車????U?豕m??n??∼?U?∼b????U?V∼∼V'],
                    'encodeOffsets': [[
                            92059,
                            30696
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/yun_nan_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '5308',
                'properties': {
                    'name': 'ぱ媽庈',
                    'cp': [
                        100.7446,
                        23.4229
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@U????a@??????V∼????bl∟k?Vxl?@??∼???@???y?@????@x?xVxU?V??bV???m?????m?XXW?@???m?mXU∼??m??x∼w?@∼?X那??∼?nV∼U?l@k?@V㊣?貝@????????K??@??k@y?a@?nWV??UV??w?m???J?knm@wmkn??X???X??mUU?lUnb??∼?nk??VIn?lIUw∼?n?m?k@@mlanXlanm?k@wVWUw?_@谷?a??nmUa???mX????@@?車Um?????lKnx?????????J∼aV??U??V??b?I@wm?車n?y?L@?Wk??m??`?IWa?K@?mUn?maXm?bmak????????m??mV?K?b?K??WW?X@a?V??kn?LUWV?kX車W@k?a@?車b?U?wmb??UUlaU?U?ma???KXk?m?@kwm???k㊣?bUUVaka????kL@`???a?x?m?????LUW?@?n??UV∼LkL@b∼∼@∟?????n??k?l∼k豕???zV∟??W???nV@???@?Ux'],
                    'encodeOffsets': [[
                            101903,
                            23637
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5325',
                'properties': {
                    'name': '綻碩慇攝逜眝逜赻笥笣',
                    'cp': [
                        103.0408,
                        23.6041
                    ],
                    'childNum': 13
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@∼∼n??V@?∼@??W??n?∟Vbmn???b@那?`VxUX@x?????Unn?W??????@??豕@z??W??那l????KnV???x@bk@@?∼J???bl??nnm∼nl?UkVUUwVm?Kn??nV??xVLX?laX@@xl@Vz??Vm?k@b∼???m?V??`W?X??bUb?bX?∼x@a?VVkn@l?nXUlVx???y?IU?ka?I??@lXx@b?z@??????_V@l?n@???y@al_l`n?m???@k?mXwWK?U???a??@w?mU??KUa?UU??wW?@w??@k??V??mm?VKk?V@@?nw????@k??nllIVlnLVakalknJ??WmnaUaV?VV??n?m?@???U?l?@???V??aXaV?UyVLVk?@nJl?XLl?kxlbla??l@n?VJVk?x?KlkUa?V????U?@?m?@㊣?U車∼?里??mU??@?????@nml@∼???`@w??@???k@??nm??U??I???L???n@b車∼?U???wm????Um??a?????I@ykI?VU??b?I??????車∟mwkL??'],
                    'encodeOffsets': [[
                            104243,
                            23429
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5326',
                'properties': {
                    'name': '恅刓袕逜醮逜赻笥笣',
                    'cp': [
                        104.8865,
                        23.5712
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?w???@??maUm?U?x?@X??b?InlVUVw?JVaU??K∼??xm?XnlKlnna∼@?????wUmnkl@∼???nyn@V?V@Vak??@@k???bmx∼Vnw∼kl??In??VlKl?@?Xa∼??KlV?U@??Jnx?U@??bUKlm@ak_?w?anWUk∼?l??k@Wk@lwU_?@Ual車U???n???kJW??@??mVXx㊣b?K@n?V㊣a@??a???K??WknamKkn??k??aV??V???U???????I@mm??x??W@@`k@車??UU??lm??Wl??w@mmw?mW??U@y㊣U?xmwU??U??????m@k??VU?V∼Vbkl?L?wUlUIm?k@㊣?kbkalwk?WKk?mI?@UlUKVzU∼Wb?bU豕??@?k?V??∼@?n?m???UUU?VbmbXn??mIkllbUbmKUkkJmk??@l????mx@?U@l?ULn∟?nU∟??@l㊣?@xX??xV??VVb?LV??n@x???b∼??V'],
                    'encodeOffsets': [[
                            106504,
                            25037
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5303',
                'properties': {
                    'name': '⑻噪庈',
                    'cp': [
                        103.9417,
                        25.7025
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??lK??U?V??Um???VUnVVU??n????Ln∼∼??J?w?@lb?a??V?XJ∼?W??a?JVkU??a??@?lKn?mWUk?a??@?m㊣@??kkbWWX_W?U??_l?k?m@U?m@?l@IW?n?l@VanV?UV?U?VwVx?K??VmU言?@??n@V??L?w?VVwnVlmkUV??∼ka@k???a?Ul???????X㊣㊣??a@UnVnal車nk@wl?UVmk?J?aW??@?w車VVnnb㊣∼?@車??xXLWx?n@l??n?m?k_k`@b車z??m@k?U@?`??車?@nW?@??XWw?@?y?b??@?lnUb@x?l??k?@??@U??bmy@?kV@b?b??U`lLVx@b?Ll??∟@?∼VV??U@W??Ub?J@nn?@lnnm??xU??UUb?K@??wklkU?VWakn@?lbU@@?ULVxkKUn?∼??@???km??m@kl??@lU?l??@Vl∼w?nn??U?bUx?b??V???U∼?a?nna?V?al@@b'],
                    'encodeOffsets': [[
                            106099,
                            27653
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5323',
                'properties': {
                    'name': '奠倯眝逜赻笥笣',
                    'cp': [
                        101.6016,
                        25.3619
                    ],
                    'childNum': 10
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@m??XU`Wn???@Xl㊣???Uxnbl∼knmKUx???xV?Ux∼?????∼Jln?K???W∼???Vx?JVw?_∼?@UV@@wnymknK?I@????b∼???V??wU??V?∟nL?k?J?w??∼?l?????V?UU@?@?∼???X?l@U?∼??@U???@w㊣?Vm?UUlm@m???nIVyUwmak?Vwm㊣?@?w@n?@Uxkwl?nL?mk??@㊣?k?ka@k車JV???U?lw??Xalbl??UX?@a??Ua?L@?VIV?kaU?mm?akLWkUJ?Umxn??@?kUx?x??mW?貝?kkb???bkxWmXwWk?w?Kk??L?∟?里??@∟車?U??@@l?k?VmU??@xV@k∼l∼kbU?∼nm?VnU?@∼???UV豕???bU??nU??V??l??@Vl'],
                    'encodeOffsets': [[
                            103433,
                            26196
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5329',
                'properties': {
                    'name': '湮燴啞逜赻笥笣',
                    'cp': [
                        99.9536,
                        25.6805
                    ],
                    'childNum': 12
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lb?KVIUa?@?m@b?x???xXLmbn?l@???K∼???k?U??x?lV?nJ?U???n?m?@?x???w?bX??????LU?Vw?K@wlm?aVw?@Wknm?IUml?nJla@_?@k?mKUa??m?Xw∼aUaV?l??JV??b?Jk????VVk?m?bVwU車?w??VwnLlmk?maVw????Wk?@??XmV_?Wn?Uk?@k車???UV??mV??a??U??V??@?V?Umn??mV?lak?l?U@@w??W谷???@?x?w???J?a??U?mLU∟?b???b?L?WUwmIUVW?kb?`U?Vb?L㊣??k???Kkw?K?那?U?????V??VbU?∼KV?k???mI??mV@k?m?Uk?Vxm??KX??JU?V∼ULWx?L@m???b@bkx㊣LnVU?VLnk?WnwlL??mW@kkJU_?V??W???'],
                    'encodeOffsets': [[
                            101408,
                            26770
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5309',
                'properties': {
                    'name': '還終庈',
                    'cp': [
                        99.613,
                        24.0546
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?x??l`?X∼?V??x@x∼?∼KXa??U??W?bnIl`X?∼b?xl∼???V@xVxk?mb?l@x?XV??zX∟????k?∼?kx@l?那laX?VUnJVx?X?K?a???aV?nKV?∼??b∼I∼?n???V?nWn???@?X?WWn???身?n???U??aU?V?Uw?w@w∼?車??@?z??㊣@????@?k?Uwl?k?㊣a?????U??㊣㊣@??b車㊣V??@車∟?w?I@m??車m㊣?X??I車l?K@??∼Ullb?zkKlln@@????UmVk????x??UV車L?b??m?n?mbnl?a?x@z?@????k?'],
                    'encodeOffsets': [[
                            101251,
                            24734
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5334',
                'properties': {
                    'name': '舜④紲逜赻笥笣',
                    'cp': [
                        99.4592,
                        27.9327
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@W?Xw??@akk@y??k?∼貝X??U車??w@?n?UaVaU?????m?V?k?????@n?x??m?V???@x??@?k??wm??a@?Ua????V??yV??a@???n??Vmank?mm????@n?㊣??z?mU??Vm?n?mbn?@∼nV@xmz?@m?V?k∼ln?∟?????n@xk??IUxU?@???V?mVkmkXW∟XzVx@??x?????b@lV?????V?m?X?m?V????@????V車n??Kn??KX??x@豕??㊣?X??a?xnlV@U?l?k?V???m???m?????m∼??m?X∟mzn???V??VVb∼bn?Wbn?∼l@?V??@??V??㊣@車?Inx?w??@???W???U?UK??k?㊣akkkbmWm????a??U????W@wmknmU?'],
                    'encodeOffsets': [[
                            102702,
                            28401
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5306',
                'properties': {
                    'name': '桻籵庈',
                    'cp': [
                        104.0955,
                        27.6031
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@m?nK@wm?U???m?車X??mX@??V??mL@x???nk@mlU?????@??L@mmLkm??@b?X??W?ka?l???a?????_@m?@@a?@UklwUm@ak@?b?Umb?m?bV???U????aVw?a?Vm??m?xUk?@k?V?UX?∟V?m`@??里??@?kn??k????????U?V???I@?Ux??n?l@??nxU?∼?Vb?WUnW??Iml@xn?Ub?∟???xlI???KV??@???Jk?U?㊣?Vb@n??V?VUV??L?w?l?kn??@nx∼????mUw?@m??m?Ul?U???Um?Lll?Il㊣?@V?kw?W@w∼@U??kU?車I∼??????L???`nU??lm?b?V@n?JUx??X?l@????U?V??@lV?KV???V?Ua?U??nW@?VU@車??'],
                    'encodeOffsets': [[
                            107787,
                            28244
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5301',
                'properties': {
                    'name': '壎隴庈',
                    'cp': [
                        102.9199,
                        25.4663
                    ],
                    'childNum': 11
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@n@Vk?VUn?∼@x?∼V??@??V?k@W?????@?@?VVU????∼k?V??x?∟???x∼mVk?????L?∼?x∼X?∼Vm?LVxU?∼bX?VW@k??lkn@??ln??@?∼???VmlLUwVK@?V@ka@?lmXb?UlVlk?x@??LVa?VV??wn?mm@km?@m?IVa??@X?VU??U@???k??K@aUwkKV_???a@alU@?nz∼aV??@@㊣l????k@wVakm@????a?z?@Xx?W@?X?@m@??y@aWw@k身??JlbV??J?z??UwVkmWk?m@Ul?U@b?wV??U?VU那???XUaUbV?U?WXUmkK??WnUUU?V????VV???@kk㊣?????L?k??㊣WkXlVkl?@?wXbmL???VUIVmk@Ubma@kkaVKU??kmlXLWn?J???∼@zk?lLU?n@@n???@l??nmKk?lxVw?@@m?x?@n?Uxl∟nbVxUzmJ??n?'],
                    'encodeOffsets': [[
                            104828,
                            25999
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5307',
                'properties': {
                    'name': '璨蔬庈',
                    'cp': [
                        100.448,
                        26.955
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l?@???@w∼?U?n???∼w@m?車??l?U?n?∼???V?UbVbm?@?∼x???VW???l???@zll@b??WxX??a??X@???aXwl@Xa??n??Jn?@mnKW???V?∼ak?VanXVwl@VyU?VU?b?貝laUk∼?k?l??V?Uk???@??I@mVw?a????Vaka???bU?VL?aXIWKUw???aW??KUaVk∼?@?Uw?????X???Lkm?I??車????a?nUl㊣U??l車?I?aU?㊣Ik?U?Vb?bWxn∼??VbnLl??@@`kbmIk?Vn?JmnXl?@Ux?bkn@x車LUxV??K車車??W??a?x???w?@?n?m???V????X??LlVU∟?b??m???@??bU??zU??∼??Vb@??bn??x'],
                    'encodeOffsets': [[
                            101937,
                            28227
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5328',
                'properties': {
                    'name': '昹邧唳馨湯逜赻笥笣',
                    'cp': [
                        100.8984,
                        21.8628
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l?∼?n?lx?@?nWl?L??nbV∟V?kbVV??na?x∼V?a@??b@l?XlWU?VX?Klm???U@b?WXX??∼L?a∼LnU∼??n????∼?l?nb?a???KW??車@kmK@U??V@k?∼??VV??a@y?_??l_n?lL@anI@?車Wl?VU??l?k?l??KVw?U@?kV?am??L@b???k@Vn?Ub?b?w?@???lk???????∼b@?nlUn@??V??m??bW?U@??身m???aU??mk??WWw?@㊣??n?U?豕?a?L???m?L??kw?l@∼mn????車w@V?x??U∟∼??∼Xl'],
                    'encodeOffsets': [[
                            102376,
                            22579
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5305',
                'properties': {
                    'name': '悵刓庈',
                    'cp': [
                        99.0637,
                        24.9884
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@X∼?Il?@?????m??a??l??xV??lV???lL????lkU???Uw??U?Vw?@n?mlnV?IW?∼Ln?Uwl??V?n@lnU??nJ??l㊣U??LV?Ua∼??U?????V?谷?Llx?L???l??∼KUaV??_?谷@klw??l?????W??yU??W@w?knal?Uw@w?U??k??w?aW㊣k_mJ?a?XV???Wb?L??@w?wU???㊣Wk_???w?w身Kmb@∟?bk∼l?????UJ??Vn?l??U??∼VbnbWxX?m????WU??L?yWz?KmbUxVKkn??k?V????∟Ux??@???m@??'],
                    'encodeOffsets': [[
                            100440,
                            25943
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5304',
                'properties': {
                    'name': '迶洈庈',
                    'cp': [
                        101.9312,
                        23.8898
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l??L∼xXlWxXnlw?a??la?l??nX??∼wVw?l?@m?nw∼VVIXllK?bnnV∼lbU?UJ@??KVb??@bW?∼Vk?kaWb∼?kxV∟??U∼?I@llbl????@?@?車@mm@V?kKl?@y??∼??IXmWKnk?lV?ULlb@lnbVal@UnVJ?U??nKWa?x?@lkkUlW?X???l?K∼???l?@l??U??U??U?V?VVXm??lLVnXWV?U?VaVb?W??V谷?U?VU?W??aVa?aW?X??_U?n?????@a?lUn??Uyk@@wW@kbW?UK?wU??mm??LUnVxUVVlk??mmn?mk??a?∟?I@?l@@a?w∼?mU?L㊣?k??谷X???@y??@????????Xmm?V?????lmnkbmWkb@nl@n?m???VxkJm?UJ??ml???∼makVV?nV???W???Wm?nl@xmn?l?I?∟?n?xU??VU?mX@??b@z?l@???'],
                    'encodeOffsets': [[
                            103703,
                            24874
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5333',
                'properties': {
                    'name': '躑蔬瞪咇逜赻笥笣',
                    'cp': [
                        99.1516,
                        26.5594
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@WyX?lWlnnUU???@?V?Vw?Jl?@w?m?車????kml?U?n??@ny@wmU@?m?nam?n??UV??n?y??m∟?@?車n??nmlnb?U???aV?kU?KW??車??mIU?車k?wV車l??????L??k@m?naWK?w車??w@a㊣n?@VbUJ?Lka??X????UV`lI@lnX??kKmx?XmlUKV?mU?Klw@a?a車?@n?KXwVKU?V?mUnkm??@UxV??∼Vx??V?klm???kKW?kVW?nl∼Lnm@?∼?UxlV@nk??JV?∼?V?@nX∼@?l?U?mln???nxm?nVV??x@?m∼XblVU?l∼@xkXU∟WXX?W?X???mk?Jm??w㊣b?xU貝kKm??VU??豕V?kx@??lX?lnk∟?Lk???k??xU??L∼???@LnK@b∼xVI??Ua∼?@?nm@??K???Wln?n'],
                    'encodeOffsets': [[
                            101071,
                            28891
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '5331',
                'properties': {
                    'name': '肅粽湯逜劓だ逜赻笥笣',
                    'cp': [
                        98.1299,
                        24.5874
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@??n@∼?@???Vw????U?l???lmULVwna?LXy?z?KV??X??n?W?XwmaUa∼?V????kUm??VI???車k?l??a@?nama?@?m??車@車y?b?k?m㊣??ammVk?L?wU`Wk@V?kUm??lUUKmbkkUVUw??車?∼??bn∼??l??z@x?????@U?∼n??U∟?U?∼V?@?mlnz?l∼??a?xUx?LkxW?n@?????W???@∼?Xl∼Llx'],
                    'encodeOffsets': [[
                            100440,
                            25943
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});define('echarts/util/mapData/geoJson/zhe_jiang_geo', [], function () {
    return {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': '3311',
                'properties': {
                    'name': '璨阨庈',
                    'cp': [
                        119.5642,
                        28.1854
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@V?bVl@Xn?UX?KV?@?nxlUXV?n?KVmnL??UV@bn∟lLXK???`nnlJXIVJ?I?Vnn∼KnnVll@VLXWV@UkVaVK?zV@???VVaUK@?U?VUl@@WnUU?@wVLn@Vwl@XW∼LVbn@VU?@X?l`@XnKVbkl@XVJlUnlV??xlL@lnXl?@V?UnV∼?∼?@a?UVLXblWVXn@VVUV@L?∟VLV?U?VbnalLUUV?X_laVa?WVzXKV@@a@KU?mImmXama@k?U@yVIUK?aVa@kXK@aWU@V?IUmW@kkVm?U?@VwUa@K@k@U?`@kUKVk@UV@VaUm??Vy@klUUWUkVmUa@_?KVaXa??Xm?U@mU?lWkaUX?@mmkL@w?J?nVV?bWKXa?@@I@a?JUU?@V?UL?W@akLmb@K@a?XXw@m?VmUVkUy@?@aU@@VkUWm@kUK?XUWU_mW@wkkmJUUkLWWUX?W@IkJ@k@mW_k??_Ul?L?m@I@aUa?m@k?a?LUJ?@mVVxUb?a@LUKkX?bm@Uak@@a@Um`?IUbUJ@nUVW@@LnVV@l?UbVlUX@`??@blXklW?U?m?Xlm?U@@V?bml@?@nUb@llnn@VbX@lV@?UVULmU@JVn?bVbkb?VWxU@@nUVk@'],
                    'encodeOffsets': [[
                            121546,
                            28992
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3301',
                'properties': {
                    'name': '獐笣庈',
                    'cp': [
                        119.5313,
                        29.8773
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@X@l?∼KXXlW?b@??`???b?I??X`l@??@bWl@n@VnLUV@V?@∼?@?l@XVlU@?@xVbUb@Vkb@?@XVJVz?J@L??@VmLUxUJ@LU?Vx?b?xXUl@Va?w?b?a?a@Vl@XUVx@V@V?LlbnV?al@lb?Vnn?LnKnL@VlbVJXalI?b@KUU@mVInJ??U?Vl@xU?VLnU?@U??aV@lkV@UanK?L@UlKVUnb?mn@@nUlVnVJl@@UXU?L@WVIVJVxVLXV@I?Knbn@V?V@@I@????y∼b@UUwnk∼??VlU??Xm???a???IkV?@WV?@@aWIUWUIkb@WW@Un?K@UU@kaWVk?VIVVnU@?UWVUV@VmV?kKk?WIkVWaULU`UImJUImm?U@??wmwUV?IUWVkUamaU@mV?k?b@KVU@aVU@anKULVJ?U@k?U?JUV?kk?VakU@??aVwkW@UWkXmWaULUaUK@X?JUUm?VU@U?V?UkJ@ImwmKU@k?@lU?W@@akKm?kamIkWl_UwVm@UkaVUUa?@UamakbWlkL@aUalU@mkL@U@U?lmK@XkKm@?akb@x?nXb?`?nUUU@??U@?wU@@?mKkk?V?U@lULUbVbUb@V?a@L???b@b?LmK?x@VUL@bk@mxULWl'],
                    'encodeOffsets': [[
                            121185,
                            30184
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3303',
                'properties': {
                    'name': '恲笣庈',
                    'cp': [
                        120.498,
                        27.8119
                    ],
                    'childNum': 9
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@ll@xnXV`VX?WVL@lXnlV@UV@@b@∟VzUlnV?U@nWx?W@b@LnalK@b?XVKU??@VV?I@b@J?@WbXL?aUU?m?I@xlKnn?@VWlbkXV?@n?VWn??WbUb?L@`VbUnVlVXkV@lUz㊣?VnUbU@@VUlVL@l?_@V@l@LVbV@XLV`V?lxn@lU@a?aVV?k?@XJ@nl@@LU`∼LVb?L∼a@a?UVy@anI@a?a?nV@?w?JX@V?VV∼k??na@WVk?aWw?U@m@??k?aU??????n?a?a車I??@㊣X?WkU?@kV㊣kw??UkWw??U????k?l?ImaUaW車X??k?UnWV?mm?k?K?n???l??UlUx@XWb?V@JkX?∼mb@VULVxUVk@@LWWk@WIk??UkJmUkVmI@y?@Ua??kLm?U@mUUUkaVk?@mK@U?lUU@UmKmbUUUJ@n@KVLUL@VkJWXX`mnULWlkL@JVLVb@∼kxkU@LV??V@?VLV`UL@VUX'],
                    'encodeOffsets': [[
                            122502,
                            28334
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3302',
                'properties': {
                    'name': '譴疏庈',
                    'cp': [
                        121.5967,
                        29.6466
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@????∼?nX?V?K?k????∼?n???@w???b?U∼??X?W車???㊣IU???@U∼w???mm_@aX?VK?Vlk@akk??@?X?Vw??X?Wa?a?b?K?????x?L車?k@???@?n?KUL@xkL??kWULUUmJUXV?U@m?UX?@V`mbXbV@@nn∟WX?x@?kJ@nVVUVl?Ub?VUVk@Wx@V@??VXzml?a?L@VlLU`?XUVVVUnl@VbnJlnUVVn?lUKkbmnn?VxlJnxmbU@UL@KUV?X@xmb@lk@mnVVU??豕'],
                    'encodeOffsets': [[
                            123784,
                            30977
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3309',
                'properties': {
                    'name': '笸刓庈',
                    'cp': [
                        122.2559,
                        30.2234
                    ],
                    'childNum': 3
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@l??????V?L???X???X?V???w??l????車V?V?@??w?kmK@?X貝Wa?U??m????w?㊣㊣n???x@V??V??J???豕?X?W???V?a車?@x??m?????'],
                    'encodeOffsets': [[
                            124437,
                            30983
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3310',
                'properties': {
                    'name': '怢笣庈',
                    'cp': [
                        121.1353,
                        28.6688
                    ],
                    'childNum': 7
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@lV?IVWVz@bXJl@Xal@∼?nLll@nVxnV?K@?UJVb??∼?k`UIWJXn??@bUJ?Xl@lb?Wn@UzVV@bVV?mVnnJVXna?b?KUKnUVVUnVLlKVLXa?Jm?@mU@WanaU_∼@VWn?V@U?VWnIVVVKlX??lK@wVK?L∼m?@??l@???K?w????U?l?@?U???Vk?m@?U??a?I?mUk@m?w@a???Wk@???Im㊣@ank?UlaU?Uw??身a?b?b?m????V??b?l@?@n?VXx?bUl@Xmb???lUUU?W@?I㊣xU@?m?b@bmJ@bUz?V@b?b?KUa?KV_@Kk@@mWI?@?lUU?b@bkVm@kwU?U_WKU@Ux?@?VUnllX@Vn?J@UXV@bWL@lUb?bVLUJ@z?V@lnbWbnnnJV?@L'],
                    'encodeOffsets': [[
                            123312,
                            29526
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3307',
                'properties': {
                    'name': '踢貌庈',
                    'cp': [
                        120.0037,
                        29.1028
                    ],
                    'childNum': 8
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@nbVb?@VbUVlb@VUnVxk`lXnJlbn?lL@bX@V?@kl?V@nLnx@JlI?V?U@VUVn?VV?I@WVLVbVKXbWnXl@VlXUx?b@?lVUbl??lVU?I?VnalKX@@bV@@aUUlU?wUw?@naWW?UVaUU?aVb?LlxXJVk∼?U?lkU?@k?a@LVlXLVl?VWznVn@lx?Jl_@WX_@mVa?a@alU@kVVna?KVLlK?b@UUaVa?bnUWmXU@k@yVI@a??WmXIVJl_????UaVI@??LmUUw@mkkmK??k@Wbk@WI@aUyUX?JkU@bU@WLUy?XUbkbW`U?VVkKmbUaV?U?UK??@KVUUUm@UWkXWaUK?V@b????mU?V@Uk?mW@kkK?wU?mkkVUI@WlkUamL@Wk_W??@UVm@Ua?KWXk@Uxm@UK@xV?mV@Xk@UVV?@?VLUb?U??U@?yULUbVlU@@XlVUVVb?U@lXXVW@XUVl@@VUV??n@VVU?@lVa@?U?mL@`?X@`WL@VUX@lUL@xlx'],
                    'encodeOffsets': [[
                            122119,
                            29948
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3308',
                'properties': {
                    'name': '摋笣庈',
                    'cp': [
                        118.6853,
                        28.8666
                    ],
                    'childNum': 5
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@XkVKnwl@@aVK@U?wnL?K@a?a??@K?b@UVaUaVaVK@k∼V?UllnL@?V@?xV@??V@VV?m?_Wa?m@wla?bn@lL@WnL?k@V@VlK@nkVVb@blKXklakw@wVK@kVW@UXK@_?W@_nKV?@?Ub@kV?UUm@??VU@Uk@VU@WUXWW@k?VUaVUkU@WWXUKk@Ukmm?Lmm?U?JUIWJkImm?_?㊣WLkKm?@aVU??mKUn?L?mWUkVmw@?U??LVWm?@WUk?a@Um?mL?mm@@bUX?@@WUIm@UVUK@UVUUU?VVJmb@b?Xn?mV??nnn?mJUV?L?V@VW@UzUlVnUbl`UnVl@XU@kl@bm?Ux?Vk@@J@???W@?aVVnzmV???@WJk@k?WJ@??lXbWbXxmVn?lLXb@∼lKVXnW?bWV??X?mbV@Xl?b?I@Kn@@x@?VLlm'],
                    'encodeOffsets': [[
                            121185,
                            30184
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3306',
                'properties': {
                    'name': '庄倓庈',
                    'cp': [
                        120.564,
                        29.7565
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@?x@??VnnVJnIVJV_VKXblUXJl?lLU?UnU@UVVX@?mVUUUJl?XUlbV@@V?LVmX@@XlaVJVXXJ@b?@XU?@lU?J???b?∟???J??V?UUnml@@kna@w?WVU@LVKV@namwkIUwm?nmlaVL?kUmVUkmmIUak@VmUUVU?WV_kK@U?K?bnkWy?U@?@UXwl@VU?UVak㊣VUUU@mlI@??wXW?IWbUKkLUKVmUUmVVL?L?ambUWmIUm?nUU@aUUVym@?Xkak@?W@z@lWVXnmV?aUbVb@V?akLUK?LmbUU@lkV@b?bUb@nW`@Xk`?Ikwm@mUXy?UUkWKUk@K?b@lV?klV???UlWIkw?KUa?bVVUb?VXXmb?@Vx?xkVVV@bU@@aW@kLmb@l?VUIVKmL@bUV@bUV@L?a?lnUV@nbVbUlVX?JVUnx'],
                    'encodeOffsets': [[
                            122997,
                            30561
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3304',
                'properties': {
                    'name': '樁倓庈',
                    'cp': [
                        120.9155,
                        30.6354
                    ],
                    'childNum': 6
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@@blIX@@V?VUnn@l?k?lKnI∼?l`?LVKVbnbVaVLUVn@W?@VkVVb?@VI?`@blLnL?aX@?VVb@U?@XlVa?@@kVaUKV?U_lWXU??@alb?k@VllnLVKn@@UVIUw@y∼IVVXU@VV@lw?m@wVk?a?J?Lk曲???l?L?UmW???????I??Wn?豕kV?U??mlVx@V?a?z??@?@JU@U?m@@?nVmn@V?LV?'],
                    'encodeOffsets': [[
                            123233,
                            31382
                        ]]
                }
            },
            {
                'type': 'Feature',
                'id': '3305',
                'properties': {
                    'name': '綬笣庈',
                    'cp': [
                        119.8608,
                        30.7782
                    ],
                    'childNum': 4
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': ['@@kLl?k?m@Vm?U@UW@kJ@aU??K@UnmmU@?ma?L@JWUUKUwUIUJ@X?KWV@Vk@UIUmVk@mm@?nmaUVkL@V?KmLVbU@klU@?bV??@mVUKV?@wUkV???mIUJ@nVV@L?akJWbUIka@UmKmL?Kmm?UUVk@@nmLX`WXUV@?@nUl?kmlU@Ub???xVV?IlV???nn??@@n??U??@?∼n@@xmb@?VbnV@???@b@`@L@L@x@blVklVbnnV@?aXb∼VlU@W?b∼U?LXWVUV???Vw?w???a?nU?Vw?X@V@lVU@wlaUUVm@knUV?'],
                    'encodeOffsets': [[
                            123379,
                            31500
                        ]]
                }
            }
        ],
        'UTF8Encoding': true
    };
});