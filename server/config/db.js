import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are safe defaults for production Atlas connections.
      serverSelectionTimeoutMS: 10000,  // give up after 10 s if Atlas is unreachable
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected ✅  (host: ${conn.connection.host})`);
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    // Exit so Railway/Render restarts the container automatically
    process.exit(1);
  }
};

export default connectDB;