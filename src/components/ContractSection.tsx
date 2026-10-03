'use client';

import { useRef, useState } from 'react';
import { TIER_ROWS, formatPercent } from '@/lib/tiers';

const STEPS = [
  {
    title: '檢視並列印合約',
    body: '點下方按鈕展開完整條款，用瀏覽器列印功能存成 PDF 或直接印出。',
  },
  {
    title: '填寫並簽名',
    body: '需要填的只有三項：你的全名簽署、簽署日期、合作起始日。收款帳戶另行提供給我們即可。',
  },
  {
    title: '拍照回傳',
    body: '簽好後拍照或掃描回傳給我們，我們會在 3 個工作日內建立你的專屬推廣連結。',
  },
] as const;

/** 合約條文：以陣列描述，避免長段 JSX 難以維護 */
const CLAUSES: ReadonlyArray<{
  heading: string;
  intro?: string;
  items?: readonly string[];
  outro?: string;
  table?: boolean;
  note?: string;
}> = [
  {
    heading: '第一條　合作內容',
    items: [
      '甲方提供乙方專屬推廣連結，乙方於其社群、網站或其他管道推廣甲方之 App。',
      '使用者透過乙方之推廣連結下載並完成 App 內購買者，甲方依本協議計算並支付分潤。',
      '推廣之 App 及專屬連結，由甲方於本協議簽署後另行提供，並得依合作情形增減。',
    ],
  },
  {
    heading: '第二條　分潤級距',
    intro:
      '分潤比例依當月分潤基準金額認定，達到門檻者，該月全額適用該級距比例（非分段累進）：',
    table: true,
    outro: '級距以各月單獨認定，不跨月累計。',
  },
  {
    heading: '第三條　分潤基準金額',
    items: [
      '分潤基準金額指使用者付款總額扣除平台手續費、各地區稅金、退款及相關調整後，甲方實際取得之淨額（即平台官方報表所載之開發者實收金額）。',
      '因平台推廣活動報表僅提供銷售額，未按推廣連結區分實收金額，雙方同意以「該推廣連結之銷售額 × 當期實收率」計算，實收率依當期財務報表實際數字認定。',
      '平台手續費比率及各地區稅率由平台業者及各地政府單方決定，得隨時調整，甲方無決定權；該等費用變動不影響本協議效力，乙方之分潤比例亦不因此變更。',
      '本協議所列金額均以新台幣計算。美元換算以甲方實際入帳之新台幣金額為依據。',
    ],
  },
  {
    heading: '第四條　計算平台範圍',
    items: [
      '本協議之分潤，以 Apple App Store 之推廣活動數據為計算基礎。',
      'Google Play 之財務報表不含推廣活動識別欄位，與流量報表資料架構分離，無法將個別訂單歸因至特定推廣連結，故該平台所生之購買暫不納入分潤計算。',
      '甲方仍應提供乙方 Google Play 推廣連結，供使用者依其裝置選擇使用。',
      '平台業者提供訂單層級歸因功能後，甲方應通知乙方，雙方得另行協議調整計算範圍。',
    ],
  },
  {
    heading: '第五條　成效歸屬與平台限制',
    intro: '乙方已充分了解並同意，下列情形係平台業者之技術規則，甲方無法調整或覆寫：',
    items: [
      '歸因窗口：使用者須於點擊推廣連結後 24 小時內完成首次下載，方計入乙方成效。',
      'last-touch 歸因：使用者多次點擊不同推廣連結時，僅計入最後一次點擊之連結。',
      '重新安裝或更換裝置：使用者刪除後重新安裝或更換裝置者，原歸因關係可能中斷。',
      '數據顯示門檻：平台為保護使用者隱私，各項指標須於所查詢期間內達 5 以上方予顯示。此門檻按各查詢期間分別判定，非累積達標後永久解除。',
      '數據延遲：當日資料須至第 2 日後方屬完整。',
      '退款：使用者退款或平台退費者，該筆金額自分潤基準中扣除，相應分潤不予計算或自後續期間扣抵。',
    ],
    note: '關於數據顯示門檻：此為平台數據顯示規則，與乙方之分潤請求權無關。某期間因未達門檻而無數據者，不視為該期間無成效，甲方應以延長查詢期間或併期核算之方式完成結算後支付，乙方之分潤請求權不因此消滅。',
  },
  {
    heading: '第六條　連結完整性',
    intro:
      '乙方不得自行修改推廣連結之任何參數。經修改之連結無法追蹤，其所產生之下載及購買不列入分潤計算。',
  },
  {
    heading: '第七條　結算與付款',
    items: [
      '結算期間：每月 1 日至當月最末日。',
      '核算與回報：甲方於次月 10 日前完成核算，並向乙方回報下載次數、付費人數、銷售額、當期實收率、分潤基準金額、適用級距及應付分潤。',
      '匯款時間：因平台（Apple）係於次月月初提供財務報表、次次月月初始將款項撥付予甲方，甲方於次次月 15 日前將應付分潤匯款予乙方。例如 9 月之分潤，於 10 月 10 日前回報，11 月 15 日前匯款。',
      '匯款門檻：應付分潤累計達台灣境內帳戶新台幣 1,000 元、海外帳戶新台幣 5,000 元時支付；未達者遞延累計至達標之期間，不因期間更迭而失效或歸零。',
      '匯款手續費：乙方收款帳戶為台灣境內者，手續費（含跨行）由甲方負擔；為海外帳戶者，國際電匯費、中轉行費用及匯率價差由乙方負擔，甲方應於匯款前告知預估金額。',
      '乙方應提供正確收款帳戶資訊；因資訊錯誤致付款失敗者，重匯費用由乙方負擔。',
      '乙方應自行依法申報並繳納相關稅捐。甲方依法有扣繳義務者，得自應付金額中扣繳並提供扣繳憑單。',
    ],
  },
  {
    heading: '第八條　推廣行為規範',
    intro: '乙方推廣時不得有下列行為：',
    items: [
      '為不實或誤導性之宣傳。',
      '使用自動化程式、機器人或其他非自然方式產生下載或購買。',
      '以獎勵、返現等方式誘導非真實使用意願之下載。',
      '損害甲方或其 App 商譽之行為。',
    ],
    outro: '違反前項規定者，甲方得終止本協議，並拒絕支付該等行為所產生之分潤。',
  },
  {
    heading: '第九條　爭議處理',
    items: [
      '乙方對核算結果有異議者，應於收到成效回報後 14 日內以書面提出並敘明理由；逾期未提出者，視為同意該期核算結果。',
      '甲方應提供平台官方報表之相關頁面或匯出檔案供查核；為保護其他合作方及甲方營業秘密，得遮蔽與乙方無關之資料。',
      '經查核後，以平台業者官方報表所載數據為最終認定標準。',
    ],
  },
  {
    heading: '第十條　保密義務',
    intro:
      '乙方對於因本協議知悉之甲方營運數據、分潤條件及其他非公開資訊，應負保密義務，不得洩漏或用於本協議以外之目的。',
  },
  {
    heading: '第十一條　個人資料之蒐集與使用',
    intro:
      '甲方為履行本協議之結算與付款義務，蒐集乙方之姓名、聯絡方式及收款帳戶資訊，使用期間為合作期間及依法應保存之期間，使用地區為中華民國境內，使用方式限於分潤結算、款項支付及稅務申報。',
    outro:
      '乙方得依個人資料保護法規定，向甲方請求查詢、閱覽、複製、補充、更正、停止蒐集處理利用或刪除其個人資料。',
  },
  {
    heading: '第十二條　合作期間與終止',
    items: [
      '本協議自合作起始日起生效，未定期限；任一方得於 30 日前以書面（含電子郵件、通訊軟體訊息）通知終止。',
      '本協議終止後，已產生但尚未結算之分潤，甲方仍應依約支付。',
      '本協議終止後，乙方應停止使用推廣連結。',
    ],
  },
  {
    heading: '第十三條　其他',
    items: [
      '本協議未約定事項，依中華民國法律及誠信原則辦理。',
      '本協議之修改應經雙方書面同意。',
      '因本協議涉訟者，雙方同意以甲方所在地之地方法院為第一審管轄法院。',
    ],
  },
];

