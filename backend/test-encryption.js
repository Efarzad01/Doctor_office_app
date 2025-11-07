/**
 * Test script to verify encryption/decryption functionality
 * Run with: node backend/test-encryption.js
 */

// Set environment variables for testing
process.env.ENCRYPTION_KEY = '69c84f0ad3119286b6ebfced58f162a78493023239d2f633e8ce7a1671a8d42b';
process.env.ENCRYPTION_IV = '71228289ce065154bdc1b0994d79116a';

const { encrypt, decrypt, generateKey, generateIV } = require('./utils/encryption');

console.log('=== Encryption Test Suite ===\n');

// Test 1: Basic Encryption/Decryption
console.log('Test 1: Basic Encryption/Decryption');
try {
  const originalText = '123-45-6789';
  console.log('Original SSN:', originalText);

  const encrypted = encrypt(originalText);
  console.log('Encrypted:', encrypted);
  console.log('Encrypted format valid:', encrypted.includes(':') ? '✓' : '✗');

  const decrypted = decrypt(encrypted);
  console.log('Decrypted:', decrypted);
  console.log('Match:', originalText === decrypted ? '✓ PASS' : '✗ FAIL');
} catch (error) {
  console.error('✗ FAIL:', error.message);
}

console.log('\n---\n');

// Test 2: Medical History Encryption
console.log('Test 2: Medical History Encryption');
try {
  const medicalHistory = 'Patient has diabetes and hypertension. Allergic to penicillin.';
  console.log('Original:', medicalHistory.substring(0, 50) + '...');

  const encrypted = encrypt(medicalHistory);
  console.log('Encrypted length:', encrypted.length, 'characters');

  const decrypted = decrypt(encrypted);
  console.log('Match:', medicalHistory === decrypted ? '✓ PASS' : '✗ FAIL');
} catch (error) {
  console.error('✗ FAIL:', error.message);
}

console.log('\n---\n');

// Test 3: Insurance ID Encryption
console.log('Test 3: Insurance ID Encryption');
try {
  const insuranceId = 'INS-987654321';
  console.log('Original:', insuranceId);

  const encrypted = encrypt(insuranceId);
  console.log('Encrypted:', encrypted);

  const decrypted = decrypt(encrypted);
  console.log('Match:', insuranceId === decrypted ? '✓ PASS' : '✗ FAIL');
} catch (error) {
  console.error('✗ FAIL:', error.message);
}

console.log('\n---\n');

// Test 4: Null/Empty Values
console.log('Test 4: Null/Empty Values Handling');
try {
  console.log('Null value:', encrypt(null) === null ? '✓ PASS' : '✗ FAIL');
  console.log('Undefined value:', encrypt(undefined) === undefined ? '✓ PASS' : '✗ FAIL');
  console.log('Empty string:', encrypt('') === '' ? '✓ PASS' : '✗ FAIL');
} catch (error) {
  console.error('✗ FAIL:', error.message);
}

console.log('\n---\n');

// Test 5: Key Generation
console.log('Test 5: Key Generation Functions');
try {
  const newKey = generateKey();
  const newIV = generateIV();

  console.log('Generated Key length:', newKey.length, 'chars (should be 64):', newKey.length === 64 ? '✓ PASS' : '✗ FAIL');
  console.log('Generated IV length:', newIV.length, 'chars (should be 32):', newIV.length === 32 ? '✓ PASS' : '✗ FAIL');
  console.log('\nNew Key:', newKey);
  console.log('New IV:', newIV);
} catch (error) {
  console.error('✗ FAIL:', error.message);
}

console.log('\n---\n');

// Test 6: Environment Variables
console.log('Test 6: Environment Variables Check');
console.log('ENCRYPTION_KEY set:', process.env.ENCRYPTION_KEY ? '✓' : '✗ Missing!');
console.log('ENCRYPTION_IV set:', process.env.ENCRYPTION_IV ? '✓' : '✗ Missing!');
if (process.env.ENCRYPTION_KEY) {
  console.log('ENCRYPTION_KEY length:', process.env.ENCRYPTION_KEY.length, 'chars (should be 64)');
}
if (process.env.ENCRYPTION_IV) {
  console.log('ENCRYPTION_IV length:', process.env.ENCRYPTION_IV.length, 'chars (should be 32)');
}

console.log('\n=== Test Suite Complete ===');
