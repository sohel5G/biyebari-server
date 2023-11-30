

const express = require('express');
const { adminDashboardStatistic } = require('../../controllers/adminDashboardStatistic');
const router = express.Router();

router.get('/admin/dashboard-statistic', adminDashboardStatistic)


module.exports = router;
