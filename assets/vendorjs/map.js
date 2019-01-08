"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// dit is een nieuwe //

function webgl_detect(return_context) {
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

        for (var i = 0; i < 4; i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    // WebGL is enabled
                    if (return_context) {
                        // return WebGL object if the function's argument is present
                        return { name: names[i], gl: context };
                    }
                    // else, return just true
                    return true;
                }
            } catch (e) {}
        }

        if (canvas && canvas !== null) {
            canvas.remove();
        }

        // WebGL is supported, but disabled
        return false;
    }

    // WebGL not supported
    return false;
}
function loadJSON(filepath, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filepath, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// for babel
// Array.includes = function() {
//     let [first, ...rest] = arguments;
//     return Array.prototype.includes.apply(first, rest);
// }
// // for IE
// if (!String.prototype.includes) {
//     String.prototype.includes = function() {
//         'use strict';
//         return String.prototype.indexOf.apply(this, arguments) !== -1;
//     };
// }
function ieVersion() {
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > 0) return 11;else if (ua.indexOf("Trident/6.0") > 0) return 10;else if (ua.indexOf("Trident/5.0") > 0) return 9;else return 0; // not IE9, 10 or 11
}

!window.ActiveXObject && "ActiveXObject";
function isIE11() {
    return !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
}

var ContentLayer = function () {
    function ContentLayer(map, config, popup) {
        _classCallCheck(this, ContentLayer);

        this._data = config.data;
        this.interactionPopup = popup;
        this._map = map;
        this._config = config;
        this._markers = null;
    }

    ContentLayer.prototype.setFeatureActive = function setFeatureActive(feature) {

        for (var f in this._data.features) {
            var currentFeature = this._data.features[f];
            if (currentFeature.properties.name === feature.properties.name) {
                // If is not active yet
                if (this._data.features[f].properties.type.indexOf('-active') === -1) {
                    this._data.features[f].properties.type = this._data.features[f].properties.type + '-active';
                }
            } else {
                this._data.features[f].properties.type = 'home';
            }
        }
        this.redraw();
    };

    ContentLayer.prototype.redraw = function redraw() {
        if (webgl_detect() && !isIE11()) {
            this._map.getSource('markers').setData(this._data);
        } else {
            this.draw();
        }
    };

    ContentLayer.prototype.draw = function draw() {

        var self = this,
            html = void 0,
            lngLat = void 0,
            type = void 0,
            offset = void 0;

        if (webgl_detect() && !isIE11()) {

            self._map.addSource('markers', {
                'type': 'geojson',
                "data": this._data
            });

            self._map.addLayer({

                "id": "icons",
                "type": "symbol",
                "source": "markers",
                "layout": {
                    "icon-size": 1.5,
                    "icon-image": {
                        property: 'type',
                        type: 'categorical',
                        stops: [['home', "locatie"], ['home-active', "locatie_selected"], ['area', "locatie"], ['area-active', "locatie_selected"]]
                    },
                    "icon-padding": 0,
                    "icon-allow-overlap": true,
                    "visibility": "visible"
                }

            });

            self._map.on("click", "icons", function (e) {

                self._map.getCanvas().style.cursor = 'pointer';
                if (self._map.getPitch() > 0) {
                    return;
                }

                self.interactionPopup.closePopup();
                html = self.interactionPopup.createPopup(e.features[0]);
                lngLat = e.features[0].geometry.coordinates;
                type = e.features[0].properties.type;
                self.interactionPopup.openPopup(html, lngLat, type);

                self.setFeatureActive(e.features[0]);
            });
        } else {

            var markers = [],
                otherlocations = [],
                thislocation = [],
                classNames = '',
                yellowMarker,
                blogIcon,
                projectIcon;

            var iconGenerator = new IconGenerator();

            this._data.features.forEach(function (item) {

                if (item.properties.type === 'home-active') {
                    var icon = iconGenerator.homeActiveIcon(item);
                } else if (item.properties.type === 'home') {
                    var icon = iconGenerator.homeIcon(item);
                } else if (item.properties.type === 'area-active') {
                    var icon = iconGenerator.areaActiveIcon(item);
                } else {
                    var icon = iconGenerator.areaIcon(item);
                }

                var marker = L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], { icon: icon }); // .bindPopup(item.title);

                marker.on('click', function (e) {

                    self.setFeatureActive(item);

                    html = self.interactionPopup.createPopup(item);
                    //open popup;
                    var popup = L.popup({
                        className: item.properties.type,
                        offset: [0, 0]
                    }).setLatLng(e.latlng).setContent(html).openOn(self._map);
                });
                markers.push(marker);
            });

            if (this._markers != null) {
                this._markers.remove();
                self._map.removeLayer(this._markers._leaflet_id);
            }

            this._markers = new L.featureGroup(markers);
            this._markers.addTo(self._map);

            //self._map.fitBounds(self.markers.getBounds().pad(2.5));
            // self.map.scrollWheelZoom.disable();
        }
    };

    // voor bereikbaarheid


    ContentLayer.prototype.zoom = function zoom() {

        var self = this,
            coordinates = self._config.dataset.lines.features[1].geometry.coordinates,
            bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        self._map.fitBounds(bounds, {
            padding: 100
        });
    };

    // voor bereikbaarheid


    ContentLayer.prototype.addLegend = function addLegend() {

        var legend = document.createElement('div');
        legend.classList.add('legend');
        self.hostContainer.appendChild(legend);
    };

    ContentLayer.prototype.navigate = function navigate(url) {
        window.location.href = url;
    };

    return ContentLayer;
}();

