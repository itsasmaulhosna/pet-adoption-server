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

    // my request
    app.get('/adoption-request/:userId', async (req, res) => {
      const { userId } = req.params;
      const result = await adoptionCollection
        .find({ userId: userId })
        .toArray();
      res.json(result);
    });

    // cancle
    app.delete(
      '/adoption-request/:requestId',

      async (req, res) => {
        const { requestId } = req.params;
        const result = await adoptionCollection.deleteOne({
          _id: new ObjectId(requestId),
        });
        res.json(result);
      },
    );

    // approve
    app.patch('/adoption/approve/:petId', async (req, res) => {
      const { petId } = req.params;

      await petAdoptionCollection.updateOne(
        { _id: new ObjectId(petId) },
        {
          $set: {
            isAdopted: true,
            adoptionStatus: 'approved',
          },
        },
      );

      res.json({ success: true });
    });
    // apporve cancle
    app.patch('/adoption/cancel/:petId', async (req, res) => {
      const { petId } = req.params;

      await petAdoptionCollection.updateOne(
        { _id: new ObjectId(petId) },
        {
          $set: {
            isAdopted: false,
            adoptionStatus: 'cancelled',
          },
        },
      );

      res.json({ success: true });
    });
    //request by pet
    app.get('/adoption-request/pet/:petId', async (req, res) => {
      const { petId } = req.params;

      const result = await adoptionCollection.findOne({
        petId: petId,
      });

      res.json(result);
    });
    // request by user
    app.get('/adoption-request/check/:petId/:userId', async (req, res) => {
      const { petId, userId } = req.params;

      const result = await adoptionCollection.findOne({
        petId: petId,
        userId: userId,
      });

      res.json({
        exists: !!result,
        data: result,
      });
    });
    // update status
    app.patch('/adoption-request/status/:requestId', async (req, res) => {
      const { requestId } = req.params;
      const { status } = req.body;

      const result = await adoptionCollection.updateOne(
        { _id: new ObjectId(requestId) },
        {
          $set: { status },
        },
      );

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
