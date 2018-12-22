let ChartDimensions = function ChartDimensions(element,config) {

    let get = function get(dimensions) {

        dimensions.containerWidth = d3.select(element).node().getBoundingClientRect().width - config.margin.left - config.margin.right;
        dimensions.containerHeight = d3.select(element).node().getBoundingClientRect().height - config.margin.top - config.margin.bottom;
        dimensions.height = config.containerHeight - config.padding.top - config.padding.bottom;
        dimensions.width = config.containerWidth - config.padding.left - config.padding.right;

        return dimensions;

    }

    return {

        get : get
    }
}