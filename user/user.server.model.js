const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// var brcypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Joi = require("joi");
crypto = require('crypto');
var config = require("dotenv").config().parsed;
var UserSchema = new Schema({
    firstName: {
        type: String,
        default: "John"
    },
    lastName: {
        type: String,
        default: "Doe"
    },
    displayName: {
        type: String,
        required: true


    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        min: 1000000000,
        max: 9999999999,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
    }
});
UserSchema.methods.validateUser = function () {
    var user = {
        userName: this.userName,
        email: this.email,
        password: this.password,
        // salt: this.salt
    }



    const schema = Joi.object({
        userName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
    })
    this.displayName = this.firstName + " " + this.lastName
    // console.log(this.displayName, schema.validate(user))
    return schema.validate(user);
}

UserSchema.methods.validatePassword = function (password) {
    // console.log(this)
    return this.password === hashPassword(password, this.salt);
    // return brcypt.compareSync(password, this.password);
}
UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        userName: this.userName
    }, config['myprivatekey'], {
        expiresIn: "60m"
    }); //get the private key from the config file -> environment variable
    return token;
}


hashPassword = (password, salt) => {
    if (salt && password) {
        return crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
    } else {
        return password;
    }
};
UserSchema.methods.generatePassword = function () {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = hashPassword(this.password, this.salt);
    // console.log(this)
    return
    // return new Promise((resolve, reject) => {
    //     bcrypt.genSalt(10, (err, salt) => {
    //         if (err) throw err;
    //         bcrypt.hash(this.password, salt,
    //             (err, hash) => {
    //                 if (err) throw err;
    //                 this.password = hash;
    //                 resolve()
    //             });
    //     });
    // })

}

module.exports = User = mongoose.model('User', UserSchema);