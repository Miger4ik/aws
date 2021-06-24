"use strict";
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

function cognitoSetRegion(region) {
    cognito.region = region;
}

const deleteUser = async(UserPoolId, Username) => {
    return await new Promise((resolve, reject) => {

        cognito.adminDeleteUser({UserPoolId, Username}, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const clearAllTestUsers = async(userPollId, usernamePrefix) => {
    return await new Promise((resolve, reject) => {

        const usernameFilter = `username ^= \"${usernamePrefix}\"`; // "username ^= " + "\"" + usernamePrefix + "\"";

        const params = {
            UserPoolId: userPollId, 
            AttributesToGet: null,
            Filter: usernameFilter,      /* "username ^= \"test_\"" -> ім'я юзеру починається з test_ */
            Limit: null,
            PaginationToken: null
        };

        cognito.listUsers(params, async (err, data) => {
            if (err) {
                reject(err);
            } else {
                await Promise.all(data.Users.map(u => deleteUser(userPollId, u.Username)));
                resolve(data);
            }
        });
    });
};

const main = async(event) => {
    console.log('Event:', event);
    cognitoSetRegion(event.region);
    return clearAllTestUsers(event.userPollId, event.usernamePrefix);
};

exports.lambdaHandler = main;
// js-lambda-from-vs