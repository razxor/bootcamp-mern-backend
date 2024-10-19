const express = require('express');
const cors = require('cors');
const app = express()

const port = process.env.port || 3000

app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');

const uri = "mongodb+srv://razdoict:ZWQ0ikd1XWtT7b4z@cluster0.3kzlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const userCol = client.db('bootcamp_online_shop').collection('users')

        // API - Manage Users       
        app.post('/api/user/add', async (req, res) => {
            const userData = req.body;
            const result = await userCol.insertOne(userData)
            res.send(result)
        })

        app.get('/api/users', async (req, res) => {
            const data = await userCol.find().toArray();
            res.send(data);
        })

        app.put('/api/user', async (req, res) => {            
            const result = await userCol.updateOne({_id : new ObjectId(req.body.id)}, {$set:{name:req.body.name}})           
            res.send(result);
        })
        app.delete('/api/user/:id', async (req, res) => {            
            const result = await userCol.deleteOne({_id: new ObjectId(req.params.id)})
            res.send(result)
        })
        // end API


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to my site');
})


// app.get('/api/courses/:id', (req, res) => {
//     let id = req.params.id
//     let data = courses.find((item) => {
//         return item.course_id == id
//     })
//     res.send(data);
// })

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

