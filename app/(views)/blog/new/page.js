"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { createApiPayload } from "@/lib/utils";
import { FORM_LIMITS, ROUTES, PLACEHOLDERS } from "@/config/constants";
import { ErrorMessage, SuccessMessage } from "@/components/shared";

/**
 * Form Field Component
 * Reusable input/textarea field with label and help text
 */
function FormField({
  id,
  label,
  as = "input",
  helpText,
  error,
  required,
  ...props
}) {
  const InputComponent = as;
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2 text-skin-base"
      >
        {label}
        {required && <span className="text-skin-error ml-1">*</span>}
      </label>
      <InputComponent
        id={id}
        className={`w-full p-4 border rounded-2xl transition-colors duration-200 bg-transparent ${
          hasError
            ? "border-skin-error focus:border-skin-error"
            : "border-black/10 dark:border-white/10 focus:border-skin-primary"
        }`}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${id}-error` : helpText ? `${id}-help` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-skin-error">
          {error}
        </p>
      )}
      {!error && helpText && (
        <p id={`${id}-help`} className="mt-1 text-sm text-skin-muted">
          {helpText}
        </p>
      )}
    </div>
  );
}

/**
 * Form validation logic
 */
function validateFormData(formData) {
  const errors = {};

  // Title validation
  if (!formData.title.trim()) {
    errors.title = "Title is required";
  } else if (formData.title.length > FORM_LIMITS.POST_TITLE_MAX) {
    errors.title = `Title must be less than ${FORM_LIMITS.POST_TITLE_MAX} characters`;
  }

  // Content validation
  if (!formData.content.trim()) {
    errors.content = "Content is required";
  } else if (formData.content.length > FORM_LIMITS.POST_CONTENT_MAX) {
    errors.content = `Content must be less than ${FORM_LIMITS.POST_CONTENT_MAX} characters`;
  }

  // Author name validation
  if (!formData.author.name.trim()) {
    errors.author = "Author name is required";
  } else if (formData.author.name.length > FORM_LIMITS.AUTHOR_NAME_MAX) {
    errors.author = `Author name must be less than ${FORM_LIMITS.AUTHOR_NAME_MAX} characters`;
  }

  // Category validation
  if (!formData.category.trim()) {
    errors.category = "Category is required";
  }

  return errors;
}

/**
 * New Blog Post Page Component
 */
export default function NewPostPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    author: {
      avatar: PLACEHOLDERS.AVATAR,
      name: "Ömer Deliavcı",
    },
    bannerBackground: "",
    background: "",
    category: "",
    content: "",
    title: "",
    tags: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /**
   * Handles input changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  /**
   * Handles author name changes
   */
  const handleAuthorChange = useCallback((e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        name: value,
      },
    }));

    // Clear validation error
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.author;
      return newErrors;
    });
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setSubmitError("");
    setSubmitSuccess(false);

    // Validate form
    const errors = validateFormData(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = createApiPayload(formData);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setSubmitSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push(ROUTES.BLOG);
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Error creating post:", err);
      setSubmitError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets the form
   */
  const handleReset = useCallback(() => {
    if (
      confirm("Are you sure you want to reset the form? All data will be lost.")
    ) {
      setFormData({
        author: {
          avatar: PLACEHOLDERS.AVATAR,
          name: "Ömer Deliavcı",
        },
        bannerBackground: "",
        background: "",
        category: "",
        content: "",
        title: "",
        tags: "",
      });
      setValidationErrors({});
      setSubmitError("");
      setSubmitSuccess(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-skin-base mb-2">
          Create New Blog Post
        </h1>
        <p className="text-skin-muted">
          Write and publish your thoughts, stories, and ideas
        </p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <SuccessMessage
          message="Post created successfully! Redirecting..."
          className="mb-6 animate-fade-in"
        />
      )}

      {/* Error Message */}
      {submitError && (
        <ErrorMessage message={submitError} className="mb-6 animate-fade-in" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Title */}
        <FormField
          label="Title"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          error={validationErrors.title}
          placeholder="Enter a compelling title"
          maxLength={FORM_LIMITS.POST_TITLE_MAX}
        />

        {/* Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Page Background"
            id="background"
            name="background"
            value={formData.background}
            onChange={handleChange}
            error={validationErrors.background}
            placeholder="https://example.com/image.jpg"
            helpText="URL of background image for the post page"
          />
          <FormField
            label="Banner Background"
            id="bannerBackground"
            name="bannerBackground"
            value={formData.bannerBackground}
            onChange={handleChange}
            error={validationErrors.bannerBackground}
            placeholder="https://example.com/banner.jpg"
            helpText="URL of banner image"
          />
        </div>

        {/* Category and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            error={validationErrors.category}
            placeholder="e.g., Technology, Design, Personal"
          />
          <FormField
            label="Tags"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            error={validationErrors.tags}
            placeholder="javascript, react, nextjs"
            helpText="Separate tags with commas"
          />
        </div>

        {/* Author */}
        <FormField
          label="Author"
          id="author"
          name="author"
          required
          value={formData.author.name}
          onChange={handleAuthorChange}
          error={validationErrors.author}
          maxLength={FORM_LIMITS.AUTHOR_NAME_MAX}
        />

        {/* Content */}
        <FormField
          label="Content"
          id="content"
          name="content"
          as="textarea"
          required
          rows="25"
          value={formData.content}
          onChange={handleChange}
          error={validationErrors.content}
          className="font-mono w-full"
          helpText="Write your content in Markdown format"
          placeholder="Start writing your post content here..."
          maxLength={FORM_LIMITS.POST_CONTENT_MAX}
        />

        {/* Character Count */}
        <div className="text-sm text-skin-muted text-right">
          {formData.content.length.toLocaleString()} /{" "}
          {FORM_LIMITS.POST_CONTENT_MAX.toLocaleString()} characters
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || submitSuccess}
            className="px-8 py-3 bg-skin-primary text-white rounded-xl font-medium hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Creating...
              </>
            ) : submitSuccess ? (
              <>
                <span>✓</span>
                Created!
              </>
            ) : (
              "Create Post"
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting || submitSuccess}
            className="px-8 py-3 border border-skin-base rounded-xl font-medium hover:bg-skin-muted active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-8 py-3 text-skin-muted hover:text-skin-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Bottom Spacing */}
      <div className="h-[260px]" aria-hidden="true" />
    </div>
  );
}