var Directions = function () {
    function Directions(map, config) {
        _classCallCheck(this, Directions);

        this._map = map;
        this.config = config;
    }

    Directions.prototype.init = function init() {};

    Directions.prototype.draw = function draw(session) {

        // console.log(session);

        var self = this;
        self._map.addSource('address', {
            'type': 'geojson',
            "data": session.address
        });

        self._map.addSource('contact', {
            'type': 'geojson',
            "data": session.contact
        });

        self._map.addSource('directions', {
            'type': 'geojson',
            "data": session.directions
        });

        self._map.addLayer({

            "id": "address",
            "type": "symbol",
            "source": "address",
            "layout": {
                "icon-size": 1.5,
                "icon-image": "locatie",
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "visibility": "visible"
            }
        });

        self._map.addLayer({

            "id": "contact",
            "type": "symbol",
            "source": "contact",
            "layout": {
                "icon-size": 1.5,
                "icon-image": "locatie_selected",
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "visibility": "visible"
            },
            "filter": ["==", "class", "contact"]
        });

        self._map.addLayer({

            "id": "directions",
            "type": "line",
            "source": "directions",
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#ffffff',
                'line-width': 4,
                'line-opacity': 1
            }
        });
    };

    return Directions;
}();

var IconGenerator = function () {
    function IconGenerator() {
        _classCallCheck(this, IconGenerator);
    }

    IconGenerator.prototype.homeIcon = function homeIcon(item) {

        return L.divIcon({

            iconSize: (35, 35),
            className: 'blog  yellow',
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: "\n                        <svg version=\"1.1\" id=\"Laag_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                        \t width=\"40px\" height=\"40px\" viewBox=\"310.168 226.535 19.746 27.442\"\n                        \t enable-background=\"new 310.168 226.535 19.746 27.442\" xml:space=\"preserve\">\n                        <g>\n                        \t<g>\n                        \t\t<path d=\"M329.729,234.329c-0.968-4.569-4.999-7.794-9.998-7.794c-0.323,0.054-1.075,0.054-1.72,0.215\n                        \t\t\tc-3.494,0.806-5.913,2.903-7.203,6.235c-0.645,1.72-0.86,3.494-0.376,5.322c0.376,1.398,0.968,2.742,1.667,4.031\n                        \t\t\tc2.042,3.979,4.623,7.634,7.311,11.235c0.43,0.537,0.968,0.537,1.343,0c1.721-2.258,3.334-4.569,4.838-6.935\n                        \t\t\tc1.398-2.258,2.688-4.516,3.656-6.988C329.891,237.877,330.105,236.157,329.729,234.329\"/>\n                        \t\t<path fill=\"#FFFFFF\" d=\"M318.011,236.909c-0.538,0-0.968-0.43-0.968-0.968c0-0.537,0.43-0.967,0.968-0.967s0.967,0.43,0.967,0.967\n                        \t\t\tC318.979,236.479,318.549,236.909,318.011,236.909 M314.786,234.974v6.29h2.527l-0.269-2.742l-0.376,0.914\n                        \t\t\tc0,0-0.054-1.881,0.108-2.042c0.161-0.162,0.376-0.323,1.183-0.323c0.806,0,1.021,0.107,1.183,0.323\n                        \t\t\tc0.161,0.161,0.107,2.042,0.107,2.042l-0.376-0.914l-0.215,2.742h2.312v-4.301h2.419v4.301h1.936v-6.29l-5.269-4.193\n                        \t\t\tL314.786,234.974z\"/>\n                        \t</g>\n                        \t<polygon fill=\"#FFFFFF\" points=\"317.312,241.264 318.656,241.264 318.011,239.866 \t\"/>\n                        </g>\n                        </svg>\n                     "
        });
    };

    IconGenerator.prototype.homeActiveIcon = function homeActiveIcon(item) {

        return L.divIcon({

            iconSize: (35, 35),
            className: 'blog  yellow',
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: "\n                        <svg version=\"1.1\" id=\"Laag_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                        \t width=\"40px\" height=\"40px\" viewBox=\"310.168 226.535 19.746 27.442\"\n                        \t enable-background=\"new 310.168 226.535 19.746 27.442\" xml:space=\"preserve\">\n                        <g>\n                        \t<g>\n                        \t\t<path fill=\"#EE7F00\" d=\"M329.729,234.329c-0.968-4.569-4.999-7.794-9.998-7.794c-0.323,0.054-1.075,0.054-1.72,0.215\n                        \t\t\tc-3.494,0.806-5.913,2.903-7.203,6.235c-0.645,1.72-0.86,3.494-0.376,5.322c0.376,1.398,0.968,2.742,1.667,4.031\n                        \t\t\tc2.042,3.979,4.623,7.634,7.311,11.235c0.43,0.537,0.968,0.537,1.343,0c1.721-2.258,3.334-4.569,4.838-6.935\n                        \t\t\tc1.398-2.258,2.688-4.516,3.656-6.988C329.891,237.877,330.105,236.157,329.729,234.329\"/>\n                        \t\t<path fill=\"#FFFFFF\" d=\"M318.011,236.909c-0.538,0-0.968-0.43-0.968-0.968c0-0.537,0.43-0.967,0.968-0.967s0.967,0.43,0.967,0.967\n                        \t\t\tC318.979,236.479,318.549,236.909,318.011,236.909 M314.786,234.974v6.29h2.527l-0.269-2.742l-0.376,0.914\n                        \t\t\tc0,0-0.054-1.881,0.108-2.042c0.161-0.162,0.376-0.323,1.183-0.323c0.806,0,1.021,0.107,1.183,0.323\n                        \t\t\tc0.161,0.161,0.107,2.042,0.107,2.042l-0.376-0.914l-0.215,2.742h2.312v-4.301h2.419v4.301h1.936v-6.29l-5.269-4.193\n                        \t\t\tL314.786,234.974z\"/>\n                        \t</g>\n                        \t<polygon fill=\"#EE7F00\" points=\"317.312,241.264 318.656,241.264 318.011,239.866 \t\"/>\n                        </g>\n                        </svg>\n                     "
        });
    };

    IconGenerator.prototype.areaIcon = function areaIcon(item) {

        return L.divIcon({

            iconSize: (35, 35),
            className: 'blog  yellow',
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: "\n                <svg version=\"1.1\" id=\"Laag_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                \t width=\"35px\" height=\"35px\" viewBox=\"310.168 226.535 19.746 27.442\"\n                \t enable-background=\"new 310.168 226.535 19.746 27.442\" xml:space=\"preserve\">\n                <g>\n                \t<g>\n                \t\t<path d=\"M329.729,234.329c-0.968-4.569-4.999-7.794-9.998-7.794c-0.323,0.054-1.075,0.054-1.72,0.215\n                \t\t\tc-3.494,0.806-5.913,2.903-7.203,6.235c-0.645,1.72-0.86,3.494-0.376,5.322c0.376,1.398,0.968,2.742,1.667,4.031\n                \t\t\tc2.042,3.979,4.623,7.634,7.311,11.235c0.43,0.537,0.968,0.537,1.343,0c1.721-2.258,3.334-4.569,4.838-6.935\n                \t\t\tc1.398-2.258,2.688-4.516,3.656-6.988C329.891,237.877,330.105,236.157,329.729,234.329\"/>\n                \t\t<path fill=\"#FFFFFF\" d=\"M318.011,236.909c-0.538,0-0.968-0.43-0.968-0.968c0-0.537,0.43-0.967,0.968-0.967s0.967,0.43,0.967,0.967\n                \t\t\tC318.979,236.479,318.549,236.909,318.011,236.909 M314.786,234.974v6.29h2.527l-0.269-2.742l-0.376,0.914\n                \t\t\tc0,0-0.054-1.881,0.108-2.042c0.161-0.162,0.376-0.323,1.183-0.323c0.806,0,1.021,0.107,1.183,0.323\n                \t\t\tc0.161,0.161,0.107,2.042,0.107,2.042l-0.376-0.914l-0.215,2.742h2.312v-4.301h2.419v4.301h1.936v-6.29l-5.269-4.193\n                \t\t\tL314.786,234.974z\"/>\n                \t</g>\n                \t<polygon fill=\"#FFFFFF\" points=\"317.312,241.264 318.656,241.264 318.011,239.866 \t\"/>\n                </g>\n                </svg>\n                     "
        });
    };

    IconGenerator.prototype.areaActiveIcon = function areaActiveIcon(item) {

        return L.divIcon({

            iconSize: (35, 35),
            className: 'blog  yellow',
            iconAnchor: (0, 0),
            popupAnchor: (0, 0),
            html: "\n\n            <svg version=\"1.1\" id=\"Laag_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n            \t width=\"35px\" height=\"35px\" viewBox=\"310.168 226.535 19.746 27.442\"\n            \t enable-background=\"new 310.168 226.535 19.746 27.442\" xml:space=\"preserve\">\n            <g>\n            \t<g>\n            \t\t<path fill=\"#EE7F00\" d=\"M329.729,234.329c-0.968-4.569-4.999-7.794-9.998-7.794c-0.323,0.054-1.075,0.054-1.72,0.215\n            \t\t\tc-3.494,0.806-5.913,2.903-7.203,6.235c-0.645,1.72-0.86,3.494-0.376,5.322c0.376,1.398,0.968,2.742,1.667,4.031\n            \t\t\tc2.042,3.979,4.623,7.634,7.311,11.235c0.43,0.537,0.968,0.537,1.343,0c1.721-2.258,3.334-4.569,4.838-6.935\n            \t\t\tc1.398-2.258,2.688-4.516,3.656-6.988C329.891,237.877,330.105,236.157,329.729,234.329\"/>\n            \t\t<path fill=\"#FFFFFF\" d=\"M318.011,236.909c-0.538,0-0.968-0.43-0.968-0.968c0-0.537,0.43-0.967,0.968-0.967s0.967,0.43,0.967,0.967\n            \t\t\tC318.979,236.479,318.549,236.909,318.011,236.909 M314.786,234.974v6.29h2.527l-0.269-2.742l-0.376,0.914\n            \t\t\tc0,0-0.054-1.881,0.108-2.042c0.161-0.162,0.376-0.323,1.183-0.323c0.806,0,1.021,0.107,1.183,0.323\n            \t\t\tc0.161,0.161,0.107,2.042,0.107,2.042l-0.376-0.914l-0.215,2.742h2.312v-4.301h2.419v4.301h1.936v-6.29l-5.269-4.193\n            \t\t\tL314.786,234.974z\"/>\n            \t</g>\n            \t<polygon fill=\"#EE7F00\" points=\"317.312,241.264 318.656,241.264 318.011,239.866 \t\"/>\n            </g>\n            </svg>\n\n\n                     "
        });
    };

    return IconGenerator;
}();

