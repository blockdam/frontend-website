
class MetaMask {

    constructor(abi) {

        console.log(abi);

        this.abi = abi;
    }


    init() {

        let self = this;

        window.addEventListener('load', async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                  //  web3.eth.sendTransaction({/* ... */});

                    document.querySelector('#metamask_private').classList.add("visible");
                    // document.querySelector('#metamask_private span').innerHTML = web3.eth.coinbase;

                    web3.eth.getGasPrice(function(error, result){
                        if(!error)
                            document.querySelector('#metamask_private span').innerHTML = result;
                        else
                            console.error(error);
                    });



                    let bdc = new web3js.eth.Contract(self.abi, '0x788A378e7F82e36B3719644e042102d68BF597C7');

                    console.log(bdc);

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

