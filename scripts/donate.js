
class Donate {

    constructor() {

        this.container = document.querySelector('#donation_button_container');
        this.button = this.container.querySelector('svg');
    }

    init() {

        let self = this,
            authorId = this.container.getAttribute('data-author-id'),
            url = 'https://blockdam.nl/smc-api/members/' + authorId;

        // web3.eth.getAccounts((err, res) => {
        //     console.log(res);
        // });

        axios.get(url)
            .then(function (response) {

                console.log(response);

               // this.button.addEventListener('click', function() { self.donate(address);},true)
            });


    }



    donate(address) {

        let self = this;

        metaMask.bcdContract.transfer.sendTransaction(address, .1 * 1000000000000000000,{ from: web3.eth.coinbase}, function(err,receipt){
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