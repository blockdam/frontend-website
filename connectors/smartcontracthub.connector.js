'use strict';
const Promise = require('bluebird');
const requestify = require('requestify');
const logger = require('../../services/logger.service');
const config = require('../../config/index');


class SmartContractHubConnector {

    constructor() {}

    getReadingList() {

        let self = this,
            url = 'https://blockdam.nl/smc-api/reading-list';

        return new Promise((resolve, reject) => {
            resolve();
            return requestify.get(url, {redirect: true, timeout: 120000})
            .then(response => {
                resolve(response);
            })
            .catch( (err) => {
                reject(err);
            });
        });
    }
}


module.exports = SmartContractHubConnector;
