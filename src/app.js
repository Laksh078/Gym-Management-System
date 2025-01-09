//Importing the dependencies

require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//Declaring the port to be hosted on
// '||' it represents that is the app is hosted on localhost, then the port will be 3000 and if it is hosted on a server, the it will take the port given by the server

const port = process.env.PORT || 3000;

require("./db/conn");

const Register = require("./models/registers");
const Trial_user = require("./models/trial_users");
const static_path = path.join(__dirname, "../public");

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

//For Users

const userRoute = require("./routes/user-routes");
app.use('/', userRoute);

//For Admins

const adminRoute = require("./routes/admin-routes");
app.use('/admin', adminRoute);

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})

