import Image from 'next/image';
import type { ReactNode } from 'react';
import { ContractSection } from '@/components/ContractSection';
import { EarningsCalculator } from '@/components/EarningsCalculator';
import { EmailButton } from '@/components/EmailButton';
import { StickyJoin } from '@/components/StickyJoin';
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

/** 可推廣的 App，依受眾分組；資料對照 PTalk 學習地圖（ptalklearnweb/data） */
const APP_GROUPS = [
  {
    audience: '你的受眾在學日文',
    hint: '從五十音到 N1，一路都有適合的工具',
    apps: [
      { id: 'sushijp', name: '壽司日檢', desc: '每天五分鐘背日檢單字', soon: false },
      { id: 'ninja-pigeon', name: '忍者信鴿', desc: '聽日文、練文法、讀短文', soon: false },
      { id: 'hitofude', name: '日日一字', desc: '一天一個字，手寫練日文', soon: false },
      { id: 'koko', name: 'KOKO', desc: '從機場到居酒屋，開口說日文', soon: false },
      { id: 'kana5min', name: '諧音五十音', desc: '台灣人專屬的假名諧音記憶法', soon: true },
      { id: 'sushitower', name: '壽司轉珠', desc: '拼日文單字的闖關遊戲', soon: true },
    ],
  },
  {
    audience: '你的受眾在準備多益',
    hint: '單字和職場情境各有一款',
    apps: [
      { id: 'pizzatoeic', name: '披薩多益', desc: '多益單字每天刷五分鐘', soon: false },
      { id: 'rooster-hero', name: '公雞超人', desc: '用職場情境闖關練多益', soon: false },
    ],
  },
  {
    audience: '你的受眾想戒手機、變自律',
    hint: '目前僅有 iPhone 版',
    apps: [{ id: 'lockin', name: 'Lock In', desc: '鎖住想戒的 App，許下承諾撐到底', soon: false }],
  },
] as const;

/** 實績卡上的圖示列（取已上架、辨識度高的幾款） */
const HERO_ICONS = ['sushijp', 'ninja-pigeon', 'koko', 'pizzatoeic', 'rooster-hero', 'hitofude'] as const;

const FAQS = [
  {
    q: '可以同時推好幾款 App 嗎？',
    a: [
      '可以的！建議先從一款 App 開始，等成效穩定之後，再跟我們申請其他 App 的專屬連結，每款 App 都會有自己的一組連結。',
      '要提醒你的是，每款 App 的分潤是分開計算的，級距也是各自認定，不會合併在一起。每個月的回報我們也會分別列出每款 App 的成效給你。',
    ],
  },
  {
    q: '我要怎麼知道自己賣了幾筆？',
    a: [
      '每個月結算的時候，我們會主動整理給你，包含下載次數、付費人數（也就是賣出幾筆）、銷售額、當期實收率、分潤基準金額、適用級距，還有這個月的分潤金額。',
      '而且會附上 Apple 官方報表的截圖給你核對，其他夥伴的資料會遮蔽起來保護隱私——這些數字不是我們自己算出來的，是平台的官方數據。收到回報後的 14 天內，你隨時都可以提出疑問，我們會一起核對清楚。',
      '目前沒辦法讓你自己隨時登入查詢，是因為 Apple 後台沒有「只看單一推廣連結」這樣的權限層級，一旦開放權限，就會看到我們全部的營收跟其他夥伴的資料了。之後合作規模如果成長，我們會考慮做一個夥伴後台，讓你可以隨時自己查看。',
    ],
  },
  {
    q: '為什麼剛開始看不到數據？',
    a: [
      '這是因為 Apple 為了保護使用者隱私，數據要在你查詢的那段期間內達到 5 次以上才會顯示出來，低於 5 次的話畫面就會是空白的。',
      '這個是每個查詢期間各自判定的，不是說累積滿 5 次就永久解鎖囉。舉例來說，8 月有 3 次、9 月有 4 次，分開查都會看不到，但如果查 8 月到 9 月合計 7 次，就看得到了。',
      '想跟你說明的是，這只是暫時看不到數字而已，不代表沒有成效，更不會影響你的分潤。遇到這種情況，我們會把查詢期間拉長，等取得合計數據之後，照樣會算給你，請放心。',
    ],
  },
  {
    q: '24 小時是指要在一天內購買嗎？',
    a: [
      '不是唷，24 小時管的其實是「下載」，不是「購買」。只要使用者點了你的連結之後，在 24 小時內完成下載安裝，這筆歸因就成立了。',
      '之後不管他什麼時候內購都算你的——第 3 天、一個月後，甚至更久都可以，只要是同一次安裝，那筆購買都會算進你的成效裡。因為 App 下載是免費的，內購才需要付費，這其實對你蠻有利的，你只要能讓人願意先下載就好。',
      '反過來說，如果他點了連結卻沒有在 24 小時內下載，過了兩天才自己去商店搜尋安裝，那次安裝就不會歸到你的連結，之後的購買也不會算進去，這點要提醒你注意一下。',
      '另外，如果使用者刪除 App 後重新安裝，或是換了手機重新下載，原本的歸因關係有可能會中斷，這是平台機制的限制。',
    ],
  },
  {
    q: '如果使用者點過好幾個人的連結呢？',
    a: [
      'Apple 採用的是「last-touch」歸因，也就是只會算最後一次點擊的那個連結。',
      '所以如果對方先點了你的連結，之後又點了別人的連結才下載，那這筆就會算給後面那個人了。這是 Apple 平台本身的規則，我們沒辦法調整或覆寫，先讓你知道一下。',
    ],
  },
  {
    q: '使用者退款會怎麼算？',
    a: [
      '退款的金額會從分潤基準中扣除，對應的分潤也就不會計算進去了。退款是由 Apple 審核決定的，這部分我們沒辦法控制，還請你理解。',
    ],
  },
  {
    q: '我可以修改連結嗎？',
    a: [
      '這個部分要麻煩你不要修改喔，連結裡面有追蹤參數，改過的連結會完全沒辦法追蹤，透過它產生的下載跟購買都無法算進分潤裡面。直接複製分享出去就可以了，很簡單。',
    ],
  },
  {
    q: '對數字有疑問怎麼辦？',
    a: [
      '收到回報後的 14 天內都可以隨時跟我們提出，我們會提供 Apple 官方報表的截圖給你核對，為了保護其他合作夥伴，跟你無關的部分會做遮蔽處理。',
      '最終都會以 Apple 官方報表為準，我們自己的統計只是提供給你參考而已。',
    ],
  },
] as const;

