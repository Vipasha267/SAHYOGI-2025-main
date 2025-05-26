const { Schema, model } = require('../connection');

const feedbackSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  category: { 
    type: String, 
    enum: ['general', 'usability', 'features', 'suggestion'], 
    default: 'general',
    required: true
  },
  comment: { type: String, required: true, minlength: 10 },
  suggestion: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('feedback', feedbackSchema);