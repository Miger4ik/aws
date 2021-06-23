const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider({region: 'us-east-2'})

const deleteUser = async(sub) => {
    return await new Promise((resolve, reject) => {
        const params = {
            UserPoolId: 'us-east-2_BSmTaxcbR',
            Username: sub
        }

        cognito.adminDeleteUser(params, (err, data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const main = async(event) => {
    console.log('Event:', event)
    return deleteUser(event.sub)
}

exports.lambdaHandler = main

// for local use only
const config = require('./config.json')
main({
    sub: config.sub,
})