const AVOID = [
  '不實或誤導性的宣傳',
  '用程式、機器人等非自然的方式衝下載或購買',
  '用返現、獎勵這類方式，誘導沒有真實使用意願的人下載',
  '有損害 App 商譽的行為',
] as const;

/** 合作細則的摺疊項目：標題＋一句重點，點開才看完整說明 */
function DetailItem({
  title,
  teaser,
  children,
}: {
  title: string;
  teaser: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-2xl bg-card shadow-[0_1px_0_var(--line)]">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand">
        <span>
          <span className="block text-[15.5px] font-bold">{title}</span>
          <span className="block text-[13px] text-ink-3">{teaser}</span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-xl/none text-ink-3 transition-transform group-open:rotate-45"
        >
          ＋
        </span>
      </summary>
      <div className="border-t border-line px-5 pt-4 pb-5 text-[14.5px] text-ink-2">{children}</div>
    </details>
  );
}

export default function Home() {
  const netPercent = Math.round(NET_RATE * 100);
  const feeAndTax = UNIT_PRICE - Math.round(UNIT_PRICE * NET_RATE);

  return (
    <div className="mx-auto max-w-[780px] px-5 pb-24">
      {/* ---------- hero ---------- */}
      <header id="hero" className="pt-14 pb-8 sm:pt-20" data-print="hide">
        <span className="inline-block rounded-full bg-brand-2 px-3.5 py-1 text-[13px] font-bold text-brand">
          PTalk 合作夥伴計劃
        </span>
        <h1 className="mt-5 mb-4 text-[clamp(32px,6vw,52px)]/[1.2] font-bold tracking-tight text-balance">
          隨手分享一個連結，
          <br />
          分潤最高 <span className="text-brand">30%</span>
        </h1>
        <p className="max-w-[36ch] text-lg text-ink-2">
          不用是網紅，也不用買廣告。我們會給你一個
          <strong className="text-ink">專屬的 App 推薦連結</strong>
          ，分享給朋友、學生或粉絲就好。有人透過它下載並購買，你就能拿到分潤，賣得越多比例越高。
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href="#join"
            className="rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-card transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand"
          >
            我想加入
          </a>
          <a href="#tiers" className="text-[15px] font-semibold text-ink-2 hover:text-ink">
            先看分潤怎麼算 ↓
          </a>
        </div>
      </header>

      {/* ---------- 夥伴實績 ---------- */}
      <section className="pb-12" data-print="hide">
        <div className="rounded-3xl bg-card px-6 py-6 shadow-[0_1px_0_var(--line),0_12px_32px_-18px_rgb(59_42_34/0.25)] sm:px-8 sm:py-7">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
            <span className="text-[44px]/none font-bold text-brand tabular-nums tracking-tight sm:text-[56px]">
              5,000+
            </span>
            <span>
              <strong className="block text-[17px]">
                只是隨手分享連結，一天就帶來超過 NT$5,000 的銷售。
              </strong>
              <span className="mt-1 block text-sm text-ink-2">
                2026 年 9 月 23 日，一位合作夥伴只是把專屬連結隨手分享出去，當天的銷售就超過
                NT$5,000，光這一天就跨過了 15% 的級距門檻。
              </span>
            </span>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
            <div className="flex shrink-0 -space-x-2.5">
              {HERO_ICONS.map((id) => (
                <Image
                  key={id}
                  src={`/apps/${id}.png`}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-[11px] ring-2 ring-card"
                />
              ))}
            </div>
            <span className="text-[13.5px] text-ink-2">
              目前有 <strong className="text-ink">9 款 App</strong> 可以推薦
            </span>
          </div>
        </div>
        <p className="mt-3 px-1 text-[13px] text-ink-3">
          壽司日檢在 2026 年 8 月高峰期間，也曾單日賣出 100 多筆。每個人的成效會因為受眾不同而有差異，以上僅供參考。
        </p>
      </section>

      {/* ---------- tiers ---------- */}
      <section id="tiers" className="scroll-mt-6 py-10" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">分潤級距</h2>
        <p className="mb-4 max-w-[46ch] text-ink-2">
          當月賣得越多，比例越高。達到門檻後，<strong className="text-ink">當月全部</strong>都用新的比例算給你。
        </p>

        <ul className="overflow-hidden rounded-2xl bg-card shadow-[0_1px_0_var(--line)]">
          {TIER_ROWS.map((t) => (
            <li
              key={t.rate}
              className="relative flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 last:border-0 sm:px-5"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-brand"
                style={{ opacity: t.weight }}
              />
              <span className="text-[14.5px] text-ink-2">
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
              <span className="text-[22px] font-bold text-brand tabular-nums tracking-tight">
                {formatPercent(t.rate)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 px-1 text-[13px] text-ink-3">
          金額指分潤基準金額（我們實收的部分）。級距每月重新計算，每款 App 各自計算。
        </p>
      </section>

      {/* ---------- 試算 ---------- */}
      <section className="py-10" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">試算你能拿多少</h2>
        <p className="mb-4 max-w-[46ch] text-ink-2">拉拉看滑桿，馬上看到不同銷售量能拿到的分潤。</p>
        <EarningsCalculator />
      </section>

      {/* ---------- 更多 App ---------- */}
      <section className="py-10" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">
          做出成績，你能推的不只一款
        </h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          先從一款開始，成效穩定後可以再申請其他 App 的連結。
          <strong className="text-ink">你分享一次，就可能接住受眾整段學習路上的需求。</strong>
        </p>

        <div className="flex flex-col gap-3.5">
          {APP_GROUPS.map((g) => (
            <div
              key={g.audience}
              className="rounded-3xl bg-card px-4 py-5 shadow-[0_1px_0_var(--line)] sm:px-6"
            >
              <h3 className="px-1 text-[16px] font-bold sm:px-0">{g.audience}</h3>
              <p className="mb-4 px-1 text-[13px] text-ink-3 sm:px-0">{g.hint}</p>
              <ul className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3.5">
                {g.apps.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3.5 sm:text-left"
                  >
                    <Image
                      src={`/apps/${a.id}.png`}
                      alt=""
                      width={52}
                      height={52}
                      className={`size-14 shrink-0 rounded-[15px] ring-1 ring-line sm:size-13 sm:rounded-[14px] ${a.soon ? 'opacity-60' : ''}`}
                    />
                    <span className="min-w-0">
                      <span className="flex flex-col items-center gap-1 text-[13.5px] font-bold sm:flex-row sm:gap-2 sm:text-[15px]">
                        {a.name}
                        {a.soon && (
                          <span className="rounded-full bg-sunk px-2 py-0.5 text-[11px] font-bold text-ink-2">
                            即將推出
                          </span>
                        )}
                      </span>
                      <span className="hidden text-[13px]/snug text-ink-2 sm:block">{a.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[14.5px] text-ink-2">
          每款 App 的分潤都是<strong className="text-ink">分開計算、各自認定級距</strong>的。想看每款 App
          的詳細介紹，可以到{' '}
          <a
            href="https://p-talk-learning-map.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand underline underline-offset-2"
          >
            PTalk 學習地圖
          </a>{' '}
          看看。
        </p>
      </section>

      {/* ---------- 加入 ---------- */}
      <section
        id="join"
        className="my-6 scroll-mt-6 rounded-3xl bg-brand px-6 py-9 text-card sm:px-10"
        data-print="hide"
      >
        <h2 className="mb-2 text-[26px]/snug font-bold tracking-tight text-balance">
          想試試看嗎？三個步驟就能開始
        </h2>
        <p className="mb-7 max-w-[42ch] text-[15.5px] opacity-90">
          不用先面談，也不用等審核，照著下面做就可以了。
        </p>

        <ol className="flex flex-col gap-6">
          <li className="flex items-start gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-[15px] font-bold text-brand">
              1
            </span>
            <span>
              <strong className="block text-[17px]">簽好合約</strong>
              <span className="text-[14.5px] opacity-90">
                合約在
                <a href="#sign" className="font-bold underline underline-offset-2">
                  頁面最下方
                </a>
                ，列印或存成 PDF 後，填上全名、簽署日期、合作起始日並簽名。
              </span>
            </span>
          </li>
          <li className="flex items-start gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-[15px] font-bold text-brand">
              2
            </span>
            <div className="min-w-0">
              <strong className="block text-[17px]">拍照傳給我們</strong>
              <span className="mb-3.5 block text-[14.5px] opacity-90">
                附上你想推哪款 App、平常在哪裡分享，用下面任一種方式傳過來都可以。
              </span>
              <div className="flex flex-wrap items-start gap-3">
                <EmailButton />
                <a
                  href="https://www.threads.com/@ptalk.design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-card/60 px-6 py-3 whitespace-nowrap text-[15px] font-bold transition-colors hover:border-card focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-card"
                >
                  Threads 私訊 @ptalk.design
                </a>
              </div>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-[15px] font-bold text-brand">
              3
            </span>
            <span>
              <strong className="block text-[17px]">收到你的專屬連結</strong>
              <span className="text-[14.5px] opacity-90">
                我們會在 3 個工作日內建立好連結傳給你，分享出去就開始計算分潤。
              </span>
            </span>
          </li>
        </ol>

        <p className="mt-7 border-t border-card/30 pt-5 text-[14px] opacity-90">
          還在考慮也沒關係，有任何問題都可以先用上面的方式問我們。
        </p>
      </section>

      {/* ---------- 合作細則 ---------- */}
      <section className="pt-12 pb-6" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">合作細則</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          分潤怎麼算、什麼時候匯款，以及 Apple 平台的規則。點開就能看詳細說明。
        </p>

        <div className="flex flex-col gap-2.5">
          <DetailItem title="級距怎麼認定" teaser="全額套用、每月重算、每款 App 分開算">
            <p>
              舉例來說，如果當月基準金額是 NT$10,000，適用 25%，你就能拿到{' '}
              <strong className="text-ink">NT$2,500</strong> —— 不是前面 5,000 算 20%、後面 5,000
              才算 25% 喔，是全部一起用 25% 算給你。
            </p>
            <p className="mt-2">
              級距是每個月重新計算的，這個月做到 20%，下個月會從 10% 重新開始算，提醒你留意一下。
            </p>
            <p className="mt-2">
              如果你同時推好幾款 App，<strong className="text-ink">每款 App 的級距是分開算的</strong>
              ，不會合併在一起。
            </p>
          </DetailItem>

          <DetailItem title="分潤基準金額是什麼" teaser="用戶付 NT$90，我們實收約 NT$60">
            <p className="mb-4">
              分潤是用<strong className="text-ink">我們實際收到的金額</strong>
              來計算，不是使用者付款的總額喔，這個差異蠻重要的，先讓你了解一下。
            </p>
        <div className="overflow-x-auto rounded-2xl border border-line">
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

        <div className="mt-3.5 rounded-2xl bg-sunk px-5 py-4">
          <h4 className="mb-1.5 text-[15px] font-bold">為什麼扣掉這些</h4>
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

        <div className="mt-3.5 rounded-2xl bg-sunk px-5 py-4">
          <h4 className="mb-1.5 text-[15px] font-bold">實收率會變動</h4>
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

            <h4 className="mt-5 mb-1.5 text-[15px] font-bold">這個比例算高還是低？</h4>
          <p className="mb-3 max-w-[54ch] text-[14.5px] text-ink-2">
            因為分潤是從我們實收的金額來算，換算成使用者付款的比例，會比級距上寫的數字低一些，先讓你知道，避免之後有落差感。
          </p>

          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full border-collapse text-[14.5px]">
              <thead>
                <tr>
                  <th className="border-b border-line bg-sunk px-3 py-2 sm:px-4 sm:py-2.5 text-left text-[12.5px] font-bold whitespace-nowrap text-ink-3">
                    你的級距
                  </th>
                  <th className="border-b border-line bg-sunk px-3 py-2 sm:px-4 sm:py-2.5 text-right text-[12.5px] font-bold whitespace-nowrap text-ink-3">
                    每筆你拿
                  </th>
                  <th className="border-b border-line bg-sunk px-3 py-2 sm:px-4 sm:py-2.5 text-right text-[12.5px] font-bold whitespace-nowrap text-ink-3">
                    佔用戶付款
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONVERSION_ROWS.map((r) => (
                  <tr key={r.rate}>
                    <td className="border-b border-line px-3 py-2 sm:px-4 sm:py-2.5 last:border-0">
                      {formatPercent(r.rate)}
                    </td>
                    <td className="border-b border-line px-3 py-2 sm:px-4 sm:py-2.5 text-right tabular-nums">
                      NT${r.perUnit}
                    </td>
                    <td className="border-b border-line px-3 py-2 sm:px-4 sm:py-2.5 text-right tabular-nums">
                      約 {(r.ofGross * 100).toFixed(1).replace(/\.0$/, '')}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mt-5 mb-2 text-[15px] font-bold">跟市場行情比</h4>
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
          </DetailItem>

          <DetailItem title="Apple 與 Android" teaser="分潤以 Apple 的數據為準">
            <p className="mb-4">
              我們會給你兩個連結，不過<strong className="text-ink">分潤的計算是以 Apple 的數據為準</strong>。
            </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-sunk px-4 py-4">
            <p className="mb-1.5 flex items-center gap-2 text-[15px] font-bold">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
              Apple App Store
            </p>
            <p className="text-sm text-ink-2">
              報表可以清楚看到每個連結各自帶來多少購買金額，所以能夠算出分潤。
            </p>
          </div>
          <div className="rounded-2xl bg-sunk px-4 py-4">
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

        <div className="my-4 rounded-2xl bg-sunk px-5 py-4">
          <p className="mb-1.5 text-[13px] font-bold text-ink-2">
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
          </DetailItem>

          <DetailItem title="結算與匯款" teaser="次月月初回報，次次月月中匯款">
        <ol className="flex flex-col gap-3">
          {[
            {
              t: '結算期間：每月 1 日至月底',
              b: '會以 Apple 官方報表的月度數據為準。',
            },
            {
              t: '回報：次月月初；匯款：次次月月中',
              b: 'Apple 會在次月月初提供上個月的財務報表，我們核算後就會回報給你；款項則要等 Apple 在次次月月初撥款給我們，才能再匯給你。例如 9 月的分潤，會在 10 月月初回報，11 月月中匯款，這點請你見諒。',
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

        <div className="mt-4 rounded-2xl bg-sunk px-5 py-4">
          <h4 className="mb-1.5 text-[15px] font-bold">匯款手續費</h4>
          <p className="text-[14.5px] text-ink-2">
            如果是<strong className="text-ink">台灣帳戶，手續費（含跨行）我們來負擔</strong>
            ，你拿到的會是完整金額。
            海外帳戶因為國際電匯的成本比較高，會由收款方負擔，不過我們會在匯款前先告知你預估金額，讓你心裡有數。
          </p>
        </div>
          </DetailItem>

          <DetailItem title="推廣時想請你留意的幾件事" teaser="避免被平台判定為異常">
            <p className="mb-4">
              這些行為可能會被平台判定成異常，連帶也會影響到當期的分潤，提醒你多注意。
            </p>
        <ul className="overflow-hidden rounded-2xl border border-line">
          {AVOID.map((a) => (
            <li
              key={a}
              className="border-b border-line bg-card px-4 py-2.5 text-[14.5px] last:border-0"
            >
              {a}
            </li>
          ))}
        </ul>
          </DetailItem>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="py-6" data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">常見問題</h2>
        <p className="mb-3 max-w-[46ch] text-ink-2">
          大多是 Apple 平台本身的追蹤機制，我們沒辦法調整，先跟你說清楚。
        </p>

        <div className="flex flex-col">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-line py-1">
              <summary className="flex cursor-pointer items-baseline justify-between gap-3.5 py-3 text-[15.5px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand">
                {f.q}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl/none text-ink-3 transition-transform group-open:rotate-45"
                >
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

      <ContractSection />

      <StickyJoin />

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
