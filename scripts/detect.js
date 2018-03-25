
class Detect {

    constructor() {
    }

    init() {


    }

    ie() {

        var isIE11 = !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));

        if(isIE11) {
            document.body.classList.add('ie');
            return true;
        } else {
            return false;
        }
    }
}

var detect = new Detect();
detect.ie();