const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mxrfp9v.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const mediaPostCollection = client.db('mediaHack').collection('mediaPost')
        const usersCollection = client.db('mediaHack').collection('users')
        const aboutCollection = client.db('mediaHack').collection('about')

        app.post('/addpost', async(req, res)=> {
            const post = req.body;
            const result = await mediaPostCollection.insertOne(post)
            res.send(result)
        })

        app.get('/popularpost', async(req, res) => {
            const query = {}
            const post = await mediaPostCollection.find(query).sort({like: -1}).limit(3).toArray();
            res.send(post)
        })

        app.get('/allpost', async(req, res)=> {
            const query = {}
            const post = await mediaPostCollection.find(query).sort({like: -1}).toArray()
            res.send(post)
        })

        app.put('/allpost/:id', async(req, res) => {
            const id = req.params.id;
            const like = req.body;
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true}
            const updatedDoc = {
                $set: {
                    like: like.like
                }
            }
            const result = await mediaPostCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.get('/about', async(req, res)=> {
            const query = {}
            const about = await aboutCollection.find(query).toArray()
            res.send(about)
        })
        app.put('/about/:id', async(req, res)=> {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const about = req.body;
            const options = {upsert: true}
            const updatedDoc = {
                $set: {
                    name: about.name,
                    email: about.email,
                    institute: about.institute,
                    address: about.address
                }
            }
            const result = await aboutCollection.updateOne( filter, updatedDoc, options)
            res.send(result)
        })
        app.get('/details/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const post = await mediaPostCollection.findOne(query)
            res.send(post)
        })
        app.post('/users', async(req, res)=> {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.log)

app.get('/', async (req, res) => {
    res.send('mediaHack is running')
})

app.listen(port, () => {
    console.log(`mediaHack port running on ${port}`)
})