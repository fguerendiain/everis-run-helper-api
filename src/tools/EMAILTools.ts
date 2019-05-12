import * as nodemailer from 'nodemailer';
import * as config from '../config';
import * as logger from '../logger';
import { isNullOrUndefined } from 'util';


const MAILACCOUNT = config.get("credentials").senderGmailAccount;

export async function sendByMail(v_to:string,v_subject:string,v_text:string,v_html?:string){

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

    if(isNullOrUndefined(v_html)){
        v_html = '';
    }

    let sendOptions = {
        from: '[everis-run-helper-api] <'+MAILACCOUNT.user+'>', // sender address
        to: v_to, // list of receivers
        subject: "[everis-run-helper-api] - "+v_subject, // Subject line
        text: v_text, // plain text body
        html: v_html // html body
    };

    logger.info('EMAIL','sending to: '+sendOptions.to+' subject: '+sendOptions.subject);

    try{
        await transporter.sendMail(sendOptions);
        logger.info('EMAIL','send: OK');
    }catch(err){
        logger.error('EMAIL','send: Fail - '+err);
    }
}