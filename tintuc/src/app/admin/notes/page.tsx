"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
	Loader2,
	Save,
	CheckCircle2,
	AlertCircle,
	Plus,
	Minus,
	Upload,
	Download,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/common/LogoutButton";
import { getAdminNote, saveAdminNote } from "@/lib/adminApi";

// Simple CSV helpers (no quotes/escapes beyond commas and newlines)
function parseCsv(text: string): string[][] {
	const rows = (text || "").replace(/\r\n?/g, "\n").split("\n");
	return rows.map((r) => r.split(","));
}
function toCsv(grid: string[][], timestamps: string[]): string {
	return (grid || [])
		.map((row, ri) => {
			const ts = timestamps[ri] ?? "";
			return [...row.map((c) => (c ?? "").replace(/\n/g, " ")), ts].join(",");
		})
		.join("\n");
}
function isLikelyTimestamp(value: string): boolean {
	if (!value) return false;
	// Accept ISO-like or locale date strings
	const d = new Date(value);
	return !isNaN(d.getTime());
}
function formatNow(): string {
	return new Date().toLocaleString();
}

export default function AdminNotesPage() {
	const router = useRouter();
	const [collapsed, setCollapsed] = React.useState<boolean>(false);
	const [grid, setGrid] = React.useState<string[][]>([[""]]);
	const [timestamps, setTimestamps] = React.useState<string[]>([""]);
	const [loading, setLoading] = React.useState(true);
	const [saving, setSaving] = React.useState(false);
	const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [toast, setToast] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

	React.useEffect(() => {
		const v = typeof window !== "undefined" ? localStorage.getItem("admin.sidebar.collapsed") : null;
		if (v === "1") setCollapsed(true);
	}, []);

	const toggleCollapsed = () => {
		setCollapsed((s) => {
			const nx = !s;
			try { localStorage.setItem("admin.sidebar.collapsed", nx ? "1" : "0"); } catch {}
			return nx;
		});
	};

	// Load existing note (as CSV text) and split last column as timestamp if present
	React.useEffect(() => {
		let alive = true;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const j = await getAdminNote();
				const content = (j as any)?.content ?? "";
				const parsed = parseCsv(content).filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
				if (!alive) return;
				if (!parsed.length) {
					setGrid([[""]]);
					setTimestamps([""]);
				} else {
					const cols = Math.max(...parsed.map((r) => r.length), 1);
					const rows: string[][] = [];
					const ts: string[] = [];
					for (const r of parsed) {
						const padded = [...r, ...new Array(Math.max(0, cols - r.length)).fill("")];
						const last = padded[cols - 1] ?? "";
						if (isLikelyTimestamp(last)) {
							rows.push(padded.slice(0, cols - 1));
							ts.push(last);
						} else {
							rows.push(padded);
							ts.push("");
						}
					}
					setGrid(rows);
					setTimestamps(ts);
				}
			} catch (e: any) {
				if (alive) setError(e?.message || "Không tải được ghi nhớ");
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => { alive = false; };
	}, []);

	const showToast = (t: { type: "success" | "error"; message: string }) => {
		setToast(t);
		setTimeout(() => setToast(null), 2500);
	};

	const onSave = async () => {
		try {
			setSaving(true);
			setError(null);
			await saveAdminNote(toCsv(grid, timestamps));
			const now = formatNow();
			setLastSavedAt(now);
			showToast({ type: "success", message: "Đã lưu ghi nhớ" });
		} catch (e: any) {
			const message = e?.message || "Lưu thất bại";
			setError(message);
			showToast({ type: "error", message });
		} finally {
			setSaving(false);
		}
	};

	const bumpRowTimestamp = (ri: number) => {
		setTimestamps((t) => t.map((s, i) => (i === ri ? formatNow() : s)));
	};

	const setCell = (r: number, c: number, v: string) => {
		setGrid((g) => {
			const nx = g.map((row, ri) => (ri === r ? row.map((col, ci) => (ci === c ? v : col)) : row));
			return nx;
		});
		bumpRowTimestamp(r);
	};

	const addRow = () => {
		setGrid((g) => [...g, new Array(g[0]?.length || 1).fill("")]);
		setTimestamps((t) => [...t, ""]);
	};
	const removeRow = (idx: number) => {
		setGrid((g) => (g.length <= 1 ? g : g.filter((_, i) => i !== idx)));
		setTimestamps((t) => (t.length <= 1 ? t : t.filter((_, i) => i !== idx)));
	};
	// const addCol = () => setGrid((g) => g.map((row) => [...row, ""]));
	const removeCol = (idx: number) => setGrid((g) => {
		if (!g[0] || g[0].length <= 1) return g;
		return g.map((row) => row.filter((_, i) => i !== idx));
	});

	const onImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => {
			const text = String(reader.result || "");
			const parsed = parseCsv(text);
			// reuse the same load logic: treat last column as timestamp if likely
			const cols = Math.max(...parsed.map((r) => r.length), 1);
			const rows: string[][] = [];
			const ts: string[] = [];
			for (const r of parsed) {
				const padded = [...r, ...new Array(Math.max(0, cols - r.length)).fill("")];
				const last = padded[cols - 1] ?? "";
				if (isLikelyTimestamp(last)) {
					rows.push(padded.slice(0, cols - 1));
					ts.push(last);
				} else {
					rows.push(padded);
					ts.push("");
				}
			}
			setGrid(rows.length ? rows : [[""]]);
			setTimestamps(ts.length ? ts : [""]);
		};
		reader.readAsText(f);
		// reset input to allow re-upload same file
		e.currentTarget.value = "";
	};

	const onExportCsv = () => {
		const blob = new Blob([toCsv(grid, timestamps)], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "admin-notes.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
			{/* Toast */}
			{toast && (
				<div className="fixed z-50 right-4 top-4">
					<div className={[
						"px-4 py-3 rounded-xl shadow-lg border",
						toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700",
					].join(" ")}
					>
						{toast.type === "success" ? <CheckCircle2 className="inline-block w-4 h-4 mr-2" /> : <AlertCircle className="inline-block w-4 h-4 mr-2" />}
						{toast.message}
					</div>
				</div>
			)}

			{/* Header */}
			<header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="px-4 mx-auto max-w-7xl">
					<div className="flex items-center justify-between h-20">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold">
								N
							</div>
							<div>
								<div className="text-xl font-bold tracking-tight text-slate-800">Ghi nhớ Admin</div>
								<div className="text-sm text-slate-500">Bảng ghi chú dạng Sheet để quản lý nhanh</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							{lastSavedAt && (
								<div className="hidden text-xs text-slate-500 md:block">Đã lưu: {lastSavedAt}</div>
							)}
							<button
								onClick={onSave}
								disabled={saving || loading}
								className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
							>
								{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
								Lưu ghi nhớ
							</button>
							<LogoutButton />
						</div>
					</div>
				</div>
			</header>

			{/* Body */}
			<div className="grid grid-cols-12 gap-10 px-4 py-8 mx-auto max-w-7xl">
				<aside className={collapsed ? "col-span-12 md:col-span-1" : "col-span-12 md:col-span-3"}>
					<AdminSidebar
						active={"posts" as any}
						onGoPosts={() => router.push("/admin")}
						onAddPost={() => router.push("/admin/ai-writer")}
						onGoUsers={() => router.push("/admin")}
						onAddSupport={() => router.push("/admin")}
						{...({
							collapsed,
							onToggleCollapsed: toggleCollapsed,
						} as any)}
					/>
				</aside>

				<main className={collapsed ? "col-span-12 md:col-span-11 space-y-6" : "col-span-12 md:col-span-9 space-y-6"}>
					{/* Tools */}
					<div className="p-4 bg-white/95 border shadow-sm rounded-2xl backdrop-blur supports-[backdrop-filter]:bg-white/80">
						<div className="flex flex-wrap items-center gap-2">
							<button onClick={addRow} className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border hover:bg-slate-50">
								<Plus className="w-4 h-4" /> Thêm hàng
							</button>
							<button onClick={() => removeRow(grid.length - 1)} disabled={grid.length <= 1} className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border hover:bg-slate-50 disabled:opacity-50">
								<Minus className="w-4 h-4" /> Xoá hàng cuối
							</button>
							<div className="w-px h-6 bg-slate-200 mx-1" />
							{/* <button onClick={addCol} className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border hover:bg-slate-50">
								<Plus className="w-4 h-4" /> Thêm cột
							</button> */}
							<button onClick={() => removeCol((grid[0]?.length || 1) - 1)} disabled={(grid[0]?.length || 1) <= 1} className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border hover:bg-slate-50 disabled:opacity-50">
								<Minus className="w-4 h-4" /> Xoá cột cuối
							</button>
							<div className="w-px h-6 bg-slate-200 mx-1" />
							<label className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border hover:bg-slate-50 cursor-pointer">
								<Upload className="w-4 h-4" />
								<span>Nhập CSV</span>
								<input type="file" accept=".csv,text/csv" className="hidden" onChange={onImportCsv} />
							</label>
							<button onClick={onExportCsv} className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border hover:bg-slate-50">
								<Download className="w-4 h-4" /> Xuất CSV
							</button>
						</div>
					</div>

					{/* Sheet */}
					<div className="overflow-auto bg-white border shadow-sm rounded-2xl">
						{loading ? (
							<div className="py-24 text-center text-slate-500">
								<Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
								Đang tải ghi nhớ…
							</div>
						) : (
							<table className="min-w-[760px] w-full border-collapse">
								<thead>
									<tr className="bg-slate-50/50 border-b">
										{(grid[0] || [""]).map((_, ci) => (
											<th key={ci} className="text-left text-xs font-semibold text-slate-500 px-3 py-2">Cột {ci + 1}</th>
										))}
										<th className="text-right text-xs font-semibold text-slate-500 px-3 py-2">Cập nhật</th>
										<th className="w-0" />
									</tr>
								</thead>
								<tbody>
									{grid.map((row, ri) => (
										<tr key={ri} className="border-b last:border-b-0">
											{row.map((cell, ci) => (
												<td key={ci} className="p-0 border-r last:border-r-0">
													<input
														value={cell}
														onChange={(e) => setCell(ri, ci, e.target.value)}
														className="w-full px-3 py-2 outline-none focus:bg-indigo-50/40"
														placeholder=""
													/>
												</td>
											))}
											<td className="px-3 py-2 text-right align-middle">
												<span className="text-[11px] text-slate-400">{timestamps[ri] || "—"}</span>
											</td>
											<td className="w-0 p-1 align-middle text-center">
												<button onClick={() => removeRow(ri)} disabled={grid.length <= 1} className="inline-flex items-center justify-center w-7 h-7 rounded-md border hover:bg-slate-50 disabled:opacity-50" title="Xoá hàng">
													<Minus className="w-4 h-4" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr>
										{(grid[0] || [""]).map((_, ci) => (
											<td key={ci} className="p-1 text-center">
												<button onClick={() => removeCol(ci)} disabled={(grid[0]?.length || 1) <= 1} className="inline-flex items-center justify-center w-7 h-7 rounded-md border hover:bg-slate-50 disabled:opacity-50" title="Xoá cột">
													<Minus className="w-4 h-4" />
												</button>
											</td>
										))}
										<td className="p-1 text-center" />
										{/* <td className="p-1 text-center">
											<button onClick={addCol} className="inline-flex items-center justify-center w-7 h-7 rounded-md border hover:bg-slate-50" title="Thêm cột">
												<Plus className="w-4 h-4" />
											</button>
										</td> */}
									</tr>
								</tfoot>
							</table>
						)}
					</div>

					{/* Status */}
					<div className="flex items-center justify-between text-xs text-slate-500">
						<div>
							{error ? (
								<span className="inline-flex items-center gap-1 text-rose-600">
									<AlertCircle className="w-4 h-4" /> {error}
								</span>
							) : lastSavedAt ? (
								<span className="inline-flex items-center gap-1 text-emerald-600">
									<CheckCircle2 className="w-4 h-4" /> Đã lưu lúc {lastSavedAt}
								</span>
							) : (
								<span className="text-slate-400">Chưa lưu</span>
							)}
						</div>
						<div className="inline-flex items-center gap-2" />
					</div>
				</main>
			</div>
		</div>
	);
}


