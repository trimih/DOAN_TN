const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Nhập thư viện jsonwebtoken
const app = express();

app.use(express.json());

function createSampleEmailContent() {
    return `
      <div style="padding: 10px; background-color: #003375">
        <div style="padding: 10px; background-color: white;">
          <h4 style="color: #0085ff">Bạn đã đặt hàng thành công</h4>
          <p>Chào bạn,</p>
          <p>Cám ơn bạn đã ủng hộ cửa hàng</p>
          <p>Thân mến,<br />Nhóm của bạn</p>
        </div>
      </div>
    `;
}
app.post('/send-mail', function(req, res) {
    const authHeader = req.headers['authorization']; // Lấy header Authorization
    const token = authHeader ? authHeader.split(' ')[1] : null; // Tách token ra từ header

    if (!token) {
        return res.status(401).send('Không có token.'); // Không có token
    }

    let userEmail;
    try {
        const decoded = jwt.verify(token, 'abcd'); // Xác thực token với khóa bí mật
        userEmail = decoded.user.email; // Giả sử email của người dùng được lưu trong `user.email`
        console.log(userEmail);
    } catch (error) {
        return res.status(401).send('Token không hợp lệ: ' + error.message); // Nếu token không hợp lệ
    }

    // Tiếp tục xử lý gửi email ở đây
    const content = createSampleEmailContent();

    const mainOptions = {
        from: 'hominhtri0712@gmail.com', // Sử dụng email trích xuất từ token
        to: userEmail, // Bạn có thể tùy chỉnh để gửi đến người nhận khác
        subject: 'Bạn Đã Đặt Hàng Thành Công',
        html: content
    };

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'hominhtri0712@gmail.com', // Thay thế bằng email của bạn
            pass: 'cjvf lzve cjoh eguu' // Thay thế bằng mật khẩu ứng dụng hoặc mật khẩu email
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Gửi email
    transporter.sendMail(mainOptions, function(err, info) {
        if (err) {
            console.log(err);
            return res.status(500).send('Lỗi gửi mail: ' + err); // Nếu có lỗi trong quá trình gửi email
        } else {
            console.log('Message sent: ' + info.response);
            return res.status(200).json({ message: 'Email đã được gửi thành công!' }); // Thành công
        }
    });
});


module.exports = app;
