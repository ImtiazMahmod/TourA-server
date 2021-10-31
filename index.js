const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

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
        const booksCollection = database.collection("books");


        ///Add Tour
        app.post('/addTour', async (req, res) => {
            const newTour = req.body
            const result = await packagesCollection.insertOne(newTour);
            res.json(result)
        })
        
        //load all tour
        app.get('/allTour', async (req, res) => {
            const allTour = await packagesCollection.find({}).toArray()
            res.send(allTour)
        })

        //load specific tour
        app.get('/tour/:id', async (req, res) => {
            const id = req.params.id
            const tour = await packagesCollection.findOne({ _id: ObjectId(id) })
            res.send(tour)
        })

        ///book tour
        app.post('/bookTour', async (req, res) => {
            const newBook = req.body
            const result = await booksCollection.insertOne(newBook)
            res.json(result)
        })

        //load user matched tours
        app.get('/myTours/:email', async (req, res) => {
            const email = req.params.email
            const myTours = await booksCollection.find({ email: email }).toArray()
            res.send(myTours)
        })

        ///delete myTour
        app.delete('/deleteMyTour/:email', async (req, res) => {
            const email= req.params.email
            const tourDeleted = await booksCollection.deleteOne({ email: email })
            res.send(tourDeleted)
        })
        
        ///update tour status
        app.put('/updateTour/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const filter = { _id:ObjectId( id )}
            const updateDoc = {
                $set: {
                        status : 'approved'
                    }
            }
            const options = { upsert: true }
            
            const statusUpdated = await booksCollection.updateOne(filter, updateDoc, options)
            res.json(statusUpdated)
        })

        ///manage all orders
        app.get('/manageOrders', async (req, res) => {
            const cursor = booksCollection.find({})
            const manageOrders = await cursor.toArray()

            res.send(manageOrders)
        })

        ///delete order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id
            const orderDeleted = await booksCollection.deleteOne({ _id: ObjectId(id) })
            res.send(orderDeleted)
        })

        //delete All Orders
        app.delete('/deleteAllOrders', async (req, res) => {
            const ordersDeleted = await booksCollection.deleteMany({})
            res.send(ordersDeleted)
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
})

app.listen(port, () => {
    console.log("port connected",port);
})