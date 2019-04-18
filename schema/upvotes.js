const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

const ups = new Schema({
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
    collection: 'upvotes'
})

module.exports = mongoose.model('ups', ups)

