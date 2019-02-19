
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

        }).catch(function (error) {
                console.log(error);
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

        let self = this,
            minter = document.querySelector('#minter');

        minter.style.display = 'flex';

        minter.querySelector('.period').innerText = 'Mandated till ' + moment(permissions.minter.period).format('DD-MM-YYYY');
        minter.querySelector('.budget').innerText = 'Budget: ' + permissions.minter.budget;

        let form = minter.querySelector('form');

        form.addEventListener("submit", function(event, errors) {
            event.preventDefault();
            if(errors) {
                console.log(errors);
            } else {
                let address = form.querySelector("#address").value;
                let amount = parseInt(form.querySelector("input[type='number']").value);
                if (address && metaMask.web3.utils.isAddress(address) && amount > 0) {
                    self.mint(address, amount);
                }
            }
        });
    }

    mint(address,amount) {

        let self = this,
            url = 'https://blockdam.nl/smc-api/dao/mint';

        axios.post(url, {
            'ethAddress': address,
            'vouchers': amount
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    createVoucher(permissions) {

        let self = this,
            voter = document.querySelector('#voter'),
            proposal = document.querySelector('#proposal');

        voter.style.display = 'flex';
        proposal.style.display = 'flex';

        voter.querySelector('.amount').innerText = permissions.vouchers;
    }
}

var dao = new Dao();
dao.init();