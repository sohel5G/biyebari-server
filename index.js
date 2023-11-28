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
        const requestCollection = client.db('biyebari').collection('requests');
        const reviewCollection = client.db('biyebari').collection('reviews');



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
                console.log(error)
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
                console.log(error)
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
        //-----------  STRIPE PAYMENT METHOD API------------------





        // ----------- REQUEST------------------

        // Post a requested Item
        app.post('/users/post-contact-request', async (req, res) => {
            try {

                const newRequest = req.body;
                const result = await requestCollection.insertOne(newRequest);

                res.send(result);

            } catch (err) {
                console.log(err);
            }
        })
        // Post a requested Item End


        // Get requested item for a user
        app.get('/users/get-contact-request/:useremail', async (req, res) => {
            try {
                const userEmail = req.params.useremail;
                const query = { requesterEmail: userEmail };

                console.log(userEmail)

                const result = await requestCollection.find(query).toArray();
                res.send(result);
            } catch (error) {
                console.log(error)
            }
        })
        // Get requested item for a user end


        // Delete a  requested item
        app.delete('/users/delete-contact-request/:reqitemid', async (req, res) => {
            try {

                const reqItemId = req.params.reqitemid;
                const filter = { _id: new ObjectId(reqItemId) };
                const result = await requestCollection.deleteOne(filter);
                res.send(result);

            } catch (error) {
                console.log(error)
            }
        })
        // Delete a  requested item  End



        // Get requested pending item for a admin
        app.get('/admin/get-for-approved-request', async (req, res) => {
            const result = await requestCollection.find({ request: 'Pending' }).toArray();
            res.send(result);
        })
        // Get requested pending item for a admin end



        // Approved request update by admin 
        app.put('/admin/approved-contact-request/:itemid', async (req, res) => {
            try {
                const ItemId = req.params.itemid;
                const filter = { _id: new ObjectId(ItemId) };

                const updateDoc = {
                    $set: {
                        request: 'Approved',
                    },
                };

                const result = await requestCollection.updateOne(filter, updateDoc);
                res.send(result);
            } catch (err) {
                console.log(err)
            }
        })
        // Approved request update by admin



        // -----------  REQUEST------------------







        // ----------- ADMIN DASHBOARD STATISTIC --------------------
        app.get('/admin/dashboard-statistic', async (req, res) => {
            try {

                const totalBiodata = await biodataCollection.estimatedDocumentCount();

                const maleQuery = { type: 'Male' }
                const maleBiodata = await biodataCollection.countDocuments(maleQuery);

                const femaleQuery = { type: 'Female' }
                const femaleBiodata = await biodataCollection.countDocuments(femaleQuery);

                const premiumQuery = { isPro: 'Premium' }
                const premiumBiodata = await biodataCollection.countDocuments(premiumQuery);

                const totalRevenue = await requestCollection.find().toArray();
                const subTotalRevenue = totalRevenue.reduce((total, item) => {
                    if (item.payed) {
                        return total + item.payed;
                    }
                    return total;
                }, 0);

                res.send({
                    totalBiodata,
                    maleBiodata,
                    femaleBiodata,
                    premiumBiodata,
                    subTotalRevenue
                })

            } catch (err) {
                console.log(err);
            }
        })
        // ----------- ADMIN DASHBOARD STATISTIC END --------------------



        // ----------------- REVIEW -----------------------

        app.post('/post-success-story', async (req, res) => {
            try {
                const newStory = req.body;
                const result = await reviewCollection.insertOne(newStory);
                res.send(result);
            } catch (error) {
                console.log(error)
            }
        })

        app.get('/get-success-stories', async (req, res) => {
            try {

                const result = await reviewCollection.find().toArray();
                res.send(result);

            } catch (err) {
                console.log(err)
            }
        })

        //----------------- REVIEW END-----------------------




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
                console.log(err)
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
            try {
                const userEmail = req.params.useremail;
                const query = { email: userEmail };

                const updateDoc = {
                    $set: {
                        userRole: 'Admin',
                    },
                };

                const result = await userCollection.updateOne(query, updateDoc);
                res.send(result);
            } catch (err) {
                console.log(err)
            }
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
                console.log(error);
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
                console.log(error)
            }
        })
        // Store Biodatas End 

        // Get all biodatas with filtering
        app.get('/biodatas', async (req, res) => {
            try {

                const PremiumBiodata = req.query.premium;
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


