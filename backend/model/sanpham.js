const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const sanpham = new Schema({
    name: { type: String, },
    quantity: { type: Number, },
    price: { type: Number, },
    hide_show: { type: Boolean},
    views: { type: Number, default: 0 }, // Trường lưu số lượt xem
    image: { type: String, },
    description: { type: String, },
    
    id_danhmuc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
    },{
        timestamps: true, //tự động thêm createdAt và updatedAt
    }
);
module.exports  = mongoose.model('Product',sanpham,'Product');