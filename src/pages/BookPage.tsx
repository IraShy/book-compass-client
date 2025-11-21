import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import type { Book, Review } from "../types";
import axios from "../config/axios";

function BookPage() {
  const { isAuthenticated } = useUser();
  const { id: bookId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState<Book | null>(
    (location.state?.book as Book) || null
  );
  const [review, setReview] = useState<Review | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`books/${bookId}`);
      setBook(response.data);
      setBookError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setBookError(err.response?.data?.error || "Failed to fetch book data");
      } else {
        console.log(err);
        setBookError("Something went wrong. Please try again.");
      }
    }
  };

  const fetchReview = async () => {
    try {
      const response = await axios.get(`reviews/${bookId}`);
      setReview(response.data.review || null);
      setReviewError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setReview(null);
      } else {
        if (axios.isAxiosError(err)) {
          setReviewError(
            err.response?.data?.error || "Failed to fetch book review"
          );
        } else {
          console.log(err);
          setReviewError("Something went wrong. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (bookId) {
        setLoading(true);
        setBookError(null);
        setReviewError(null);
        const stateBook = location.state?.book as Book;
        if (stateBook && stateBook.google_books_id === bookId) {
          setBook(stateBook);
        } else if (!book || book.google_books_id !== bookId) {
          await fetchBook();
        }
        if (isAuthenticated) {
          await fetchReview();
        } else setReview(null);

        setLoading(false);
      }
    };
    fetchData();
  }, [bookId, book, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return bookError ? (
      <div className="api-error-message">{bookError}</div>
    ) : (
      <div className="api-error-message">
        No book data found. Please search for a book first.
      </div>
    );
  }

  return (
    <article className="text-container">
      <header className="book-info">
        <h1 className="title">{book.title}</h1>
        {book.authors && (
          <p className="authors">by {book.authors.join(", ")}</p>
        )}
      </header>

      <section className="description">
        <h2>About this book</h2>
        {book.description ? (
          <p>{book.description}</p>
        ) : (
          <p className="muted-text">No description available.</p>
        )}
      </section>

      {reviewError && (
        <div className="api-error-message" role="alert">
          {reviewError}
        </div>
      )}

      {isAuthenticated && review && (
        <section className="review" aria-labelledby="review-heading">
          <h2 id="review-heading">Your Review</h2>
          <div className="review-rating">
            <span className="rating-value">{review.rating}</span>
            <span>/10</span>
          </div>
          {review.content && <p>{review.content}</p>}
          <time className="review-date" dateTime={review.updated_at}>
            Reviewed on {new Date(review.updated_at).toLocaleDateString()}
          </time>
        </section>
      )}

      {!isAuthenticated && (
        <section className="auth-prompt">
          <Link to={`/login?redirect=/books/${bookId}`} className="btn">
            Log in to review this book
          </Link>
        </section>
      )}

      {isAuthenticated && !review && (
        <section className="review no-review">
          <p>You haven't reviewed this book yet.</p>
          <button className="btn btn-slim">Write a Review</button>
        </section>
      )}
    </article>
  );
}

export default BookPage;
