
class MetaMask {

    constructor() {

        this.bcdTokenAddress = '0xA2F071aFe85e8F3ec51bD9ae5284Bf53204Df1b9';
        this.bcdBondingCurveAddress = '0x307963cb5fce3bfceb30944bf0a65f7a2fe42b7e';

        this.metaMask = {};
        this.bcd = {};

        this.bcd.eventList = [];

        this.html = {}
        this.html.totalSupply = document.querySelector('#general_info span#total_supply');
    }


    init() {

        let self = this;

            if (window.ethereum) {
                window.web3 = new Web3(ethereum);

                ethereum.enable();

                document.querySelector('nav ul li#metamask #welcome_message span').innerHTML = web3.eth.coinbase;

                if (web3.version.network  !== '4')  {
                    document.querySelector('#network_warning').style.display = 'block';
                }

                // web3.currentProvider.publicConfigStore.on('update', callback);

                self.getBCDToken();

            }

            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

                return false;
            }
    }

    getBCDToken() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/bcdToken.json';

        axios.get(url)
            .then(function (response) {

                self.bcdContract = web3.eth.contract(response.data.abi).at(self.bcdTokenAddress);

                if(self.html.totalSupply) {
                    self.bcdContract.totalSupply.call(function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                        if (data) {
                            self.html.totalSupply.innerHTML = data.toNumber() / 1000000000000000000;
                        }
                    });
                }

                self.bcdContract.balanceOf(web3.eth.coinbase, function (err, data) {
                    if (err) {
                        console.log(err)
                    }
                    if (data) {
                        let val = data.toNumber() / 1000000000000000000;
                        document.querySelector('#personal_info').style.display = 'flex';
                        document.querySelector('#personal_info span').innerHTML = val;
                    }
                });

            });


    }

    getBCDBondingCurve() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/bcdBondingCurve.json';

        axios.get(url)
            .then(function (response) {

                let bcdBondingCurve = web3.eth.contract(response.data.abi).at(self.bcdBondingCurveAddress);

                console.log(bcdBondingCurve);
            });

    }
}

var metaMask = new MetaMask();
metaMask.init();

