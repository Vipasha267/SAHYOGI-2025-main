const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    followedNGOs: [{ type: Schema.Types.ObjectId, ref: 'ngo' }],
    followedSocialWorkers: [{ type: Schema.Types.ObjectId, ref: 'socialworker' }],
    interactions: [{
        type: { type: String, enum: ['like', 'comment', 'share'] },
        postId: { type: Schema.Types.ObjectId, ref: 'posts' },
        date: { type: Date, default: Date.now }
    }]
});
module.exports = model('user', mySchema);