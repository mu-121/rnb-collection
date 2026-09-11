import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const OUT = path.resolve("out-shop");
fs.mkdirSync(OUT, { recursive: true });
const URL = "https://wearix.framer.website/shop";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function extract(w, h, name) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await sleep(150);
    }
    window.scrollTo(0, 0);
    await sleep(400);
  });

  await page.screenshot({ path: path.join(OUT, `shop-${name}.png`), fullPage: true });

  const data = await page.evaluate(() => {
    const dump = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        x: +r.x.toFixed(1),
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
        bg: s.backgroundColor,
        padding: s.padding,
        gap: s.gap,
        display: s.display,
        gridCols: s.gridTemplateColumns,
        borderRadius: s.borderRadius,
        maxWidth: s.maxWidth,
      };
    };

    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5")].map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: el.textContent.replace(/\s+/g, " ").trim(),
      ...dump(el),
    }));

    // Category tabs / filters
    const filterTexts = ["All Products", "Men's Wear", "Women's Wear", "Children's Wear", "Mens", "Womens"];
    const filters = [...document.querySelectorAll("a,button,div,span,p")]
      .filter((el) => {
        const t = (el.textContent || "").replace(/\s+/g, " ").trim();
        return filterTexts.some((f) => t === f) && el.children.length === 0;
      })
      .map((el) => ({
        text: el.textContent.replace(/\s+/g, " ").trim(),
        tag: el.tagName.toLowerCase(),
        name: el.getAttribute("data-framer-name"),
        ...dump(el),
        parent: el.parentElement?.getAttribute("data-framer-name"),
      }));

    // Product cards - find by price patterns
    const productLinks = [...document.querySelectorAll("a")].filter((a) => {
      const t = (a.textContent || "").replace(/\s+/g, " ");
      return /\$\d+\.\d{2}/.test(t) && (t.includes("New") || t.includes("Best") || t.length > 20);
    });

    const products = productLinks.map((a) => {
      const text = a.textContent.replace(/\s+/g, " ").trim();
      const imgs = [...a.querySelectorAll("img")].map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
        w: img.getBoundingClientRect().width,
        h: img.getBoundingClientRect().height,
      }));
      const href = a.getAttribute("href");
      return { text: text.slice(0, 120), href, ...dump(a), imgs: imgs.slice(0, 4) };
    });

    // Unique products by href
    const seen = new Set();
    const uniqueProducts = [];
    for (const p of products) {
      if (!p.href || seen.has(p.href)) continue;
      seen.add(p.href);
      uniqueProducts.push(p);
    }

    const heroImg = document.querySelector('[data-framer-name="Hero section"] img, .framer-hero img') ||
      [...document.querySelectorAll("img")].find((img) => img.getBoundingClientRect().height > 400);

    const heroSection = document.querySelector('[data-framer-name="Hero section"]');
    const know = [...document.querySelectorAll("p,span")].find((n) =>
      (n.textContent || "").includes("The new season"),
    );
    const explore = [...document.querySelectorAll("a")].find((a) =>
      (a.textContent || "").includes("Explore stories"),
    );
    const aboutUs = [...document.querySelectorAll("a")].find((a) =>
      (a.textContent || "").replace(/\s+/g, " ").includes("About us"),
    );

    // Named framer nodes
    const named = [...document.querySelectorAll("[data-framer-name]")]
      .map((el) => ({
        name: el.getAttribute("data-framer-name"),
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
        ...dump(el),
      }))
      .filter((n) => n.h > 30 && n.w > 50)
      .slice(0, 80);

    // Grid container
    let grid = uniqueProducts[0] && document.querySelector(`a[href="${uniqueProducts[0].href}"]`)?.parentElement;
    for (let i = 0; i < 8 && grid; i++) {
      const s = getComputedStyle(grid);
      if (s.display.includes("grid") || (grid.children.length >= 8 && grid.getBoundingClientRect().width > 800))
        break;
      grid = grid.parentElement;
    }

    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      headings,
      filters,
      products: uniqueProducts,
      productCount: uniqueProducts.length,
      hero: dump(heroSection),
      heroImg: heroImg
        ? { src: heroImg.currentSrc || heroImg.src, alt: heroImg.alt, ...dump(heroImg) }
        : null,
      know: dump(know),
      explore: dump(explore),
      aboutUs: dump(aboutUs),
      grid: dump(grid),
      named: named.filter((n) =>
        /hero|shop|product|filter|tab|category|grid|collection/i.test(n.name || ""),
      ),
      allNamed: named.slice(0, 40),
    };
  });

  // Test filter clicks
  const filterBehavior = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const results = {};
    const labels = ["All Products", "Men's Wear", "Women's Wear", "Children's Wear"];
    for (const label of labels) {
      const el = [...document.querySelectorAll("a,button,div,p,span")].find(
        (n) => (n.textContent || "").replace(/\s+/g, " ").trim() === label && n.children.length <= 1,
      );
      if (!el) {
        results[label] = { found: false };
        continue;
      }
      // click parent if needed
      const clickable = el.closest("a,button,[role='button'],[data-framer-name]") || el;
      clickable.click();
      await sleep(800);
      const visibleCards = [...document.querySelectorAll("a")].filter((a) => {
        const t = (a.textContent || "");
        const r = a.getBoundingClientRect();
        return /\$\d+\.\d{2}/.test(t) && r.height > 100 && r.width > 100 && getComputedStyle(a).opacity !== "0";
      });
      // unique by href
      const hrefs = [...new Set(visibleCards.map((a) => a.getAttribute("href")))];
      const names = hrefs.map((href) => {
        const a = visibleCards.find((x) => x.getAttribute("href") === href);
        return (a?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
      });
      results[label] = { found: true, count: hrefs.length, names: names.slice(0, 25) };
    }
    // reset to all
    const all = [...document.querySelectorAll("a,button,div,p,span")].find(
      (n) => (n.textContent || "").replace(/\s+/g, " ").trim() === "All Products",
    );
    all?.closest("a,button,[role='button']")?.click() || all?.click();
    await sleep(400);
    return results;
  });

  fs.writeFileSync(
    path.join(OUT, `shop-${name}.json`),
    JSON.stringify({ viewport: { w, h }, data, filterBehavior }, null, 2),
  );
  console.log(name, "products", data.productCount, "filters", Object.keys(filterBehavior));
  await page.close();
  return { data, filterBehavior };
}

