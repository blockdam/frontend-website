
class Transactions {

    constructor() {

        this.container = document.querySelector('#content-container');
    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/smc-api/token/transactions';

        axios.get(url)
            .then(function (response) {

                self.createHTML(response.data);

                //self.container
            });
    }

    createHTML(transactions) {

        let table = document.createElement('table');

        transactions.forEach((t) => {

            let tr = document.createElement('tr');
            let date = document.createElement('td');
            date.innerHTML = t.date;
            tr.appendChild(date);
            let from = document.createElement('td');
            from.innerHTML = t.from;
            tr.appendChild(from);
            let to = document.createElement('td');
            from.innerHTML = t.to;
            tr.appendChild(to);
            let value = document.createElement('td');
            value.innerHTML = t.value;
            tr.appendChild(value);

            table.appendChild(tr);

        })

        this.container.appendChild(table);
    }

}

var transactions = new Transactions();
transactions.init();