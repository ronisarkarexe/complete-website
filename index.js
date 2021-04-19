const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID
const cors = require('cors')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swaqi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const yogaCollection = client.db("completeWebsite").collection("addServer");
  const cardServicesCollection = client.db("completeWebsite").collection("cardServices");
  const reviewCollection = client.db("completeWebsite").collection("review");
  const addAdminCollection = client.db("completeWebsite").collection("addAdmin");
  
  app.get('/services', (req, res) => {
      yogaCollection.find()
      .toArray((err, document) => {
         res.send(document)
      })
  });
  

  app.post('/addServer', (req, res) => {
      const addServer = req.body;
      console.log('addServer', addServer)
      yogaCollection.insertOne(addServer)
      .then(result => {
         console.log('result', result)
         res.send(result.insertedCount > 0)
      })
  });

  app.post('/addReview', (req, res) => {
     const addReview = req.body;
     reviewCollection.insertOne(addReview)
     .then(result => {
        res.send(result.insertedCount > 0)
     })
  })

  app.post('/addAdminEmail', (req, res) => {
     const admin = req.body;
     const email = req.body.email;

     addAdminCollection.find(email)
     .toArray((err, document) => {
       res.send(document.length > 0)
     })
   
  })

  app.get('/addAdminMail', (req, res) => {
   addAdminCollection.find()
      .toArray((err, document) => {
         res.send(document)
      })
  })


  app.get('/clientReview', (req, res) => {
      reviewCollection.find()
      .toArray((err, document) => {
         res.send(document)
      })
   });

  app.post("/addToServices", (req, res) => {
   const id = req.body.id;
   console.log('hello',req.body.id)
     yogaCollection.find({_id: ObjectId(id)})
     .toArray((err, services) => {
        if(services){
         const cartItem = {
            name: services[0].name,
            price: services[0].price,
            image: services[0].image,
            description: services[0].description,
         }
         cardServicesCollection.insertOne(cartItem)
         .then(result => {
            res.send(result.insertedCount > 0)
         })
        }
     })
  })

  
   app.get('/cartDetails', (req, res) => {
      console.log('hello')
   cardServicesCollection.find()
   .toArray((err, document) => {
      res.send(document)
   })
   });
   

   app.delete('/delete/:id', (req, res) => {
      console.log(req.params.id)
      console.log("Hello world")
      yogaCollection.deleteOne({_id: ObjectId(req.params.id)})
     .then(result => {
        console.log('delete successfully')
        res.json(result.deletedCount > 0)
        
     })
   })

});


app.listen(process.env.PORT || port,)