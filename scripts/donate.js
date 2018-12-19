
class Donate {

    constructor() {

        this.container = document.querySelector('#donation_button_container');
        this.button = this.container.querySelector('svg');
    }

    init() {

        let self = this,
            authorId = this.container.getAttribute('data-author-id'),
            url = 'https://blockdam.nl/smc-api/members/' + authorId;

        axios.get(url)
            .then(function (response) {
               this.button.addEventListener('click', function() {
                   self.donate(response.data.ethAddress)
                   },true)
            });
    }

    donate(ethAddress) {

        let self = this;

        metaMask.bcdContract.transfer.sendTransaction(ethAddress, .1 * 1000000000000000000,{ from: web3.eth.coinbase}, function(err,receipt){
            if (err) {
                console.log(err)
            }
            if (receipt) {
                console.log(receipt);
            }
        })
    }
}

var donate = new Donate();
donate.init();