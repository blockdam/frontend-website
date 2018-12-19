
class Donate {

    constructor() {

        this.button = document.querySelector('#donation_button_container');
    }

    init() {

        let self = this; 

        this.button.addEventListener('click', function() { self.donate();},true)
    }



    donate() {

        console.log('hi');

    }

    skip() {

    }
}

var donate = new Donate();
donate.init();