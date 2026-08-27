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
      '每個月結算的時候，我們會主動整理給你，包含下載次數、付費人數（也就是賣出幾筆）、銷售額、當期實收率、分潤基準金額、適用級距，還有這個月的分潤金額。',
      '而且會附上 Apple 官方報表的截圖給你核對，其他夥伴的資料會遮蔽起來保護隱私——這些數字不是我們自己算出來的，是平台的官方數據。收到回報後的 14 天內，你隨時都可以提出疑問，我們會一起核對清楚。',
      '目前沒辦法讓你自己隨時登入查詢，是因為 Apple 後台沒有「只看單一推廣連結」這樣的權限層級，一旦開放權限，就會看到我們全部的營收跟其他夥伴的資料了。之後合作規模如果成長，我們會考慮做一個夥伴後台，讓你可以隨時自己查看。',
    ],
    open: true,
  },
  {
    q: '為什麼剛開始看不到數據？',
    a: [
      '這是因為 Apple 為了保護使用者隱私，數據要在你查詢的那段期間內達到 5 次以上才會顯示出來，低於 5 次的話畫面就會是空白的。',
      '這個是每個查詢期間各自判定的，不是說累積滿 5 次就永久解鎖囉。舉例來說，8 月有 3 次、9 月有 4 次，分開查都會看不到，但如果查 8 月到 9 月合計 7 次，就看得到了。',
      '想跟你說明的是，這只是暫時看不到數字而已，不代表沒有成效，更不會影響你的分潤。遇到這種情況，我們會把查詢期間拉長，等取得合計數據之後，照樣會算給你，請放心。',
    ],
    open: true,
  },
  {
    q: '24 小時是指要在一天內購買嗎？',
    a: [
      '不是唷，24 小時管的其實是「下載」，不是「購買」。只要使用者點了你的連結之後，在 24 小時內完成下載安裝，這筆歸因就成立了。',
      '之後不管他什麼時候內購都算你的——第 3 天、一個月後，甚至更久都可以，只要是同一次安裝，那筆購買都會算進你的成效裡。因為 App 下載是免費的，內購才需要付費，這其實對你蠻有利的，你只要能讓人願意先下載就好。',
      '反過來說，如果他點了連結卻沒有在 24 小時內下載，過了兩天才自己去商店搜尋安裝，那次安裝就不會歸到你的連結，之後的購買也不會算進去，這點要提醒你注意一下。',
      '另外，如果使用者刪除 App 後重新安裝，或是換了手機重新下載，原本的歸因關係有可能會中斷，這是平台機制的限制。',
    ],
    open: false,
  },
  {
    q: '如果使用者點過好幾個人的連結呢？',
    a: [
      'Apple 採用的是「last-touch」歸因，也就是只會算最後一次點擊的那個連結。',
      '所以如果對方先點了你的連結，之後又點了別人的連結才下載，那這筆就會算給後面那個人了。這是 Apple 平台本身的規則，我們沒辦法調整或覆寫，先讓你知道一下。',
    ],
    open: false,
  },
  {
    q: '使用者退款會怎麼算？',
    a: [
      '退款的金額會從分潤基準中扣除，對應的分潤也就不會計算進去了。退款是由 Apple 審核決定的，這部分我們沒辦法控制，還請你理解。',
    ],
    open: false,
  },
  {
    q: '我可以修改連結嗎？',
    a: [
      '這個部分要麻煩你不要修改喔，連結裡面有追蹤參數，改過的連結會完全沒辦法追蹤，透過它產生的下載跟購買都無法算進分潤裡面。直接複製分享出去就可以了，很簡單。',
    ],
    open: false,
  },
  {
    q: '對數字有疑問怎麼辦？',
    a: [
      '收到回報後的 14 天內都可以隨時跟我們提出，我們會提供 Apple 官方報表的截圖給你核對，為了保護其他合作夥伴，跟你無關的部分會做遮蔽處理。',
      '最終都會以 Apple 官方報表為準，我們自己的統計只是提供給你參考而已。',
    ],
    open: false,
  },
] as const;

