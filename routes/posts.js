const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { verifyUser } = require('./verifyToken');


// Getting all posts
router.get('/', verifyUser ,async (req, res) => {
	/*res.send(req.user)*/
	try{
		const posts = await Post.find();
		res.json(posts);

	}catch(err){
		res.json({message: err})
	}	
});


// Save post
router.post('/', async (req, res) => {
	const post = new Post({
		title:req.body.title,
		description:req.body.description
	});
	try{
		const savedPost = await post.save();
		res.json(savedPost)
	}catch(err){
		res.json({message: err})
	}	

});


// Get specific post
router.get('/:id', async(req,res) => {
	try{
		const post = await Post.findById(req.params.id);
		res.json(post)
	}catch(err){
		res.json({message: err})
	}	
});


// Remove post
router.delete('/:id', async(req,res) => {
	try{
		const removePost = await Post.remove({_id : req.params.id});
		res.json(removePost)
	}catch(err){
		res.json({message: err})
	}	
});

// Update post
router.patch('/:id', async(req,res) => {
	try{
		const updatedPost = await Post.updateOne({_id : req.params.id}, {$set : {title : req.body.title, description:req.body.description}});
		res.json(updatedPost)
	}catch(err){
		res.json({message: err})
	}	
})




module.exports = router;

