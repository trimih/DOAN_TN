const express = require('express');
const usernews = require('../model/news');
// const upload = require('./upload');
const app = express.Router();

//hien all tin tuc
app.get('/news',async function(req, res, next) {
    const tt = await(usernews.find({}))
  try {
    res.send(tt);
  } catch (error) {
    res.status(500).json({message: error.message});
  }  
});
// hiện Toàn bộ tin tức hot
app.get('/news/hot', async function (req, res,next) {
    const hotNews = await news.find({})
        .sort({ view: -1 })
        
    try {
      console.log('Tin tức hot:', hotNews); // Ghi log Tin tức hot
      res.send(hotNews);
    } catch (error) {
      console.error('Lỗi khi lấy Tin tức hot:', error); // Ghi log lỗi
      res.status(500).json({ message: error.message });
    }
  });
//   thêm tin tức
app.post('/addnew', async (req, res, next) => {
  console.log('Request body:', req.body);

  const tt = new news({
    tiltle: req.body.tiltle,
    description: req.body.description,
    image: req.body.image, 
  });

  try {
    const savedNews = await tt.save();
    console.log('News saved:', savedNews);
    res.json(savedNews);
  } catch (error) {
    console.error('Error saving News:', error);
    res.status(500).json({ message: error.message });
  }
});
//create sanpham
const multer = require('multer');
const news = require('../model/news');
//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
//Kiểm tra file upload
function checkFileUpLoad(req, file, cb){
if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
  return cb(new Error('Bạn chỉ được upload file ảnh'));
}
cb(null, true);
}
//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });
//Thêm sản phẩm
app.post('/addnews', upload.single('image'), async (req, res, next) => {
  const { tiltle,description } = req.body;
  const image = req.file.originalname;
  const newNews = { tiltle, description, image };

  try {
    const result = await NewsCollection.insertOne(newNews);
    // Check if insertedId exists (indicates successful insertion)
    if (result.insertedId) {
      res.status(200).json({ message: "Thêm Bài Viết thành công" });
    } else {
      res.status(500).json({ message: "Thêm Bài Viết thất bại" }); // Consider using 500 for unexpected errors
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" }); // Generic error message for user
  }
});
// xóa tin tức
app.delete('/news/:id', async (req, res) => {
    try{
        const news = await usernews.findByIdAndDelete(req.params.id,req.body);
        if(!news){
            return res.status(404).send();
        }
        res.send("Xóa Thành Công");
    }catch(error){
     res.status(500).send(error);   
    }
    }
)
// sửa tin tức
app.put('/new/:id', async (req, res) => {
    try{
        const news = await usernews.findByIdAndUpdate(req.params.id,req.body);
        if(!news){
            return res.status(404).send();
        }
        res.send('Cập nhật thành công');
    }catch(error){
        res.status(500).send(error);
    }
})
//lấy 1 tin tức
app.get('/news/:id',async function(req, res, next) {
    const news = await(usernews.findById(req.params.id,res.body));
    try {
      res.send(news);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  })
  // Tăng số lượng views của tin tức
app.post('/news/:id/views', async (req, res) => {
  const newsID = req.params.id;

  try {
    // Tìm Tin tức theo ID
    const news = await usernews.findById(newsID);

    if (!news) {
      return res.status(404).json({ message: 'news not found' });
    }

    // Tăng số lượng views
    news.view = (news.view || 0) + 1; // Khởi tạo views là 0 nếu chưa có
    await news.save(); // Lưu thay đổi vào cơ sở dữ liệu

    return res.status(200).json({ message: 'Views updated', view: news.view });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;


