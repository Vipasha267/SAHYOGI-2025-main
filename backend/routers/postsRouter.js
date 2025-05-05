const express = require('express');
const router = express.Router();
const Post = require('../models/postsModel');
const { ObjectId } = require('mongoose').Types;

// Import the enhanced auth middleware
const { verifyToken, checkRole } = require('../middleware/auth');

// Create a new post (protected route)
router.post('/add', verifyToken, async (req, res) => {
  try {
    // Add the authenticated user's ID as the author
    const postData = {
      ...req.body,
      authorId: req.user._id
    };
    
    const newPost = new Post(postData);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

// Get all posts with optional filtering
router.get('/getall', async (req, res) => {
  try {
    const { type, authorType, tag } = req.query;
    
    // Build filter object based on query parameters
    const filter = {};
    
    if (type) filter.type = type;
    if (authorType) filter.authorType = authorType;
    if (tag) filter.tags = { $in: [tag] };
    
    const posts = await Post.find(filter).sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

// Get a single post by ID
router.get('/getbyid/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
});

// Get posts by author ID
router.get('/getbyauthor/:authorId', async (req, res) => {
  try {
    const posts = await Post.find({ 
      authorId: req.params.authorId 
    }).sort({ date: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    res.status(500).json({ message: 'Failed to fetch author posts', error: error.message });
  }
});

// Update a post (protected route)
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the user is the author of the post
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }
    
    // Don't allow changing the author
    delete req.body.authorId;
    delete req.body.authorType;
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
});

// Delete a post (protected route)
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the user is the author of the post
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
});

// Like a post (protected route)
router.post('/like/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment like count
    post.likes += 1;
    await post.save();
    
    res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
});

// Search posts by title or content
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }).sort({ date: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ message: 'Failed to search posts', error: error.message });
  }
});

module.exports = router;