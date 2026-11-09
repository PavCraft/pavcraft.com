// Pricing Kit — розрахунковий модуль.
// Перенесено 1:1 з Google Таблиці Pricing Kit v1.2 (аркуш «Товари», колонки M–V).
// Специфікація: D:\MyScripts\pricing-kit\docs\calc-spec.md. Звірка: pricing-kit/tests/parity.mjs.
// Чисті функції, без DOM: працює і в браузері, і в Node.

export const STATUS = {
  NO_PRICE: 'НЕМАЄ ЦІНИ',
  NO_COST: 'НЕМАЄ ЗАКУПІВЛІ',
  NO_RATE: 'НЕМАЄ СТАВКИ',
  LOSS: 'ЗБИТОК',
  LOW: 'НИЖЧЕ ЦІЛІ',
  OK: 'ОК',
};

// Значення за замовчуванням для нового покупця (як у МАЙСТЕР-копії таблиці).
export const DEFAULT_SETTINGS = {
  platform: 'prom',          // 'prom' | 'rozetka' | 'site'
  tax: 'fop3',               // ключ з rates.taxes
  taxOverride: null,         // {single, war, vat, fixedMonthly} — свої числа замість стандартних
  esvMonthly: null,          // null = з rates.esvMonthly
  orders: 100,               // замовлень на місяць (усі майданчики)
  adBudget: 0,               // реклама на місяць, грн (крім ProSale)
  promPackage: 'Prom мікс 1 000',
  customPackageYearly: 0,    // якщо promPackage = 'custom'
  rozetkaSubscription: null, // null = з rates
  packing: 15,
  returnShare: 0.05,
  returnCost: 180,
  shipPayer: 'buyer',        // 'buyer' | 'seller'
  carrier: 'Нова Пошта',
  codVariant: 2,             // 1 | 2 — тариф післяплати (2 — дорожчий, консервативно)
  codShare: 0.5,             // частка замовлень з післяплатою
  goal: 0.2,                 // цільова чиста маржа
  rounding: '9',             // '9' | '10' | 'none'
  minStep: 5,
  lowerPrices: false,        // знижувати ціни, де маржа вища за ціль
  prosale: 'Звичайний',
  defaultWeight: 0.5,
  rozetkaDefaultCommission: null, // null = з rates
  siteType: 'none',          // 'none' | 'subdomain' | 'own' (сайт компанії на Prom)
  siteShare: 0,              // частка замовлень з власного сайту
  site: { acquiring: 0.015, subscriptionMonthly: 0, cpc: 7.5, conv3000: 0.04, elasticity: 0.5, fixedCpa: 0 },
};

const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const clamp01 = (v) => Math.min(1, Math.max(0, num(v)));

