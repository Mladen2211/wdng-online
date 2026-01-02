#!/usr/bin/env tsx

import { db } from './db.js';
import bcrypt from 'bcryptjs';

console.log('Seeding database...');

// Create a test user
const hashedPassword = await bcrypt.hash('password123', 10);

try {
  const user = db.createUser('test@example.com', hashedPassword);
  console.log('Created test user:', user.email);
} catch (error) {
  console.error('Error seeding database:', error);
}

console.log('Seeding completed!');