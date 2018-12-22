let ChartBar = function ChartBar(config,svg,scales) {

    let draw = function draw(data) {

        svg.bars = svg.layers.data.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar");

    }

    let redraw = function redraw(scales) {

        let barWidth = ((config.width - config.padding.left - config.padding.right) / data.length) - 2;

        svg.bars
            .attr("x", function(d) { return scales.xTime(new Date(d.date)); })
            .attr("y", function(d) { return scales.yLinear(d.value); })
            .attr("height", function(d) { return config.height - scales.yLinear(d.value); })
            .attr("width", barWidth);
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


