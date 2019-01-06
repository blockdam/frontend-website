'use strict';

const SmartContractHubConnector = require('../connectors/smartcontracthub.connector');
const db = require('../../connectors/mongodb.connector');
const logger = require('../../services/logger.service');



class SmartContractService {

    getReadingList() {

        let smartContractHubConnector = new SmartContractHubConnector();
        let IdList;

        return new Promise((resolve, reject) => {

            smartContractHubConnector.getReadingList()
                .then( array => {
                    IdList = array;
                    return db.getLinksCollection()
                })
                .then((collection) => {
                    return collection.find({'_id' : IdList }).toArray();
                })
                .then((result) => {
                    logger.info(result);
                    resolve(result);
                })
                .catch( (err) => {
                    reject(err);
                });
            });
    }
}

module.exports = SmartContractService;