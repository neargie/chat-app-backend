const Messages = require("../models/dbMessages");

const baseUrl = (req, res) => {
    res.status(200).send('hello world')
}

const getAllMessages = (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

const newMessage = (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
}

exports.newMessage = newMessage
exports.getAllMessages = getAllMessages
exports.baseUrl = baseUrl