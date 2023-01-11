
const attributes = (key, value,firstName,lastName) => {
    return [{
      Name: key,
      Value: value,
    },
    {
      Name: 'custom:firstName',
      Value: firstName,
    },
    {
      Name: 'custom:lasttName',
      Value: lastName,
    },
      
    ]
  };
  
  
  let cognitoAttributeList= [];
  
  
  
  function setCognitoAttributeList(email,firstName,lastName, agent) {
      let attributeList = [];
      attributeList.push(attributes('email', email));
      attributeList.push(attributes('custom:firstName', firstName));
      attributeList.push(attributes('custom:lastName', lastName));
     
      attributeList.forEach((element) => {
          cognitoAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(element));
      });
  }


  //jhbjnk
  async function user(res,agent = "none") {
    return new Promise((resolve) => {
      AwsConfig.initAWS();
      AwsConfig.setCognitoAttributeList();
      AwsConfig.getUserPool().signUp(
      
        AwsConfig.getCognitoAttributeList(),
        null,
        function (err, result) {
          if (err) {
            return resolve({ statusCode: 422, response: err });
          }
          const response = {
            username: result.user.username,
  
          };
          user = response.username
          console.log("res=>",response);
  
          
            try {
              const users = Users.create({
                user_id: user,
                type: `tenant`,
                status: `True`,
              });
              res.status(201).send(users);
              return data;
            } catch (err) {
              console.log(err);
            }
          
        }
      );
    });
     
        }
          // kkl.ml/;



          function user(res) {
            return new Promise((resolve) => {
              AwsConfig.initAWS();
              AwsConfig.setCognitoAttributeList();
              AwsConfig.getUserPool().signUp(
                AwsConfig.getCognitoAttributeList(),
                null,
                function (err, result) {
                  if (err) {
                    return resolve({ statusCode: 422, response: err });
                  }
                  console.log("userrrrs",result.userSub);
                  const userName = result.sub
                  console.log("---",userName);
               
                  try {
                    const users = Users.create({
                      user_id: userName,
                      type: `tenant`,
                      status: `True`,
                    });
                    res.status(201).send(users);
                    return resolve({statusCode: 200, response:users})
                    
                  } catch (err) {
                  
                      return reject({ statusCode: 422, response: err });
                   
            
               
                  }
                }
              );
            });
          
          }