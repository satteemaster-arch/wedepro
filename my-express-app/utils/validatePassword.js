/**
 * Validates a password based on security requirements
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid boolean and error message if invalid
 */
function validatePassword(password) {
  // Check if password is at least 8 characters long
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    };
  }

  // Check if password contains at least one uppercase letter
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter'
    };
  }

  // Check if password contains at least one special character from the allowed list
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  if (!hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character: ! @ # $ % ^ & *'
    };
  }

  // If all checks pass, password is valid
  return {
    isValid: true,
    error: null
  };
}

// Export the function for use in other files
module.exports = validatePassword;