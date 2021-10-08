const Rooms = require("../models/dbRooms");

const getAllRooms = (req, res) => {
    Rooms.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
}

const newRoom = (req, res) => {
    const dbRoom = req.body;

    Rooms.create(dbRoom, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
}

const removeRoom = (req, res) => {
    const id = req.params.id
    Rooms.findByIdAndDelete(id, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
}

exports.removeRoom =removeRoom
exports.newRoom =newRoom
exports.getAllRooms =getAllRooms