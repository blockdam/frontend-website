
let drawBars = function drawLine(data,config) {

    chart.bars = layers.data.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function(d) { return chart.yScale(d.value); })
        .attr("height", function(d) { return config.height - chart.yScale(d.value); });
}

let redrawBars = function redrawBars(config,data) {

    barWidth = ((config.width - config.padding.left - config.padding.right) / data.length) - 2;
    chart.bars
        .attr("x", function(d) { return chart.xScale(new Date(d.date)); })
        .attr("width", barWidth);
}