
class Dao {

    constructor() {

        this.container = document.querySelector('#content-container');
        this.aside = document.querySelector('aside');
        this.permissions = {};
    }

    init() {

        let self = this,
            url = 'https://blockdam.nl/smc-api/members';

        this.checkPermissions(metaMask.userAddress).then( permissions => {

            if (permissions.minter) {
                self.createMinter(permissions);
            }

            self.createVoucher(permissions);

        })

        axios.get(url)
            .then(function (response) {
                self.createMemberList(response.data);
            });
    }

    createMemberList(members) {

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
            url = 'https://blockdam.nl/smc-api/dao/permissions';

        return new Promise((resolve, reject) => {

            axios.post(url, {
                userAddress: userAddress
            })
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    createMinter(permissions) {

        let self = this;

        let header = document.createElement('h3');
        header.innerText = 'You are a minter';

        let period = document.createElement('div');
        period.innerText = 'Mandated till ' + new Date(permissions.minter.period).format('DD-MM-YYYY');
        let budget = document.createElement('div');
        budget.innerText = 'Budget: ' + permissions.minter.budget

        self.aside.appendChild(header);
        self.aside.appendChild(period);
        self.aside.appendChild(budget);

    }

    createVoucher() {

    }
}

var members = new Dao();
members.init();