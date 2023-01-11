"use strict";
global.fetch = require("node-fetch");
const express = require("express");
const app = express()
const router = express.Router();
const cognito = require("../controller/auth");

const session = require('express-session');
const cookieParser = require('cookie-parser');
//session
app.use(cookieParser());
// const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "fd34s@!@dfa453f3DF#$D&W",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !true }
}));

// app.use(
//   session({
//     name: 'myCookie',
//     cookie: { maxAge: oneDay },
//     secret: "app",
//     name: "app",
//     resave: true,
//     saveUninitialized: true,
//     unset: 'destroy'
//     // cookie: { maxAge: 6000 } /* 6000 ms? 6 seconds -> wut? :S */
//   })
// );

const {auth} = require('../middleware/middleware')

router.post("/signup", async (req, res) => {
  const body = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    type: req.body.type,
    email: req.body.email,
    password: req.body.password,
  };
  // const { email, password } = req.body;
  console.log("--", req.body.email);
  console.log("--", req.body.password);
  console.log("--", req.body.firstName);
  console.log("--", req.body.lastName);

  const response = await cognito.signUp(
    body.firstName,
    body.lastName,
    body.type,
    body.email,
    body.password
  );
  console.log(response);
  res.redirect('/verify')

});
router.post("/verify", async (req, res) => {

  try {
    const body = {
      email: req.body.email,
      code: req.body.code,
    };
    // const { email, password } = req.body;
    console.log("--", req.body.email);
    console.log("--", req.body.code);
    const response = await cognito.verify(body.email, body.code);
    console.log("response=>", response);
    if (response.statusCode === 201) {
      res.redirect('/login')
    } else {
      res.send("Something Went Wrong")
    }

  } catch (err) {
    console.log(err);
  }

});

router.post("/signin", async (req, res) => {
  try {console.log("req",req.session);
    const body = {
      email: req.body.email,
      password: req.body.password,
    };
    // const { email, password } = req.body;
    console.log("--", req.body.email);
    console.log("--", req.body.password);

    const response = await cognito.signIn(body.email, body.password);
    if (response.statusCode === 200) {
      
       session = req.session;
      session.email = body.email
      console.log("UserSession",session.email);
      res.redirect('/dashboard')
    } else {
      res.send("Something Went Wrong")
    }


  } catch (err) {
    console.log(err);
  }

});

router.get("/signout",auth, cognito.signOut);

module.exports = router;
