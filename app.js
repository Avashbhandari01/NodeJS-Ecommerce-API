const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { sequelize, synchronizeModels } = require('./database/dbConfig');
const { User } = require('./database/dbConfig');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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
        components: {
            securitySchemes: {
                Bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js'],
    // Add security requirement for specific routes using a function
    security: (path, method) => {
        const securePaths = [
            '/api/create-product',
            '/api/update-product/{productId}',
            '/api/delete-product/{productId}',
        ];

        if (securePaths.includes(path)) {
            return [{ Bearer: [] }]; // Require Bearer token for secure paths
        }

        return undefined; // No security requirement for non-secure paths
    }
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req, res) => {
    res.send(`Server is running....`);
});

app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/productRoutes"));

// Seed admin user
async function seedAdmin() {
    try {
        // Check if admin user already exists
        const admin = await User.findOne({ where: { Roles: 'admin' } });
        if (admin) {
            console.log('Admin user already exists.');
            return;
        }

        var password = process.env.PASSWORD;
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        await User.create({
            FullName: 'Admin User',
            Email: 'admin@gmail.com',
            Password: encryptedPassword,
            Roles: 'admin'
        });

        console.log('Admin user seeded successfully.');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}

// Start the server
async function startServer() {
    try {
        await synchronizeModels(); // Ensure models are synchronized before starting server
        await sequelize.authenticate(); // Test database connection
        console.log('Database connection has been established successfully.');

        await seedAdmin(); // Seed admin user

        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();