'use strict';


/**
 * Service for authorization of the incoming api calls
 */
class BooleanService {

    correct(value) {
        const self = this;

        if (value === true || value === false) {
            return value;
        } else if (value === '1') {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = BooleanService;