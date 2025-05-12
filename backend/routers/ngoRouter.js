const express = require("express");
const router = express.Router();
const Model = require('../models/ngoModel');
const jwt = require('jsonwebtoken');
// const { ObjectId } = require('mongodb');
const { verifyToken } = require("../middleware/auth");
require('dotenv').config();

router.post('/add', (req, res) => {
  console.log(req.body);
  new Model(req.body).save()
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
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

router.get('/getbyid/:id', (req, res) => {
  Model.findById(req.params.id)
    .then((result) => {
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: 'NGO not found' });
    })
    .catch((err) => res.status(500).json(err));
});

//getall

//getbyid
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
        const { _id, name, email } = result;
        const payload = { _id, name, email };
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
              res.status(200).json({ token });
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
})

// Follow an NGO
router.post('/follow/:id', verifyToken, async (req, res) => {
  try {
    const ngoId = req.params.id;
    
    // Check if the id is valid
    if (!ObjectId.isValid(ngoId)) {
      return res.status(400).json({ message: 'Invalid NGO ID' });
    }
    
    // Get current user info
    const currentUser = req.user;
    
    // Prepare follower data
    const follower = {
      followerId: currentUser._id,
      followerType: currentUser.type || 'user', // Get type from token or default to 'user'
      followerName: currentUser.name || currentUser.ngo_name || 'Anonymous User',
      followedAt: new Date()
    };
    
    // Check if user is trying to follow themselves
    if (currentUser._id.toString() === ngoId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    
    // Add to followers array if not already following
    const result = await NGO.updateOne(
      { 
        _id: ngoId, 
        'followers.followerId': { $ne: currentUser._id } 
      },
      { 
        $push: { followers: follower },
        $inc: { followerCount: 1 }
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Already following this NGO' });
    }
    
    res.status(200).json({ message: 'Successfully followed NGO' });
  } catch (error) {
    console.error('Error following NGO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unfollow an NGO
router.post('/unfollow/:id', verifyToken, async (req, res) => {
  try {
    const ngoId = req.params.id;
    
    // Check if the id is valid
    // if (!ObjectId.isValid(ngoId)) {
    //   return res.status(400).json({ message: 'Invalid NGO ID' });
    // }
    
    // Get current user info
    const currentUser = req.user;
    
    const result = await NGO.updateOne(
      { _id: ngoId, 'followers.followerId': currentUser._id },
      { 
        $pull: { followers: { followerId: currentUser._id } },
        $inc: { followerCount: -1 }
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'You are not following this NGO' });
    }
    
    res.status(200).json({ message: 'Successfully unfollowed NGO' });
  } catch (error) {
    console.error('Error unfollowing NGO:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get followers of an NGO
router.get('/followers/:id', async (req, res) => {
  try {
    const ngoId = req.params.id;
    
    // Check if the id is valid
    // if (!ObjectId.isValid(ngoId)) {
    //   return res.status(400).json({ message: 'Invalid NGO ID' });
    // }
    
    const ngo = await NGO.findById(ngoId).select('followers');
    
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    
    res.status(200).json(ngo.followers || []);
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//delete
module.exports = router;
