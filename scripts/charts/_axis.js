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
        .attr("transform", "translate(" + 0 + "," + config.height + ")");

}

let redrawXAxis = function redrawXAxis(config) {

    timeAxis = d3.axisBottom(xScale);

    timeAxis
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%b"));

    timeAxisGroup.call(timeAxis);
}