// Спільні для всіх товарів величини (аркуш «Налаштування» + «Ставки» + «Доставка»).
export function buildContext(userSettings, rates, promCats) {
  const s = { ...DEFAULT_SETTINGS, ...userSettings, site: { ...DEFAULT_SETTINGS.site, ...(userSettings?.site || {}) } };
  const t = { ...rates.taxes[s.tax], ...(s.taxOverride || {}) };
  const isProm = s.platform === 'prom';
  const isSite = s.platform === 'site';

  let subscription;
  if (isProm) {
    if (s.promPackage === 'custom') subscription = num(s.customPackageYearly) / 12;
    else subscription = (rates.promPackages.find((p) => p.name === s.promPackage)?.yearly || 0) / 12;
  } else if (isSite) subscription = num(s.site.subscriptionMonthly);
  else subscription = s.rozetkaSubscription ?? rates.platforms.rozetka.subscriptionMonthly;

  const esv = s.esvMonthly ?? rates.esvMonthly;
  const monthlyFixed = esv + num(t.fixedMonthly) + subscription;
  const orders = num(s.orders);
  const perOrderMonthly = orders <= 0 ? 0 : monthlyFixed / orders;
  const adPerOrder = orders === 0 ? 0 : num(s.adBudget) / orders;

  const acquiring = isProm ? rates.platforms.prom.acquiring : isSite ? num(s.site.acquiring) : rates.platforms.rozetka.acquiring;
  const seller = s.shipPayer === 'seller';
  const carrier = rates.carriers[s.carrier] || rates.carriers['Нова Пошта'];
  const [codPct, codFix] = s.codVariant === 1 ? carrier.cod1 : carrier.cod2;
  const codShare = clamp01(s.codShare);

  // Частка замовлень через кошик власного домену на Prom: 10 грн замість % категорії.
  const siteShareEff = isProm && s.siteType === 'own' ? clamp01(s.siteShare) : 0;

  const prosale = rates.prosale[s.prosale] || rates.prosale['Звичайний'];

  // % від ціни, крім комісії: еквайринг на передоплатах + податки + післяплата перевізника.
  const pctOfPrice =
    acquiring * (1 - codShare) +
    (num(t.single) + num(t.war) + num(t.vat)) +
    (seller ? codPct * codShare : 0);

  // Фіксована частина на замовлення, крім доставки (вона залежить від ваги).
  const fixedBase =
    perOrderMonthly +
    num(s.packing) +
    (seller ? codFix * codShare : 0) +
    num(s.returnShare) * num(s.returnCost) +
    adPerOrder +
    rates.platforms.prom.ownDomainPerOrder * siteShareEff;

  return {
    s, rates, promCats, isProm, isSite, seller, carrier, prosale, siteShareEff,
    acquiring, pctOfPrice, fixedBase, perOrderMonthly, adPerOrder,
    threshold: rates.promHighThreshold,
    highRate: prosale.highRate * (1 - siteShareEff),
    returnReserve: num(s.returnShare) * num(s.returnCost),
    codPct, codFix, codShare,
  };
}

function roundPrice(q, mode) {
  if (mode === '9') return Math.ceil((q - 9) / 10) * 10 + 9;
  if (mode === '10') return Math.ceil(q / 10) * 10;
  return Math.ceil(q);
}
const r6 = (x) => Math.round(x * 1e6) / 1e6;

// Ставка Prom для категорії (з урахуванням режиму ProSale), або null, якщо категорії немає в таблиці.
export function promRate(ctx, cat) {
  const row = ctx.promCats?.cats?.[String(cat).trim().replace(/\.0+$/, '')];
  if (!row) return null;
  const r = row[ctx.prosale.col];
  return typeof r === 'number' ? r + ctx.rates.platforms.prom.extra : null;
}

