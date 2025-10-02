export const ROLE = { ADMIN: 1, SUPPORT: 2 } as const;
export type RoleValue = typeof ROLE[keyof typeof ROLE];
