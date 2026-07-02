/**
 * Domain configuration for Magnence multi-subdomain setup.
 *
 * Main domain: magnence.com → Public website (marketing site)
 * Subdomains:
 *   - app.magnence.com → Magnence OS (general access, all roles)
 *   - admin.magnence.com → Magnence OS (redirects to /app, for admins)
 *   - hr.magnence.com → Magnence OS (redirects to /app, for HR team)
 *   - sales.magnence.com → Magnence OS (redirects to /app, for sales team)
 *   - marketing.magnence.com → Magnence OS (redirects to /app, for marketing team)
 *   - blog.magnence.com → Blog (redirects to /blog)
 *
 * Role-based access is handled by the auth system (RBAC) after login.
 * All subdomains point to the same Next.js app; routing is done via
 * host-based rewrites in next.config.ts.
 *
 * DNS setup (production):
 *   magnence.com          → A record → server IP
 *   *.magnence.com        → CNAME → magnence.com (wildcard)
 *   OR individual CNAMEs:
 *   app.magnence.com      → CNAME → magnence.com
 *   admin.magnence.com    → CNAME → magnence.com
 *   hr.magnence.com       → CNAME → magnence.com
 *   sales.magnence.com    → CNAME → magnence.com
 *   marketing.magnence.com → CNAME → magnence.com
 *   blog.magnence.com     → CNAME → magnence.com
 */

export const DOMAIN_CONFIG = {
  main: "magnence.com",
  subdomains: {
    app: "app.magnence.com",
    admin: "admin.magnence.com",
    hr: "hr.magnence.com",
    sales: "sales.magnence.com",
    marketing: "marketing.magnence.com",
    blog: "blog.magnence.com",
  },
  // Role to subdomain mapping (for display/documentation)
  roleSubdomains: {
    CEO: "admin.magnence.com",
    CHRO: "hr.magnence.com",
    CCO: "sales.magnence.com",
    CMO: "marketing.magnence.com",
    DEVELOPER: "app.magnence.com",
    DESIGNER: "app.magnence.com",
  } as Record<string, string>,
};

/**
 * Get the appropriate subdomain URL for a given role.
 * Used in email links, notifications, etc.
 */
export function getSubdomainForRole(role: string): string {
  const subdomain = DOMAIN_CONFIG.roleSubdomains[role] || DOMAIN_CONFIG.subdomains.app;
  return `https://${subdomain}`;
}

/**
 * Check if the current request is from a subdomain (vs main domain).
 */
export function isSubdomain(host: string): boolean {
  const mainDomain = DOMAIN_CONFIG.main;
  return host !== mainDomain && host.endsWith(`.${mainDomain}`);
}

/**
 * Get the subdomain prefix from a host string.
 * Example: "admin.magnence.com" → "admin"
 */
export function getSubdomainPrefix(host: string): string | null {
  const mainDomain = DOMAIN_CONFIG.main;
  if (host === mainDomain || !host.endsWith(`.${mainDomain}`)) return null;
  const prefix = host.slice(0, -(`.${mainDomain}`.length));
  return prefix || null;
}
