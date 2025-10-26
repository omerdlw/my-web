"use client";

import { DynamicNavUpdater } from "@/components/nav/updater";
import Background from "@/components/blog/post/background";
import { useDatabase } from "@/contexts/database-context";
import SplitText from "@/components/others/split-text";
import Comment from "@/components/blog/post/comment";
import { createNavItem } from "@/hooks/use-nav-item";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { useEffect } from "react";

function PostDataUpdater({ post }) {
  const { setPost } = useDatabase();

  useEffect(() => {
    setPost(post);

    return () => {
      setPost(null);
    };
  }, [post, setPost]);

  return null;
}

function ArticleHeader({ title }) {
  return (
    <SplitText
      className="text-6xl font-bold text-center"
      text={title}
      delay={160}
      duration={2}
      ease="elastic.out(1, 0.3)"
      splitType="words"
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
      threshold={0.1}
      rootMargin="-100px"
      textAlign="center"
    />
  );
}

function ArticleContent({ content }) {
  return (
    <div className="text-xl leading-9 prose prose-invert opacity-80">
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{content}</ReactMarkdown>
    </div>
  );
}

function CommentsSection({ comments }) {
  const hasComments = comments && comments.length > 0;

  return (
    <section className="max-w-4xl mx-auto flex flex-col">
      <h2 className="text-2xl mx-auto font-bold mb-4">Comments</h2>
      {hasComments ? (
        <div>
          {comments.map((comment, index) => {
            const isFirst = index === 0;
            const isLast = index === comments.length - 1;

            return (
              <Comment
                key={`${comment.author}-${index}`}
                comment={comment}
                isFirst={isFirst}
                isLast={isLast}
                index={index}
              />
            );
          })}
        </div>
      ) : (
        <p className="mx-auto opacity-75 ">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </section>
  );
}

export default function Client({ post }) {
  const navItem = createNavItem("blogPost", { post });

  return (
    <>
      <PostDataUpdater post={post} />
      <DynamicNavUpdater navItem={navItem} />
      <Background background={post.BACKGROUND} />
      <article className="flex flex-col max-w-5xl py-20 mx-auto px-8 space-y-10">
        <ArticleHeader title={post.TITLE} />
        <ArticleContent content={post.CONTENT} />
      </article>
      <CommentsSection comments={post.COMMENTS} />
      <div className="h-32" />
    </>
  );
}
