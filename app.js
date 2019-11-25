const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const EventEmitter = require('events');
const process = require('process');
const fs = require('fs');
const schedule = require('node-schedule');
const request = require('request');
var parser = require('fast-xml-parser');
const port = 3000;

require('body-parser-xml')(bodyParser);
app.use(bodyParser.xml());
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/socketTest', function (req, res) {
    res.sendFile(__dirname + '/public/socket.html');
});


/**
 * Sample XML Files
 * https://www.w3schools.com/xml/note.xml
 * https://www.w3schools.com/xml/note_error.xml
 * https://www.w3schools.com/xml/cd_catalog.xml
 * https://www.w3schools.com/xml/plant_catalog.xml
 * https://www.w3schools.com/xml/simple.xml
 **/

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

// Schedules a job every 5 seconds.
var scheduler = schedule.scheduleJob('*/5 * * * * *', function () {

    // Test invalid XML
    request.get('https://www.w3schools.com/xml/note_error.xml', {}, function (err, res, body) {
        if (parser.validate(body) !== true) {
            emitter.emit('xml-error', new Error('Invalid XML'));
        } else {
            emitter.emit('xml-success', body);
        }
    });


    // Test valid XML
    request.get('https://www.w3schools.com/xml/note.xml', {}, function (err, res, body) {
        if (parser.validate(body) !== true) {
            emitter.emit('xml-error', new Error('Invalid XML'));
        } else {
            emitter.emit('xml-success', body);
        }
    });

    io.emit('chat message', "GIVE ME YOUR DATA");
});

/**
 * EventEmitter Event Handling
 */
class Emitter extends EventEmitter {
}

const emitter = new Emitter();
const logger = console;

// Listen for unexpected error event
emitter.on('error', (err) => {
    logger.error('Unexpected error on emitter', err);
});

// Listen for known XML error event
emitter.on('xml-error', (err, res) => {
    logger.error('XML error', err);
    logger.error('XML res', res);
});

// Listen for XML success event
emitter.on('xml-success', (success) => {
    logger.log('Success!', success);
});

// Test the emitter
// emitter.emit('error', new Error('Whoops!'));


/**
 * Process Error Handling
 */
process.on('uncaughtException', (err) => {
    logger.log('Whoops! There was an uncaught error', err);
    // do something
});

process.on('unhandledRejection', function (reason, promise) {
    logger.error('Whoops! Unhandled rejection', {reason: reason, promise: promise})
});

// Test process
// throw new Error('I am uncaught.');
