'use strict';
global.fetch = require('node-fetch')
require('dotenv').config();

//Include api modules.
const express    = require('express');
const bodyParser = require('body-parser')
const path = require('path')
//Start Express-js
const app    = express();
app.use(express.json());
//Add bodyparser and CORS.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Get routes
const adminRoutes = require('./routes/admin/auth')
const routes = require('./routes/routes');
app.use('/',routes)
app.use('/',adminRoutes)



//Add views
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views/public"));


//Start the server.
app.listen(8000, ()=>{
    console.log("Server is running on port 8000");
})