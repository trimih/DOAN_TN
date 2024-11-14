var express = require('express');   
var sanpham = require('../model/sanpham');
var danhmuc = require('../model/danhmuc');  
// var upload = require('../router/upload')
var app = express.Router();
//thêm ảnh
// app.post('/sanpham/upload', upload.single('image'), (req, res) => {
    
// })
// them sanpham
//get all sanpham
app.get('/sanpham',async function(req, res, next) {
    const sp = await(sanpham.find({}))
  try {
    res.send(sp);
  } catch (error) {
    res.status(500).json({message: error.message});
  }  
});
//lấy sản phẩm hot
app.get('/sanpham/hot', async function (req, res,next) {
  const hotProducts = await sanpham.find({})
      .sort({ views: -1 })
      .limit(4);
  try {
    console.log('Sản phẩm hot:', hotProducts); // Ghi log sản phẩm hot
    res.send(hotProducts);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm hot:', error); // Ghi log lỗi
    res.status(500).json({ message: error.message });
  }
});

app.post('/add', async (req, res, next) => {
  console.log('Request body:', req.body);

  const sp = new sanpham({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    quantity: req.body.quantity,
    id_danhmuc: req.body.category,
    image: req.body.image, // Link hình ảnh
  });

  try {
    const savedProduct = await sp.save();
    console.log('Product saved:', savedProduct);
    res.json(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: error.message });
  }
});

//create sanpham
const multer = require('multer');
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
app.post('/addproduct', upload.single('image'), async (req, res, next) => {
  const { name, price, description, categoryId } = req.body;
  const image = req.file.originalname;
  const newProduct = { name, price, description, categoryId, image };

  try {
    const result = await productCollection.insertOne(newProduct);
    // Check if insertedId exists (indicates successful insertion)
    if (result.insertedId) {
      res.status(200).json({ message: "Thêm sản phẩm thành công" });
    } else {
      res.status(500).json({ message: "Thêm sản phẩm thất bại" }); // Consider using 500 for unexpected errors
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại" }); // Generic error message for user
  }
});

app.post('/create',async function(req, res, next) {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    const quality = req.body.quality;
    const id_danhmuc = req.body.id_danhmuc;
    const data = {name, price, image, description,quality, id_danhmuc};
      console.log(data);
    const sp =  new sanpham(data);
    try {
        await sp.save();
        res.send(sp);
    } catch {
      res.status(500).json({message: error.message});
    }
})
//xoa sanpham
app.delete('/sanpham/:id', async (req, res) => {
    try{
        const sp = await sanpham.findByIdAndDelete(req.params.id,req.body);
        if(!sp){
            return res.status(404).send();
        }
        res.send("xoa thanh cong");
    }catch(error){
     res.status(500).send(error);   
    }
    }
)
//sửa sanpham
app.put('/sanpham/:id', async (req, res) => {
    try{
        const sp = await sanpham.findByIdAndUpdate(req.params.id,req.body);
        if(!sp){
            return res.status(404).send();
        }
        res.send('cap nhat thanh cong');
    }catch(error){
        res.status(500).send(error);
    }
})

//get danhmucsp
app.get('/dmsp',async function(req, res, next) {
  const dms = await(danhmuc.find({}));
  const sps = await(sanpham.find({}));
  const dmsp = dms.map(dm => {
    const sp_dm = sps.filter(sp => sp.id_danhmuc == dm._id);
    return {_id:dm,name:dm.name,sanpham:sp_dm};
  })
  try {
    res.json(dmsp);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

//lay 1 sp
app.get('/sanpham/:id',async function(req, res, next) {
  const sp = await(sanpham.findById(req.params.id,res.body));
  try {
    res.send(sp);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})
//find sanpham by id danh muc
app.get('/sanpham/danhmuc/:id',async function(req, res, next) {
  let id_danhmuc = req.params.id;
  const danhsach = await(sanpham.find({}));
  const sp = danhsach.filter(sp => sp.id_danhmuc == id_danhmuc);
  try {
    // res.send(sp);
    res.json(sp);
  } catch (error) {
   res.status(500).json({message: error.message});
  }
})
//tìm kiếm sản phẩm
app.get('/sanpham/timkiem/:name',async function(req, res, next) {
  let name = req.params.name;
  const danhsach = await(sanpham.find({}));
  const sp = danhsach.filter(sp => sp.name.toLowerCase().includes(name.toLowerCase()));
  try {
   res.send(sp);
    // res.json(sp); 
  }catch{
      res.status(500).json({message: error.message});
  }
})

// Tăng số lượng views của sản phẩm
app.post('/sanpham/:id/views', async (req, res) => {
  const productId = req.params.id;

  try {
    // Tìm sản phẩm theo ID
    const product = await sanpham.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Tăng số lượng views
    product.views = (product.views || 0) + 1; // Khởi tạo views là 0 nếu chưa có
    await product.save(); // Lưu thay đổi vào cơ sở dữ liệu

    return res.status(200).json({ message: 'Views updated', views: product.views });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
