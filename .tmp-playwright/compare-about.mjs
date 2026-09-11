import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";

const OUT = path.resolve("out-about-local");
fs.mkdirSync(OUT, { recursive: true });

const LOCAL = "http://localhost:3000/about";
const LIVE = "https://wearix.framer.website/about";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function shot(url, label, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, `${label}-${w}.png`), fullPage: true });
  const metrics = await page.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        fontSize: s.fontSize,
        color: s.color,
        bg: s.backgroundColor,
        padding: s.padding,
      };
    };
    return {
      title: document.title,
      h1: box(q("h1")),
      h1Text: q("h1")?.textContent?.trim(),
      hero: box(q(".about-hero, [data-framer-name='Hero section']")),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      sections: [...document.querySelectorAll("section")].map((s) => ({
        cls: s.className?.toString().slice(0, 40),
        h: +s.getBoundingClientRect().height.toFixed(1),
      })),
      headings: [...document.querySelectorAll("h1,h2")].map((h) =>
        h.textContent.replace(/\s+/g, " ").trim().slice(0, 80),
      ),
    };
  });
  fs.writeFileSync(path.join(OUT, `${label}-${w}.json`), JSON.stringify(metrics, null, 2));
  console.log(label, w, metrics.h1Text, "heroH", metrics.hero?.h, "overflow", metrics.overflowX);
  await page.close();
  return metrics;
}

for (const w of [1440, 1024, 390, 320, 375, 768, 810, 1200]) {
  await shot(LOCAL, "local", w, w <= 500 ? 844 : 900);
}
await shot(LIVE, "live", 1440, 900);
await shot(LIVE, "live", 1024, 800);
await shot(LIVE, "live", 390, 844);

await browser.close();
console.log("done");
