import "server-only";
import { cookies } from "next/headers";

export async function bearerToken(): Promise<string | undefined> {
  return (await cookies()).get("session")?.value;
}
export async function authHeaders(): Promise<Record<string, string>> {
  const token = await bearerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
