"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const logger = require("../logger");
function handlePromises(queryArray, endMessage, resExpress) {
    let jsonResponseArray = { "response": [] };
    Promise.all(queryArray)
        .then((results) => {
        for (let i = 0; i < results.length; i++) {
            if (util_1.isNullOrUndefined(results[i])) {
                logger.error('PROMISE', 'response [' + results[i] + ']');
            }
            else {
                jsonResponseArray.response.push(results[i]);
            }
        }
        if (util_1.isNullOrUndefined(resExpress)) {
            logger.taskEndInfo(endMessage);
            return jsonResponseArray.response;
        }
        else {
            resExpress.status(200).send(jsonResponseArray.response);
            logger.taskEndInfo(endMessage);
        }
    });
}
exports.handlePromises = handlePromises;
//# sourceMappingURL=PromiseTools.js.map