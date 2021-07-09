const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema({
    Product_name: String,
    Specification: String,
    Reg_number: String,
    OKPD: String,
    Reg_number_add: String,
    Reg_date_number: String,
    Org_name: String,
    Org_address: String,
    Org_name_dev: String,
    Org_dev_address: String,
    Type: Number,
    Status: String,
    Name_owner: String,
    Inn: String,
    Address: String,
    Email: String,
    Phone: String,
    Contact: String

});
newproducts.index({Product_name: 'text', Reg_number: 'text'});
const Product = mongoose.model('products', products);
module.exports = Product;