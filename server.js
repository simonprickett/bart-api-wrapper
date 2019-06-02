const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')

const PORT = process.env.port || 8080

const routes = require('./routes')

const init = async() => {
    const server = Hapi.server({
        port: PORT,
        host: '0.0.0.0',
        routes: {
            cors: true
        },
        router: {
            stripTrailingSlash: true,
        }
    })

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'BART API Wrapper Documentation',
                    version: Pack.version
                }
            }
        }
    ])

    server.route(routes)

    await server.start()
    console.log(`BART API Wrapper - Server running at ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
})

init()

// TODO...
// test cors...
// more swagger... replace TODO with real information


// STATION INFORMATION

// Get all stations: X
// GET http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y

// Get info for a station: X
// GET http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=24th&key=MW9S-E7SL-26DU-VV8V&json=y

// Get access details for a station: X
// GET http://api.bart.gov/api/stn.aspx?cmd=stnaccess&orig=12th&key=MW9S-E7SL-26DU-VV8V&l=1&json=y

// SYSTEM INFORMATION

// Get all advisories: 
// GET http://api.bart.gov/api/bsa.aspx?cmd=bsa&key=MW9S-E7SL-26DU-VV8V&json=y

// Get number of trains active:
// GET http://api.bart.gov/api/bsa.aspx?cmd=count&key=MW9S-E7SL-26DU-VV8V&json=y

// Get information about elevator issues:
// GET http://api.bart.gov/api/bsa.aspx?cmd=elev&key=MW9S-E7SL-26DU-VV8V&json=y

// DEPARTURE TIMES

// Get all departure times for a station
// GET http://api.bart.gov/api/etd.aspx?cmd=etd&orig=POWL&key=MW9S-E7SL-26DU-VV8V&json=y

// TICKETS

// Get ticket price between two stations
// GET http://api.bart.gov/api/sched.aspx?cmd=fare&orig=sfia&dest=embr&date=now&key=MW9S-E7SL-26DU-VV8V&json=y