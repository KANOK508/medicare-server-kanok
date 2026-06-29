// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { connectDB } = require('./config/db');

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
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:5174',
//     process.env.CLIENT_URL,
//   ].filter(Boolean),
//   credentials: true,
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
// console.log("Checking environment variable:", process.env.PORT);
// app.get('/', (req, res) => {
//   res.json({ message: '🏥 MediCare Connect API is running', status: 'OK' });
// });

// // ── 404 Handler ─────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // ── Start ────────────────────────────────────────────────────────────────────
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// });




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
// This configuration allows both local development and production requests
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL // Ensure this is set in Vercel Dashboard
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(express.json());

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
// In Vercel, we export the app for the serverless function, 
// but we keep the listen() call for local development.
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;