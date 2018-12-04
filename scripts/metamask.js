
class MetaMask {

    constructor() {
    }

    init() {


        window.addEventListener('load', function() {
            // Checking if Web3 has been injected by the browser (Mist/MetaMask)
            if (typeof web3 !== 'undefined') {
                // Use Mist/MetaMask's provider
                web3js = new Web3(web3.currentProvider);
                console.log('jaaa metamask');
            } else {

                console.log('nee geen metamask');
                // Handle the case where the user doesn't have web3. Probably
                // show them a message telling them to install Metamask in
                // order to use our app.
                // For example
                // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            }

        })

    }


}

var metaMask = new MetaMask();
metaMask.init();