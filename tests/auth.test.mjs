import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'super-secret-test-jwt-key-minimum-32-chars-long';

test('Auth: bcrypt hashes and verifies password correctly', async () => {
  const plainPassword = 'CandidatePassword2026!';
  const hash = await bcrypt.hash(plainPassword, 10);
  
  assert.notEqual(hash, plainPassword);
  assert.equal(await bcrypt.compare(plainPassword, hash), true);
  assert.equal(await bcrypt.compare('WrongPassword', hash), false);
});

test('Auth: JWT token encodes and decodes user payload accurately', () => {
  const payload = {
    userId: 'usr_sarah_chen',
    email: 'sarah.chen@example.com',
    role: 'user',
  };

  const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '7d' });
  assert.ok(typeof token === 'string' && token.length > 20);

  const decoded = jwt.verify(token, TEST_SECRET);
  assert.equal(decoded.userId, payload.userId);
  assert.equal(decoded.email, payload.email);
  assert.equal(decoded.role, payload.role);
});

test('Auth: JWT rejects token signed with invalid secret', () => {
  const token = jwt.sign({ userId: '123' }, TEST_SECRET);
  assert.throws(() => {
    jwt.verify(token, 'wrong-secret-key-that-should-fail');
  });
});
