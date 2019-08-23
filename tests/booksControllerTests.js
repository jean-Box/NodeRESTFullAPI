const should = require("should");
const sinon = require("sinon");
const bookController = require("../controllers/booksController");

describe("Book Controller Test:", () => {
  describe("Post", () => {
    it("should not allow an empty name on post", () => {
      const Book = function(book) {
        this.save = () => {};
      };
      const req = { body: { author: "DLA" } };
      const resp = {
        status: sinon.spy(),
        send: sinon.spy(),
        send: sinon.spy()
      };
      const controller = bookController(Book);
      controller.post(req, resp);

      resp.status.calledWith(400).should.equal(true, `Bad Status ${resp.status.args[0][0]}`);
      resp.send.calledWith('Name is Required').should.equal(true);
    });
  });
});
