const Joi = require('@hapi/joi')
const bart = require('../bart')

const getStations = async (request, h) => {
    const obj = {
        section: 'stn',
        cmd: 'stns'
    }

    const response = await bart.callBARTAPI(obj)
    const r = {
        stations: response.stations.station
    }

    // Filter response for individual station if requested.
    if (request.params.stationId) {
        const compareId = request.params.stationId.toUpperCase()
        r.stations = r.stations.filter(station => station.abbr === compareId)
    }

    return r
}

const getStationAccess = (request, h) =>  {
    if (request.params.stationId) {
        return `stationAccess: ${request.params.stationId}`
    } else {
        return 'stationAccess'
    }
}

const getStationInfo = (request, h) => {
    if (request.params.stationId) {
        return `stationInfo: ${request.params.stationId}`
    } else {
        return 'stationInfo'
    }
}

const getNearbyStations = (request, h) => {
    return `stations near ${request.params.latitude}, ${request.params.longitude}, ${request.query.limit}`
}

module.exports = [
    { 
        method: 'GET', 
        path: '/stations', 
        handler: getStations, 
        options: { 
            tags: [ 
                'api', 
                'stations' 
            ], 
            description: 'TODO', 
            notes: 'TODO' 
        }
    },
    { 
        method: 'GET', 
        path: '/stations/{stationId}', 
        handler: getStations, 
        options: { 
            tags: [ 
                'api', 
                'stations' 
            ], 
            validate: {
                params: {
                    stationId: Joi.string().length(4).required().description('TODO')
                }
            },
            description: 'TODO', 
            notes: 'TODO' 
        }
    },
    { 
        method: 'GET', 
        path: '/stations/{latitude}/{longitude}', 
        handler: getNearbyStations, 
        options: { 
            tags: [ 
                'api', 
                'stations' 
            ], 
            validate: {
                params: {
                    latitude: Joi.number().min(-90).max(90).required().description('TODO'),
                    longitude: Joi.number().min(-180).max(180).required().description('TODO')
                },
                query: {
                    limit: Joi.number().integer().min(1).default(1).optional().description('TODO')
                }
            },
            description: 'TODO', 
            notes: 'TODO' 
        }
    },
    { 
        method: 'GET', 
        path: '/stationAccess', 
        handler: getStationAccess, 
        options: { 
            tags: [ 
                'api', 
                'stations' 
            ], 
            description: 'TODO', 
            notes: 'TODO' 
        }
    },
    { 
        method: 'GET', 
        path: '/stationAccess/{stationId}', 
        handler: getStationAccess, 
        options: { 
            tags: [ 
                'api', 
                'stations' 
            ], 
            validate: {
                params: {
                    stationId: Joi.string().length(4).required().description('TODO')
                }
            },
            description: 'TODO', 
            notes: 'TODO' 
        }
    },
    { 
        method: 'GET', 
        path: '/stationInfo', 
        handler: getStationInfo, 
        options: { 
            tags: [ 
                'api', 
                'stations' 
            ], 
            description: 'TODO', 
            notes: 'TODO' 
        }
    },
    { 
        method: 'GET', 
        path: '/stationInfo/{stationId}', 
        handler: getStationInfo, 
        options: { 
            tags: [ 
                'api', 
                'stations' 
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