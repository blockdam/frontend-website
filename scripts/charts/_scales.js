let ChartScales = function ChartScales(config,scales) {

    let set = function set(data) {

        let endDate = moment().add(2,'days');

        scales.xTime = d3.scaleTime()
            .domain([d3.min(data, d => new Date(d.date)),endDate]);

        scales.yLinear = d3.scaleLinear()
            .range([config.height, config.margin.top + config.padding.top])
            .domain([0,d3.max(data, d => d[config.yParameter])]).nice();
    }


    let reset = function reset(config) {

        scales.xTime
            .range([config.margin.left + config.padding.left, config.width]);
    }

    return {
        set : set,
        reset : reset,
    }
}


