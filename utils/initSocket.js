const socketIo = require('socket.io');


const initSocket = (server) =>{
    // console.log("connected")
    const io = socketIo(server)

    io.on('connection',(socket) => {
        console.log('user connected',socket.id)

        socket.on('disconnected', () =>{
            console.log('user disconnected',socket.io)
        })

        socket.on('message', (data) => {
            // Broadcast the received message to all connected clients
            io.emit('message', data);
          });

    })

}

module.exports = initSocket