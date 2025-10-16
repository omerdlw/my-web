export function calculateReadingTime(content) {
  const wordsPerMinute = 225;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function createApiPayload(formData) {
  const now = new Date().toISOString();
  const tags = formData.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    TITLE: formData.title,
    SLUG: generateSlug(formData.title),
    CONTENT: formData.content,
    BANNER_BACKGROUND: formData.bannerBackground,
    BACKGROUND: formData.background,
    CATEGORY: formData.category,
    TAGS: tags,
    AUTHOR: formData.author,
    CREATED_AT: now,
    UPDATED_AT: now,
  };
}

export async function getNowPlaying() {
  const url = "https://omerdlw-api.netlify.app/spotify";
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Spotify API error: ${res.status} ${res.statusText} ${text}`
      );
    }
    const data = await res.json();
    return {
      NAME: data.NAME || null,
      ARTIST: data.ARTIST || null,
      ALBUM: data.ALBUM || null,
      COVER: data.COVER || null,
      PLAYING: data.PLAYING === true || data.PLAYING === "true" || false,
      LAST: data.LAST || null,
      RAW: data,
    };
  } catch (err) {
    throw new Error(`Failed to fetch now playing: ${err.message}`);
  }
}
