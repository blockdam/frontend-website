class RSVP {

    constructor() {

        this.meetupApiKey = "36567d847437b42c29337351433b7a";
        this.eventInfoBlock = document.querySelector('.event-info');
    }

    init() {

        let self = this;
        self.meetupID = self.eventInfoBlock.getAttribute('data-meetup-id');
        console.log(self.meetupID);

        let url = self.addCallback("https://api.meetup.com/2/events?&sign=true&photo-host=public&event_id=hsbcqqyzcbdc&page=20");

        jsonpClient(url, function (err, data) {
            if(err) {
                console.log(err);
            }
            console.log(data.results[0].rsvp_limit);
            console.log(data.results[0].yes_rsvp_count);
            console.log(data.results[0].waitlist_count);
        });

        // axios.get(url)
        //     .then(function(response){
        //         if (response.status !== 200) {
        //             console.log('foutje bedankt')
        //         }
        //         console.log(response);
        //     });


    }

    addCallback(url) {
        // The URL already has a callback
        if (url.match(/callback=[a-z]/i)) {
            return url;
        }
        return url + ("&callback=cb" + Math.random()).replace('.', '');
    }


}

var rsvp = new RSVP();
rsvp.init();