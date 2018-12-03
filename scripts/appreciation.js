class Appreciation {

    constructor() {

        // this.ip = null;
        this.rating = {};
        this.post_id = null;

    }

    init(post_id) {

        let self = this;

        self.url = window.location.href;
        self.post_id = post_id;

        this.buttonsPostive = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--up'));
        this.buttonsNegative = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--down'));
        this.countsPositive = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--up span'));
        this.countsNegative = [].slice.call(document.querySelectorAll('.post-intro--stats--votes--down span'));

        // this.buttonsPostive.forEach( (b) => {
        //
        //     b.addEventListener('click', self.ratePositive(),false);
        // });

        this.buttonsNegative.forEach( (b) => {

            b.addEventListener('click', function(event,errors) {
                self.rateNegative();
            });
        });


        if(self.isRated(this.url)) {
            self.disableRatingButtons(); // disable rating buttons
        }

        // this.get(post_id);
    }

    // get(post_id) {
    //
    //     let self = this,
    //         url = '/wp-json/wp/v2/post_rating?post_ID=' + post_id;
    //
    //     axios.get(url)
    //         .then(function(response){
    //             if (response.status !== 200) {
    //                 console.log('foutje bedankt')
    //             }
    //             self.rating = response.data;
    //
    //         }).catch((error) => {
    //             console.log(error);
    //
    //         });
    // }

    ratePositive() {


        function() {

            let self = this,
                newPercentage,
                url = '/wp-json/wp/v2/post_rating?post_ID=' + self.post_id + '&value=positive';

            axios.post(url)
                .then(function (response) {

                    if (response.status !== 200) {
                        console.log('foutje bedankt')
                    }
                });

            this.countsPositive.forEach((span) => {
                span.innerHTML = parseInt(self.rating.positive_count) + 1;
            });

            this.setRated(self.url);
        }
    }

    rateNegative() {

        let self = this,
            url = '/wp-json/wp/v2/post_rating?post_ID=' + self.post_id + '&value=negative';

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
                self.ratePositive();
            });
        });

        this.buttonsNegative.forEach( (b) => {
            b.removeEventListener('click', function(event,errors) {
                self.rateNegative();
            });
        });
    }
}