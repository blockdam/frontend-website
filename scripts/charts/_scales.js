
let setScale = function setScale(data,config) {

    let endDate = moment().add(2,'days');

    chart.xScale = d3.scaleTime()
        .domain([d3.min(data, d => new Date(d.date)),endDate]);

    chart.yScale = d3.scaleLinear()
        .range([config.height, config.margin.top + config.padding.top])
        .domain([0,d3.max(data, d => d[config.yParameter])]).nice();
}

let resetScale = function resetScale(config,data) {

    chart.xScale
        .range([config.margin.left + config.padding.left, config.width]);
}