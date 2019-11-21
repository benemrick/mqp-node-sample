const express = require('express');
const app = express();
const fs = require('fs');
const convert = require('xml-js');
const port = 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const options = {compact: true, ignoreComment: true};

app.get('/readXML', function(req, res) {
  fs.readFile('./data/part.xml', function(err, data) {
    const xml = convert.xml2json(data, options);
    res.send(JSON.stringify(xml));
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
