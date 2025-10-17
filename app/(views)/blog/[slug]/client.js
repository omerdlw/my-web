"use client";

import { DynamicNavUpdater } from "@/components/nav/updater";
import Background from "@/components/blog/post/background";
import { useDatabase } from "@/contexts/database-context";
import SplitText from "@/components/others/split-text";
import Comment from "@/components/blog/post/comment";
import { calculateReadingTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { useEffect } from "react";
import { createNavItem } from "@/hooks/use-nav-item";

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

export default function Post_Client({ post }) {
  const navItem = createNavItem("blogPost", { post });

  return (
    <>
      <PostDataUpdater post={post} />
      <DynamicNavUpdater navItem={navItem} />
      <Background background={post.BACKGROUND} />
      <article className="flex flex-col max-w-5xl py-20 mx-auto px-8 space-y-10">
        <SplitText
          className="text-6xl font-bold text-center"
          text={post.TITLE}
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
        <div className="text-xl leading-9 prose prose-invert">
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {post.CONTENT}
          </ReactMarkdown>
        </div>
      </article>
      <section className="max-w-4xl mx-auto flex flex-col">
        <h2 className="text-2xl mx-auto font-bold mb-4">Comments</h2>
        {post.COMMENTS && post.COMMENTS.length > 0 ? (
          post.COMMENTS.map((comment, index) => {
            const isFirst = index === 0;
            const isLast = index === post.COMMENTS.length - 1;
            return (
              <Comment
                index={index}
                comment={comment}
                isFirst={isFirst}
                isLast={isLast}
                key={index}
              />
            );
          })
        ) : (
          <p className="mx-auto opacity-75">No comment yet</p>
        )}
      </section>
      <div className="h-[260px]"></div>
    </>
  );
}
