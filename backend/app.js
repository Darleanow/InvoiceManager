/**
 * @file app.js
 * @module app
 * @description Initializes the Express application, configures middleware, and sets up routes for the API.
 */

const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();

/**
 * Enables Cross-Origin Resource Sharing (CORS) for the Express application.
 * This allows the server to handle requests from different origins.
 *
 * @function
 */
app.use(cors());

/**
 * Adds middleware to parse incoming requests with JSON payloads.
 * This allows the server to handle `application/json` requests.
 *
 * @function
 */
app.use(express.json());

/**
 * Sets up the main API routes under the `/api` path.
 *
 * @function
 * @memberof module:app
 * @description All routes are defined in the `routes/index.js` file, and are mounted on the `/api` path for the application.
 */
app.use('/api', routes);

module.exports = app;
