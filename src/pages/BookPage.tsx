import { useLocation } from "react-router-dom";
import type { Book } from "../types";

function BookPage() {
  const location = useLocation();
  const book = location.state?.book as Book;

  if (!book) {
    return (
      <div className="api-error-message">
        No book data found. Please search for a book first.
      </div>
    );
  }

  return (
    <>
      <section className="text-container">
        <div className="book-info">
          <h1 className="title">{book.title}</h1>
          {book.authors && (
            <p className="authors">by {book.authors.join(", ")}</p>
          )}

          {book.description && (
            <div className="description">
              <h3>Description:</h3>
              <p>{book.description}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BookPage;
