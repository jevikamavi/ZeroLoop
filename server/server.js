require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const pickupRoutes = require('./routes/pickups');
const reportRoutes = require('./routes/reports');
const recyclingRoutes = require('./routes/recycling');
const rewardRoutes = require('./routes/rewards');
const accountRoutes = require('./routes/account');
const marketplaceRoutes = require('./routes/marketplace');
const greenServiceRoutes = require('./routes/greenServices');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'zeroloop-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/green-services', greenServiceRoutes);
app.use('/api/chat', chatRoutes);


app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));


//
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[ZeroLoop API] running on port ${PORT}`));
});
