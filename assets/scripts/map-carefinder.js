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
function ieVersion() {
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > 0) return 11;else if (ua.indexOf("Trident/6.0") > 0) return 10;else if (ua.indexOf("Trident/5.0") > 0) return 9;else return 0; // not IE9, 10 or 11
}

!window.ActiveXObject && "ActiveXObject";
function isIE11() {
    return !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
}

var Directions = function () {
    function Directions(map, config) {
        _classCallCheck(this, Directions);

        this._map = map;
        this.config = config;
    }

    Directions.prototype.init = function init() {};

    Directions.prototype.draw = function draw(session) {

        console.log(session);

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
                "icon-size": 1.25,
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
                "icon-size": 1.25,
                "icon-image": "locatie_selected",
                "icon-padding": 0,
                "icon-allow-overlap": true,
                "visibility": "visible"
            }
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
                'line-color': 'rgb(238,127,0)',
                'line-width': 4,
                'line-opacity': 1
            }
        }, "address");

        // Geographic coordinates of the LineString
        var coordinates = session.directions.geometry.coordinates;

        // Pass the first coordinates in the LineString to `lngLatBounds` &
        // wrap each coordinate pair in `extend` to include them in the bounds
        // result. A variation of this technique could be applied to zooming
        // to the bounds of multiple Points or Polygon geomteries - it just
        // requires wrapping all the coordinates with the extend method.
        var bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        self._map.fitBounds(bounds, {
            padding: 20
        });

        var contactPopup = self._createContactPopup(session.contact);

        self.contactPopup = new mapboxgl.Popup({ closeButton: false }).setLngLat(session.contact.geometry.coordinates).setHTML(contactPopup).addTo(self._map);
        self.contactPopup._container.classList.add('contact');
    };

    Directions.prototype._createContactPopup = function _createContactPopup(item) {

        return ["<div>", item.properties.name, "</div>", "<div class='line'>", item.properties.address, "</div>"].join('\n');
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
        self._map.addControl(nav, 'top-left');

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

var CarefinderMap = function () {
    function CarefinderMap() {
        _classCallCheck(this, CarefinderMap);

        this.config = {
            data: null,
            accessToken: 'pk.eyJ1Ijoic2Vuc2lyZSIsImEiOiJjajgxazQwams2dTdoMzBudDR5dWQxOWdlIn0.aNLXT9OdfbIw2MSYCZOuWg',
            style: 'mapbox://styles/sensire/cj81kl7kq4t3q2rmw53w4j1qh',
            hostContainer: 'carefinder-map',
            center: [6.270672999999988, 51.975337],
            zoom: 10.5,
            minZoom: 9,
            maxZoom: 24,
            pitch: 0,
            bearing: 0
        };
    }

    CarefinderMap.prototype.init = function init() {

        var self = this;

        if (webgl_detect()) {

            /* WebGL */
            var mapWebGL = new MapWebGL(self.config);
            self._map = mapWebGL.create();
            self._directions = new Directions(self._map, self.config);
            self._map.on('style.load', function () {});
        } else {

            /* JS */
            var _self = this;
            var mapJs = new MapJs(_self.config);
            _self._map = mapJs.create();
        }
    };

    CarefinderMap.prototype.drawDirections = function drawDirections(session) {
        var self = this;
        self._directions.draw(session);
    };

    return CarefinderMap;
}();

var carefinderMap = new CarefinderMap();
carefinderMap.init();