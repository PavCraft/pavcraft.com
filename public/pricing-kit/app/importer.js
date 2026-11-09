// Pricing Kit — читання файлів у браузері (нічого не відправляє в мережу).
// Розпізнавання колонок перенесено з аркуша «Карта» таблиці v1.2.
/* global XLSX */

// Варіанти назв колонок (Prom, Rozetka, прайс сайту). Порядок = пріоритет.
export const FIELDS = {
  id: ['Унікальний_ідентифікатор', 'OFFER ID', 'ID'],
  sku: ['Код_товару', 'Артикул', 'Артикул продавця', 'Код', 'Код товару'],
  name: ['Назва_позиції_укр', 'Назва_позиції', 'Назва', 'Назва товару', 'Номенклатура', 'Наименование'],
  name2: ['Назва_позиції', 'Назва', 'Назва товару'],
  price: ['Ціна', 'Цена', 'Price', 'Цена на сайте', 'Роздрібна ціна'],
  currency: ['Валюта'],
  cat: ['Ідентифікатор_підрозділу', 'Категорія', 'Категория', 'Категорія ROZETKA', 'Група', 'Группа'],
  avail: ['Наявність', 'Статус', 'Наличие', 'Наявність на складі', 'Остаток'],
  weight: ['Вага,кг', 'Вага', 'Вага, кг', 'Вес', 'Вага (кг)', 'Вес, кг'],
};

const norm = (s) => String(s ?? '').trim();

// "1 299,50 грн" → 1299.5 ; порожньо/текст → null
export function parseNum(v) {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const t = norm(v).replace(/[\s ]/g, '').replace(/грн|₴|uah/gi, '').replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return isFinite(n) ? n : null;
}

// CSV читаємо самі: UTF-8 або Windows-1251, і без перетворення тексту на числа/дати
// (інакше артикул 00123 стане 123, а 1-2 — датою).
function decodeText(buf) {
  const bytes = new Uint8Array(buf);
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { text = new TextDecoder('windows-1251').decode(bytes); }
  return text.replace(/^\uFEFF/, '');
}
export async function readWorkbook(file) {
  const buf = await file.arrayBuffer();
  const b = new Uint8Array(buf, 0, Math.min(4, buf.byteLength));
  const binary = (b[0] === 0x50 && b[1] === 0x4b) || (b[0] === 0xd0 && b[1] === 0xcf); // XLSX (zip) або старий XLS
  if (!binary || /\.(csv|txt)$/i.test(file.name || '')) {
    return XLSX.read(decodeText(buf), { type: 'string', dense: true, raw: true });
  }
  return XLSX.read(buf, { type: 'array', dense: true, cellDates: false });
}

// Таблиця аркуша як масив рядків (значення як є: числа — числами)
function sheetRows(ws) {
  return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '', blankrows: false });
}

function mapHeader(header) {
  const idx = {};
  const h = header.map(norm);
  for (const [f, variants] of Object.entries(FIELDS)) {
    for (const v of variants) {
      const i = h.indexOf(v);
      if (i >= 0) { idx[f] = i; break; }
    }
  }
  return idx;
}

// Файл товарів з кабінету. Повертає {platform, header, rows, idx, items, problems}
export async function readProducts(file) {
  const wb = await readWorkbook(file);
  let best = null;
  for (const name of wb.SheetNames) {
    const rows = sheetRows(wb.Sheets[name]);
    for (let r = 0; r < Math.min(rows.length, 10); r++) {
      const idx = mapHeader(rows[r]);
      const score = Object.keys(idx).length;
      if (!best || score > best.score) best = { name, rows, headerRow: r, idx, score };
    }
  }
  if (!best || best.score < 2) {
    return { problems: ['Не схоже на експорт товарів: не знайшли рядок із назвами колонок.'] };
  }
  const header = best.rows[best.headerRow].map(norm);
  const data = best.rows.slice(best.headerRow + 1);
  const idx = best.idx;
  const platform = header.includes('Унікальний_ідентифікатор') ? 'prom'
    : header.includes('OFFER ID') || header.includes('Артикул') ? 'rozetka' : 'unknown';

  const problems = [];
  let fatal = false;
  if (platform !== 'prom') { fatal = true; problems.push('Поки що працюємо тільки з експортом Prom (у файлі має бути колонка «Унікальний_ідентифікатор»).'); }
  const need = { id: 'ID товару', name: 'назва', price: 'ціна', cat: 'категорія' };
  const missing = Object.entries(need).filter(([f]) => idx[f] == null).map(([, l]) => l);
  if (idx.id == null || idx.price == null) fatal = true;
  if (missing.length) problems.push('Не знайшли колонки: ' + missing.join(', ') + '. Перевірте, що це аркуш «Export Products Sheet» з першим рядком назв.');

  const items = [];
  const currencies = new Set();
  data.forEach((row, i) => {
    const id = norm(row[idx.id]);
    if (!id) return;
    const w = idx.weight != null ? parseNum(row[idx.weight]) : null;
    const cur = idx.currency != null ? norm(row[idx.currency]) : '';
    if (cur) currencies.add(cur);
    items.push({
      row: i,                      // індекс рядка в data — для експорту
      id,
      sku: idx.sku != null ? norm(row[idx.sku]) : '',
      name: (idx.name != null ? norm(row[idx.name]) : '') || (idx.name2 != null ? norm(row[idx.name2]) : ''),
      cat: idx.cat != null ? norm(row[idx.cat]) : '',
      price: idx.price != null ? parseNum(row[idx.price]) : null,
      currency: cur,
      avail: idx.avail != null ? norm(row[idx.avail]) : '',
      importWeight: w != null && w > 0 && w <= 100 ? w : null, // як у таблиці: вагу > 100 відкидаємо
    });
  });
  const foreign = [...currencies].filter((c) => !/^(UAH|грн)$/i.test(c));
  if (foreign.length) problems.push('Є ціни у валюті (' + foreign.join(', ') + '). Валюту ця версія не враховує — такі товари рахуються як гривні.');

  return { platform, sheetName: best.name, header, rows: data, idx, items, problems, fatal };
}

