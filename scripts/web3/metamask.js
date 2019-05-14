const SMCAPIURL = 'https://blockdam.nl/smc-api/';

let MetaMask = function MetaMask() {

    const donate = Donate();
    const bcdToken = BCDToken();

    // elements
    let html = {};
    html.totalSupply = document.querySelector('#general_info span#total_supply');
    html.navItem = document.querySelector('nav ul li#metamask');
    html.welcome = html.navItem.querySelector('#welcome_message');
    html.balance = html.navItem.querySelector('#personal_info');
    html.tooltip = html.navItem.querySelector('.tooltip');

    // objects
    let web3 = null;
    let bcdContract = null;
    let userAddress = null;
    let userName = null;


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
                    tokenActions();
                }
            } catch (error) {

                console.log(error);
                html.welcome.innerHTML = 'Hello, Metamask failed to connect';
            }
        }
    }

    const tokenActions = async function tokenActions() {

        bcdContract = await bcdToken.getContract();

        if(html.totalSupply) {
            html.totalSupply.innerText = await bcdToken.getSupply(bcdContract)
        }

        bcdToken.getBalance(bcdContract).then( (balance) => {

            html.balance.innerText = 'Your member address holds ' + balance + ' BCD tokens';

            if(balance > 0) {
                donate.init();
            }
        });

       // let curve = await BCDToken.getBCDBondingCurve()

    }

    const _showTooltip = function _showTooltip() {
        html.tooltip.classList.add('visible');
    }

    const _hideTooltip = function _hideTooltip() {
        html.tooltip.classList.remove('visible');
    }

    const identify = function identify(address) {

        axios.get(SMCAPIURL + '/members/' + address)
            .then(function (response) {

                userName = response.data.nickName;

                if(response.data !== null) {
                    html.welcome.innerHTML = 'Hello ' + userName + '! The DAO welcomes you back.';
                } else {
                    html.welcome.innerHTML = 'Hello! The DAO welcomes you back.';
                }
                _showTooltip();
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

        identify: identify,
        tokenActions: tokenActions

    }
}


