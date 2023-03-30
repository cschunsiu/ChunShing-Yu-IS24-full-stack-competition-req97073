const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: '1.0.0',
        },
    },
    apis: ["server.js", "server/server.js"],
}

module.exports = {
    swaggerSpec: swaggerJsdoc(options)
}