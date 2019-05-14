
let Donate = function Donate() {

    const container = document.querySelector('#donation_button_container');


    let button, tooltip, form;
    let metaMask = null;
    let address = null;

    let init = function init(metaMask) {

        metaMask = metaMask;

        if (container) {

            let button = container.querySelector('svg');
            let tooltip = container.querySelector('.tooltip');
            let form = container.querySelector('form');

            let url = 'https://blockdam.nl/smc-api/members/' + container.getAttribute('data-author-id');

            axios.get(url)
                .then(function (response) {

                    address = response.data.ethAddress;
                    button.addEventListener('click', function () {
                        openForm()
                    }, false)
                });
        }
    }

    let donate = function donate(amount) {

        metaMask.bcdContract.transfer.sendTransaction(address, amount,{ from: web3.eth.coinbase }, function(err,receipt){
            if (err) {
                console.log(err)
            }
            if (receipt) {
                tooltip.classList.remove('visible');
            }
        })
    }

    let openForm = function openForm() {

        tooltip.classList.add('visible');

        form.addEventListener("submit", function(event, errors) {
            event.preventDefault();
            if(errors) {
                console.log(errors);
            } else {
                let amount = parseInt(form.querySelector("input[type='number']").value) * 1000000000000000000;

                donate(amount);
            }
        });
    }

    return {

        init: init,
        openForm: openForm,
        donate: donate
    }
}

