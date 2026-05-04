const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

/**
 * Controller for handling user registration
 */
class RegisterController {
  /**
   * Path to the user data file
   */
  static USER_DATA_FILE = path.join(__dirname, '..', 'auth_user.json');

  /**
   * Registers a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async register(req, res) {
    try {
      // Extract user data from request body
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Load existing users from file
      let users = [];
      try {
        const data = await fs.readFile(RegisterController.USER_DATA_FILE, 'utf8');
        users = JSON.parse(data);
      } catch (error) {
        // If file doesn't exist or is empty, start with empty array
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      // Check if email already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Hash the password using bcrypt with 10 salt rounds
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate a new unique user ID
      const newUserId = RegisterController.generateUniqueId(users);

      // Create new user object
      const newUser = {
        id: newUserId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        registeredAt: new Date().toISOString()
      };

      // Add new user to users array
      users.push(newUser);

      // Save updated users array to file
      await fs.writeFile(RegisterController.USER_DATA_FILE, JSON.stringify(users, null, 2));

      // Return success response (without password)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          registeredAt: newUser.registeredAt
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  }

  /**
   * Generates a unique user ID
   * @param {Array} existingUsers - Array of existing users
   * @returns {string} - Unique user ID
   */
  static generateUniqueId(existingUsers) {
    // Find the highest existing ID number
    let maxId = 0;
    existingUsers.forEach(user => {
      const idNum = parseInt(user.id.replace('user_', ''));
      if (idNum > maxId) {
        maxId = idNum;
      }
    });

    // Generate new ID
    return `user_${maxId + 1}`;
  }
}

module.exports = RegisterController;