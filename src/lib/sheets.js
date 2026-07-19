/* Google Apps Script web app — saves form submissions to Google Sheets */
const SCRIPT_URL =
  'https://script.google.com/a/macros/bbdu.ac.in/s/AKfycbz2JB5yfg2e0y5F6t9eVNAP7OwDJJhNL4Yd2NpWMc7fj5bprUL0SBZxXsgrfaxORXA5/exec';

/* Content-Type must stay text/plain — application/json triggers a CORS
   preflight that Apps Script cannot answer. */
export async function submitToSheet(payload) {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Submission failed');
  return data;
}
