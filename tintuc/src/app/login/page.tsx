

// // src/app/login/page.tsx
// "use client";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";

// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// export default function LoginPage() {
//   const router = useRouter();
//   const next = useSearchParams().get("next") || "/";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [fieldErr, setFieldErr] = useState<{ email?: string; password?: string }>({});
//   const [formErr, setFormErr] = useState("");

//   const validate = () => {
//     const errs: { email?: string; password?: string } = {};
//     if (!email.trim()) errs.email = "Vui lòng nhập email.";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email không hợp lệ.";
//     if (!password) errs.password = "Vui lòng nhập mật khẩu.";
//     setFieldErr(errs);
//     return Object.keys(errs).length === 0;
//   };

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setFormErr("");
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const r = await fetch(`${API}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       const text = await r.text();
//       let data: any = null;
//       try { data = text ? JSON.parse(text) : null; } catch {}

//       if (!r.ok) {
//         // Ưu tiên message từ BE
//         setFormErr(data?.message || data?.error || "Đăng nhập thất bại. Vui lòng thử lại.");
//         return;
//       }

//       const user = data?.user ?? data; // phòng khi BE trả trực tiếp user
//       const target = user?.role === "ADMIN" ? "/admin" : "/supportAdmin";
//       router.replace(
//         next.startsWith("/admin") || next.startsWith("/supportAdmin") ? next : target
//       );
//     } catch {
//       setFormErr("Không thể kết nối máy chủ. Kiểm tra lại mạng hoặc server.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen px-4 bg-zinc-50 dark:bg-zinc-950">
//       <div className="w-full max-w-sm p-6 bg-white border shadow-sm rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
//         <h1 className="mb-4 text-xl font-semibold">Đăng nhập</h1>

//         {formErr && <div className="mb-3 text-sm text-red-600">{formErr}</div>}

//         <form className="space-y-3" onSubmit={onSubmit} noValidate>
//           <div>
//             <div className="mb-1 text-xs text-zinc-500">Email</div>
//             <input
//               className={`w-full h-10 px-3 bg-white border rounded-lg dark:border-zinc-800 dark:bg-zinc-900 ${
//                 fieldErr.email ? "border-red-500 focus:ring-red-500" : "border-zinc-200"
//               }`}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               onBlur={validate}
//               type="email"
//               autoComplete="email"
//               required
//               aria-invalid={!!fieldErr.email}
//             />
//             {fieldErr.email && (
//               <p className="mt-1 text-xs text-red-600">{fieldErr.email}</p>
//             )}
//           </div>

//           <div>
//             <div className="mb-1 text-xs text-zinc-500">Mật khẩu</div>
//             <input
//               className={`w-full h-10 px-3 bg-white border rounded-lg dark:border-zinc-800 dark:bg-zinc-900 ${
//                 fieldErr.password ? "border-red-500 focus:ring-red-500" : "border-zinc-200"
//               }`}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onBlur={validate}
//               type="password"
//               autoComplete="current-password"
//               required
//               aria-invalid={!!fieldErr.password}
//             />
//             {fieldErr.password && (
//               <p className="mt-1 text-xs text-red-600">{fieldErr.password}</p>
//             )}
//           </div>

//           <button
//             disabled={loading}
//             className="w-full h-10 text-white bg-black rounded-lg hover:opacity-90 disabled:opacity-60"
//             type="submit"
//           >
//             {loading ? "Đang đăng nhập…" : "Đăng nhập"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }







"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
type Step = "form" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [step, setStep] = useState<Step>("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [hasSent, setHasSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErr, setFormErr] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown <= 0) { timerRef.current && clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, [cooldown]);

  const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  // bước 1: tạo challenge (chưa gửi mã)
  async function start(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(""); setHasSent(false);

    if (!validEmail(email)) return setFormErr("Email không hợp lệ.");
    if (!password) return setFormErr("Vui lòng nhập mật khẩu.");

    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/login-verify/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, next }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return setFormErr(data?.message || "Bắt đầu xác minh thất bại.");

      setChallengeId(data.challengeId);
      setCooldown(Number(data.resendAfterSec || 0));
      setStep("otp");
    } catch {
      setFormErr("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  // bấm GỬI MÃ
  async function sendCode() {
    if (!challengeId) return;
    setLoading(true);
    setFormErr("");
    try {
      const r = await fetch(`${API}/auth/login-verify/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challengeId }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return setFormErr(data?.message || "Gửi mã thất bại.");
      setHasSent(true);
      setCooldown(Number(data.resendAfterSec || 60));
    } catch {
      setFormErr("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  // xác minh OTP
  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!hasSent) return setFormErr("Hãy bấm ‘Gửi mã’ trước khi xác minh.");
    if (!code || code.trim().length < 4) return setFormErr("Nhập mã 6 số.");
    setLoading(true);
    setFormErr("");
    try {
      const r = await fetch(`${API}/auth/login-verify/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challengeId, code }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) return setFormErr(data?.message || "Mã không đúng.");

      // BE mới: data.next là string
      // BE cũ (nếu chưa cập nhật): data.next có thể là { ok: true, next: "/..." }
      const target =
        typeof data.next === "string"
          ? data.next
          : (typeof data.next?.next === "string" ? data.next.next : next);

      // điều hướng chắc chắn
      router.replace(target);
      // với Next App Router, đôi khi cần refresh để kích hoạt guard/middleware dùng cookie mới
      // (không bắt buộc, nhưng an toàn)
      setTimeout(() => router.refresh?.(), 0);
    } catch {
      setFormErr("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-zinc-50">
      <div className="w-full max-w-sm p-6 bg-white border shadow-sm rounded-2xl border-zinc-200">
        {step === "form" ? (
          <>
            <h1 className="mb-4 text-xl font-semibold">Đăng nhập</h1>
            {formErr && <div className="mb-3 text-sm text-red-600">{formErr}</div>}
            <form className="space-y-3" onSubmit={start} noValidate>
              <div>
                <div className="mb-1 text-xs text-zinc-500">Email</div>
                <input
                  className="w-full h-10 px-3 bg-white border rounded-lg border-zinc-200"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email" autoComplete="email" required
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-zinc-500">Mật khẩu</div>
                <input
                  className="w-full h-10 px-3 bg-white border rounded-lg border-zinc-200"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  type="password" autoComplete="current-password" required
                />
              </div>
              <button disabled={loading} className="w-full h-10 text-white bg-black rounded-lg disabled:opacity-60" type="submit">
                {loading ? "Đang xử lý…" : "Tiếp tục"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-xl font-semibold">Xác minh OTP</h1>
            {formErr && <div className="mb-3 text-sm text-red-600">{formErr}</div>}
            <p className="text-sm text-zinc-600">
              Nhấn “Gửi mã” để nhận OTP 6 số qua email <b>{email}</b>. Mã có hiệu lực 15 phút.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button onClick={sendCode} disabled={loading || cooldown > 0} className="h-10 px-3 border rounded-lg disabled:opacity-60">
                {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : (hasSent ? "Gửi lại mã" : "Gửi mã")}
              </button>
              <button onClick={() => setStep("form")} className="h-10 px-3 border rounded-lg">Đổi email</button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={verify}>
              <input
                className="w-full h-10 px-3 text-center tracking-[8px] text-lg bg-white border rounded-lg border-zinc-200"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="••••••"
              />
              <button disabled={loading} className="w-full h-10 text-white bg-black rounded-lg disabled:opacity-60" type="submit">
                {loading ? "Đang kiểm tra…" : "Xác minh"}
              </button>
            </form>

            <p className="mt-2 text-xs text-zinc-500">
              Quá 3 lần gửi trong 1 giờ sẽ bị khoá 1 giờ. Nhập sai quá 5 lần cũng bị khoá 1 giờ.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
