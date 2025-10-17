import { useDatabase } from "@/contexts/database-context";
import { useModal } from "@/contexts/modal-context";
import { useEffect, useState } from "react";
import ControlsButton from "../button";

export default function PostControls() {
  const { openModal } = useModal();
  const { post } = useDatabase();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (post) {
      const userId = localStorage.getItem("userId");
      setIsLiked(post.LIKES?.includes(userId));
      setLikeCount(post.LIKES?.length || 0);
    }
  }, [post]);

  const handleLike = async () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("userId", userId);
    }

    try {
      const response = await fetch(`/api/posts/${post.SLUG}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.likes.includes(userId));
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <div className="w-full h-full flex space-x-3">
      <div className="w-full h-full flex items-center justify-end space-x-3">
        <ControlsButton
          onClick={handleLike}
          icon={isLiked ? "solar:heart-bold" : "solar:heart-outline"}
          text={likeCount + " likes"}
          color={isLiked && "#E9152D"}
        />
      </div>
      <div className="w-[400px] h-full shrink-0"></div>
      <div className="w-full h-full flex items-center justify-start space-x-3">
        <ControlsButton
          onClick={() => openModal("COMMENT_MODAL")}
          icon={"solar:add-circle-bold"}
          text={"Add comment"}
        />
      </div>
    </div>
  );
}
