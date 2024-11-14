const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    orderId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Orders', 
        required: true 
    }, // ID của đơn hàng liên kết
    items: [
        {
            productId: { 
                type: Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            }, // ID của sản phẩm
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
        required: true 
    } // Tổng giá trị của toàn bộ đơn hàng
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema, 'OrderDetail');
