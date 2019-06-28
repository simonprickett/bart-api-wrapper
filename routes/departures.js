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

    // TODO error checking...

    for (const stn of response.station) {
        for (const destination of stn.etd) {
            destination.limited = destination.limited === '0' ? false : true

            for (const estimate of destination.estimate) {
                estimate.minutes = estimate.minutes === 'Leaving' ? 0 : parseInt(estimate.minutes, 10)
                estimate.length = parseInt(estimate.length, 10)
                estimate.platform = parseInt(estimate.platform, 10)
                estimate.bikeflag = estimate.bikeflag === '1' ? true : false
                estimate.delay = parseInt(estimate.delay, 10)
            }
        }
    }   

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