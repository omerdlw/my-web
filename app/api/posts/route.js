import { createPost } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { TITLE, CONTENT, SLUG, CATEGORY, AUTHOR } = body;

    if (!TITLE || !CONTENT || !SLUG || !CATEGORY || !AUTHOR) {
      return NextResponse.json(
        { message: "Title, content, summary, or other required fields are missing." },
        { status: 400 }
      );
    }

    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request format." },
        { status: 400 }
      );
    }

    console.error("API Error - Failed to create post:", error);
    return NextResponse.json(
      { message: "A server error occurred." },
      { status: 500 }
    );
  }
}
