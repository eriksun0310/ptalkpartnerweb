'use client';

import { useState } from 'react';

const EMAIL = 'connect.ptalk@gmail.com';
const SUBJECT = '我想加入 PTalk 合作夥伴';

/**
 * 寫信按鈕：mailto 只有在裝置設定了預設郵件 App 時才有反應
 * （LINE、Threads 等內建瀏覽器常常沒有），所以點擊時同時複製 Email，並把地址直接顯示出來。
 */
export function EmailButton() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      // 複製失敗（權限或不支援）時仍會顯示地址，讓使用者自行長按複製
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <a
        href={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}
        onClick={handleClick}
        className="rounded-full bg-card px-6 py-3 text-[15px] font-bold text-brand transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-card"
      >
        寫信給我們
      </a>
      <span aria-live="polite" className="px-1 text-[13.5px] select-all">
        {copied ? `已複製 Email：${EMAIL}` : EMAIL}
      </span>
    </div>
  );
}
