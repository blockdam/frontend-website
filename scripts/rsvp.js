class RSVP {

    constructor() {

        this.meetupApiKey = "36567d847437b42c29337351433b7a";
        this.eventInfoBlock = document.querySelector('.event-info');
    }

    init() {

        let self = this;
        self.meetupID = self.eventInfoBlock.getAttribute('data-meetup-id');
        console.log(self.meetupID);
    }


}

var rsvp = new RSVP();
rsvp.init();