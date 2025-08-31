"use client";
import { useEffect } from "react";

export default function ScrollEventSetter() {
  useEffect(() => {
    // スクロールイベントの処理
    const initialScrollOffset = window.scrollY || 0;
    document.documentElement.style.setProperty('--scroll-offset', `${initialScrollOffset}px`);

    const handleScroll = () => {
      const scrollOffset = window.scrollY;
      document.documentElement.style.setProperty('--scroll-offset', `${scrollOffset}px`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return null;
}
