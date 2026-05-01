import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server/ directory regardless of where node is invoked from
dotenv.config({ path: join(__dirname, '.env') });

import app from './app.js';
import connectDB from './config/db.js';

const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0'; // Bind to all interfaces — required for Railway/Docker

connectDB();

// Explicitly bind to 0.0.0.0 so Railway's proxy can reach the container
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
