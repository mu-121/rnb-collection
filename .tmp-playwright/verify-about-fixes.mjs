import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";

const OUT = path.resolve("out-fix-verify");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function measureAbout(url, label, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1500);

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
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        padding: s.padding,
        color: s.color,
        fontFamily: s.fontFamily.slice(0, 50),
      };
    };

    const isLocal = !!q(".about-hero");
    const hero = q(".about-hero") || q('[data-framer-name="Hero section"]');
    const body = qa("p").find((p) => (p.textContent || "").includes("We focus on creating"));
    const h1 = q("h1");

    const stats = ["10M+", "98%", "300+", "500K+"].map((v) => {
      const el = qa("h2,p").find((n) => (n.textContent || "").trim() === v);
      let card = el;
      for (let i = 0; i < 8 && card; i++) {
        if (card.getBoundingClientRect().height > 200) break;
        card = card.parentElement;
      }
      const r = card?.getBoundingClientRect();
      return {
        value: v,
        w: r ? +r.width.toFixed(1) : null,
        h: r ? +r.height.toFixed(1) : null,
        x: r ? +r.x.toFixed(1) : null,
      };
    });

    const gaps =
      stats.length > 1 && stats[0].x != null
        ? stats.slice(1).map((s, i) => +(s.x - (stats[i].x + stats[i].w)).toFixed(1))
        : [];

    const sections = isLocal
      ? qa("section").map((s) => s.className.toString().split(" ")[0])
      : ["hero", "trust", "mission", "social", "newsletter", "footer"];

    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      hero: dump(hero),
      h1: dump(h1),
      body: dump(body),
      stats,
      gaps,
      sections,
      hasFooter: !!q("footer"),
      starColor: q(".about-trust__stars")
        ? getComputedStyle(q(".about-trust__stars")).color
        : null,
    };
  });

  await page.close();
  return { label, w, data, errors };
}

async function measureHome(w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1200);
  const data = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const dump = (el) =>
      el
        ? {
            h: +el.getBoundingClientRect().height.toFixed(1),
            y: +(el.getBoundingClientRect().top + scrollY).toFixed(1),
          }
        : null;
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      order: [
        "announce",
        "header",
        "hero",
        "newArrivals",
        "brandStory",
        "bestSellers",
        "collections",
        "reviews",
        "features",
        "blog",
        "social",
        "newsletter",
        "footer",
      ].filter((k) => {
        const map = {
          announce: ".announce",
          header: ".site-header",
          hero: ".hero",
          newArrivals: ".new-arrivals",
          brandStory: ".brand-story",
          bestSellers: ".best-sellers",
          collections: ".collections",
          reviews: ".customer-reviews",
          features: ".features",
          blog: ".blog",
          social: ".social-gallery",
          newsletter: ".newsletter",
          footer: "footer",
        };
        return !!q(map[k]);
      }),
      hero: dump(q(".hero")),
      announce: dump(q(".announce")),
    };
  });
  await page.close();
  return { w, data };
}

const LOCAL = "http://localhost:3000/about";
const LIVE = "https://wearix.framer.website/about";

const report = { local: [], live: [], home: [] };
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
  report.local.push(await measureAbout(LOCAL, "local", w, h));
}
for (const [w, h] of [
  [1440, 900],
  [1024, 800],
  [390, 844],
]) {
  report.live.push(await measureAbout(LIVE, "live", w, h));
}
for (const [w, h] of [
  [1440, 900],
  [1024, 800],
  [390, 844],
]) {
  report.home.push(await measureHome(w, h));
}

fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

function find(arr, w) {
  return arr.find((x) => x.w === w);
}

for (const w of [1440, 1024, 390]) {
  const L = find(report.local, w).data;
  const V = find(report.live, w).data;
  console.log(`\n=== ${w} ===`);
  console.log("heroH", L.hero?.h, "vs", V.hero?.h, "diff", (L.hero?.h - V.hero?.h).toFixed(1));
  console.log("body", L.body?.fontSize, L.body?.h, "vs", V.body?.fontSize, V.body?.h);
  console.log("h1", L.h1?.fontSize, "vs", V.h1?.fontSize);
  console.log("stats L", L.stats.map((s) => `${s.w}x${s.h}`), "gaps", L.gaps);
  console.log("stats V", V.stats.map((s) => `${s.w}x${s.h}`), "gaps", V.gaps);
  console.log("overflow", L.overflowX, "errors", find(report.local, w).errors);
}
console.log("\n=== EXTRA LOCAL ===");
for (const row of report.local) {
  console.log(row.w, "hero", row.data.hero?.h, "body", row.data.body?.fontSize, "stat0", row.data.stats[0]?.w, "overflow", row.data.overflowX);
}
console.log("\n=== HOME ===");
for (const h of report.home) {
  console.log(h.w, h.data.order.join(">"), "hero", h.data.hero?.h, "overflow", h.data.overflowX);
}

await browser.close();
