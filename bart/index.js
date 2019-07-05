const axios = require('axios')
const util = require('util')

const BART_API_BASE = 'http://api.bart.gov/api'
const DEFAULT_BART_KEY = 'MW9S-E7SL-26DU-VV8V'
const BART_API_KEY = process.env.BART_API_KEY || DEFAULT_BART_KEY

// Rename keys beginning @ (poor mapping by BART from XML to JSON).
// Push any keys named #cdata-section up so that their value
// becomes the value of their parent key.
const reformatResponse = obj => {
    if (util.isArray(obj)) {
        for (let n = 0; n < obj.length; n++) {
            obj[n] = reformatResponse(obj[n])
        }
    } else if (typeof(obj) === 'object') {
        for (const key in obj) {
            if (key === '#cdata-section') {
                return obj[key]
            } else {
                let actualKey = key

                if (key.startsWith('@')) {
                    actualKey = key.substring(1)
                    obj[actualKey] = obj[key]
                    delete obj[key]
                }

                obj[actualKey] = reformatResponse(obj[actualKey])
            }
        }
    }

    return obj
}

const getBARTUrl = params => `${BART_API_BASE}/${params.section}.aspx?cmd=${params.cmd}${params.orig ? '&orig=' + params.orig : ''}${params.dest ? '&dest=' + params.dest : ''}&key=${BART_API_KEY}&json=y`

const callBARTAPI = async params => {
    if (BART_API_KEY === DEFAULT_BART_KEY) {
        console.log('You are using the default (shared) BART API key.  You should get your own key!')
    }

    const apiUrl = getBARTUrl(params)
    console.log(apiUrl)

    try {
        const response = await axios.get(apiUrl)
        const respObj = response.data.root

        // Remove stuff we don't care about.
        if (respObj) {
            delete respObj.id
            delete respObj.uri
            delete respObj.date
            delete respObj.time
        }

        return reformatResponse(respObj)
    } catch (error) {
        console.error(error)
        return null
    }
}

module.exports = {
    callBARTAPI
}