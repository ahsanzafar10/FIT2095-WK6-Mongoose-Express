let mongoose = require('mongoose');
let moment = require('moment');

let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'Author'
    },
    isbn: {
        type: String,
        validate: {
            validator: function(newisbn) {
                return newisbn.length == 13;
            },
            message: 'ISBN should be only 13 characters'
        }
    },
    date: {
        type: Date,
        default: Date.now(),
        get: function(newDate){
            return moment(newDate).format('DD-MM-YY');
        }
    },
    summary: String
});

module.exports = mongoose.model('Book', bookSchema);