const express = require('express')
const createCookieToken = require('../../api/authentication/controllers/createCookieToken');
const clearCookieToken = require('../../api/authentication/controllers/clearCookieToken');
const router = express.Router();


router.post('/jwt', createCookieToken);
router.post('/logout', clearCookieToken);




module.exports = router;

