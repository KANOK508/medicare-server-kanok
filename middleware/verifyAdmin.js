const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const verifyAdmin = async (req, res, next) => {
  const email = req.user?.email;
  if (!email) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ email });
    if (user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = verifyAdmin;
