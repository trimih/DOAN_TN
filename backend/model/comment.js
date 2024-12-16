const mongoose = require('mongoose');

// Định nghĩa schema cho bảng comment
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // tham chiếu đến bảng User
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // tham chiếu đến bảng Product
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  }, 
},{
    timestamps: true // thêm trường createdAt và updatedAt
});

// Định nghĩa model cho bảng comment
const Comment = mongoose.model('Comment', commentSchema,'Comment');

module.exports = Comment;
