"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article, Notice } from "../page";
import '../article-preview.css';

// 日付 "YYYY/MM/DD" 
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

interface Props {
  newsArticles: Article[];
  notices: Notice[];
}

export default function HomeSections({ newsArticles, notices }: Props) {
  const aboutRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );
    const sections = [aboutRef.current, newsRef.current, noticeRef.current];
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>

      <div className="about-container fade" ref={aboutRef}>
        <div className="title-text">ABOUT</div>
        <div className="about-content">
          <Image
            className="about-image"
            src="/about_us_aichi.png"
            alt="About Us Aichi"
            width={1920}
            height={1080}
          />
          <div className="about-description-container">
            <div className="about-description">
              「ちさと館を中心に面白いことに挑戦！」
            </div>
            <div className="description">
              愛知県新城市のちさと館で，中学生がアイデアの主体となり，皆がそれを積極的に支援することで，若者の視点や力で地域の魅力を創出することを目指します． 地域イベントやワークショップの手伝い，企画やデザイン，SNSの運用，個々の得意を活かした取り組みを行います．
            </div>
          </div>
        </div>
      </div>

      <div className="news-container fade" ref={newsRef}>
        <div className="title-text">NEWS</div>
        <div className="articles-preview-list">
          {newsArticles.slice(0, 3).map((article) => (
            <Link href={`/articles/${article.id}`} key={article.id} className="article-card">
              <div className="article-card-image">
                {article.eyecatch ? (
                  <Image
                    src={article.eyecatch.url}
                    alt=""
                    width={288}
                    height={162}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="article-card-body">
                <h3 className="article-card-title">{article.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="more-link-container">
          <Link href="/articles" className="more-link">
            More
          </Link>
        </div>
      </div>

      <div className="news-container fade" ref={noticeRef}>
        <div className="title-text">NOTICE</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {notices.slice(0, 5).map((notice) => (
            <li key={notice.id} style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
              <Link href={`/notices/${notice.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                  <span style={{ color: '#000', fontSize: '0.95em', minWidth: '110px' }}>{formatDate(notice.publishedAt)}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1em', textAlign: 'center', width: '100%' }}>{notice.title}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="more-link-container">
          <Link href="/notices" className="more-link">
            More
          </Link>
        </div>
      </div>
    </>
  );
}
