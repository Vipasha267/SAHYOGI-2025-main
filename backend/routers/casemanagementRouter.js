const express = require("express");
const router = express.Router();
const Model = require('../models/casemanagementModel');
const { verifyToken } = require('../middleware/auth');

// Add new case (authenticated)
router.post('/add', verifyToken, async (req, res) => {
  try {
    const {
      caseTitle, caseType, location, startDate, endDate, caseStatus,
      objective, workDescription, challenges, outcome,
      photoUrls, videoUrls, peopleHelped, resourcesUsed,
      volunteerSupport, isPublic, verificationStatus
    } = req.body;

    const newCase = new Model({
      caseTitle,
      caseType,
      location,
      startDate,
      endDate,
      caseStatus,
      objective,
      workDescription,
      challenges,
      outcome,
      photoUrls,
      videoUrls,
      peopleHelped,
      resourcesUsed,
      volunteerSupport,
      isPublic,
      verificationStatus,
      authorId: req.user._id,
      // authorType: req.user.authorType // Changed from type to authorType
    });

    await newCase.save();
    res.status(201).json({ message: 'Case created successfully', caseId: newCase._id });
  } catch (error) {
    console.error('Error adding case:', error);
    res.status(500).json({ message: 'Error creating case', error: error.message });
  }
});

// Get all cases (admin only)
router.get('/getall', verifyToken, async (req, res) => {
  try {
    if (req.user.authorType !== 'admin') {  // Changed from type to authorType
      return res.status(403).json({ message: 'Access denied' });
    }
    const cases = await Model.find().populate('affiliatedNGO', 'ngo_name');
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cases' });
  }
});

// Get NGO cases
router.get('/ngo/cases', verifyToken, async (req, res) => {
  try {
    if (req.user.authorType !== 'ngo') {  // Already updated
      return res.status(403).json({ message: 'Access denied' });
    }
    const cases = await Model.find({ authorId: req.user._id });
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching NGO cases' });
  }
});

// Get social worker cases
router.get('/socialworker/cases', verifyToken, async (req, res) => {
  try {
    if (req.user.authorType !== 'socialworker') {  // Changed from type to authorType
      return res.status(403).json({ message: 'Access denied' });
    }
    const cases = await Model.find({ authorId: req.user._id })
      .populate('affiliatedNGO', 'ngo_name');
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching social worker cases' });
  }
});

// Get case by ID (with auth check) 
router.get('/getbyid/:id', verifyToken, async (req, res) => {
  try {
    const case_ = await Model.findById(req.params.id)
      .populate('affiliatedNGO', 'ngo_name');
    
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check if user has access to this case
    if (req.user.authorType === 'admin' ||  // Changed from type to authorType
        (case_.authorId.toString() === req.user._id.toString()) ||
        (req.user.authorType === 'ngo' && case_.affiliatedNGO?._id.toString() === req.user._id.toString())) {  // Changed from type to authorType
      res.status(200).json(case_);
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching case' });
  }
});

// Update case (with auth check)
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const case_ = await Model.findById(req.params.id);
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check if user has permission to update
    if (case_.authorId.toString() !== req.user._id.toString() && req.user.authorType !== 'admin') {  // Changed from type to authorType
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error updating case' });
  }
});

// Delete case (with auth check)
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const case_ = await Model.findById(req.params.id);
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check if user has permission to delete
    if (case_.authorId.toString() !== req.user._id.toString() && req.user.authorType !== 'admin') {  // Changed from type to authorType
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await Model.findByIdAndDelete(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting case' });
  }
});

// Get public cases
router.get('/public', async (req, res) => {
  try {
    const cases = await Model.find({ isPublic: true })
      .populate('affiliatedNGO', 'ngo_name')
      .sort({ createdAt: -1 });
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching public cases' });
  }
});

module.exports = router;
