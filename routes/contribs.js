const express = require('express')
    , route = express.Router()
    , jwt = require('jsonwebtoken')
    , dotenv = require('dotenv')
    , ObjectId = require('mongoose').Types.ObjectId
    , Post = require('../schema/post')
    , Contrib = require('../schema/contributions')
    , User = require('../schema/user');
dotenv.config();

route.post('/', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, user) {
        if (err) throw ('No Authorized User Found');
        let data = req.body;
        console.log(data);
        data.pid = ObjectId(data.pid);
        data.uid = ObjectId(user._id);

        let contrib = new Contrib(data);
        contrib.save((err, newContrib) => {
            if (err) throw err;
            Post.findOneAndUpdate({
                _id: data.pid
            }, {
                $inc: {
                    contribs: 1
                }
            }).exec((err, post) => {
                res.json({contribs: {_id: newContrib._id, comment: newContrib.comment}})
            });
        })
    })
});

route.get('/:pid', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, user) {
        if (err) throw ('No Authorized User Found');
        let pid = req.params.pid;
        try {
            pid = ObjectId(pid)
        } catch (e) {
            return res.sendStatus(400)
        }
        Contrib.aggregate([{
            $match: {
                pid: pid
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'uid',
                foreignField: '_id',
                as: 'author'
            }
        }, {
            $unwind: '$author'
        }, {
            $project: {
                comment: 1,
                'author._id': 1,
                'author.firstname': 1,
                'author.lastname': 1,
                'author.profilephoto': 1
            }
        }]).exec((err, contribs) => {
            res.json({contribs})
        })
    })
});

module.exports = route;