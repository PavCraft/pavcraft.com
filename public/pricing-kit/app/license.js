// Перевірка коду доступу в браузері: підпис ECDSA P-256 перевіряється публічним ключем.
// Код видається інструментом pricing-kit/tools/issue-code.mjs. Мережа не потрібна, нікуди нічого не надсилається.

const RE = /^PK-([0-9A-Z]{4})-(\d{8})-([A-Za-z0-9_-]{86})$/;

// Прибрати пробіли, переноси, лапки, які з'являються при копіюванні з листа
export function cleanCode(s) {
  return String(s || '')
    .replace(/[\u2010-\u2015\u2212]/g, '-')   // типографські тире з поштових програм
    .replace(/[\s"'«»]/g, '')
    .replace(/^.*#code=/, '');
}

function bytesToB64url(b) {
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlToBytes(s) {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}

// → {ok:true, number:'PK-0001', date:'2026-11-09'} або {ok:false, reason}
export async function checkCode(raw, licenseData) {
  const code = cleanCode(raw);
  const m = RE.exec(code);
  if (!m) return { ok: false, reason: 'format' };
  const [, num, date, sig] = m;
  const payload = `PK-${num}-${date}`;
  if ((licenseData?.revoked || []).includes(payload)) return { ok: false, reason: 'revoked' };
  let sigBytes;
  try { sigBytes = b64urlToBytes(sig); } catch { return { ok: false, reason: 'signature' }; }
  // Один код — один запис: відкидаємо варіанти з іншими «зайвими» бітами в кінці.
  if (sigBytes.length !== 64 || bytesToB64url(sigBytes) !== sig) return { ok: false, reason: 'signature' };
  try {
    if (!licenseData?.key || !crypto?.subtle) return { ok: false, reason: 'crypto' };
    const key = await crypto.subtle.importKey('jwk', { ...licenseData.key, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    const good = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, sigBytes, new TextEncoder().encode(payload));
    if (!good) return { ok: false, reason: 'signature' };
  } catch (e) {
    return { ok: false, reason: 'crypto' };
  }
  return { ok: true, code, number: `PK-${num}`, date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}` };
}

export const REASON_TEXT = {
  format: 'Це не схоже на код Pricing Kit. Скопіюйте його з листа повністю, від «PK-» до кінця.',
  signature: 'Код не підходить. Можливо, скопійовано не повністю — спробуйте ще раз або відкрийте посилання з листа.',
  revoked: 'Цей код більше не діє. Напишіть нам на pav.craft.lab@gmail.com.',
  crypto: 'Цей браузер не може перевірити код. Оновіть браузер або відкрийте сторінку в Chrome чи Safari.',
};
