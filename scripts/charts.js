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

    let setScale = function setScale(data,config) {

        console.log(data);

        xScale = d3.scaleTime()
            .range([config.margin.left, config.width - config.margin.right])
            .domain([d3.min(data, d => new Date(d.date)),d3.max(data, d => new Date(d.date))]);
        //
        // // y scale
        yScale = d3.scaleLinear()
            .range([config.height - config.margin.bottom, config.margin.top])
            .domain([0,d3.max(data, d => d.totalGrants)]).nice();

    }

    let renderYAxis = function renderYAxis(config) {

        let totalAxis = d3.axisRight(yScale);

        totalAxis
            .ticks(4);

        layers.axis.append("g")
            .attr('class', 'total-axis')
            .attr("transform", "translate(" + (config.width - config.margin.right - config.padding.right) + ",0)")
            .call(totalAxis);
    }

    let renderXAxis = function renderXAxis(config) {

        let timeAxis = d3.axisBottom(xScale);

        timeAxis
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat("%b"));

        layers.axis.append("g")
            .attr('class', 'time-axis')
            .attr("transform", "translate(" + 0 + "," + (config.height - config.margin.bottom) + ")")
            .call(timeAxis);
    }

    let bcdSupply = function bcdSupply(el,data) {

        let element = el;
        let dataset = data;

        let config = {

            margin: {
                top: 10,
                bottom: 20,
                left: 0,
                right: 0
            },

            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 20
            }
        };

        config.containerWidth = d3.select(element).node().getBoundingClientRect().width;
        config.height = 120;
        config.width = config.containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;

        renderSVG(element,config);
        renderLayers();
        setScale(data,config);
        renderYAxis(config);
        renderXAxis(config);

    }


    return {
        bcdSupply : bcdSupply,
        renderSVG : renderSVG,
        renderLayers : renderLayers,
        setScale : setScale,
        renderYAxis : renderYAxis,
        renderXAxis : renderXAxis
    }

}

