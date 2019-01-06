'use strict';

const SmartContractHubConnector = require('../../connectors/smartcontracthub.connector');
const db = require('../../connectors/mongodb.connector');


class SmartContractService {

    getReadingList() {

        let smartContractHubConnector = new SmartContractHubConnector();

        return new Promise((resolve, reject) => {

            logger.info('hii');

            smartContractHubConnector.getReadingList( (array) => {
                logger.info(array);
                db.getLinksCollection()
                .then((collection) => {
                    return collection.find({'_id' : array }).toArray();
                })
                .then((result) => {
                    logger.info(result);
                    resolve(result);
                });
            });
        });
    }
}

module.exports = SmartContractService;