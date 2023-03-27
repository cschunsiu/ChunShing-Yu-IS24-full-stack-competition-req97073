const express = require('express');
const path = require('path');
const cors = require('cors');
const { isNil, isNaN } = require('lodash');
const bodyParser = require('body-parser');
const ApiService = require('./service');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// get endpoint return webapp
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// API for health check
app.get('/api/health', (req, res, next) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    console.log(ApiService.getProducts());

    res.status(200).send(data);
});

// get API for product by id
app.get('/api/product/:productId', (req, res, next) => {
    const { productId } = req.params;

    if (isNil(productId) || isNaN(parseInt(productId))) {
        const err = new Error(`Invalid param: ${productId}`);
        err.status = 400;
        next(err);
    }

    try {
        const product = ApiService.getProductById(parseInt(productId));
        res.status(202).send(product);
    } catch (err) {
        next(err);
    }
});

// get API for products
app.get('/api/products', (req, res, next) => {
    try {
        const products = ApiService.getProducts();
        res.status(202).send(products);
    } catch (err) {
        next(err);
    }
});

//  API for create a product
app.post('/api/product', (req, res, next) => {
    const { product } = req.body;

    try {
        ApiService.createProduct(product);
        res.status(201).send();
    } catch (err) {
        next(err);
    }
});

//  API for update a product
app.put('/api/product', (req, res, next) => {
    const { product } = req.body;

    try {
        const updatedProduct = ApiService.updateProduct(product);
        res.status(200).send(updatedProduct);
    } catch (err) {
        next(err);
    }
});

//  API for update a product
app.delete('/api/product', (req, res, next) => {
    const { product } = req.body;

    try {
        ApiService.deleteProduct(product);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

// middleware for error
app.use((err, req, res, next) => {
    const defaultMsg = 'Internal server error';
    console.log('Error received with message: ', err.message || defaultMsg);
    res.status(err.status || 500).send({message: err.message  || defaultMsg })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    ApiService.prePopulateData();
    console.log(`Server started on port ${port}`);
});