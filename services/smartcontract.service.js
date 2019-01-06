'use strict';

const SmartConractHubConnector = require('../../connectors/smartcontracthub.connector');
const db = require('../../connectors/mongodb.connector');


class SmartContractService {

    getList() {

        let smartConractHubConnector = new SmartConractHubConnector();

        return new Promise((resolve, reject) => {

            smartConractHubConnector.getList( (array) => {
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