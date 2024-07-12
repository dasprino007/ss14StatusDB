const mongoose = require('mongoose');
const {Schema} = mongoose;

const MapsSchema = new Schema ({
    name: String,
    map : String,
    HowManyTimesWasPlayed: Number
})

module.exports = MapsSchema