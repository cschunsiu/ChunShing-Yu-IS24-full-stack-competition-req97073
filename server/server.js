const express = require('express');
const path = require('path');
const cors = require('cors');
const { isNil } = require('lodash');
const bodyParser = require('body-parser');
const ApiService = require('./service');
const { swaggerSpec } = require('./util/swagger-config');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// get endpoint to return webapp
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// swagger UI route
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     description: Responds if server is up and running
 *     responses:
 *       200:
 *         description: Returns a message with uptime and date.
 */
app.get('/api/health', (req, res, next) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }

    res.status(200).send(data);
});

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     description: Get a single product by productId
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: ID of product
 *        required: true
 *     responses:
 *       202:
 *         description: Return requested product.
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Product Not Found
 *       409:
 *         description: Duplicate products found with the same productId
 */
app.get('/api/product/:productId', (req, res, next) => {
    const { productId } = req.params;

    try {
        const product = ApiService.getProductById(parseInt(productId));
        res.status(202).send(product);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     description: Get a list of products
 *     responses:
 *       202:
 *         description: Return requested list of products
 */
app.get('/api/products', (req, res, next) => {
    try {
        const products = ApiService.getProducts();
        res.status(202).send(products);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/products/search:
 *   post:
 *     description: Perform search by two types (Scrum Master Name or Developer name)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: desire type to be search (scrumMasterName or developers)
 *                 example: scrumMasterName
 *               term:
 *                 type: string
 *                 description: search term
 *                 example: Berry Smith
 *     responses:
 *       202:
 *         description: Return requested list of products
 *       400:
 *         description: Bad Request with invalid search type
 */
app.post('/api/products/search', (req, res, next) => {
    const requirements = req.body;

    try {
        const products = ApiService.getProductsBySearchTerm(requirements);
        res.status(202).send(products);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/product:
 *   post:
 *     description: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - productName
 *               - productOwnerName
 *               - developers
 *               - scrumMasterName
 *               - startDate
 *               - methodology
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Name of Product
 *                 example: Thunderbird
 *               productOwnerName:
 *                 type: string
 *                 description: Name of Product Owner
 *                 example: Berry Smith
 *               developers:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Berry Smith
 *                   maximum: 5
 *               scrumMasterName:
 *                 type: string
 *                 description: Name of Scrum Master
 *                 example: Berry Smith
 *               startDate:
 *                 type: string
 *                 description: date to start
 *                 example: '2022/01/01'
 *               methodology:
 *                 type: string
 *                 description: Agile or Waterfall
 *                 example: 'Agile'
 *     responses:
 *       202:
 *         description: Success
 *       400:
 *         description: Bad Request with invalid body object
 */
app.post('/api/product', (req, res, next) => {
    const product = req.body;
    try {
        ApiService.createProduct(product);
        res.status(201).send();
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/product:
 *   put:
 *     description: Update a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - productId
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               productName:
 *                 type: string
 *                 description: Name of Product
 *                 example: Thunderbird
 *               productOwnerName:
 *                 type: string
 *                 description: Name of Product Owner
 *                 example: Berry Smith
 *               developers:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Berry Smith
 *                   maximum: 5
 *               scrumMasterName:
 *                 type: string
 *                 description: Name of Scrum Master
 *                 example: Berry Smith
 *               startDate:
 *                 type: string
 *                 description: date to start
 *                 example: '2022/01/01'
 *               methodology:
 *                 type: string
 *                 description: Agile or Waterfall
 *                 example: 'Agile'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Product Not Found
 *       400:
 *         description: Bad Request with invalid body object
 */
app.put('/api/product', (req, res, next) => {
    const product = req.body;
    try {
        const updatedProduct = ApiService.updateProduct(product);
        res.status(200).send(updatedProduct);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/product:
 *   delete:
 *     description: Delete a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - productId
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Success
 *       404:
 *         description: Product Not Found
 *       400:
 *         description: Bad Request with invalid body object
 */
app.delete('/api/product', (req, res, next) => {
    const product = req.body;

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
    res.status(err.status || 500).send({message: !isNil(err.status) ? err.message  : defaultMsg })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    ApiService.prePopulateData();
    console.log(`Server started on port ${port}`);
});