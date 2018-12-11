
class MetaMask {

    constructor(abi) {

        this.contractBCDToken = abi;
    }


    init() {

        let self = this;

        console.log('1');

        // window.addEventListener('load', async () => {

            console.log('2');

            // Modern dapp browsers...
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    ethereum.enable();
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


                    let bcd = new web3.eth.Contract(self.contractBCDToken.abi, '0x788A378e7F82e36B3719644e042102d68BF597C7');

                    console.log(bcd);



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
        // });

    }


}

