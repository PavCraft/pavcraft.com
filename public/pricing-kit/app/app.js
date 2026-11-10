// Pricing Kit — веб-застосунок. Усе працює в браузері; файли нікуди не відправляються.
import { buildContext, calcItem, summarize, STATUS, DEFAULT_SETTINGS } from './calc.js';
import { readProducts, readCostTable, guessCostColumns, columnLabels, buildCostMap, buildPromExport } from './importer.js';
import { DEMO_ITEMS, DEMO_SETTINGS } from './demo.js';
import { checkCode, REASON_TEXT } from './license.js';

const TRIAL_LIMIT = 20;
const PAGE = 30;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- сховище ----------
const LS = 'pk.v1.';
const ls = {
  get(k, d) { try { const v = localStorage.getItem(LS + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch { /* приватний режим */ } },
  del(k) { try { localStorage.removeItem(LS + k); } catch {} },
};
const idb = {
  open() {
    return new Promise((res, rej) => {
      try {
        const r = indexedDB.open('pricing-kit', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
  },
  async get(k) { try { const db = await this.open(); return await new Promise((res) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); }); } catch { return undefined; } },
  async set(k, v) { try { const db = await this.open(); await new Promise((res) => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = res; t.onerror = res; }); } catch {} },
  async del(k) { try { const db = await this.open(); await new Promise((res) => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').delete(k); t.oncomplete = res; t.onerror = res; }); } catch {} },
};

// ---------- стан ----------
const state = {
  rates: null, cats: null,
  settings: { ...DEFAULT_SETTINGS, ...ls.get('settings', {}) },
  src: null,            // {header, rows, idx, items, sheetName, fileName}
  costMap: new Map(),   // з прайсу
  manualCost: ls.get('manualCost', {}), // ключ (артикул або ID) → ціна
  keep: ls.get('keep', {}),             // id → true («не чіпати»)
  expOff: {},           // id → true (знято галочку експорту)
  expOn: {},            // id → true (галочку поставлено вручну — для умовної закупівлі)
  estimate: { on: false, pct: 0.6, ...ls.get('estimate', {}) }, // умовна закупівля, % від ціни
  costTable: null, costCols: null,
  demo: false,
  demoManual: {}, demoKeep: {}, // правки в прикладі не змішуються з вашими даними
  licensed: false, license: null, licenseData: null,
  filter: 'all', shown: PAGE,
  rows: [], ctx: null,
};

const fmt = (n, d = 0) => n == null || !isFinite(n) ? '—' : n.toLocaleString('uk-UA', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/ /g, ' ');
const money = (n) => (n < 0 ? '−' : '') + fmt(Math.abs(n)) + ' грн';
const pct = (x, d = 0) => x == null ? '—' : (x < 0 ? '−' : '') + fmt(Math.abs(x * 100), d) + '%';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many; };
const ln = (l, v, cls = '') => `<div class="ln ${cls}"><span class="lbl">${l}</span><span class="fill"></span><span class="val">${v}</span></div>`;

// ---------- налаштування ----------
function fillSettingsForm() {
  const sel = $('#f-promPackage');
  sel.innerHTML = state.rates.promPackages.map((p) => `<option>${esc(p.name)}</option>`).join('') + '<option value="custom">Інший / свій пакет</option>';
  const car = $('#f-carrier');
  car.innerHTML = Object.keys(state.rates.carriers).map((c) => `<option>${esc(c)}</option>`).join('');
  const s = state.settings;
  for (const el of $$('[data-k]')) {
    const k = el.dataset.k; const v = s[k];
    if (el.type === 'radio') el.checked = el.value === v;
    else if (el.type === 'checkbox') el.checked = !!v;
    else if (el.dataset.pct != null) el.value = v == null ? '' : +(v * 100).toFixed(2);
    else el.value = v ?? '';
  }
  syncSettingsVisibility();
}
function readSettingsForm() {
  const s = { ...state.settings };
  for (const el of $$('[data-k]')) {
    const k = el.dataset.k;
    // Неактивне поле лише показує ціну обраного пакета — не перезаписуємо нею «свій пакет».
    if (el.id === 'f-custom' && (el.disabled || s.promPackage !== 'custom')) continue;
    if (el.type === 'radio') { if (el.checked) s[k] = el.value; continue; }
    if (el.type === 'checkbox') { s[k] = el.checked; continue; }
    if (el.dataset.num != null || el.dataset.pct != null) {
      const n = parseFloat(String(el.value).replace(',', '.').replace(/\s/g, ''));
      const val = isFinite(n) ? n : DEFAULT_SETTINGS[k];
      s[k] = el.dataset.pct != null && isFinite(n) ? n / 100 : val;
    } else s[k] = el.value;
  }
  state.settings = s;
  if (!state.demo) ls.set('settings', s);
  syncSettingsVisibility();
}
function setRowEnabled(rowSel, on) {
  const row = $(rowSel);
  row.classList.toggle('off', !on);
  for (const el of $$('input,select', row)) el.disabled = !on;
}
function syncSettingsVisibility() {
  const s = state.settings;
  // Пакет Prom: ціна підставляється з тарифів; вписати свою можна лише для «Інший / свій пакет».
  const custom = s.promPackage === 'custom';
  setRowEnabled('#row-custom', custom);
  const pkg = state.rates.promPackages.find((p) => p.name === s.promPackage);
  $('#f-custom').value = custom ? (s.customPackageYearly || '') : (pkg ? pkg.yearly : '');
  $('#hint-custom').textContent = custom
    ? 'Впишіть, скільки ви платите за рік. На розрахунок іде 1/12 цієї суми щомісяця.'
    : `Ціна з тарифів Prom (перевірено ${state.rates.checked.split('-').reverse().join('.')}), на розрахунок іде ${fmt((pkg?.yearly || 0) / 12)} грн на місяць. Платите іншу суму — оберіть «Інший / свій пакет».`;
  $('#row-carrier').hidden = s.shipPayer !== 'seller';
  // Частка замовлень з власного сайту має сенс лише для власного домену.
  setRowEnabled('#row-siteShare', s.siteType === 'own');
}

// ---------- розрахунок ----------
const manualStore = () => (state.demo ? state.demoManual : state.manualCost);
const keepStore = () => (state.demo ? state.demoKeep : state.keep);
function costFor(it) {
  const m = manualStore();
  if (state.demo) return m[it.sku] ?? m[it.id] ?? it.cost ?? null;
  if (it.sku && m[it.sku] != null) return m[it.sku];
  if (m[it.id] != null) return m[it.id];
  if (it.sku && state.costMap.has(it.sku)) return state.costMap.get(it.sku);
  if (state.costMap.has(it.id)) return state.costMap.get(it.id);
  return it.cost ?? null;
}
function items() {
  if (state.demo) return DEMO_ITEMS;
  return state.src ? state.src.items : [];
}
function recalc() {
  state.ctx = buildContext(state.settings, state.rates, state.cats);
  const all = items();
  const limit = state.licensed || state.demo ? all.length : Math.min(all.length, TRIAL_LIMIT);
  state.rows = all.slice(0, limit).map((it) => {
    let cost = costFor(it), costEst = false;
    // Умовна закупівля — лише там, де своєї немає (прайс або вписано вручну).
    if (cost == null && !state.demo && state.estimate.on && it.price > 0) {
      cost = Math.round(it.price * state.estimate.pct * 100) / 100; costEst = true;
    }
    const x = { ...it, cost, costEst, keep: !!keepStore()[it.id] };
    const r = calcItem(state.ctx, x);
    // Товари з умовною закупівлею не йдуть у файл, поки людина сама не поставить галочку.
    if (r.export && (state.expOff[it.id] || (costEst && !state.expOn[it.id]))) r.export = false;
    return { ...x, r };
  });
  const order = { [STATUS.LOSS]: 0, [STATUS.LOW]: 1, [STATUS.NO_COST]: 2, [STATUS.NO_RATE]: 3, [STATUS.NO_PRICE]: 4, [STATUS.OK]: 5 };
  state.rows.sort((a, b) => order[a.r.status] - order[b.r.status] || (a.r.margin ?? 0) - (b.r.margin ?? 0));
}

// ---------- екрани ----------
const SCREENS = ['start', 'settings', 'products', 'costs', 'result', 'export'];
// Без файлу товарів далі кроку «Товари» не пускаємо.
function syncNav() {
  const has = items().length > 0;
  $$('.steps-bar button').forEach((b) => { b.disabled = +b.dataset.go >= 3 && !has; });
  $('#next-costs').disabled = !has;
  $('#next-costs-sub').textContent = has ? '' : 'Спершу оберіть файл з Prom';
}
function go(n) {
  if (n >= 3 && !items().length) n = 2;
  syncNav();
  if (n === 4 || n === 5) { recalc(); renderResult(); renderExport(); }
  if (n === 2) renderProducts();
  if (n === 3) renderCosts();
  $$('.screen').forEach((s) => (s.hidden = +s.dataset.s !== n));
  $$('.steps-bar button').forEach((b) => {
    const k = +b.dataset.go;
    if (k === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    b.classList.toggle('done', k < n);
  });
  $('.steps-bar').hidden = n === 0;
  $('#demo-flag').hidden = !state.demo;
  history.replaceState(null, '', n ? '#' + SCREENS[n] : location.pathname);
  window.scrollTo(0, 0);
  const h = $(`.screen[data-s="${n}"] h1, .screen[data-s="${n}"] h2`);
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

function renderProducts() {
  syncNav();
  const box = $('#loaded1'), drop = $('#drop1'), err = $('#err1');
  err.hidden = true;
  if (state.demo) { drop.hidden = true; box.hidden = false; box.innerHTML = ln('Приклад', '20 вигаданих товарів') + `<button class="link" data-act="exit-demo">Завантажити свій файл</button>`; return; }
  const src = state.src;
  if (!src) { drop.hidden = false; box.hidden = true; return; }
  drop.hidden = true; box.hidden = false;
  const n = src.items.length;
  const cats = new Set(src.items.map((i) => i.cat)).size;
  box.innerHTML =
    ln(esc(src.fileName || 'Файл з Prom'), '✓') +
    ln('Товарів у файлі', fmt(n), 'small') +
    ln('Категорій Prom', fmt(cats), 'small') +
    (state.licensed ? ln('Повний доступ', state.license.number, 'small') : ln('Безкоштовно розрахуємо', fmt(Math.min(n, TRIAL_LIMIT)), 'small')) +
    (src.problems?.length ? `<p class="warn">${src.problems.map(esc).join('<br>')}</p>` : '') +
    `<button class="link" data-act="reset-products">Обрати інший файл</button>`;
}

function renderCosts() {
  const box = $('#cost-status');
  const all = items();
  $('#cost-sub').textContent = '';
  if (state.demo) { $('#drop2').hidden = true; box.innerHTML = `<p class="muted">У прикладі закупівельні ціни вже вписані.</p>`; return; }
  if (!all.length) { $('#drop2').hidden = true; box.innerHTML = `<p class="warn">Спершу завантажте файл товарів з Prom.</p><button class="key" data-go="2">← До кроку «Товари»</button>`; return; }
  let html = '';
  if (state.costTable) {
    const labels = columnLabels(state.costTable);
    const opts = (sel) => labels.map((l, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${esc(l)}</option>`).join('');
    const matched = all.filter((it) => (it.sku && state.costMap.has(it.sku)) || state.costMap.has(it.id));
    const found = matched.length;
    html += `<div class="loaded">
      ${ln(esc(state.costTable.fileName), '✓')}
      ${ln('Знайдено закупівельних цін', `${fmt(found)} із ${fmt(all.length)}`, found ? '' : 'neg')}
      <div class="field"><label for="c-key">Де в прайсі код товару</label><select id="c-key" data-cc="keyCol">${opts(state.costCols.keyCol)}</select></div>
      <div class="field"><label for="c-price">Де в прайсі ціна закупівлі</label><select id="c-price" data-cc="priceCol">${opts(state.costCols.priceCol)}</select></div>
      <p class="hint">Код товару в прайсі має збігатися з «Код_товару» у Prom (або з ID товару). Якщо знайдено мало — оберіть інші колонки.</p>
      ${costPreview(matched)}
      <button class="link" data-act="reset-costs">Обрати інший прайс</button></div>`;
  }
  const manual = Object.keys(state.manualCost).length;
  if (manual) html += `<p class="muted">Вписано вручну: ${fmt(manual)}. <button class="link" data-act="clear-manual">Очистити</button></p>`;
  box.innerHTML = html;
  $('#drop2').hidden = !!state.costTable;
  $('#est-h').textContent = state.costTable ? 'Для товарів без закупівлі' : 'Прайсу немає?';
  $('#est-on').checked = state.estimate.on;
  $('#est-pct').value = +(state.estimate.pct * 100).toFixed(1);
  setRowEnabled('#row-est', state.estimate.on);
  if (!state.costTable && !manual && !state.estimate.on) $('#cost-sub').textContent = 'Без закупівельних цін маржу не порахуємо';
}

// Попередній перегляд: перші товари з Prom, для яких знайдено закупівлю, — щоб одразу видно було, чи ті колонки.
function costPreview(matched) {
  const rows = matched.filter((it) => it.price > 0).slice(0, 5);
  if (!rows.length) {
    const t = state.costTable, k = state.costCols.keyCol;
    const keys = new Set(items().flatMap((it) => [it.sku, it.id].filter(Boolean)));
    const keyHits = t.rows.filter((r) => keys.has(String(r[k] ?? '').trim())).length;
    if (matched.length) return `<p class="warn">Коди збіглися, але в цих товарів у Prom немає ціни, тож перевірити закупівлю не вийде.</p>`;
    if (keyHits) return `<p class="warn">Коди товарів збіглися (${fmt(keyHits)}), але у вибраній колонці ціни немає чисел. Оберіть колонку з закупівельною ціною.</p>`;
    const prom = items().slice(0, 3).map((it) => esc(it.sku || it.id)).join(', ');
    const file = t.rows.slice(0, 6).map((r) => String(r[k] ?? '').trim()).filter(Boolean).slice(0, 3).map(esc).join(', ');
    return `<p class="warn">Жоден код не збігся. У Prom коди такі: ${prom}. У вибраній колонці прайсу: ${file || 'порожньо'}.</p>`;
  }
  const val = (it) => state.costMap.get(it.sku) ?? state.costMap.get(it.id);
  const ratios = matched.filter((it) => it.price > 0).map((it) => val(it) / it.price).sort((a, b) => a - b);
  const med = ratios[Math.floor(ratios.length / 2)];
  const warn = med > 1 ? 'Закупівля в середньому більша за ціну продажу. Схоже, обрано не ту колонку ціни.'
    : med < 0.05 ? 'Закупівля підозріло мала порівняно з ціною. Схоже, обрано не ту колонку (наприклад, кількість).' : '';
  return `<div class="pv"><div class="pv-h">Перевірте на перших товарах</div>
    <table><colgroup><col class="c1"><col><col></colgroup>
    <thead><tr><th>Товар з Prom</th><th>Ціна на Prom</th><th>Закупівля з прайсу</th></tr></thead><tbody>
    ${rows.map((it) => `<tr><td>${esc(it.name || 'Без назви')}<small>код ${esc(it.sku || it.id)}</small></td><td>${fmt(it.price)}</td><td>${fmt(val(it), 2)}</td></tr>`).join('')}
    </tbody></table>
    ${warn ? `<p class="warn">${warn}</p>` : `<p class="hint">Закупівля в середньому ${pct(med)} від ціни на Prom. Якщо ці числа схожі на ваші закупівельні ціни — колонки обрано правильно.</p>`}</div>`;
}

function breakdown(x) {
  const r = x.r, c = state.ctx, s = state.settings, G = x.price;
  const t = { ...state.rates.taxes[s.tax], ...(s.taxOverride || {}) };
  const L = [];
  L.push(ln('Ціна', money(G), 'small'));
  L.push(ln(x.costEst ? `Закупівля (умовно ${pct(state.estimate.pct)})` : 'Закупівля', '−' + money(x.cost), 'small'));
  L.push(ln(`Комісія Prom ${pct(r.commission, 1)}`, '−' + money(r.commissionAmount), 'small'));
  const tax = G * (t.single + t.war + t.vat);
  if (tax) L.push(ln('Податки з ціни', '−' + money(tax), 'small'));
  const acq = G * c.acquiring * (1 - c.codShare);
  if (acq) L.push(ln('Комісія за оплату карткою', '−' + money(acq), 'small'));
  if (c.seller) {
    L.push(ln('Доставка', '−' + money(r.shipping), 'small'));
    L.push(ln('Післяплата', '−' + money((G * c.codPct + c.codFix) * c.codShare), 'small'));
  }
  if (s.packing) L.push(ln('Пакування', '−' + money(s.packing), 'small'));
  if (c.returnReserve) L.push(ln('Резерв на повернення', '−' + money(c.returnReserve), 'small'));
  if (c.adPerOrder) L.push(ln('Реклама на замовлення', '−' + money(c.adPerOrder), 'small'));
  if (c.perOrderMonthly) L.push(ln('ЄСВ, податки, абонплата', '−' + money(c.perOrderMonthly), 'small'));
  if (c.siteShareEff) L.push(ln('Замовлення з сайту', '−' + money(10 * c.siteShareEff), 'small'));
  return L.join('');
}

const TAG = { [STATUS.LOSS]: ['loss', 'Збиток'], [STATUS.LOW]: ['low', 'Нижче цілі'], [STATUS.OK]: ['ok', 'ОК'], [STATUS.NO_COST]: ['none', 'Немає закупівлі'], [STATUS.NO_RATE]: ['none', 'Немає комісії'], [STATUS.NO_PRICE]: ['none', 'Немає ціни'] };

function card(x) {
  const r = x.r; const [cls, label] = TAG[r.status];
  const key = esc(x.sku || x.id);
  // У повній картці ціна стоїть поруч із рекомендованою, тож у шапці лишаємо тільки код.
  const full = ![STATUS.NO_COST, STATUS.NO_RATE, STATUS.NO_PRICE].includes(r.status);
  const sub = [x.sku ? 'код ' + esc(x.sku) : '', full ? '' : 'ціна зараз ' + (x.price != null ? money(x.price) : '—')].filter(Boolean).join(' · ');
  const head = `<div class="item-h"><b>${esc(x.name || 'Без назви')}${sub ? `<small>${sub}</small>` : ''}</b><span class="tag ${cls}">${label}</span></div>`;
  const costInput = (lbl) => `<div class="cost-in"><label for="c-${esc(x.id)}">${lbl}</label><input id="c-${esc(x.id)}" inputmode="decimal" data-cost="${key}" value="${x.cost ?? ''}" placeholder="—"><span>грн</span></div>`;
  if (r.status === STATUS.NO_COST) return `<article class="item" data-id="${esc(x.id)}">${head}${costInput('Закупівельна ціна')}</article>`;
  if (r.status === STATUS.NO_RATE) return `<article class="item">${head}<p class="hint">Категорії ${esc(x.cat)} немає в таблиці комісій Prom. Перевірте колонку «Ідентифікатор_підрозділу».</p></article>`;
  if (r.status === STATUS.NO_PRICE) return `<article class="item">${head}</article>`;
  const neg = r.profit < 0;
  const change = r.reco != null && r.reco !== x.price;
  return `<article class="item" data-id="${esc(x.id)}">${head}
    ${x.costEst ? `<span class="tag-est">Умовна закупівля ${pct(state.estimate.pct)} ціни</span>` : ''}
    ${ln('Чистий прибуток', money(r.profit), neg ? 'neg' : '')}
    ${ln('Маржа', pct(r.margin), neg ? 'neg' : '')}
    ${change ? `<div class="pp">
        <div class="pp-c"><span class="pp-l">Ціна зараз</span><s class="pp-v">${money(x.price)}</s></div>
        <span class="pp-a" aria-hidden="true">→</span>
        <div class="pp-c pp-new"><span class="pp-l">Рекомендована</span><b class="pp-v">${money(r.reco)}</b></div>
      </div>
      ${ln('Різниця', `${r.change > 0 ? '+' : '−'}${money(Math.abs(r.change))} · ${r.change > 0 ? '+' : '−'}${pct(Math.abs(r.changePct))}`, 'small')}
      ${ln(`Найнижча ціна для цілі ${pct(r.goal)}`, money(r.minPrice), 'small')}`
    : ln('Ціна зараз', money(x.price) + (r.reco != null ? ' · без змін' : ''))}
    <details><summary>Звідки ці цифри</summary>${breakdown(x)}${costInput('Змінити закупівельну ціну')}
      <label class="tick"><input type="checkbox" data-keep="${esc(x.id)}" ${x.keep ? 'checked' : ''}> Не чіпати ціну цього товару</label></details>
    ${change && !x.keep ? `<div class="item-a"><label class="tick"><input type="checkbox" data-exp="${esc(x.id)}" ${r.export ? 'checked' : ''}> Змінити ціну на ${money(r.reco)}</label></div>${x.costEst && !r.export ? '<p class="hint">Закупівля умовна — перевірте ціну, перш ніж ставити галочку.</p>' : ''}` : ''}
  </article>`;
}

function renderResult() {
  const sum = summarize(state.rows);
  const total = items().length;
  const B = sum.by;
  $('#summary').innerHTML =
    ln('Розраховано товарів', fmt(sum.total)) +
    ln('У збиток', fmt(B[STATUS.LOSS]), B[STATUS.LOSS] ? 'struck' : '') +
    ln(`Нижче вашої цілі ${pct(state.settings.goal)}`, fmt(B[STATUS.LOW])) +
    ln('В нормі', fmt(B[STATUS.OK])) +
    (B[STATUS.NO_COST] ? ln('Без закупівельної ціни', fmt(B[STATUS.NO_COST])) : '') +
    (B[STATUS.NO_RATE] ? ln('Немає комісії категорії', fmt(B[STATUS.NO_RATE])) : '') +
    (state.rows.some((x) => x.costEst) ? ln(`З умовною закупівлею (${pct(state.estimate.pct)} ціни)`, fmt(state.rows.filter((x) => x.costEst).length), 'small') : '') +
    ln(state.rows.some((x) => x.costEst) ? 'Середня маржа (з умовними)' : 'Середня маржа', pct(sum.avgMargin), 'total');
  const chips = [['all', 'Усі', sum.total], [STATUS.LOSS, 'Збиток', B[STATUS.LOSS]], [STATUS.LOW, 'Нижче цілі', B[STATUS.LOW]], [STATUS.NO_COST, 'Без закупівлі', B[STATUS.NO_COST]], [STATUS.OK, 'ОК', B[STATUS.OK]]].filter(([k, , n]) => k === 'all' || n);
  if (!chips.some(([k]) => k === state.filter)) state.filter = 'all';
  $('#chips').innerHTML = chips.map(([k, l, n]) => `<button type="button" aria-pressed="${state.filter === k}" data-f="${k}">${l} · ${fmt(n)}</button>`).join('');
  const list = state.rows.filter((x) => state.filter === 'all' || x.r.status === state.filter);
  const open = new Set($$('#list article[data-id] details[open]').map((d) => d.closest('article').dataset.id));
  $('#list').innerHTML = list.slice(0, state.shown).map(card).join('') +
    (list.length > state.shown ? `<button class="key more-btn" data-act="more">Показати ще ${fmt(Math.min(PAGE, list.length - state.shown))} із ${fmt(list.length - state.shown)}</button>` : '');
  for (const a of $$('#list article[data-id]')) if (open.has(a.dataset.id)) { const d = $('details', a); if (d) d.open = true; }
  const lock = $('#lock');
  lock.hidden = state.licensed || state.demo || total <= TRIAL_LIMIT;
  if (!lock.hidden) {
    $('#lock-title').textContent = `Розраховано ${fmt(TRIAL_LIMIT)} з ${fmt(total)}`;
    $('#lock-text').textContent = `Решта ${fmt(total - TRIAL_LIMIT)} товарів відкриються з кодом повного доступу. Повний доступ — 990 грн один раз, продаж відкриється після бета-тесту. Зараз код безкоштовно отримують бета-тестери: напишіть нам.`;
  }
  const estWaiting = state.rows.filter((x) => x.costEst && !x.r.export && x.r.reco != null && x.r.reco !== x.price && !x.keep).length;
  $('#exportSub').textContent = sum.toExport ? `${fmt(sum.toExport)} ${plural(sum.toExport, 'товар', 'товари', 'товарів')} зі зміненою ціною`
    : estWaiting ? 'Товари з умовною закупівлею відмітьте самі' : 'Немає цін для зміни';
}

function renderExport() {
  const ex = state.rows.filter((x) => x.r.export);
  const up = ex.filter((x) => x.r.change > 0).length;
  const avg = ex.length ? ex.reduce((a, x) => a + x.r.change, 0) / ex.length : 0;
  $('#exportSum').innerHTML = ln('Товарів у файлі', fmt(ex.length)) + ln('Ціна піднімається', fmt(up)) + ln('Ціна знижується', fmt(ex.length - up)) +
    (ex.length ? ln('Середня зміна', (avg > 0 ? '+' : '') + money(avg), 'total') : '');
  const btn = $('#dl');
  btn.disabled = !ex.length || state.demo;
  $('#dl-note').textContent = state.demo ? 'У прикладі файл не створюється — завантажте свій експорт з Prom.'
    : !ex.length ? 'Немає товарів зі зміною ціни.' : 'Файл у тому ж форматі, що експорт з Prom. Змінено тільки колонку «Ціна» і лише у відмічених товарах.' +
      (ex.some((x) => x.costEst) ? ` Серед них ${fmt(ex.filter((x) => x.costEst).length)} з умовною закупівлею — ви відмітили їх самі.` : '');
}

function download() {
  const ex = state.rows.filter((x) => x.r.export);
  if (!ex.length || !state.src) return;
  const changes = new Map(ex.map((x) => [x.row, x.r.reco]));
  const data = buildPromExport(state.src, changes);
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pricing-kit-prom-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

// ---------- код доступу ----------
function codeForm(slot) {
  return `<form class="code-form" data-slot="${slot}" novalidate>
    <label for="code-${slot}">Код з листа</label>
    <textarea id="code-${slot}" rows="3" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="PK-0001-…"></textarea>
    <button class="btn wide" type="submit">Активувати</button>
    <p class="warn" role="alert" hidden></p>
  </form>`;
}
function renderLicense() {
  for (const el of $$('.lic-state')) {
    el.innerHTML = state.licensed
      ? `<p class="lic-ok">Повний доступ · ліцензія ${esc(state.license.number)}</p>`
      : `<button type="button" class="link" data-act="show-code" data-slot="${el.dataset.slot}">У мене є код</button><div class="code-slot" hidden>${codeForm(el.dataset.slot)}</div>`;
  }
}
async function activate(raw, { silent = false } = {}) {
  const res = await checkCode(raw, state.licenseData);
  if (!res.ok) return res;
  state.licensed = true; state.license = res;
  ls.set('license', res.code);
  renderLicense();
  if (!silent) { recalc(); renderProducts(); renderResult(); renderExport(); }
  return res;
}

// ---------- файли ----------
async function onProductsFile(file) {
  const err = $('#err1');
  err.hidden = true;
  $('#drop1').classList.add('busy');
  try {
    const res = await readProducts(file);
    if (!res.items || !res.items.length || res.fatal) {
      err.textContent = (res.problems || ['У файлі не знайшли товарів.']).join(' ');
      err.hidden = false; return;
    }
    res.fileName = file.name;
    state.src = res; state.demo = false; state.expOff = {}; state.expOn = {}; state.shown = PAGE;
    await idb.set('src', { header: res.header, rows: res.rows, idx: res.idx, items: res.items, sheetName: res.sheetName, fileName: res.fileName, problems: res.problems });
    if (state.costTable) {
      state.costCols = guessCostColumns(state.costTable, costKeys());
      state.costMap = buildCostMap(state.costTable, state.costCols.keyCol, state.costCols.priceCol);
      idb.set('costs', { rows: state.costTable.rows, width: state.costTable.width, fileName: state.costTable.fileName, cols: state.costCols });
    }
    renderProducts();
  } catch (e) {
    err.textContent = 'Не вдалося прочитати файл. Потрібен XLSX або CSV з кабінету Prom.';
    err.hidden = false;
    console.error(e);
  } finally { $('#drop1').classList.remove('busy'); }
}

function costKeys() { const k = new Set(); for (const it of items()) { if (it.sku) k.add(it.sku); k.add(it.id); } return k; }
async function onCostFile(file) {
  if (state.demo || !items().length) return;
  try {
    const t = await readCostTable(file);
    t.fileName = file.name;
    state.costTable = t;
    state.costCols = guessCostColumns(t, costKeys());
    state.costMap = buildCostMap(t, state.costCols.keyCol, state.costCols.priceCol);
    await idb.set('costs', { rows: t.rows, width: t.width, fileName: t.fileName, cols: state.costCols });
    renderCosts();
  } catch (e) {
    $('#cost-status').innerHTML = '<p class="warn">Не вдалося прочитати прайс. Потрібен XLSX або CSV.</p>';
    console.error(e);
  }
}

// ---------- події ----------
document.addEventListener('click', (e) => {
  const t = e.target;
  const f = t.closest('[data-f]'); if (f) { state.filter = f.dataset.f; state.shown = PAGE; renderResult(); return; }
  const g = t.closest('[data-go]');
  if (g) {
    e.preventDefault();
    if (g.hasAttribute('data-demo')) { state.demo = true; state.settings = { ...DEFAULT_SETTINGS, ...DEMO_SETTINGS }; fillSettingsForm(); }
    go(+g.dataset.go); return;
  }
  const a = t.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act === 'more') { state.shown += PAGE; renderResult(); }
  if (act === 'reset-products') { state.src = null; idb.del('src'); renderProducts(); }
  if (act === 'exit-demo') { state.demo = false; state.settings = { ...DEFAULT_SETTINGS, ...ls.get('settings', {}) }; fillSettingsForm(); go(2); }
  if (act === 'reset-costs') { state.costTable = null; state.costMap = new Map(); idb.del('costs'); renderCosts(); }
  if (act === 'clear-manual') { state.manualCost = {}; ls.set('manualCost', {}); renderCosts(); }
  if (act === 'download') download();
  if (act === 'show-code') { const slot = a.nextElementSibling; slot.hidden = !slot.hidden; if (!slot.hidden) $('textarea', slot).focus(); }
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.matches('[data-k]')) { readSettingsForm(); return; }
  if (t.id === 'file1' && t.files[0]) { onProductsFile(t.files[0]); t.value = ''; return; }
  if (t.id === 'file2' && t.files[0]) { onCostFile(t.files[0]); t.value = ''; return; }
  if (t.matches('[data-cc]')) {
    state.costCols[t.dataset.cc] = +t.value;
    state.costMap = buildCostMap(state.costTable, state.costCols.keyCol, state.costCols.priceCol);
    idb.set('costs', { rows: state.costTable.rows, width: state.costTable.width, fileName: state.costTable.fileName, cols: state.costCols });
    renderCosts(); return;
  }
  if (t.matches('[data-exp]')) {
    const id = t.dataset.exp;
    if (t.checked) { delete state.expOff[id]; state.expOn[id] = true; } else { state.expOff[id] = true; delete state.expOn[id]; }
    recalc(); renderResult(); renderExport(); return;
  }
  if (t.id === 'est-on' || t.id === 'est-pct') {
    const v = parseFloat(String($('#est-pct').value).replace(',', '.'));
    const next = { on: $('#est-on').checked, pct: isFinite(v) && v > 0 && v < 100 ? v / 100 : state.estimate.pct };
    // Умовна закупівля змінилась — галочки, поставлені під старий відсоток, скидаємо.
    if (next.on !== state.estimate.on || next.pct !== state.estimate.pct) state.expOn = {};
    state.estimate = next;
    ls.set('estimate', state.estimate);
    renderCosts(); return;
  }
  if (t.matches('[data-keep]')) { const k = keepStore(); if (t.checked) k[t.dataset.keep] = true; else delete k[t.dataset.keep]; if (!state.demo) ls.set('keep', state.keep); recalc(); renderResult(); renderExport(); return; }
  if (t.matches('[data-cost]')) {
    const v = parseFloat(String(t.value).replace(',', '.').replace(/\s/g, ''));
    const m = manualStore();
    if (isFinite(v) && v >= 0) m[t.dataset.cost] = v; else delete m[t.dataset.cost];
    if (!state.demo) ls.set('manualCost', state.manualCost);
    recalc(); renderResult(); renderExport();
  }
});

document.addEventListener('submit', async (e) => {
  const f = e.target.closest('.code-form'); if (!f) return;
  e.preventDefault();
  const err = $('.warn', f); err.hidden = true;
  const res = await activate($('textarea', f).value);
  if (!res.ok) { err.textContent = REASON_TEXT[res.reason]; err.hidden = false; }
});

// ---------- старт ----------
async function init() {
  const [rates, cats] = await Promise.all([
    fetch('data/rates.json').then((r) => r.json()),
    fetch('data/prom-categories.json').then((r) => r.json()),
  ]);
  state.rates = rates; state.cats = cats;
  try { state.licenseData = await fetch('data/license.json').then((r) => r.json()); } catch { state.licenseData = { key: null, revoked: [] }; }
  let fromLink = null;
  const m = /code=([^&]+)/.exec(location.hash);
  if (m) {
    try { fromLink = decodeURIComponent(m[1]); } catch { fromLink = m[1]; }
    history.replaceState(null, '', location.pathname);
  }
  const saved = ls.get('license', null);
  if (saved) {
    const r = await activate(saved, { silent: true });
    // Тимчасова помилка (не завантажився ключ, старий браузер) не стирає куплений код.
    if (!r.ok && r.reason !== 'crypto') ls.del('license');
  }
  if (fromLink) {
    const r = await activate(fromLink, { silent: true });
    state.linkResult = r;
  }
  renderLicense();
  fillSettingsForm();
  const src = await idb.get('src'); if (src) state.src = src;
  const c = await idb.get('costs');
  if (c) { state.costTable = { rows: c.rows, width: c.width, fileName: c.fileName }; state.costCols = c.cols; state.costMap = buildCostMap(state.costTable, c.cols.keyCol, c.cols.priceCol); }
  if (location.hash === '#demo') {
    state.demo = true; state.settings = { ...DEFAULT_SETTINGS, ...DEMO_SETTINGS }; fillSettingsForm(); go(4);
  } else {
    const n = SCREENS.indexOf(location.hash.slice(1));
    go(n > 0 ? n : 0);
  }
  if (state.linkResult) {
    const note = $('#link-note');
    note.textContent = state.linkResult.ok ? `Повний доступ увімкнено · ліцензія ${state.linkResult.number}` : REASON_TEXT[state.linkResult.reason];
    note.className = state.linkResult.ok ? 'lic-ok' : 'warn';
    note.hidden = false;
  }
  document.body.classList.remove('loading');
}
init().catch((e) => { console.error(e); $('#boot-err').hidden = false; });
