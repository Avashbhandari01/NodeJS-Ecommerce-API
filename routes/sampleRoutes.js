const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/sample:
 *  get:
 *    summary: Get a list of samples
 *    tags: [Sample]
 *    description: Retrieve a list of samples
 *    responses: 
 *       200:
 *          description: A list of samples.
 */
router.get("/sample", (req, res) => {
    // Your GET method logic here
    res.send("GET method - List of sample")
});

/**
 * @swagger
 * /api/sample:
 *  post:
 *    summary: Create a new sample
 *    tags: [Sample]
 *    description: Create a new sample item.
 *    requestBody: 
 *       required: false
 *       content: 
 *          application/json:
 *          schema:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              class:
 *                  type: string
 *    responses:
 *       200:
 *          description: Successfully created a new sample.
 */
router.post("/sample", (req, res) => {
    // Your POST method logic here
    res.send("POST method - Create a new sample")
});

/**
 * @swagger
 * /api/sample/{id}:
 *  put:
 *    summary: Update a sample by ID
 *    tags: [Sample]
 *    description: Update an existing item sample by ID.
 *    parameters: 
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *          type: string
 *    requestBody: 
 *       required: false
 *       content:
 *          application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              name:
 *               type: string
 *    responses:
 *       200:
 *          description: Successfully updated the sample.
 */
router.put("sample/:id", (req, res) => {
    // Your PUT method logic here
    res.send(`PUT method - Update sample with ID: ${req.params.id}`);
});

/**
 * @swagger
 * /api/sample/{id}:
 *  delete:
 *    summary: Delete a sample by ID
 *    tags: [Sample]
 *    description: Delete an existing sample item by ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: false
 *        schema: 
 *              type: string
 *    responses: 
 *       200:
 *          description: Successfully deleted the sample.
 */
router.delete("sample/:id", (req, res) => {
    // Your DELETE method logic here
    res.send(`DELETE method - Delete sample with ID: ${req.params.id}`);
});

module.exports = router;
