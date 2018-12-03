class Appreciation {

    constructor() {

        this.ip = null;
        this.appreciationRow = null;
        this.arc = null
        this.positiveButton = null;
        this.negativeButton = null;
        this.percentage = 0;

    }

    init(post_id) {

        let self = this;
        // findIP = new Promise(r=>{var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}})
        //
        // findIP.then(ip => {
        //
        //     self.ip = ip;
        //     console.log(self.ip);
        // })

        this.postID = document.querySelector('#post-id');
        self.url = window.location.href;

        this.appreciationContainer = document.getElementById('blog-rating');
        this.appreciationRow = document.querySelector('#appreciation-row');
        this.arc = this.appreciationRow.querySelector('.circle-foreground');
        this.percentageValue = this.appreciationRow.querySelector('#appreciation-percentage');
        this.textPositiveCount = this.appreciationRow.querySelector('#text-positive-count');
        this.textTotalCount = this.appreciationRow.querySelector('#text-total-count');

        this.rating = {};

        // disable conrating if already rated this page
        if(self.isRated(this.url)) {
            self.disableRatingButtons(); // disable rating buttons
        }

        this.get(post_id);
    }

    get(post_id) {

        let self = this,
            url = '/wp-json/wp/v2/post_rating?post_ID=' + post_id;

        axios.get(url)
            .then(function(response){
                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
                self.rating = response.data;
                self.draw();
            }).catch((error) => {
                console.log(error);

            });
    }

    draw() {

        let self = this,
            c =  (100 - 16) * 3.14,
            arcOffset = (self.rating.percentage / 100) * c;

        this.arc.style.strokeDasharray =  arcOffset + ' ' + c;
        this.arc.style.strokeDashoffset = arcOffset;

        this.percentageValue.innerHTML = self.rating.percentage;
        this.textPositiveCount.innerHTML = self.rating.positive_count;
        this.textTotalCount.innerHTML = self.rating.total_count;

        this.appreciationContainer.classList.add('visible');
    }

    ratePositive(postID) {

        let self = this,
            newPercentage,
            url = '/wp-json/wp/v2/post_rating?post_ID=' + postID + '&value=positive';
            url = '/wp-json/wp/v2/post_rating?post_ID=' + postID + '&value=positive';

        axios.post(url)
            .then(function(response){

                console.log(response);

                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
            });

        self.rating.positive_count = self.rating.positive_count + 1;
        self.rating.total_count = self.rating.total_count + 1;
        self.rating.percentage = Math.round((self.rating.positive_count / self.rating.total_count) * 100);
        this.draw();
        this.setRated(self.url);
    }

    rateNegative(postID) {

        let self = this,
            url = '/wp-json/wp/v2/post_rating?post_ID=' + postID + '&value=negative';

        axios.post(url)
            .then(function(response){

                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
            });

        self.rating.total_count = self.rating.total_count + 1;
        self.rating.percentage = Math.round((self.rating.positive_count / self.rating.total_count) * 100);
        console.log(self.rating);
        this.draw();
        this.setRated(self.url);
    }






    /**
     * Add postId of page to ratedPages in local storage
     * Keeps track of pages that have been rated by the user
     * @param url
     */
    setRated(url) {
        let self = this;
        if (typeof(Storage) !== 'undefined') { // check if local stage is supported by browser

            let ratedPages = null;

            if (localStorage.getItem('ratedPages')) {
                ratedPages = JSON.parse(localStorage.getItem('ratedPages')); // get ratedPages array from local storage
            }

            // check if local storage property exists
            if(ratedPages === null) {
                ratedPages = [];
            }
            ratedPages.push(url); // add page to ratedPages

            localStorage.setItem('ratedPages', JSON.stringify(ratedPages)); // store in local storage
            self.disableRatingButtons(); // disable rating buttons
        } else {
            // No local storage support
        }
    }


    /**
     * Check if page is already rated
     * Chack agains the localStorage property ratedPages
     * @param url
     */
    isRated(url) {

        let ratedPages = null;

        if (localStorage.getItem('ratedPages')) {
            ratedPages = JSON.parse(localStorage.getItem('ratedPages')) || []; // get ratedPages array from local storage
        }

        if(ratedPages !== null && ratedPages.indexOf(url) !== -1) { // check if local storage property exists
            return true;
        }
        return false;
    }


    /**
     * Disable rating buttons
     * Removes rating buttons from DOM
     */
    disableRatingButtons() {
        let buttons = [].slice.call(document.querySelectorAll('#appreciation-buttons button'));

        buttons.forEach ( (b) => {
            b.style.display = 'none';
        });
        document.querySelector('#appreciation-buttons span').style.display = 'block';
    }
}

