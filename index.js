const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('BiyeBari server is running');
})

app.listen(port, () => {
    console.log(`BiyeBari server server is running on PORT: ${port}`);
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbl5b3c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});





async function run() {
    try {
        // await client.connect();

        const userCollection = client.db('biyebari').collection('users');



        // Create userKey & set to browser cookie
        app.post('/jwt', async (req, res) => {

            try {
                const user = req.body;
                const userKey = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '12h' })

                res.cookie('userKey', userKey, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                }).send({ success: true })

            } catch (error) {
                console.log(error.message)
            }

        })
        // Create userKey & set to browser cookie End





        // Store a user 
        app.post('/store-users', async (req, res) => {
            try {
                const newUser = req.body;

                const query = { email: newUser.email };
                const existingUser = await userCollection.findOne(query);
                if (existingUser) {
                    return res.send({ message: 'user already exists', insertedId: null });
                }

                const result = await userCollection.insertOne(newUser);
                res.send(result)
            } catch (err) {
                console.log(err.message)
            }
        })
        //Store a user End













        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.log);


