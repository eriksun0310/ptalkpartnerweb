import { Fragment } from 'react';
import { ContractSection } from '@/components/ContractSection';
import { EarningsCalculator } from '@/components/EarningsCalculator';
import {
  CONVERSION_ROWS,
  NET_RATE,
  TIER_ROWS,
  UNIT_PRICE,
  formatPercent,
} from '@/lib/tiers';

/** 市場行情對照（以佔使用者付款總額的比例計）；bar 寬度即區間上限 */
const MARKET_ROWS = [
  { label: '實體電商聯盟', range: '3–8%', width: 8, own: false },
  { label: '一般 App 推廣', range: '5–15%', width: 15, own: false },
  { label: 'PTalk 合作夥伴', range: '6.7–20%', width: 20, own: true },
  { label: '數位課程 / 軟體', range: '20–40%', width: 40, own: false },
] as const;

const FAQS = [
  {
    q: '我要怎麼知道自己賣了幾筆？',
    a: [
      '每月結算時我們會主動整理給你，包含下載次數、付費人數（賣出幾筆）、銷售額、當期實收率、分潤基準金額、適用級距與本月分潤。',
      '而且會附上 Apple 官方報表的截圖給你核對（其他夥伴的資料會遮蔽）—— 數字不是我們自己算的，是平台官方數據。收到回報後 14 日內都可以提出疑問，我們一起核對。',
      '沒辦法讓你隨時自己登入查，是因為 Apple 後台沒有「只看單一推廣連結」的權限層級，開權限就會看到我們全部營收與其他夥伴的資料。之後合作規模成長，我們會考慮做一個夥伴後台讓你隨時查。',
    ],
    open: true,
  },
  {
    q: '為什麼剛開始看不到數據？',
    a: [
      'Apple 為保護使用者隱私，數據要在所查詢的那段期間內達到 5 次以上才會顯示。低於 5 就是空白。',
      '這是每個期間各自判定，不是累積滿 5 就永久解鎖。例如 8 月有 3 次、9 月有 4 次，單獨查都看不到，但查 8-9 月合計 7 次就看得到。',
      '這只是看不到數字，不是沒有成效、也不是拿不到分潤。遇到這種情況我們會把查詢期間拉長，取得合計數據後照樣算給你。',
    ],
    open: true,
  },
  {
    q: '24 小時是指要在一天內購買嗎？',
    a: [
      '不是。24 小時管的是「下載」，不是「購買」 —— 使用者點你的連結後，只要在 24 小時內完成下載安裝，歸因就成立了。',
      '之後他什麼時候內購都算你的：第 3 天、一個月後、甚至更久，只要是同一次安裝，那筆購買都會計入你的成效。因為 App 下載免費、內購才付費，這對你是有利的 —— 你只要讓人先下載就好。',
      '會不算的情況是相反的：他點了連結卻沒在 24 小時內下載，兩天後才自己去商店搜尋安裝 —— 那次安裝就不會歸到你的連結，之後的購買也不算。',
      '另外若使用者刪除 App 後重裝、或換手機重新下載，原本的歸因關係可能會中斷。',
    ],
    open: false,
  },
  {
    q: '如果使用者點過好幾個人的連結呢？',
    a: [
      'Apple 採 last-touch 歸因 —— 只算最後一次點擊的那個連結。',
      '所以如果對方先點你的、之後又點了別人的才下載，那筆會算給後者。這是 Apple 平台規則，我們無法調整或覆寫。',
    ],
    open: false,
  },
  {
    q: '使用者退款會怎麼算？',
    a: ['退款的金額會從分潤基準中扣除，相應分潤也不計算。退款由 Apple 審核決定，不是我們能控制的。'],
    open: false,
  },
  {
    q: '我可以修改連結嗎？',
    a: [
      '不行。連結裡有追蹤參數，修改過的連結會完全無法追蹤，透過它產生的下載與購買都無法計入分潤。直接複製分享就好。',
    ],
    open: false,
  },
  {
    q: '對數字有疑問怎麼辦？',
    a: [
      '收到回報後 14 日內可以提出，我們會提供 Apple 官方報表的截圖給你核對（為保護其他合作夥伴，無關的部分會遮蔽）。',
      '一律以 Apple 官方報表為準，我們自己的統計只是參考。',
    ],
    open: false,
  },
] as const;

