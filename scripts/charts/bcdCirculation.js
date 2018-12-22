let bcdCirculation = function bcdCirculation(el) {

    let element = el,
        url = 'https://blockdam.nl/smc-api/token/circulation/';

    const chartObjects = ChartObjects();

    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let scales = chartObjects.scales();

    config.padding.bottom = 10;
    config.margin.bottom = 10;
    config.padding.right = 20;

    const chartDimensions = ChartDimensions(element,config);
    // make separate dimensions object?
    dimensions = chartDimensions.get(dimensions);

    config.yParameter = 'value';
    config.alignment = 'left';

    const chartSVG = ChartSVG(element,config,svg);
    const chartScales = ChartScales(config,svg);
    const chartAxis = ChartAxis(config,svg);
    chartAxis.drawXAxis();
    chartAxis.drawYAxis();
    const chartBar = ChartBar(config,svg);


    axios.get(url)
        .then(function (response) {

            let data = response.data;

            function redraw() {

                config = chartDimensions.get(config,element);

                chartSVG.redraw(config);
                scales = chartScales.reset(config,scales);
                chartAxis.redrawXAxis(scales);
                chartAxis.redrawYAxis(scales);
                chartBar.redraw(scales,data);
            }

            scales = chartScales.set(data);
            chartBar.draw(data);

            redraw();

            window.addEventListener("resize", redraw,false);

            if (response.status !== 200) {
                console.log('foutje bedankt')
            }
        });
}