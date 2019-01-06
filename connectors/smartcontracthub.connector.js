'use strict';
const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');
const requestify = require('requestify');
const logger = require('../../services/logger.service');
const config = require('../../config/index');
const _ = require('lodash');


class SmartContractHubConnector {

    constructor() {

        // this.concatenatedResponse = [];
        // this.page = 0;
        this.results = []

    }

    getReadingList() {

        let self = this,
            url = 'https://blockdam.nl/smc-api/reading-list/';

        return new Promise((resolve, reject) => {

            requestify.get(url, {redirect: true, timeout: 120000})
                .then(response => {
                    resolve(response);
                });
        });
    }
}


module.exports = SmartContractHubConnector;
