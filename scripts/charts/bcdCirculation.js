let bcdCirculation = function bcdCirculation(el) {

    let element = el,
        url = 'https://blockdam.nl/smc-api/token/circulation/';

    const chartObjects = ChartObjects();

    let svg = chartObjects.svg();
    let scales = chartObjects.scales();
    let config = chartObjects.config();
    config.padding.bottom = 10;
    config.margin.bottom = 10;
    config.padding.right = 20;

    const chartDimensions = ChartDimensions(element);
    // make separate dimensions object?
    config = chartDimensions.get(config);

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

                config = getDimensions(config,element);

                chartSVG.redraw(config);
                scales = chartScales.reset(config);
                chartAxis.redrawXAxis(scales);
                chartAxis.redrawYAxis(scales);
                chartBar.redraw(config);
            }

            chartScales.set(data);
            chartBar.draw(data);

            redraw();

            window.addEventListener("resize", redraw,false);

            if (response.status !== 200) {
                console.log('foutje bedankt')
            }
        });
}