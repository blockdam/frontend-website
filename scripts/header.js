class Header {

    constructor() {

        this.body = document.getElementsByTagName('body')[0];
        this.article = document.getElementsByTagName('article')[0];
        this.header = document.getElementsByTagName('header')[0];
        this.main = document.getElementsByTagName('main')[0];
        this.backgroundImage = document.getElementById('background-img');
        this.navShape = document.getElementById('nav-shape');
        this.navGroups = [].slice.call(document.getElementsByClassName('nav-group'));
        this.expanded = false;
        this.animations = {};
        this.animations.collapseMenu = {};
        this.animations.collapseMenu.rotation = 0;
        this.animations.collapseMenu.offsetTop = 0;
        this.animations.collapseMenu.offsetLeft = 0;

    }

    init() {

        let self = this;
        self._initWaypoints();

    }

    hover(el) {

        let self = this;

        if(self.expanded) {

            self._showItems(el);

        } else {
            this.navGroups.forEach((g) => {
                g.querySelector('text').style.opacity = 1;
            });
        }
    }

    click(el) {

        let self = this;
        if(!self.expanded) {
            self._open(el);
        }
    }

    _initWaypoints() {

        let self = this;

        let wp_close = new Waypoint({
            element: self.article,
            handler: function(direction) {
                if(direction === 'down') {  // self.expanded &&
                    console.log('close1');
                    self._close();
                }
            },
            offset : -10
        })

        let wp_open = new Waypoint({
            element: self.article,
            handler: function(direction) {
                if(direction === 'up') {  // !self.expanded &&
                    console.log('open');
                    self._open();
                }
            },
            offset : -10
        })

        let offset = window.innerHeight * 0.8;

        // let wp_closing = new Waypoint({
        //     element: self.main,
        //     handler: function(direction) {
        //         if(self.expanded && direction === 'down') {
        //             console.log('closing');
        //             self._collapseNav();
        //
        //             //
        //         }
        //     },
        //     offset : offset
        // })
    }

    _open(el) {

        console.log('open');
        let self = this;
        // self.expanded = true;
        // self.header.classList.add("expanded");
        // self.main.style.transform = 'translateY(100vh)';
        // self._expandNav();
        // self._initWaypoints();
        self.header.classList.remove("shrunk");
    }

    _close() {

        let self = this;
        self.expanded = false;
        // self.header.classList.remove("expanded");
        self.header.classList.add("shrunk");
        // self._collapseNav();
        // self._snapNav();
        // self.navGroups.forEach((g) => {
        //     g.querySelector('circle').setAttribute("r", 6);
        // });
    }

    showBackground() {

        this.backgroundImage.classList.add('visible');
    }


    collapseMenu(amount) {


        let self = this;

        let progress = (amount / window.innerHeight);

        if(progress <= .5) {
            self.animations.collapseMenu.rotation = 27.5 * (2 * progress);
        }

        if(progress <= 1 && self.animations.collapseMenu.offsetTop <= 300) {
            self.animations.collapseMenu.offsetTop = progress * -10 * 25;
        }

        if(self.animations.collapseMenu.offsetLeft <= 300) {
            self.animations.collapseMenu.offsetLeft = progress * -10 * 10;
        }


        var anime_collapse = anime.timeline();

        anime_collapse
            .add({
                targets: '#nav-shape',
                translateY: self.animations.collapseMenu.offsetTop + 'px',
                translateX: self.animations.collapseMenu.offsetLeft + 'px',
                rotate: [0,self.animations.collapseMenu.rotation],
                easing: 'easeOutExpo',
                duration: 0,
                offset: 0
            })
        ;
    }


    _expandNav() {

        let anime_expand_nav = anime.timeline();

        anime_expand_nav
            .add({
                targets: '#nav-shape',
                translateY: '300px',
                translateX: '-220px',
                rotate: [0,-27.5],

                easing: 'easeOutExpo',
                duration: 2000,
                offset: 0
            })
        ;
    }

    _collapseNav() {

        let anime_collapse_nav = anime.timeline();

        anime_collapse_nav
            .add({
                targets: '#nav-shape',
                translateY: '0px',
                translateX: '-400px',
                rotate: [0,0],

                easing: 'easeOutExpo',
                duration: 2000,
                offset: 0
            })
        ;
    }

    _snapNav() {

        this.navShape.style.transform = 'translateY(0) translateX(-400px) rotate(0)';
    }


    highlight(el) {

        this._hideNavGroupElements();
        var circle = el.parentNode.querySelector('circle');
        var text = el.parentNode.querySelector('text');
        var icon = el.parentNode.querySelector('g.icon');

        var anime_highlight = anime.timeline();

        anime_highlight
            .add({
                targets: circle,
                r: 16,
                easing: [.91,-0.54,.29,1.5],
                duration: 500,
                offset: 0
            })
            .add({
                targets: text,
                opacity: 1,
                easing: 'easeOutExpo',
                duration: 1000,
                offset: 0
            })
            // .add({
            //     targets: icon,
            //     opacity: 1,
            //     easing: 'easeOutExpo',
            //     duration: 1000,
            //     offset: 1000
            // })

        ;

    }

    _showItems(el) {

        let self = this;

        if(self.expanded) {

            var anime_inView = anime.timeline();

            var list = el.parentNode.querySelector('.nav-project-list');
            var items = el.parentNode.querySelectorAll('.nav-project-list .nav-project-list-item');

            anime_inView
                .add({
                    targets: list,
                    translateY: ['1000px', 0],
                    easing: [.91, -0.54, .29, 1.1],
                    duration: 600,
                    offset: 0
                })
            ;

        }
    }

    _hideNavGroupElements() {
        this.navGroups.forEach((g) => {
            g.querySelector('circle').setAttribute("r", 12);
            g.querySelector('text').style.opacity = 0;
            g.querySelector('g.icon').style.opacity = 0;
        });

    }


}


var header = new Header();
header.init();