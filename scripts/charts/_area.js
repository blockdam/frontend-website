let drawArea = function drawArea(data,config) {

    flow = layers.data.selectAll('.flow')
        .data([data])
        .enter()
        .append("path")
        .attr("fill", "#f6f5f2")
        .attr('class', 'flow');

}

let redrawArea = function redrawArea(config) {

    area = d3.area()
        .x0((d,i) => { return xScale(new Date(d.date))})
        .x1((d,i) => { return xScale(new Date(d.date))})
        .y0(yScale(0))
        .y1((d) => {  return yScale(d[config.yParameter]); });

    flow.attr("d", area);
}