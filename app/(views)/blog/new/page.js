"use client";

import { createApiPayload } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

function FormField({ id, label, as = "input", helpText, ...props }) {
  const InputComponent = as;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <InputComponent
        id={id}
        className="w-full p-4 border border-black/10 dark:border-white/10 rounded-2xl"
        {...props}
      />
      {helpText && <p className="mt-1 text-sm text-gray-400">{helpText}</p>}
    </div>
  );
}

export default function NewPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    author: {
      avatar:
        "https://i.pinimg.com/736x/aa/d5/d3/aad5d38e5e0c7200301255d69d11dbd9.jpg",
      name: "Ömer Deliavcı",
    },
    bannerBackground: "",
    background: "",
    category: "",
    content: "",
    title: "",
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        name: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const postData = createApiPayload(formData);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Post oluşturulamadı.");
      }

      router.push("/blog");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı</h1>
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Başlık"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
        />
        <FormField
          label="Sayfa Arkaplanı"
          id="background"
          name="background"
          value={formData.background}
          onChange={handleChange}
          placeholder="URL"
        />
        <FormField
          label="Banner Arkaplanı"
          id="bannerBackground"
          name="bannerBackground"
          value={formData.bannerBackground}
          onChange={handleChange}
          placeholder="URL"
        />
        <div className="flex items-center space-x-2">
          <FormField
            label="Kategori"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <FormField
            label="Etiketler"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            helpText="Virgülle ayırarak giriniz."
          />
        </div>
        <FormField
          label="Yazar"
          id="author"
          name="author"
          required
          value={formData.author.name}
          onChange={handleAuthorChange}
        />
        <FormField
          label="İçerik (Markdown)"
          id="content"
          name="content"
          as="textarea"
          required
          rows="60"
          value={formData.content}
          onChange={handleChange}
          className="font-mono w-full"
          helpText="Markdown formatında yazabilirsiniz."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
      <div className="h-[260px]"></div>
    </div>
  );
}
