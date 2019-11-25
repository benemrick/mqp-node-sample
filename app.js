const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const EventEmitter = require('events');
const process = require('process');
var xml = require('xml');

const fs = require('fs');
const convert = require('xml-js');
const port = 3000;
const schedule = require('node-schedule');

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

const options = {compact: true, ignoreComment: true};

app.get('/readXML', function (req, res) {
    fs.readFile('./data/part.xml', 'utf8', function (err, data) {
        return res.status(200).send(data);
    });
});

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

// Schedules a job every 2 seconds.
var scheduler = schedule.scheduleJob('*/2 * * * * *', function () {
    io.emit('chat message', "GIVE ME YOUR DATA");
});

/**
 * EventEmitter Error Handling
 */
class Emitter extends EventEmitter {}
const emitter = new Emitter();
const logger = console;

emitter.on('error', (err) => {
    logger.error('Unexpected error on emitter', err);
});

// Test the emitter
emitter.emit('error', new Error('Whoops!'));


/**
 * Process Error Handling
 */
process.on('uncaughtException', (err) => {
    logger.log('Whoops! There was an uncaught error', err);
    // do a graceful shutdown,
    // close the database connection etc.
    process.exit(1);
});

process.on('unhandledRejection', function (reason, promise) {
    logger.error('Whoops! Unhandled rejection', {reason: reason, promise: promise})
});

// Test process
throw new Error('I am uncaught.');
