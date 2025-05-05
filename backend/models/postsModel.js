const { Schema, model } = require('../connection');

const postsSchema = new Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['article', 'story', 'guide', 'video', 'infographic'], 
    required: true 
  },
  content: { type: String }, // For articles, stories, guides
  mediaUrl: { type: String }, // For videos, infographics
  // User information fields
  author: { type: String }, // Name of the author
  authorId: { type: Schema.Types.ObjectId, required: true }, // Reference to the user
  authorType: { type: String, enum: ['socialworker', 'ngo'], required: true }, // Type of user
  date: { type: Date, default: Date.now },
  tags: [{ type: String }],
  // Optional fields for engagement
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  // For success stories
  organization: { type: String },
  impact: { type: String }
});

module.exports = model('posts', postsSchema);