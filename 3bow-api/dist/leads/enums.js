"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadStatus = exports.LeadChannel = exports.BudgetRange = exports.ServiceType = void 0;
var ServiceType;
(function (ServiceType) {
    ServiceType["SEO"] = "SEO";
    ServiceType["ADS"] = "ADS";
    ServiceType["SOCIAL"] = "SOCIAL";
    ServiceType["BRANDING"] = "BRANDING";
    ServiceType["WEB"] = "WEB";
    ServiceType["OTHER"] = "OTHER";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var BudgetRange;
(function (BudgetRange) {
    BudgetRange["LT_10M"] = "LT_10M";
    BudgetRange["_10_30M"] = "10_30M";
    BudgetRange["_30_100M"] = "30_100M";
    BudgetRange["GT_100M"] = "GT_100M";
    BudgetRange["UNKNOWN"] = "UNKNOWN";
})(BudgetRange || (exports.BudgetRange = BudgetRange = {}));
var LeadChannel;
(function (LeadChannel) {
    LeadChannel["WEBSITE"] = "WEBSITE";
    LeadChannel["LANDING"] = "LANDING";
    LeadChannel["HOTLINE"] = "HOTLINE";
    LeadChannel["FACEBOOK"] = "FACEBOOK";
    LeadChannel["ZALO"] = "ZALO";
    LeadChannel["TIKTOK"] = "TIKTOK";
    LeadChannel["OTHER"] = "OTHER";
})(LeadChannel || (exports.LeadChannel = LeadChannel = {}));
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "NEW";
    LeadStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LeadStatus["WON"] = "WON";
    LeadStatus["LOST"] = "LOST";
    LeadStatus["SPAM"] = "SPAM";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
//# sourceMappingURL=enums.js.map