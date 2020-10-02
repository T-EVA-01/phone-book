const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const PersonSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        middle_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date, required: true},
        age: {type: Number},
        phone_number: {type: Number, required: true},
        sity: {type: String, required: true, max: 100},
        addres: {type: String, required: true, max: 100},
        house_number: {type: String, required: true, max: 5},
        apartment_number: {type: String, required: true, max: 10}
    }
);


// Виртуальное свойство для полного имени человека
PersonSchema
.virtual('name')
.get(function() {
    return `${this.family_name} ${this.first_name} ${this.middle_name}`
});

// Виртуальное свойство для получения абсолютного URL конкретного экземпляра модели
PersonSchema
.virtual('url')
.get(function() {
    return `/catalog/person/${this._id}`;
});

// Виртуальные свойства, необходимые для того, чтобы привести дату рождения в более удобочитаемый формат
PersonSchema
.virtual('date_of_birth_formatted')
.get(function() {
    return moment(this.date_of_birth).format('YYYY-MM-DD');
});

PersonSchema
.virtual('date_of_birth_formatted_reverse')
.get(function() {
    return moment(this.date_of_birth).format('DD.MM.YYYY');
});

module.exports = mongoose.model('Person', PersonSchema)