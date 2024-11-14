var express = require('express');
var Order = require('../model/oder');

var app = express.Router();

//Tạo mới một đơn hàng
app.post('/orders/add', async (req, res) => {
    const { userId, paymentMethod, address, totalAmount } = req.body;
        const newOrder = new Order({
            userId,
            paymentMethod,
            address,
            totalAmount
        });
    try {
        const savedOrder = await newOrder.save();
        res.send(savedOrder);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error creating order', error });
    }
});

// Lấy tất cả đơn hàng
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId'); // Lấy thêm thông tin user
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

// Lấy thông tin đơn hàng theo ID
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
});

// Cập nhật đơn hàng
app.put('/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order', error });
    }
});

// Xóa đơn hàng
app.delete('/orders/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }

});
//update status
app.put('/orders/updateStatus/:id', async (req, res) => {
    const { status } = req.body; // Lấy trạng thái mới từ body
  
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!order) {
        return res.status(404).json({ message: 'Đơn hàng không tìm thấy!' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng!' });
    }
  });
  // API để lấy tổng doanh thu theo ngày
app.get('/revenue', async (req, res) => {
    try {
        const orders = await Order.aggregate([
            { 
                $project: {
                    day: { $dayOfMonth: "$createdAt" }, // Lấy ngày từ trường createdAt
                    month: { $month: "$createdAt" }, // Lấy tháng từ trường createdAt
                    year: { $year: "$createdAt" }, // Lấy năm từ trường createdAt
                    totalAmount: 1
                }
            },
            {
                $group: {
                    _id: { day: "$day", month: "$month", year: "$year" }, // Nhóm theo ngày, tháng, năm
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } } // Sắp xếp theo ngày
        ]);
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = app;