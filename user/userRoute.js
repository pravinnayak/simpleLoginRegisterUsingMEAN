var userRoutes = require("express").Router()
// const {
//     returnHistory
// } = require("../UserHistory/userHistroy.server.controller")
var userModel = require("./user.server.model");


let loginUser = async (req, res) => {
    if (!(req.body.userName && req.body.password)) {

        res.status(404).send("Username and Password required");
        return
    }
    var name = req.body.userName;
    var password = req.body.password;
    // usually this would be a database call:
    // var user = users[_.findIndex(users, { name: name })];
    var user = await User.findOne({
        $or: [{
            userName: name
        }, {
            email: name,
        }, {
            mobile: isNaN(name) ? 0 : name
        }]
    })

    if (!user) {
        res.status(409).json({
            message: "no such user found"
        });
        return
    }

    if (user.validatePassword(password)) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var token = user.generateAuthToken();
        let user_login = JSON.parse(JSON.stringify(user))
        delete user_login.password;
        delete user_login.userName;
        delete user_login.salt;
        // res.header("Authorization", "Bearer "+token)
        res.json({
            token: token
        })

        // res.json({ message: "ok", token: token });
    } else {
        res.status(401).json({
            message: "passwords did not match"
        });
    }
}

let listUser = (req, res) => {
    // console.log(req.user)
    userModel.find({}).then((allUser) => {
        res.json({
            user: allUser
        })
    })
}

let userRegister = (req, res, next) => {
    // console.log(req.body)
    userModel.findOne({
            $or: [{
                userName: req.body.userName
            }, {
                email: req.body.email,
            }, {
                mobile: req.body.mobile
            }]
        })
        .then(async user => {
            // console.log(user, "exisiting check")
            if (user) {
                let error = '';
                if (user.email == req.body.email) {
                    error += `${req.body.email}`
                }
                if (user.mobile == req.body.mobile) {
                    error.length > 0 ? error += ` and ${req.body.mobile} ` : error += ` ${req.body.mobile} `
                }
                if (user.userName == req.body.userName) {
                    error.length > 0 ? error += ` and ${req.body.userName} ` : error += `${req.body.userName} `
                }
                error += "exits in database"

                return res.status(409).json(error);
            } else {
                var newUser = new userModel(req.body)
                if (newUser.validateUser().error) {
                    // console.log("came here")
                    return res.status(401).send("UserName or password or email is not right,Please register again")
                } else {
                    await newUser.generatePassword()
                    var token = newUser.generateAuthToken();

                    let check = await newUser.save()
                    // console.log(check)

                    // console.log(token)
                    res.status(201).json({
                        token: token
                    });

                }

                // res.redirect("/secret");
                // return
                // res.json("Login success")
            }
        });
}


userRoutes.get("/list", listUser)
// userRoutes.post("/addHistory", addUserHistory)
userRoutes.get("/logout", function (req, res) {
    var token = "";
    res.header("x-auth-token", token).header("Authorization", token)
    req.logout();
    res.send("logged out")

})
userRoutes.get("/history", async (req, res) => {
    // let userId = req.user._id

    // // let toSend = await returnHistory(userId)
    // res.status(200).json({
    //     output: toSend
    // })


})


// userRoutes.get("/currentUser/:token", (req, res) => {
//     console.log(req.user)
// })


module.exports = {
    userRoutes,
    userRegister,
    loginUser
}