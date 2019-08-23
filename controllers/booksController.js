function bookController(Book) {
  function post(req, resp) {
    const book = new Book(req.body);
    if(!req.body.name){
      resp.status(400);
      return resp.send('Name is Required');
    }
    book.save();
    resp.status(201);
    return resp.json(book);
  }

  function get(req, resp) {
    const query = {};
    if (req.query.name) {
      query.name = req.query.name;
    }
    if (req.query.author) {
      query.author = req.query.author;
    }
    Book.find(query, (err, books) => {
      if (err) {
        return resp.send(err);
      }
      const linkBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links={};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      })
      return resp.json(linkBooks);
    });
  }
  return {post, get};
}

module.exports = bookController;
