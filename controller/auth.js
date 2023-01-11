const { response } = require("express");
const AwsConfig = require("../AWSConfig");
const db = require("../models/index");
const Users = db.users;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');


// const user = require("../models/user");
// async function users(req, username) {
//   const username = {
//     username: AwsConfig.getUserPool()

//     // return resolve({ statusCode: 200, response: AwsConfig.decodeJWTToken(token) });
//   };
//   // let cognito = AwsConfig.getCognitoUser().username
//   // console.log("cognito",cognito);
//   try {
//     const users = await Users.create({
//       user_id: AwsConfig.decodeJWTToken(token).uid,
//       type: `tenant`,
//       status: `True`,
//     });
//     res.status(201).send(users);
//   } catch (e) {
//     console.log(e);
//     res.status(400).send(e);
//   }
// }

// async function user(username) {
//   const params = {
//     Username: username,
//   };

//   try {
//     const data = await AwsConfig.getCognitoUser(params);
//     console.log("dataaaa",data.getUsername());
//    const dataaa = data.getUsername()
//     const users = await Users.create({
//       user_id: dataaa,
//       type: `tenant`,
//       status: `True`,
//     });
//     res.status(201).send(users);
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// }






function signUp(firstName, lastName, type, email, password, agent = "none") {
  return new Promise((resolve) => {
    AwsConfig.initAWS();
    AwsConfig.setCognitoAttributeList(firstName, lastName, type, email, agent);
    AwsConfig.getUserPool().signUp(
      email,
      password,
      AwsConfig.getCognitoAttributeList(),
      null,
      function (err, result, res) {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }

        console.log("userrrr", result.userSub);
        const response = {
          username: result.user.username,
          userConfirmed: result.userConfirmed,
          userAgent: result.user.client.userAgent,
        }; // resolve({ statusCode: 201, response: response });
        Users.create({
          user_id: result.userSub,
          email: result.user.username,
          type: 'user',
          status: 'false'
        }).then(function (users) {
          if (users) {
            console.log("user=>", users);
            // res.send(users);
            resolve({ statusCode: 201, response: users });

          } else {
            result.status(400).send('Error in insert new record');

          }

        });
      }
    );
  });
}

function verify(email, code) {
  return new Promise((res, rej) => {
    AwsConfig.getCognitoUser(email).confirmRegistration(
      code,
      true,
      (err, result) => {
        if (err) {
          return res({ statusCode: 422, response: err });
        }
        if (result == "SUCCESS") {
          console.log("Successfully verified account!");
          // const resss= AwsConfig.getCognitoAttributeList().user.username
          console.log("resssssssss", email);
          return Users.update({
            status: 'true'
          }, {
            where: {
              email: email
            }
          }).then(function (users) {

            if (users) {
              console.log("user=>", users);
              // res.send(users);
              res({ statusCode: 201, response: users });
            } else {
              result.status(400).send('Error in insert new record');
            }

            // const user456 = AwsConfig.getCognitoUser({"email":"payal03@gmail.com"})

          })
          // return resolve({ statusCode: 400, response: result });
          // return users()
        }
      }
    );
  });
}

function signIn(email, password) {
  return new Promise((resolve) => {
    AwsConfig.getCognitoUser(email).authenticateUser(
      AwsConfig.getAuthDetails(email, password),
      {
        onSuccess: (result) => {
          const token = {
            refreshToken: result.getRefreshToken().getToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            accessTokenExpiresAt: result.getAccessToken().getExpiration(),
            idToken: result.getIdToken().getJwtToken(),
            idTokenExpiresAt: result.getAccessToken().getExpiration(),
          };
          Users.update({
            is_loggedin: true
          }, {
            where: {
              email: email
            }
          }).then(function (users) {

            if (users) {
             
              console.log("user=>", users);
           
              // res.send(users);
            return resolve({
                statusCode: 200,
                response: AwsConfig.decodeJWTToken(token),
                res: users
              });
            } else {
              result.status(400).send('Error in insert new record');
            }
         

       
        });

          // return resolve({
          //   statusCode: 200,
          //   response: AwsConfig.decodeJWTToken(token),
          // });
        },

        onFailure: (err) => {
          return resolve({
            statusCode: 400,
            response: err.message || JSON.stringify(err),
          });
        }
   
      }
    );
  });
}
// async function signOut() {

//   return new Promise((resolve) => {
//     AwsConfig.getCognitoUser(email).globalSignOut({gloal:true},
//       {
//         onSuccess: (result) => {
//           console.log("ressss",result);
//           return resolve({
//             statusCode: 200,
//             // response: AwsConfig.decodeJWTToken(token),
//           });
//         },

//         onFailure: (err) => {
//           console.log(err);
//           return resolve({
//             statusCode: 400,
//             // response: err.message || JSON.stringify(err),
//           });
//         },
//       }
//     )
//     }
//   )


//   }


async function signOut() {

  Users.update({
    is_loggedin: false
  }, {
    where: {
      email: email
    }
  }).then(function (users) {

    if (users) {
      console.log("user=>", users);
      // res.send(users);
    return resolve({
        statusCode: 200,
        response: AwsConfig.decodeJWTToken(token),
        res: users
      });
    } else {
      result.status(400).send('Error in insert new record');
    }
 


});

}





module.exports = {
  signUp,
  verify,
  signIn,
  signOut
};
