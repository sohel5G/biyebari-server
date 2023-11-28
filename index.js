const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST);

app.use(cors({
    origin: ['http://localhost:5173', 'https://biyebariapp.netlify.app'],
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
        const biodataCollection = client.db('biyebari').collection('biodatas');
        const favoriteCollection = client.db('biyebari').collection('favorites');








        // ------------------------- USER KEY --------------------

        // UserKey Create / remove & set to browser cookie
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

        app.post('/logout', async (req, res) => {
            try {

                const user = req.body;
                res.clearCookie('userKey', {
                    maxAge: 0,
                    secure: true,
                    sameSite: 'none'
                }).send({ success: true })

            } catch (error) {
                console.log(error.message)
            }
        })
        // UserKey Create / remove  & set to browser cookie end

        // ------------------------- USER KEY END --------------------





        // -----------  STRIPE PAYMENT METHOD API------------------
        app.post('/create-stripe-payment-intent', async (req, res) => {
            try {
                const { price } = req.body;
                const amount = parseInt(price * 100);

                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'usd',
                    payment_method_types: ['card']
                });

                res.send({
                    clientSecret: paymentIntent.client_secret
                })

            } catch (err) {
                console.log(err)
            }

        })
        // -----------  STRIPE PAYMENT METHOD API------------------

        // // -----------  POST ITEMS AFTER PAYMENT DONE------------------
        // app.post('/payment-done', async (req, res) => {
        //     try {

        //         const newPayment = req.body;
        //         const paymentResult = await paymentDoneCollection.insertOne(newPayment);

        //         const query = {
        //             _id: {
        //                 $in: newPayment.cartIds.map(id => new ObjectId(id))
        //             }
        //         }
        //         const deleteResult = await cartCollection.deleteMany(query);

        //         res.send({ paymentResult, deleteResult });

        //     } catch (err) {
        //         console.log(err);
        //     }
        // })
        // // -----------  POST ITEMS AFTER PAYMENT DONE END------------------








        // ------------------------- USER --------------------

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

        // Get all user from admin Dashboard 
        app.get('/users/all', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result);
        })
        // Get all user from admin Dashboard End

        // Get  Users for approve premium
        app.get('/users/get-for-approved-premium', async (req, res) => {
            const result = await userCollection.find({ isPro: 'Pending' }).toArray();
            res.send(result);
        })
        // Get  Users for approve premium End

        // Get single user by email 
        app.get('/user/self/:useremail', async (req, res) => {
            try {
                const userEmail = req.params.useremail;
                const query = { email: userEmail };
                const result = await userCollection.findOne(query);
                res.send(result);
            } catch (error) {
                console.log(error)
            }
        })
        // Get single user by email  End


        // User role update  
        app.put('/users/update-role/:useremail', async (req, res) => {
            const userEmail = req.params.useremail;
            const query = { email: userEmail };

            const updateDoc = {
                $set: {
                    userRole: 'Admin',
                },
            };

            const result = await userCollection.updateOne(query, updateDoc);
            res.send(result);
        })
        // User role update End 


        // Request user/biodata for pro 
        app.put('/request/user/to-pro/:useremail', async (req, res) => {
            try {

                const userEmail = req.params.useremail;
                const query = { email: userEmail };

                const getThisUserBiodataId = await biodataCollection.findOne(query);
                const thisUserBiodataId = getThisUserBiodataId?.biodataId;

                const updateDoc = {
                    $set: {
                        isPro: 'Pending',
                        biodataId: thisUserBiodataId
                    },
                };

                const resultForUser = await userCollection.updateOne(query, updateDoc);
                const resultForBiodata = await biodataCollection.updateOne(query, updateDoc);
                const result = { resultForUser, resultForBiodata }
                res.send(result);

            } catch (error) {
                console.log(error);
            }
        })
        // Request user/biodata for pro End

        // Approved user/biodata Premium request 
        app.put('/approved/user/to-premium/:useremail', async (req, res) => {
            try {

                const userEmail = req.params.useremail;
                const query = { email: userEmail };

                const updateDoc = {
                    $set: {
                        isPro: 'Premium',
                    },
                };

                const resultForUser = await userCollection.updateOne(query, updateDoc);
                const resultForBiodata = await biodataCollection.updateOne(query, updateDoc);
                const result = { resultForUser, resultForBiodata }
                res.send(result);

            } catch (error) {
                console.log(error);
            }
        })
        // Approved user/biodata Premium request  End


        // ------------------------- USER END --------------------












        // ------------------------- FAVORITE --------------------

        // Store Favorite item 
        app.post('/favorites', async (req, res) => {
            try {
                const newFavorite = req.body;

                console.log(newFavorite);

                const result = await favoriteCollection.insertOne(newFavorite);
                res.send(result)

            } catch (error) {
                console.log(error)
            }
        })
        // Store Favorite item End
        // Get Favorite items for a user
        app.get('/favorites/:userEmail', async (req, res) => {
            try {
                const userEmail = req.params.userEmail;
                const query = { favMakerEmail: userEmail };

                const result = await favoriteCollection.find(query).toArray();
                res.send(result);

            } catch (error) {
                console.log(error.message);
            }
        })
        // Get Favorite items for a user End
        // Delete a Favorite item 
        app.delete('/favorites/:favitemid', async (req, res) => {
            try {

                const favItemId = req.params.favitemid;
                const filter = { _id: new ObjectId(favItemId) };
                const result = await favoriteCollection.deleteOne(filter);
                res.send(result);

            } catch (error) {
                console.log(error)
            }
        })
        // Delete a Favorite item  End

        // ------------------------- FAVORITE END --------------------













        // ------------------------- BIODATA --------------------

        // Store Biodatas 
        app.post('/biodatas', async (req, res) => {
            try {
                const newBiodata = req.body;

                const totalBiodata = await biodataCollection.estimatedDocumentCount();
                const id = totalBiodata + 1;
                newBiodata.biodataId = id;

                const result = await biodataCollection.insertOne(newBiodata);
                res.send(result)

            } catch (error) {
                console.log(error.message)
            }
        })
        // Store Biodatas End 

        // Get all biodatas with filtering
        app.get('/biodatas', async (req, res) => {
            try {

                const PremiumBiodata = req.query.premium;
                console.log(PremiumBiodata)
                if (PremiumBiodata) {
                    const filter = { isPro: PremiumBiodata };
                    const result = await biodataCollection.find(filter).toArray()
                    return res.send(result);
                }

                const biodataType = req.query.biodatatype;
                if (biodataType) {
                    const filter = { type: biodataType };
                    const result = await biodataCollection.find(filter).toArray()
                    return res.send(result);
                }

                const divisionValue = req.query.divisionvalue;
                if (divisionValue) {
                    const filter = { permanentDivision: divisionValue };
                    const result = await biodataCollection.find(filter).toArray()
                    return res.send(result);
                }

                const gteValue = req.query.gteValue;
                const lteValue = req.query.lteValue;
                if (gteValue && lteValue) {
                    const filter = { age: { $gte: gteValue, $lte: lteValue } };
                    const result = await biodataCollection.find(filter).toArray();
                    return res.send(result);
                }


                const result = await biodataCollection.find().toArray();
                res.send(result);

            } catch (error) {
                console.log(error);
            }
        })
        // Get all biodatas with filtering End





        // // Get biodatas for a user
        // app.get('/biodatas/:userEmail', async (req, res) => {
        //     try {
        //         const userEmail = req.params.userEmail;
        //         const query = { email: userEmail };

        //         const result = await biodataCollection.find(query).toArray();
        //         res.send(result);

        //     } catch (error) {
        //         console.log(error.message);
        //     }
        // })
        // // Get biodatas for a user End



        // Get single biodata for single page by ID
        app.get('/biodata/:biodataid', async (req, res) => {
            try {

                const buiodataId = req.params.biodataid;
                const filter = { _id: new ObjectId(buiodataId) };
                const result = await biodataCollection.findOne(filter);
                res.send(result);

            } catch (error) {
                console.log(error)
            }
        })
        // Get single biodata for single page by ID end


        // Get Own single biodata by user email
        app.get('/biodata/own/:useremail', async (req, res) => {
            try {

                const userEmail = req.params.useremail;
                const filter = { email: userEmail };
                const result = await biodataCollection.findOne(filter);
                res.send(result);

            } catch (error) {
                console.log(error)
            }
        })
        // Get Own single biodata by user email  end

        // ------------------------- BIODATA END --------------------



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.log);


