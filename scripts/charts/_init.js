let ChartObjects = function ChartObjects() {

    config = function config() {

        return {
            margin: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        };
    }

    svg = function svg(){

        return {
            body : null,
            layers : {},
            totalAxisGroup : null,
            timeAxisGroup : null,
            timeAxis : null,
            totalAxis: null,
            flow : null,
            area : null,
            line : null,
            trend : null,
            bars : null
        }
    }

    scales = function scales() {

        return {
            xTime : null,
            yLinear: null,
        }

    }

    return {
        config : config,
        svg : svg,
        scales : scales

    }
}


