let bcdSupply = function bcdSupply(el) {

    let svg = null;
    let layers = {};
    let xScale;
    let yScale;
    let totalAxisGroup;
    let timeAxisGroup;
    let timeAxis;
    let flow;
    let area;
    let line;
    let trend;
    let barWidth;
    let bars;

    let element = el,
        url = 'https://blockdam.nl/smc-api/token/balance';

    let config = initConfig();

    config.margin.bottom = 10;
    config.padding.bottom = 10;
    config.padding.right = 20;


    config = getDimensions(config,element);

    config.yParameter = 'totalGrants';
    config.alignment = 'left';

    axios.get(url)
        .then(function (response) {

            function redrawBcdSupply() {

                config = getDimensions(config,element);

                redrawSVG(config);
                resetScale(config,response.data);
                redrawYAxis(config);
                redrawXAxis(config);
                redrawArea(config);
                // redrawLine(response.data,config);
            }

            renderSVG(element,config);
            renderLayers();
            setScale(response.data, config);
            renderYAxis(config);
            renderXAxis(config);
            drawArea(response.data,config);
            // drawLine(response.data, config);
            redrawBcdSupply();

            window.addEventListener("resize", redrawBcdSupply, false);

            if (response.status !== 200) {
                console.log('foutje bedankt')
            }
        });

}