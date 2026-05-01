import { createRequire } from 'module';

// ── crypto polyfill ───────────────────────────────────────────────────────────
// MongoDB Driver 6 (used by Mongoose 9) calls globalThis.crypto internally.
// This global only exists natively in Node 20+.
// On Node 18, we back-fill it from the built-in 'node:crypto' module so the
// driver can use webcrypto without crashing.
if (!globalThis.crypto) {
  const require = createRequire(import.meta.url);
  const { webcrypto } = require('node:crypto');
  globalThis.crypto = webcrypto;
}

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error(
        'MONGO_URI environment variable is not set. ' +
        'Add it in Railway → Variables tab.'
      );
    }

    console.log('Connecting to MongoDB...');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log(`✅ MongoDB Connected — host: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;