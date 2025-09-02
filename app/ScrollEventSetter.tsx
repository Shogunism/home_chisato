"use client";
import { useEffect } from "react";

export default function ScrollEventSetter() {
  useEffect(() => {
    // 初期オフセットをCSS変数へ
    const initialScrollOffset = window.scrollY || 0;
    document.documentElement.style.setProperty('--scroll-offset', `${initialScrollOffset}px`);

    const updateOffset = () => {
      const scrollOffset = window.scrollY;
      document.documentElement.style.setProperty('--scroll-offset', `${scrollOffset}px`);
    };

    // 横スクロールをハードロック
    const applyCssGuards = () => {
      const root = document.documentElement as HTMLElement;
      const body = document.body as HTMLElement;
      root.style.overflowX = 'clip';
      body.style.overflowX = 'clip';
      root.style.setProperty('overscroll-behavior-x', 'none');
      body.style.setProperty('overscroll-behavior-x', 'none');
      root.style.setProperty('touch-action', 'pan-y');
      body.style.setProperty('touch-action', 'pan-y');
    };

    const lockHorizontalScroll = () => {
      const el = document.scrollingElement as HTMLElement | null;
      if (el && (el.scrollLeft !== 0)) {
        el.scrollLeft = 0;
      }
    };

    const onWheel = (e: WheelEvent) => {
      // 横方向のホイール移動を無効化
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        lockHorizontalScroll();
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        // 横スワイプは無効化
        e.preventDefault();
        lockHorizontalScroll();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // 左右矢印・水平スクロール系キーを無効化
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        lockHorizontalScroll();
      }
    };

    // 初期適用
    applyCssGuards();
    lockHorizontalScroll();

    // 監視登録
    window.addEventListener('scroll', updateOffset, { passive: true });
    window.addEventListener('scroll', lockHorizontalScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', updateOffset);
      window.removeEventListener('scroll', lockHorizontalScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  return null;
}
