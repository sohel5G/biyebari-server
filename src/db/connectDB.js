const mongoose = require("mongoose");
require("dotenv").config();

const getConnectionString = () => {
    let connectionUrl;

    if (process.env.NODE_ENVIRONMENT === "development") {
        connectionUrl = process.env.DATABASE_DEVELOPMENT_URI;
    } else {
        connectionUrl = process.env.DATABASE_PRODUCTION_URI;
    }

    return connectionUrl;
};

const connectDB = async () => {

    try { 

        console.log("connectting to database....");
        const mongoURI = getConnectionString();

        await mongoose.connect(mongoURI, { dbName: process.env.DB_NAME });
        console.log("connected to database");

    } catch (error) {
        console.log("Can not connect to database");
        console.log(error.message);
    }

};

module.exports = connectDB

