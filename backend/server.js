const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const path = require('path');

const app = express()
dotenv.config()
connectDB()

// app.get("/", (req,res) => {
//     res.send("API is Running successfully")
// })

app.use(express.json());  // command used to accept JSON data from the front-end


app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)


// -------------------------------------- DEPLOYYMENT --------------------------------
const __dirname1 = path.resolve()// signifies current working directory, path module comes from node js

if (process.env.NODE_ENV==='production'){

    app.use(express.static(path.join(__dirname1, "/frontend/build")))  //establishes path from current working directory to build folder of frontend

    app.get("*",(req,res) => {
        // send files to our front end when our app is successfully running, we want to run the index.html file which will be in our build folder
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))           
    })

}else{
    app.get("/", (req,res) => {
        res.send("API is Running successfully")
    })
}
// -------------------------------------- DEPLOYYMENT --------------------------------

app.use(notFound)
app.use(errorHandler)



const PORT = process.env.PORT || 5000

const server = app.listen(5000, console.log(`Server started on port ${PORT}`))

const io = require("socket.io")(server, {
    pingTimeout: 60000,                            // waits for ms before connection is closed for inactivity
    cors : {
        origin : "http://localhost:3000"
    }
})

// creating a connection
io.on("connection", (socket) => {
    console.log("Connected to socket.io")

    // below we are creating a new socket where the front end will send some data and join a 'room'
    socket.on("setup", (userData) => {
        // creating new room with the id of the user data
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit("connected")
    })

    // joining a chat
    // takes room ID from the front end and creates a new room
    // when we click on a chat, the other user will be added to the room 
    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User joined room : " + room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    // socket to send message
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat // which chat message belonmgs to (room)
        
        if (!chat.users) {
            return console.log("chat.users not defined")  // if no users in chat
        }

        // emitting our text that we send to other users in chat
        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id){
                return // as this means it is a message sent by us and doesnt need to be sent to us
            }

            // emiitng/ sending the message to other users in chat/room using the 'in' function
            socket.in(user._id).emit("message received", newMessageReceived)
        })
    })
})   


// 

