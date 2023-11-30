
const express = require('express');
const { totalDataForPagination } = require('../../controllers/totalDataForPagination');

const router = express.Router();

router.get('/totaldataforpagination', totalDataForPagination);


module.exports = router;

