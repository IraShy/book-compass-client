import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormField from "./FormField";
import { validatePresence } from "../utils/validation";
import type { BookSearchData, BookSearchModalProps } from "../types";
import { useForm } from "../hooks/useForm";
import axios from "../config/axios";

function BookSearchModal({ isOpen, onClose }: BookSearchModalProps) {
  const navigate = useNavigate();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const submitHandler = async (data: BookSearchData) => {
    const response = await axios.get("books/find", { params: data });
    console.log(response);
    onClose();
    // navigate(`/`);
  };

  const { formData, errors, handleChange, handleBlur, handleSubmit } =
    useForm<BookSearchData>(
      {
        title: "",
        authors: "",
      },
      {
        title: (value) => validatePresence(value, "Title"),
        authors: (value) => validatePresence(value, "Authors"),
      },
      submitHandler
    );

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Search Books</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <section className="form-container">
            <form onSubmit={handleSubmit} noValidate>
              <FormField
                label="Book Title"
                type="text"
                name="title"
                value={formData.title}
                error={errors.title}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <FormField
                label="Authors"
                type="text"
                name="authors"
                placeholder='e.g. "Peter Straub, Stephen King"'
                value={formData.authors}
                error={errors.authors}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <button type="submit" className="btn w-full">
                Search
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default BookSearchModal;