// Прайс постачальника: будь-які колонки. Вгадуємо колонку артикула і ціни.
export async function readCostTable(file) {
  const wb = await readWorkbook(file);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = sheetRows(ws);
  const width = rows.reduce((m, r) => Math.max(m, r.length), 0);
  return { rows, width };
}

// keys — Set артикулів і ID товарів. Повертає {keyCol, priceCol, headerRow}
export function guessCostColumns(table, keys) {
  const { rows, width } = table;
  let keyCol = 0, keyHits = -1;
  for (let c = 0; c < width; c++) {
    let hits = 0;
    for (const r of rows) if (keys.has(norm(r[c]))) hits++;
    if (hits > keyHits) { keyHits = hits; keyCol = c; }
  }
  // Колонка ціни: числа в рядках зі знайденим артикулом + підказки з назв колонок у шапці.
  const head = rows.slice(0, 3).map((r) => r.map(norm));
  const label = (c) => head.map((r) => r[c] || '').join(' ');
  let priceCol = keyCol === 0 ? 1 : 0, best = -Infinity;
  for (let c = 0; c < width; c++) {
    if (c === keyCol) continue;
    let hits = 0, frac = 0;
    for (const r of rows) {
      if (!keys.has(norm(r[keyCol]))) continue;
      const v = parseNum(r[c]);
      if (v != null && v > 0) { hits++; if (!Number.isInteger(v) || v >= 50) frac++; }
    }
    if (!hits) continue;
    const l = label(c);
    let score = hits + frac * 0.1;
    if (/закуп|собів|вхідн|опт|cost|purchase/i.test(l)) score += hits * 2;
    else if (/ціна|цена|price|вартість/i.test(l)) score += hits;
    if (/к-сть|кільк|колич|qty|залиш|остат|наявн|роздр|розн|retail|вага|вес/i.test(l)) score -= hits * 2;
    if (score > best) { best = score; priceCol = c; }
  }
  return { keyCol, priceCol, matched: Math.max(keyHits, 0) };
}

export function columnLabels(table) {
  const first = table.rows[0] || [];
  return Array.from({ length: table.width }, (_, c) => {
    const letter = XLSX.utils.encode_col(c);
    const h = norm(first[c]);
    return h ? `${letter} · ${h.slice(0, 28)}` : `Колонка ${letter}`;
  });
}

// Мапа артикул/ID → ціна. Порядок пошуку як у таблиці: спершу артикул, потім ID.
export function buildCostMap(table, keyCol, priceCol) {
  const m = new Map();
  for (const r of table.rows) {
    const k = norm(r[keyCol]);
    const p = parseNum(r[priceCol]);
    if (k && p != null) m.set(k, p);
  }
  return m;
}

// Файл для імпорту в Prom: той самий формат, що експорт, тільки товари зі зміною, нова ціна.
export function buildPromExport(src, changes /* Map row → newPrice */) {
  const priceCol = src.idx.price;
  const aoa = [src.header];
  for (const [row, price] of changes) {
    const r = src.rows[row].slice();
    while (r.length < src.header.length) r.push('');
    r[priceCol] = price;
    aoa.push(r);
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, src.sheetName || 'Export Products Sheet');
  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
}
