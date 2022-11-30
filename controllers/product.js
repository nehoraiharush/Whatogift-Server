import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Auth from './auth.js';

import Brand from '../models/brand.js';
import Category from '../models/category.js';
import Product from '../models/product.js';



/**
 * @swagger
 * /api/product/get_all_brands:
 *  get:
 *      summary: Return a list of all brands
 *      tags: [Products]
 *      responses: 
 *          200:
 *              description: This is the list of all brands
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error was found
 */

router.get('/get_all_brands', async (req, res) => {
    Brand.find()
        .then(brands => {
            if (brands.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: brands
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No brands exist'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
});

router.post('/create_new_brand', Auth, async (req, res) => {
    const id = mongoose.Types.ObjectId();

    const { brandName, brandLogo } = req.body;

    if (brandName === '' || brandLogo === '') {
        return res.status(200).json({
            status: false,
            message: 'One or more fields are missing'
        });
    }

    Brand.findOne({ brandName: brandName })
        .then(brand => {
            if (brand) {
                return res.status(200).json({
                    status: false,
                    message: `${brand.brandName} is already taken`
                });
            }

            const _brand = new Brand({
                _id: id,
                brandName: brandName,
                brandLogo: brandLogo
            })
            _brand.save()
                .then(brand_created => {
                    return res.status(200).json({
                        status: true,
                        message: brand_created
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        status: false,
                        message: err.message
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            });
        });

});

router.get('/get_all_categories', async (req, res) => {
    Category.find()
        .then(category_exists => {
            if (category_exists.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: category_exists
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No Categories exist'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
});

router.post('/create_new_category', Auth, async (req, res) => {
    const id = mongoose.Types.ObjectId();

    const categoryName = req.body.categoryName;
    if (categoryName === '') {
        return res.status(200).json({
            status: false,
            message: 'One or more fields are missing'
        });
    }
    Category.findOne({ categoryName: categoryName })
        .then(category_found => {
            if (category_found) {
                return res.status(200).json({
                    status: false,
                    message: `${categoryName} is already taken`
                })
            } else {

                const _category = new Category({
                    _id: id,
                    categoryName: categoryName
                })
                _category.save()
                    .then(category_created => {
                        return res.status(200).json({
                            status: true,
                            message: category_created
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: false,
                            message: err.message
                        });
                    });
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            });
        });
});

router.get('/get_all_products', async (req, res) => {
    Product.find()
        .then(products_exist => {
            if (products_exist.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: products_exist
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No Products exist'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
});

router.post('/create_new_product', Auth, async (req, res) => {
    const id = mongoose.Types.ObjectId();

    const { companyId, categoryId, brandId, productName,
        productImage, productPrice, productDescription, unitInStock } = req.body;

    const _product = new Product({
        _id: id,
        companyId: companyId,
        categoryId: categoryId,
        brandId: brandId,
        productName: productName,
        productImage: productImage,
        productPrice: productPrice,
        productDescription: productDescription,
        unitInStock: unitInStock,
        reviews: []
    })
    _product.save()
        .then(product_created => {
            return res.status(200).json({
                status: true,
                message: product_created
            })
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
})



router.delete('/delete_brand', Auth, async (req, res) => {

});
router.delete('/delete_category', Auth, async (req, res) => {

});
router.delete('/delete_product', Auth, async (req, res) => {

});


export default router;