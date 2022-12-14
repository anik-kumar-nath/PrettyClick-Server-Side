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
            const pageNo = req.query.page;
            const pageItems = req.query.size;
            // console.log(req.query)
            const query = {};
            const cursor = serviceCollection.find(query);
            const count = await serviceCollection.countDocuments(query)
            const services = await cursor.skip(pageNo * 1 * pageItems * 1).limit(pageItems * 1).toArray();
            res.send({ count, services });
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
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
        app.get('/servicereviews', async (req, res) => {
            const query = { serviceId: req.query.serviceid };
            const cursor = reviewCollection.find(query).sort({ date: -1 });
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/userreviews', async (req, res) => {
            const query = { email: req.query.userEmail };
            const cursor = reviewCollection.find(query).sort({ date: -1 });
            const count = await reviewCollection.countDocuments(query);
            const users = await cursor.toArray();
            res.send({ users, count });
        })
        app.post('/review', async (req, res) => {
            const user = req.body;
            user.date = new Date();
            const result = await reviewCollection.insertOne(user);
            res.send(result);
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const updatedUser = req.body;
            const option = { upsert: true };
            const date = new Date();
            const updatedUserOperation = {
                $set: {
                    reviewText: updatedUser.comment,
                    date: date
                }
            }
            const result = await reviewCollection.updateOne(query, updatedUserOperation, option)
            res.send(result)
        })

    } catch (error) {

    }
}
run().catch(err => console.log(err));