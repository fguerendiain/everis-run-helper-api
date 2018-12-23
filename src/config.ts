import * as data from '../config.json';

export function get(property:string):any{
    return (<any>data)[property];
}