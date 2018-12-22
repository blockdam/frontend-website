let bcdCirculation = function bcdCirculation(el) {

    let element = el,
        url = 'https://blockdam.nl/smc-api/token/circulation/';

    let config = initConfig();
    config.padding.bottom = 10;
    config.margin.bottom = 10;
    config.padding.right = 20;

    config = getDimensions(config,element);

    config.yParameter = 'value';
    config.alignment = 'left';

    // drawArea(data);

    axios.get(url)
        .then(function (response) {

            function redrawBcdCirculation() {

                config = getDimensions(config,element);

                redrawSVG(config);
                resetScale(config,response.data);
                redrawYAxis(config);
                redrawXAxis(config);
                redrawBars(config,response.data);
            }

            renderSVG(element,config);
            renderLayers();
            setScale(response.data,config);
            renderYAxis(config);
            renderXAxis(config);
            drawBars(response.data,config);
            redrawBcdCirculation(response.data,config);

            window.addEventListener("resize", redrawBcdCirculation,false);

            if (response.status !== 200) {
                console.log('foutje bedankt')
            }
        });
}