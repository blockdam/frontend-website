
class Header {

    constructor() {

        this.body = document.getElementsByTagName('body')[0];
        this.article = document.getElementsByTagName('article')[0];
        this.header = document.getElementsByTagName('header')[0];
        this.main = document.getElementsByTagName('main')[0];

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


    _initWaypoints() {

        let self = this;
        //
        let scroll = new Waypoint({
            element: self.main,
            handler: function(direction) {
                if(direction === 'down') {  // self.expanded &&
                    console.log('close1');
                    metaMask.html.tooltip.classList.remove('visible');
                }
            },
            offset : -10
        })
    }





}
var header = new Header();
header.init();