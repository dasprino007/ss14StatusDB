const mongoose = require('mongoose');
const {Schema} = mongoose;

const MapsSchema = new Schema ({
    map : String,
    HowManyTimesPlayed: Number
})

module.exports = MapsSchema