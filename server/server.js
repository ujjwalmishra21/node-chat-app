const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('New user connected');

  
  socket.emit('newMessage',generateMessage('Admin','Welcome to ChatApp'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

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
