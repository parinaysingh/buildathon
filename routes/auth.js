const express = require('express')
    , route = express.Router()
    , jwt = require('jsonwebtoken')
    , Users = require('../schema/user')
    , dotenv = require('dotenv');

dotenv.config();

function generateJWT(user) {
    return jwt.sign({
        _id: user._id
    }, process.env.JWT_SECRET)
}

route.post('/login', (req, res) => {
    const email = req.body.email,
        password = req.body.password;

    Users.findOne({
        email : email,
        password : password
    }).lean().exec((err, user) => {
        if (err) return res.json({status: 'err', msg: err});
        if (user) {
            res.json({
                status: 'ok',
                log: 11,
                body: user,
                token: generateJWT(user)
            })
        } else {
            Users({
                email: email,
                password: password,
                name: 'Mike Shinoda',
                mobile: 9876543210
            }).save((err, newUser) => {
                if (err) return res.json({status: 'err', msg: err});
                res.json({
                    status: 'ok',
                    log: 21,
                    user: newUser,
                    token: generateJWT(newUser)
                })
            });
        }
    })

});

route.get('/fetch', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, user) {
        if (err) throw ('No Authorized User Found');
        Users.findOne({_id: user._id}).lean().exec((err, authUser) => {
            if (err) throw err;
            res.json({
                user: authUser
            })
        })
    })
});

module.exports = route;