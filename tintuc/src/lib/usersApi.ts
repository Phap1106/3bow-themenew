


// // src/lib/usersApi.ts
// export const API =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// export type SupportUser = {
//   id: string;
//   firstName?: string | null;
//   lastName?: string | null;
//   name?: string | null;
//   email?: string | null;
//   phone?: string | null;
//   numberPhone?: string | null;
//   address?: string | null;
//   session?: boolean | null;
//   kickedAt?: string | null;
// };

// export type Paginated<T> = { items: T[]; total: number; page: number; limit: number };

// function normalizeList<T>(data: any, fb: { page: number; limit: number }): Paginated<T> {
//   const meta = data?.meta ?? {};
//   return {
//     items: (data?.items ?? data?.data ?? []) as T[],
//     total: Number(meta.total ?? data?.total ?? meta.count ?? data?.count ?? 0),
//     page: Number(meta.page ?? data?.page ?? fb.page),
//     limit: Number(meta.limit ?? data?.limit ?? fb.limit),
//   };
// }

// /** LIST – GET /users/support-admins?page=&limit=&q=  */
// export async function listSupport(
//   page = 1,
//   limit = 10,
//   q = ""
// ): Promise<Paginated<SupportUser>> {
//   const qs = new URLSearchParams();
//   if (q) qs.set("q", q);
//   qs.set("page", String(page));
//   qs.set("limit", String(limit));
//   const data = await req(`/users/support-admins?${qs.toString()}`);
//   return normalizeList<SupportUser>(data, { page, limit });
// }

// /** CREATE – POST /auth/register-support-admin  */
// export async function createSupport(data: any): Promise<SupportUser> {
//   const payload = { password: data?.password ?? "12345678", ...data };
//   return req(`/auth/register-support-admin`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
// }




// export function updateSupport(id: string, data: any) {
//   return req(`/users/support-admins/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
// }


// /** DELETE – DELETE /users/:id  */
// export const deleteSupport = (id: string) =>
//   req(`/users/${id}`, { method: "DELETE" });

// /** KICK – POST /users/:id/kick  */
// export const kickSupport = (id: string) =>
//   req(`/users/${id}/kick`, { method: "POST" });


// async function req(path: string, init?: RequestInit) {
//   const r = await fetch(`${API}${path}`, { credentials: "include", cache: "no-store", ...init });
//   if (r.status === 401 && typeof window !== "undefined") {
//     // token hết hiệu lực do bị kick/xóa
//     window.location.href = "/login?expired=1";
//     throw new Error("Unauthorized");
//   }
//   if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
//   return r.json();
// }











// src/lib/usersApi.ts
export const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type SupportUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  numberPhone?: string | null; // chỉ dùng cho FE, BE dùng "phone"
  address?: string | null;
  session?: boolean | null;
  kickedAt?: string | null;
};

// ✅ THÊM KIỂU NÀY — để SupportForm.tsx import không còn báo lỗi
export type SupportInput = {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  numberPhone?: string;   // FE nhập số điện thoại tại đây
  birthday?: string | null; // nếu có
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

function normalizeList<T>(data: any, fb: { page: number; limit: number }): Paginated<T> {
  const meta = data?.meta ?? {};
  return {
    items: (data?.items ?? data?.data ?? []) as T[],
    total: Number(meta.total ?? data?.total ?? meta.count ?? data?.count ?? 0),
    page: Number(meta.page ?? data?.page ?? fb.page),
    limit: Number(meta.limit ?? data?.limit ?? fb.limit),
  };
}

/** LIST – GET /users/support-admins?page=&limit=&q=  */
export async function listSupport(
  page = 1,
  limit = 10,
  q = ""
): Promise<Paginated<SupportUser>> {
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  const data = await req(`/users/support-admins?${qs.toString()}`);
  return normalizeList<SupportUser>(data, { page, limit });
}

/** CREATE – POST /auth/register-support-admin  */
export async function createSupport(data: SupportInput): Promise<SupportUser> {
  // Map numberPhone -> phone cho đúng DTO BE
  const payload = {
    email: data.email,
    password: data.password ?? "12345678",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    address: data.address ?? null,
    phone: data.numberPhone ?? null, // <-- BE nhận "phone"
    // birthday nếu có: chuẩn hoá về ISO hoặc bỏ qua
    // birthday: data.birthday ? toISO(data.birthday) : null,
  };
  return req(`/auth/register-support-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** UPDATE – PATCH /users/support-admins/:id  */
export function updateSupport(id: string, data: Partial<SupportInput>) {
  const payload: any = {
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phone: data.numberPhone, // <-- map về "phone"
    // password nếu cho đổi ở màn hình edit (tuỳ bạn):
    ...(data.password ? { password: data.password } : {}),
    // birthday nếu có:
    // ...(data.birthday != null ? { birthday: toISO(data.birthday) } : {}),
  };
  return req(`/users/support-admins/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** DELETE – DELETE /users/:id  */
export const deleteSupport = (id: string) =>
  req(`/users/${id}`, { method: "DELETE" });

/** KICK – POST /users/:id/kick  */
export const kickSupport = (id: string) =>
  req(`/users/${id}/kick`, { method: "POST" });

async function req(path: string, init?: RequestInit) {
  const r = await fetch(`${API}${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (r.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?expired=1";
    throw new Error("Unauthorized");
  }
  if (!r.ok) {
    let msg = "";
    try { msg = await r.text(); } catch {}
    throw new Error(`${r.status} ${msg || r.statusText}`);
  }
  return r.json();
}

// (tuỳ chọn) parse "dd/MM/yyyy" -> ISO
function toISO(s: string) {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return s;
  const [, dd, mm, yyyy] = m;
  return new Date(+yyyy, +mm - 1, +dd).toISOString();
}
