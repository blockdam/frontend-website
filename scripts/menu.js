
class Menu {

    constructor() {

        this.hamburger = document.querySelector('svg.icon-hamburger');
        this.nav = document.querySelector('nav');
    }

    init() {

        var internal = document.referrer.indexOf(window.location.host) !== -1;

        let self = this;

        // if(detect.ie()) {
        //     self.skip();
        // } else if (!internal && (window.location.pathname === '' || window.location.pathname === '/' )) {
        //     self.intro();
        // } else {
        //     self.skip();
        // }

        self.hamburger.addEventListener('click', function() {

            self.nav.classList.add('open');

        },false);

    }


    intro() {

        // var intro = anime.timeline();
        //
        // intro
        //     .add({
        //         targets: '#topIJsberg',
        //         opacity: [0,1],  ////??????
        //         easing: 'easeOutExpo',
        //         duration: 1200,
        //         offset: 0
        //     })
        //     .add({
        //         targets: '#row_one',
        //         opacity: [0,.8],  ////??????
        //         easing: 'easeOutExpo',
        //         duration: 1200,
        //         offset: 0
        //     })
        //     .add({
        //         targets: '#row_two',
        //         opacity: [0,.8],
        //         easing: 'easeOutExpo',
        //         duration: 200,
        //         offset: 1500
        //     })
        //
        // ;
    }

    skip() {

    }
}

var menu = new Menu();
menu.init();