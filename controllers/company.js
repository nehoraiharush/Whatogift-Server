import express from "express";
const router = express.Router();
import Account from '../models/account.js';
import Company from '../models/company.js';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

//update account
router.post('/create_company', async (req, res) => {
    //check if comoany exist under the associate id

    const { email, password, companyName } = req.body;

    if (email == '' || password == '' || companyName == '') {
        return res.status(200).json({
            status: false,
            message: 'One or more of the details is missing'
        });
    }

    const _id = mongoose.Types.ObjectId();

    //account exist
    Account.findOne({ email: email })
        .then(async account => {
            //company exist by name
            Company.findOne({ companyName: companyName })
                .then(company_exist_byName => {
                    if (company_exist_byName) {

                        return res.status(200).json({
                            status: false,
                            message: 'Company Name already taken'
                        });

                    } else {
                        //company exist by associateId
                        Company.findOne({ associateId: account._id })
                            .then(async company_exist_byAssociateId => {

                                if (company_exist_byAssociateId) {
                                    return res.status(200).json({
                                        status: false,
                                        message: `The account already has a company ${company_exist_byAssociateId}`
                                    });
                                } else {

                                    const _company = new Company({
                                        _id: _id,
                                        associateId: account,
                                        companyName: companyName
                                    });
                                    _company.save()
                                        .then(company_created => {
                                            return res.status(200).json({
                                                ststus: true,
                                                message: company_created
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

                    }
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

//update account
router.post('/update_company', async (req, res) => {

    const { email, password, companyName, address, city,
        state, zipcode, mobile, latitude, longitude, logo, bio } = req.body;

    if (email == '' || password == '' || companyName == '') {
        return res.status(200).json({
            status: false,
            message: 'One or more of the details is missing'
        });
    }

    Account.findOne({ email: email })
        .then(async account => {
            const isMatch = await bcryptjs.compare(password, account.password);
            if (isMatch && account.isVerified) {
                Company.findOne({ companyName: companyName })
                    .then(async company_exist => {
                        if (JSON.stringify(company_exist.associateId) == JSON.stringify(account._id)) {
                            company_exist.updateOne({
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
                            return res.status(200).json({
                                ststus: false,
                                message: `${account.firstName} ${account.lastName} doesn't associate with '${companyName}'`
                            });
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: false,
                            message: err.message
                        });
                    });

            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Invalid password'
                });
            }

        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            });
        })

});


export default router;