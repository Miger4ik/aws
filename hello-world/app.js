"use strict";
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

function cognitoSetRegion(region) {
    cognito.region = region;
}

const deleteUser = async(userPollId, username) => {
    return await new Promise((resolve, reject) => {

        const params = {
            UserPoolId: userPollId,
            Username: username
        };

        cognito.adminDeleteUser(params, (err, data) => {
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

        cognito.listUsers(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let key in data.Users) {
                    deleteUser(userPollId, data.Users[key].Username);
                }
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