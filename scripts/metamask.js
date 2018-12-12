
class MetaMask {

    constructor() {

        this.bcdTokenAddress = '0x788A378e7F82e36B3719644e042102d68BF597C7';
        this.bcdBondingCurveAddress = '0x5c5d2c96f62b41ebd4ca420884146b33ba3d75c7';

        0xb6ca51ca72c689b720235aca37e579f821fa05ee

        this.metaMask = {};
        this.bcd = {};

        this.bcd.eventList = [];
    }


    init() {

        let self = this;

            if (window.ethereum) {
                window.web3 = new Web3(ethereum);

                ethereum.enable();

                self.metaMask.network =  web3.version.network;
                self.metaMask.accounts = web3.eth.accounts;
                self.metaMask.coinbase = web3.eth.coinbase;

                document.querySelector('#metamask_private').classList.add("visible");
                document.querySelector('#metamask_private span').innerHTML = web3.eth.coinbase;

                console.log(self.metaMask);

                if (self.metaMask.network  !== '4')  {
                    document.querySelector('#network_warning').style.display = 'block';
                }

                return true;
            }

            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

                return false;
            }
    }

    getBCDToken(json) {

        let self = this;

        this.bcd.tokenAbi = json.abi;

        let bcdInfo = web3.eth.contract(self.bcd.tokenAbi).at(self.bcdTokenAddress);

        bcdInfo.totalSupply.call(function (err, data) {
            if (err) {
                console.log(err)
            }
            if (data) {

                self.bcd.totalSupply = data.toNumber() / 1000000000000000000;
                document.querySelector('#general_info span#total_supply').innerHTML = self.bcd.totalSupply;
            }
        });

        bcdInfo.balanceOf(self.metaMask.coinbase, function (err, data) {
            if (err) {
                console.log(err)
            }
            if (data) {

                let val = data.toNumber() / 1000000000000000000;

                document.querySelector('#personal_info').style.display = 'flex';
                document.querySelector('#personal_info span').innerHTML = val;
            }
        });

        bcdInfo.allEvents({fromBlock: 0, toBlock: 'latest'}, function (err, data) {
            if (err) {
                console.log(err)
            }
            if (data) {

                self.bcd.eventList.push(data);
            }
        });

        setTimeout( function() {

            self.countGrants(self.bcd.eventList);
        },5000);
    }

    getBCDBondingCurve(json) {

        let self = this;
        this.bcd.bondingCurveAbi = json.abi;

        let bcdBondingCurve = web3.eth.contract(self.bcd.bondingCurveAbi).at(self.bcdBondingCurveAddress);

        console.log(bcdBondingCurve);

    }

    countGrants(events) {

            console.log(events);


            let transfers = events.filter( (e) => {
                return e.event = transfer;
            })

            transfers.forEach( (t) => {

                console.log(args);
            });
    }


}

