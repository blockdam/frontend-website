let ChartSVG = function ChartSVG(element,config,svg) {


    let render = function createSVG() {

        svg.body = d3.select(element,config)
            .append('svg')
            .attr('height', (config.height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
            .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
    }

    let redraw = function drawSVG() {
        svg.body.attr('width', (config.containerWidth))
    }

    let layers = function renderLayers() {

        svg.layers.data = svg.body.append('g')
            .attr('class', 'data');
        svg.layers.axis = svg.body.append('g')
            .attr('class', 'axis');
    }

    render();
    layers();

    return {
        redraw, redraw
    }
}



