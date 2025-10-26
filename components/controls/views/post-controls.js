import { useDatabase } from "@/contexts/database-context";
import { useModal } from "@/contexts/modal-context";
import { useEffect, useState, useCallback } from "react";
import ControlsButton from "../button";
import Icon from "@/components/icon";

const generateUserId = () => {
  try {
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.randomUUID
    ) {
      return window.crypto.randomUUID();
    }
  } catch (e) {
    console.error(
      "crypto.randomUUID not available, falling back to Math.random.",
    );
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const getUserId = () => {
  if (typeof window === "undefined") return null;
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("userId", userId);
  }
  return userId;
};

export default function PostControls() {
  const { openModal } = useModal();
  const { post } = useDatabase();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    if (post && userId) {
      setIsLiked(post.LIKES?.includes(userId) ?? false);
      setLikeCount(post.LIKES?.length || 0);
    } else {
      setIsLiked(false);
      setLikeCount(post?.LIKES?.length || 0); // Post varsa like sayısını göster ama like durumunu false yap
    }
  }, [post, userId]);

  const handleLike = useCallback(async () => {
    if (!post || !userId || isLoadingLike) return;

    setIsLoadingLike(true);
    const originalIsLiked = isLiked;
    const originalLikeCount = likeCount;

    setIsLiked(!originalIsLiked);
    setLikeCount(
      originalIsLiked ? originalLikeCount - 1 : originalLikeCount + 1,
    );
    {
    }

    try {
      const response = await fetch(`/api/posts/${post.SLUG}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Like request failed");
      }
    } catch (error) {
      console.error("Like error:", error);
      setIsLiked(originalIsLiked);
      setLikeCount(originalLikeCount);
    } finally {
      setIsLoadingLike(false);
    }
  }, [post, userId, isLoadingLike, isLiked, likeCount]);

  if (!post) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center pointer-events-auto space-x-4">
      <div className="w-full flex items-center justify-end gap-3">
        <ControlsButton
          onClick={handleLike}
          icon={
            isLoadingLike
              ? "mingcute:loading-3-fill"
              : isLiked
                ? "solar:heart-bold"
                : "solar:heart-outline"
          }
          text={`${likeCount} likes`}
          color={isLiked && !isLoadingLike ? "#E9152D" : undefined}
          disabled={isLoadingLike || !userId}
          loading={isLoadingLike}
        />
      </div>
      <div className="w-[400px] h-full shrink-0"></div>
      <div className="w-full flex items-center justify-start gap-3">
        <ControlsButton
          onClick={() => openModal("COMMENT_MODAL")}
          icon={"solar:chat-line-bold"}
          description={
            post.COMMENTS?.length > 0 ? `${post.COMMENTS.length} comments` : ""
          }
          text={post.COMMENTS?.length > 0 ? "Add comment" : "Add comment"}
        />
      </div>
    </div>
  );
}
