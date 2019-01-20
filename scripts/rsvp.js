class RSVP {

    constructor() {

        this.meetupApiKey = "36567d847437b42c29337351433b7a";
        this.eventInfoBlock = document.querySelector('.event-info');
    }

    init() {

        let self = this;
        self.meetupID = self.eventInfoBlock.getAttribute('data-meetup-id');
        console.log(self.meetupID);

        let url = addCallback("https://api.meetup.com/2/events?key=36567d847437b42c29337351433b7a&group_urlname=ny-techsign=true");

        jsonpClient(url, function (err, data) {
            if(err) {
                console.log(err);
            }
            console.log(data);
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