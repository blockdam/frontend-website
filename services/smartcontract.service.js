'use strict';

const SmartContractHubConnector = require('../../connectors/smartcontracthub.connector');
const db = require('../../connectors/mongodb.connector');


class SmartContractService {

    getReadingList() {

        let smartContractHubConnector = new SmartContractHubConnector();

        return new Promise((resolve, reject) => {

            smartConractHubConnector.getReadingList( (array) => {
                db.getLinksCollection()
                .then((collection) => {
                    return collection.find({'_id' : array }).toArray();
                })
                .then((result) => {
                    resolve(result);
                });
            });
        });
    }
}

module.exports = SmartContractService;