const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');


const applyCorsMiddleware = (app) => {

    app.use(cors({
        origin: [process.env.LOCAL_SITE_URL, process.env.LIVE_SITE_URL],
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(express.json());

}

module.exports = applyCorsMiddleware;





