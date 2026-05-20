const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();
const uri = process.env.MONGODB_URI;

const app = express();

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const db = client.db('petAdoption');
    const petAdoptionCollection = db.collection('pets');
    const adoptionCollection = db.collection('adoptionRequests');

    // featured
    app.get('/featured', async (req, res) => {
      const result = await petAdoptionCollection.find().limit(6).toArray();
      res.json(result);
    });

    app.get('/allPets', async (req, res) => {
      const result = await petAdoptionCollection.find().toArray();
      res.json(result);
    });

    app.post('/allPets', async (req, res) => {
      const allPetsInfo = req.body;
      const result = await petAdoptionCollection.insertOne(allPetsInfo);
      res.json(result);
    });
    // details
    app.get('/allPets/:id', async (req, res) => {
      const { id } = req.params;
      const result = await petAdoptionCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });
    // edit
    app.patch('/allPets/:id', async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await petAdoptionCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });
    // delete
    app.delete('/allPets/:id', async (req, res) => {
      const { id } = req.params;
      const result = await petAdoptionCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    // adoption request
    app.post('/adoption-request', async (req, res) => {
      const adoptionInfo = req.body;
      const result = await adoptionCollection.insertOne(adoptionInfo);
      res.json(result);
    });

    app.get('/adoption-request', async (req, res) => {
      const result = await adoptionCollection.find().toArray();
      res.json(result);
    });
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is Running fine!');
});

app.listen(PORT, () => {
  console.log(`Server is running from ${PORT}`);
});
