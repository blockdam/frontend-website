let ChartAxis = function ChartAxis(config,svg) {

    let drawXAxis = function drawXAxis() {

        svg.timeAxisGroup = svg.layers.axis.append("g")
            .attr('class', 'time-axis')
            .attr("transform", "translate(" + 0 + "," + config.height + ")");
    }

    let redrawXAxis = function redrawXAxis(scales) {

        svg.timeAxis = d3.axisBottom(scales.xTime);

        svg.timeAxis
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat("%b"));

        svg.timeAxisGroup.call(svg.timeAxis);
    }

    let drawYAxis = function drawYAxis() {

        svg.totalAxisGroup = svg.layers.axis.append("g")
            .attr('class', 'total-axis')

    }

    let redrawYAxis = function redrawYAxis(scales) {

        svg.totalAxis = d3.axisRight(scales.yLinear);

        svg.totalAxis
            .ticks(2);

        svg.totalAxisGroup
            .call(svg.totalAxis);

    }

    return {
        drawXAxis : drawXAxis,
        redrawXAxis : redrawXAxis,
        drawYAxis : drawYAxis,
        redrawYAxis : redrawYAxis
    }
}

