// importing
const express = require('express');
const mongoose = require('mongoose');
const Pusher =require('pusher')
const cors = require('cors')

const messageController = require('./controllers/message-controller')
const roomController = require('./controllers/room-controller')

// app config
const app = express();
const port = process.env.PORT || 9000
const pusher = new Pusher({
    appId: "1278229",
    key: "d9b70e4422eb052f2b8a",
    secret: "94a370a84a65e936f5af",
    cluster: "mt1",
    useTLS: true
});
// middleware
app.use(express.json());
app.use(cors())

//DB config
const connection_url = `mongodb+srv://admin:ftBE0vxyuMbWvQzV@cluster0.6liot.mongodb.net/chatappdb?retryWrites=true&w=majority`
mongoose.connect(connection_url, {
    minPoolSize: 15,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("DB Connected")

    // Message collection
    const collectionMessageContents = db.collection("messagecontents");
    const documentChangeStreamForMessage = collectionMessageContents.watch();

    documentChangeStreamForMessage.on("change", (change) => {
        console.log(change)

        if (change.operationType === 'insert') {
            const fullDocument = change.fullDocument;
            pusher.trigger("messages", "messagesInserted", {
                name: fullDocument.name,
                message: fullDocument.message,
                timestamp: fullDocument.timestamp,
                receiver: fullDocument.receiver,
                room: fullDocument.room
            });
        } else {
            console.log("error triggering pusher");
        }
    })

    // Rooms collection
    const roomCollection = db.collection("roomcontents");
    let documentChangeStreamForRoom = roomCollection.watch();

    documentChangeStreamForRoom.on("change", (change) => {
        console.log(change)

        if (change.operationType === "insert") {
            const fullDocument = change.fullDocument;
            pusher.trigger("rooms", "roomsInserted", {
                name: fullDocument.name,
            });
        } else if (change.operationType === "delete") {
            console.log(change.documentKey._id)
            pusher.trigger("removeRooms", "roomsRemoved", {
                id: change.documentKey._id
            })
        } else {
            console.log("error triggering pusher");

        }
    })
})
db.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
});
db.on('connected', () => {
    console.log('Mongoose connected to ' + connection_url);
    console.log('Ready state ' + db.readyState)
});
db.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// api route
app.get('/', messageController.baseUrl)
app.get('/messages/sync', messageController.getAllMessages)
app.post('/messages/new', messageController.newMessage)

app.get('/rooms/sync', roomController.getAllRooms)
app.post('/rooms/new', roomController.newRoom)
app.delete('/rooms/:id', roomController.removeRoom)

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));