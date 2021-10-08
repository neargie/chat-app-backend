const mongoose = require('mongoose')

const roomsSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('roomcontents', roomsSchema);