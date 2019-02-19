
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
                self.createMinter();
            }

            self.createVoucher(permissions.vouchers);

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

        return new Promise((res, rej) => {

            axios.post(url, {
                userAddress: userAddress
            })
                .then(function (response) {
                    res(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    createMinter() {

        let self = this;

        console.log('hi');

        let header = document.createElement('h3');
        header.innerText('You are a minter');
        self.aside.appendChild(header);

    }

    createVoucher() {

    }
}

var members = new Dao();
members.init();