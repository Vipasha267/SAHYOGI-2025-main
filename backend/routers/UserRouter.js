const express = require("express");
const router = express.Router();
const Model = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/add', (req, res) => {
  console.log(req.body);
  new Model(req.body).save()
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);

    });
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

router.get('/getbyid/:id', async (req, res) => {
  try {
    const result = await Model.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user data', error: err.message });
  }
});

//update
router.delete('/delete/:id', (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/authenticate', (req, res) => {
  Model.findOne(req.body)
    .then((result) => {
      if (result) {
        //login success - generate token
        const { _id, name, email, role } = result;
        const payload = { _id, name, email, role };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '2d' },
          (err, token) => {
            if (err) {
              console.log(err);
              res.status(500).json(err);
            }
            else {
              res.status(200).json({ token, role });
            }

          }
        )
      }
      else {
        //login failed-send error message
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);

    });
});

router.get('/followed-ngos/:id', async (req, res) => {
  try {
    const user = await Model.findById(req.params.id).populate('followedNGOs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.followedNGOs || []);
  } catch (err) {
    console.error('Error fetching followed NGOs:', err);
    res.status(500).json({ message: 'Error fetching followed NGOs', error: err.message });
  }
});

router.get('/followed-socialworkers/:id', async (req, res) => {
  try {
    const user = await Model.findById(req.params.id).populate('followedSocialWorkers');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.followedSocialWorkers || []);
  } catch (err) {
    console.error('Error fetching followed social workers:', err);
    res.status(500).json({ message: 'Error fetching followed social workers', error: err.message });
  }
});

router.get('/interactions/:id', async (req, res) => {
  try {
    const user = await Model.findById(req.params.id).populate('interactions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.interactions || []);
  } catch (err) {
    console.error('Error fetching interactions:', err);
    res.status(500).json({ message: 'Error fetching interactions', error: err.message });
  }
});

//delete
module.exports = router;
