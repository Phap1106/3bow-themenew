





// // src/components/ContactFormRHF.tsx
// "use client";

// import { ReactNode } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import {
//   CheckCircle2,
//   ChevronRight,
//   ChevronDown,
//   Globe,
//   Loader2,
//   Mail,
//   Phone,
//   Users,
// } from "lucide-react";

// /* ===== Reusable styles ===== */
// const fieldWrap =
//   "rounded-2xl border border-zinc-200 bg-white/70 p-2 transition-all duration-300 hover:border-zinc-300 hover:bg-white focus-within:border-violet-400 focus-within:shadow-[0_0_0_6px] focus-within:shadow-violet-400/10"; // 1 vòng mềm
// const inputBase =
//   "w-full rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-0"; // tắt outline/ring mặc định

// /* ===== Zod schema ===== */
// const phoneRe = /^(0|\+?\d{1,3})?[-.\s]?\d{8,12}$/;

// const schema = z.object({
//   name: z.string().min(2, "Nhập họ tên"),
//   phone: z.string().regex(phoneRe, "SĐT không hợp lệ"),
//   email: z.string().email("Email không hợp lệ").or(z.literal("")).optional(),
//   url: z.string().url("Link không hợp lệ").or(z.literal("")).optional(),
//   service: z.string().min(1, "Chọn dịch vụ"),
//   budget: z.string().min(1, "Chọn ngân sách"),
//   note: z.string().max(1000, "Tối đa 1000 ký tự").or(z.literal("")).optional(),
// });
// type FormValues = z.infer<typeof schema>;

// export default function ContactFormRHF() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting, isSubmitSuccessful },
//     reset,
//   } = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       name: "",
//       phone: "",
//       email: "",
//       url: "",
//       service: "",
//       budget: "",
//       note: "",
//     },
//   });

//   const onSubmit = async (data: FormValues) => {
//     // TODO: gọi API thực
//     await new Promise((r) => setTimeout(r, 900));
//     toast.success("Đã gửi yêu cầu — chúng tôi sẽ liên hệ sớm!");

//     reset(undefined, {
//       keepErrors: false,
//       keepTouched: false,
//       keepDirty: false,
//       keepIsSubmitted: false,
//       keepSubmitCount: false,
//       keepIsSubmitSuccessful: false,
//     });
//   };

//   const invalid = (err?: unknown) => (err ? "input-invalid" : "");

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       noValidate
//       className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl"
//     >
//       {/* Aura gradient */}
//       <div className="absolute transition-opacity duration-700 opacity-0 pointer-events-none -inset-24 blur-3xl group-hover:opacity-100">
//         <div className="absolute w-56 h-56 rounded-full -top-10 -left-10 bg-gradient-to-tr from-violet-500/18 via-fuchsia-400/18 to-sky-400/18" />
//         <div className="absolute w-56 h-56 rounded-full -bottom-10 -right-10 bg-gradient-to-br from-amber-400/18 via-pink-400/18 to-violet-500/18" />
//       </div>

//       {/* Heading */}
//       <h3 className="text-2xl font-extrabold tracking-wide uppercase md:text-3xl text-zinc-900/90">
//         Hãy để <span className="text-violet-600/90">3BOW</span> hiểu hơn về bạn
//       </h3>
//       <p className="mt-2 text-zinc-600">
//         Điền thông tin để chúng tôi tư vấn giải pháp phù hợp nhất.
//       </p>

//       {/* Fields */}
//       <div className="grid gap-4 mt-6 sm:grid-cols-2">
//         <Field className={fieldWrap} icon={<Users className="w-4 h-4" />} error={errors.name?.message}>
//           <input
//             {...register("name")}
//             placeholder="Họ và tên"
//             autoComplete="name"
//             aria-invalid={!!errors.name}
//             className={`${inputBase} pl-9 ${invalid(errors.name)}`}
//           />
//         </Field>

//         <Field className={fieldWrap} icon={<Phone className="w-4 h-4" />} error={errors.phone?.message}>
//           <input
//             {...register("phone")}
//             placeholder="Số điện thoại"
//             autoComplete="tel"
//             inputMode="tel"
//             aria-invalid={!!errors.phone}
//             className={`${inputBase} pl-9 ${invalid(errors.phone)}`}
//           />
//         </Field>

//         <Field className={`sm:col-span-2 ${fieldWrap}`} icon={<Mail className="w-4 h-4" />} error={errors.email?.message}>
//           <input
//             {...register("email")}
//             type="email"
//             placeholder="Email"
//             autoComplete="email"
//             aria-invalid={!!errors.email}
//             className={`${inputBase} pl-9 ${invalid(errors.email)}`}
//           />
//         </Field>

