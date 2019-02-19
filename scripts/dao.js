
class Dao {

    constructor() {

        this.container = document.querySelector('#content-container');
    }

    init() {


        // getAddress()

        console.log(metaMask.userAddress);

        let self = this,
            url = 'https://blockdam.nl/smc-api/members';

        axios.get(url)
            .then(function (response) {
                self.createHTML(response.data);
            });
    }

    createHTML(members) {

        members.sort(function(a, b){
            if(a.nickName < b.nickName) { return 1; }
            if(a.nickName > b.nickName) { return -1; }
            return 0;
        })

        let table = document.createElement('table');
        table.classList.add('default');

        members.reverse().forEach((m) => {

            let tr = document.createElement('tr');

            let name = document.createElement('td');
            name.innerHTML = m.nickName;
            tr.appendChild(name);

            let address = document.createElement('td');
            address.innerHTML = m.ethAddress;
            tr.appendChild(address);

            table.appendChild(tr);
        });

        this.container.appendChild(table);
    }

    isMinter() {



    }

}

var members = new Dao();
members.init();