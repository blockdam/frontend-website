let svg = null;
let layers = {};
let xScale;
let yScale;
let totalAxisGroup;
let timeAxisGroup;
let timeAxis;
let flow;
let area;
let line;
let trend;
let barWidth;
let bars;


let initConfig = function initConfig() {

    let config = {

        margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    };

    return config;
}