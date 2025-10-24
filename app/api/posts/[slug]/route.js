import { getPostBySlug } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { message: "Slug parameter is required." },
      { status: 400 },
    );
  }

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { message: `Post with slug "${slug}" not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(
      `API Error - Failed to fetch post for slug "${slug}":`,
      error,
    );
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
