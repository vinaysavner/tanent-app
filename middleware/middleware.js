const { application } = require('express')
const express = require('express')
const app = express()

module.exports = {
    // isAuthenticated : (req, res, next) => {
    //     console.log("sess=>",req.session)
    //     if (req.session.email) next()
    //     else next('route')
    //   }
    auth :function(req, res, next) {
        console.log("authhhh",req.session);
        if (req.session && req.session.email)
          return next();
        else
          return  res.redirect('/login');
      }
}
 



