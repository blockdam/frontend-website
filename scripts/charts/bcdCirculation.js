let bcdCirculation = function bcdCirculation(el) {

    let element = el,
        url = 'https://blockdam.nl/smc-api/token/circulation/';

    // create objects
    const chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let scales = chartObjects.scales();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    // configuration
    config.padding.bottom = 10;
    config.margin.bottom = 10;
    config.padding.right = 20;
    config.yParameter = 'value';
    config.alignment = 'left';

    // get dimensions from parent element
    const chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    const chartSVG = ChartSVG(element,config,dimensions,svg);
    const chartScales = ChartScales(config,dimensions,scales);
    const chartAxis = ChartAxis(config,svg);
    chartAxis.drawXAxis();
    chartAxis.drawYAxis();
    const chartBar = ChartBar(config,svg);

    axios.get(url)
        .then(function (response) {

            let data = response.data;

            function redraw() {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // new dimensions mean new scales
                scales = chartScales.reset(dimensions,scales);
                // new scales mean new axis
                chartAxis.redrawXAxis(dimensions,scales,axes);
                chartAxis.redrawYAxis(scales,axes);
                // redraw data
                chartBar.redraw(dimensions,scales,data);
            }

            // with data we can init scales
            scales = chartScales.set(data);
            // width data we can draw items
            chartBar.draw(data);
            // further drawing happens in function that can be repeated.
            redraw();
            // for example on window resize
            window.addEventListener("resize",redraw,false);

            if (response.status !== 200) {
                console.log('foutje bedankt')
            }
        });
}