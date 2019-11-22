import * as data from '../config.json';

export function get(property:string):any{
    return (<any>data)[property];
}

export function passDecoder(pass:string){
    return Buffer.from(pass,'base64').toString("utf-8");
}