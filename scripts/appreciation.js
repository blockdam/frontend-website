class Appreciation {

    constructor() {

        // this.ip = null;
        this.rating = {};

    }

    init(post_id) {

        let self = this;

        self.url = window.location.href;

        this.buttonsPostive = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--up'));
        this.buttonsNegative = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--down'));
        this.countsPositive = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--up span'));
        this.countsNegative = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--down span'));


        this.buttonsPostive.forEach( (b) => {

            b.addEventListener('click', function(event,errors) {
                console.log(post_id);
                self.ratePositive(post_id);
            });
        });

        this.buttonsNegative.forEach( (b) => {
            b.addEventListener('click', function(event,errors) {
                self.rateNegative(post_id);
            });
        });


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

            }).catch((error) => {
                console.log(error);

            });
    }

    ratePositive(postID) {

        console.log(postID);

        let self = this,
            newPercentage,
            url = '/wp-json/wp/v2/post_rating?post_ID=' + postID + '&value=positive';


        axios.post(url)
            .then(function(response){

                console.log(response);


                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
            });

        console.log(self.rating);

        this.countsPositive.forEach( (span) => {
            span.innerHTML = parseInt(self.rating.positive_count) + 1;
        });



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

        this.countsNegative.forEach( (span) => {
            span.innerHTML = parseInt(self.rating.negative_count) + 1;
        });

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

        this.buttonsPostive.forEach( (b) => {
            b.removeEventListener('click', function(event,errors) {
                self.ratePositive(post_id);
            });
        });

        this.buttonsNegative.forEach( (b) => {
            b.removeEventListener('click', function(event,errors) {
                self.rateNegative(post_id);
            });
        });
    }
}