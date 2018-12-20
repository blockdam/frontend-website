
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
        table.classList.add('default');

        transactions.reverse().forEach((t) => {

            let tr = document.createElement('tr');

            let date = document.createElement('td');
            date.innerHTML = moment(t.date).format('DD/MM/YYYY HH:mm:ss');
            tr.appendChild(date);
            let from = document.createElement('td');
            from.innerHTML = '..' + t.from.slice(-5);
            tr.appendChild(from);
            let to = document.createElement('td');
            to.innerHTML = '..' + t.to.slice(-5);
            tr.appendChild(to);
            let value = document.createElement('td');
            value.innerHTML = parseInt(t.value) / 1000000000000000000;
            tr.appendChild(value);

            table.appendChild(tr);

        })

        this.container.appendChild(table);
    }

}

var transactions = new Transactions();
transactions.init();