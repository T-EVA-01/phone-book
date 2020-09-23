var Person = require('../models/person');

exports.person_list = function(req, res, next) {
    Person.find()
    .sort([['family_name', 'ascending']])
    .exec(function(err, list_persons) {
        if(err) {return next(err);}
        res.render('person_list', {person_list: list_persons})
    })
};