var InteractionFilters = function () {
    function InteractionFilters(map, config, contentLayer) {
        _classCallCheck(this, InteractionFilters);

        this._map = map;
        this.config = config;
        this.contentLayer = contentLayer;
        this.element = document.getElementById("filter-container");
        this.filters = config.filters;
        this.currentFilter = [];
    }

    InteractionFilters.prototype.init = function init() {
        var _this = this;

        var self = this;

        var _loop = function _loop(index) {
            var filter = _this.filters[index];
            var filterElement = document.getElementById("filter-" + filter.title);
            filterElement.addEventListener("click", function (e) {
                self.filterLayer(self._map, 'icons', filter.title);
            }, false);
            if (!filter.visible) {
                self.filterLayer(self._map, 'icons', filter.title);
            }
        };

        for (var index in this.filters) {
            _loop(index);
        }
    };

    InteractionFilters.prototype.filterLayer = function filterLayer(map, layer, filter) {

        var self = this;

        if (webgl_detect() && !isIE11()) {
            self._GL_filterLayer(map, layer, filter);
        } else {
            self._JS_filterLayer(map, layer, filter);
        }
    };

    InteractionFilters.prototype._GL_filterLayer = function _GL_filterLayer(map, layer, filter) {

        var self = this;

        var currentFilters = map.getFilter(layer);
        var filterElement = document.getElementById("filter-" + filter),
            newFilter = ['none'],
            exists = [];

        if (currentFilters) {

            var existsInFilter = null;

            for (var i = 0; i < currentFilters.length; i++) {
                var loopFilter = currentFilters[i];
                if (loopFilter[2] === filter) {
                    existsInFilter = i;
                }
            };

            if (existsInFilter) {
                var removedFilters = currentFilters.filter(function (f) {
                    if (f[2] !== filter && f[2] !== filter + '-active') {
                        return f;
                    }
                });
                newFilter = removedFilters;
                filterElement.classList.remove('inactive');
            } else {
                var typeFilter = ['==', 'type', filter];
                currentFilters.push(typeFilter);
                var activeTypeFilter = ['==', 'type', filter + '-active'];
                currentFilters.push(activeTypeFilter);
                newFilter = currentFilters;
                filterElement.classList.add('inactive');
            }
        } else {

            var _typeFilter = ['==', 'type', filter];
            newFilter.push(_typeFilter);
            var _activeTypeFilter = ['==', 'type', filter + '-active'];
            newFilter.push(_activeTypeFilter);
            filterElement.classList.add('inactive');
        }

        self._map.setFilter(layer, newFilter);
    };

    InteractionFilters.prototype._JS_filterLayer = function _JS_filterLayer(map, layer, filter) {

        var self = this;
        var filterElement = document.getElementById("filter-" + filter);

        //remove popups
        self._map.closePopup();

        // remove all icons
        self._map.eachLayer(function (l) {
            if (l._icon) {
                l.remove();
            }
        });

        var inFiltersArray = this.currentFilter.indexOf(filter);

        // adapt array
        if (inFiltersArray !== -1) {
            var index = this.currentFilter.indexOf(filter);
            this.currentFilter.splice(index, 1);
            filterElement.classList.remove('inactive');
        } else {
            this.currentFilter.push(filter);
            filterElement.classList.add('inactive');
        }

        // new features for icon layer
        var filteredContent = self.config.data.features.filter(function (feature) {
            var isFiltered = self.currentFilter.indexOf(feature.properties.type);
            if (isFiltered === -1) {
                return feature;
            }
        });

        // if features redraw icon layer
        if (filteredContent.length > 0) {
            var filteredFeatureCollection = {
                type: "FeatureCollection",
                features: filteredContent
            };
            this.contentLayer.draw(filteredFeatureCollection);
        }
    };

    return InteractionFilters;
}();

