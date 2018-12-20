
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

                console.log(response);

               self.button.addEventListener('click', function() {
                   self.openForm(response.data.ethAddress)
               },true)
            });
    }

    openForm(ethAddress) {

        let self = this;

        this.tooltip.classList.add('visible');

        this.form.addEventListener("submit", function(event,errors) {
            event.preventDefault();
            if(errors) {
                console.log(errors);
            } else {
                let amount = parseInt(self.form.querySelector("input[type='number']").value) * 1000000000000000000;
                self.donate(amount, ethAddress);
            }
        });
    }

    donate(amount,ethAddress) {

        let self = this;

        console.log(ethAddress);

        metaMask.bcdContract.transfer.sendTransaction(ethAddress, amount,{ from: web3.eth.coinbase }, function(err,receipt){
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