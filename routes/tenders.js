const express = require('express');
const router = express.Router();
const TenderController = require('../controllers/tenders');

router.route('/')
    .get(TenderController.index)

router.route('/:tenderId')
    .get(TenderController.tender)

module.exports = router;