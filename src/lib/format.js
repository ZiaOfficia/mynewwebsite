/* "2026-10-14" → "14 October 2026" (safe to use in client components) */
export function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}
