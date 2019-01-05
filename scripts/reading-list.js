class ReadingList {

    constructor() {

        this.contract = null;
        this.items = [].slice.call(document.querySelectorAll('.recommendation'));
        this.forms = [].slice.call(document.querySelectorAll('form.replaceLinkForm'));
        this.address = '0x29fc8f8e2efcaafa85c49c9584c05f7e0c3f73bd';
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
                self.items[index].querySelector('.recommendation--title').setAttribute("contenteditable", true);
                self.items[index].querySelector('.recommendation--title').innerHTML = response.data.title;
                self.items[index].querySelector('.recommendation--subtitle').setAttribute("contenteditable", true);
                self.items[index].querySelector('.recommendation--subtitle').innerHTML = response.data.description;

                let button = document.createElement('button');
                button.innerHTML = 'Pay';
                button.addEventListener('click', function() {
                    self.saveLink(index,url,self.items[index]);
                }, false);
                self.items[index].querySelector('a').appendChild(button);

            });
    }

    saveLink(index,url,el) {

        let self = this,
            api = 'https://blockdam.nl/smc-api/reading-list',
            link = {
                url: url,
                author: self.items[index].querySelector('.recommendation--tag').innerHTML,
                title: self.items[index].querySelector('.recommendation--title').innerHTML,
                subtitle: self.items[index].querySelector('.recommendation--subtitle').innerHTML
            };

        self.items[index].querySelector('a').classList.add('hidden');
        self.items[index].querySelector('.spinner').style.display = 'block';

        //  store url/data   + return id   (where?)
        axios.put(api, { link : link })
            .then(function (response) {
                self.pay(response.data,index);
            });
    }

    pay(linkId,index) {

        let self = this;
        // contract with limited slots (wil ik alleen een id aan toewijzen )
        // betaling      // amount diminishes per day
        self.contract.addLink(linkId, parseInt(index) + 1, { from: web3.eth.coinbase, gas: 800000 }, function(err,receipt){
            if (err) {
                console.log(err)
            }
            if (receipt) {
                console.log(receipt);

                let options = {
                    fromBlock: '0x0',
                    address: self.address
                };

                web3.eth.subscribe('logs', options, function (error, result) {
                    if(error) {
                        logger.info(error);
                    }
                }).on("data", function (log) {
                    console.log(log);
                });
            }
        })
    }
}


var readingList = new ReadingList();
readingList.init();