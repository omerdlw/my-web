import dbConnect from "./mongodb";
import Post from "./models/Post";

export async function getAllPosts() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error getting all posts:", error);
    throw error;
  }
}

export async function createPost(postData) {
  try {
    await dbConnect();
    const post = new Post(postData);
    await post.save({ maxTimeMS: 30000 });
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function getPostBySlug(SLUG) {
  try {
    await dbConnect();
    const post = await Post.findOne({ SLUG }).lean();

    if (!post) {
      return null;
    }

    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error getting post by slug:", error);
    throw error;
  }
}

export async function updatePost(slug, updateData) {
  try {
    await dbConnect();
    const post = await Post.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!post) {
      return null;
    }

    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(slug) {
  try {
    await dbConnect();
    const result = await Post.findOneAndDelete({ slug });
    return result ? true : false;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function addCommentToPost(slug, commentData) {
  try {
    await dbConnect();
    const post = await Post.findOneAndUpdate(
      { SLUG: slug },
      { $push: { COMMENTS: { ...commentData, createdAt: new Date() } } },
      { new: true, runValidators: true }
    ).lean();

    if (!post) {
      return null;
    }

    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error adding comment to post:", error);
    throw error;
  }
}

export async function toggleLike(slug, userId) {
  try {
    await dbConnect();
    const post = await Post.findOne({ SLUG: slug });

    if (!post) {
      return null;
    }

    const isLiked = post.LIKES.includes(userId);

    if (isLiked) {
      // Unlike
      post.LIKES = post.LIKES.filter((id) => id !== userId);
    } else {
      // Like
      post.LIKES.push(userId);
    }

    await post.save();
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error toggling like on post:", error);
    throw error;
  }
}
