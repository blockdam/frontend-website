
class MetaMask {

    constructor() {
    }

    init() {


        window.addEventListener('load', async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                  //  web3.eth.sendTransaction({/* ... */});
                    console.log(web3.eth);
                    document.querySelector('#metamask_private').style.display = "block";
                    document.querySelector('#metamask_private').style.height = "auto";
                    document.querySelector('#metamask_private span').innerHTML = web3.eth.coinbase;


                } catch (error) {
                    // User denied account access...
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
                // Acccounts always exposed
                // web3.eth.sendTransaction({/* ... */});
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        });

    }


}

var metaMask = new MetaMask();
metaMask.init();