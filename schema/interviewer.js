const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    slots: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
}, {
    collection: 'interviewers'
});

module.exports = mongoose.model('interviewer', userSchema);