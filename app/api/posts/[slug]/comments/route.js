import { addCommentToPost } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params; // Değişiklik
    const { slug } = resolvedParams; // Değişiklik
    const body = await request.json();
    const { author, content, avatar } = body;

    if (!author || !content) {
      return NextResponse.json(
        { message: "Author and content fields are required" },
        { status: 400 }
      );
    }

    const updatedPost = await addCommentToPost(slug, {
      author,
      content,
      avatar,
    });

    if (!updatedPost) {
      return NextResponse.json(
        { message: "Gönderi bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost.COMMENTS, { status: 201 });
  } catch (error) {
    console.error("API Hatası - Yorum eklenemedi:", error);
    return NextResponse.json(
      { message: "Sunucuda bir hata oluştu." },
      { status: 500 }
    );
  }
}
