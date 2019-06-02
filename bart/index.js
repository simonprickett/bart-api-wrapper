const axios = require('axios')

const BART_API_BASE = 'http://api.bart.gov/api'
const DEFAULT_BART_KEY = 'MW9S-E7SL-26DU-VV8V'
const BART_API_KEY = process.env.BART_API_KEY || DEFAULT_BART_KEY

const getBARTUrl = params => {
    return (`${BART_API_BASE}/${params.section}.aspx?cmd=${params.cmd}${params.orig ? '&orig=' + params.orig : ''}${params.dest ? '&dest=' + params.to : ''}&key=${BART_API_KEY}&json=y`)
}

const callBARTAPI = async params => {
    if (BART_API_KEY === DEFAULT_BART_KEY) {
        console.log('You are using the default (shared) BART API key.  You should get your own key!')
    }
    const apiUrl = getBARTUrl(params)

    console.log(apiUrl)
    try {
        const response = await axios.get(apiUrl)

        const respObj = response.data.root

        delete respObj['@id']
        delete respObj.uri
        delete respObj.date
        delete respObj.time

        // TODO remove any #cdata-section trash...
        return respObj
    } catch (error) {
        console.error(error)
        return null
    }
}

module.exports = {
    callBARTAPI
}