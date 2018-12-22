let ChartLine = function ChartLine(config,svg) {

    let draw = function draw(data) {

        svg.trend = svg.layers.data.append("path")
            .data([data])
            .attr("class", "line");
    }

    let redraw = function redraw(scales) {

        svg.line = d3.line()
            .x(function(d) { return scales.xTime(new Date(d.date)); })
            .y(function(d) { return scales.yLinear(d[config.yParameter]); });

        svg.trend
            .attr("d", svg.line);
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
