'use strict';

const Promise = require('bluebird');
const requestify = require('requestify');


class SmartContractHubConnector {

    constructor() {}

    getReadingList() {

        return new Promise((resolve, reject) => {

            requestify.get('https://blockdam.nl/smc-api/reading-list')
            .then( response => {
                resolve(response.getBody());
            })
            .catch( (err) => {
                reject(err);
            });
        });
    }
}


module.exports = SmartContractHubConnector;
