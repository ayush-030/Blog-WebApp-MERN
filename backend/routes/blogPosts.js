const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost'); 


router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 }); 
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { title, content, author } = req.body;
    const newPost = new BlogPost({
        title,
        content,
        author
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost); 
    } catch (err) {
        res.status(400).json({ message: err.message }); 
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            { title, content, author, updatedAt: Date.now() }, 
            { new: true, runValidators: true } 
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json({ message: 'Blog post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
