
class Dao {

    constructor() {

        this.container = document.querySelector('#content-container');
        this.aside = document.querySelector('aside');
        this.permissions = {};
    }

    init() {


        // getAddress()

        this.permissions = this.checkPermissions(metaMask.userAddress);

        if (this.permissions.minter) {
            this.createMinter();
        }

        this.createVoucher(this.permissions.vouchers);


        let self = this,
            url = 'https://blockdam.nl/smc-api/members';

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

        axios.post(url,{
            userAddress: userAddress
        })
        .then(function (response) {

            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });

    }

    createMinter() {

        let self = this;

        let header = document.createElement('h3');
        header.innerText('You are a minter');
        self.aside.appendChild(header);

    }

    createVoucher() {

    }


}



}

var members = new Dao();
members.init();