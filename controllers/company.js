import express from "express";
const router = express.Router();
import Account from '../models/account.js';
import Company from '../models/company.js';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import Auth from './auth.js';

//update account
router.post('/create_company', Auth, async (req, res) => {
    //check if comoany exist under the associate id

    const user = req.user;
    const { companyName, contact } = req.body;

    if (companyName == '') {
        return res.status(200).json({
            status: false,
            message: 'One or more of the details is missing'
        });
    }

    const company = await Company.find({ associateId: user._id });
    if (company.length > 0) {
        return res.status(200).json({
            status: false,
            message: 'Company exist'
        });
    } else {
        //CREATE COMPANY
        const id = mongoose.Types.ObjectId();
        const _company = new Company({
            _id: id,
            companyName: companyName,
            associateId: user._id,
            contact: contact,
            bio: ''

        });
        _company.save()
            .then(company_created => {
                return res.status(200).json({
                    status: true,
                    message: company_created
                });
            })
            .catch(err => {
                return res.status(200).json({
                    status: false,
                    message: err.message
                });
            });
    }
});

//update account
router.post('/update_company', Auth, async (req, res) => {

    const user = req.user;
    const { id, address, city, state, zipcode, mobile, latitude,
        longitude, logo, bio } = req.body;


    const company = await Company.findById(id);
    if (company) {
        const account_accociated = await Company.findOne({ associateId: user._id })
        if (account_accociated) {
            company.updateOne({
                contact: {
                    address: address,
                    city: city,
                    state: state,
                    zipcode: zipcode,
                    mobile: mobile,
                    latitude: latitude,
                    longitude: longitude
                },
                logo: logo,
                bio: bio
            })
                .then(async company_updated => {
                    return res.status(200).json({
                        status: true,
                        message: company_updated
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        status: false,
                        message: err.message
                    });
                });
        } else {
            return res.status(500).json({
                status: false,
                message: `Account is not associated with the company '${company.companyName}'}`
            });
        }
    } else {
        return res.status(500).json({
            status: false,
            message: "Company not found"
        });
    }

});

router.get('/get_companies', Auth, async (req, res) => {

    Company.find()
        .then(companies => {
            return res.status(200).json({
                message: companies
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: err.message
            });
        })

});


export default router;