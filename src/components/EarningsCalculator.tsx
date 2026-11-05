'use client';

import { useMemo, useState } from 'react';
import { estimate, formatPercent, formatTwd, NET_RATE, UNIT_PRICE } from '@/lib/tiers';

/**
 * 分潤試算器。拉動滑桿即時換算基準金額、適用級距與應得分潤，
 * 並提示距離下一階還差幾筆 —— 讓級距從「遙遠門檻」變成可行目標。
 */
export function EarningsCalculator() {
  const [qty, setQty] = useState(60);
  const result = useMemo(() => estimate(qty), [qty]);

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-[0_1px_0_var(--line),0_12px_32px_-18px_rgb(59_42_34/0.25)]">
      <div className="px-5 pt-5 pb-1.5 sm:px-6">
        <label
          htmlFor="qty"
          className="mb-2.5 block text-[13px] font-bold tracking-wide text-ink-3"
        >
          當月透過你的連結完成購買的筆數
        </label>
        <div className="flex items-center gap-4">
          <input
            id="qty"
            type="range"
            min={0}
            max={400}
            step={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="h-6 flex-1 accent-brand"
          />
          <div className="shrink-0">
            <span className="text-3xl font-bold tabular-nums tracking-tight">{qty}</span>
            <span className="ml-1 text-sm font-medium text-ink-3">筆</span>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 border-t border-line sm:grid-cols-3">
        <div className="border-r border-b border-line px-5 py-4 sm:border-b-0">
          <dt className="text-xs font-bold tracking-wide text-ink-3">分潤基準金額</dt>
          <dd className="mt-0.5 text-[23px] font-bold tabular-nums tracking-tight">
            {formatTwd(result.base)}
          </dd>
          <p className="mt-0.5 text-xs text-ink-3">我們實收的部分</p>
        </div>

        <div className="border-b border-line px-5 py-4 sm:border-r sm:border-b-0">
          <dt className="text-xs font-bold tracking-wide text-ink-3">適用級距</dt>
          <dd className="mt-0.5 text-[23px] font-bold tabular-nums tracking-tight">
            {formatPercent(result.rate)}
          </dd>
          <p className="mt-0.5 text-xs text-ink-3">
            {qty === 0
              ? '—'
              : result.next
                ? `再 ${result.next.needQty} 筆可達 ${formatPercent(result.next.rate)}`
                : '已達最高級距'}
          </p>
        </div>

        <div className="col-span-2 bg-brand-2 px-5 py-4 sm:col-span-1">
          <dt className="text-xs font-bold tracking-wide text-ink-3">你的分潤</dt>
          <dd className="mt-0.5 text-[28px] font-bold text-brand sm:text-[23px] tabular-nums tracking-tight">
            {formatTwd(result.share)}
          </dd>
          <p className="mt-0.5 text-xs text-ink-3">
            {result.share === 0
              ? '—'
              : result.payableThisMonth
                ? '已達匯款門檻'
                : '累計滿 NT$1,000 就會匯款'}
          </p>
        </div>
      </dl>

      <p className="border-t border-line bg-sunk px-5 py-3.5 text-[13.5px] text-ink-2">
        以壽司日檢單價 NT${UNIT_PRICE}、實收率{' '}
        <span className="tabular-nums">{Math.round(NET_RATE * 100)}%</span> 估算，實際依 Apple
        官方報表為準。
      </p>
    </div>
  );
}
