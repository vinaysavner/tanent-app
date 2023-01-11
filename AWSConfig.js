const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
let cognitoAttributeList = [];

const poolData = {
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.AWS_COGNITO_CLIENT_ID
};

// const userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
// var attributeList = [];
// var attributeName = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute('name','John Smith');
// var attributeAddress =new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute('address','Sunshine street 123');
// var attributeEmail =new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute('email','john.smith@mail.com');
// attributeList.push(attributeName);
// attributeList.push(attributeAddress);
// attributeList.push(attributeEmail);
// var cognitoUser;
// userPool.signUp('johns', 'P@ssw0rd', attributeList, null, function(err, result){
//     if (err) {
//         console.log(err);
//         return;
//     }
//     cognitoUser = result.user;
//     console.log('user name is ' + cognitoUser.getUsername());
// });
const attributes = (key, value) => {
  return {
    Name: key,
    Value: value,
  }
 
};

function setCognitoAttributeList(firstName,lastName,type,email) {
  let attributeList = [];
  attributeList.push(attributes('email', email ));
  attributeList.push(attributes('custom:firstName',firstName))
  attributeList.push(attributes('custom:lastName',lastName))
  attributeList.push(attributes('custom:type',type))
  attributeList.forEach(element => {
    cognitoAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(element));
  });
  
}
console.log("attributes",attributes('email','payal.exergy@gmail.com','custom:firstName','payal','custom:lasttName','raghuvanshi'));

 

function getCognitoAttributeList() {
  return cognitoAttributeList;
}

function getCognitoUser(email) {
  const userData = {
    Username: email,
    Pool: getUserPool()
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function getAuthDetails(email, password) {
  var authenticationData = {
    Username: email,
    Password: password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

function initAWS(region = process.env.AWS_COGNITO_REGION, identityPoolId = process.env.AWS_COGNITO_IDENTITY_POOL_ID) {
  AWS.config.region = region; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
  });
}

function decodeJWTToken(token) {
  const { email, exp, auth_time, token_use, sub } = jwt_decode(token.idToken);
  return { token, email, exp, uid: sub, auth_time, token_use };
}

module.exports = {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
  decodeJWTToken,
}