"use client";
import { useEffect } from "react";
import { http } from "@/lib/http";

export function useAuthHeartbeat(intervalMs = 8000) {
  useEffect(() => {
    let stop = false, t: any;
    const ping = async () => {
      try { await http("/auth/me"); } catch {}
      if (!stop) t = setTimeout(ping, intervalMs);
    };
    const onVis = () => { if (document.visibilityState === "visible") ping(); };
    ping();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop = true; clearTimeout(t); document.removeEventListener("visibilitychange", onVis); };
  }, [intervalMs]);
}