var InteractionPage = function () {
    function InteractionPage(map, config) {
        _classCallCheck(this, InteractionPage);

        this._map = map;
        this._config = config;
        this.closeButton = document.getElementById('navigation-map-close');
        this.navigationMapHeader = document.getElementById('navigation-map-header');
        this.fullMapLink = document.getElementById('full-map-link');
        this.navigationMapClose = document.getElementById('navigation-map-close');
        this.mapIcon = document.getElementById('map-icon');
        this.hostContainer = document.getElementById('navigation-map-container');
        this.body = document.getElementsByTagName("body")[0];
        this.filterContainer = document.getElementById("filter-container");
        this.dimensionSelector = document.getElementById("dimension-selector");
    }

    InteractionPage.prototype.init = function init() {

        var self = this;
        this.hostContainer.addEventListener("mouseenter", function () {
            self.hoversize();
        }, false);
        this.navigationMapHeader.addEventListener("click", function () {
            self.fullsize();
        }, false);
        this.fullMapLink.addEventListener("click", function () {
            self.fullsize();
        }, false);
        this.navigationMapClose.addEventListener("click", function () {
            self.close();
        }, false);
        this.mapIcon.addEventListener("click", function () {
            self.hoversize();
        }, false);
    };

    InteractionPage.prototype.hoversize = function hoversize() {

        var self = this;
        this.permanentlyClosed = false;

        if (!this.fullSize && self.hostContainer) {
            self.hostContainer.classList.add('hoversize');
        }
        // hoe centreren we de map nu?
        // if( !this.fullSize) { self._map.fitBounds(self.markers.getBounds().pad(2.5)); }

        // close button later laten verschijnen om te voorkomen dat klik ook meteen sluiten is
        setTimeout(function () {
            self.closeButton.style.visibility = "visible";
        }, 2000);
    };

    InteractionPage.prototype.fullsize = function fullsize() {

        var self = this;
        this.fullSize = true;
        this.permanentlyClosed = false;
        this.dimensionSelector.classList.add('visible');
        this.body.classList.add('fixed');

        if (this.filterContainer) {
            this.filterContainer.classList.add('visible');
        }

        // this.zoomControl.addTo(self.map);

        if (self.hostContainer) {
            self.hostContainer.classList.add('fullsize');
            self.hostContainer.classList.remove('hoversize');
        }

        if (self.hostContainer) {
            self.hostContainer.style.zIndex = '9999';
        }

        // setTimeout(function() {

        // self.map.fitBounds(self.markers.getBounds().pad(.05));
        // self.webGL.scene.updateConfig();
        // self.map.invalidateSize({animate: true});
        //self.closeButton.style.display = 'flex';
        // if (self.navigationMapContainer) { self.navigationMapContainer.classList.remove('iconized'); }


        // }, 1000);
    };

    InteractionPage.prototype.close = function close() {

        var self = this;
        this.fullSize = false;
        this.permanentlyClosed = true;
        this.body.classList.remove('fixed');

        if (this.filterContainer) {
            this.filterContainer.classList.remove('visible');
        }

        if (self.hostContainer) {
            self.hostContainer.classList.remove('fullsize');
            self.hostContainer.classList.remove('hoversize');
        }

        if (self.hostContainer) {
            self.hostContainer.style.zIndex = '999';
        }

        // setTimeout(function() {

        // self.map.fitBounds(self.markers.getBounds().pad(1.25));
        // self.map.invalidateSize({animate: true});
        // self.map.zoomIn(1);
        // self.closeButton.style.display = 'none';

        // }, 500);
    };

    return InteractionPage;
}();

