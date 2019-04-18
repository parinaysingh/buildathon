const express = require('express')
    , route = express.Router()
    , jwt = require('jsonwebtoken')
    , shortlistedStudent = require('../schema/shortlistedStudent')
    , interviewer = require('../schema/interviewer')
    , Student = require('../schema/student')
    , dotenv = require('dotenv')
    , ObjectId = require('mongoose').Types.ObjectId;
dotenv.config();

route.get('/', (req, res) => {
    shortlistedStudent.aggregate([{
        $match: {
            scheduled: true
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
        $lookup: {
            from: 'interviewers',
            localField: 'interviewer',
            foreignField: '_id',
            as: 'interviewer'
        }
    }, {
        $unwind: '$interviewer'
    }, {
        $project: {
            'student._id': 1,
            'student.name': 1,
            'interviewer' : "$interviewer.name",
            time: 1
        }
    }]).exec((err, students) => {
        res.json({students})
    })
});

route.get('/set', (req, res) => {
    // Student({
    //     name: 'Student 2',
    //     email: 'student2@student.com',
    // }).save((err, scheduled) => {
    //     if (err) throw (err);
    //     res.json(scheduled)
    // });

    // interviewer({
    //     name: 'Interviewer 2',
    //     email: 'intervie2@interview.com',
    //     slots: [{start: 4, end: 7, booked: false}, {start: 2, end: 3, booked: false}]
    // }).save((err, scheduled) => {
    //     if (err) throw (err);
    //     res.json(scheduled)
    // });

    shortlistedStudent({
        student: ObjectId("5cb8a05e8befcc7910ff0d5f"),
        // student: ObjectId("5cb88e4399ff666a51db94a0"),
        scheduled: false,
        interviewer: ObjectId("5cb8a08cf097db795b461983"),
        time: new Date().toISOString()
    }).save((err, scheduled) => {
        if (err) throw (err);
        res.json(scheduled)
    });
});

module.exports = route;