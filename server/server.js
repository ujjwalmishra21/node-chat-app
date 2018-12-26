const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('New user connected');

   socket.emit('newMessage',{
    from:'rock@ymail.com',
    text:'hey, its rock',
    createdAt:1233
  })

  socket.on('createMessage',function (message) {
    console.log('Create Message', message);
  })

   socket.on('disconnect',function(){
    console.log('User disconnected');
  });

});

server.listen(port,function(){
  console.log(`Server started at ${port}`);
});
