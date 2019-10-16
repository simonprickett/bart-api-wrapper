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
    // This and serviceAnnouncements can be refactored as both 
    // pretty much do the same thing...
    const response = await bart.callBARTAPI({
        section: 'bsa',
        cmd: 'elev'
    })

    const r = {
        elevatorStatuses: []
    }

    if (response && response.bsa) {
        r.elevatorStatuses = response.bsa

        for (const elevatorStatus of r.elevatorStatuses) {
            elevatorStatus.smstext = elevatorStatus.sms_text
            delete elevatorStatus.sms_text
        }
    }

    return r
}

const getServiceAnnouncements = async (request, h) => {
    const response = await bart.callBARTAPI({
        section: 'bsa',
        cmd: 'bsa'
    })

    const r = {
        serviceAnnouncements: []
    }

    if (response && response.bsa) {
        r.serviceAnnouncements = response.bsa

        for (const serviceAnnouncement of r.serviceAnnouncements) {
            serviceAnnouncement.smstext = serviceAnnouncement.sms_text
            delete serviceAnnouncement.sms_text
        }
    }

    return r
}

module.exports = [
    { 
        method: 'GET', 
        path: '/traincount',
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