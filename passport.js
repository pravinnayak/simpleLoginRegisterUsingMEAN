function passport(app) {
    var passport = require("passport");
    var passportJWT = require("passport-jwt");
    var config = require('dotenv').config().parsed
    var ExtractJwt = passportJWT.ExtractJwt;
    var JwtStrategy = passportJWT.Strategy;
    var User = require('mongoose').model("User");
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = config["myprivatekey"];

    var strategy = new JwtStrategy(jwtOptions, async function (payload, next) {
        // usually this would be a database call:
        //   var user = users[_.findIndex(users, {id: jwt_payload.id})];
        // console.log(payload)
        var user = await User.findById({
            _id: payload._id
        }, {
            password: 0,
            salt: 0,
            email: 0,
            mobile: 0
        })
        if (user) {
            // console.log(user)
            // delete user.password;
            // console.log(user)
            next(null, user);
        } else {
            next(null, false);
        }
    });
    passport.use(strategy);
    app.use(passport.initialize())
    return passport.authenticate('jwt', {
        session: false,
    })
}
module.exports = passport;