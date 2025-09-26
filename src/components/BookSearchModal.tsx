import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import FormField from "./FormField";
import { validatePresence } from "../utils/validation";
import type { BookSearchData, BookSearchModalProps } from "../types";
import { useForm } from "../hooks/useForm";
import axios from "../config/axios";

function BookSearchModal({ isOpen, closeModal }: BookSearchModalProps) {
  const navigate = useNavigate();

  const [showHelp, setShowHelp] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const submitHandler = async (data: BookSearchData) => {
    const response = await axios.get("books/find", { params: data });
    console.log(response);
    closeModal();
    navigate(`/book`, { state: { book: response.data.book } });
  };

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<BookSearchData>(
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
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setShowHelp(false);
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Search Books</h2>
          <button className="modal-close" onClick={closeModal}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <section className="form-container">
            <form onSubmit={handleSubmit} noValidate>
              {errors.api && (
                <div className="api-error-message">{errors.api}</div>
              )}

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
                placeholder="e.g. Peter Straub, Stephen King"
                helptext="Separate multiple authors with commas"
                showHelp={showHelp}
                onToggleHelp={() => setShowHelp(!showHelp)}
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
