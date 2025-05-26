const express = require("express");
const router = express.Router();
const Model = require('../models/contactModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Contact Route
router.post('/add', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      subject,
      message,
      isSocialWorker,
      inquiryType,
      documentUrl,
      documentName
    } = req.body;

    const newContact = new Model({
      fullName,
      email,
      phone,
      subject,
      message,
      isSocialWorker,
      inquiryType,
      documentUrl,
      documentName
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
});

router.get('/getall', (req, res) => {
  Model.find()
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/getbyemail/:email', (req, res) => {
  console.log(req.params.email);
  res.send('respond from user getbyemail');
});

module.exports = router;
