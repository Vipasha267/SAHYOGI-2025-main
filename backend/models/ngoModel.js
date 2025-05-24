const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },   
    bio: String,
    Government_ID: { type: Number, unique: true },
    address: String,
    type_of_SocialWork: String,
    year_of_experience: Number,
    ngo_name: String,
    ngo_Registration_Number: { type: Number, unique: true },
    geographic_area_of_Work: String,
    proof_of_work: String,
    createdAt: { type: Date, default: Date.now },
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
    followerCount: { 
      type: Number, 
      default: 0 
    },
    isVerified: {
      type: Boolean,
      default: false
    }
});

module.exports = model('ngo', mySchema);