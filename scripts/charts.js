'use strict';

/**
 *
 */

var Charts = function charts() {

    let svg = null;
    let layers = {};
    let xScale;
    let yScale;
    let colourMap;

    let renderSVG = function createSVG(element,config) {

        svg = d3.select(element,config)
            .append('svg')
            .attr('width', (config.containerWidth + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
            .attr('height', (config.height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
            .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
    }

    let renderLayers = function renderLayers() {

        layers.axis = svg.append('g')
            .attr('class', 'axis');

        layers.bars = svg.append('g')
            .attr('class', 'bars');

    }


    let bcdSupply = function bcdSupply(el,data) {

        let element = el;
        let dataset = data;

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

        config.containerWidth = d3.select(element).node().getBoundingClientRect().width;
        config.height = 100;
        config.width = config.containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;

        renderSVG(element,config);
        renderLayers();

    }


    return {
        bcdSupply : bcdSupply,
        renderSVG : renderSVG,
        renderLayers : renderLayers

    }

}

