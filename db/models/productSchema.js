const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    requestId:String,
    Status:String,
    productName:String,
    inputimageUrl:String,
    outputimageUrl:String
});

module.exports = mongoose.model('product',productSchema);