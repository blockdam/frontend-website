
class Home {

    constructor() {
    }

    init() {

        this.testimonialSnippets = [].slice.call(document.querySelectorAll('.quote'));

        let self = this;


    }

    nextSnippet(index) {

        if(index === this.testimonialSnippets.length) {
            index = 0;
        }

        this.testimonialSnippets.forEach((t) => {
           t.classList.remove('active');
        });

        this.testimonialSnippets[index].classList.add('active');

        let snippet = anime.timeline();

        snippet
            .add({
                targets: this.testimonialSnippets[index],
                translateX: ['-1600px','0'],
                easing: 'easeOutExpo',
                duration: 500,
                offset: 0
            });
    }

    skip() {

    }
}

var home = new Home();
home.init();