const AVOID = [
  '不實或誤導性的宣傳',
  '用程式、機器人等非自然方式衝下載或購買',
  '用返現、獎勵誘導沒有真實使用意願的人下載',
  '損害 App 商譽的行為',
] as const;

export default function Home() {
  const netPercent = Math.round(NET_RATE * 100);
  const feeAndTax = UNIT_PRICE - Math.round(UNIT_PRICE * NET_RATE);

  return (
    <div className="mx-auto max-w-[780px] px-5 pb-24">
      {/* ---------- hero ---------- */}
      <header className="pt-14 pb-10 sm:pt-16" data-print="hide">
        <span className="inline-block rounded-full bg-brand-2 px-3 py-1 text-xs font-bold tracking-[0.14em] text-brand uppercase">
          PTalk 合作夥伴計劃
        </span>
        <h1 className="mt-5 mb-3.5 text-[clamp(30px,5.6vw,46px)]/[1.2] font-bold tracking-tight text-balance">
          你帶來的銷售越多，
          <br />
          分潤比例就越高。
        </h1>
        <p className="max-w-[34ch] text-lg text-ink-2">
          我們提供 <strong className="text-ink">App 專屬推薦連結</strong>
          ，只要有人透過你的連結下載並購買，你就能拿到分潤 —— 最高{' '}
          <strong className="text-ink">30%</strong>。
        </p>
      </header>

      {/* ---------- tiers ---------- */}
      <section className="py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">分潤級距</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          依當月分潤基準金額認定，達到門檻後<strong className="text-ink">當月全額</strong>
          都用新比例計算。
        </p>

        <ul className="flex flex-col gap-2">
          {TIER_ROWS.map((t) => (
            <li
              key={t.rate}
              className="relative grid grid-cols-[1fr_auto] items-center gap-3.5 overflow-hidden rounded-xl border border-line bg-card px-4 py-3.5"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-brand"
                style={{ opacity: t.weight }}
              />
              <span className="text-[15px] text-ink-2">
                {t.label.startsWith('未達') ? (
                  <>
                    未達 <b className="font-semibold text-ink">{t.label.slice(3)}</b>
                  </>
                ) : (
                  <>
                    <b className="font-semibold text-ink">{t.label.replace(' 以上', '')}</b> 以上
                  </>
                )}
              </span>
              <span className="text-[27px] font-bold text-brand tabular-nums tracking-tight">
                {formatPercent(t.rate)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3.5 rounded-xl border border-line bg-card px-5 py-4">
          <h3 className="mb-1.5 text-base font-semibold">全額套用，不是分段計算</h3>
          <p className="text-[14.5px] text-ink-2">
            例如當月基準金額 NT$10,000，適用 25%，你拿{' '}
            <strong className="text-ink">NT$2,500</strong> —— 不是前 5,000 用 20%、後 5,000 用
            25%。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            級距每月獨立計算，這個月做到 20%，下個月從 10% 重新起算。
          </p>
        </div>
      </section>

      {/* ---------- calculator + proof + benchmark ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">試算你能拿多少</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">拉動滑桿，看不同銷售量對應的分潤。</p>

        <EarningsCalculator />

        {/* 實績 */}
        <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-line-2 border-l-4 border-l-brand bg-card px-5 py-4 sm:flex-row sm:items-center sm:gap-5">
          <span className="text-[38px]/none font-bold text-brand tabular-nums tracking-tight sm:text-[46px]">
            100
          </span>
          <span>
            <strong className="block text-base">我們最高的那幾天，賣出 100 筆。</strong>
            <span className="text-sm text-ink-2">
              2026 年 8 月 14–15 日的高峰期間，壽司日檢單一內購項目的實際成交筆數，
              同期 App 下載超過 2,300 次。市場需求是有的 —— 曝光對了，量就會來。
            </span>
          </span>
        </div>

        {/* 高低比較 */}
        <div className="mt-4 rounded-xl border border-line bg-card px-5 py-5 sm:px-6">
          <h3 className="mb-1.5 text-[17px] font-semibold">這個比例算高還是低？</h3>
          <p className="mb-4 max-w-[54ch] text-[14.5px] text-ink-2">
            我們把話講清楚 —— 你的分潤是從「我們實收」計算，不是從「用戶付款總額」。
            換算成用戶付款的比例會比級距數字低，這點先說明。
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            {[
              { k: '用戶付款', v: `NT$${UNIT_PRICE}`, muted: false },
              { k: '平台手續費 + 稅', v: `−NT$${feeAndTax}`, muted: true },
              { k: '我們實收（分潤基準）', v: `NT$${UNIT_PRICE - feeAndTax}`, muted: false },
            ].map((s, i) => (
              <Fragment key={s.k}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden self-center text-[15px] text-ink-3 sm:inline"
                  >
                    →
                  </span>
                )}
                <div
                  className={`flex flex-1 flex-col rounded-lg bg-sunk px-3.5 py-2.5 ${s.muted ? 'opacity-70' : ''}`}
                >
                  <span className="text-xs font-semibold text-ink-3">{s.k}</span>
                  <span className="text-[19px] font-bold tabular-nums tracking-tight">{s.v}</span>
                </div>
              </Fragment>
            ))}
          </div>

          <p className="mt-2.5 max-w-[56ch] text-[13px] text-ink-3">
            那 NT${feeAndTax} 是 Apple 與各地稅務機關收走的，我們也拿不到，所以不列入分潤基準。
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-line">
            <table className="w-full border-collapse text-[14.5px]">
              <thead>
                <tr>
                  <th className="border-b border-line bg-sunk px-4 py-2.5 text-left text-[12.5px] font-bold whitespace-nowrap text-ink-3">
                    當你適用的分潤比例
                  </th>
                  <th className="border-b border-line bg-sunk px-4 py-2.5 text-right text-[12.5px] font-bold whitespace-nowrap text-ink-3">
                    每筆你拿
                  </th>
                  <th className="border-b border-line bg-sunk px-4 py-2.5 text-right text-[12.5px] font-bold whitespace-nowrap text-ink-3">
                    相當於用戶付款的
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONVERSION_ROWS.map((r) => (
                  <tr key={r.rate}>
                    <td className="border-b border-line px-4 py-2.5 last:border-0">
                      {formatPercent(r.rate)}
                    </td>
                    <td className="border-b border-line px-4 py-2.5 text-right tabular-nums">
                      NT${r.perUnit}
                    </td>
                    <td className="border-b border-line px-4 py-2.5 text-right tabular-nums">
                      約 {(r.ofGross * 100).toFixed(1).replace(/\.0$/, '')}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-5 mb-1.5 text-[17px] font-semibold">跟市場行情比</h3>
          <div className="flex flex-col gap-2.5">
            {MARKET_ROWS.map((m) => (
              <div
                key={m.label}
                className="grid grid-cols-[104px_1fr_56px] items-center gap-2 text-[12.5px] sm:grid-cols-[130px_1fr_62px] sm:gap-3 sm:text-[13.5px]"
              >
                <span className={m.own ? 'font-bold text-ink' : 'text-ink-2'}>{m.label}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-sunk">
                  <i
                    className={`block h-full rounded-full ${m.own ? 'bg-brand' : 'bg-line-2'}`}
                    style={{ width: `${m.width * 2.5}%` }}
                  />
                </span>
                <span
                  className={`text-right tabular-nums ${m.own ? 'font-bold text-brand' : 'text-ink-3'}`}
                >
                  {m.range}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 max-w-[56ch] text-[13px] text-ink-3">
            以佔用戶付款總額的比例比較。我們的級距橫跨一般 App 推廣到數位課程的區間 ——
            <strong className="text-ink-2">做得越多，比例越接近頂端。</strong>
          </p>
        </div>
      </section>

      {/* ---------- 分潤基準金額 ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">
          「分潤基準金額」是什麼
        </h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          分潤以<strong className="text-ink">我們實際收到的金額</strong>
          計算，不是使用者付款的總額。
        </p>

        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full border-collapse text-[14.5px]">
            <tbody>
              <tr>
                <td className="border-b border-line px-4 py-2.5">使用者付款</td>
                <td className="border-b border-line px-4 py-2.5 text-right tabular-nums">
                  NT${UNIT_PRICE}
                </td>
              </tr>
              <tr>
                <td className="border-b border-line px-4 py-2.5">− 台灣營業稅</td>
                <td className="border-b border-line px-4 py-2.5 text-right tabular-nums">約 NT$4</td>
              </tr>
              <tr>
                <td className="border-b border-line px-4 py-2.5">− Apple 平台手續費</td>
                <td className="border-b border-line px-4 py-2.5 text-right tabular-nums">
                  約 NT${feeAndTax - 4}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold">= 我們實收（分潤基準）</td>
                <td className="px-4 py-2.5 text-right font-bold tabular-nums">
                  約 NT${UNIT_PRICE - feeAndTax}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3.5 rounded-xl border border-line bg-card px-5 py-4">
          <h3 className="mb-1.5 text-base font-semibold">為什麼扣掉這些</h3>
          <p className="text-[14.5px] text-ink-2">
            平台手續費與各地稅金是 <strong className="text-ink">Apple 直接扣掉</strong>
            的，不會進到我們手上 —— 這部分我們跟你一樣拿不到。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            剩下的部分我們還要負擔 App 開發、伺服器與內容製作成本。所以級距設計的用意是
            —— <strong className="text-ink">你做得越多，拿的比例越高</strong>，一起把餅做大。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            每月回報都會列出<strong className="text-ink">銷售額、實收率、分潤基準</strong>
            三個數字，你可以自己驗算。
          </p>
        </div>

        <div className="mt-3.5 rounded-xl border border-line bg-card px-5 py-4">
          <h3 className="mb-1.5 text-base font-semibold">實收率會變動</h3>
          <p className="text-[14.5px] text-ink-2">
            實收率目前約 <strong className="text-ink">{netPercent}%</strong>
            ，會因銷售地區組成（各地稅率不同）、平台費率與稅法調整而變化。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            我們會在每月成效回報中載明
            <strong className="text-ink">當期實際使用的實收率</strong>
            ，該比例由當月財務報表的實際數字計算，不是估算值。你可以據此自行驗算。
          </p>
        </div>
      </section>

      {/* ---------- Apple vs Android ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">Apple 與 Android</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          你會拿到兩個連結，但<strong className="text-ink">分潤以 Apple 的數據計算</strong>。
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-card px-4 py-4">
            <p className="mb-1.5 flex items-center gap-2 text-[15px] font-bold">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
              Apple App Store
            </p>
            <p className="text-sm text-ink-2">
              報表可以看到每個連結各自帶來多少購買金額，所以能算分潤。
            </p>
          </div>
          <div className="rounded-xl border border-line bg-card px-4 py-4">
            <p className="mb-1.5 flex items-center gap-2 text-[15px] font-bold">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-alert" />
              Google Play
            </p>
            <p className="text-sm text-ink-2">
              流量數據看得到，但金額報表沒有連結欄位 —— 無法對應是誰帶來的。
            </p>
          </div>
        </div>

        <p className="mt-4 text-[15px] text-ink-2">
          這不是我們不想算，是 Google Play 目前沒有提供這份資料。
          未來若平台開放訂單層級的歸因，我們會通知你並重新討論。
        </p>

        <div className="my-4 rounded-xl border border-alert/30 bg-alert-2 px-5 py-4">
          <p className="mb-1.5 text-xs font-bold tracking-[0.1em] text-alert uppercase">
            請這樣分享
          </p>
          <p className="text-[14.5px]">
            <strong>主要分享 Apple 連結。</strong>
            如果有粉絲問「安卓怎麼下載？」，再於留言或私訊補上 Play 連結。
          </p>
          <p className="mt-2 text-[14.5px]">
            別把 Apple 連結給安卓用戶 —— 安卓手機點開只會看到網頁，裝不了 App，對方會直接放棄。
          </p>
        </div>

        <p className="text-[15px] text-ink-2">
          Play 的推廣成效我們仍會參考（例如續約評估時），只是不直接計入分潤。
        </p>
      </section>

      {/* ---------- 結算與匯款 ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-balance">結算與匯款</h2>

        <ol className="flex flex-col gap-3">
          {[
            {
              t: '結算期間：每月 1 日至月底',
              b: '以 Apple 官方報表的月度數據為準。',
            },
            {
              t: '回報與匯款：次月月底前',
              b: '當日資料要兩天後才完整，加上平台結算時間，所以在次月處理。',
            },
            {
              t: '累計滿 NT$1,000 才匯款',
              b: '海外帳戶為 NT$5,000。未達門檻會跨月累計，不會作廢、不會歸零。',
            },
          ].map((s, i) => (
            <li key={s.t} className="flex items-start gap-4">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-bold text-bg">
                {i + 1}
              </span>
              <span>
                <strong className="block text-base">{s.t}</strong>
                <span className="text-[14.5px] text-ink-2">{s.b}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-xl border border-line bg-card px-5 py-4">
          <h3 className="mb-1.5 text-base font-semibold">匯款手續費</h3>
          <p className="text-[14.5px] text-ink-2">
            <strong className="text-ink">台灣帳戶：我們負擔</strong>
            （含跨行手續費），你拿到的是完整金額。
            海外帳戶因國際電匯成本較高，由收款方負擔，我們會在匯款前告知預估金額。
          </p>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">
          你需要先知道的追蹤限制
        </h2>
        <p className="mb-3 max-w-[46ch] text-ink-2">
          這些都是平台機制，我們也無法調整。事先講清楚，避免之後有誤會。
        </p>

        <div className="flex flex-col">
          {FAQS.map((f) => (
            <details key={f.q} open={f.open} className="border-b border-line py-1">
              <summary className="flex cursor-pointer items-baseline justify-between gap-3.5 py-3 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand">
                {f.q}
                <span aria-hidden="true" className="shrink-0 text-xl/none text-ink-3">
                  ＋
                </span>
              </summary>
              <div className="max-w-[58ch] pb-4 text-[15px] text-ink-2">
                {f.a.map((p) => (
                  <p key={p} className="mb-2.5 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- 推廣時請避免 ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">推廣時請避免</h2>
        <p className="mb-4 max-w-[46ch] text-ink-2">
          這些行為可能導致平台判定異常，連帶影響該期分潤。
        </p>
        <ul className="overflow-hidden rounded-xl border border-line">
          {AVOID.map((a) => (
            <li
              key={a}
              className="border-b border-line bg-card px-4 py-2.5 text-[14.5px] last:border-0"
            >
              {a}
            </li>
          ))}
        </ul>
      </section>

      <ContractSection />

      <footer className="mt-10 border-t border-line pt-6 text-[13.5px] text-ink-3" data-print="hide">
        <p className="mb-2 max-w-[60ch]">
          本頁為合作條件說明，實際權利義務以雙方簽署之合約為準。
          試算結果為估算，實際分潤依 Apple 官方報表數字計算。
        </p>
        <p className="max-w-[60ch]">
          Apple 平台規則（顯示門檻、24 小時歸因窗口、last-touch 歸因、資料延遲）
          由 Apple 訂定，非本公司可調整。
        </p>
      </footer>
    </div>
  );
}