var InteractionPopup = function () {
    function InteractionPopup(map) {
        _classCallCheck(this, InteractionPopup);

        this._map = map;
        this.popup = null;
    }

    InteractionPopup.prototype.createPopup = function createPopup(item) {

        var iconGenerator = new IconGenerator();

        if (item.properties.town) {
            return "<div class=\"popup-rectangular\">\n                        <a href=\"" + item.properties.url + "\">Lees meer over</a>\n                        <span class=\"line\">\n                            " + item.properties.name + "\n                        </span>\n                        <span class=\"line\">\n                            " + item.properties.town + "\n                        </span>\n                    </div>\n                ";
        } else {

            var icon = "\n\n                <svg version=\"1.1\" id=\"Laag_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                        \t width=\"40px\" height=\"40px\" viewBox=\"310.168 226.535 19.746 27.442\"\n                        \t enable-background=\"new 310.168 226.535 19.746 27.442\" xml:space=\"preserve\">\n                    <g>\n                        <g>\n                            <path d=\"M329.729,234.329c-0.968-4.569-4.999-7.794-9.998-7.794c-0.323,0.054-1.075,0.054-1.72,0.215\n                                c-3.494,0.806-5.913,2.903-7.203,6.235c-0.645,1.72-0.86,3.494-0.376,5.322c0.376,1.398,0.968,2.742,1.667,4.031\n                                c2.042,3.979,4.623,7.634,7.311,11.235c0.43,0.537,0.968,0.537,1.343,0c1.721-2.258,3.334-4.569,4.838-6.935\n                                c1.398-2.258,2.688-4.516,3.656-6.988C329.891,237.877,330.105,236.157,329.729,234.329\"/>\n                            <path fill=\"#FFFFFF\" d=\"M318.011,236.909c-0.538,0-0.968-0.43-0.968-0.968c0-0.537,0.43-0.967,0.968-0.967s0.967,0.43,0.967,0.967\n                                C318.979,236.479,318.549,236.909,318.011,236.909 M314.786,234.974v6.29h2.527l-0.269-2.742l-0.376,0.914\n                                c0,0-0.054-1.881,0.108-2.042c0.161-0.162,0.376-0.323,1.183-0.323c0.806,0,1.021,0.107,1.183,0.323\n                                c0.161,0.161,0.107,2.042,0.107,2.042l-0.376-0.914l-0.215,2.742h2.312v-4.301h2.419v4.301h1.936v-6.29l-5.269-4.193\n                                L314.786,234.974z\"/>\n                        </g>\n                        <polygon fill=\"#FFFFFF\" points=\"317.312,241.264 318.656,241.264 318.011,239.866 \t\"/>\n                    </g>\n                    </svg>\n                 ";

            return ["<a href='", item.properties.url, "'>", "<div class='popup-rectangular'>", "<div>Lees meer over</div>", "<div class='line'>", item.properties.name, "</div>", "</div>", icon, "</a>"].join('\n');
        }
    };

    InteractionPopup.prototype.openPopup = function openPopup(html, lngLat, type) {
        var self = this;
        self.popup = new mapboxgl.Popup({ offset: [0, 20], anchor: 'bottom', closeButton: true }).setLngLat(lngLat).setHTML(html).addTo(self._map);
        self.popup._container.classList.add(type);
    };

    InteractionPopup.prototype.closePopup = function closePopup() {
        var self = this;
        if (self.popup) {
            self.popup.remove();
        }
    };

    return InteractionPopup;
}();

