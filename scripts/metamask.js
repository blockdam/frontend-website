
class MetaMask {

    constructor() {

        this.html = {};
        this.html.totalSupply = document.querySelector('#general_info span#total_supply');
        this.html.navItem = document.querySelector('nav ul li#metamask');
        this.html.welcome = this.html.navItem.querySelector('#welcome_message');
        this.html.balance = this.html.navItem.querySelector('#personal_info');
        this.html.tooltip = this.html.navItem.querySelector('.tooltip');

        this.bcdRatio = 1000000000000000000;
    }


    init() {

        let self = this;

        self._verifyMetaMask();

        // show tooltip with welcome message for several seconds. Will also hide when user scrolls
        setTimeout( () => {
            self._showTooltip();
        },1000);
        setTimeout( () => {
            self._hideTooltip()
        },9000);
    }

    _verifyMetaMask() {

        let self = this;

        if (!window.ethereum) {  // when user has the metamask addon, the browser tab has a global ethereum object
            // user does not have the metaMask addon
            self.html.welcome.innerHTML = 'Hello, we use metamask to connect to the smart contracts of the DAO'
            // to do explore option to use our own web3 object

        } else {
            // user has the metaMask addon
            // create web3 object
            self.web3 = window.web3 = new Web3(ethereum);

            try {
                // connect to network
                ethereum.enable();
               // await ethereum.enable();
                // check if user is connected to the correct network
                if (web3.version.network  !== '4')  {
                    self.html.welcome.innerHTML = 'Hello, Our smart contracts are on the Rinkeby Testnet';
                    // check if metamask is not locked (private mode)
                } else if (!web3.eth.accounts.length) {
                    self.html.welcome.innerHTML = 'Hello, Metamask may be locked'
                } else {
                    // metaMask is functioning
                    // check if address of active metaMask account is on list of dao members
                    self.userAddress = web3.eth.accounts[0];
                    self.identify(web3.eth.accounts[0]);

                    // connect to smart contracts
                    self.getBCDToken();
                    self.getBCDBondingCurve()
                }
            } catch (error) {

                console.log(error);
                self.html.welcome.innerHTML = 'Hello, Metamask failed to connect';
            }
        }
    }

    _showTooltip() {
        this.html.tooltip.classList.add('visible');
    }

    _hideTooltip() {
        this.html.tooltip.classList.remove('visible');
    }

    identify(address) {

        let self = this,
            url = 'https://blockdam.nl/smc-api/members/' + address;

        axios.get(url)
            .then(function (response) {

                if(response.data !== null) {
                    self.html.welcome.innerHTML = 'Hello ' + response.data.nickName + '! The DAO welcomes you back.';
                } else {
                    self.html.welcome.innerHTML = 'Hello! The DAO welcomes you back.';
                }

                self._showTooltip();
            });
    }


    getBCDToken() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/bcdToken.json',
            bcdTokenAddress = '0xA2F071aFe85e8F3ec51bD9ae5284Bf53204Df1b9';

        axios.get(url)
            .then(function (response) {

                // connect to contract
                self.bcdContract = web3.eth.contract(response.data.abi).at(bcdTokenAddress);

                // request total supply
                if(self.html.totalSupply) {
                    self.bcdContract.totalSupply.call(function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                        if (data) {
                            self.html.totalSupply.innerHTML = data.toNumber() / self.bcdRatio;
                        }
                    });
                }

                // request personal balance
                self.bcdContract.balanceOf(web3.eth.coinbase, function (err, data) {
                    if (err) {
                        console.log(err)
                    }
                    if (data) {
                        let val = data.toNumber() / self.bcdRatio;
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

                // connect to contract
                let bcdBondingCurve = web3.eth.contract(response.data.abi).at(bcdBondingCurveAddress);

            });

    }
}

var metaMask = new MetaMask();
metaMask.init();

