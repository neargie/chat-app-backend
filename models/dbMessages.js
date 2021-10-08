const mongoose = require('mongoose');

const chatAppSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    receiver: Boolean,
    room: String
});

module.exports = mongoose.model('messagecontents', chatAppSchema);