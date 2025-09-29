import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../config/axios";
import type { BaseModalProps, BookSearchData } from "../types";
import { validatePresence } from "../utils/validation";
import { useForm } from "../hooks/useForm";

import FormField from "./FormField";
import Modal from "./Modal";

function BookSearchModal({ isOpen, closeModal }: BaseModalProps) {
  const navigate = useNavigate();

  const [showHelp, setShowHelp] = useState(false);

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
    if (!isOpen) {
      resetForm();
      setShowHelp(false);
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Search Books">
      <section className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {errors.api && <div className="api-error-message">{errors.api}</div>}

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
    </Modal>
  );
}

export default BookSearchModal;
