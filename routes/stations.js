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

const getStationAccess = async (request, h) =>  {
    const obj = {
        section: 'stn',
        cmd: 'stnaccess'
    }

   
    if (request.params.stationId) {
        obj.orig = request.params.stationId

        const response = await bart.callBARTAPI(obj)

        const r = {
            stationAccess: []
        }

        if (response && response.stations && response.stations.station) {
            response.stations.station.parking_flag = response.stations.station['@parking_flag']
            response.stations.station.bike_flag = response.stations.station['@bike_flag']
            response.stations.station.bike_station_flag = response.stations.station['@bike_station_flag']
            response.stations.station.locker_flag = response.stations.station['@locker_flag']
            delete response.stations.station['@parking_flag']
            delete response.stations.station['@bike_flag']
            delete response.stations.station['@bike_station_flag']
            delete response.stations.station['@locker_flag']

            r.stationAccess.push(response.stations.station)
        }
        return r
    } else {
        return 'TODO: All stations access details...'
    }
}

const getStationInfo = async (request, h) => {
    const obj = {
        section: 'stn',
        cmd: 'stninfo'
    }

    if (request.params.stationId) {
        obj.orig = request.params.stationId

        const response = await bart.callBARTAPI(obj)

        // TODO tidy up returned format...
        const r = {
            stationInfo: []
        }

        if (response && response.stations && response.stations.station) {
            r.stationInfo.push(response.stations.station)
        }

        return r
    } else {
        return 'TODO: All stations info details...'
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
        path: '/stationaccess', 
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
        path: '/stationaccess/{stationId}', 
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
        path: '/stationinfo', 
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
        path: '/stationinfo/{stationId}', 
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