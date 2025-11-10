import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Book } from "../types";
import axios from "../config/axios";

function BookPage() {
  const { id } = useParams();
  const location = useLocation();
  const [book, setBook] = useState<Book | null>(
    (location.state?.book as Book) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book && id) {
      const fetchBook = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`books/${id}`);
          setBook(response.data);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error || "Failed to fetch book data");
          } else {
            console.log(err);
            setError("Something went wrong. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchBook();
    }
  }, [book, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return error ? (
      <div className="api-error-message">{error}</div>
    ) : (
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