const ACK_ITEMS = [
  '本人已閱讀並理解全部條款，特別是第五條之平台技術限制。',
  '本人理解分潤以 Apple App Store 數據計算，Google Play 之購買暫不納入。',
  '本人理解數據顯示門檻僅影響數據顯示，不影響分潤請求權。',
  '本人理解 last-touch 歸因之規則，即多次點擊時僅計入最後一次點擊之連結。',
  '本人同意甲方依第十一條蒐集及使用本人之個人資料。',
] as const;

export function ContractSection() {
  const [open, setOpen] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    // 列印樣式只輸出合約，故必須先展開，否則列印出空白
    setOpen(true);
    // 等 React 完成 DOM 更新後再開列印對話框
    requestAnimationFrame(() => window.print());
  }

  return (
    <section id="sign" className="border-t border-line py-11">
      <div data-print="hide">
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-balance">準備開始合作</h2>
        <p className="mb-5 max-w-[46ch] text-ink-2">
          條件沒問題的話，接下來只要三個步驟。合約內容可以先在下方檢視，確認後列印簽名回傳給我們。
        </p>

        <ol className="mb-6 flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-bold text-bg">
                {i + 1}
              </span>
              <span>
                <strong className="block text-base">{s.title}</strong>
                <span className="text-[14.5px] text-ink-2">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="contract"
            className="cursor-pointer rounded-lg bg-brand px-6 py-3 text-[15px] font-semibold text-bg focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand hover:brightness-110"
          >
            {open ? '收合合約條款' : '檢視合約條款'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="cursor-pointer rounded-lg border border-line-2 px-6 py-3 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand hover:bg-card"
          >
            列印 / 存成 PDF
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-line bg-card px-5 py-4">
          <h3 className="mb-1.5 text-base font-semibold">合約要填的欄位</h3>
          <p className="text-[14.5px] text-ink-2">
            <strong className="text-ink">合作起始日</strong>
            是分潤的計算起點 —— 自該日起透過你的連結產生的交易，都會納入分潤。通常填簽署當天或約定的開始日。
          </p>
        </div>
      </div>

      {open && (
        <div
          id="contract"
          ref={contractRef}
          data-print="contract"
          className="contract-body mt-5 rounded-xl border border-line-2 bg-card px-5 py-8 text-sm/[1.75] sm:px-8"
        >
          <header
            className="mb-1.5 border-b-2 border-ink pb-3.5 text-center"
            data-print="avoid-break"
          >
            <p className="text-[11px] font-bold tracking-[0.2em] text-brand">
              PTALK 合作夥伴計劃
            </p>
            <h3 className="mt-2 mb-1 text-xl font-bold tracking-wide">推廣合作協議書</h3>
            <p className="text-xs text-ink-3">乙方簽署後回傳，甲方建立推廣連結即生效</p>
          </header>

          <div
            className="my-4 grid grid-cols-1 border border-line-2 sm:grid-cols-2"
            data-print="avoid-break"
          >
            <div className="border-b border-line-2 px-3.5 py-3 sm:border-r sm:border-b-0">
              <p className="mb-1 text-[10px] font-bold tracking-[0.12em] text-ink-3">
                甲方（委託方）
              </p>
              <p className="text-[15px] font-bold">PTalk</p>
            </div>
            <div className="px-3.5 py-3">
              <p className="mb-1 text-[10px] font-bold tracking-[0.12em] text-ink-3">
                乙方（推廣夥伴）
              </p>
              <p className="text-[15px] font-bold">
                <span className="fill-line" />
              </p>
              <p className="text-xs text-ink-2">
                聯絡方式：<span className="fill-line fill-line-sm" />
              </p>
            </div>
          </div>

          <p className="mt-3.5 mb-2 text-[13px] text-ink-2">
            甲乙雙方就 App 推廣合作事宜，達成協議如下：
          </p>

          {CLAUSES.map((c) => (
            <div key={c.heading}>
              <h4 className="mt-5 mb-1.5 border-b border-line pb-1 text-[15px] font-bold tracking-wide">
                {c.heading}
              </h4>
              {c.intro && <p className="mb-2">{c.intro}</p>}

              {c.table && (
                <table
                  className="my-2 w-full border-collapse text-[13px]"
                  data-print="avoid-break"
                >
                  <thead>
                    <tr>
                      <th className="border border-line-2 bg-sunk px-2.5 py-1.5 text-left text-[11.5px] font-bold">
                        當月分潤基準金額（新台幣）
                      </th>
                      <th className="border border-line-2 bg-sunk px-2.5 py-1.5 text-right text-[11.5px] font-bold">
                        分潤比例
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIER_ROWS.map((t) => (
                      <tr key={t.rate}>
                        <td className="border border-line-2 px-2.5 py-1.5">
                          {t.label.replace('NT$', '').replace('未達 ', '未達 ')} 元
                        </td>
                        <td className="border border-line-2 px-2.5 py-1.5 text-right tabular-nums">
                          {formatPercent(t.rate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {c.items && (
                <ol className="mb-2.5 list-decimal pl-6">
                  {c.items.map((it) => (
                    <li key={it} className="mb-1">
                      {it}
                    </li>
                  ))}
                </ol>
              )}

              {c.note && (
                <p
                  className="my-2.5 border-l-[3px] border-line-2 bg-sunk px-3.5 py-2.5 text-[12.5px] text-ink-2"
                  data-print="avoid-break"
                >
                  {c.note}
                </p>
              )}

              {c.outro && <p className="mb-2">{c.outro}</p>}
            </div>
          ))}

          <div
            className="mt-7 mb-4 border-[1.5px] border-ink px-4 py-4 text-[13px]"
            data-print="avoid-break"
          >
            <p className="mb-2 text-[12.5px] font-bold tracking-wide">
              乙方確認事項（請逐項確認後簽署）
            </p>
            <ul className="list-disc pl-5">
              {ACK_ITEMS.map((a) => (
                <li key={a} className="mb-1">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-line-2 px-4 pt-3.5 pb-4" data-print="avoid-break">
            <p className="mb-3 border-b border-line pb-1.5 text-[10.5px] font-bold tracking-[0.12em] text-ink-3">
              乙方　推廣夥伴　簽署
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <span className="mb-0.5 block text-[11.5px] text-ink-2">簽名（請簽全名）</span>
                <div className="sign-line sign-line-tall" />
              </div>
              <div>
                <span className="mb-0.5 block text-[11.5px] text-ink-2">簽署日期</span>
                <div className="sign-line sign-line-tall" />
                <p className="mt-1 text-[11px] text-ink-3">年 / 月 / 日</p>
              </div>
            </div>
          </div>

          <p
            className="mt-3.5 border-l-[3px] border-brand bg-sunk px-3.5 py-2.5 text-[12.5px] text-ink-2"
            data-print="avoid-break"
          >
            甲方於收到本協議書後，為乙方建立專屬推廣連結，即視為甲方同意本協議條款，
            本協議自乙方所填之合作起始日起生效。
          </p>

          <div className="mt-4 border border-line-2 px-4 pt-3.5 pb-4" data-print="avoid-break">
            <p className="mb-3 border-b border-line pb-1.5 text-[10.5px] font-bold tracking-[0.12em] text-ink-3">
              合作起始日（由乙方填寫）
            </p>
            <div className="sm:max-w-xs">
              <div className="sign-line" />
              <p className="mt-1 text-[11px] text-ink-3">分潤自此日起之交易開始計算</p>
            </div>
          </div>

          <p className="mt-5 border-t border-line pt-3 text-[11.5px] text-ink-3">
            回傳方式：請於簽名後拍照或掃描，回傳至甲方指定之聯絡方式。
            甲方收到後將於 3 個工作日內建立乙方之專屬推廣連結。
          </p>
        </div>
      )}
    </section>
  );
}
