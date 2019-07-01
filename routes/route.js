const Joi = require('@hapi/joi')
const bart = require('../bart')

const getRoute = async (request, h) => {
    const r = {
        route: []
    }

    // TODO time...

    const response = await bart.callBARTAPI({
        section: 'sched',
        cmd: 'depart',
        orig: request.params.fromStationId,
        dest: request.params.toStationId
    })

    // TODO error checking!
    // TODO naming changes and deletes
    // TODO delete fares part
    r.route.push(response.schedule.request.trip[0])

    return r
}

module.exports = [
    { 
        method: 'GET', 
        path: '/route/{fromStationId}/{toStationId}', 
        handler: getRoute, 
        options: { 
            tags: [ 
                'api', 
                'route' 
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