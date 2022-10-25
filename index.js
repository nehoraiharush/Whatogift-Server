import express from "express";
import bp from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

const mongoUrl = `mongodb+srv://whatogift-user:OfrEUSWM6hk5pIwr@cluster0.krcbrvl.mongodb.net/whatogiftdb?retryWrites=true&w=majority`;

import accountControl from './controllers/account.js';
app.use('/api/account', accountControl);

const port = 3001;

mongoose.connect(mongoUrl)
    .then(res => {
        app.listen(port, function () {
            console.log(`Server is running via port ${port}`);
        });



    })
    .catch(error => { console.log(error.message); })

