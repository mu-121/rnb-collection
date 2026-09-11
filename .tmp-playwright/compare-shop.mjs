import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";

const OUT = path.resolve("out-shop-compare");
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function measure(url, label, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1800);
  const data = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const qa = (s) => [...document.querySelectorAll(s)];
    const dump = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        fontSize: s.fontSize,
        color: s.color,
        padding: s.padding,
        gap: s.gap,
        gridCols: s.gridTemplateColumns,
        bg: s.backgroundColor,
      };
    };
    const isLocal = !!q(".shop-hero");
    const hero = q(".shop-hero") || q('[data-framer-name="Hero section"]');
    const h1 = q("h1");
    const body = qa("p").find((p) => (p.textContent || "").includes("Explore our handpicked"));
    const grid = q(".shop-grid") || (() => {
      const a = qa("a").find((el) => (el.getAttribute("href") || "").includes("textured-knitted"));
      let g = a?.parentElement;
      for (let i = 0; i < 8 && g; i++) {
        if (getComputedStyle(g).display.includes("grid")) break;
        g = g.parentElement;
      }
      return g;
    })();
    const cards = isLocal
      ? qa(".product-card")
      : qa("a").filter((a) => /\$\d+\.\d{2}/.test(a.textContent || "") && a.getBoundingClientRect().height > 100);
    const uniq = [];
    const seen = new Set();
    for (const c of cards) {
      const href = c.getAttribute("href") || c.querySelector?.("a")?.getAttribute("href") || Math.random();
      if (seen.has(href)) continue;
      seen.add(href);
      uniq.push(c);
    }
    const first = uniq[0];
    const filters = q(".shop-filters") || q('[data-framer-name="Tabs"]');
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      hero: dump(hero),
      h1: dump(h1),
      h1Text: h1?.textContent?.trim(),
      body: dump(body),
      filters: dump(filters),
      grid: dump(grid),
      productCount: uniq.length,
      firstCard: first ? dump(first) : null,
      mediaH: first?.querySelector("img")?.getBoundingClientRect().height,
      sections: isLocal
        ? qa("section").map((s) => s.className.toString().split(" ")[0])
        : ["hero", "catalog", "social", "newsletter"],
      hasSocial: !!q(".social-gallery") || !!qa("h2").find((h) => (h.textContent || "").includes("See our community")),
      hasFooter: !!q("footer"),
      starOrange: !!qa("*").find((el) => getComputedStyle(el).color.includes("255, 106")),
    };
  });
  await page.screenshot({ path: path.join(OUT, `${label}-${w}.png`), fullPage: false });
  await page.close();
  return { label, w, data, errors };
}

const report = { local: [], live: [], home: [], routes: [] };
for (const [w, h] of [
  [1440, 900],
  [1024, 800],
  [390, 844],
  [320, 700],
  [375, 812],
  [768, 900],
  [810, 900],
  [1200, 900],
]) {
  report.local.push(await measure("http://localhost:3000/shop", "local", w, h));
}
for (const [w, h] of [
  [1440, 900],
  [1024, 800],
  [390, 844],
]) {
  report.live.push(await measure("https://wearix.framer.website/shop", "live", w, h));
}

// homepage regression quick
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  report.home.push(
    await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim(),
      hasAboutLink: !!document.querySelector('a[href="/about"]'),
      hasShopLink: !!document.querySelector('a[href="/shop"]'),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      sections: [".announce", ".hero", ".new-arrivals", ".brand-story", ".about-hero", ".shop-hero"].map(
        (s) => ({ s, present: !!document.querySelector(s) }),
      ),
    })),
  );
  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
  report.home.push({
    about: await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim(),
      hasAboutHero: !!document.querySelector(".about-hero"),
      hasShopHero: !!document.querySelector(".shop-hero"),
    })),
  });
  for (const r of ["/", "/about", "/shop", "/contact", "/blog"]) {
    const res = await page.goto(`http://localhost:3000${r}`, { waitUntil: "domcontentloaded" }).catch(() => null);
    report.routes.push({ r, status: res?.status() ?? 0 });
  }
  await page.close();
}

fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
for (const w of [1440, 1024, 390]) {
  const L = report.local.find((x) => x.w === w).data;
  const V = report.live.find((x) => x.w === w).data;
  console.log(`\n=== ${w} ===`);
  console.log("heroH", L.hero?.h, "vs", V.hero?.h);
  console.log("h1", L.h1?.fontSize, L.h1?.w, "vs", V.h1?.fontSize, V.h1?.w);
  console.log("body", L.body?.fontSize, "vs", V.body?.fontSize);
  console.log("grid", L.grid?.gridCols?.slice(0, 60), "gap", L.grid?.gap, "vs", V.grid?.gridCols?.slice(0, 60), V.grid?.gap);
  console.log("products", L.productCount, "vs", V.productCount);
  console.log("card", L.firstCard?.w, "x", L.firstCard?.h, "media", L.mediaH, "vs", V.firstCard?.w, V.firstCard?.h, V.mediaH);
  console.log("filters", L.filters?.w, L.filters?.h, L.filters?.bg, "vs", V.filters?.w, V.filters?.h, V.filters?.bg);
  console.log("overflow", L.overflowX, "errors", report.local.find((x) => x.w === w).errors);
}
console.log("\nEXTRA", report.local.map((x) => ({ w: x.w, products: x.data.productCount, overflow: x.data.overflowX, hero: x.data.hero?.h })));
console.log("HOME", report.home);
console.log("ROUTES", report.routes);
await browser.close();
