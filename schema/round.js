const mongoose = require('mongoose');
const {Schema} = mongoose;

const roundSchema = new Schema ({
    name : String,
    round_id: Number,
    players : Number,
    map : String,
    preset: String,
    round_start_time:String
})

module.exports = roundSchema