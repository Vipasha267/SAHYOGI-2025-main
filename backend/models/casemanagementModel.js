const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseTitle: {
    type: String,
    required: true
  },
  caseType: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  caseStatus: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    required: true
  },
  workDescription: {
    type: String,
    required: true
  },
  challenges: String,
  outcome: String,
  
  // Updated media storage to use URLs instead of file objects
  photoUrls: [
    {
      url: String,
      caption: String
    }
  ],
  videoUrls: [
    {
      url: String,
      caption: String
    }
  ],
  
  peopleHelped: {
    type: Number,
    required: true,
    min: 1
  },
  resourcesUsed: {
    type: String,
    required: true
  },
  volunteerSupport: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Verified', 'Rejected']
  },
  
  // Author information
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'authorType'
  },
  // authorType: {
  //   type: String,
  //   required: true,
  //   enum: ['user', 'socialworker', 'ngo']
  // },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Case', caseSchema);