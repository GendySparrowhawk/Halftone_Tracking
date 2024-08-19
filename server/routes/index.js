const express = require('express');
const router = express.Router();

router.use('/comics', require('./comicRoutes'));
router.use('/customers', require('./customerRoutes'));

module.exports = router;