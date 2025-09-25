const express = require('express');
const router = express.Router();
const { getAllForecasts } = require('../controllers/forecastController');

router.get('/all-forecasts', getAllForecasts);

module.exports = router;
