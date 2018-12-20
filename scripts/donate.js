
class Donate {

    constructor() {

        this.container = document.querySelector('#donation_button_container');
        this.button = this.container.querySelector('svg');
        this.tooltip = this.container.querySelector('.tooltip');
        this.form = this.container.querySelector('form');
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

        let self = this,
            address = ethAddress;

        this.tooltip.classList.add('visible');

        this.form.addEventListener("submit", function(event,errors) {
            event.preventDefault();
            if(errors) {
                console.log(errors);
            } else {
                let amount = parseInt(self.form.querySelector("input[type='number']").value) * 1000000000000000000;
                console.log(address);
                self.donate(amount, address);
            }
        });
    }

    donate(amount,address) {

        let self = this;



        metaMask.bcdContract.transfer.sendTransaction(address, amount,{ from: web3.eth.coinbase }, function(err,receipt){
            if (err) {
                console.log(err)
            }
            if (receipt) {
                self.tooltip.classList.remove('visible');
            }
        })
    }
}

var donate = new Donate();
donate.init();