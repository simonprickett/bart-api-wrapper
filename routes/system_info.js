const bart = require('../bart')

const getTrainCount = async (request, h) => {
    const response = await bart.callBARTAPI({
        section: 'bsa',
        cmd: 'count'
    })

    delete response.message

    try {
        if (response.traincount) {
            response.traincount = parseInt(response.traincount, 10)
        }
    } catch (e) {}

    return response
}

const getElevatorStatus = async (request, h) => {
    const response = await bart.callBARTAPI({
        section: 'bsa',
        cmd: 'elev'
    })

    return response
}

const getServiceAnnouncements = async (request, h) => {
    const response = await bart.callBARTAPI({
        section: 'bsa',
        cmd: 'bsa'
    })

    return response
}

module.exports = [
    { 
        method: 'GET', 
        path: '/traincount',  // TODO replace with number of trains...
        handler: getTrainCount, 
        options: { 
            tags: [ 
                'api', 
                'info' 
            ], 
            description: 'TODO', 
            notes: 'TODO' 
        } 
    },
    { 
        method: 'GET', 
        path: '/elevatorstatus', 
        handler: getElevatorStatus, 
        options: { 
            tags: [ 
                'api', 
                'info' 
            ], 
            description: 'TODO', 
            notes: 'TODO' 
        } 
    },
    { 
        method: 'GET', 
        path: '/serviceannouncements', 
        handler: getServiceAnnouncements, 
        options: { 
            tags: [ 
                'api', 
                'info' 
            ], 
            description: 'TODO', 
            notes: 'TODO' 
        } 
    }
]