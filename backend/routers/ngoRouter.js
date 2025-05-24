const express = require("express");
const router = express.Router();
const Model = require('../models/ngoModel');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
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
        const { _id, name, email, ngo_name } = result;
        const payload = { _id, name, email, ngo_name, type: 'ngo' };
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
      followerType: currentUser.role || currentUser.authorType || 'user',
      followerName: currentUser.name || currentUser.ngo_name || 'Anonymous User',
      followedAt: new Date()
    };
    
    // Check if user is trying to follow themselves
    if (currentUser._id.toString() === ngoId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Start a session for transaction
    const session = await Model.startSession();
    try {
      await session.withTransaction(async () => {
        // Add to NGO's followers array if not already following
        const ngoResult = await Model.updateOne(
          { 
            _id: ngoId, 
            'followers.followerId': { $ne: currentUser._id } 
          },
          { 
            $push: { followers: follower },
            $inc: { followerCount: 1 }
          },
          { session }
        );

        if (ngoResult.matchedCount === 0) {
          throw new Error('NGO not found');
        }

        if (ngoResult.modifiedCount === 0) {
          throw new Error('Already following this NGO');
        }

        // Add NGO to user's followedNGOs array
        const userResult = await User.updateOne(
          { _id: currentUser._id },
          { $addToSet: { followedNGOs: ngoId } },
          { session }
        );

        if (userResult.matchedCount === 0) {
          throw new Error('User not found');
        }
      });

      await session.commitTransaction();
      res.status(200).json({ message: 'Successfully followed NGO' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error following NGO:', error);
    res.status(error.message.includes('NGO') || error.message.includes('following') ? 400 : 500)
      .json({ message: error.message || 'Server error' });
  }
});

// Unfollow an NGO
router.post('/unfollow/:id', verifyToken, async (req, res) => {
  try {
    const ngoId = req.params.id;
    
    // Check if the id is valid
    if (!ObjectId.isValid(ngoId)) {
      return res.status(400).json({ message: 'Invalid NGO ID' });
    }
    
    // Get current user info
    const currentUser = req.user;
    
    // Start a session for transaction
    const session = await Model.startSession();
    try {
      await session.withTransaction(async () => {
        // Remove from NGO's followers array
        const ngoResult = await Model.updateOne(
          { _id: ngoId, 'followers.followerId': currentUser._id },
          { 
            $pull: { followers: { followerId: currentUser._id } },
            $inc: { followerCount: -1 }
          },
          { session }
        );

        if (ngoResult.matchedCount === 0) {
          throw new Error('NGO not found');
        }

        if (ngoResult.modifiedCount === 0) {
          throw new Error('You are not following this NGO');
        }

        // Remove NGO from user's followedNGOs array
        const userResult = await User.updateOne(
          { _id: currentUser._id },
          { $pull: { followedNGOs: ngoId } },
          { session }
        );

        if (userResult.matchedCount === 0) {
          throw new Error('User not found');
        }
      });

      await session.commitTransaction();
      res.status(200).json({ message: 'Successfully unfollowed NGO' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error unfollowing NGO:', error);
    res.status(error.message.includes('NGO') || error.message.includes('following') ? 400 : 500)
      .json({ message: error.message || 'Server error' });
  }
});

// Get followers of an NGO
router.get('/followers/:id', async (req, res) => {
  try {
    const ngoId = req.params.id;
    
    // Check if the id is valid
    if (!ObjectId.isValid(ngoId)) {
      return res.status(400).json({ message: 'Invalid NGO ID' });
    }
    
    const ngo = await Model.findById(ngoId).select('followers');
    
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
