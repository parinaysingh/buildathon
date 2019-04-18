const express = require('express')
    , route = express.Router()
    , jwt = require('jsonwebtoken')
    , Post = require('../schema/post')
    , User = require('../schema/user')
    , dotenv = require('dotenv')
    , ObjectId = require('mongoose').Types.ObjectId
    , multer = require('multer');
dotenv.config();

const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/i/p");
    },
    filename: function (req, file, callback) {
        callback(null, Math.random().toString(36) + "_" + file.originalname);
    }
});

const upload = multer({storage: Storage}).single("image");

route.post('/', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, user) {
        if (err) throw ('No Authorized User Found');
        upload(req, res, function (err) {
            if (err) throw ("File Upload Failed!");
            let post;
            const data = req.body;
            if (data.type === 'file') {
                post = {
                    file: 'http://localhost:8080/i/p/' + req.file.filename,
                    description: data.description
                }
            } else if (data.type === 'question') {
                post = {
                    question: data.question,
                    description: data.description
                }
            } else if (data.type === 'link') {
                post = {
                    link: data.link,
                    description: data.description
                }
            }
            Post({
                type: data.type,
                post: post,
                postedBy: ObjectId(user._id),
                postedIn: data.postedIn
            }).save((err, post) => {
                if (err) throw (err);
                User.findOne({_id: user._id}).lean().exec((err, user) => {
                    if (err) throw (err);
                    res.json({
                        post: {
                            _id: post._id,
                            createdAt: post.createdAt,
                            postedIn: post.postedIn,
                            post: post.post,
                            type: post.type,
                            contribs: post.contribs,
                            upvotes: post.upvotes,
                            author: {
                                _id: user._id,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                profilephoto: user.profilephoto
                            }
                        }
                    })
                });
            });
        });
    });
});

route.get('/', (req, res) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, user) {
        if (err) throw ('No Authorized User Found');
        const lastPid = req.param.pid;
        if (!lastPid) {
            Post.aggregate([{
                $sort: {createdAt: -1}
            }, {
                $limit: 10
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'author'
                }
            }, {
                $unwind: '$author'
            }, {
                $project: {
                    createdAt: 1,
                    postedIn: 1,
                    post: 1,
                    type: 1,
                    contribs: 1,
                    upvotes: 1,
                    'author._id': 1,
                    'author.firstname': 1,
                    'author.lastname': 1,
                    'author.profilephoto': 1,
                     comments: [],
                }
            }
            ]).exec((err, posts) => {
                if (err) throw ('Error!');
                res.json({posts: posts});
            })
        } else {
            res.send('coming soon');
        }
    });
});

module.exports = route;