let drawLine = function drawLine(data,config) {

    trend = layers.data.append("path")
        .data([data])
        .attr("class", "line");
}

let redrawLine = function redrawLine(data,config) {

    line = d3.line()
        .x(function(d) { return xScale(new Date(d.date)); })
        .y(function(d) { return yScale(d[config.yParameter]); });

    trend
        .attr("d", line);
}
