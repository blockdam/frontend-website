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

    let renderSVG = function createSVG(element) {

        svg = d3.select(element)
            .append('svg')
            // .attr('width', (this.width + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
            .attr('width', (containerWidth + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
            .attr('height', (height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
            .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
        //     .offset("zero")
    }


    let bcdSupply = function bcdSupply(el,data) {

        let element = el;
        let dataset = data;

        console.log(d3.select(element).node());

        let containerWidth = d3.select(element).node().getBoundingClientRect().width;

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

        let height = 100;
        let width = containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;

        renderSVG(element);

    }


    return {
        bcdSupply : bcdSupply,
        renderSVG : renderSVG

    }

}

