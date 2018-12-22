
let drawBars = function drawLine(data,config) {

    bars = layers.data.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function(d) { return yScale(d.value); })
        .attr("height", function(d) { return config.height - yScale(d.value); });
}

let redrawBars = function redrawBars(config,data) {

    barWidth = ((config.width - config.padding.left - config.padding.right) / data.length) - 2;
    bars
        .attr("x", function(d) { return xScale(new Date(d.date)); })
        .attr("width", barWidth);
}