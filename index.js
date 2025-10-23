const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json())
// MongoDB URI
const uri = "mongodb+srv://organicUser:mirazhosen101Maliha@mongopractis.kqnm9sk.mongodb.net/?retryWrites=true&w=majority&appName=mongoPractis";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    const EventCollection = client.db("sccond-project").collection("events");
    app.post('/AddEvents', (req, res)=> {
        EventCollection.insertOne(req.body)
        .then(result => {
            res.send(result)
            console.log('isert successfully..', req.body)
        }).catch(err => {
            console.log(err)
        })
    })
    app.get('/events', (req, res)=> {
     EventCollection.find({}).toArray()
     .then(result => {
      res.send(result)
     }).catch(err => {
      console.log(err)
     })
    })
    app.get('/', (req, res)=> {
      res.send('welcome')
    })
   
    // Start server after DB connected
    app.listen(5000, () => {
      console.log("🚀 Server is running on port 5000");
    });
  })
  .catch(error => {
    console.error("MongoDB connection error:", error);
  });