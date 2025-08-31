"use client";

import { useEffect } from "react";
import Image from "next/image";

type BlogContentProps = {
  blog: {
    title: string;
    eyecatch?: {
      url: string;
      width: number;
      height: number;
    };
    content: string;
  };
};

export default function BlogContent({ blog }: BlogContentProps) {
  useEffect(() => {
    const images = document.querySelectorAll(".blog-content img");
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;
      imageElement.style.width = "80%";
      imageElement.style.maxWidth = "80%";
      imageElement.style.height = "auto";
      imageElement.style.display = "block";
      imageElement.style.margin = "0 auto";
      imageElement.removeAttribute("width");
      imageElement.removeAttribute("height");
    });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>{blog.title}</h1>
      {blog.eyecatch && (
        <Image
          src={blog.eyecatch.url}
          alt="アイキャッチ画像"
          width={blog.eyecatch.width}
          height={blog.eyecatch.height}
          style={{
            maxWidth: "80%",
            display: "block",
            margin: "0 auto",
            height: "auto",
          }}
        />
      )}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <style jsx global>{`
        .blog-content img {
          max-width: 80% !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
        }
        @media (max-width: 600px) {
          .blog-content img {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}