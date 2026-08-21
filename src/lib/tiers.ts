/**
 * 分潤級距與試算邏輯。
 *
 * 級距門檻以「當月分潤基準金額（開發者實收）」認定，達標者該月全額適用該比例
 * （非分段累進）；級距每月獨立認定，不跨月累計。
 * 此處為合約條款的單一來源 —— 試算器與合約條款表都由這裡產生，避免兩處不一致。
 */

export interface Tier {
  /** 級距下限（新台幣，含）；由高到低排列以便查表 */
  readonly min: number;
  readonly rate: number;
}

export const TIERS: readonly Tier[] = [
  { min: 20000, rate: 0.3 },
  { min: 10000, rate: 0.25 },
  { min: 5000, rate: 0.2 },
  { min: 2000, rate: 0.15 },
  { min: 0, rate: 0.1 },
] as const;

/** 試算用單價（壽司日檢內購 NT$90） */
export const UNIT_PRICE = 90;

/**
 * 試算用實收率：扣除平台手續費與台灣營業稅後，開發者實收佔使用者付款的比例。
 * 實際結算依當期財務報表計算，此處僅供估算。
 */
export const NET_RATE = 0.67;

/** 匯款門檻（跨月累計，未達不作廢） */
export const PAYOUT_THRESHOLD_TW = 1000;
export const PAYOUT_THRESHOLD_OVERSEAS = 5000;

/** 依基準金額查出適用比例 */
export function tierRateFor(baseAmount: number): number {
  const tier = TIERS.find((t) => baseAmount >= t.min);
  return tier ? tier.rate : TIERS[TIERS.length - 1].rate;
}

/** 距離下一階還差幾筆；已在最高階時回傳 null */
export function nextTierHint(baseAmount: number): { needQty: number; rate: number } | null {
  // TIERS 由高到低，反向找出第一個「門檻高於目前金額」的級距
  for (let i = TIERS.length - 1; i >= 0; i -= 1) {
    if (TIERS[i].min > baseAmount) {
      const gap = TIERS[i].min - baseAmount;
      return {
        needQty: Math.ceil(gap / (UNIT_PRICE * NET_RATE)),
        rate: TIERS[i].rate,
      };
    }
  }
  return null;
}

export interface Estimate {
  qty: number;
  /** 分潤基準金額（開發者實收） */
  base: number;
  rate: number;
  /** 應付分潤，四捨五入至整數 */
  share: number;
  next: ReturnType<typeof nextTierHint>;
  /** 本月即可匯款（未達門檻則跨月累計） */
  payableThisMonth: boolean;
}

export function estimate(qty: number): Estimate {
  const base = qty * UNIT_PRICE * NET_RATE;
  const rate = tierRateFor(base);
  const share = Math.round(base * rate);
  return {
    qty,
    base,
    rate,
    share,
    next: nextTierHint(base),
    payableThisMonth: share >= PAYOUT_THRESHOLD_TW,
  };
}

export function formatTwd(amount: number): string {
  return `NT$${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/** 級距表顯示用（由低到高，符合閱讀順序） */
export const TIER_ROWS = [
  { label: '未達 NT$2,000', rate: 0.1, weight: 0.15 },
  { label: 'NT$2,000 以上', rate: 0.15, weight: 0.32 },
  { label: 'NT$5,000 以上', rate: 0.2, weight: 0.5 },
  { label: 'NT$10,000 以上', rate: 0.25, weight: 0.72 },
  { label: 'NT$20,000 以上', rate: 0.3, weight: 1 },
] as const;

/**
 * 換算對照：當適用某比例時，每筆實得金額，以及相當於使用者付款總額的比例。
 * 用於回答「這個比例算高還是低」，非級距定義。
 */
export const CONVERSION_ROWS = TIER_ROWS.map(({ rate }) => ({
  rate,
  perUnit: Math.round(UNIT_PRICE * NET_RATE * rate),
  ofGross: rate * NET_RATE,
}));
