var express = require('express');
var router = express.Router();

var person_controller = require('../controllers/personController');

router.get('/', person_controller.person_list); 

module.exports = router