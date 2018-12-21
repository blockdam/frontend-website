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

    let renderSVG = function createSVG(element,config) {

        svg = d3.select(element,config)
            .append('svg')
            .attr('height', (config.height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
            .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

            redrawSVG(config);
    }

    let redrawSVG = function drawSVG(config) {
        svg.attr('width', (config.containerWidth + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
    }

    let renderLayers = function renderLayers() {

        layers.data = svg.append('g')
            .attr('class', 'bars');

        layers.axis = svg.append('g')
            .attr('class', 'axis');
    }

    let setScale = function setScale(data,config) {

        let endDate = moment().add(2,'days');

        xScale = d3.scaleTime()
            .domain([d3.min(data, d => new Date(d.date)),endDate]);

        yScale = d3.scaleLinear()
            .range([config.height - config.margin.bottom, config.margin.top])
            .domain([0,d3.max(data, d => d[config.yParameter])]).nice();

        resetScale(config);
    }

    let resetScale = function resetScale(config) {

        xScale.range([config.margin.left, config.width - config.margin.right])
    }



    let renderYAxis = function renderYAxis(config) {

        let totalAxis = d3.axisRight(yScale);

        totalAxis
            .ticks(2);

        totalAxisGroup = layers.axis.append("g")
            .attr('class', 'total-axis')
            .call(totalAxis);

        redrawYAxis(config);
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

        timeAxis = d3.axisBottom(xScale);

        timeAxis
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat("%b"));

        timeAxisGroup = layers.axis.append("g")
            .attr('class', 'time-axis')
            .attr("transform", "translate(" + 0 + "," + (config.height - config.margin.bottom) + ")");

        redrawXAxis(config);
    }

    let redrawXAxis = function redrawXAxis(config) {

        // timeAxis = d3.axisBottom(xScale);
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

        let area = d3.area()
            // .curve(d3.curveCardinal)
            .x0((d,i) => { return xScale(new Date(d.date))})
            .x1((d,i) => { return xScale(new Date(d.date))})
            .y0(yScale(0))
            .y1((d) => { return yScale(d[config.yParameter]); });


        layers.data.selectAll('.flow')
            .data([data])
            .enter()
            .append("path")
            .attr("d", area)
            .attr("fill", "#f6f5f2")
            .attr('class', 'flow');
    }

    let drawBars = function drawLine(data,config) {

        let barWidth = ((config.width - config.margin.left - config.margin.right) / data.length) - 2;

        layers.data.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(new Date(d.date)); })
            .attr("width", barWidth )
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) { return config.height - config.margin.bottom - yScale(d.value); });

    }

    let bcdSupply = function bcdSupply(el) {

        let element = el,
            url = 'https://blockdam.nl/smc-api/token/balance';

        let config = {

            margin: {
                top: 10,
                bottom: 20,
                left: 0,
                right: 20
            },

            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        };

        config.containerWidth = d3.select(element).node().getBoundingClientRect().width;
        config.height = 120;
        config.width = config.containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;

        config.yParameter = 'totalGrants';
        config.alignment = 'right';

        axios.get(url)
            .then(function (response) {

                function redrawBcdSupply() {

                    redrawSVG(config);
                    resetScale(config);
                    redrawYAxis(config);
                    redrawXAxis(config);
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

        let config = {

            margin: {
                top: 10,
                bottom: 20,
                left: 0,
                right: 20
            },

            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        };

        config.containerWidth = d3.select(element).node().getBoundingClientRect().width;
        config.height = 120;
        config.width = config.containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;

        config.yParameter = 'value';
        config.alignment = 'left';

        // drawArea(data);

        axios.get(url)
            .then(function (response) {

                function redrawBcdCirculation() {
                    setScale(response.data,config);
                    drawBars(response.data,config);
                    renderYAxis(config);
                    renderXAxis(config);
                }

                renderSVG(element,config);
                renderLayers();
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

