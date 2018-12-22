let renderYAxis = function renderYAxis(config) {

    chart.totalAxis = d3.axisRight(chart.yScale);

    chart.totalAxis
        .ticks(2);

    chart.totalAxisGroup = chart.layers.axis.append("g")
        .attr('class', 'total-axis')
        .call(chart.totalAxis);

}

let redrawYAxis = function redrawYAxis(config) {

    chart.totalAxisGroup.attr("transform", function()  {
        if (config.alignment == 'right')  {
            return "translate(" + (config.width - config.margin.right - config.padding.right) + ",0)"
        }
        else { return "translate(0,0)" }
    });
}


let renderXAxis = function renderXAxis(config) {

    chart.timeAxisGroup = chart.layers.axis.append("g")
        .attr('class', 'time-axis')
        .attr("transform", "translate(" + 0 + "," + config.height + ")");

}

let redrawXAxis = function redrawXAxis(config) {

    chart.timeAxis = d3.axisBottom(chart.xScale);

    chart.timeAxis
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%b"));

    chart.timeAxisGroup.call(chart.timeAxis);
}