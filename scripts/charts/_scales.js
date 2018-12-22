let ChartScales = function ChartScales(config,dimensions,scales) {

    let set = function set(data) {

        let endDate = moment().add(2,'days');

        scales.xTime = d3.scaleTime()
            .domain([d3.min(data, d => new Date(d.date)),endDate]);

        scales.yLinear = d3.scaleLinear()
            .range([dimensions.height, config.margin.top + config.padding.top])
            .domain([0,d3.max(data, d => d[config.yParameter])]).nice();

        return scales;
    }


    let reset = function reset(dimensions,newScales) {

        newScales.xTime
            .range([config.margin.left + config.padding.left, dimensions.width]);

        return newScales;
    }

    return {
        set : set,
        reset : reset,
    }
}