//         <Field className={`sm:col-span-2 ${fieldWrap}`} icon={<Globe className="w-4 h-4" />} error={errors.url?.message}>
//           <input
//             {...register("url")}
//             placeholder="Link website/fanpage"
//             autoComplete="url"
//             aria-invalid={!!errors.url}
//             className={`${inputBase} pl-9 ${invalid(errors.url)}`}
//           />
//         </Field>

//         {/* Select: trigger mềm + mũi tên custom */}
//         <Field className={fieldWrap} error={errors.service?.message}>
//           <div className="relative w-full">
//             <select
//               {...register("service")}
//               defaultValue=""
//               aria-invalid={!!errors.service}
//               className={`${inputBase} appearance-none pr-10 ${invalid(errors.service)}`}
//             >
//               <option value="" disabled>
//                 Dịch vụ quan tâm
//               </option>
//               <option>Google Ads</option>
//               <option>Facebook/Instagram Ads</option>
//               <option>TikTok Ads</option>
//               <option>Landing Page &amp; Tracking</option>
//             </select>
//             <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-500" />
//           </div>
//         </Field>

//         <Field className={fieldWrap} error={errors.budget?.message}>
//           <div className="relative w-full">
//             <select
//               {...register("budget")}
//               defaultValue=""
//               aria-invalid={!!errors.budget}
//               className={`${inputBase} appearance-none pr-10 ${invalid(errors.budget)}`}
//             >
//               <option value="" disabled>
//                 Ngân sách dự kiến
//               </option>
//               <option>&lt; 50 triệu/tháng</option>
//               <option>50–150 triệu/tháng</option>
//               <option>150–300 triệu/tháng</option>
//               <option>&gt; 300 triệu/tháng</option>
//             </select>
//             <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-500" />
//           </div>
//         </Field>

//         <Field className={`sm:col-span-2 ${fieldWrap}`} error={errors.note?.message}>
//           <textarea
//             {...register("note")}
//             placeholder="Bạn cần trợ giúp điều gì?"
//             aria-invalid={!!errors.note}
//             className={`${inputBase} min-h-[120px] py-3 ${invalid(errors.note)}`}
//           />
//         </Field>
//       </div>

//       {/* Note + Submit */}
//       <div className="flex flex-col items-stretch gap-3 mt-5 sm:flex-row sm:items-center sm:justify-between">
//         <p className="text-xs text-zinc-500">
//           Cam kết bảo mật thông tin • Phản hồi trong 24h (T2–T6).
//         </p>

//         <button
//           type="submit"
//           aria-busy={isSubmitting}
//           disabled={isSubmitting}
//           className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-2.5 font-medium transition-all sm:w-auto
//             ${isSubmitSuccessful ? "bg-emerald-600 text-white hover:bg-emerald-600/95" : "bg-gradient-to-r from-violet-600 to-sky-600 text-white hover:-translate-y-0.5 hover:shadow-md"}`}
//         >
//           {!isSubmitSuccessful && (
//             <span className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:skew-x-12 before:content-[''] before:transition-transform before:duration-700 group-hover:before:translate-x-full" />
//           )}

//           {isSubmitting ? (
//             <span className="inline-flex items-center gap-2">
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Đang gửi...
//             </span>
//           ) : isSubmitSuccessful ? (
//             <span className="inline-flex items-center gap-2">
//               <CheckCircle2 className="w-4 h-4" />
//               Đã gửi
//             </span>
//           ) : (
//             <span className="inline-flex items-center gap-2">
//               Gửi yêu cầu
//               <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
//             </span>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// /* ===== Field wrapper ===== */
// function Field({
//   children,
//   icon,
//   error,
//   className = "",
// }: {
//   children: ReactNode;
//   icon?: ReactNode;
//   error?: string;
//   className?: string;
// }) {
//   return (
//     <div className={`group ${className}`}>
//       <div className="relative">
//         {icon && (
//           <span className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400">
//             {icon}
//           </span>
//         )}
//         {children}
//       </div>
//       {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
//   );
// }




































// src/components/ContactFormRHF.tsx
"use client";

import { ReactNode } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Globe,
  Loader2,
  Mail,
  Phone,
  Users,
} from "lucide-react";

/* ===========================================================
   Enums (khớp prisma/schema.prisma)
   =========================================================== */
export const SERVICE = {
  SEO: "SEO",
  GOOGLE_ADS: "GOOGLE_ADS",
  FACEBOOK_INSTAGRAM_ADS: "FACEBOOK_INSTAGRAM_ADS",
  TIKTOK_ADS: "TIKTOK_ADS",
  LANDING_TRACKING: "LANDING_TRACKING",
  OTHER: "OTHER",
} as const;
export type ServiceType = (typeof SERVICE)[keyof typeof SERVICE];

