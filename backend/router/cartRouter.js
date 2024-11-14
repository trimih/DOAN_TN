var express = require('express');
var app = express.Router();
var cartController = require('../model/giohang');
var sanphamController = require('../model/sanpham');
var userController = require('../model/user');

// API lấy tất cả các giỏ hàng
app.get('/cart', async (req, res) => {
    try {
        const carts = await cartController.find()
            .populate('items.productId') // Lấy chi tiết sản phẩm từ bảng 'Product'
            .exec();

        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: 'Không có giỏ hàng nào' });
        }

        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});
// Lấy giỏ hàng của người dùng
app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params; // Lấy userId từ request params
    try {
        const cart = await cartController.findOne({ userId }) // Tìm giỏ hàng theo userId
            .populate('items.productId') // Lấy chi tiết sản phẩm từ bảng 'Product'
            .exec();

        if (!cart) {
            return res.status(404).json({ message: 'Không có giỏ hàng nào' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});



app.post('/cart/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId|| !productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Thông tin không hợp lệ' });
    }

    try {
        let cart = await cartController.findOne({ userId }).exec();

        // Kiểm tra nếu sản phẩm tồn tại
        const product = await sanphamController.findById(productId).exec();
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

        const itemPrice = product.price * quantity;

        if (cart) {
            // Nếu giỏ hàng đã tồn tại, kiểm tra sản phẩm trong giỏ hàng
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

            if (itemIndex > -1) {
                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng và giá
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].price += itemPrice;
            } else {
                // Nếu sản phẩm chưa có, thêm vào giỏ hàng
                cart.items.push({ productId, quantity, price: itemPrice });
            }

            // Cập nhật tổng giá
            cart.totalPrice += itemPrice;
        } else {
            // Tạo giỏ hàng mới nếu chưa tồn tại
            cart = new cartController({
                userId,
                items: [{ productId, quantity, price: itemPrice }],
                totalPrice: itemPrice
            });
        }

        await cart.save();
        res.status(200).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng', cart });
    } catch (error) {
        console.error("Error in adding to cart:", error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
}); 


// Xóa sản phẩm khỏi giỏ hàng
app.delete('/cart/delete', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const cart = await cartController.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

        // Tìm sản phẩm và xóa
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (itemIndex > -1) {
            const itemPrice = cart.items[itemIndex].price * cart.items[itemIndex].quantity;
            cart.totalPrice -= itemPrice;
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

//xóa sản phẩm khỏi giỏ hàng
app.delete('/cart/:userId/remove', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body; // Lấy productId từ body

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await cartController.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }

        // Tìm vị trí sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.items.splice(itemIndex, 1);

        // Cập nhật tổng giá
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Lưu giỏ hàng sau khi thay đổi
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng' });
    }
});

// API cập nhật số lượng sản phẩm trong giỏ hàng
app.post('/cart/:userId/update', async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await cartController.findOne({ userId });

        // Kiểm tra xem giỏ hàng có tồn tại không
        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
        }

        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // Cập nhật số lượng sản phẩm
            cart.items[itemIndex].quantity = quantity;

            // Cập nhật tổng giá trị giỏ hàng (nếu cần)
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);

            // Lưu giỏ hàng đã cập nhật
            await cart.save();

            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy trong giỏ hàng.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật giỏ hàng.' });
    }
});
//xóa khi thanh toán
app.delete('/cart/:userId/clear', async (req, res) => {
    const { userId } = req.params; // Lấy userId từ params

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await cartController.findOne({ userId: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại cho người dùng này.' });
        }

        // Xóa tất cả items trong giỏ hàng
        cart.items = [];
        cart.totalPrice = 0; // Cập nhật tổng giá trị của giỏ hàng về 0

        // Lưu lại giỏ hàng đã được cập nhật
        await cart.save();

        // Trả về thông báo thành công
        res.status(200).json({ message: 'Tất cả items đã được xóa khỏi giỏ hàng thành công.', cart });
    } catch (error) {
        console.error('Lỗi khi xóa items khỏi giỏ hàng:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa items khỏi giỏ hàng.' });
    }
});
module.exports = app;