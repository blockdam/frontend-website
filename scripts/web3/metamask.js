
let MetaMask = function MetaMask() {

    const donate = Donate();

    // constants
    const bcdRatio = 1000000000000000000;
    const bcdBondingCurveAddress = '0x307963cb5fce3bfceb30944bf0a65f7a2fe42b7e';
    const bcdTokenAddress = '0xA2F071aFe85e8F3ec51bD9ae5284Bf53204Df1b9';

    // elements
    let html = {};
    html.totalSupply = document.querySelector('#general_info span#total_supply');
    html.navItem = document.querySelector('nav ul li#metamask');
    html.welcome = html.navItem.querySelector('#welcome_message');
    html.balance = html.navItem.querySelector('#personal_info');
    html.tooltip = html.navItem.querySelector('.tooltip');

    // objects
    let web3 = null;
    let userAddress = null;
    let bcdContract = null;
    let bcdBondingCurve = null;

    const _verifyMetaMask = function _verifyMetaMask() {

        if (!window.ethereum) {  // when user has the metamask addon, the browser tab has a global ethereum object
            // user does not have the metaMask addon
            html.welcome.innerHTML = 'Hello, we use metamask to connect to the smart contracts of the DAO'
            // to do explore option to use our own web3 object

        } else {
            // user has the metaMask addon
            // create web3 object
            web3 = window.web3 = new Web3(ethereum);

            try {
                // connect to network
                ethereum.enable();
               // await ethereum.enable();
                // check if user is connected to the correct network
                if (web3.version.network  !== '4')  {
                    html.welcome.innerHTML = 'Hello, Our smart contracts are on the Rinkeby Testnet';
                    // check if metamask is not locked (private mode)
                } else if (!web3.eth.accounts.length) {
                    html.welcome.innerHTML = 'Hello, Metamask may be locked'
                } else {
                    // metaMask is functioning
                    // check if address of active metaMask account is on list of dao members
                    userAddress = web3.eth.accounts[0];
                    identify(web3.eth.accounts[0]);
                    console.log(userAddress);

                    // connect to smart contracts
                    getBCDToken();
                    getBCDBondingCurve()
                }
            } catch (error) {

                console.log(error);
                html.welcome.innerHTML = 'Hello, Metamask failed to connect';
            }
        }
    }

    const _showTooltip = function _showTooltip() {
        html.tooltip.classList.add('visible');
    }

    const _hideTooltip = function _hideTooltip() {
        html.tooltip.classList.remove('visible');
    }

    const identify = function identify(address) {

        let self = this,
            url = 'https://blockdam.nl/smc-api/members/' + address;

        axios.get(url)
            .then(function (response) {

                if(response.data !== null) {
                    html.welcome.innerHTML = 'Hello ' + response.data.nickName + '! The DAO welcomes you back.';
                } else {
                    html.welcome.innerHTML = 'Hello! The DAO welcomes you back.';
                }

                _showTooltip();
            });
    }


    const getBCDToken = function getBCDToken() {


        let url = 'https://blockdam.nl/assets/smartcontracts/bcdToken.json';

        axios.get(url)
            .then(function (response) {

                // connect to contract
                bcdContract = web3.eth.contract(response.data.abi).at(bcdTokenAddress);

                // request total supply
                if(html.totalSupply) {
                    bcdContract.totalSupply.call(function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                        if (data) {
                            html.totalSupply.innerHTML = data.toNumber() / self.bcdRatio;
                        }
                    });
                }

                // request personal balance
                bcdContract.balanceOf(web3.eth.coinbase, function (err, data) {
                    if (err) {
                        console.log(err)
                    }
                    if (data) {
                        let val = data.toNumber() / bcdRatio;
                        html.balance.innerHTML = 'Your member address holds ' + val + ' BCD tokens';

                        // init donation function when tokens are identified with user
                        if(val > 0) {
                            donate.init();
                        }
                    }
                });
            });
    }

    const getBCDBondingCurve = function getBCDBondingCurve() {

        axios.get('https://blockdam.nl/assets/smartcontracts/bcdBondingCurve.json')
            .then(function (response) {
                bcdBondingCurve = web3.eth.contract(response.data.abi).at(bcdBondingCurveAddress);
            });
    }

    _verifyMetaMask();

    // show tooltip with welcome message for several seconds. Will also hide when user scrolls
    setTimeout( () => {
        _showTooltip();
    },1000);
    setTimeout( () => {
        _hideTooltip()
    },9000);

    return {

        init: init,
        identify: identify,
        getBCDToken: getBCDToken,
        getBCDBondingCurve: getBCDBondingCurve

    }
}

// var metaMask = new MetaMask();
// metaMask.init();

