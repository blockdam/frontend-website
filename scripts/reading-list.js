class ReadingList {

    constructor() {

        this.contract = null;
        this.items = [].slice.call(document.querySelectorAll('.recommendation'));
        this.forms = [].slice.call(document.querySelectorAll('form.replaceLinkForm'));
        this.address = '0xfc4ba82957df8b1d470afe8529117f502ace11d4';
    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/ReadingList.json';

        axios.get(url)
            .then(function (response) {
                // connect to contract
                self.contract = web3.eth.contract(response.data.abi).at(self.address);
                self.items.forEach((item) => {
                    let index = item.getAttribute('data-item-id');
                    item.querySelector('svg.icon_replace').addEventListener('click', function() { self.openForm(index) }, false);
                });
            });
    }

    openForm(index) {

        let self = this;

        self.forms.forEach( (f) => {
            f.classList.remove('open');
        });
        self.items.forEach( (f) => {
            f.classList.remove('hidden');
        });


        self.forms[index].classList.add('open');
        self.items[index].querySelector('a').classList.add('hidden');
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

        let self = this,
            api = 'https://blockdam.nl/smc-api/reading-list';


        console.log(api);
        // get metadata
        axios.post(api, { url : url })
            .then(function (response) {
                console.log(response.data);
                self.forms[index].classList.remove('open');
                self.items[index].querySelector('a').setAttribute("href","javascript:");
                self.items[index].querySelector('a').classList.remove('hidden');

                self.items[index].querySelector('.recommendation--tag').setAttribute("contenteditable", true);
                self.items[index].querySelector('.recommendation--tag').innerHTML = response.data.author;
                self.items[index].querySelector('.recommendation--title').setAttribute("contenteditable", true).innerHTML = response.data.title;
                self.items[index].querySelector('.recommendation--subtitle').setAttribute("contenteditable", true).innerHTML = response.data.description;

            });
        // store url/data   + return id   (where?)

        // betaling      // amount diminishes per day

        // contract with limited slots (wil ik alleen een id aan toewijzen )

        // signal sg to render

        // self.contract.addLink(url, index, { from: web3.eth.coinbase, gas: 800000 }, function(err,receipt){
        //     if (err) {
        //         console.log(err)
        //     }
        //     if (receipt) {
        //         console.log(receipt);
        //     }
        // })
    }
}


var readingList = new ReadingList();
readingList.init();