// Розрахунок одного товару. item: {id, sku, name, cat, price, cost, goal?, weight?, importWeight?, keep?, rozRate?}
export function calcItem(ctx, item) {
  const { s } = ctx;
  const G = num(item.price, NaN);
  const I = item.cost === '' || item.cost == null ? null : num(item.cost, NaN);
  const goal = item.goal != null && item.goal !== '' ? item.goal : s.goal;
  const out = { goal };

  // Комісія майданчика, частка від ціни
  let M;
  if (ctx.isProm) {
    const y = promRate(ctx, item.cat);
    out.promRate = y;
    M = y == null ? null : y * (1 - ctx.siteShareEff);
  } else if (ctx.isSite) M = 0;
  else {
    const z = num(item.rozRate);
    const base = z === 0 ? (s.rozetkaDefaultCommission ?? ctx.rates.platforms.rozetka.defaultCommission) : z;
    M = base * ctx.rates.platforms.rozetka.vatMultiplier + ctx.rates.platforms.rozetka.extra;
    out.rozEstimated = z === 0;
  }
  out.commission = M;

  // Доставка за рахунок продавця — за вагою (між містами)
  const w = item.weight != null && item.weight !== '' ? item.weight
    : item.importWeight != null && item.importWeight !== '' ? item.importWeight : s.defaultWeight;
  const [b1, b2] = ctx.rates.weightBands;
  const ship = ctx.seller ? (w <= b1 ? ctx.carrier.intercity[0] : w <= b2 ? ctx.carrier.intercity[1] : ctx.carrier.intercity[2]) : 0;

  // Залучення замовлення для режиму «Власний сайт / Hotline»
  let acq = 0;
  if (ctx.isSite) {
    const st = s.site;
    acq = num(st.fixedCpa) > 0 ? st.fixedCpa
      : st.cpc / (st.conv3000 * Math.pow((G > 0 ? G : 3000) / 3000, -st.elasticity));
  }
  out.acquisition = acq;
  out.shipping = ship;

  const F = ctx.fixedBase + ship + acq; // фіксовані грн на замовлення
  const V = ctx.pctOfPrice;              // % від ціни, крім комісії
  out.fixedPerOrder = F;
  out.pctOfPrice = V;

  // Витрати без закупівлі (колонка N)
  let N = null;
  if (M != null && isFinite(G)) {
    const commAmount = ctx.isProm && G > ctx.threshold
      ? ctx.threshold * M + (G - ctx.threshold) * ctx.highRate
      : G * M;
    out.commissionAmount = commAmount;
    N = commAmount + G * V + F;
  }
  out.costs = N;

  // Прибуток і маржа зараз
  const O = I == null || N == null || !isFinite(I) ? null : G - I - N;
  const P = O == null || !G ? null : O / G;
  out.profit = O;
  out.margin = P;

  // Мінімальна ціна під ціль (колонка Q)
  let Q = null;
  if (I != null && isFinite(I) && M != null) {
    const d1 = 1 - M - V - goal;
    if (d1 > 0) {
      const q1 = (I + F) / d1;
      if (ctx.isProm && q1 > ctx.threshold) {
        const d2 = 1 - ctx.highRate - V - goal;
        Q = d2 > 0 ? (I + F + ctx.threshold * (M - ctx.highRate)) / d2 : null;
      } else Q = q1;
    }
  }
  out.minPrice = Q;

  // Рекомендована ціна (R)
  let R = null;
  if (Q != null) {
    // Як у таблиці: ROUND(порожньо) = 0, тож без маржі (ціна 0) товар вважається нижче цілі.
    const below = P == null || r6(P) < goal;
    R = s.lowerPrices || below ? roundPrice(Q, s.rounding) : G;
  }
  out.reco = R;
  out.change = R == null ? null : R - G;
  out.changePct = R == null || !G ? null : (R - G) / G;

  // Статус (U)
  let st;
  if (!isFinite(G) || G <= 0) st = STATUS.NO_PRICE;
  else if (I == null || !isFinite(I)) st = STATUS.NO_COST;
  else if (M == null) st = STATUS.NO_RATE;
  else if (O < 0) st = STATUS.LOSS;
  else if (r6(P) < goal) st = STATUS.LOW;
  else st = STATUS.OK;
  out.status = st;

  // До експорту (V)
  const S = out.change;
  out.export = R != null && st !== STATUS.NO_PRICE && item.keep !== true &&
    (Math.abs(S) >= s.minStep || st === STATUS.LOSS) &&
    (s.lowerPrices || st === STATUS.LOSS || st === STATUS.LOW) &&
    S !== 0;

  return out;
}

export function calcAll(ctx, items) {
  return items.map((it) => ({ ...it, r: calcItem(ctx, it) }));
}

// Зведення для екрана «Чек»
export function summarize(rows) {
  const by = {};
  for (const s of Object.values(STATUS)) by[s] = 0;
  let mSum = 0, mN = 0, exp = 0;
  for (const x of rows) {
    by[x.r.status]++;
    if (x.r.margin != null) { mSum += x.r.margin; mN++; }
    if (x.r.export) exp++;
  }
  return { total: rows.length, by, avgMargin: mN ? mSum / mN : null, toExport: exp };
}
