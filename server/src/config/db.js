const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const isLive = process.env.DB_ENV === 'live';
    const uri = isLive ? process.env.MONGODB_URI_LIVE : process.env.MONGODB_URI_LOCAL;
    
    // Fallback to MONGODB_URI if new variables are missing
    const finalUri = uri || process.env.MONGODB_URI;

    const conn = await mongoose.connect(finalUri);
    console.log(`MongoDB Connected: ${conn.connection.host} [${isLive ? 'LIVE (Atlas)' : 'LOCAL'}]`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
