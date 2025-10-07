import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// MongoDB connection via environment variable
const uri = process.env.MONGODB_URI || '';
if (!uri) console.warn('MONGODB_URI is not set — the app will start but DB operations will fail until it is configured.');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let postsCollection = null;
async function initDb() {
  if (!uri) return;
  await client.connect();
  const dbName = process.env.MONGODB_DBNAME || 'blog';
  const db = client.db(dbName);
  postsCollection = db.collection('posts');
  console.log(`Connected to MongoDB (${dbName})`);
}
initDb().catch(err => console.error('DB init error:', err));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'))
})

// endpoints...middlewares...apis? 

// send an html file
app.get('/connor', (req, res) => {
 
  res.sendFile(join(__dirname, 'public', 'connor.html')) 

})

app.get('/api/connor', (req, res) => {
  // res.send('connor. <a href="/">home</a>')
  const myVar = 'Hello from server!';
  res.json({ myVar });
})

app.get('/api/query', (req, res) => {

  //console.log("client request with query param:", req.query.name); 
  const name = req.query.name; 
  res.json({"message": `Hi, ${name}. How are you?`});

  // receivedData.queries.push(req.query.name || 'Guest');
  // const name = req.query.name || 'Guest';
  // res.json({ message: `Hello, ${name} (from query param)` });
});

app.get('/api/url/:iaddasfsd', (req, res) => {

  console.log("client request with URL param:", req.params.iaddasfsd); 
  // const name = req.query.name; 
  // res.json({"message": `Hi, ${name}. How are you?`});

});


app.get('/api/body', (req, res) => {

  console.log("client request with POST body:", req.query); 
  // const name = req.body.name; 
  // res.json({"message": `Hi, ${name}. How are you?`});

});


// -- Posts REST API (CRUD) -------------------------------------------------
app.get('/api/connor', (req, res) => {
  res.json({ app: 'Connor Blog SPA', author: process.env.APP_AUTHOR || 'cmoore322' });
});

app.post('/api/posts', async (req, res) => {
  if (!postsCollection) return res.status(500).json({ error: 'DB not initialized' });
  const { title, body, author } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });
  const doc = { title, body, author: author || 'Anonymous', createdAt: new Date() };
  try {
    const r = await postsCollection.insertOne(doc);
    res.status(201).json({ _id: r.insertedId, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'insert failed' });
  }
});

app.get('/api/posts', async (req, res) => {
  if (!postsCollection) return res.status(500).json({ error: 'DB not initialized' });
  try {
    const posts = await postsCollection.find().sort({ createdAt: -1 }).toArray();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'read failed' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  if (!postsCollection) return res.status(500).json({ error: 'DB not initialized' });
  try {
    const _id = new ObjectId(req.params.id);
    const post = await postsCollection.findOne({ _id });
    if (!post) return res.status(404).json({ error: 'not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  if (!postsCollection) return res.status(500).json({ error: 'DB not initialized' });
  try {
    const _id = new ObjectId(req.params.id);
    const { title, body, author } = req.body;
    const update = { $set: { updatedAt: new Date() } };
    if (title) update.$set.title = title;
    if (body) update.$set.body = body;
    if (author) update.$set.author = author;
    const r = await postsCollection.findOneAndUpdate({ _id }, update, { returnDocument: 'after' });
    if (!r.value) return res.status(404).json({ error: 'not found' });
    res.json(r.value);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id or update failed' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  if (!postsCollection) return res.status(500).json({ error: 'DB not initialized' });
  try {
    const _id = new ObjectId(req.params.id);
    const r = await postsCollection.deleteOne({ _id });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})