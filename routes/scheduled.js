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
    Student({
        name: 'Student 3',
        email: 'student3@student.com',
    }).save((err, stud) => {
        if (err) throw (err);
        interviewer({
            name: 'Interviewer 3',
            email: 'intervie3@interview.com',
            slots: [{start: 1, end: 2, booked: false}, {start: 3, end: 4, booked: false}]
        }).save((err, interview) => {
            if (err) throw (err);
            shortlistedStudent({
                student: stud._id,
                scheduled: false,
                interviewer: interview._id,
                time: new Date().toISOString()
            }).save((err, scheduled) => {
                if (err) throw (err);
                res.json(scheduled)
            });
        });
    });
});

module.exports = route;