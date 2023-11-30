const express = require('express');
const applyCorsMiddleware = require('./middlewares/applyCorsMiddleware');
const connectDB = require('./db/connectDB');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

applyCorsMiddleware(app);

const authenticationRouter = require('./routes/authentication');
const successStory = require('./routes/successStory');
const biodatas = require('./routes/biodata');
const users = require('./routes/users');
const favoritesItems = require('./routes/favorites');
const requests = require('./routes/requests');
const adminDashboardStatistic = require('./routes/adminDashboardStatistic');
const stripePaymentIntentd = require('./routes/stripePaymentIntent/stripePaymentIntent');
const totalDataForPagination = require('./routes/totalDataForPagination');

app.get("/", (req, res) => {
    res.send("BiyeBari server is running");
})
const DBconnectBeforeServerRun = async () => {
    await connectDB()
    app.listen(port, () => {
        console.log(`BiyeBari server server is running on PORT: ${port}`)
    })
}
DBconnectBeforeServerRun();

app.use(authenticationRouter);

app.use(successStory);

app.use(biodatas);

app.use(users);

app.use(favoritesItems);

app.use(requests);

app.use(adminDashboardStatistic);

app.use(stripePaymentIntentd);

app.use(totalDataForPagination);
