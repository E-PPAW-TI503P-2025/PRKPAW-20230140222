const express = require('express');
const router = express.Router();

let books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' }
];

// --------------------
// GET semua buku
// --------------------
router.get('/', (req, res) => {
  res.json(books);
});

// --------------------
// GET buku by ID
// --------------------
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// --------------------
// POST tambah buku
// --------------------
router.post('/', (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const book = {
    id: books.length + 1,
    title,
    author
  };

  books.push(book);
  res.status(201).json(book);
});

// --------------------
// PUT update buku by ID
// --------------------
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, author } = req.body;

  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

// --------------------
// DELETE hapus buku by ID
// --------------------
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.status(204).send();
});

module.exports = router;