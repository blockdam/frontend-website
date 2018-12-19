
class MetaMask {

    constructor() {

        this.html = {};
        this.html.totalSupply = document.querySelector('#general_info span#total_supply');
        this.html.navItem = document.querySelector('nav ul li#metamask');
        this.html.welcome = this.html.navItem.querySelector('#welcome_message');
        this.html.balance = this.html.navItem.querySelector('#personal_info');
        this.html.tooltip = this.html.navItem.querySelector('.tooltip');
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

                if(response.data !== null) {

                    self.html.welcome.innerHTML = 'Hello ' + response.data.nickName + '! The DAO welcomes you back.';

                } else {

                    self.html.welcome.innerHTML = 'Sorry, the DAO did not recognize this address.';
                }

                setTimeout( () => {
                    self.html.tooltip.classList.add('visible');
                },1000);
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
                        self.html.balance.innerHTML = 'Your member address holds ' + val + ' BCD tokens';
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

