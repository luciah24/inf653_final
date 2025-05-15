const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String] // this indicates that funfuacts accepts an array of strings 
    }
});


module.exports = mongoose.model('State', stateSchema);