// src/components/chat/ChatWidget.tsx
"use client";

import * as React from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "system" | "user" | "assistant";
type ChatMsg = { role: Role; content: string };

const SYSTEM_PROMPT = `
Bạn là Trợ lý CSKH/Sales của 3BOW.

Mục tiêu: giải thích rõ ràng các thắc mắc về dịch vụ quảng cáo (dịch vụ phù hợp, quy trình, thời gian triển khai, báo cáo, thời gian làm việc, tiếp nhận thông tin 24/7). Hỗ trợ định hướng ra quyết định mà KHÔNG thu thập thông tin cá nhân trong khung chat ạ.

Giọng điệu: thân thiện, tôn trọng, chuyên nghiệp; xưng "em", gọi "quý khách hàng"; dùng Markdown gọn; mỗi đoạn 1–3 câu; khi liệt kê dùng gạch đầu dòng; luôn kết câu bằng "ạ".

Phạm vi nội dung:
- **Quy trình chuẩn:** tiếp nhận yêu cầu → phân tích nhu cầu → đề xuất giải pháp/kế hoạch → xác nhận/ký duyệt → triển khai → theo dõi & tối ưu → báo cáo định kỳ qua Google Sheet/Looker (minh bạch dữ liệu) ạ.
- **Thời gian điển hình:** khảo sát 1–3 ngày; set-up 1–3 ngày; chạy & tối ưu liên tục; báo cáo theo ngày/tuần; tiếp nhận form 24/7 và phản hồi sớm nhất khi nhận được ạ.
- **Chi phí/budget:** chỉ nêu yếu tố ảnh hưởng (mục tiêu, ngành hàng, mùa vụ, quy mô ngân sách, chất lượng nội dung/landing). KHÔNG đưa số tiền cụ thể ạ.
- **Khai thác nhu cầu (không hỏi dữ liệu cá nhân):** đặt tối đa 1–2 câu ngắn để hiểu thêm ngành hàng/mục tiêu KPI/kênh ưu tiên/địa bàn. Tránh hỏi tên, SĐT, email trong chat ạ.

Quy tắc "CTA tiết chế" (tránh gây khó chịu):
- Chỉ nhắc đến **FORM LIÊN HỆ** trên trang hoặc số **0333415331** khi:
  1) khách hỏi báo giá/khởi chạy ngay/lịch triển khai, hoặc
  2) bạn đã giải thích xong một chủ đề lớn và khách tỏ ý muốn làm tiếp.
- Không nhắc CTA quá **1 lần mỗi 5 tin nhắn** gần nhất. Nếu đã nhắc, **đừng lặp lại** trừ khi khách chủ động hỏi tiếp.
- Khi cần CTA, thay đổi cách diễn đạt, chọn **một** câu trong các gợi ý sau (đừng dùng y hệt nhiều lần):
  • “Nếu cần triển khai sớm, quý khách hàng có thể điền FORM LIÊN HỆ trên trang để đội ngũ sắp xếp nhanh ạ.”
  • “Khi sẵn sàng, quý khách hàng giúp em gửi form trên trang để em đề xuất kế hoạch phù hợp ạ.”
  • “Trường hợp khẩn, quý khách hàng có thể gọi **0333415331** để được hỗ trợ ngay ạ.”

Cách trả lời:
- Bắt đầu bằng câu trả lời trực tiếp vào câu hỏi của khách.
- Nếu phù hợp, đưa 2–4 gạch đầu dòng ngắn (lợi ích, bước làm, mốc thời gian).
- Có ví dụ ngắn theo ngữ cảnh ngành hàng mà khách nêu (ví dụ: giày dép, F&B, giáo dục...).
- Không sa đà quá kỹ thuật; nếu khách muốn chuyên sâu, mời xem chi tiết qua form (theo quy tắc CTA ở trên) ạ.
`;


export default function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Chào quý khách hàng, em là trợ lý 3BOW. Em có thể hỗ trợ gì cho mình hôm nay ạ?",
    },
  ]);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setInput("");

    const next = [...messages, { role: "user", content: text } as ChatMsg];
    setMessages(next);
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...next],
        }),
      });
      const data: { answer?: string; error?: string } = await res.json();
      const answer =
        data.answer ??
        "Xin lỗi, hiện em chưa trả lời được. Quý khách hàng vui lòng điền FORM LIÊN HỆ trên trang để đội ngũ hỗ trợ chi tiết hơn ạ.";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Em đang gặp sự cố kết nối. Quý khách hàng có thể gọi **0333415331** để được hỗ trợ nhanh nhất ạ.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  /* ===== Markdown components (đã fix TS) ===== */
  const mdComponents: Components = {
    h1: (p) => <h3 className="mb-1 font-semibold" {...p} />,
    h2: (p) => <h4 className="mb-1 font-semibold" {...p} />,
    h3: (p) => <h5 className="mb-1 font-semibold" {...p} />,
    p:  (p) => <p className="mb-2" {...p} />,
    ul: (p) => <ul className="mb-2 ml-4 space-y-1 list-disc" {...p} />,
    ol: (p) => <ol className="mb-2 ml-4 space-y-1 list-decimal" {...p} />,
    li: (p) => <li className="[&>p]:m-0" {...p} />,
    a:  (p) => (
      <a
        {...p}
        className="underline text-violet-600 hover:text-violet-700"
        target="_blank"
        rel="noreferrer"
      />
    ),
    code: (props) => {
      // ép kiểu để đọc được 'inline' mà không lỗi TS
      const { inline, children, className, ...rest } = props as unknown as {
        inline?: boolean;
        children?: React.ReactNode;
        className?: string;
      } & React.HTMLAttributes<HTMLElement>;

      if (inline) {
        return (
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-[12px]" {...rest}>
            {children}
          </code>
        );
      }
      return (
        <pre className="mb-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-[12px] text-zinc-100">
          <code className={className}>{children}</code>
        </pre>
      );
    },
    hr: () => <hr className="my-2 border-zinc-200" />,
    blockquote: (p) => (
      <blockquote
        className="pl-3 mb-2 italic border-l-4 border-zinc-300 text-zinc-700"
        {...p}
      />
    ),
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          aria-label="Mở chat 3BOW"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black/40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[60] w-[92vw] max-w-[440px] rounded-2xl border border-zinc-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div>
              <div className="text-sm font-semibold">3BOW • Trợ lý CSKH</div>
              <div className="text-[12px] text-zinc-500">
                Phản hồi nhanh & thân thiện
              </div>
            </div>
            <button
              aria-label="Đóng chat"
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="h-[420px] overflow-y-auto bg-zinc-50/50 px-4 py-3 space-y-3"
          >
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      isUser
                        ? "bg-black text-white"
                        : "bg-white border border-zinc-200 text-zinc-800"
                    }`}
                  >
                    {isUser ? (
                      m.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {m.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              );
            })}
            {pending && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang soạn trả lời…
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn… (Shift+Enter để xuống dòng)"
              className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none border-zinc-300 focus:ring-2 focus:ring-zinc-300"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-black rounded-lg shadow hover:bg-black/90 disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
}
