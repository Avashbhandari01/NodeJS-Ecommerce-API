const express = require('express');
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { sequelize, synchronizeModels } = require('./database/dbConfig');

const app = express();
const port = 3000;

// Middleware
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

// Routes
app.get("/", (req, res) => {
    res.send(`Server is running....`);
});

app.use("/api", require("./routes/sampleRoutes"));
app.use("/api", require("./routes/userRoutes"));

// Start the server
async function startServer() {
    try {
        await synchronizeModels(); // Ensure models are synchronized before starting server
        await sequelize.authenticate(); // Test database connection
        console.log('Database connection has been established successfully.');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();