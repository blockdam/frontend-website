'use strict';

const SmartContractHubConnector = require('../connectors/smartcontracthub.connector');
const ObjectId = require('mongodb').ObjectID;
const db = require('../../connectors/mongodb.connector');
const logger = require('../../services/logger.service');

class SmartContractService {

    getReadingList() {

        let smartContractHubConnector = new SmartContractHubConnector();
        let IdList;

        return new Promise((resolve, reject) => {

            smartContractHubConnector.getReadingList()
                .then( array => {

                    IdList = array.map( id => ObjectId(id));
                    return db.getLinksCollection()
                })
                .then((collection) => {
                    return collection.find({
                        '_id': {
                            $in : IdList
                        }
                    }).toArray();
                })
                .then((result) => {

                    IdList.forEach( id => {
                        logger.info(id.toString());
                    })
                    resolve(result);
                })
                .catch( (err) => {
                    reject(err);
                });
            });
    }
}

module.exports = SmartContractService;