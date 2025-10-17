import { getPostBySlug } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
      return NextResponse.json(
        { message: "Requested resource not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(
      `API Error - Failed to fetch post for slug "${params.slug}":`,
      error
    );

    return NextResponse.json(
      { message: "A server error occurred." },
      { status: 500 }
    );
  }
}
