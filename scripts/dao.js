
class Dao {

    constructor() {

        this.container = document.querySelector('#content-container');
    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/smc-api/members';

        axios.get(url)
            .then(function (response) {
                self.createHTML(response.data);
            });
    }

    createHTML(transactions) {

        let table = document.createElement('table');
        table.classList.add('default');

        transactions.reverse().forEach((m) => {

            let tr = document.createElement('tr');

            let name = document.createElement('td');
            name.innerHTML = m.nickName;
            tr.appendChild(name);

            let address = document.createElement('td');
            address.innerHTML = t.ethAddress;
            tr.appendChild(address);

            table.appendChild(tr);
        });

        this.container.appendChild(table);
    }

}

var members = new Dao();
members.init();