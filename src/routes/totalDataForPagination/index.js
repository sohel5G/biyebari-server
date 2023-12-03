
const express = require('express');
const { totalBiodataForPagination } = require('../../controllers/totalDataForPagination');

const router = express.Router();

router.get('/totalbiodataforpagination', totalBiodataForPagination);

module.exports = router;
