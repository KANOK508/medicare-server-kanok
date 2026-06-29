// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.MONGODB_URI;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// let db;

// async function connectDB() {
//   try {
//     await client.connect();
//     db = client.db('medicareDB');
//     console.log('✅ Connected to MongoDB');
//     return db;
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   }
// }

// function getDB() {
//   if (!db) throw new Error('DB not initialized. Call connectDB() first.');
//   return db;
// }

// module.exports = { connectDB, getDB, client };


const { MongoClient, ServerApiVersion } = require('mongodb');
 
const uri = process.env.MONGODB_URI;
 
if (!uri) {
  // This will make the real problem obvious in Vercel's function logs
  // instead of failing later with a confusing MongoClient error.
  console.error('❌ MONGODB_URI is not set in environment variables');
}
 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
 
let db;
let connectPromise = null;
 
// IMPORTANT FIX: connectDB() is now idempotent. Serverless functions can
// reuse the same module instance across multiple requests ("warm" starts),
// and can even handle requests concurrently, so we cache the in-flight /
// completed connection promise instead of calling client.connect() again
// every time connectDB() is invoked.
function connectDB() {
  if (connectPromise) return connectPromise;
 
  connectPromise = client
    .connect()
    .then(() => {
      db = client.db('medicareDB');
      console.log('✅ Connected to MongoDB');
      return db;
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      connectPromise = null; // allow a retry on the next call
      throw error; // don't crash the whole process — let the caller handle it
    });
 
  return connectPromise;
}
 
function getDB() {
  if (!db) throw new Error('DB not initialized. Call connectDB() first.');
  return db;
}
 
module.exports = { connectDB, getDB, client };
 