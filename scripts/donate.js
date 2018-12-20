
class Donate {

    constructor() {

        this.container = document.querySelector('#donation_button_container');
        this.button = this.container.querySelector('svg');
        this.tooltip = this.container.querySelector('.tooltip');
    }

    init() {

        let self = this,
            authorId = this.container.getAttribute('data-author-id'),
            url = 'https://blockdam.nl/smc-api/members/' + authorId;

        axios.get(url)
            .then(function (response) {

               self.button.addEventListener('click', function() {
                   self.openForm(response.data.ethAddress)
               },true)
            });
    }

    openForm(ethAddress) {

        this.tooltip.classList.add('visible');
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