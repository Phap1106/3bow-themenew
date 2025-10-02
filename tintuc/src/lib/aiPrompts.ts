// src/lib/aiPrompts.ts

export interface BuildArticleOpts {
  /** Chủ đề/yêu cầu tổng quát do user nhập */
  topic: string;
  /** Mô tả độc giả mục tiêu */
  audience?: string;
  /** Mục tiêu chất lượng/nội dung của bài */
  goal?: string;
  /** Giọng văn */
  tone?: string;
  /** Phạm vi (VN/quốc tế/…); có thể để trống */
  scope?: string;
  /** Số từ tối thiểu mong muốn (khuyến nghị >= 1200) */
  minWords?: number;
  /** Gợi ý tên tác giả cho trường author */
  authorHint?: string;
  /** Nếu có URL nguồn, ưu tiên dùng để lấy og:image */
  sourceUrl?: string;
  /** Chỉ số biến thể (1,2,3,...) để ép AI tạo phiên bản khác biệt */
  variantIndex?: number;
  /** Yêu cầu tránh trùng lặp tiêu đề/ảnh với các biến thể khác */
  forbidDup?: boolean;
}

/**
 * Tạo prompt “chuẩn biên tập” yêu cầu model trả về JSON {title,excerpt,content,author,image,imageKeywords}.
 * - content phải là Markdown dài (>= minWords)
 * - image: để trống nếu không chắc chắn; imageKeywords: tối đa 6 cụm tiếng Việt sát nội dung
 * - Cấm tuyệt đối placeholder/unsplash/lorempicsum/dummyimage/…
 */
export function buildArticlePrompt(opts: BuildArticleOpts): string {
  const {
    topic,
    audience = "độc giả phổ thông yêu công nghệ",
    goal = "viết bài báo cáo sâu sắc, có ví dụ và số liệu tham khảo",
    tone = "chuyên nghiệp, mạch lạc, không giật tít",
    scope = "bối cảnh Việt Nam và quốc tế liên quan",
    minWords = 1400,
    authorHint = "3BOW AI",
    sourceUrl,
    variantIndex,
    forbidDup,
  } = opts;

  const variantRule = variantIndex
    ? `Biến thể #${variantIndex}: viết khác HOÀN TOÀN so với các biến thể khác (ý chính, ví dụ, cấu trúc, câu chữ).`
    : "";

  const noDupRule = forbidDup
    ? "Tuyệt đối KHÔNG trùng tiêu đề hay trùng ảnh với các bài khác trong cùng loạt."
    : "";

  const sourceRule = sourceUrl
    ? `Nếu có URL nguồn: ${sourceUrl} — hãy ưu tiên lấy ảnh minh họa thực tế bằng og:image/json-ld trên trang đó.`
    : "Nếu prompt có URL nguồn, ưu tiên lấy og:image/json-ld của trang đó.";

  return `
Bạn là biên tập viên công nghệ. Nhiệm vụ: ${goal}.
Chủ đề: ${topic}
Độc giả mục tiêu: ${audience}
Giọng điệu: ${tone}
Phạm vi: ${scope}
${variantRule}
${noDupRule}
Yêu cầu độ dài: tối thiểu ${minWords} từ (có thể hơn), không được rút gọn.

ĐỊNH DẠNG TRẢ VỀ (CHỈ JSON HỢP LỆ, KHÔNG GIẢI THÍCH THÊM):
{
  "title": "tiêu đề <= 120 ký tự, hấp dẫn, trung thực",
  "excerpt": "2–3 câu tóm tắt (<= 280 ký tự), không markdown",
  "content": "bài Markdown dài (>= ${minWords} từ) có cấu trúc ##, ###, bullet, bảng khi phù hợp; có phần Kết luận và Gợi ý hành động; KHÔNG chèn ảnh vào content",
  "author": "${authorHint}",
  "image": "", 
  "imageKeywords": ["tối đa 6 cụm từ khóa ảnh, tiếng Việt có dấu, sát nội dung"]
}

QUY TẮC ẢNH:
- ${sourceRule}
- Cấm tuyệt đối dùng placeholder/ảnh giả: unsplash.com, source.unsplash.com, picsum.photos, dummyimage.com, placehold.co, via.placeholder.com, placeholder.com.
- Nếu chưa chắc ảnh đúng: để "image" rỗng và điền "imageKeywords" sát nội dung để hệ thống client tự tìm.

CHỈ TRẢ VỀ JSON HỢP LỆ NHƯ TRÊN.
`.trim();
}







