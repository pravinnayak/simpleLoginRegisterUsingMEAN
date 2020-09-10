const express = require('express');
const fs = require("fs");
const cors = require('cors');
const env = require("dotenv").config().parsed;
const chalk = require("chalk")
var jwt = require('jsonwebtoken');

// const {
//     BIRoutes
// } = require("./businessLogic/businessLogic.server.controller");

// console.log(env)
var {
    userRoutes,
    userRegister,
    loginUser
} = require("./user/userRoute");



var app = express();

app.use("*", (req, res, next) => {
    console.log(chalk.greenBright(`${req.method}`) + " -- " + chalk.whiteBright(`${req.originalUrl}`))
    next()
})
app.use(cors());
app.use(express.json());







var auth = require('./passport')(app);

app.post("/registerUser", userRegister)
app.post("/loginUser", loginUser)
app.use(express.static("./dist/tydy"))





app.use(auth)


app.get("/authenticateUser", (req, res) => {
    // res.send("done")
    const token = jwt.sign({
        _id: req.user._id,
        userName: req.user.userName
    }, env['myprivatekey'], {
        expiresIn: "60m"
    });

    res.json({
        success: true,
        user: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            displayName: req.user.displayName
        },
        token: token
    })
})
app.use("/user", userRoutes)
// app.use("/bl", BIRoutes);


const mongoose = require("mongoose");
if (!env["myprivatekey"]) {
    console.error("private key not present for jwt token")
    process.exit(-1)
}

mongoose.set('useCreateIndex', true);



mongoose.connect(env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((connection) => {
    // console.log(connection)
    startNode(connection)
}).catch((error) => {
    console.log(error)
    console.log("node startup aborted")
})


function startNode(mongooseConnection) {
    let portNumber = process.env.PORT || 3001


    // app.get("/login")
    // app.get("/user/details", (req, res) => {
    //     let data = fs.readFileSync("responseJSON.json", "utf-8")
    //     // console.log(data)
    //     res.json({
    //         user: data
    //     });
    // })
    app.listen(portNumber);
    console.log("Server listening in port " + portNumber);

    module.exports = app;
}