const r1440 = await extract(1440, 900, "1440");
await extract(1024, 800, "1024");
await extract(390, 844, "390");

// Download unique product images from 1440 for hashing
const imgs = [];
for (const p of r1440.data.products) {
  for (const i of p.imgs || []) {
    if (i.src && i.src.startsWith("http")) imgs.push(i.src.split("?")[0]);
  }
}
if (r1440.data.heroImg?.src) imgs.push(r1440.data.heroImg.src.split("?")[0]);
const unique = [...new Set(imgs)];
const assets = [];
for (const url of unique) {
  try {
    const res = await fetch(url.includes("?") ? url : url + "?width=1200");
    // try original
    const res2 = await fetch(url);
    const buf = Buffer.from(await res2.arrayBuffer());
    const md5 = crypto.createHash("md5").update(buf).digest("hex");
    const name = url.split("/").pop();
    fs.writeFileSync(path.join(OUT, `live-${name}`), buf);
    assets.push({ url, md5, bytes: buf.length, file: `live-${name}` });
    console.log("asset", name, md5.slice(0, 8), buf.length);
  } catch (e) {
    assets.push({ url, error: String(e) });
  }
}
fs.writeFileSync(path.join(OUT, "assets.json"), JSON.stringify(assets, null, 2));
fs.writeFileSync(
  path.join(OUT, "summary.json"),
  JSON.stringify(
    {
      productCount: r1440.data.productCount,
      products: r1440.data.products.map((p) => ({ text: p.text, href: p.href })),
      filters: r1440.filterBehavior,
      headings: r1440.data.headings.map((h) => h.text),
      assets,
    },
    null,
    2,
  ),
);

console.log("DONE filters", JSON.stringify(r1440.filterBehavior, null, 2));
await browser.close();
