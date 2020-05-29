const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const math = require('mathjs');



var sess = [];

app.get('/', function(req, res) {

    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    
    socket.on('expression', function(message) {
        try {
            var val = math.evaluate(message);
            var result = message + " = " + val;
            if(sess.length == 10){
                sess.splice(0,1);
            }
            sess.push(result);
            io.emit('expression', result);
        } catch (e) {
            socket.emit('err', e.toString());
        }   
    });
    
    socket.on('len', function(){
        io.emit('len', sess.length);
    });
    
    socket.on('session_login',function(){
        socket.emit('session_login', sess);
    })

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});