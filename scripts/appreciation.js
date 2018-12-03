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

        this.postID = document.querySelector('#post-id');
        self.url = window.location.href;

        // this.appreciationContainer = document.getElementById('blog-rating');
        // this.appreciationRow = document.querySelector('#appreciation-row');
        // this.arc = this.appreciationRow.querySelector('.circle-foreground');
        // this.percentageValue = this.appreciationRow.querySelector('#appreciation-percentage');
        // this.textPositiveCount = this.appreciationRow.querySelector('#text-positive-count');
        // this.textTotalCount = this.appreciationRow.querySelector('#text-total-count');

        this.buttonsPostive = [].slice.call(document.querySelectorAll('post-intro--stats--votes--up'));
        this.buttonsNegative = [].slice.call(document.querySelectorAll('post-intro--stats--votes--down'));

        this.buttonsPostive.forEach( (b) => {
            b.addEventListener('click', function(event,errors) {
                    self.ratePositive(post_id);
            });
        });

        this.buttonsNegative.forEach( (b) => {
            b.addEventListener('click', function(event,errors) {
                self.rateNegative(post_id);
            });
        });

        // this.rating = {};

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

            }).catch((error) => {
                console.log(error);

            });
    }

    ratePositive(postID) {

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

        document.querySelectorAll('post-intro--stats--votes--down span').innerHTML = self.rating;

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