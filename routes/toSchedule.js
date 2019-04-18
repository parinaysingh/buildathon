const express = require('express')
    , route = express.Router()
    , jwt = require('jsonwebtoken')
    , shortlistedStudent = require('../schema/shortlistedStudent')
    , Student = require('../schema/student')
    , dotenv = require('dotenv')
    , ObjectId = require('mongoose').Types.ObjectId;
dotenv.config();

route.get('/', (req, res) => {
    shortlistedStudent.aggregate([{
        $match: {
            scheduled: false
        }
    }, {
        $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'student'
        }
    }, {
        $unwind: '$student'
    }, {
        $project: {
            'student._id': 1,
            'student.name': 1,
        }
    }]).exec((err, students) => {
        res.json({students})
    })
});

route.get('/set', (req, res) => {
    // shortlistedStudent({
    //     student: ObjectId("5cb87b8f08633b5a2e374bbe"),
    //     scheduled: true,
    //     interviewer: 'Vikram',
    //     time: new Date().toISOString()
    // }).save((err, scheduled) => {
    //     if (err) throw (err);
    //     res.json(scheduled)
    // });
});

module.exports = route;