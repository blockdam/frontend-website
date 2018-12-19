
class Donate {

    constructor() {

        this.button = document.querySelector('#donation_button_container svg');
    }

    init() {

        let self = this;

        this.button.addEventListener('click', function() { self.donate();},true)
    }



    donate() {

        console.log(metamask.web3);

    }

    skip() {

    }
}

var donate = new Donate();
donate.init();