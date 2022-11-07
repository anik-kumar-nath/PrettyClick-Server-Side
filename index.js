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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7wt8nwb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {


    } catch (error) {

    }
}
run().catch(err => console.log(err));