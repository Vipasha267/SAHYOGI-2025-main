const express = require("express");
const router = express.Router();
const Model = require('../models/socialworkerModel');
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
      else res.status(404).json({ message: 'Social Worker not found' });
    })
    .catch((err) => res.status(500).json(err));
});

router.delete('/delete/:id', (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.delete('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id)
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

// Follow a social worker
router.post('/follow/:id', verifyToken, async (req, res) => {
  try {
    const socialWorkerId = req.params.id;
    
    // Check if the id is valid
    if (!ObjectId.isValid(socialWorkerId)) {
      return res.status(400).json({ message: 'Invalid social worker ID' });
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
    if (currentUser._id.toString() === socialWorkerId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Start a session for transaction
    const session = await Model.startSession();
    try {
      await session.withTransaction(async () => {
        // Add to social worker's followers array if not already following
        const swResult = await Model.updateOne(
          { 
            _id: socialWorkerId, 
            'followers.followerId': { $ne: currentUser._id } 
          },
          { 
            $push: { followers: follower },
            $inc: { followerCount: 1 }
          },
          { session }
        );

        if (swResult.matchedCount === 0) {
          throw new Error('Social worker not found');
        }

        if (swResult.modifiedCount === 0) {
          throw new Error('Already following this social worker');
        }

        // Add social worker to user's followedSocialWorkers array
        const userResult = await User.updateOne(
          { _id: currentUser._id },
          { $addToSet: { followedSocialWorkers: socialWorkerId } },
          { session }
        );

        if (userResult.matchedCount === 0) {
          throw new Error('User not found');
        }
      });

      await session.commitTransaction();
      res.status(200).json({ message: 'Successfully followed social worker' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error following social worker:', error);
    res.status(error.message.includes('social worker') || error.message.includes('following') ? 400 : 500)
      .json({ message: error.message || 'Server error' });
  }
});

// Unfollow a social worker
router.post('/unfollow/:id', verifyToken, async (req, res) => {
  try {
    const socialWorkerId = req.params.id;
    
    // Check if the id is valid
    if (!ObjectId.isValid(socialWorkerId)) {
      return res.status(400).json({ message: 'Invalid social worker ID' });
    }
    
    // Get current user info
    const currentUser = req.user;
    
    // Start a session for transaction
    const session = await Model.startSession();
    try {
      await session.withTransaction(async () => {
        // Remove from social worker's followers array
        const swResult = await Model.updateOne(
          { _id: socialWorkerId, 'followers.followerId': currentUser._id },
          { 
            $pull: { followers: { followerId: currentUser._id } },
            $inc: { followerCount: -1 }
          },
          { session }
        );

        if (swResult.matchedCount === 0) {
          throw new Error('Social worker not found');
        }

        if (swResult.modifiedCount === 0) {
          throw new Error('You are not following this social worker');
        }

        // Remove social worker from user's followedSocialWorkers array
        const userResult = await User.updateOne(
          { _id: currentUser._id },
          { $pull: { followedSocialWorkers: socialWorkerId } },
          { session }
        );

        if (userResult.matchedCount === 0) {
          throw new Error('User not found');
        }
      });

      await session.commitTransaction();
      res.status(200).json({ message: 'Successfully unfollowed social worker' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error unfollowing social worker:', error);
    res.status(error.message.includes('social worker') || error.message.includes('following') ? 400 : 500)
      .json({ message: error.message || 'Server error' });
  }
});

// Get followers of a social worker
router.get('/followers/:id', async (req, res) => {
  try {
    const socialWorkerId = req.params.id;
    
    // Check if the id is valid
    if (!ObjectId.isValid(socialWorkerId)) {
      return res.status(400).json({ message: 'Invalid social worker ID' });
    }
    
    const socialWorker = await Model.findById(socialWorkerId).select('followers');
    
    if (!socialWorker) {
      return res.status(404).json({ message: 'Social worker not found' });
    }
    
    res.status(200).json(socialWorker.followers || []);
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//delete
module.exports = router;
