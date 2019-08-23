const express = require("express");
const booksController = require('../controllers/booksController');
function routes(Book) {
  const bookRouter = express.Router();
  const controller = booksController(Book);
  bookRouter
    .route("/books")
    .post(controller.post)
    .get(controller.get);

  bookRouter.use("/books/:bookId", (req, resp, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        console.log(`Book.findById ${req.params.bookId} `,err);
        return resp.send(err);
      }
      if (book) {
        req.book = book;
        console.log(`find ${book._id}`);
        return next();
      }
      return resp.sendStatus(404);
    });
  });
  bookRouter
    .route("/books/:bookId")
    .get((req, resp) => {
      const returnbook = req.book.toJSON();
      returnbook.links = {};

      const author = req.book.author.replace(' ', '%20');
      returnbook.links.FilterByThisAuthor = `http://${req.headers.host}/api/books/?author=${author}`
      const name = req.book.name.replace(' ', '%20');
      returnbook.links.FilterByThisName = `http://${req.headers.host}/api/books/?name=${name}`
      
      resp.json(returnbook)})
    .put((req, resp) => {
      const { book } = req;
      book.name = req.body.name;
      book.author = req.body.author;
      book.save();
      req.book.save((err)=>{
        if(err){
          console.log(`PATCH Book.save ${req.params.bookId} `,err);
          return resp.send(err);
        }
        return resp.json(book);
      });
    })
    .patch((req,resp) => {
      const {book} = req;
      if(req.body._id){
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item)=> {
        const key = item[0];
        const val = item[1];
        book[key] = val;
      });
      req.book.save((err)=>{
        if(err){
          console.log(`PATCH Book.save ${req.params.bookId} `,err);
          return resp.send(err);
        }
        return resp.json(book);
      });
    })
    .delete((req,resp)=> {
      req.book.remove((err) =>{
        if(err){
          console.log(`DELETE Book.remove ${req.params.bookId} `,err);
          return resp.send(err);
        }
        return resp.sendStatus(204);
      })
    });
  return bookRouter;
}

module.exports = routes;
