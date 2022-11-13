import jwt from "jsonwebtoken";
import Account from '../models/account.js';

export default (req, res, next) => {

    const header = req.headers['authorization'];
    if (header) {
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'm1eIkEjW6Jl64pYbuXsrXixLJpfupNbT', (err, authData) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                Account.findById(authData.account._id)
                    .then(user => {
                        req.user = user;
                        next();
                    })
                    .catch(err => {
                        return res.status(500).json({
                            message: err.message
                        })
                    });
            }
        });

    } else {
        return res.sendStatus(403);
    }

}