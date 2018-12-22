let renderSVG = function createSVG(element,config) {

    chart.svg = d3.select(element,config)
        .append('svg')
        .attr('height', (config.height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
        .append('g')
        .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
}

let redrawSVG = function drawSVG(config) {
    chart.svg.attr('width', (config.containerWidth))
}

let renderLayers = function renderLayers() {

    chart.layers.data = chart.svg.append('g')
        .attr('class', 'data');

    chart.layers.axis = chart.svg.append('g')
        .attr('class', 'axis');
}
