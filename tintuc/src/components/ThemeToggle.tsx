"use client";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = React.useState<boolean>(() =>
    typeof document === "undefined"
      ? false
      : document.documentElement.classList.contains("dark")
  );

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      aria-label="Toggle theme"
      className={
        "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm transition " +
        "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 " +
        className
      }
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="ml-2 hidden sm:inline">{dark ? "Sáng" : "Tối"}</span>
    </button>
  );
}
