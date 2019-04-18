const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const posts = new Schema({
    type: {
        type: String,
        required: true
    },
    post: {
        type: Object,
        required: true
    },
    postedBy: {
        type: ObjectId,
        required: true
    },
    postedIn: {
        type: String,
    },
    contribs: {
        type: Number,
        default: 0
    },
    upvotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
}, {
    collection: 'posts'
});

module.exports = mongoose.model('posts', posts);
