const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io')
const port = process.env.PORT || 3001
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    },
})

io.on("connection", (socket)=>{
    console.log(`user connected ${socket.id}`)

    socket.on("join_room", (options, callback) =>{
       const {error, user} = addUser({id: socket.id, ...options})
        
       if(error){
           return callback(error)
       }

       socket.join(user.room);

        socket.emit("message",{message:"Welcome!"})

        socket.broadcast.to(user.room).emit("message",{message:`${user.username} has joined!`})
        console.log(`User with ID: ${socket.id} and username: ${user.username} joined room: ${user.room}`);

        callback()
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", ()=>{
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', {message:`${user.username} has left the chat!`})
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        console.log("user disconnected", socket.id)
    })
})

server.listen(port,()=>{
    
    console.log(`server is up on port ${port}`)
})