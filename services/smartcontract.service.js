'use strict';

const SmartContractHubConnector = require('../connectors/smartcontracthub.connector');
const db = require('../../connectors/mongodb.connector');
const logger = require('../../services/logger.service');



class SmartContractService {

    getReadingList() {

        let smartContractHubConnector = new SmartContractHubConnector();
        let IdList;
        let ObjectId;

        return new Promise((resolve, reject) => {

            smartContractHubConnector.getReadingList()
                .then( array => {
                    IdList = array; // .map( id => ObjectId(id);
                    return db.getLinksCollection()
                })
                .then((collection) => {
                    logger.info(IdList);
                    return collection.find({
                        '_id': {
                            $in: IdList
                        }
                    }); // .toArray();
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