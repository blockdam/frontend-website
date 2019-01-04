class ReadingList {

    constructor() {

        this.contract = null;
        this.forms = [].slice.call(document.querySelectorAll('form.replaceLinkForm'));
        this.address = '0xc6084eDcAE7e5B8Ac0Fa94859353061F3B9FA8d1';
    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/ReadingList.json';


        axios.get(url)
            .then(function (response) {
                // connect to contract
                self.contract = web3.eth.contract(response.data.abi).at(self.address);
                console.log(self.contract);
                self.forms.forEach((form) => {
                    let index = form.getAttribute('data-item-id');
                    form.querySelector('span').addEventListener('click', function() { self.openForm(index) }, false);
                });
            });
    }

    openForm(index) {

        let self = this;
        self.forms[index].classList.add('open');
        self.forms[index].addEventListener('submit', function(event, errors) {
            event.preventDefault();
            if(errors) {
                console.log(errors);
            } else {
                let url = self.forms[index].querySelector('input[type="text"]').value;
                self.addLink(url,index)
            }
        }, false);
    }

    addLink(url,index) {

        let self = this;
        let estimatedGas = self.contract.addLink.estimateGas(url, index, {from: web3.eth.coinbase});

        console.log(estimatedGas);

        self.contract.addLink(url, index, { from: web3.eth.coinbase, gas: 8000000 }, function(err,receipt){
            if (err) {
                console.log(err)
            }
            if (receipt) {
                console.log(receipt);
            }
        })
    }
}


var readingList = new ReadingList();
readingList.init();