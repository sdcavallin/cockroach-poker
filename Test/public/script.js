var socket = io();
var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');
var roomInput = document.getElementById('room-input');
var joinBtn = document.getElementById('join-btn');
var roomStatus = document.getElementById('room-status');
var currentRoom = null;

// Join a room when the user enters a code
joinBtn.addEventListener('click', function () {
    var room = roomInput.value.trim();
    if (room) {
        console.log(`Attempting to join room: ${room}`);
        socket.emit('join room', room);
    } else {
        console.log("No room code entered!");
    }
});

// Receive confirmation from server when joining a room
socket.on('room joined', function (room) {
    console.log(`Joined room successfully: ${room}`);
    currentRoom = room;
    messages.innerHTML = ''; // Clear messages when switching rooms
    roomStatus.textContent = `Connected to room: ${room}`;
});

// Send message within the joined room
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value && currentRoom) {
        console.log(`Sending message to room ${currentRoom}: ${input.value}`);
        socket.emit('chat message', { room: currentRoom, message: input.value });
        input.value = '';
    }
});

// Receive messages specific to the current room
socket.on('chat message', function (msg) {
    console.log(`Received message: ${msg}`);
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
