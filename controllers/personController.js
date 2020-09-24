const Person = require('../models/person');
const {body, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator');

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

    body('first_name').isLength({min: 3}).trim().isAlpha().withMessage('First name non-alpha characters.').escape(),
    body('family_name').isLength({min: 3}).trim().isAlpha().withMessage('Family name non-alpha characters.').escape(),
    body('middle_name').isLength({min: 3}).trim().isAlpha().withMessage('Middle name non-alpha characters.').escape(),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601().toDate(),
    body('age').isLength({min: 2}).trim().isNumeric().withMessage('Age non-numeric characters.').escape(),
    body('phone_number').isLength({min: 10}).trim().isNumeric().withMessage('Age non-numeric characters.')
        .isMobilePhone('ru-RU').withMessage('Phone number must be +7(000)0000000').escape(),
    body('sity').isLength({min: 3}).trim().isAlpha().withMessage('Sity non-alpha characters.').escape(),
    body('addres').isLength({min: 1}).trim().withMessage('Addres non-alpha characters.').escape(),
    body('house_number').isLength({min: 1}).trim().isNumeric().withMessage('House number non-numeric charecters.').escape(),
    body('apartment_number').isLength({min: 1}).trim().isNumeric().withMessage('Apartment number non-numeric charecters.').escape(),

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