const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const news = new Schema({
    tiltle: String,
    description: String,
    image: String,
    view: { type: Number, default: 0 }, //lưu số lượt xem
},{
    timestamps: true, //tự động thêm createdAt và updatedAt
}
);
module.exports = mongoose.model('News', news,'News');