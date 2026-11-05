'use client';

import { useEffect, useState } from 'react';

/**
 * 手機版底部固定的「我想加入」按鈕。
 * 滑過 Hero 後才出現，滑到加入區塊時隱藏，避免與區塊內的按鈕重複。
 */
export function StickyJoin() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [joinVisible, setJoinVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const join = document.getElementById('join');
    if (!hero || !join) return;

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === join) setJoinVisible(e.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(join);
    return () => observer.disconnect();
  }, []);

  const show = !heroVisible && !joinVisible;

  return (
    <div
      aria-hidden={!show}
      data-print="hide"
      className={`fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 sm:hidden ${show ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
    >
      <a
        href="#join"
        tabIndex={show ? 0 : -1}
        className="block rounded-full bg-brand py-3 text-center text-[15px] font-bold text-card"
      >
        我想加入
      </a>
    </div>
  );
}
