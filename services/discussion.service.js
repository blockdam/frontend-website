'use strict';

const PagePersistence = require('../../persistence/page.persistence');

/**
 * Service for authorization of the incoming api calls
 */
class DiscussionService {

    get() {

        return new Promise((resolve, reject) => {

            let pagePersistence = new PagePersistence();

            let postOptions = {
                query : {

                    'type' :  { $in : ['post','activity']},
                    'interaction.comment_count' : { $ne: 0 }
                },
                sort: {"interaction.last_comment_date": -1},
                limit: 3
            };

            pagePersistence.find(postOptions)
                .then( (content) => {
                    resolve(content);
                });
        });
    }
}

module.exports = DiscussionService;