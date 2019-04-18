const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

const contrib = new Schema({
    comment: {
        type: String,
        required: true
    },
    uid: {
        type: ObjectId,
        required: true
    },
    pid: {
        type: ObjectId,
        required: true
    }
}, {
    timestamps: true
}, {
    collection: 'contributions'
});

module.exports = mongoose.model('contrib', contrib);
