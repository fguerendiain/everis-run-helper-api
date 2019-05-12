"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = require("../config.json");
function get(property) {
    return data[property];
}
exports.get = get;
function passDecoder(pass) {
    return Buffer.from(pass, 'base64').toString("ascii");
}
exports.passDecoder = passDecoder;
//# sourceMappingURL=config.js.map