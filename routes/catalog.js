var express = require('express');
var router = express.Router();

var person_controller = require('../controllers/personController');

router.get('/', person_controller.person_list); 

router.get('/person/create', person_controller.person_create_get);

router.post('/person/create', person_controller.person_create_post);

router.get('/person/:id/delete', person_controller.person_delete_get);

router.post('/person/:id/delete', person_controller.person_delete_post);

module.exports = router