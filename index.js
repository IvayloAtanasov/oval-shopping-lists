const dbConfig = require('./knexfile').development;
const knex = require('knex')(dbConfig);

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static('public/bin'));

// parse request params into req.body
app.use(bodyParser.urlencoded({
	// type is default but who cares
	type: 'application/x-www-form-urlencoded',
	extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/bin/index.html');
});

app.listen(8080, () => console.log('API listening on port 8080'));