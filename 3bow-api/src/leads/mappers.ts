import { BudgetRange, ServiceType } from './enums';

/** ---- SERVICE ----
 * Chấp nhận:
 * - Token FE: SEO | ADS | IMC | BRANDING | WEBSITE | OTHER
 * - Chuỗi tự do: "seo", "google ads", "quảng cáo", "web/website", "branding", "social"
 * - Nếu đã là key enum của BE -> trả về luôn
 */
export function mapService(v?: string | null): ServiceType | undefined {
  if (!v) return undefined;
  const raw = v.trim();

  // Nếu FE đã gửi đúng key enum của BE
  if ((Object.values(ServiceType) as string[]).includes(raw as any)) {
    return raw as ServiceType;
  }

  const s = raw.toLowerCase();

  // Token thẳng từ FE
  if (s === 'seo') return ServiceType.SEO;
  if (s === 'ads' || s === 'googleads') return ServiceType.ADS;
  if (s === 'branding') return ServiceType.BRANDING;
  if (s === 'website' || s === 'web') return ServiceType.WEB;
  if (s === 'imc') return ServiceType.OTHER; // chưa có enum IMC -> tạm gom OTHER
  if (s === 'other' || s === 'khac' || s === 'khác') return ServiceType.OTHER;

  // Heuristic từ câu chữ
  if (/(google\s*ads|adwords|quảng\s*cáo)/i.test(raw)) return ServiceType.ADS;
  if (/seo/i.test(raw)) return ServiceType.SEO;
  if (/(social|facebook|zalo|tiktok)/i.test(raw)) return ServiceType.SOCIAL ?? ServiceType.OTHER;
  if (/(branding|thương\s*hiệu)/i.test(raw)) return ServiceType.BRANDING;
  if (/(web|website|landing)/i.test(raw)) return ServiceType.WEB;

  return ServiceType.OTHER;
}

/** ---- BUDGET ----
 * Chấp nhận:
 * - Token FE: UNKNOWN | UNDER_10 | 10_30 | 30_50 | 50_150 | OVER_150
 * - Label VN: "<10 triệu", "10–30 triệu", "50-150 triệu"...
 * - Số VNĐ/tháng (ví dụ 50000000) -> tự bucket
 * - Nếu đã là key enum của BE -> trả về luôn
 * Mapping về enum BE (ví dụ):
 *   LT_10M, _10_30M, _30_100M, GT_100M, UNKNOWN
 */
export function mapBudget(v?: string | null): BudgetRange | undefined {
  if (!v) return undefined;
  const raw = String(v).trim();

  // Nếu FE đã gửi đúng key enum của BE
  if ((Object.values(BudgetRange) as string[]).includes(raw as any)) {
    return raw as BudgetRange;
  }

  const s = raw.replace(/\s/g, '').toLowerCase();

  // --- Token FE ---
  if (s === 'unknown') return BudgetRange.UNKNOWN;
  if (s === 'under_10' || /^<*10(tr|triệu|m)?$/.test(s)) return BudgetRange.LT_10M;
  if (s === '10_30' || /(10[-_–~]30)/.test(s)) return BudgetRange._10_30M;
  if (s === '30_50' || /(30[-_–~]50)/.test(s)) return BudgetRange._30_100M;
  if (s === '50_150' || /(50[-_–~]150)/.test(s)) return BudgetRange._30_100M; // gom nhóm 30-100M
  if (s === 'over_150' || />=*150/.test(s) || />=*100/.test(s)) return BudgetRange.GT_100M;

  // --- Label tiếng Việt ---
  if (/khôngrõ|khongro|unknown/.test(s)) return BudgetRange.UNKNOWN;
  if (/(<|duoi|<=)?10(tr|triệu|m)/.test(s)) return BudgetRange.LT_10M;
  if (/10(–|-|~|_)30/.test(s)) return BudgetRange._10_30M;
  if (/(30(–|-|~|_)50|50(–|-|~|_)150|30(–|-|~|_)100)/.test(s)) return BudgetRange._30_100M;
  if (/>=*(100|150|200|300)(tr|triệu|m)?/.test(s) || />\s*100m?/.test(s)) return BudgetRange.GT_100M;

  // --- Nếu là con số VNĐ/tháng ---
  const num = Number(raw.replace(/[^\d]/g, '')); // 50,000,000
  if (Number.isFinite(num) && num > 0) {
    const m = num / 1_000_000;
    if (m < 10) return BudgetRange.LT_10M;
    if (m < 30) return BudgetRange._10_30M;
    if (m <= 100) return BudgetRange._30_100M;
    return BudgetRange.GT_100M;
  }

  // --- Heuristic cũ (giữ nguyên để tương thích) ---
  if (s.includes('>300') || s.includes('>300tr') || s.includes('>100m') || s.includes('>100'))
    return BudgetRange.GT_100M;
  if (/(30|50|80|100)m|30-100|30_100|30~100|300?triệu/.test(s)) return BudgetRange._30_100M;
  if (/(10|20|25|30)m|10-30|10_30|10~30/.test(s)) return BudgetRange._10_30M;
  if (/(<10|<=10|duoi10|lt10|0-10)/.test(s)) return BudgetRange.LT_10M;

  return BudgetRange.UNKNOWN;
}
