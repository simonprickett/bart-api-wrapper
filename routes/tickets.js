const Joi = require('@hapi/joi')
const bart = require('../bart')

const getTickets = (request, h) => {
    return `tickets: ${request.params.fromStationId} to ${request.params.toStationId}`
}

module.exports = [
    { 
        method: 'GET', 
        path: '/tickets/{fromStationId}/{toStationId}', 
        handler: getTickets, 
        options: { 
            tags: [ 
                'api', 
                'tickets' 
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