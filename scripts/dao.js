
class Dao {

    constructor() {

        this.container = document.querySelector('#content-container');
        this.permissions = {};
    }

    init() {


        // getAddress()

        this.permissions = this.checkPermissions(metaMask.userAddress);

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

    checkPermissions(userAddress) {

        let self = this,
            url = 'https://blockdam.nl/smc-api/permissions';

        axios.post(url,{
            userAddress: userAddress
        })
        .then(function (response) {
            console.log(response.data);
            // returns object with permissions
        })
        .catch(function (error) {
            console.log(error);
        });

    }



}

var members = new Dao();
members.init();