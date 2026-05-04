const express = require('express');
const RegisterController = require('../controllers/register');

/**
 * Router for authentication-related routes
 */
const router = express.Router();

/**
 * POST /api/register
 * Registers a new user
 * Request body: { name, email, password }
 * Response: 201 Created on success, 409 Conflict if email exists, 400/500 on error
 */
router.post('/register', RegisterController.register);

// Export the router
module.exports = router;