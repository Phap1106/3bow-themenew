"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapService = mapService;
exports.mapBudget = mapBudget;
const enums_1 = require("./enums");
function mapService(v) {
    if (!v)
        return undefined;
    const raw = v.trim();
    if (Object.values(enums_1.ServiceType).includes(raw)) {
        return raw;
    }
    const s = raw.toLowerCase();
    if (s === 'seo')
        return enums_1.ServiceType.SEO;
    if (s === 'ads' || s === 'googleads')
        return enums_1.ServiceType.ADS;
    if (s === 'branding')
        return enums_1.ServiceType.BRANDING;
    if (s === 'website' || s === 'web')
        return enums_1.ServiceType.WEB;
    if (s === 'imc')
        return enums_1.ServiceType.OTHER;
    if (s === 'other' || s === 'khac' || s === 'khác')
        return enums_1.ServiceType.OTHER;
    if (/(google\s*ads|adwords|quảng\s*cáo)/i.test(raw))
        return enums_1.ServiceType.ADS;
    if (/seo/i.test(raw))
        return enums_1.ServiceType.SEO;
    if (/(social|facebook|zalo|tiktok)/i.test(raw))
        return enums_1.ServiceType.SOCIAL ?? enums_1.ServiceType.OTHER;
    if (/(branding|thương\s*hiệu)/i.test(raw))
        return enums_1.ServiceType.BRANDING;
    if (/(web|website|landing)/i.test(raw))
        return enums_1.ServiceType.WEB;
    return enums_1.ServiceType.OTHER;
}
function mapBudget(v) {
    if (!v)
        return undefined;
    const raw = String(v).trim();
    if (Object.values(enums_1.BudgetRange).includes(raw)) {
        return raw;
    }
    const s = raw.replace(/\s/g, '').toLowerCase();
    if (s === 'unknown')
        return enums_1.BudgetRange.UNKNOWN;
    if (s === 'under_10' || /^<*10(tr|triệu|m)?$/.test(s))
        return enums_1.BudgetRange.LT_10M;
    if (s === '10_30' || /(10[-_–~]30)/.test(s))
        return enums_1.BudgetRange._10_30M;
    if (s === '30_50' || /(30[-_–~]50)/.test(s))
        return enums_1.BudgetRange._30_100M;
    if (s === '50_150' || /(50[-_–~]150)/.test(s))
        return enums_1.BudgetRange._30_100M;
    if (s === 'over_150' || />=*150/.test(s) || />=*100/.test(s))
        return enums_1.BudgetRange.GT_100M;
    if (/khôngrõ|khongro|unknown/.test(s))
        return enums_1.BudgetRange.UNKNOWN;
    if (/(<|duoi|<=)?10(tr|triệu|m)/.test(s))
        return enums_1.BudgetRange.LT_10M;
    if (/10(–|-|~|_)30/.test(s))
        return enums_1.BudgetRange._10_30M;
    if (/(30(–|-|~|_)50|50(–|-|~|_)150|30(–|-|~|_)100)/.test(s))
        return enums_1.BudgetRange._30_100M;
    if (/>=*(100|150|200|300)(tr|triệu|m)?/.test(s) || />\s*100m?/.test(s))
        return enums_1.BudgetRange.GT_100M;
    const num = Number(raw.replace(/[^\d]/g, ''));
    if (Number.isFinite(num) && num > 0) {
        const m = num / 1_000_000;
        if (m < 10)
            return enums_1.BudgetRange.LT_10M;
        if (m < 30)
            return enums_1.BudgetRange._10_30M;
        if (m <= 100)
            return enums_1.BudgetRange._30_100M;
        return enums_1.BudgetRange.GT_100M;
    }
    if (s.includes('>300') || s.includes('>300tr') || s.includes('>100m') || s.includes('>100'))
        return enums_1.BudgetRange.GT_100M;
    if (/(30|50|80|100)m|30-100|30_100|30~100|300?triệu/.test(s))
        return enums_1.BudgetRange._30_100M;
    if (/(10|20|25|30)m|10-30|10_30|10~30/.test(s))
        return enums_1.BudgetRange._10_30M;
    if (/(<10|<=10|duoi10|lt10|0-10)/.test(s))
        return enums_1.BudgetRange.LT_10M;
    return enums_1.BudgetRange.UNKNOWN;
}
//# sourceMappingURL=mappers.js.map