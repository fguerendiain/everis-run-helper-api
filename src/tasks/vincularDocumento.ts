import { Request, Response } from 'express'
import { ProductionDBTools }  from '../tools/productionDB'
import { NOCTools }  from '../tools/NOCTools'

export function run(req: Request, res: Response){
    const results = []

    ProductionDBTools.connect(db => {

        db.runQuery("select * from dual", rawUsers => {
            rawUsers.forEach( rawUser => {
                const cleanUser = {
                    _id: rawUser.id,
                    name: rawUser.nombre_completo
                }

                NOCTools.runThing(cleanUser, result => {
                    
                })
            })
        })
    })
}
