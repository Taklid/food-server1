const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// ✅ Allow specific origins for CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://food-project1-53e87.firebaseapp.com'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nndk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const menuCollection = client.db('foodShop').collection('menu1');
        const reviewCollection = client.db('foodShop').collection('reviews1');
        const cartCollection = client.db('foodShop').collection('foodcarts');

        // 🟢 Get Menu
        app.get('/menu1', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        });

        // 🟢 Get Reviews
        app.get('/reviews1', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        });

        // 🟢 Add to Cart
        app.post('/foodcarts', async (req, res) => {
            const cartItem = req.body;
            const result = await cartCollection.insertOne(cartItem);
            res.json({ insertedId: result.insertedId });
        });

        // 🟢 Get Cart by Email
        app.get('/foodcarts', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("✅ Successfully connected to MongoDB!");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);

// 🟢 Default route
app.get('/', (req, res) => {
    res.send('🍔 Food project running');
});

// ✅ Listen on 0.0.0.0 for Vercel compatibility
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${port}`);
});
