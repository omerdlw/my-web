"use client";

import Icon from "@/components/icon";
import { ErrorMessage, SuccessMessage } from "@/components/shared";
import { useDatabase } from "@/contexts/database-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

const avatars = [
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg",
  "https://avatarfiles.alphacoders.com/375/thumb-1920-375500.png",
  "https://avatarfiles.alphacoders.com/375/thumb-1920-375727.png",
  "https://avatarfiles.alphacoders.com/375/thumb-1920-375746.png",
  "https://avatarfiles.alphacoders.com/378/thumb-1920-378109.png",
  "https://avatarfiles.alphacoders.com/378/thumb-1920-378067.png",
  "https://mfiles.alphacoders.com/967/thumb-1920-967616.jpg",
  "https://avatarfiles.alphacoders.com/374/thumb-1920-374650.png",
  "https://avatarfiles.alphacoders.com/693/thumb-1920-69371.jpg",
];

export default function Comment_Modal({ close }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(avatars[0]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { post } = useDatabase();
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomAvatar = () => {
    setAvatar(avatars[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/posts/${post.SLUG}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content, avatar }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Yorum eklenemedi");
      }

      setSuccessMessage("Your message has been sent successfully");
      setContent("");
      setAuthor("");
      setAvatar(avatars[0]);
      router.refresh();

      setTimeout(() => {
        close();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      if (successMessage) {
      } else {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-3">
      {error && <ErrorMessage message={error} className="mb-4" />}
      {successMessage && (
        <SuccessMessage message={successMessage} className="mb-4" />
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center space-x-2 select-none">
          {!avatars.includes(avatar) ? (
            <div className="relative w-12 h-12">
              <img
                src={avatar}
                alt="Yüklenmiş Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
              <button
                type="button"
                onClick={handleRemoveCustomAvatar}
                className="absolute -top-1 -right-1 bg-red-500 cursor-pointer rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                aria-label="Kendi avatarını kaldır"
              >
                &times;
              </button>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full cursor-pointer flex items-center justify-center text-2xl text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
            >
              <Icon icon={"solar:cloud-upload-bold"} />
            </label>
          )}
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="sr-only"
          />
          {avatars.map((av, index) => (
            <img
              key={index}
              src={av}
              alt={`Avatar ${index + 1}`}
              onClick={() => setAvatar(av)}
              className={`w-12 h-12 rounded-full cursor-pointer object-cover select-none border-2 ${
                avatar === av ? "border-skin-secondary" : "border-transparent"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center space-x-4 w-full p-4 bg-black/5 dark:bg-white/5 rounded-secondary">
          <img
            className="size-12 rounded-full object-cover shrink-0"
            alt="Selected Avatar"
            src={avatar}
          />
          <input
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Name/Surname, Nickname"
            className="w-full"
            value={author}
            name="author"
            type="text"
            id="author"
          />
        </div>
        <div className="bg-black/5 dark:bg-white/5 rounded-secondary min-h-64 overflow-hidden">
          <textarea
            className="w-full min-h-full flex-1 bg-transparent resize-none p-4"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your comment"
            value={content}
            name="content"
            id="content"
            rows="12"
          />
        </div>
        <input
          className="w-full cursor-pointer bg-skin-primary text-white p-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-secondary"
          value={isLoading ? "Your comment is being sent" : "Send comment"}
          disabled={isLoading}
          type="submit"
        ></input>
      </form>
    </div>
  );
}
