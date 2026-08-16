const mongoose = require('mongoose');
const dns = require('dns');

// setting dns server to avoid dns resolution issues in some devices
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);


async function connectDB() {

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
}


module.exports = connectDB;
