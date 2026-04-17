// Plan limits for the "user" role. "admin" has no limits.
// Centralized so UI and API can both reference these values.

export const USER_PLAN_LIMITS = {
    // Max custom keychains per user
    keychains: 3,
    // Max accounts per keychain (excludes the internal "validation" record)
    accountsPerKeychain: 50,
    // Max sticky notes per user
    notes: 15,
    // System labels: unlimited. Custom labels are admin-only (see labels route).
}

export type TPlanLimits = typeof USER_PLAN_LIMITS

export const isLimited = (role: string) => role !== "admin"
