import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in .env. Copy .env.example -> .env and fill values.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Ping succeeded — connection OK');
  } catch (err) {
    console.error('Ping failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    await client.close();
  }
}

run();