export const BUDGET = {
  LT_50M: "LT_50M",
  B_50_150M: "B_50_150M",
  B_150_300M: "B_150_300M",
  GT_300M: "GT_300M",
  UNKNOWN: "UNKNOWN",
} as const;
export type BudgetRange = (typeof BUDGET)[keyof typeof BUDGET];

/* ===== UTM/referrer/pagePath/userAgent ===== */
function readUTM() {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const get = (k: string) => sp.get(k) || undefined;
  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    referrer: document.referrer || undefined,
    pagePath: window.location.pathname,
    userAgent: navigator.userAgent,
  };
}

/* ===== Styles ===== */
const fieldWrap =
  "rounded-2xl border border-zinc-200 bg-white/70 p-2 transition-all duration-300 hover:border-zinc-300 hover:bg-white focus-within:border-violet-400 focus-within:shadow-[0_0_0_6px] focus-within:shadow-violet-400/10";
const inputBase =
  "w-full rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-0";

/* ===== Zod v4 schema ===== */
const phoneRe = /^(0|\+?\d{1,3})?[-.\s]?\d{8,12}$/;

export const schema = z.object({
  name: z.string().min(2, "Nhập họ tên"),
  phone: z.string().regex(phoneRe, "SĐT không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  url: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
  service: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.nativeEnum(SERVICE, { message: "Chọn dịch vụ" })
  ),
  serviceText: z.string().optional().or(z.literal("")),
  budget: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.nativeEnum(BUDGET, { message: "Chọn ngân sách" })
  ),
  note: z.string().max(1000, "Tối đa 1000 ký tự").optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, {
    message: "Bạn cần đồng ý với chính sách bảo mật.",
  }),
});

type FormValues = z.infer<typeof schema>;

/* ===== Default values (type-safe) ===== */
const DEFAULTS: DefaultValues<FormValues> = {
  name: "",
  phone: "",
  email: "",
  url: "",
  service: undefined,      // required -> để undefined cho UI select
  serviceText: "",
  budget: undefined,       // required -> để undefined cho UI select
  note: "",
  consent: false,
};

