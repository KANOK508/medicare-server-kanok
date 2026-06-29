// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const { connectDB } = require('./config/db');

// // const authRoutes = require('./routes/auth');
// // const userRoutes = require('./routes/users');
// // const doctorRoutes = require('./routes/doctors');
// // const appointmentRoutes = require('./routes/appointments');
// // const paymentRoutes = require('./routes/payments');
// // const reviewRoutes = require('./routes/reviews');
// // const prescriptionRoutes = require('./routes/prescriptions');

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // ── Middleware ──────────────────────────────────────────────────────────────
// // app.use(cors({
// //   origin: [
// //     'http://localhost:5173',
// //     'http://localhost:5174',
// //     process.env.CLIENT_URL,
// //   ].filter(Boolean),
// //   credentials: true,
// // }));
// // app.use(express.json());

// // // ── Routes ──────────────────────────────────────────────────────────────────
// // app.use('/api/auth', authRoutes);
// // app.use('/api/users', userRoutes);
// // app.use('/api/doctors', doctorRoutes);
// // app.use('/api/appointments', appointmentRoutes);
// // app.use('/api/payments', paymentRoutes);
// // app.use('/api/reviews', reviewRoutes);
// // app.use('/api/prescriptions', prescriptionRoutes);
// // console.log("Checking environment variable:", process.env.PORT);
// // app.get('/', (req, res) => {
// //   res.json({ message: '🏥 MediCare Connect API is running', status: 'OK' });
// // });

// // // ── 404 Handler ─────────────────────────────────────────────────────────────
// // app.use((req, res) => {
// //   res.status(404).json({ message: 'Route not found' });
// // });

// // // ── Start ────────────────────────────────────────────────────────────────────
// // connectDB().then(() => {
// //   app.listen(PORT, () => {
// //     console.log(`🚀 Server running on http://localhost:${PORT}`);
// //   });
// // });




// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { connectDB } = require('./config/db');

// // Route Imports
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const doctorRoutes = require('./routes/doctors');
// const appointmentRoutes = require('./routes/appointments');
// const paymentRoutes = require('./routes/payments');
// const reviewRoutes = require('./routes/reviews');
// const prescriptionRoutes = require('./routes/prescriptions');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ── Middleware ──────────────────────────────────────────────────────────────
// // This configuration allows both local development and production requests
// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://localhost:5174',
//   process.env.CLIENT_URL // Ensure this is set in Vercel Dashboard
// ].filter(Boolean);

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
// }));

// app.use(express.json());

// // ── Routes ──────────────────────────────────────────────────────────────────
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/prescriptions', prescriptionRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: '🏥 MediCare Connect API is running', status: 'OK' });
// });

// // ── 404 Handler ─────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // ── Start Server ────────────────────────────────────────────────────────────
// // In Vercel, we export the app for the serverless function, 
// // but we keep the listen() call for local development.
// if (process.env.NODE_ENV !== 'production') {
//   connectDB().then(() => {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   });
// }

// module.exports = app;


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
 
// Route Imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const prescriptionRoutes = require('./routes/prescriptions');
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// ── Middleware ──────────────────────────────────────────────────────────────
// This configuration allows both local development and production requests.
// NOTE: 'https://medicare-client-kanok.vercel.app' is hardcoded as a safety
// net so CORS still works even if CLIENT_URL isn't set in the Vercel
// dashboard. Set CLIENT_URL there too so this stays correct if your client
// domain ever changes.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://medicare-client-kanok.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);
 
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
 
app.use(express.json());
 
// ── Database connection ──────────────────────────────────────────────────────
// IMPORTANT FIX: the previous code only called connectDB() when
// `process.env.NODE_ENV !== 'production'`. Vercel always sets
// NODE_ENV=production for deployed functions, so connectDB() was NEVER
// being called in production — every route that used getDB() was throwing
// "DB not initialized", which is why the deployed client got no data.
//
// connectDB() (see config/db.js) is now idempotent/cached, so it's safe to
// kick off here at module load time. On Vercel this module is reused across
// "warm" invocations of the same function instance, so this only does real
// connection work once per instance and resolves instantly after that.
let dbReady = connectDB();
 
app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    // Allow a retry on the next request instead of permanently wedging
    // this function instance if the first connection attempt failed.
    dbReady = connectDB();
    res.status(503).json({ message: 'Database connection failed', error: err.message });
  }
});
 
// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
 
app.get('/', (req, res) => {
  res.json({ message: '🏥 MediCare Connect API is running', status: 'OK' });
});
 
// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
 
// ── Start Server ────────────────────────────────────────────────────────────
// `require.main === module` is true only when you run `node index.js`
// directly (local dev). When Vercel imports this file as a serverless
// function, it's `require`d as a module, so app.listen() is correctly
// skipped there — this check is more reliable than the old NODE_ENV check.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
 
module.exports = app;
 