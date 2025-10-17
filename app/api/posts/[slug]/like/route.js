import { toggleLike } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const updatedPost = await toggleLike(slug, userId);

    if (!updatedPost) {
      return NextResponse.json(
        { message: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { likes: updatedPost.LIKES, likeCount: updatedPost.LIKES.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error - Failed to add like:", error);
    return NextResponse.json(
      { message: "A server error occurred." },
      { status: 500 }
    );
  }
}
