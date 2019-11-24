const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const fs = require('fs');
const convert = require('xml-js');
const port = 3000;
const schedule = require('node-schedule');

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

const options = {compact: true, ignoreComment: true};

app.get('/readXML', function(req, res) {
  fs.readFile('./data/part.xml', function(err, data) {
    const xml = convert.xml2json(data, options);
    res.send(JSON.stringify(xml));
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var scheduler = schedule.scheduleJob('* * */24 * * *', function(){
  console.log('Every 24 hours');
});
