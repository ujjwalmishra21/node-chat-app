const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('New user connected');

  socket.on('join',(params, callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and room name are required')
    }

    socket.join(params.room)
    //socket.leave('class12') ---to leave a socket

    //io.emit ---> io.to('class12').emit
    //socket.broadcast.emit ----> socket.broadcast.to('class12').emit
    //socket.emit 

    socket.emit('newMessage',generateMessage('Admin','Welcome to ChatApp'));

    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));



    callback()
  })
 

  socket.on('createLocationMessage',(coords)=>{
    io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude, coords.longitude))
  })

  socket.on('createMessage',function (message, callback) {
    console.log('Create Message', message);

    io.emit('newMessage',generateMessage( message.from, message.text));
    callback('This is from server');
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // })
  })

   socket.on('disconnect',function(){
    console.log('User disconnected');
  });

});

server.listen(port,function(){
  console.log(`Server started at ${port}`);
});
