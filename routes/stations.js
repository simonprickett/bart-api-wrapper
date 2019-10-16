const Joi = require('@hapi/joi')
const bart = require('../bart')

const getStations = async stationId => {
    const obj = {
        section: 'stn',
        cmd: 'stns'
    }

    const response = await bart.callBARTAPI(obj)
    const r = {
        stations: response.stations.station
    }

    // Filter response for individual station if requested.
    if (stationId) {
        const compareId = stationId.toUpperCase()
        r.stations = r.stations.filter(station => station.abbr === compareId)
    }

    for (const station of r.stations) {
        station.latitude = parseFloat(station.gtfs_latitude, 10)
        station.longitude = parseFloat(station.gtfs_longitude, 10)
        delete station.gtfs_latitude
        delete station.gtfs_longitude
    }

    return r
}

const getStationAccess = async stationId =>  {
    const obj = {
        section: 'stn',
        cmd: 'stnaccess'
    }

   
    if (stationId) {
        obj.orig = stationId

        const response = await bart.callBARTAPI(obj)

        const r = {
            stationAccess: []
        }

        // TODO better error checking...

        if (response && response.stations && response.stations.station) {
            // This could maybe be pushed into the bart/index.js file...
            response.stations.station.parking_flag = response.stations.station['parking_flag'] === '1' ? true : false
            delete response.stations.station.parking_flag
            response.stations.station.bikeflag = response.stations.station.bike_flag === '1' ? true : false
            delete response.stations.station.bike_flag
            response.stations.station.bikestationflag = response.stations.station.bike_station_flag === '1' ? true : false
            delete response.stations.station.bike_station_flag
            response.stations.station.lockerflag = response.stations.station.locker_flag === '1' ? true : false
            delete response.stations.station.locker_flag
            response.stations.station.filltime = response.stations.station.fill_time
            delete response.stations.station.fill_time

            r.stationAccess.push(response.stations.station)
        }
        return r
    } else {
        return 'TODO: All stations access details...'
    }
}

const getStationInfo = async stationId => {
    const obj = {
        section: 'stn',
        cmd: 'stninfo'
    }

    if (stationId) {
        obj.orig = stationId

        const response = await bart.callBARTAPI(obj)

        // TODO tidy up returned format...
        const r = {
            stationInfo: []
        }

        if (response && response.stations && response.stations.station) {
            r.stationInfo.push(response.stations.station)
        }

        for (const station of r.stationInfo) {
            station.latitude = parseFloat(station.gtfs_latitude, 10)
            station.longitude = parseFloat(station.gtfs_longitude, 10)
            delete station.gtfs_latitude
            delete station.gtfs_longitude
            
            station.platforminfo = station.platform_info
            delete station.platform_info
            station.crossstreet = station.cross_street
            delete station.cross_street

            station.northroutes = station.north_routes
            delete station.north_routes
            station.southroutes = station.south_routes
            delete station.south_routes

            station.northplatforms = station.north_platforms
            delete station.north_platforms
            station.southplatforms = station.south_platforms
            delete station.south_platforms

            station.northroutes = [ ...station.northroutes.route ]
            station.southroutes = [ ...station.southroutes.route ]

            station.northplatforms = [ ...station.northplatforms.platform ]
            station.southplatforms = [ ...station.southplatforms.platform ]
        }

        return r
    } else {
        return 'TODO: All stations info details...'
    }
}

const getNearbyStations = (lat, lng, limit) => {
    return `stations near ${lat}, ${lng}, ${limit}`
}

module.exports = [
    { 
        method: 'GET', 
        path: '/stations', 
        handler: async (request, h) => getStations(),
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
        handler: async (request, h) => getStations(request.params.stationId), 
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
        handler: async (request, h) => getNearbyStations(request.params.latitude, request.params.longitude, request.query.limit), 
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
        handler: async (request, h) => getStationAccess(), 
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
        handler: async (request, h) => getStationAccess(request.params.stationId), 
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
        handler: async (request, h) => getStationInfo(), 
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
        handler: async (request, h) => getStationInfo(request.params.stationId), 
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