const AVOID = [
  '不實或誤導性的宣傳',
  '用程式、機器人等非自然的方式衝下載或購買',
  '用返現、獎勵這類方式，誘導沒有真實使用意願的人下載',
  '有損害 App 商譽的行為',
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
          我們會給你一個<strong className="text-ink">專屬的 App 推薦連結</strong>
          ，分享給朋友、粉絲或社群都可以。只要有人透過這個連結下載並購買，你就能拿到分潤，最高可以到{' '}
          <strong className="text-ink">30%</strong>。
        </p>
      </header>

      {/* ---------- tiers ---------- */}
      <section className="py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">分潤級距</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          分潤比例會依照你當月的分潤基準金額來看，只要達到門檻，
          <strong className="text-ink">當月全部</strong>
          都會用新的比例計算給你，不用等到下個月。
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
            舉例來說，如果當月基準金額是 NT$10,000，適用 25%，你就能拿到{' '}
            <strong className="text-ink">NT$2,500</strong> —— 不是前面 5,000 算 20%、後面 5,000
            才算 25% 喔，是全部一起用 25% 算給你。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            級距是每個月重新計算的，這個月做到 20%，下個月會從 10% 重新開始算，提醒你留意一下。
          </p>
        </div>
      </section>

      {/* ---------- calculator + proof + benchmark ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">試算你能拿多少</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          拉拉看下面的滑桿，馬上就能看到不同銷售量對應的分潤金額。
        </p>

        <EarningsCalculator />

        {/* 實績 */}
        <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-line-2 border-l-4 border-l-brand bg-card px-5 py-4 sm:flex-row sm:items-center sm:gap-5">
          <span className="text-[38px]/none font-bold text-brand tabular-nums tracking-tight sm:text-[46px]">
            100
          </span>
          <span>
            <strong className="block text-base">我們最高的那幾天，賣出了 100 多筆。</strong>
            <span className="text-sm text-ink-2">
              這是 2026 年 8 月 14–15 日高峰期間，壽司日檢單一內購項目的實際成交筆數，
              同期 App 下載超過 2,300 次。市場的需求一直都在，只要曝光對了，量自然就會來。
            </span>
          </span>
        </div>

        {/* 高低比較 */}
        <div className="mt-4 rounded-xl border border-line bg-card px-5 py-5 sm:px-6">
          <h3 className="mb-1.5 text-[17px] font-semibold">這個比例算高還是低？</h3>
          <p className="mb-4 max-w-[54ch] text-[14.5px] text-ink-2">
            先跟你說明清楚一件事：你的分潤是從我們實際收到的金額來算的，不是從使用者付款的總額去算。
            換算成使用者付款的比例，會比級距上寫的數字低一些，這點想先讓你知道，避免之後有落差感。
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
            這中間扣掉的 NT${feeAndTax}，是 Apple 平台手續費和各地稅金收走的，我們自己也拿不到，
            所以沒有算進分潤基準裡面。
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
            這裡是用佔使用者付款總額的比例來比較的。可以看到我們的級距，其實已經涵蓋了一般 App
            推廣到數位課程的區間 ——
            <strong className="text-ink-2">你做得越多，比例就會越接近最頂端。</strong>
          </p>
        </div>
      </section>

      {/* ---------- 分潤基準金額 ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">
          「分潤基準金額」是什麼
        </h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          這裡想跟你說明一下，分潤是用<strong className="text-ink">我們實際收到的金額</strong>
          來計算，不是使用者付款的總額喔，這個差異蠻重要的，先讓你了解一下。
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
            平台手續費跟各地稅金，是 <strong className="text-ink">Apple 直接扣掉</strong>
            的，不會進到我們手上，這部分我們跟你一樣，也是拿不到的。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            剩下的部分，我們還要負擔 App 開發、伺服器跟內容製作的成本。所以我們把級距設計成這樣，就是希望
            —— <strong className="text-ink">你做得越多，能拿的比例也越高</strong>，一起把餅做大。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            每個月的回報都會列出<strong className="text-ink">銷售額、實收率、分潤基準</strong>
            這三個數字給你，你隨時都可以自己核對驗算。
          </p>
        </div>

        <div className="mt-3.5 rounded-xl border border-line bg-card px-5 py-4">
          <h3 className="mb-1.5 text-base font-semibold">實收率會變動</h3>
          <p className="text-[14.5px] text-ink-2">
            實收率目前大約是 <strong className="text-ink">{netPercent}%</strong>
            ，會因為銷售地區的組成（各地稅率不太一樣）、還有平台費率或稅法的調整而有些變化。
          </p>
          <p className="mt-2 text-[14.5px] text-ink-2">
            我們每個月的成效回報都會清楚寫出
            <strong className="text-ink">當期實際用的實收率</strong>
            ，這個數字是照當月財務報表的實際情況算出來的，不是隨便估的，你可以放心拿來核對。
          </p>
        </div>
      </section>

      {/* ---------- Apple vs Android ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">Apple 與 Android</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          我們會給你兩個連結，不過<strong className="text-ink">分潤的計算是以 Apple 的數據為準</strong>。
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-card px-4 py-4">
            <p className="mb-1.5 flex items-center gap-2 text-[15px] font-bold">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
              Apple App Store
            </p>
            <p className="text-sm text-ink-2">
              報表可以清楚看到每個連結各自帶來多少購買金額，所以能夠算出分潤。
            </p>
          </div>
          <div className="rounded-xl border border-line bg-card px-4 py-4">
            <p className="mb-1.5 flex items-center gap-2 text-[15px] font-bold">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-alert" />
              Google Play
            </p>
            <p className="text-sm text-ink-2">
              流量數據雖然看得到，但金額報表沒有連結欄位，沒辦法對應出是哪個連結帶來的。
            </p>
          </div>
        </div>

        <p className="mt-4 text-[15px] text-ink-2">
          不是我們不想幫你算這部分，是 Google Play 目前沒有提供這樣的資料給我們。
          如果之後平台有開放訂單層級的歸因功能，我們會第一時間通知你，重新一起討論。
        </p>

        <div className="my-4 rounded-xl border border-alert/30 bg-alert-2 px-5 py-4">
          <p className="mb-1.5 text-xs font-bold tracking-[0.1em] text-alert uppercase">
            請這樣分享
          </p>
          <p className="text-[14.5px]">
            <strong>平常主要分享 Apple 連結就好。</strong>
            如果有粉絲問「安卓要怎麼下載？」，再於留言或私訊補上 Play 連結給他們。
          </p>
          <p className="mt-2 text-[14.5px]">
            提醒你，Apple 連結不要給安卓用戶喔 ——
            安卓手機點開只會看到網頁，沒辦法安裝 App，對方可能就直接放棄了，蠻可惜的。
          </p>
        </div>

        <p className="text-[15px] text-ink-2">
          Play 這邊的推廣成效我們還是會參考，像是續約評估的時候都會看，只是暫時不會直接算進分潤裡面。
        </p>
      </section>

      {/* ---------- 結算與匯款 ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-5 text-2xl font-bold tracking-tight text-balance">結算與匯款</h2>

        <ol className="flex flex-col gap-3">
          {[
            {
              t: '結算期間：每月 1 日至月底',
              b: '會以 Apple 官方報表的月度數據為準。',
            },
            {
              t: '回報與匯款：次月月底前',
              b: '因為當日的資料要兩天後才會完整，加上平台結算需要一點時間，所以會放到次月處理，這點請你見諒。',
            },
            {
              t: '累計滿 NT$1,000 才匯款',
              b: '海外帳戶則是 NT$5,000。如果還沒到門檻也不用擔心，會自動跨月累計，不會作廢也不會歸零。',
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
            如果是<strong className="text-ink">台灣帳戶，手續費（含跨行）我們來負擔</strong>
            ，你拿到的會是完整金額。
            海外帳戶因為國際電匯的成本比較高，會由收款方負擔，不過我們會在匯款前先告知你預估金額，讓你心裡有數。
          </p>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-line py-11" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">
          幾個你會想先知道的追蹤細節
        </h2>
        <p className="mb-3 max-w-[46ch] text-ink-2">
          這些都是 Apple 平台本身的機制，我們沒辦法調整，先跟你說清楚，避免之後彼此有誤會。
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
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">
          推廣時想請你留意的幾件事
        </h2>
        <p className="mb-4 max-w-[46ch] text-ink-2">
          這些行為可能會被平台判定成異常，連帶也會影響到當期的分潤，提醒你多注意。
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
          這個頁面是合作條件的說明，實際的權利義務還是要以雙方簽署的合約為準。
          試算結果只是估算，實際分潤會依照 Apple 官方報表的數字來計算。
        </p>
        <p className="max-w-[60ch]">
          Apple 平台的規則（像是顯示門檻、24 小時歸因窗口、last-touch 歸因、資料延遲）
          都是由 Apple 訂定的，不是本公司可以調整的部分。
        </p>
      </footer>
    </div>
  );
}
