'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://benjamin:postgrespassword@localhost:5432/books_app');
client.connect();
client.on('error', err => console.log(err));

app.use(cors());
app.use(express.json());

let localUrl = 'http://localhost:8080';

//let deployUrl = 'https://bt-mg-booklist.herokuapp.com'
let deployUrl = 'https://ben-matt-booklist.github.io/book-list-client/';


app.use(express.static('/'));

app.get('/', (req, res) => {
  req.hostname === 'localhost' ? res.redirect(localUrl) : res.redirect(deployUrl);
});

app.get('/api/v1/books', (req, res) => {
  //some code goes here to get ye books
  let SQL = 'SELECT book_id, title, author, image_url FROM books';
  client.query(SQL)
    .then(result => res.send(result.rows))
    .catch(console.error);
})

app.get('/api/v1/books/:id', (req, res) => {
  let SQL = 'SELECT * FROM books WHERE book_id = $1'
  let values = [
    req.params.id
  ]
  client.query(SQL, values)
    .then(result => res.send(result.rows[0]))
    .catch(console.error);
})

app.get('*', (req, res) => res.status(403).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));