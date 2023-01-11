const { response } = require("express");
const AwsConfig = require("./AWSConfig");
// const Users = require("../models/user");
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

function usersss(){
    var AuthenticationDetails = new AmazonCognitoIdentity.CognitoUserAttribute()
     console.log("aaa",AuthenticationDetails.sub)
  }
module.exports = usersss()



async function profileAttributeConfirm(poolData, body, cb) {
  try {
    const { attribute } = body;
    const cognitoUser = await AwsConfig.getCognitoUser(poolData, body);

    cognitoUser.getUserAttributes(attribute, {
      onSuccess(result) {
        console.log("datattaat",result.user.userSub);
        cb(null, result);
      },
      onFailure(err) {
        cb(err);
      }
    });
  } catch (err) {
    cb(err);
  }
}

module.exports = profileAttributeConfirm;
