var express = require('express');
var danhmuc = require('../model/danhmuc');
var app = express.Router();

//them danhmuc
app.post('/danhmuc', async(req, res) => {
    const dm = new danhmuc(req.body);
    try {
        await dm.save();
        res.send(dm);
    } catch (error) {
        res.status(400).send(error);
    }
})
//lấy một danh mục
app.get('/danhmuc/:id', async(req, res) => {
    try {
        const dm = await danhmuc.findById(req.params.id);
        res.send(dm);
    } catch (error) {
        res.status(500).send(error);
    }
})
// doc danhmuc
app.get('/danhmuc', async(req, res) => {
    try {
        const dm = await danhmuc.find({});
        res.send(dm);
    } catch (error) {
        res.status(500).send(error);
    }
})
// xoa danhmuc
app.delete('/danhmuc/:id', async(req, res) => {
  try {
      await danhmuc.findByIdAndDelete(req.params.id,req.body);
      res.send("Xoa thanh cong");
  }catch (error) {
      res.status(500).send(error);
  }
})
// cap nhat danhmuc
app.put('/danhmuc/:id', async(req, res) => {
    try {
         await danhmuc.findByIdAndUpdate(req.params.id,req.body);
         await danhmuc.save();
        res.send();
    }catch (error) {
        res.status(500).send(error);
    }
})
module.exports = app;