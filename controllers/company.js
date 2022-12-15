import express from "express";
const router = express.Router();
import Account from '../models/account.js';
import Company from '../models/company.js';
import mongoose from 'mongoose';
import Auth from './auth.js';
import { getDistance } from 'geolib';


/**
 * @swagger
 * definitions:
 *  get_companies_by_location:
 *      type: object
 *      properties:
 *          latitude:
 *              type: string
 *              example: 31.736375
 *          longitude:
 *              type: string
 *              example: 34.749102
 */


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
        longitude, logo, bio, type } = req.body;


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
                type: type,
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


/**
 * @swagger
 * /api/company/get_companies:
 *  get:
 *      summary: Use the endpoint to get all categories in DB
 *      tags: [Company]
 *      responses:
 *          200:
 *              description: return list of all categories
 *          500:
 *              description: Some error occured
 */

router.get('/get_companies', Auth, async (req, res) => {

    Company.find()
        .then(companies => {
            if (companies.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: companies
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "No Companies were found"
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


/**
 * @swagger
 * /api/company/get_companies_by_location:
 *  post:
 *      summary: get all comapnies and your location from them
 *      description: use this endpoint to get all companies and the distance from them
 *      tags: [Company]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/get_companies_by_location'
 *      responses:
 *          200:
 *              description: return a new list with the companies and your distance from them
 *          500:
 *              description: some error occured                 
 */

router.post('/get_companies_by_location', Auth, async (req, res) => {

    const { latitude, longitude } = req.body;

    Company.find()
        .then(companies => {

            if (companies.length > 0) {
                let companiesWithLoc = getCompaniesWithLocation(companies, latitude, longitude);
                return res.status(200).json({
                    status: true,
                    message: companiesWithLoc
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "No companies were found"
                });
            }

        })
        .catch(err => {
            return res.status(500).json({
                message: err.message
            });
        })

});

export const getCompaniesWithLocation = (companies, latitude, longitude) => {
    let companiesWithLoc = [];

    companies.forEach(company => {
        const distance = getDistance(
            { latitude: company.contact.latitude, longitude: company.contact.longitude },
            { latitude: latitude, longitude: longitude }
        )

        companiesWithLoc.push({
            company_info: company,
            distance: distance
        })
    })
    return companiesWithLoc;
}


export default router;