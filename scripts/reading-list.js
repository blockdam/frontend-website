class ReadingList {

    constructor() {

        this.contract = null;
        this.forms = [].slice.call(document.querySelectorAll('form.replaceLinkForm'));

    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/ReadingList.json',
            address = '0xefDb2303D3626490f00eA85C27879dDe1853e6e1';

        axios.get(url)
            .then(function (response) {

                // connect to contract
                self.contract = web3.eth.contract(response.data.abi).at(address);
                console.log(self.contract);

                self.forms.forEach((form) => {

                        let index = form.getAttribute('data-item-id');

                        form.querySelector('span').addEventListener('click', function() { self.openForm(index) }, false);
                });

                self.contract.slots.call(1,function (err, data) {
                    if (err) {
                        console.log(err)
                    }
                    if (data) {
                        console.log(data);

                    }
                });
            });
    }

    openForm(index) {

        let self = this;
        self.forms[index].classList.add('open');
        let url = self.forms[index].querySelector('input[type="text"]').value;
        self.forms[index].querySelector('button').addEventListener('click', function() { self.addLink(url) }, false);
    }

    addLink() {

        console.log(url);
    }
}


var readingList = new ReadingList();
readingList.init();