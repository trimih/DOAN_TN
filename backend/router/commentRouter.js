const express = require('express');
const app = express();
const CommentController = require('../model/comment')

//lấy tất cả bình luận
app.get('/comments', async (req, res)=> {
    try{
        const comment = await CommentController.find({}).populate('userId', 'username').populate('productId', 'name');;
        res.send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
});
// Lấy tất cả bình luận của sản phẩm
app.get('/comments/product/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const comments = await CommentController.find({ productId }).populate('userId', 'username'); // Populate để lấy tên người dùng
      res.status(200).json(comments);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });  
// Tạo mới một bình luận
app.post('/comments/add', async (req, res) => {
  try {
    const { userId, productId, description } = req.body;
    
    const newComment = new CommentController({
      userId,
      productId,
      description
    });
    
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Xóa bình luận
app.delete('/comments/:commentId', async (req, res) => {
    try {
      const { commentId } = req.params;
      
      const deletedComment = await CommentController.findByIdAndDelete(commentId);
      
      if (!deletedComment) {
        return res.status(404).json({ message: 'Bình luận không tìm thấy!' });
      }
      
      res.status(200).json({ message: 'Bình luận đã được xóa!' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
module.exports = app;
