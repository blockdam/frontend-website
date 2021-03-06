
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
                if(direction === 'down') {
                  //  const metaMask = MetaMask();
                    metaMask.hideTooltip();
                }
            },
            offset : -10
        });

        if (self.aside && self.commentSection) {

            let aside = new Waypoint({
                element: self.commentSection,
                handler: function (direction) {
                    if (direction === 'down') {
                        self.aside.classList.add('absolute');
                    }
                    if (direction === 'up') {
                        self.aside.classList.remove('absolute');
                    }
                },
                offset: '100%'
            })
        }
    }
}
var header = new Header();
header.init();