
"use client";
import * as React from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** sm | md | lg */
  size?: "sm" | "md" | "lg";
  /** thêm class cho body nếu cần */
  bodyClassName?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  bodyClassName,
}: Props) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: "w-[min(560px,calc(100vw-2rem))]",
    md: "w-[min(760px,calc(100vw-2rem))]",
    lg: "w-[min(980px,calc(100vw-2rem))]",
  } as const;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
          <div className="text-base font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body: chỉ body cuộn */}
        <div className={`flex-1 overflow-auto px-5 py-4 ${bodyClassName || ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
