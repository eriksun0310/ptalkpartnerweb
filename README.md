# PTalk 合作夥伴計劃

給推廣夥伴看的合作條件說明頁，含分潤試算器與可列印簽署的合作協議書。

技術：Next.js 16（App Router）+ React 19 + TypeScript + Tailwind CSS 4

## 開發

```bash
npm install
npm run dev
```

開 http://localhost:3000

## 建置

```bash
npm run build
npm start
```

## 檔案結構

```
src/
├── app/
│   ├── globals.css      設計 token（三種主題狀態）+ 列印樣式
│   ├── layout.tsx       根 layout、metadata
│   └── page.tsx         主頁（Server Component）
├── components/
│   ├── EarningsCalculator.tsx   分潤試算器（Client）
│   └── ContractSection.tsx      合約展開／列印（Client）
└── lib/
    └── tiers.ts         級距定義與試算邏輯
```

## 重要：級距的單一來源

分潤級距、單價、實收率、匯款門檻全部定義在 `src/lib/tiers.ts`。

試算器與合約條款表都由這裡產生 —— **改條件只改這個檔案**，兩處不會不一致。

```ts
export const TIERS = [
  { min: 20000, rate: 0.30 },
  { min: 10000, rate: 0.25 },
  { min: 5000,  rate: 0.20 },
  { min: 2000,  rate: 0.15 },
  { min: 0,     rate: 0.10 },
];
```

實收率 `NET_RATE` 目前為 `0.67`（30% 平台手續費 + 5% 台灣營業稅）。
若平台費率調整為 15%，改成 `0.81`。

## 列印行為

按「列印 / 存成 PDF」時，列印樣式**只輸出合約本體**，行銷內容全部隱藏。

機制：行銷區塊標記 `data-print="hide"`，合約容器標記 `data-print="contract"`，
分頁避免斷開的區塊標記 `data-print="avoid-break"`（見 `globals.css` 的 `@media print`）。

## 部署

這是純靜態頁面（無 API、無資料庫），任何支援 Next.js 的平台都能部署：

- **Vercel**：連 Git repo 即可，零設定
- **自架**：`npm run build && npm start`

部署後夥伴直接開網址就能看，不需要任何帳號。

## 待補

- 甲方負責人、統一編號（若需要顯示在合約上）
- 合約條款**未經律師審閱**，正式使用前建議由律師確認稅務扣繳與個資條款
