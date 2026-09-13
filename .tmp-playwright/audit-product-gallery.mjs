import { chromium } from "./package/index.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "out-product-audit");
fs.mkdirSync(OUT, { recursive: true });

const LIVE = "https://wearix.framer.website/shop/textured-knitted-shirt";
const LOCAL = process.env.BASE_URL
  ? `${process.env.BASE_URL}/shop/textured-knitted-shirt`
  : "http://localhost:3000/shop/textured-knitted-shirt";

async function measure(page, label) {
  return page.evaluate((lbl) => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        x: +r.left.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        radius: s.borderRadius,
        gap: s.gap || s.columnGap || null,
        display: s.display,
        overflowX: s.overflowX,
        overflowY: s.overflowY,
      };
    };

    // Heuristic: find product images (tall portrait fashion shots)
    const imgs = [...document.querySelectorAll("img")]
      .map((img) => {
        const r = img.getBoundingClientRect();
        return {
          src: (img.currentSrc || img.src || "").split("?")[0],
          alt: img.alt || "",
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          x: +r.left.toFixed(1),
          y: +(r.top + scrollY).toFixed(1),
          natW: img.naturalWidth,
          natH: img.naturalHeight,
          parentClass: img.parentElement?.className || "",
        };
      })
      .filter((i) => i.w > 120 && i.h > 180 && !/logo|svg/i.test(i.src));

    // Dedupe by position cluster near top product area
    const productImgs = imgs.filter((i) => i.y < 1400 && i.alt.toLowerCase().includes("textured") || (i.y < 1200 && i.w > 200 && i.h > 300));

    // Find possible gallery container
    const galleryCandidates = [...document.querySelectorAll("div,section,ul")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const childImgs = el.querySelectorAll("img").length;
        return {
          childImgs,
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          x: +r.left.toFixed(1),
          y: +(r.top + scrollY).toFixed(1),
          overflowX: s.overflowX,
          display: s.display,
          gap: s.gap,
          className: (el.className || "").toString().slice(0, 80),
        };
      })
      .filter((c) => c.childImgs >= 3 && c.w > 300 && c.y < 1200)
      .sort((a, b) => a.y - b.y)
      .slice(0, 8);

    const h1 =
      document.querySelector("h1") ||
      [...document.querySelectorAll("h2,h3")].find((el) =>
        /textured/i.test(el.textContent || ""),
      );
    const order = [...document.querySelectorAll("a,button")].find((el) =>
      /order now/i.test(el.textContent || ""),
    );

    return {
      label: lbl,
      winW: innerWidth,
      docW: document.documentElement.scrollWidth,
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      title: (h1?.textContent || "").trim(),
      order: order
        ? {
            text: (order.textContent || "").replace(/\s+/g, " ").trim(),
            href: order.getAttribute("href"),
            box: box(order),
          }
        : null,
      productImgs,
      galleryCandidates,
      localGallery: {
        main: box(document.querySelector(".product-gallery__main")),
        thumbs: box(document.querySelector(".product-gallery__thumbs")),
        gallery: box(document.querySelector(".product-gallery")),
        info: box(document.querySelector(".product-info")),
        layout: box(document.querySelector(".product-page__layout")),
        trust: box(document.querySelector(".product-trust")),
      },
    };
  }, label);
}

async function main() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const report = {};

  for (const width of [1440, 1024, 390]) {
    for (const [name, url] of [
      ["live", LIVE],
      ["local", LOCAL],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height: 1100 },
      });
      await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
      await page.waitForTimeout(900);
      // scroll a bit to load
      await page.evaluate(() => window.scrollTo(0, 0));
      const key = `${name}_${width}`;
      report[key] = await measure(page, key);
      await page.screenshot({
        path: path.join(OUT, `${name}-${width}.png`),
        fullPage: false,
      });
      // gallery-focused crop attempt
      const clip = await page.evaluate(() => {
        const imgs = [...document.querySelectorAll("img")].filter((img) => {
          const r = img.getBoundingClientRect();
          return r.width > 180 && r.height > 250 && r.top < 900;
        });
        if (!imgs.length) return null;
        const tops = imgs.map((i) => i.getBoundingClientRect().top);
        const lefts = imgs.map((i) => i.getBoundingClientRect().left);
        const rights = imgs.map((i) => i.getBoundingClientRect().right);
        const bottoms = imgs.map((i) => i.getBoundingClientRect().bottom);
        const top = Math.max(0, Math.min(...tops) - 20);
        const left = Math.max(0, Math.min(...lefts) - 20);
        const right = Math.min(window.innerWidth, Math.max(...rights) + 20);
        const bottom = Math.min(window.innerHeight, Math.max(...bottoms) + 20);
        return {
          x: left,
          y: top,
          width: Math.max(100, right - left),
          height: Math.max(100, bottom - top),
        };
      });
      if (clip) {
        await page.screenshot({
          path: path.join(OUT, `${name}-gallery-${width}.png`),
          clip,
        });
      }
      await page.close();
      console.log("done", key);
    }
  }

  fs.writeFileSync(path.join(OUT, "measure.json"), JSON.stringify(report, null, 2));
  console.log("wrote measure.json");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
