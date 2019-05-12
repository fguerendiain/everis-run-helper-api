"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const config = require("../config");
const logger = require("../logger");
const util_1 = require("util");
const MAILACCOUNT = config.get("credentials").senderGmailAccount;
function sendByMail(v_to, v_subject, v_text, v_html) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: MAILACCOUNT.user,
                pass: config.passDecoder(MAILACCOUNT.pass)
            }
        });
        if (util_1.isNullOrUndefined(v_html)) {
            v_html = '';
        }
        let sendOptions = {
            from: '[everis-run-helper-api] <' + MAILACCOUNT.user + '>',
            to: v_to,
            subject: "[everis-run-helper-api] - " + v_subject,
            text: v_text,
            html: v_html // html body
        };
        logger.info('EMAIL', 'sending to: ' + sendOptions.to + ' subject: ' + sendOptions.subject);
        try {
            yield transporter.sendMail(sendOptions);
            logger.info('EMAIL', 'send: OK');
        }
        catch (err) {
            logger.error('EMAIL', 'send: Fail - ' + err);
        }
    });
}
exports.sendByMail = sendByMail;
//# sourceMappingURL=EMAILTools.js.map