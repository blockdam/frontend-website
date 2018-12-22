let drawArea = function drawArea(data,config) {

    chart.flow = chart.layers.data.selectAll('.flow')
        .data([data])
        .enter()
        .append("path")
        .attr("fill", "#f6f5f2")
        .attr('class', 'flow');

}

let redrawArea = function redrawArea(config) {

    chart.area = d3.area()
        .x0((d,i) => { return chart.xScale(new Date(d.date))})
        .x1((d,i) => { return chart.xScale(new Date(d.date))})
        .y0(chart.yScale(0))
        .y1((d) => {  return chart.yScale(d[config.yParameter]); });

    chart.flow.attr("d", chart.area);
}