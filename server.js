const express = require('express')
const app = express()
const server = require('http').Server(app)


const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const users = {}

io.on('connection', socket => {
    socket.on('join-room', roomId => {
        socket.join(roomId)
        console.log(io.sockets.adapter.rooms.get(roomId));
        console.log('new user');



        socket.on('new-user', username => {
            users[socket.id] = username
            socket.broadcast.to(roomId).emit('user-connected', username)
        })

        socket.broadcast.to(users[socket.id]).emit( 'users', {users: users} );

        socket.on('send-chat-message', message => {
            console.log(message);
            socket.broadcast.to(roomId).emit('chat-message', {
                message: message,
                name: users[socket.id]
            })
        })

        socket.on('disconnect', username => {
            username = users[socket.id]
            console.log(username);
            socket.broadcast.to(roomId).emit('user-disconnected', username)
        })

    })
})

server.listen(4000)