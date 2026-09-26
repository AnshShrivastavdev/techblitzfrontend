import mongoose from 'mongoose';

export const getMongoUri = () => {
  let uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('example.mongodb.net') || uri.includes('placeholder')) {
    uri = 'mongodb://127.0.0.1:27017/techblitz2';
  }
  return uri;
};

export const connectDB = async () => {
  const connStr = getMongoUri();
  try {
    const conn = await mongoose.connect(connStr, { serverSelectionTimeoutMS: 3000 });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Primary Connection Error (${connStr}): ${error.message}`);
    // If primary failed and was not local, try local mongodb fallback
    if (!connStr.includes('127.0.0.1') && !connStr.includes('localhost')) {
      try {
        console.log('[Database] Attempting fallback to local MongoDB instance...');
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/techblitz2', { serverSelectionTimeoutMS: 2000 });
        console.log(`[Database] Fallback MongoDB Connected: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackErr) {
        console.error(`[Database] Fallback Connection Error: ${fallbackErr.message}`);
      }
    }
    // Disable buffering on failed connection so routes don't hang
    mongoose.set('bufferCommands', false);
    console.warn('[Database] Continuing in standalone API mode. MongoDB connection can be configured via MONGODB_URI in .env');
    return null;
  }
};
