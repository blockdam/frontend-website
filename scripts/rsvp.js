class RSVP {

    constructor() {

        this.meetupApiKey = "36567d847437b42c29337351433b7a";
        this.eventInfoBlock = document.querySelector('.event-info');
    }

    init() {

        let self = this;
        self.meetupID = self.eventInfoBlock.getAttribute('data-meetup-id');
        console.log(self.meetupID);

        let url = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&event_id=hsbcqqyzcbdc&photo-host=public&page=20&fields=&order=time&desc=false&status=upcoming&sign=true&key=36567d847437b42c29337351433b7a";

        axios.get(url)
            .then(function(response){
                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
                console.log(response);
            });


    }


}

var rsvp = new RSVP();
rsvp.init();