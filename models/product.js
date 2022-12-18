import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', },
    productName: { type: String, required: true },
    productImage: [
        {
            imageSource: String
        }
    ],
    productPrice: Number,
    productDescription: String,
    unitInStock: Number,
    targetAge: Number,
    reviews: [
        {
            associateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', },
            rating: Number,
            createdAt: { type: Date, default: Date.now },
            comments: String,
            title: String,

        }
    ],
    tags: [
        {
            type: String
        }
    ],
    createdAt: { type: Date, default: Date.now },

});

export default mongoose.model('Product', productSchema); 