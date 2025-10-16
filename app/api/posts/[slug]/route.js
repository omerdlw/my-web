import { getPostBySlug } from "@/lib/db/posts";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
      return NextResponse.json(
        { message: "İstenen kaynak bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(
      `API Hatası - Slug "${params.slug}" için post getirilemedi:`,
      error
    );

    return NextResponse.json(
      { message: "Sunucuda bir hata oluştu." },
      { status: 500 }
    );
  }
}
