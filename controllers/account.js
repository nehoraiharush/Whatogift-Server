import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Auth from './auth.js';

import Account from '../models/account.js';


router.post('/signUp', async (req, res) => {

    const _id = mongoose.Types.ObjectId();
    const { firstName, lastName, email, password } = req.body;
    //check if feilds now empty
    if (email == '' || password == '' || lastName == '' || firstName == '') {
        return res.status(200).json({
            status: false,
            message: 'One field or more are missing'
        });
    }

    //check if account exist
    Account.findOne({ email: email })
        .then(async account => {
            if (account) {
                return res.status(200).json({
                    status: false,
                    message: 'Account already exists'
                });
            } else {
                const hash = await bcryptjs.hash(password, 10);
                const code = generateRandomIntegerRange(1111, 9999);
                console.log(code);
                const _account = new Account({
                    _id: _id,
                    managerId: _id,
                    email: email,
                    password: hash,
                    firstName: firstName,
                    lastName: lastName,
                    passcode: code
                })
                _account.save()
                    .then(account_created => {
                        return res.status(200).json({
                            status: true,
                            message: account_created
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
    //store user in db
    //send verivication code
});

router.post('/verify', async (req, res) => {
    //get code + email
    const { email, code } = req.body;
    //check if code match
    Account.findOne({ email: email })
        .then(async account => {
            if (parseInt(code) == parseInt(account.passcode)) {
                account.isVerified = true;
                account.save()
                    .then(async (account_verified) => {
                        return res.status(200).json({
                            status: true,
                            message: account_verified
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: false,
                            message: err.message
                        });
                    })

            } else {
                return res.status(200).json({
                    status: false,
                    message: "Verify code desn't match"
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            });
        })
    //update db false true
});

router.post('/login', async (req, res) => {
    //get user loogin data
    const { email, password } = req.body;
    //check if user exist and password match
    Account.findOne({ email: email })
        .then(async account => {
            if (account) {
                const isMatch = await bcryptjs.compare(password, account.password);
                if (isMatch && account.isVerified) {

                    const keyToken = 'm1eIkEjW6Jl64pYbuXsrXixLJpfupNbT';
                    const data = { account };
                    //generate jwt token
                    const token = await jwt.sign(data, keyToken);

                    return res.status(200).json({
                        status: true,
                        message: account,
                        token: token
                    });

                } else {
                    return res.status(200).json({
                        status: false,
                        message: 'Password not match or account not verified'
                    });
                }
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Account not found'
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

//update account details
router.post('/update_account', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const { firstName, lastName, dob, gender, avatar,
        address, city, state, zipCode, mobile } = req.body;

    Account.findOne({ email: email })
        .then(async account => {

            const isMatch = await bcryptjs.compare(password, account.password);
            if (isMatch && account.isVerified) {
                account.updateOne({
                    firstName: firstName,
                    lastName: lastName,
                    dob: dob,
                    gender: gender,
                    avatar: avatar,
                    contact: {
                        address: address,
                        city: city,
                        state: state,
                        zipcode: zipCode,
                        mobile: mobile
                    }
                })
                    .then(account_updated => {
                        return res.status(200).json({
                            status: true,
                            message: account_updated
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: false,
                            message: err.message
                        });
                    })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Wrong Password or Account is not verified for this action'
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

//change password
router.post('/update_password', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (newPassword == '') {
        return res.status(200).json({
            status: false,
            message: "New password must contain characters"
        });
    }
    else if (oldPassword == newPassword) {
        return res.status(200).json({
            status: false,
            message: "Cannot use old password"
        }); k
    }

    Account.findOne({ email: email })
        .then(async account => {
            const isMatch = await bcryptjs.compare(oldPassword, account.password);
            if (isMatch && account.isVerified) {

                const hash = await bcryptjs.hash(newPassword, 10);
                account.updateOne({
                    password: hash
                })
                    .then(account_updated => {
                        return res.status(200).json({
                            status: true,
                            message: account_updated
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
                    status: false,
                    message: 'Wrong Password or Account is not verified for this action'
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

router.get('/getOverView', Auth, async (req, res) => {
    return res.status(200).json({
        message: `hello ${req.user.firstName} ${req.user.lastName}`
    });
});


const generateRandomIntegerRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}


export default router;