const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vy8vv76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const touristsSpotCollection = client
      .db("travelDB")
      .collection("touristsSpot");
    const countryCollection = client.db("travelDB").collection("country");

    app.get("/touristsSpot", async (req, res) => {
      const cursor = touristsSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/touristsSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.findOne(query);
      res.send(result);
    });


    app.post("/touristsSpot", async (req, res) => {
      const newTouristsSpot = req.body;
      const result = await touristsSpotCollection.insertOne(newTouristsSpot);
      res.send(result);
    });

    app.put("/touristsSpot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTouristsSpot = req.body;

      const touristsSpot = {
        $set: {
          image: updatedTouristsSpot.image,
          tourists_spot_name: updatedTouristsSpot.tourists_spot_name,
          country_Name: updatedTouristsSpot.country_Name,
          location: updatedTouristsSpot.location,
          short_description: updatedTouristsSpot.short_description,
          average_cost: updatedTouristsSpot.average_cost,
          seasonality: updatedTouristsSpot.seasonality,
          travel_time: updatedTouristsSpot.travel_time,
          totalVisitorsPerYear: updatedTouristsSpot.totalVisitorsPerYear,

        },
      };

      const result = await touristsSpotCollection.updateOne(filter, touristsSpot, options);
      res.send(result);
    });

    app.delete("/touristsSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/countries", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/country", async (req, res) => {
      const newCountry = req.body;
      console.log(newCountry);
      const result = await countryCollection.insertOne(newCountry);
      res.send(result);
    });
    app.get("/country/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await countryCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful  connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("travel spot is Running");
});

app.listen(port, () => {
  console.log("travel server is running ....");
});
