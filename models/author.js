let mongoose = require('mongoose');
let moment = require('moment');

let authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstname: {
            type: String,
            required: true
        },
        lastname: String
    },
    dob : {
        type: Date,
        get: function (newDate) {
            return moment(newDate).format('DD-MM-YY');
        }
    },
    address: {
        state: {
            type: String,
            validate: {
                validator: function(newstate) {
                    return newstate.length == 2 || newstate.length == 3;
                },
                message: "State should be between 2 and 3 characters"
            }
        },
        suburb : String,
        street : String,
        unit : Number
    },
    numbooks: {type: Number, min: 1, max: 150}
});

module.exports = mongoose.model('Author', authorSchema);

