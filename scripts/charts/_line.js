let drawLine = function drawLine(data,config) {

    chart.trend = chart.layers.data.append("path")
        .data([data])
        .attr("class", "line");
}

let redrawLine = function redrawLine(data,config) {

    chart.line = d3.line()
        .x(function(d) { return chart.xScale(new Date(d.date)); })
        .y(function(d) { return chart.yScale(d[config.yParameter]); });

    chart.trend
        .attr("d", chart.line);
}