var ListReference = function () {
    function ListReference(contentLayer, interactionPopup) {
        _classCallCheck(this, ListReference);

        this.contentLayer = contentLayer;
        this.interactionPopup = interactionPopup;
    }

    ListReference.prototype.generateHTML = function generateHTML(config) {

        var self = this,
            ul = void 0,
            li = void 0;

        ul = document.createElement('ul');

        self.config = config;
        self.features = config.data.features;

        config.data.features.forEach(function (feature) {
            li = document.createElement('li');
            li.innerHTML = ["<span data-slug=", feature.properties.url, ">", feature.properties.name, "</span>"].join('\n');

            if (self.config.filters[0].visible && feature.properties.type === 'home') {
                ul.appendChild(li);
            };
            if (self.config.filters[1].visible && feature.properties.type === 'area') {
                ul.appendChild(li);
            };
        });
        return ul;
    };

    ListReference.prototype.addEventListeners = function addEventListeners(map, container) {

        var self = this,
            slug = void 0,
            linkList = [].slice.call(document.body.querySelectorAll('.homes-list>ul>li>a'));

        console.log('linke lijst?');
        console.log(linkList);

        linkList.forEach(function (link) {
            link.addEventListener('mouseenter', function (e) {
                if (e && e.target.attributes['href']) {
                    self.focus(map, event.target.attributes['href'].nodeValue);
                }
            }, false);
        });
    };

    ListReference.prototype.focus = function focus(map, slug) {
        if (webgl_detect() && !isIE11()) {
            this._GL_Focus(map, slug);
        } else {
            this._JS_Focus(map, slug);
        }
    };

    // focusOff(map,slug) {
    //     if (webgl_detect() && !isIE11()) {
    //         this._GL_UnFocus(map,slug);
    //     } else {
    //         this._JS_UnFocus(map,slug);
    //     }
    // }

    ListReference.prototype._GL_Focus = function _GL_Focus(map, slug) {

        var self = this,
            html = void 0,
            offset = void 0,
            lngLat = void 0,
            type = void 0;

        var relatedFeatures = map.querySourceFeatures('markers', {
            sourceLayer: 'icons'
        });

        var features = relatedFeatures.filter(function (feature) {
            return feature.properties.url === slug;
        });

        var selectedFeature = features[0];

        if (selectedFeature) {

            this.contentLayer.setFeatureActive(selectedFeature);

            self.interactionPopup.closePopup();

            html = self.interactionPopup.createPopup(features[0]);
            lngLat = features[0].geometry.coordinates;
            type = features[0].properties.type;

            self.interactionPopup.openPopup(html, lngLat, type);
            map.easeTo({
                center: [lngLat[0] + 0.001, lngLat[1] - 0.0005],
                speed: 1,
                curve: 1
            });
        }
    };

    ListReference.prototype._JS_Focus = function _JS_Focus(map, slug) {

        var self = this,
            html = void 0,
            latLng = void 0,
            highlightedMarker = void 0,
            highlightedFeature = void 0;

        // all features
        // filter by slug ?
        var selectedFeatures = self.features.filter(function (f) {
            return f.properties.url === slug;
        });

        var selectedFeature = selectedFeatures[0];

        this.contentLayer.setFeatureActive(selectedFeature);

        html = self.interactionPopup.createPopup(selectedFeature);
        latLng = new L.LatLng(selectedFeature.geometry.coordinates[1], selectedFeature.geometry.coordinates[0]);

        //open popup;
        var popup = L.popup({
            className: selectedFeature.properties.type
            // offset : [0,36]
        }).setLatLng(latLng).setContent(html).openOn(map);
    };

    // _GL_UnFocus(map,slug) {
    //
    //     let self = this;
    //
    //     self.interactionPopup.closePopup();
    // }
    //
    // _JS_UnFocus(map,slug) {
    //
    //     let allMarkers = document.querySelectorAll('.marker');
    //
    //     [].forEach.call(allMarkers, function(marker) {
    //         marker.style.backgroundImage = 'url("/assets/svg/icon-construction-project.svg")';
    //     });
    // }


    return ListReference;
}();

