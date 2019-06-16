const Joi = require('@hapi/joi')
const bart = require('../bart')

const getDepartures = async (request, h) => {
    let stationId = 'all'

    if (request.params.stationId) {
         stationId = request.params.stationId
    }

    const obj = {
        section: 'etd',
        cmd: 'etd',
        orig: stationId
    }

    const response = await bart.callBARTAPI(obj)
    const r = {
        departures: response.station
    }

    return r
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
    // TODO consider direction and platform... http://api.bart.gov/docs/etd/etd.aspx
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