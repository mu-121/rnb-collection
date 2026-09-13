import { chromium } from "./package/index.mjs";
import fs from "node:fs";

const LOCAL = "http://localhost:3000/shop/textured-knitted-shirt";
const LIVE = "https://wearix.framer.website/shop/textured-knitted-shirt";
const WIDTHS = [
  320, 375, 390, 414, 480, 540, 768, 810, 834, 912, 1024, 1200, 1280, 1366,
  1440, 1600, 1920,
];

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
const responsive = {};
for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(150);
  responsive[w] = await page.evaluate(() => {
    const stage = document.querySelector(".product-gallery__stage");
    const thumbs = document.querySelector(".product-gallery__thumbs");
    const sr = stage?.getBoundingClientRect();
    const tr = thumbs?.getBoundingClientRect();
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      stage: sr ? { w: +sr.width.toFixed(1), h: +sr.height.toFixed(1) } : null,
      thumbsInside:
        !!sr &&
        !!tr &&
        tr.top >= sr.top - 1 &&
        tr.bottom <= sr.bottom + 1,
      orderW: +(
        document.querySelector(".product-info__order")?.getBoundingClientRect()
          .width || 0
      ).toFixed(1),
      stacked:
        (document.querySelector(".product-page__layout")
          ? getComputedStyle(document.querySelector(".product-page__layout"))
              .gridTemplateColumns
          : "") === "none" ||
        !getComputedStyle(
          document.querySelector(".product-page__layout"),
        ).gridTemplateColumns.includes(" "),
    };
  });
  // fix stacked detection
  responsive[w].cols = await page.evaluate(
    () =>
      getComputedStyle(document.querySelector(".product-page__layout"))
        .gridTemplateColumns,
  );
}
fs.writeFileSync(
  "./out-product-audit/responsive.json",
  JSON.stringify(responsive, null, 2),
);

// final sample measure live vs local
const final = {};
for (const w of [1440, 1024, 390]) {
  for (const [name, url] of [
    ["live", LIVE],
    ["local", LOCAL],
  ]) {
    await page.setViewportSize({ width: w, height: 1100 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(600);
    final[`${name}_${w}`] = await page.evaluate(() => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          y: +(r.top + scrollY).toFixed(1),
        };
      };
      return {
        stage: box(".product-gallery__stage"),
        info: box(".product-info"),
        title: box(".product-info__title") || null,
        order: box(".product-info__order"),
        trust: box(".product-trust"),
        overflowX:
          document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    await page.screenshot({
      path: `./out-product-audit/final-${name}-${w}.png`,
      fullPage: false,
    });
  }
}
fs.writeFileSync(
  "./out-product-audit/final-measure.json",
  JSON.stringify(final, null, 2),
);
console.log(JSON.stringify({ responsive, final }, null, 2));
await browser.close();
