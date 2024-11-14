var express = require('express');
var OrderDetail = require('../model/oderdetail');

var app = express();

//Tạo mới OrderDetail
app.post('/orderdetail/add', async (req, res) => {
    try {
        const { orderId, items } = req.body;

        // Kiểm tra xem items có rỗng không hoặc không hợp lệ
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Danh sách sản phẩm không hợp lệ' });
        }

        // Tính tổng giá trị của đơn hàng
        const totalPrice = items.reduce((total, item) => {
            // Kiểm tra giá trị của item
            if (!item.price || !item.quantity || item.price <= 0 || item.quantity <= 0) {
                throw new Error('Giá trị sản phẩm không hợp lệ');
            }
            return total + item.price * item.quantity;
        }, 0);

        const newOrderDetail = new OrderDetail({
            orderId,
            items,
            totalPrice
        });

        // Lưu OrderDetail vào cơ sở dữ liệu
        const savedOrderDetail = await newOrderDetail.save();
        res.status(201).json(savedOrderDetail);
    } catch (error) {
        console.error(error);  // Log lỗi để dễ dàng debug
        res.status(500).json({ message: 'Lỗi khi tạo chi tiết đơn hàng', error: error.message });
    }
});


// Lấy tất cả OrderDetail
app.get('/orderdetail', async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find().populate('orderId').populate('items.productId');
        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chi tiết đơn hàng', error });
    }
});
// Lấy chi tiết OrderDetail theo ID
app.get('/orderdetail/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Tìm kiếm chi tiết đơn hàng theo orderId
        const orderDetail = await OrderDetail.findOne({ orderId })
            .populate('orderId') // Điền dữ liệu của đơn hàng liên kết
            .populate('items.productId'); // Điền dữ liệu của sản phẩm trong items
        
        if (!orderDetail) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        }
        
        res.status(200).json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error });
    }
});

//Cập nhật OrderDetail
app.put('/orderdetail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { items } = req.body;

        // Tính toán lại tổng giá trị đơn hàng
        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

        const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
            id,
            { items, totalPrice },
            { new: true }
        ).populate('orderId').populate('items.productId');

        if (!updatedOrderDetail) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng để cập nhật' });
        }

        res.status(200).json(updatedOrderDetail);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật chi tiết đơn hàng', error });
    }
});

module.exports = app;