const Joi = require('@hapi/joi')
const bart = require('../bart')

const getFares = async (request, h) => {
    const r = {
        fares: []
    }

    const response = await bart.callBARTAPI({
        section: 'sched',
        cmd: 'fare',
        orig: request.params.fromStationId,
        dest: request.params.toStationId
    })

    if (response && response.fares && response.fares.fare) {
        for (const fare of response.fares.fare) {
            r.fares.push(fare)
        }
    }

    return r
}

module.exports = [
    { 
        method: 'GET', 
        path: '/fares/{fromStationId}/{toStationId}', 
        handler: getFares, 
        options: { 
            tags: [ 
                'api', 
                'fares' 
            ],
            validate: {
                params: {
                    fromStationId: Joi.string().length(4).required().description('TODO'),
                    toStationId: Joi.string().length(4).required().description('TODO')
                }
            },
            description: 'TODO', 
            notes: 'TODO' 
        } 
    }
]