class RSVP {

    constructor() {

        this.meetupApiKey = "36567d847437b42c29337351433b7a";
        this.meetupUrlName = "Permissionless-Society";
        this.eventInfoBlock = document.querySelector('.event-info');
    }

    init() {

        let self = this;
        self.meetupID = self.eventInfoBlock.getAttribute('data-meetup-id');

        // let eventUrl = self.addCallback("https://api.meetup.com/2/events?&sign=true&photo-host=public&event_id=" + self.meetupID + "&page=20");
        //
        // jsonpClient(eventUrl, function (err, data) {
        //     if(err) {
        //         console.log(err);
        //     }
        //     console.log(data.results[0].rsvp_limit);
        //     console.log(data.results[0].yes_rsvp_count);
        //     console.log(data.results[0].waitlist_count);
        // });


        let rsvpUrl = self.addCallback("https://api.meetup.com/" + self.meetupUrlName + "/events/" + self.meetupID + "/rsvps?&sign=true&photo-host=public");

        jsonpClient(rsvpUrl, function (err, data) {
            if(err) {
                console.log(err);
            }
            console.log(data);
        });




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