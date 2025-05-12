const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },   
    address: String,
    exp: Number,
    geography: String,
    description: String,
    affiliatedTo: { type: String, default: 'None' }, // NGO, Government, etc.
    createdAt: { type: Date, default: Date.now },
    // Add followers array to track users who follow this social worker
    followers: [
        {
            followerId: { 
                type: Schema.Types.ObjectId, 
                required: true 
            },
            followerType: { 
                type: String, 
                enum: ['user', 'socialworker', 'ngo'],
                required: true
            },
            followerName: { 
                type: String,
                required: true
            },
            followedAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    // Track total follower count for efficient queries
    followerCount: { 
        type: Number, 
        default: 0 
    },
    // Optional - profile picture URL
    profilePicture: { 
        type: String, 
        default: '' 
    },
    // Optional - verification status
    isVerified: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = model('socialworker', mySchema);