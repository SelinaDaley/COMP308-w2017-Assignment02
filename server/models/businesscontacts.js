let mongoose = require('mongoose');

// create a model class
let businesscontactsSchema = mongoose.Schema({
    Name: String,
    Number: String,
    Email: String
},
{
    collection: "businesscontacts"
});

module.exports = mongoose.model('businesscontacts', businesscontactsSchema);