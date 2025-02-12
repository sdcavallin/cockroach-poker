const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index_chat.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle room joining
    socket.on('join room', (room) => {
        // Leave previous room if exists
        let previousRoom = [...socket.rooms][1]; // First room is the default socket ID room
        if (previousRoom) {
            socket.leave(previousRoom);
            console.log(`User left room: ${previousRoom}`);
        }

        // Join new room
        socket.join(room);
        console.log(`User joined room: ${room}`);
        socket.emit('room joined', room);
    });

    // Handle sending messages within the correct room
    socket.on('chat message', ({ room, message }) => {
        if (room && socket.rooms.has(room)) {
            console.log(`Message in room ${room}: ${message}`);
            io.to(room).emit('chat message', message);
        } else {
            console.log(`User is not in room ${room}, message not sent.`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
