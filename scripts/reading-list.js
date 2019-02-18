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


        // get metadata
        axios.post(api, { url : url })
            .then(function (response) {
                console.log(response.data);
                self.oldHTML = self.forms[index].innerHTML;

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
        let contractIndex = parseInt(index) + 1;
        self.contract.addLink(linkId, contractIndex, { from: web3.eth.coinbase, gas: 800000 }, function(err,receipt){
            if (err) {
                console.log(err)
            }
            if (receipt) {
                console.log(receipt);
                let interval = setInterval( () => {
                    web3.eth.getTransaction(receipt, function (error, result) {
                        if (error) {
                            console.log(error);
                        }
                        if (result.blockNumber && result.blockNumber !== null) {
                            self.confirm(receipt,index);
                            clearInterval(interval);
                        }
                    });
                },2000);
            }
        })
    }

    confirm(txHash,index){

        let self = this;
        web3.eth.getTransactionReceipt(txHash, (err,receipt) => {
            if (err) {
                console.log(err);
            }
            if (receipt.status === "0x1") {
                self.action(index);
            } else {
                self.errorHandler(index);
            }
        });
    }

    action(index) {

        let self = this;
        self.items[index].querySelector('.spinner').style.display = 'none';
        let button = self.items[index].querySelector('button');
        button.parentNode.removeChild(button);
        self.items[index].querySelector('.recommendation--tag').setAttribute("contenteditable", false);
        self.items[index].querySelector('.recommendation--title').setAttribute("contenteditable", false);
        self.items[index].querySelector('.recommendation--subtitle').setAttribute("contenteditable", false);
        self.items[index].querySelector('a').classList.remove('hidden');

        let api = 'https://blockdam.nl/sg-api/render/homepage';

        axios.get(api)
        .then(function(response){
            if (response.status !== 200) {
                console.log('foutje bedankt')
            }
            console.log(response);
        });


    }

    errorHandler(index) {

        let self = this;
        self.items[index].querySelector('.spinner').style.display = 'none';
        self.forms[index].innerHTML = self.oldHTML;
        self.items[index].querySelector('a').classList.remove('hidden');
    }
}


var readingList = new ReadingList();
readingList.init();