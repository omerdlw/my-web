import { toggleLike } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params; // Değişiklik
    const { slug } = resolvedParams; // Değişiklik

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Kullanıcı kimliği zorunludur" },
        { status: 400 }
      );
    }

    const updatedPost = await toggleLike(slug, userId);

    if (!updatedPost) {
      return NextResponse.json(
        { message: "Gönderi bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { likes: updatedPost.LIKES, likeCount: updatedPost.LIKES.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Hatası - Beğeni eklenemedi:", error);
    return NextResponse.json(
      { message: "Sunucuda bir hata oluştu." },
      { status: 500 }
    );
  }
}