export default function ContactFormRHF() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });

  const serviceValue = watch("service");

  const onSubmit = async (data: FormValues) => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      if (!api) throw new Error("Thiếu NEXT_PUBLIC_API_URL");

      const meta = readUTM();

      // payload khớp model Lead của Prisma
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        url: data.url || undefined,
        service: data.service as ServiceType,
        serviceText:
          data.service === SERVICE.OTHER && data.serviceText
            ? data.serviceText
            : undefined,
        budget: data.budget as BudgetRange,
        note: data.note || undefined,
        consent: data.consent,
        channel: "WEBSITE" as const, // LeadChannel
        ...meta,
      };

      const res = await fetch(`${api}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Không thể gửi yêu cầu, vui lòng thử lại.");
      }

      toast.success("Đã gửi yêu cầu — chúng tôi sẽ liên hệ sớm!");
      reset(DEFAULTS);
    } catch (e: any) {
      console.error("Submit lead error:", e);
      toast.error(e?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const invalid = (err?: unknown) => (err ? "input-invalid" : "");

  return (
    <form
      onSubmit={handleSubmit<FormValues>(onSubmit)}
      noValidate
      className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl"
    >
      {/* Aura gradient */}
      <div className="absolute transition-opacity duration-700 opacity-0 pointer-events-none -inset-24 blur-3xl group-hover:opacity-100">
        <div className="absolute w-56 h-56 rounded-full -top-10 -left-10 bg-gradient-to-tr from-violet-500/18 via-fuchsia-400/18 to-sky-400/18" />
        <div className="absolute w-56 h-56 rounded-full -bottom-10 -right-10 bg-gradient-to-br from-amber-400/18 via-pink-400/18 to-violet-500/18" />
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-extrabold tracking-wide uppercase md:text-3xl text-zinc-900/90">
        Hãy để <span className="text-violet-600/90">3BOW</span> hiểu hơn về bạn
      </h3>
      <p className="mt-2 text-zinc-600">
        Điền thông tin để chúng tôi tư vấn giải pháp phù hợp nhất.
      </p>

      {/* Fields */}
      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        <Field className={fieldWrap} icon={<Users className="w-4 h-4" />} error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="Họ và tên"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={`${inputBase} pl-9 ${invalid(errors.name)}`}
          />
        </Field>

        <Field className={fieldWrap} icon={<Phone className="w-4 h-4" />} error={errors.phone?.message}>
          <input
            {...register("phone")}
            placeholder="Số điện thoại"
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={!!errors.phone}
            className={`${inputBase} pl-9 ${invalid(errors.phone)}`}
          />
        </Field>

        <Field className={`sm:col-span-2 ${fieldWrap}`} icon={<Mail className="w-4 h-4" />} error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={`${inputBase} pl-9 ${invalid(errors.email)}`}
          />
        </Field>

        <Field className={`sm:col-span-2 ${fieldWrap}`} icon={<Globe className="w-4 h-4" />} error={errors.url?.message}>
          <input
            {...register("url")}
            placeholder="Link website/fanpage"
            autoComplete="url"
            aria-invalid={!!errors.url}
            className={`${inputBase} pl-9 ${invalid(errors.url)}`}
          />
        </Field>

        {/* SERVICE */}
        <Field className={fieldWrap} error={errors.service?.message}>
          <div className="relative w-full">
            <select
              {...register("service")}
              defaultValue=""
              aria-invalid={!!errors.service}
              className={`${inputBase} appearance-none pr-10 ${invalid(errors.service)}`}
            >
              <option value="" disabled>
                Dịch vụ quan tâm
              </option>
              <option value={SERVICE.GOOGLE_ADS}>Google Ads</option>
              <option value={SERVICE.FACEBOOK_INSTAGRAM_ADS}>Facebook/Instagram Ads</option>
              <option value={SERVICE.TIKTOK_ADS}>TikTok Ads</option>
              <option value={SERVICE.SEO}>SEO</option>
              <option value={SERVICE.LANDING_TRACKING}>Landing Page & Tracking</option>
              <option value={SERVICE.OTHER}>Khác (ghi chú)</option>
            </select>
            <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-500" />
          </div>
        </Field>

        {/* BUDGET */}
        <Field className={fieldWrap} error={errors.budget?.message}>
          <div className="relative w-full">
            <select
              {...register("budget")}
              defaultValue=""
              aria-invalid={!!errors.budget}
              className={`${inputBase} appearance-none pr-10 ${invalid(errors.budget)}`}
            >
              <option value="" disabled>
                Ngân sách dự kiến
              </option>
              <option value={BUDGET.LT_50M}>&lt; 50 triệu/tháng</option>
              <option value={BUDGET.B_50_150M}>50–150 triệu/tháng</option>
              <option value={BUDGET.B_150_300M}>150–300 triệu/tháng</option>
              <option value={BUDGET.GT_300M}>&gt; 300 triệu/tháng</option>
            </select>
            <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-zinc-500" />
          </div>
        </Field>

        {/* SERVICE TEXT khi chọn OTHER */}
        {serviceValue === SERVICE.OTHER && (
          <Field className={`sm:col-span-2 ${fieldWrap}`} error={errors.serviceText?.message}>
            <input
              {...register("serviceText")}
              placeholder="Mô tả dịch vụ bạn cần (ví dụ: Landing Page/Tracking/Khác...)"
              className={`${inputBase} ${invalid(errors.serviceText)}`}
            />
          </Field>
        )}

        {/* NOTE */}
        <Field className={`sm:col-span-2 ${fieldWrap}`} error={errors.note?.message}>
          <textarea
            {...register("note")}
            placeholder="Bạn cần trợ giúp điều gì?"
            aria-invalid={!!errors.note}
            className={`${inputBase} min-h-[120px] py-3 ${invalid(errors.note)}`}
          />
        </Field>
      </div>

      {/* Consent + Submit */}
      <div className="mt-4 space-y-3">
        <label className="flex items-start gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            {...register("consent")}
            className="w-4 h-4 mt-1 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          <span>
            Tôi đã đọc và đồng ý với{" "}
            <a href="/security" target="_blank" className="font-medium text-violet-700 hover:underline">
              Chính sách bảo mật
            </a>{" "}
            và đồng ý để 3BOW liên hệ tư vấn.
            {errors.consent && (
              <span className="block mt-1 text-xs text-red-600">{errors.consent.message}</span>
            )}
          </span>
        </label>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            Cam kết bảo mật thông tin • Phản hồi trong 24h (T2–T6).
          </p>

          <button
            type="submit"
            aria-busy={isSubmitting}
            disabled={isSubmitting}
            className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-2.5 font-medium transition-all sm:w-auto
              ${isSubmitSuccessful ? "bg-emerald-600 text-white hover:bg-emerald-600/95" : "bg-gradient-to-r from-violet-600 to-sky-600 text-white hover:-translate-y-0.5 hover:shadow-md"}`}
          >
            {!isSubmitSuccessful && (
              <span className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:skew-x-12 before:content-[''] before:transition-transform before:duration-700 group-hover:before:translate-x-full" />
            )}

            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang gửi...
              </span>
            ) : isSubmitSuccessful ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Đã gửi
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                Gửi yêu cầu
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ===== Field wrapper ===== */
function Field({
  children,
  icon,
  error,
  className = "",
}: {
  children: ReactNode;
  icon?: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={`group ${className}`}>
      <div className="relative">
        {icon && (
          <span className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-zinc-400">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
