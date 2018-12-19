
class Transactions {

    constructor() {

        this.container = document.querySelector('#content-container');
    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/smc-api/transactions/';

        axios.get(url)
            .then(function (response) {

                console.log(response.data);

                //self.container
            });
    }

}

var transactions = new Transactions();
transactions.init();