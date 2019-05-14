let BCDToken = function BCDToken() {


    // constants
    const bcdRatio = 1000000000000000000;
    const bcdBondingCurveAddress = '0x307963cb5fce3bfceb30944bf0a65f7a2fe42b7e';
    const bcdTokenAddress = '0xA2F071aFe85e8F3ec51bD9ae5284Bf53204Df1b9';
    // let bcdContract = null;
    let bcdBondingCurve = null;



    const getContract = async function getContract() {

        let response = await axios.get('https://blockdam.nl/assets/smartcontracts/bcdToken.json');
        let abi = await response.data.abi;
        let contract = await web3.eth.contract(response.data.abi).at(bcdTokenAddress);
        return contract;

    }

    const getBCDBondingCurve = async function getBCDBondingCurve() {

        let response = await axios.get('https://blockdam.nl/assets/smartcontracts/bcdBondingCurve.json');
        let abi = await response.data.abi;

        bcdBondingCurve = await web3.eth.contract(response.data.abi).at(bcdBondingCurveAddress);

    }

    const getSupply = async function getSupply(bcdContract) {

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

    const getBalance = async function getBalance(web3,bcdContract) {
        // request personal balance
        let data = await bcdContract.balanceOf(window.web3.eth.coinbase).call();

        console.log(data);

        if (data) {
            return data.toNumber() / bcdRatio;
        }

    }

    return {
        getContract : getContract,
        getBCDBondingCurve : getBCDBondingCurve,
        getSupply : getSupply
    }
}