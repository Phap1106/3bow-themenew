// src/app/contact/page.tsx
import SiteShell from "@/components/siteHeaderFooter";
import ContactFormRHF from "@/components/forms/ContactFormRHF";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

/** === CHỈNH Ở ĐÂY === */
const ADDRESS =
  "Số 12, đường Xóm Miễu, Thôn Duyên Trường, Xã Duyên Thái, Huyện Thường Tín, Thành phố Hà Nội, Việt Nam";
const HOTLINE = "0933 415 331";
const EMAIL = "3bowdigital@gmail.com";

/** DÙNG EMBED URL – KHÔNG DÙNG maps.app.goo.gl */
const MAP_SRC = `https://www.google.com/maps?hl=vi&q=${encodeURIComponent(
  ADDRESS,
)}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;

export const metadata = {
  title: "Liên hệ | 3BOW Digital",
  description:
    "Liên hệ 3BOW Digital để được tư vấn chiến lược IMC, Ads, Thiết kế nhận diện, Website… Chúng tôi phản hồi trong 24h (T2–T6).",
};

export default function ContactPage() {
  const tel = HOTLINE.replace(/\D/g, "");

  return (
    <SiteShell>
      {/* HERO */}
      <section className="w-full bg-amber-400/95 pt-[88px] md:pt-[104px]">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="py-8 md:py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Liên hệ 3BOW Digital
            </h1>
            <p className="mt-2 text-white/90">
              Điền form hoặc gọi trực tiếp. Chúng tôi phản hồi trong 24h (T2–T6).
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="grid items-start max-w-6xl gap-8 px-4 py-10 mx-auto md:py-14 lg:grid-cols-12">
        {/* FORM */}
        <div className="lg:col-span-8">
          <ContactFormRHF />
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-28">
            {/* Card thông tin */}
            <div className="p-5 bg-white border shadow-sm rounded-2xl">
              <h3 className="text-lg font-bold">Thông tin liên hệ</h3>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-amber-600" />
                  <div>
                    <div className="text-zinc-500">Hotline</div>
                    <a className="font-semibold underline" href={`tel:${tel}`}>
                      {HOTLINE}
                    </a>
                    <div className="text-xs text-zinc-500">8:30–18:00, T2–T6</div>
                  </div>
                </li>
                <li className="flex items-start gap-3 break-all">
                  <Mail className="w-4 h-4 mt-0.5 text-amber-600" />
                  <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>{ADDRESS}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 text-amber-600" />
                  <span>Thời gian làm việc: T2–T6 • 8:30–18:00</span>
                </li>
              </ul>

              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <a
                  href={`tel:${tel}`}
                  className="inline-flex items-center justify-center px-3 py-2 text-white bg-black rounded-lg hover:opacity-90"
                >
                  Gọi ngay
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center justify-center px-3 py-2 border rounded-lg hover:bg-zinc-50"
                >
                  Gửi email
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden bg-white border rounded-2xl">
              <div className="aspect-[4/3]">
                <iframe
                  title="Bản đồ 3BOW Digital"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={MAP_SRC}
                  allowFullScreen
                />
              </div>
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  ADDRESS,
                )}`}
                className="block px-4 py-2 text-xs text-center text-amber-700 hover:underline"
              >
                Mở trên Google Maps
              </a>
            </div>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
