
class MetaMask {

    constructor() {

        this.html = {}
        this.html.totalSupply = document.querySelector('#general_info span#total_supply');
        this.html.navItem = document.querySelector('nav ul li#metamask');
        this.html.nickName = document.querySelector('nav ul li#metamask #welcome_message span');
    }


    init() {

        let self = this;

            if (window.ethereum) {
                window.web3 = new Web3(ethereum);

                ethereum.enable();

                this.html.navItem.style.display = 'flex';

                if (web3.eth.accounts.length) {

                    self.identify(web3.eth.accounts[0]);

                } else {
                    console.log('metamask may be locked. no active account');
                }

                if (web3.version.network  !== '4')  {
                    document.querySelector('#network_warning').style.display = 'block';
                }


                // web3.currentProvider.publicConfigStore.on('update', callback);

                self.getBCDToken();
                self.getBCDBondingCurve()

            }

            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
    }

    identify(address) {

        console.log(address);

        let self = this,
            url = 'https://blockdam.nl/smc-api/members/' + address;

        axios.get(url)
            .then(function (response) {

                console.log(response);

                self.html.nickName.innerHTML = response.data.nickName;
            });
    }


    getBCDToken() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/bcdToken.json',
            bcdTokenAddress = '0xA2F071aFe85e8F3ec51bD9ae5284Bf53204Df1b9';

        axios.get(url)
            .then(function (response) {

                self.bcdContract = web3.eth.contract(response.data.abi).at(bcdTokenAddress);

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
            url = 'https://blockdam.nl/assets/smartcontracts/bcdBondingCurve.json',
            bcdBondingCurveAddress = '0x307963cb5fce3bfceb30944bf0a65f7a2fe42b7e';

        axios.get(url)
            .then(function (response) {

                let bcdBondingCurve = web3.eth.contract(response.data.abi).at(bcdBondingCurveAddress);

                console.log(bcdBondingCurve);
            });

    }
}

var metaMask = new MetaMask();
metaMask.init();

