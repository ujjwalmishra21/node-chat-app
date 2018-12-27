const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('New user connected');

  socket.on('join',(params, callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required')
    }

    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)
    //socket.leave('class12') ---to leave a socket

    //io.emit ---> io.to('class12').emit
    //socket.broadcast.emit ----> socket.broadcast.to('class12').emit
    //socket.emit 

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    socket.emit('newMessage',generateMessage('Admin','Welcome to ChatApp'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
    callback()
  })
 

  socket.on('createLocationMessage',(coords)=>{
    var user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name ,coords.latitude, coords.longitude))
    }
    
  })

  socket.on('createMessage',function (message, callback) {
    
    var user = users.getUser(socket.id)
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
    }
    
    callback('This is from server');
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // })
  })

   socket.on('disconnect',function(){
    var user = users.removeUser(socket.id);
    
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} left.`))
    }
  });

});

server.listen(port,function(){
  console.log(`Server started at ${port}`);
});
