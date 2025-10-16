import { createPost } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { TITLE, CONTENT, SLUG, CATEGORY, AUTHOR } = body;

    if (!TITLE || !CONTENT || !SLUG || !CATEGORY || !AUTHOR) {
      return NextResponse.json(
        { message: "Başlık, içerik, özet ve diğer zorunlu alanlar eksik." },
        { status: 400 }
      );
    }

    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Geçersiz istek formatı." },
        { status: 400 }
      );
    }

    console.error("API Hatası - Post oluşturulamadı:", error);
    return NextResponse.json(
      { message: "Sunucuda bir hata oluştu." },
      { status: 500 }
    );
  }
}
