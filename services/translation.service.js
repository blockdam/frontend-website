'use strict';


/**
 * Service for authorization of the incoming api calls
 */
class TranslationService {

    path(lan,path) {

        return new Promise((resolve, reject) => {

            if (lan === 'en') {
                resolve('en/' + path);
            } else {
                resolve(path);
            }
        });
    }
}

module.exports = TranslationService;