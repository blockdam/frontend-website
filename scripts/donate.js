
class Donate {

    constructor() {

        this.button = document.querySelector('#donation_button_container svg');
    }

    init() {

        let self = this;

        this.button.addEventListener('click', function() { self.donate();},true)
    }



    donate() {

        console.log(metaMask);

        web3.eth.getAccounts((err, res) => {
            console.log(res);
        });

        metaMask.bcdContract.transfer.sendTransaction('0x6974A038f0a2dC6d68Fa1c92b8d4e242FFf72f8E', 1,{ from: web3.eth.coinbase}, function(err,receipt){
            if (err) {
                console.log(err)
            }
            if (receipt) {
                console.log(receipt);
            }
        })
    }

    skip() {

    }
}

var donate = new Donate();
donate.init();