const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const shortlistedStudent = new Schema({
    student: {
        type: ObjectId,
        required: true
    },
    scheduled: {
        type: Boolean,
        default: false,
        required: true
    },
    interviewer: {
        type: ObjectId,
        required: false
    },
    time: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
}, {
    collection: 'shortlistedStudents'
});

module.exports = mongoose.model('shortlistedstudent', shortlistedStudent);
