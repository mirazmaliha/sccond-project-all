const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const PORT = process.env.PORT || 8080;
const {ObjectId} = require('mongodb');

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
    const RegistrationCollection = client.db("sccond-project").collection("registrations");
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
 app.post('/registrationEvent', (req, res) => {
  const {id, email, name, date, organize } = req.body;

  EventCollection.findOne({_id:new ObjectId(id)})
  .then(event => {
    if(!event){
      return res.status(404).send({message:"Event not found"});
    }

    const registrationData = {
      eventId: id,
      eventTitle: event.title,
      name,
      email,
      date,
      organize,
    };

    RegistrationCollection.insertOne(registrationData)
    .then(result => {
      console.log('Registration inserted successfully');
      res.send({success:true, result});
    })
    .catch(err => {
      console.error('Insert error:', err);
      res.status(500).send({success:false, message:'Insert failed'});
    })
  })
  .catch(err => {
    console.error('Find error:', err);
    res.status(500).send({success:false, message:'Error finding event'});
  });
});
app.get('/myevents', (req, res)=> {
  const email = req.query.email?.trim();
  console.log(email)
  RegistrationCollection.find({email:email}).toArray()
  .then((document) => {
    res.send(document)
  }).catch(err => {
    res.status(500)
  })
})
app.delete('/myeventDelete/:id', (req, res)=> {
  const id = req.params.id;
  RegistrationCollection.deleteOne({_id:new ObjectId(id)})
  .then(result => {
    res.json({meassage:'successfully deleted'})
  })
  .catch(err => {
    res.status(500)
  })
})

    app.get('/', (req, res)=> {
      res.json({meassage:'welcome'})
    })
   
    // Start server after DB connected
    app.listen(PORT, () => {
      console.log("🚀 Server is running on port 8080");
    });
  })
  .catch(error => {
    console.error("MongoDB connection error:", error);
  });