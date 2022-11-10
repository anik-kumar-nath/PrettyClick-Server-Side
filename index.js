// const Services = require('./Services.json')

const express = require('express');
const cors = require('cors');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// middle wire
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Test, Running');
});

app.listen(port, () => {
    console.log(`Listening port ${port}`);
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7wt8nwb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('Assignment-11').collection('Services');
        const reviewCollection = client.db('Assignment-11').collection('Reviews');

        app.get('/recentservice', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query).sort({ date: -1 });
            const users = await cursor.toArray();
            res.send(users);
        })

    } catch (error) {

    }
}
run().catch(err => console.log(err));