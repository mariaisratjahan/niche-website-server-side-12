const express = require('express')
const app = express()
const ObjectId=require('mongodb').ObjectId;

const cors = require('cors')
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;
// middleware
app.use(cors())
require('dotenv').config()
app.use(express.json())
// mongodb connected
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.un416.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// start here
async function run() {
  try {
    await client.connect();
    const database = client.db("watch_website");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");


    
    
    // post 
    app.post('/products',async (req,res)=>{
      const product=req.body;
      const result = await productsCollection.insertOne(product);
      // console.log(result);
      res.send(result)
    })
     
    app.post('/purchase',async(req,res)=>{
      const purchaseProduct=req.body;
      const result = await ordersCollection.insertOne(purchaseProduct);
      // console.log(result);
      res.send(result)
    })

    app.post('/reviews',async(req,res)=>{
      const review=req.body;
      // console.log(review);
      const result = await reviewsCollection.insertOne(review);
      // console.log(result);
      res.send(result)
    })
    // get reviews
    app.get('/reviews',async(req,res)=>{
      const cursor = reviewsCollection.find({});
      const result=    await cursor.toArray();
      res.send(result)
    })
    app.post('/users',async(req,res)=>{
       const user=req.body;
       const result = await usersCollection.insertOne(user);
       // console.log(result);
       res.send(result)
    })

    // get products
    app.get('/products',async (req,res)=>{
      const cursor = productsCollection.find({});
      const result=    await cursor.toArray();
      res.send(result)

    })
    // get single products
    app.get('/singleProduct/:id',async(req,res)=>{
      const id=req.params.id;
      const query = {_id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product)
    })
      //  myorders
      app.get('/purchase',async(req,res)=>{
        const email=req.query.email;
        // console.log(email)
        const query = { userEmail: email};
        const cursor = ordersCollection.find(query);
        const result= await cursor.toArray();
        res.send(result)
        
      })
      // all orders
      app.get('/purchaseAll',async(req,res)=>{
        const cursor = ordersCollection.find({});
        const result=    await cursor.toArray();
        res.send(result)
        
      })

      app.delete('/purchase/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const result = await ordersCollection.deleteOne({_id: ObjectId(id) });
        res.send(result)
      })

      // delete product
      app.delete('/products/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const result = await productsCollection.deleteOne({_id: ObjectId(id) });
        res.send(result)
      })

      

      // admin 
      app.put("/users/admin",async(req,res)=>{
        const user=req.body;
        const filter={email:user.email};
        // console.log(user);
        const updateDoc={$set:{
          role:'admin'
        }}
        const result=await usersCollection.updateOne(filter,updateDoc)
        res.send(result);
      })

      app.get('/users/:email',async(req,res)=>{
        const email=req.params.email;
        const query={email: email};
        const user=await usersCollection.findOne(query)
        let isAdmin= false;
        if(user?.role === 'admin'){
          isAdmin= true;
        }
        res.json({admin : isAdmin})
      })

   
   
   
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);

// console.log(uri);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})