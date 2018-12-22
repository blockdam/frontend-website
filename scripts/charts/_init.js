let chart = {

    svg : null,
    layers : {},
    xScale : null,
    yScale: null,
    totalAxisGroup : null,
    timeAxisGroup : null,
    timeAxis : null,
    totalAxis: null,
    flow : null,
    area : null,
    line : null,
    trend : null,
    barWidth : null,
    bars : null
}


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