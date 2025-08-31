"use client";

import { useEffect } from "react";
import Image from "next/image";

type ContentDisplayProps = {
  contentData: {
    title: string;
    eyecatch?: {
      url: string;
      width: number;
      height: number;
    };
    content: string;
  };
};

export default function ContentDisplay({ contentData }: ContentDisplayProps) {
  useEffect(() => {
    const images = document.querySelectorAll(".content-display img");
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
      <h1>{contentData.title}</h1>

      {contentData.eyecatch && (
        <Image
          src={contentData.eyecatch.url}
          alt="アイキャッチ画像"
          width={contentData.eyecatch.width}
          height={contentData.eyecatch.height}
          style={{
            maxWidth: "80%",
            display: "block",
            margin: "0 auto",
            height: "auto",
          }}
        />
      )}

      <div
        className="content-display"
        dangerouslySetInnerHTML={{ __html: contentData.content }}
      />

      <style jsx global>{`
        .content-display img {
          max-width: 80% !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
        }

        @media (max-width: 600px) {
          .content-display img {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
