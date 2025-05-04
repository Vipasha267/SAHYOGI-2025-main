const { Schema, model } = require('../connection');

const casemanagementSchema = new Schema({
  caseTitle: { type: String, required: true },
  caseType: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  caseStatus: { type: String, required: true },
  objective: { type: String, required: true },
  workDescription: { type: String, required: true },
  challenges: { type: String },
  outcome: { type: String },
  photos: [{ type: String, required: true }], // store file paths or URLs
  photoCaptions: [{ type: String, required: true }],
  videos: [{ type: String }], // store file paths or URLs
  videoCaptions: [{ type: String }],
  peopleHelped: { type: Number, required: true },
  resourcesUsed: { type: String, required: true },
  volunteerSupport: { type: String },
  isPublic: { type: Boolean, required: true },
  verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('casemanagement', casemanagementSchema);