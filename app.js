const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json());

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'Ecommerce API Information',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.send(`Server is running....`);
})

// Example routes
app.use("/api", require("./routes/sampleRoutes"));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
});