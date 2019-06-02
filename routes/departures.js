const Joi = require('@hapi/joi')

const getDepartures = (request, h) => {
    if (request.params.stationId) {
         return `departures: ${request.params.stationId}`
    } else {
        return 'departures'
    }
}

module.exports = [
    { 
        method: 'GET', 
        path: '/departures', 
        handler: getDepartures,
        options: { 
            tags: [ 
                'api', 
                'departures' 
            ], 
            description: 'TODO', 
            notes: 'TODO' 
        } 
    },
    { 
        method: 'GET', 
        path: '/departures/{stationId}', 
        handler: getDepartures, 
        options: { 
            tags: [ 
                'api', 
                'departures' 
            ], 
            validate: {
                params: {
                    stationId: Joi.string().length(4).required().description('TODO')
                }
            },
            description: 'TODO', 
            notes: 'TODO' 
        } 
    }
]