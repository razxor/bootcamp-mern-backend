const express = require('express');
const cors = require('cors');
const app = express()
const bcrypt = require('bcrypt');
const salt = 10;
const port = process.env.port || 3000

app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const categoryCol = client.db('bootcamp_online_shop').collection('categories')
        const productCol = client.db('bootcamp_online_shop').collection('products')
        const orderCol = client.db('bootcamp_online_shop').collection('orders')

        // API - Registration     
        app.post('/api/signup', async (req, res) => {
            const userData = req.body;                       
            userData.password = await bcrypt.hash(userData.password, salt)          
            const result = await userCol.insertOne(userData)
            res.send(result)
        })

        app.get('/api/user/:uid', async (req, res) => {            
            const result = await userCol.findOne({ uid: req.params.uid })
            if (result) {
                res.send(result); // Send the result if found
            } else {
                res.status(404).send({ message: 'User not found' }); // Send 404 if no result
            }
        })


        app.post('/api/login', async (req, res) => {
            try {
                const { email, password } = req.body;                                
                const user = await userCol.findOne({ email: email });
                
                if (!user) {
                    return res.status(400).json({ message: 'Invalid email or password' });
                }                
                const isPasswordValid = await bcrypt.compare(password, user.password);
                
                if (!isPasswordValid) {                    
                    return res.status(400).json({ message: 'Invalid email or password' });
                }                
                res.send({
                    message: 'Login successful',
                    user
                })
            } catch (error) {
                console.error('Error during login:', error);
                //return res.status(500).json({ message: 'Internal server error' });
            }
        })

        app.post('/api/order', async (req, res) => {
            let productData =  req.body;                        
            // productData = {...req.body,  product_id : productData._id}
            // delete productData._id;
            console.log('product data ', productData);
            
            const result = await orderCol.insertOne(productData)
            res.send(result)
        })

        // API - Manage Users     
        app.get('/api/user_orders', async (req, res) => {            
            const result = await orderCol.find().toArray();
            res.send(result)
        })  

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
            const {_id, fullname, photo, role} = req.body           
            const result = await userCol.updateOne({ _id: new ObjectId(_id) },
             { $set: 
                {
                    fullname: fullname,
                    photo: photo,
                    role: role,
                } 
            })
            res.send(result);
        })
        app.delete('/api/user/:id', async (req, res) => {
            const result = await userCol.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

        //delete all
        app.get('/api/user_delete_all', async (req, res) => {
            const result = await userCol.deleteMany({})
            res.send(result)
        })

        // ===========manage cat====================/
        // ===========manage product====================/
        app.post('/api/category/add', async (req, res) => {
            const categoryData = req.body;
            const result = await categoryCol.insertOne(categoryData)            
            res.send(result)
        })

        app.get('/api/categories', async (req, res) => {
            const data = await categoryCol.find().toArray();
            res.send(data);
        })

        //delete all
        app.get('/api/cat/all', async (req, res) => {            
            const result = await categoryCol.deleteMany({})
            res.send(result)
        })
        // end cat
        // ===========manage product====================/
        app.post('/api/product/add', async (req, res) => {
            const productData = req.body;
            const result = await productCol.insertOne(productData)
            res.send(result)
        })

        app.get('/api/products', async (req, res) => {
            const data = await productCol.find().toArray();
            res.send(data);
        })

        app.get('/api/product/:id', async (req, res) => {
            try {
              const id = req.params.id;
                                     
              const data =  await productCol.findOne({_id : new ObjectId(id)});
              
              if (!data) {
                return res.status(404).json({ error: 'Product not found' });
              }                       
              res.status(200).send(data);
          
            } catch (error) {
              console.error('Error fetching product:', error);
              res.status(500).json({ error: 'Server error' });
            }
          });

        app.put('/api/product', async (req, res) => {           
            const {_id, bookName,price,category, author, image, totalPages, rating, publisher, yearOfPublishing} = req.body
            const result = await productCol.updateOne({ _id: new ObjectId(_id) }, 
            { $set: { 
                bookName: bookName, 
                price: price, 
                category: category, 

                author: author, 
                image: image, 
                totalPages: totalPages, 
                rating: rating, 
                publisher: publisher, 
                yearOfPublishing: yearOfPublishing, 
            } })
            res.send(result);
        })
        app.delete('/api/product/:id', async (req, res) => {            
            const result = await productCol.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

        app.get('/api/product_all', async (req, res) => {            
            const result = await productCol.deleteMany({})
            res.send(result)
        })

        app.get('/api/product/all', async (req, res) => {
            console.log(req);
            const result = await productCol.deleteMany({})
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

