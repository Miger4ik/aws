const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider({region: 'us-east-2'})

const deleteUser = async(userPollId, username) => {
    return await new Promise((resolve, reject) => {
        const params = {
            UserPoolId: userPollId,
            Username: username
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

const listUsers = async(userPollId, usernamePrefix) => {
    return await new Promise((resolve, reject) => {

        const usernameFilter = "username ^= " + "\"" + usernamePrefix + "\""

        const params = {
            UserPoolId: userPollId, 
            AttributesToGet: null,
            Filter: usernameFilter,      /* "username ^= \"test_\"" -> ім'я юзеру починається з test_ */
            Limit: null,
            PaginationToken: null
        }

        cognito.listUsers(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const main = async(event) => {
    console.log('Event:', event)
    var users = listUsers(event.userPollId, event.usernamePrefix)
    return users
}

exports.lambdaHandler = main

// for local use only
// const config = require('./config.json')
// main({
//     userPollId: config.userPollId,
//     usernamePrefix: config.usernamePrefix
// })