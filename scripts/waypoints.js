
class Header {

    constructor() {

        this.body = document.getElementsByTagName('body')[0];
        this.article = document.getElementsByTagName('article')[0];
        this.header = document.getElementsByTagName('header')[0];
        this.main = document.getElementsByTagName('main')[0];
        this.aside = document.getElementsByTagName('aside')[0];
        this.commentSection = document.getElementById('comment-section');
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
                    metaMask.html.tooltip.classList.remove('visible');
                }
            },
            offset : -10
        })

        if (self.aside) {

            let aside = new Waypoint({
                element: self.commentSection,
                handler: function (direction) {
                    if (direction === 'down') {
                        console.log('way out');
                        self.aside.classList.add('absolute');
                    }
                },
                offset: 100
            })
        }
    }





}
var header = new Header();
header.init();