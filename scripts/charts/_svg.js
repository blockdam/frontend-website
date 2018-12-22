let renderSVG = function createSVG(element,config) {

    svg = d3.select(element,config)
        .append('svg')
        .attr('height', (config.height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
        .append('g')
        .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
}

let redrawSVG = function drawSVG(config) {
    svg.attr('width', (config.containerWidth))
}

let renderLayers = function renderLayers() {

    layers.data = svg.append('g')
        .attr('class', 'data');

    layers.axis = svg.append('g')
        .attr('class', 'axis');
}
