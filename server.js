const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
const { PeerServer } = require('peer');
const { v4: uuidv4 } = require('uuid');

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
    res.json({ id: uuidv4() });
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(socket.rooms);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
    });
});

server.listen(PORT, () => {
    console.log("I'm here, I'm There");
});
