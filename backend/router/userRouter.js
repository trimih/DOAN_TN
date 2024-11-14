const express = require('express');
const userModel = require('../model/user');
const bcryptjs = require('bcryptjs');
const app = express.Router();
const jwt = require('jsonwebtoken');
 
app.post('/user/signup', async (req, res) => {
    const {username, email, password, phone, address} = req.body;
    const salt = bcryptjs.genSaltSync(10);
    const hashPassword = bcryptjs.hashSync(password, salt);
    const u = new userModel({username, email, password: hashPassword, phone, address,role: 'user'});
    try{
        await u.save();
        res.send(u);
    }catch(e){
        res.status(500).send(e);
    }
});
// lấy user
app.get('/user', async (req, res) => {
    try{
        const users = await userModel.find();
        res.send(users);
    }catch(e){
        res.status(500).send(e);
    }
})
app.get('/user/:id', async (req, res) => {
   try{ 
        const u = await userModel.findById(req.params.id);
        if(!u) return res.status(404).send('User not found');
        res.send(u);
    }catch(e)
    {
        res.status(500).send(e);
    }
})
//login
// app.post('/user/login', async (req, res) => {
//     const {email, password} = req.body;
//     const user = await (userModel.findOne({email}));
//     if (!user) {
//      return res.status(401).send({ error: 'Email hoặc mật khẩu không chính xác.' });
//  }
//     if(user){
//         const isMatch = bcryptjs.compareSync(password, user.password);
//         if(!isMatch) return res.sendStatus(401);
//              delete user._doc.password;
//          const token = jwt.sign({user},'abcd',{expiresIn: '60'});
//          res.send({token});            
//     }   
    
//  })
app.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra sự tồn tại của người dùng
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Kiểm tra mật khẩu
        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Tạo token
        const token = jwt.sign({user},'abcd',{expiresIn: '1h'});
        
        // Loại bỏ mật khẩu trước khi gửi phản hồi
        const userResponse = { ...user._doc };
        delete userResponse.password;

        // Gửi phản hồi với token và thông tin người dùng (nếu cần)
        res.send({ token, user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        console.log(error);
    }
});

//xoa user
app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const user = await userModel.findByIdAndDelete(id);
        if(!user) return res.status(404).send('User not found');
        res.send(user);
        
    }catch(e){
        res.status(500).send(e);
    }
})
//sửa user
app.put('/user/:id', async (req, res) => {
    const id = req.params.id;
    const {fullname, email, password, phone, address,role} = req.body;
    const u = await userModel.findByIdAndUpdate(id, {fullname, email, password, phone, address,role}, {new: true});
    if(!u) return res.status(404).send('User not found');
    res.send(u);
})
//lay một user


// kiểm tra token
app.get('/checktoken', async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'abcd', (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Token không hợp lệ" });
      }
      res.status(200).json({ message: "Token hợp lệ" });
    }
    );
  }
  );
module.exports = app;