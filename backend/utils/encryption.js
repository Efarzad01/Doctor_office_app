const crypto = require('crypto');

/**
 * Encryption utility for protecting sensitive patient data
 * Uses AES-256-CBC encryption algorithm
 */

/**
 * Encrypts sensitive text data
 * @param {string} text - The plain text to encrypt
 * @returns {string} - The encrypted text in format: iv:encryptedData
 * @throws {Error} - If encryption fails or environment variables are missing
 *
 * SECURITY: Uses randomly generated IV for each encryption operation
 * to prevent pattern detection and ensure semantic security
 */
function encrypt(text) {
  try {
    // Validate input
    if (!text || text === null || text === undefined) {
      return text;
    }

    // Validate environment variables
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY must be set in environment variables');
    }

    // Convert text to string if it isn't already
    const textToEncrypt = String(text);

    // Create encryption key from environment variable (must be 32 bytes for AES-256)
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

    // Validate key length
    if (key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
    }

    // SECURITY FIX: Generate a random IV for EACH encryption operation
    // CRITICAL: Never reuse IVs with the same key - this prevents pattern detection
    const iv = crypto.randomBytes(16);

    // Create cipher using AES-256-CBC algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the text
    let encrypted = cipher.update(textToEncrypt, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return encrypted data with IV prepended (format: iv:encryptedData)
    // Each encryption will have a different IV, ensuring semantic security
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error(`Failed to encrypt data: ${error.message}`);
  }
}

/**
 * Decrypts encrypted text data
 * @param {string} text - The encrypted text in format: iv:encryptedData
 * @returns {string} - The decrypted plain text
 * @throws {Error} - If decryption fails or data format is invalid
 */
function decrypt(text) {
  try {
    // Validate input
    if (!text || text === null || text === undefined) {
      return text;
    }

    // If text doesn't contain the IV separator, it might not be encrypted
    if (!text.includes(':')) {
      // Return as-is (might be legacy unencrypted data)
      return text;
    }

    // Validate environment variables
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY must be set in environment variables');
    }

    // Split the IV and encrypted data
    const parts = text.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }

    const ivFromData = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];

    // Create decryption key from environment variable
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

    // Validate key length
    if (key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
    }

    // Create decipher using AES-256-CBC algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivFromData);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}

/**
 * Generates a random encryption key (32 bytes for AES-256)
 * Use this function to generate keys for your .env file
 * @returns {string} - A random 32-byte key in hex format
 */
function generateKey() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a random initialization vector (16 bytes for AES)
 * Use this function to generate IVs for your .env file
 * @returns {string} - A random 16-byte IV in hex format
 */
function generateIV() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  encrypt,
  decrypt,
  generateKey,
  generateIV
};
