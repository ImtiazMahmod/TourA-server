const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

///database Connection
const uri = `mongodb+srv://${process.env.TOURA_USER}:${process.env.TOURA_PASS}@cluster0.zbwte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("tourZone");

        const packagesCollection = database.collection("packages");


        ///Add Tour
        app.post('/addTour', async (req, res) => {
            const tour = req.body
            const result = await packagesCollection.insertOne(tour);
            res.json(result)
        })

        //load all tour
        app.get('/allTour', async (req, res) => {
            const allTour = await packagesCollection.find({}).toArray()
            res.send(allTour)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);



//check server connection
app.get('/', (req, res) => {
    res.send('welcome tourA')
    console.log('serverOK');
})

app.listen(port, () => {
    console.log("port connected",port);
})