var MapJs = function () {
    function MapJs(config) {
        _classCallCheck(this, MapJs);

        this.config = config;
    }

    MapJs.prototype.create = function create() {

        var self = this;
        L.mapbox.accessToken = self.config.accessToken;
        this._map = L.mapbox.map(self.config.hostContainer).setView([self.config.center[1], self.config.center[0]], self.config.zoom);
        var styleLayer = L.mapbox.styleLayer(self.config.style).addTo(this._map);

        if (self.config.zoomButtonsPosition !== null) {
            console.log(self.config.zoomButtonsPosition);
            var control = L.Control({ 'position': self.config.zoomButtonsPosition });
            self._map.addControl(control);
        } else {
            var _control = L.Control({ 'position': 'top-left' });
            self._map.addControl(_control);
        }

        return this._map;
    };

    return MapJs;
}();

var MapWebGL = function () {
    function MapWebGL(config) {
        _classCallCheck(this, MapWebGL);

        this.config = config;
    }

    MapWebGL.prototype.create = function create() {

        var self = this;

        mapboxgl.accessToken = self.config.accessToken;

        this._map = new mapboxgl.Map({
            container: self.config.hostContainer,
            center: self.config.center,
            zoom: self.config.zoom,
            minZoom: self.config.minZoom,
            maxZoom: self.config.maxZoom,
            style: self.config.style,
            scrollZoom: false,
            pitch: self.config.pitch,
            bearing: self.config.bearing
        });

        var nav = new mapboxgl.NavigationControl();

        if (self.config.zoomButtonsPosition !== null) {
            console.log(self.config);
            self._map.addControl(nav, self.config.zoomButtonsPosition);
        } else {
            self._map.addControl(nav, 'top-left');
        }

        return this._map;
    };

    MapWebGL.prototype._drawContentFromTemplate = function _drawContentFromTemplate() {
        var self = this;
        self._map.on('load', function () {
            self._addIcons(self.templateContent);
        });
    };

    MapWebGL.prototype._drawPoints = function _drawPoints() {

        var self = this;

        self._map.on('load', function () {

            self._map.addSource("points", {
                "type": "geojson",
                "data": self.dataset.points
            });

            self._map.addLayer({
                "id": "references",
                "type": "circle",
                "source": "points",
                "paint": {
                    "circle-color": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', '#4C9630'], ['beperking', '#DC3D50'], ['geluidsmeter', '#4C9630']]
                    },
                    "circle-radius": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 20], ['beperking', 20], ['geluidsmeter', 2]]
                    },
                    "circle-opacity": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 1], ['beperking', 1], ['geluidsmeter', 1]]

                    },
                    "circle-stroke-width": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 0], ['beperking', 0], ['geluidsmeter', 18]]

                    },
                    "circle-stroke-color": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', '#4C9630'], ['beperking', '#DC3D50'], ['geluidsmeter', '#4C9630']]
                    },
                    "circle-stroke-opacity": {
                        property: 'class',
                        type: 'categorical',
                        stops: [['omleiding', 1], ['beperking', 1], ['geluidsmeter', .7]]

                    }
                }
            });

            self._map.addLayer({
                "id": "labels",
                "type": "symbol",
                "source": "points",
                'layout': {
                    'visibility': 'visible',
                    'text-field': '{reference}',
                    "text-font": ["Arial Unicode MS Bold"], // "Cabrito Sans W01 Norm Bold",
                    "text-size": 14,
                    "text-offset": [0, -0.1]
                },
                'paint': {
                    "text-color": "#fff"
                }
            });
        });
    };

    MapWebGL.prototype._initPopup = function _initPopup() {

        var self = this;

        self._map.on('style.load', function () {
            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
        });
    };

    return MapWebGL;
}();

