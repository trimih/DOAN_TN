    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const cartSchema = new Schema({
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }, // ID của người dùng liên kết với giỏ hàng
        items: [
            {
                productId: { 
                    type: Schema.Types.ObjectId, 
                    ref: 'Product', 
                    required: true 
                }, // ID của sản phẩm trong giỏ
                quantity: { 
                    type: Number, 
                    required: true, 
                    min: 1 
                }, // Số lượng sản phẩm
                price: { 
                    type: Number, 
                    required: true 
                } // Giá tại thời điểm thêm vào giỏ
            }
        ],
        totalPrice: { 
            type: Number, 
            required: true, 
            default: 0 
        }, // Tổng giá trị của giỏ hàng

    },{
        timestamps: true, //tự động thêm createdAt và updatedAt
    }
    );

    module.exports = mongoose.model('Cart', cartSchema, 'Cart');
