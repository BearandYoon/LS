let jwt    = require('jsonwebtoken');
let env = process.env.NODE_ENV || 'development';
let config = require('../../config/config')[env];

import { User } from '../models';
var fs = require('fs');

async function login(req, res, next) {
    var userID = req.body.userID;
    var password = req.body.password;

    if(!userID || userID == "") {
        return res.send({
            status: 400,
            reason: "userID is not valid."
        });
    }

    let user = await User.findOneAsync({userID: userID});

    if(!user){
        return res.send({
            status: 404,
            reason: "No user exist"
        });
    }
    if(!user.authenticate(password)) {
        return next({
            status: 404,
            reason: 'Missing or invalid authentication credentials.'
        })
    }

    let token = jwt.sign(user, config.secret, {
        expiresInMinutes: 1440 // expires in 24 hours
    });

    var response = {};
    response.status = 200;
    response.id = user.userID;
    response.api_token = token;
    console.log('login-response = ', response);
    return res.send(response);
}

async function signup(req, res, next) {
    var userID = req.body.userID;

    let user = await User.findOneAsync({userID: userID});

    if(user){
        return res.send({
            status: 404,
            reason: "Same UserID exist"
        });
    }

    user = new User(req.body);
    user.state = true;

    user.save(function (err){
        if(err){
            console.log('user-save-error', err);
            var errMsg = "";
            for( var key in err.errors){
                if(err.errors.hasOwnProperty(key)){
                    errMsg = errMsg + err.errors[key].message;
                }
            }

            return res.error("register_error", 400, errMsg);
        }
        User.findOne({ userID: user.userID }, function (err, doc) {
            if (err) { return done(err) }

            var token = jwt.sign(doc, config.secret, {
                expiresInMinutes: 1440 // expires in 24 hours
            });

            var response = {};
            response.userID = doc.userID;
            response.api_token = token;
            return res.success(response);
        })
    });
}

async function Userdelete(req, res, next) {
    await req.user.removeAsync();
    return res.success();
}

async function logout(req, res, next){
    var currentUser = JSON.parse(JSON.stringify(req.decoded));
    console.log('currentUser = ', currentUser);
    var state = false;

    User.update(
        {_id: currentUser._id},
        {$set:
        { state: state }},
        {upsert:false, $$runValidators:true},
        function(err) {
            if(err) {
                var errMsg = "";
                for( var key in err.errors) {
                    if(err.errors.hasOwnProperty(key)) {
                        errMsg = errMsg + err.errors[key].message;
                    }
                }
                return next({
                    status:400,
                    reason:errMsg
                });
            }
            return res.success();
        }
    );
}

async function getProfile(req, res, next){
    User.findOne({_id: req.decoded._id},
        function (err, doc) {
            if(err)
                return next(err);
            if(doc != null) {
                var profile = JSON.parse(JSON.stringify(doc));
                delete profile.__v;
                delete profile._id;

                res.send({
                    status:200,
                    me: profile
                });
            }
            else {
                res.send({
                    status: 404,
                    reason: "No user found"
                });
            }
        }
    )
}

async function updateProfile(req, res, next){
    var newProfile = req.body;
    var currentUser = JSON.parse(JSON.stringify(req.decoded));

    User.update(
        {_id: currentUser._id},
        {$set: newProfile},
        {upsert:false, $$runValidators:true},
        function(err) {
            if(err) {
                var errMsg = "";
                for( var key in err.errors) {
                    if(err.errors.hasOwnProperty(key)) {
                        errMsg = errMsg + err.errors[key].message;
                    }
                }
                return next({
                    status:400,
                    reason:errMsg
                });
            }
            return res.success();
        }
    );
}

async function uploadAvatar(req, res, next) {
    if(!req.files.avatar) {
        return res.send({
            status: 400,
            reason: "Invaild avatar image"
        })
    }
    var avatar = req.files.avatar.name;
    var user_id = req.decoded._id;

    User.findOne({_id: req.decoded._id}, function (err, doc){
        if(err) return next(err);
        if(doc != null) {
            if(doc.avatar != ""){
                console.log(config.avatarUploadDir+doc.avatar);
                fs.unlinkSync(config.avatarUploadDir+doc.avatar);
            }
            User.update(
                {_id: user_id},
                { $set: {avatar:avatar} },
                {upsert:false, runValidators:true},
                function (err){
                    if(err) {
                        var errMsg = "";
                        for( var key in err.errors){
                            if(err.errors.hasOwnProperty(key)){
                                errMsg = errMsg + err.errors[key].message;
                            }
                        }
                        return next({
                            status:400,
                            reason:errMsg
                        });
                    }
                    res.send({
                        status:200,
                        avatar:config.avatarUploadDir+avatar
                    });
                }
            );
        }
        else{
            res.send({
                status: 404,
                reason: "No user found"
            });
        }
    });
}

module.exports = {
    Login: login,
    SignUp: signup,
    Logout: logout,
    UserDelete: Userdelete,
    getProfile: getProfile,
    updateProfile: updateProfile,
    uploadAvatar: uploadAvatar
};