var Points = function () {
    function Points(map, config) {
        _classCallCheck(this, Points);

        this._map = map;
        this._config = config;
    }

    Points.prototype.draw = function draw(points) {

        var self = this;

        self._map.addSource("points", {
            "type": "geojson",
            "data": points
        });

        self._map.addLayer({
            "id": "points",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": {
                    property: 'class',
                    type: 'categorical',
                    stops: [['omleiding', '#4C9630'], ['beperking', '#DC3D50'], ['geluidsmeter', '#4C9630']]
                },
                "circle-radius": {
                    property: 'class',
                    type: 'categorical',
                    stops: [['omleiding', 12], ['beperking', 12], ['geluidsmeter', 2]]
                },
                "circle-opacity": {
                    property: 'class',
                    type: 'categorical',
                    stops: [['omleiding', 1], ['beperking', 1], ['geluidsmeter', 1]]

                },
                "circle-stroke-width": {
                    property: 'class',
                    type: 'categorical',
                    stops: [['omleiding', 0], ['beperking', 0], ['geluidsmeter', 18]]

                },
                "circle-stroke-color": {
                    property: 'class',
                    type: 'categorical',
                    stops: [['omleiding', '#4C9630'], ['beperking', '#DC3D50'], ['geluidsmeter', '#4C9630']]
                },
                "circle-stroke-opacity": {
                    property: 'class',
                    type: 'categorical',
                    stops: [['omleiding', 1], ['beperking', 1], ['geluidsmeter', .7]]

                }
            }
        });
    };

    Points.prototype.zoom = function zoom() {

        var self = this,
            coordinates = self._config.dataset.lines.features[1].geometry.coordinates,
            bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        self._map.fitBounds(bounds, {
            padding: 100
        });
    };

    Points.prototype.addLegend = function addLegend() {

        var legend = document.createElement('div');
        legend.classList.add('legend');
        self.hostContainer.appendChild(legend);
    };

    return Points;
}();

var Map = function () {

    // constructor(element, data, interaction, config) {

    function Map(config) {
        _classCallCheck(this, Map);

        this.config = null;
        this.interactionPopup = null;

        if (config) {
            this.config = config;
        } else {
            this.config = {
                data: null,
                accessToken: 'pk.eyJ1Ijoic2Vuc2lyZSIsImEiOiJjajgxazQwams2dTdoMzBudDR5dWQxOWdlIn0.aNLXT9OdfbIw2MSYCZOuWg',
                style: 'mapbox://styles/sensire/cj81kl7kq4t3q2rmw53w4j1qh',
                hostContainer: 'map',
                center: [6.270672999999988, 51.975337],
                selectedItem: '/locaties/de-hackforterhof-vorden',
                zoom: 10.5,
                minZoom: 9,
                maxZoom: 24,
                filters: ['home', 'area']
            };
        }

        this.config.data = JSON.parse(this.config.data);

        // Make selected item active
        if (this.config.selectedItem) {
            for (var index in this.config.data.features) {
                var feature = this.config.data.features[index];
                if (feature.properties.url === this.config.selectedItem) {
                    this.config.data.features[index].properties.type = this.config.data.features[index].properties.type + '-active';
                    this.config.center = this.config.data.features[index].geometry.coordinates;
                }
            }
        }
    }

    Map.prototype.setZoomButtonsPosition = function setZoomButtonsPosition(position) {
        self.map.addControl(new mapboxgl.Navigation({ position: position }));
    };

    Map.prototype.init = function init() {

        var self = this;

        if (webgl_detect()) {

            /* WebGL */
            var mapWebGL = new MapWebGL(self.config);

            self._map = mapWebGL.create();

            self.interactionPopup = new InteractionPopup(self._map);

            self._contentLayer = new ContentLayer(self._map, self.config, self.interactionPopup);

            self._map.on('style.load', function () {

                self._contentLayer.draw();
                if (self.config.filters) {
                    self.interactionFilters = new InteractionFilters(self._map, self.config, self._contentLayer);
                    self.interactionFilters.init();
                };
            });
        } else {

            /* JS */
            var _self = this;
            var mapJs = new MapJs(_self.config);
            _self._map = mapJs.create();

            this.interactionPopup = new InteractionPopup(_self._map);

            _self._contentLayer = new ContentLayer(_self._map, _self.config, _self.interactionPopup);
            _self._contentLayer.draw(_self.config.data);

            if (this.config.filters) {
                _self.interactionFilters = new InteractionFilters(_self._map, _self.config, _self._contentLayer);
                _self.interactionFilters.init();
            }
        }
		

        if (this.config.referenceList) {
            self.listReference = new ListReference(self._contentLayer, this.interactionPopup);
            if (this.config.data) {
                this.listReference.addEventListeners(self._map);
            }
        }
    };

    return Map;
}();
