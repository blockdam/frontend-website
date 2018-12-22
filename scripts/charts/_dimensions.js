let ChartDimensions = function ChartDimensions(element) {

    get = function get(config) {

        config.containerWidth = d3.select(element).node().getBoundingClientRect().width - config.margin.left - config.margin.right;
        config.containerHeight = d3.select(element).node().getBoundingClientRect().height - config.margin.top - config.margin.bottom;
        config.height = config.containerHeight - config.padding.top - config.padding.bottom;
        config.width = config.containerWidth - config.padding.left - config.padding.right;

        return config;

    }
}