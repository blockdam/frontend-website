class ReadingList {

    constructor() {

        this.contract = null;
        this.slots = null;
        this.linkCount = null;
    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/assets/smartcontracts/ReadingList.json',
            address = '0xC09495D37DE2B74E1F01B461025D4c367bBB84b0';

        axios.get(url)
            .then(function (response) {

                // connect to contract
                self.contract = web3.eth.contract(response.data.abi).at(address);

                console.log(self.contract.linkCount(function(err,data) => {

                    if(err) {
                        console.log(err);
                    } else {
                        self.linkCount = data;
                    }
                });

                console.log(self);
            });
    }
}


var readingList = new ReadingList();
readingList.init();