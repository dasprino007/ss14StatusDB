const mongoose = require('mongoose');
const {Schema} = mongoose;

const PlayerTimeSchema = new Schema ({
    name : String,
    round_id: Number,
    players : Number,
    map : String,
    preset: String,
    Time_date:Date
})

module.exports = MapsSchema