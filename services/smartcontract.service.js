'use strict';

const SmartContractHubConnector = require('../connectors/smartcontracthub.connector');
const ObjectId = require('mongodb').ObjectID;
const db = require('../../connectors/mongodb.connector');
const logger = require('../../services/logger.service');

class SmartContractService {

    getReadingList() {

        let smartContractHubConnector = new SmartContractHubConnector();
        let IdList;
        let Linkarray = []

        return new Promise((resolve, reject) => {

            smartContractHubConnector.getReadingList()
                .then( array => {

                    logger.info(array);
                    IdList = array.map( id => ObjectId(id));
                    return db.getLinksCollection()
                })
                .then((collection) => {

                    let promises = [];

                    IdList.forEach( (id) => {

                        promises.push(
                            collection.find({
                                '_id': id
                            })
                        );
                    });

                    return Promise.all(promises);
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