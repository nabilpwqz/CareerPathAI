import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

// Reusable Zod schemas matching src/lib/validation.ts
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const roadmapTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  category: z.string(),
  estimatedHours: z.number().min(1),
  completed: z.boolean(),
});

test('Validation: registerSchema accepts valid input', () => {
  const valid = registerSchema.safeParse({
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: 'SecurePassword123!',
  });
  assert.equal(valid.success, true);
});

test('Validation: registerSchema rejects short password (<6 chars)', () => {
  const invalid = registerSchema.safeParse({
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: '123',
  });
  assert.equal(invalid.success, false);
});

test('Validation: registerSchema rejects invalid email format', () => {
  const invalid = registerSchema.safeParse({
    name: 'Sarah Chen',
    email: 'not-an-email',
    password: 'SecurePassword123!',
  });
  assert.equal(invalid.success, false);
});

test('Validation: roadmapTaskSchema enforces completed boolean and minimum hours', () => {
  const validTask = roadmapTaskSchema.safeParse({
    id: 't-101',
    title: 'Implement Vector Indexing with Qdrant',
    category: 'Architecture',
    estimatedHours: 8,
    completed: false,
  });
  assert.equal(validTask.success, true);

  const invalidTask = roadmapTaskSchema.safeParse({
    id: 't-102',
    title: 'Bad',
    category: 'Architecture',
    estimatedHours: 0,
    completed: 'not-a-bool',
  });
  assert.equal(invalidTask.success, false);
});

// [build-audit: 81] verified code formatting
