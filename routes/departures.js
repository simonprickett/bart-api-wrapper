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

    if (request.params.platformOrDirection) {
        const validDirections = ['n', 's']
        
        if (validDirections.includes(request.params.platformOrDirection)) {
            obj.dir = request.params.platformOrDirection
        } else {
            obj.plat = request.params.platformOrDirection
        }
    }

    const response = await bart.callBARTAPI(obj)

    const r = {
        departures: []
    }

    if (response && response.station) {
        for (const stn of response.station) {
            if (stn.etd) {
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

            r.departures = stn
        }   
    }

    if (! r.departures.etd) {
        r.departures.etd = []
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
    {
        method: 'GET',
        path: '/departures/{stationId}/{platformOrDirection}',
        handler: getDepartures,
        options: {
            tags: [
                'api',
                'departures'
            ],
            validate: {
                params: {
                    stationId: Joi.string().length(4).required().description('TODO'),
                    platformOrDirection: Joi.string().valid('1', '2', '3', '4', 'n', 's').required().description('TODO')
                }
            },
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