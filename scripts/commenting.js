
class Commenting {
    constructor() {

        this.threadIndex = null;
        this.commentParent = null;
    }
    init() {}
}

class Respond extends Commenting {

    constructor() {

        super();
        this.response = {};
    }

    init(){

        var self = this;

        this.respondForm = document.getElementById("respondform");
        this.formTextArea = this.respondForm.querySelector('textarea');
        this.formInputFields = this.respondForm.querySelectorAll('input');
        this.theRestofForm = this.respondForm.querySelectorAll('.half');
        this.formSubmitButton = this.respondForm.querySelector('button');
        this.formSubmitWarning = this.respondForm.querySelector('#warning');
        this.commentTemplateNew = document.getElementById("comment-template-new");
        this.commentTemplateReply = document.getElementById("comment-template-reply");
        this.commentsWrapper = document.getElementById("comments-wrapper");
        this.url = window.location.href;
        this.validateForm();
    }

    openThread(el) {

        let self = this;

        this.commentParent = el.parentNode.getAttribute('data-thread-id');
        this.threadElement = document.querySelector('.thread[data-thread-id="' + self.commentParent + '"]');

        let newForm = self.respondForm.cloneNode(true);
        this.respondForm.remove();
        newForm.style.display = 'flex';
       // this.threadElement.insertBefore(newForm,this.threadElement.children[2]);
        this.threadElement.appendChild(newForm,this.threadElement);
        // this.onFocusOut();

        this.init();
        // this.onFocus();
        this.formTextArea.focus();
    }

    clearTextField() {

        this.formTextArea.value = '';
    }

    onFocus() {

        if (this.theRestofForm) {
            this.theRestofForm.forEach(function(el) {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
        }
        this.respondForm.style.height = 'auto';
        this.formTextArea.style.height = '8rem';

    }

    onFocusOut() {

        // these are new elements
        this.theRestofForm = this.respondForm.querySelectorAll('.half');
        this.respondForm = document.getElementById("respondform");
        this.formTextArea = this.respondForm.querySelector('textarea');

        if (this.theRestofForm) {
            this.theRestofForm.forEach(function(el) {
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
            });
        }
        this.formTextArea.style.height = 'auto';
        this.respondForm.style.height = '4.5rem';
    }

    hideButtonTemporarilyAfterSubmit() {

        var self = this;
        this.formSubmitButton.style.display = 'none';
        this.formSubmitWarning.style.display = 'block';
        setTimeout(function(){
            self.formSubmitButton.style.display = 'block';
            self.formSubmitWarning.style.display = 'none';
        }, 15000);
    }

    validateForm() {

        var self = this;

        this.respondForm.addEventListener('submit', function(event,errors) {
            event.preventDefault();
            if (errors) {
                document.getElementById('formerror').textContent = 'Wilt u alle drie de velden invullen?';
            } else {
                self.submitNewComment();
            }
        })
    }

    submitNewComment() {

        var self = this;

        this.response.author = document.getElementById("respondAuthor").value;
        this.response.email = document.getElementById("respondEmail").value;
        this.response.content = document.getElementById("respondMessage").value;
        this.response.postId = document.getElementById("respondPostId").value;
        // this.response.subscription = '';

        // if (document.getElementById("subscribeToAlerts").checked) {
        //     this.response.subscription = 'yes';
        // }

        document.getElementById("respondMessage").value = '';

        if (this.commentParent === null) {
            this.insertNewThread();
        } else {
            this.insertReply();
        }

        let url = '/wp-json/wp/v2/submit_comment?post_id=' + self.response.postId + '&name=' + encodeURIComponent(self.response.author) + '&email=' + self.response.email + '&message=' + encodeURIComponent(self.response.content) + '&comment_parent=' + self.commentParent + '&subscription=' + self.response.subscription;

        axios.post(url)
            .then(function(response){
                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
                console.log(response);
            });

        this.hideButtonTemporarilyAfterSubmit();
        this.clearTextField();
    }

    insertNewThread() {

        let self = this;
        let tempComment = self.commentTemplateNew.cloneNode(true);
        tempComment.querySelector('.datetime').innerHTML = this.response.author + ' | ' + moment().format('D MMMM YYYY | HH:mm');
        tempComment.querySelector('#commment-template-text').innerHTML = this.response.content;
        tempComment.removeAttribute('id');
        this.commentsWrapper.insertBefore(tempComment, this.commentsWrapper.firstChild);
        this.onFocusOut();

        setTimeout(function(){
            tempComment.classList.add('visible');
        },100);

    }

    insertReply() {

        let self = this;
        let tempComment = self.commentTemplateReply.cloneNode(true);
        tempComment.querySelector('h4').innerHTML = this.response.author;
        tempComment.querySelector('.datetime').innerHTML = moment().format('D MMMM YYYY | HH:mm');
        tempComment.querySelector('#commment-template-text').innerHTML = this.response.content;
        tempComment.style.display = 'flex';
        // return respondForm to top
        let newForm = self.respondForm.cloneNode(true);
        this.respondForm.remove();
        newForm.content = '';
        document.getElementById('respondcontainer').appendChild(newForm);
        this.onFocusOut();
        this.init();

        this.threadElement.insertBefore(tempComment,this.threadElement.children[2]);

        setTimeout(function(){
            tempComment.classList.add('visible');
            self.commentParent = null;
        },100);
    }

    rate(el,commentID){

        var self = this;

        if(self._isRated(commentID)) {
            self._disableRatingButtons(el); // disable rating buttons
            return;
        }

        let url = '/wp-json/wp/v2/comment_rating?comment_id=' + commentID;

        axios.post(url)
            .then(function(response){
                if (response.status !== 200) {
                    console.log('foutje bedankt')
                }
                console.log(response);
            });

        let valueContainer= el.parentNode.querySelector('.rating-value');
        let previousValue = parseInt(valueContainer.innerHTML);
        if (isNaN(previousValue)) { previousValue = 0; }

        let newValue = previousValue + 1;
        valueContainer.innerHTML = newValue;
        this._setRated(commentID);

    }

    _setRated(commentID) {
        let self = this;
        if (typeof(Storage) !== 'undefined') { // check if local stage is supported by browser

            let ratedComments = null;

            if (localStorage.getItem('ratedComments')) {
                ratedComments = JSON.parse(localStorage.getItem('ratedComments')); // get ratedPages array from local storage
            }

            // check if local storage property exists
            if(ratedComments === null) {
                ratedComments = [];
            }
            ratedComments.push(commentID); // add page to ratedPages

            localStorage.setItem('ratedComments', JSON.stringify(ratedComments)); // store in local storage
            // self.disableRatingButtons(); // disable rating buttons
        } else {
            // No local storage support
        }
    }

    _isRated(commentID) {

        let ratedComments = null;

        if (localStorage.getItem('ratedComments')) {
            ratedComments = JSON.parse(localStorage.getItem('ratedComments')) || []; // get ratedPages array from local storage
        }

        if (ratedComments !== null && ratedComments.indexOf(commentID) !== -1) { // check if local storage property exists
            return true;
        }
        return false;
    }

    _disableRatingButtons(el){
        el.removeAttribute("onclick");
    }
}

let commenting = new Commenting();
commenting.init();

let respond = new Respond();
respond.init();
