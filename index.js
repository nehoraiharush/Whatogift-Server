import express from "express";
import bp from "body-parser";
import mongoose from "mongoose";

import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";

const app = express();

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

const mongoUrl = `mongodb+srv://whatogift-user:OfrEUSWM6hk5pIwr@cluster0.krcbrvl.mongodb.net/whatogiftdb?retryWrites=true&w=majority`;
const port = 3001;

//SETTING SWAGGER
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Whatogift API Endpoints',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ],
    },
    apis: ['./controllers/*.js']
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(swaggerSpec));


//CONTROLLERS
import accountControl from './controllers/account.js';
app.use('/api/account', accountControl);

import companyControl from './controllers/company.js';
app.use('/api/company', companyControl);

import productControl from './controllers/product.js';
app.use('/api/product', productControl);





mongoose.connect(mongoUrl)
    .then(res => {
        app.listen(port, function () {
            console.log(`Server is running via port ${port}`);
        });



    })
    .catch(error => { console.log(error.message); })

