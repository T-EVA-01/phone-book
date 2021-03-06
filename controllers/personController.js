const Person = require('../models/person');
const {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');
const async = require('async');

exports.person_list = function(req, res, next) {
    Person.find()
    .sort([['family_name', 'ascending']])
    .exec(function(err, list_persons) {
        if(err) {return next(err);}
        res.render('person_list', {person_list: list_persons})
    })
};

exports.person_create_get = function(req, res, next) {
    res.render('person_form', {title: 'Create Person'});
}



exports.person_create_post = [

    body('first_name').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('first_name').isAlpha(value[charIdx], 'ru-RU')
             && !body('first_name').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal first name'); 
            }   
        }
        return true;
      }).escape(),
    body('family_name').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('family_name').isAlpha(value[charIdx], 'ru-RU')
             && !body('family_name').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal family name'); 
            }   
        }
        return true;
      }).escape(),
    body('middle_name').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('middle_name').isAlpha(value[charIdx], 'ru-RU')
             && !body('middle_name').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal middle name'); 
            }   
        }
        return true;
      }).escape(),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true})
        .isISO8601().toDate(),
    body('age').isLength({min: 2}).trim()
        .isNumeric().withMessage('Age non-numeric characters.').escape(),
    body('phone_number').trim().isMobilePhone('ru-RU')
        .withMessage('Phone number must be 79xxxxxxxxx').escape(),
    body('sity').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('sity').isAlpha(value[charIdx], 'ru-RU')
             && !body('sity').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal sity'); 
            }   
        }
        return true;
      }).escape(),
    body('addres').isLength({min: 1}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('addres').isAlpha(value[charIdx], 'ru-RU')
             && !body('addres').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal addres'); 
            }   
        }
        return true;
      }).escape(),
    body('house_number').isLength({min: 1}).trim().isNumeric()
        .withMessage('House number non-numeric charecters.').escape(),
    body('apartment_number').isLength({min: 1}).trim().isNumeric()
        .withMessage('Apartment number non-numeric charecters.').escape(),

    (req, res, next) => {
        
        let errors = validationResult(req)

        if(!errors.isEmpty()) {
            res.render('person_form', {title: 'Create Person', person: req.body, errors: errors.array()});
            return
        } else {
            
            let person = new Person(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    middle_name: req.body.middle_name,
                    date_of_birth: req.body.date_of_birth,
                    age: req.body.age,
                    phone_number: req.body.phone_number,
                    sity: req.body.sity,
                    addres: req.body.addres,
                    house_number: req.body.house_number,
                    apartment_number: req.body.apartment_number
                }
            );
            person.save(function(err) {
                if(err) {return next(err);}
                res.redirect('/catalog')
            })
        }
    }

];

exports.person_delete_get = function(req, res, next) {
    console.log(req.params);
    async.parallel({
        person: function(callback) {
            Person.findById(req.params.id).exec(callback)
        }
    }, function(err, results) {
        if(err) {return next(err);}
        if(results.person === null) {
            res.redirect('/catalog')
        };
        // console.log(results);
        res.render('person_delete', {title: 'Delete Person', person: results.person})
    })
};

exports.person_delete_post = function(req, res, next) {
    async.parallel({
        person: function(callback) {
            Person.findById(req.body.personid).exec(callback)
        }
    }, function(err, results) {
        if(err) { return next(err); }
        else {
            Person.findByIdAndRemove(req.body.personid, function deletePerson(err) {
                if(err) { return next(err); }
                res.redirect('/catalog')
            })
        };
    })
};

exports.person_update_get = function(req, res, next) {

    async.parallel({
        person: function(callback) {
            Person.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        if(results == null) {
            var err = new Error('Person not found');
            err.status = 404;
            return next(err);
        } 
        res.render('person_form', {title: 'Update Person', person: results.person })
    })
};




exports.person_update_post = [

    body('first_name').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('first_name').isAlpha(value[charIdx], 'ru-RU')
             && !body('first_name').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal first name'); 
            }   
        }
        return true;
      }).escape(),
    body('family_name').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('family_name').isAlpha(value[charIdx], 'ru-RU')
             && !body('family_name').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal family name'); 
            }   
        }
        return true;
      }).escape(),
    body('middle_name').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('middle_name').isAlpha(value[charIdx], 'ru-RU')
             && !body('middle_name').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal middle name'); 
            }   
        }
        return true;
      }).escape(),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true})
        .isISO8601().toDate(),
    body('age').isLength({min: 2}).trim()
        .isNumeric().withMessage('Age non-numeric characters.').escape(),
    body('phone_number').trim().isMobilePhone('ru-RU')
        .withMessage('Phone number must be 79xxxxxxxxx').escape(),
    body('sity').isLength({min: 3}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('sity').isAlpha(value[charIdx], 'ru-RU')
             && !body('sity').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal sity'); 
            }   
        }
        return true;
      }).escape(),
    body('addres').isLength({min: 1}).trim().custom(value => {
        for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
            if (!body('addres').isAlpha(value[charIdx], 'ru-RU')
             && !body('addres').isAlpha(value[charIdx], 'en-US')) {
              throw new Error('Illegal addres'); 
            }   
        }
        return true;
      }).escape(),
    body('house_number').isLength({min: 1}).trim().isNumeric()
        .withMessage('House number non-numeric charecters.').escape(),
    body('apartment_number').isLength({min: 1}).trim().isNumeric()
        .withMessage('Apartment number non-numeric charecters.').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        let person = new Person(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                middle_name: req.body.middle_name,
                date_of_birth: req.body.date_of_birth,
                age: req.body.age,
                phone_number: req.body.phone_number,
                sity: req.body.sity,
                addres: req.body.addres,
                house_number: req.body.house_number,
                apartment_number: req.body.apartment_number,
                _id: req.params.id
            }
        );

        if(!errors.isEmpty()) {
            async.parallel({
                persons: function(callback) {
                    Person.find(callback)
                }
            }, function(err, results) {
                if(err) { return next(err) }
                res.render('person_form', { title: 'Update Person', person: person, errors: errors.array()})
            });
            return
        } else {
            Person.findByIdAndUpdate(req.params.id, person, {}, function(err, theperson) {
                if(err) {return next(err);}
                res.redirect('/catalog')
            })
        };
    }
]