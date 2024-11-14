const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // ID của người dùng liên kết với đơn hàng
    status: { 
        type: String, 
        enum: ['đang chờ', 'đã xác nhận', 'đã giao', 'đã nhận', 'đã hủy'], 
        default: 'đang chờ' 
    }, // Trạng thái đơn hàng
    paymentMethod: { 
        type: String, 
        enum: ['tiền mặt', 'thẻ tín dụng'], 
        required: true 
    }, // Phương thức thanh toán
    address: { 
        type: String, 
        required: true 
    }, // Địa chỉ giao hàng
    totalAmount: { 
        type: Number, 
        required: true 
    }, // Tổng số tiền của đơn hàng
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Orders', orderSchema, 'Orders');
