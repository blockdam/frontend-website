'use strict';

/**
 *
 */

var Charts = function charts() {

    let svg = null;
    let layers = {};
    let xScale;
    let yScale;
    let totalAxisGroup;
    let timeAxisGroup;
    let timeAxis;
    let flow;
    let area;
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

    let getDimensions = function getDimensions(config) {

        config.containerWidth = d3.select(element).node().getBoundingClientRect().width;
        config.height = 120;
        config.width = config.containerWidth - config.margin.left - config.margin.right;

        return config;
    }

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
            .attr('class', 'bars');

        layers.axis = svg.append('g')
            .attr('class', 'axis');
    }

    let setScale = function setScale(data,config) {

        xScale = d3.scaleTime()

        yScale = d3.scaleLinear()
            .range([config.height - config.margin.bottom, config.margin.top])
            .domain([0,d3.max(data, d => d[config.yParameter])]).nice();
    }

    let resetScale = function resetScale(config,data) {

        console.log(config.width);

        let endDate = moment().add(2,'days');

        xScale
            .domain([d3.min(data, d => new Date(d.date)),endDate])
            .range([config.padding.left, config.width - config.padding.right]);
    }

    let renderYAxis = function renderYAxis(config) {

        let totalAxis = d3.axisRight(yScale);

        totalAxis
            .ticks(2);

        totalAxisGroup = layers.axis.append("g")
            .attr('class', 'total-axis')
            .call(totalAxis);

    }

    let redrawYAxis = function redrawYAxis(config) {

        totalAxisGroup.attr("transform", function()  {
            if (config.alignment == 'right')  {
                return "translate(" + (config.width - config.margin.right - config.padding.right) + ",0)"
            }
            else { return "translate(0,0)" }
        });
    }


    let renderXAxis = function renderXAxis(config) {

        timeAxisGroup = layers.axis.append("g")
            .attr('class', 'time-axis')
            .attr("transform", "translate(" + 0 + "," + (config.height - config.margin.bottom) + ")");

    }

    let redrawXAxis = function redrawXAxis(config) {

        timeAxis = d3.axisBottom(xScale);

        timeAxis
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat("%b"));

        timeAxisGroup.call(timeAxis);
    }

    let drawLine = function drawLine(data,config) {

        var line = d3.line()
            .x(function(d) { return xScale(new Date(d.date)); })
            .y(function(d) { return yScale(d[config.yParameter]); });

        layers.data.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", line);

    }

    let drawArea = function drawArea(data,config) {

        area = d3.area()
            .x0((d,i) => { return xScale(new Date(d.date))})
            .x1((d,i) => { return xScale(new Date(d.date))})
            .y0(yScale(0))
            .y1((d) => {  return yScale(d[config.yParameter]); }); //


        flow = layers.data.selectAll('.flow')
            .data([data])
            .enter()
            .append("path")
            .attr("fill", "#f6f5f2")
            .attr('class', 'flow');

    }

    let redrawArea = function redrawArea() {

        flow.attr("d", area);
    }

    let drawBars = function drawLine(data,config) {

        bars = layers.data.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) { return config.height - config.margin.bottom - yScale(d.value); });
    }

    let redrawBars = function redrawBars(config,data) {

        barWidth = ((config.width - config.margin.left - config.margin.right) / data.length) - 2;
        bars
            .attr("x", function(d) { return xScale(new Date(d.date)); })
            .attr("width", barWidth);
    }

    let bcdSupply = function bcdSupply(el) {

        let element = el,
            url = 'https://blockdam.nl/smc-api/token/balance';

        let config = initConfig();

        config.padding.bottom = 20;
        config.padding.right = 20;


        config = getDimensions(config);

        config.yParameter = 'totalGrants';
        config.alignment = 'right';

        axios.get(url)
            .then(function (response) {

                function redrawBcdSupply() {

                    config = getDimensions(config);

                    redrawSVG(config);
                    resetScale(config,response.data);
                    redrawYAxis(config);
                    redrawXAxis(config);
                    redrawArea(response.data);
                }

                renderSVG(element,config);
                renderLayers();
                setScale(response.data, config);
                renderYAxis(config);
                renderXAxis(config);
                drawArea(response.data, config);
                redrawBcdSupply();

                window.addEventListener("resize", redrawBcdSupply, false);

                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
            });

    }

    let bcdCirculation = function bcdCirculation(el) {

        let element = el,
            url = 'https://blockdam.nl/smc-api/token/circulation/';

        let config = initConfig();
        config.padding.bottom = 20;
        config.padding.right = 20;

        config = getDimensions(config);

        config.yParameter = 'value';
        config.alignment = 'left';

        // drawArea(data);

        axios.get(url)
            .then(function (response) {

                function redrawBcdCirculation() {

                    config = getDimensions(config);

                    redrawSVG(config);
                    resetScale(config,response.data);
                    redrawYAxis(config);
                    redrawXAxis(config);
                    redrawBars(config,response.data);
                }

                renderSVG(element,config);
                renderLayers();
                setScale(response.data,config);
                renderYAxis(config);
                renderXAxis(config);
                drawBars(response.data,config);
                redrawBcdCirculation(response.data,config);

                window.addEventListener("resize", redrawBcdCirculation,false);

                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
            });
    }


    // let bcdEthValue = function bcdEthValue(el) {
    //
    //     let element = el,
    //         url = 'https://blockdam.nl/smc-api/token/balance/';
    //
    //
    //     let config = {
    //
    //         margin: {
    //             top: 10,
    //             bottom: 20,
    //             left: 0,
    //             right: 20
    //         },
    //
    //         padding: {
    //             top: 0,
    //             bottom: 0,
    //             left: 0,
    //             right: 0
    //         }
    //     };
    //
    //     config.containerWidth = d3.select(element).node().getBoundingClientRect().width;
    //     config.height = 120;
    //     config.width = config.containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;
    //
    //     config.yParameter = 'ethValue';
    //     config.alignment = 'left';
    //
    //     // drawArea(data);
    //
    //     axios.get(url)
    //         .then(function (response) {
    //
    //             renderSVG(element,config);
    //             renderLayers();
    //             setScale(response.data,config);
    //             renderYAxis(config);
    //             renderXAxis(config);
    //             drawLine(response.data,config);
    //
    //             if (response.status !== 200) {
    //                 console.log('foutje bedankt')
    //             }
    //         });
    // }


    return {
        bcdSupply : bcdSupply,
        bcdCirculation : bcdCirculation,
        renderSVG : renderSVG,
        renderLayers : renderLayers,
        setScale : setScale,
        renderYAxis : renderYAxis,
        renderXAxis : renderXAxis,
        drawLine : drawLine,
        drawArea : drawArea
    }

}

