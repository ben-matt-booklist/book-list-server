'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/books_app');
client.connect();
client.on('error', err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

let localUrl = 'http://localhost:8080';

let deployUrl = 'https://ben-matt-booklist.github.io/book-list-client/';


app.use(express.static('/'));

app.get('/', (req, res) => {
  req.hostname === 'localhost' ? res.redirect(localUrl) : res.redirect(deployUrl);
});

app.get('/api/v1/books', (req, res) => {
  let SQL = 'SELECT book_id, title, author, image_url FROM books;';
  client.query(SQL)
    .then(result => res.send(result.rows))
    .catch(console.error);
})

app.get('/api/v1/books/:id', (req, res) => {
  let SQL = 'SELECT * FROM books WHERE book_id = $1;'
  let values = [
    req.params.id
  ]
  client.query(SQL, values)
    .then(result => res.send(result.rows[0]))
    .catch(console.error);
})

app.post('/api/v1/books', (req, res) => {
  let SQL = 'INSERT INTO books(title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5);'
  let values = [
    req.body.title,
    req.body.author,
    req.body.isbn,
    req.body.image_url,
    req.body.description
  ]
  client.query(SQL, values)
    .catch(console.error);
})

app.delete('/api/v1/books/:id',(req, res) =>{
  let SQL ='DELETE FROM books WHERE book_id = $1;'
  let values = [req.params.id]
 client.query(SQL, values)
 .catch(console.error);
})

app.put('/api/v1/books:id',(req, res) =>{
  let SQL ='UPDATE books SET $2, $3, $4, $5, $6 WHERE book_id = $1; '
  let values = [req.params.id]
  client.query(SQL, values)
  .catch(console.error);
  })
  

app.get('*', (req, res) => res.status(403).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));