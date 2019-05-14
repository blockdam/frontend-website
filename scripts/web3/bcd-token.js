let BCDToken = function BCDToken() {


    // constants
    const bcdRatio = 1000000000000000000;
    const bcdBondingCurveAddress = '0x307963cb5fce3bfceb30944bf0a65f7a2fe42b7e';
    const bcdTokenAddress = '0xA2F071aFe85e8F3ec51bD9ae5284Bf53204Df1b9';
    // let bcdContract = null;
    // let bcdBondingCurve = null;



    const getContrect = function getContrect() {

        let url = 'https://blockdam.nl/assets/smartcontracts/bcdToken.json';

        axios.get(url)
            .then(function (response) {

                return web3.eth.contract(response.data.abi).at(bcdTokenAddress);
            });
    }

    const getBCDBondingCurve = function getBCDBondingCurve() {

        axios.get('https://blockdam.nl/assets/smartcontracts/bcdBondingCurve.json')
            .then(function (response) {
                bcdBondingCurve = web3.eth.contract(response.data.abi).at(bcdBondingCurveAddress);
            });
    }

    const getSupply = function getSupply(bcdContract) {

        bcdContract.totalSupply.call(function (err, data) {
            if (err) {
                console.log(err)
            }
            if (data) {
                return data.toNumber() / bcdRatio;
            } else {
                return false;
            }

        });

    }

    const getBalance = function getBalance(web3,bcdContract) {
        // request personal balance
        bcdContract.balanceOf(web3.eth.coinbase, function (err, data) {
            if (err) {
                console.log(err)
            }
            if (data) {
                return data.toNumber() / bcdRatio;
            }
        });
    }

    return {
        getContrect : getContrect,
        getBCDBondingCurve : getBCDBondingCurve,
        getSupply : getSupply
    }
}