import { chromium } from "./package/index.mjs";
import fs from "fs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://wearix.framer.website/shop", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await page.waitForTimeout(2000);

const detail = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const dump = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
      name: el.getAttribute("data-framer-name"),
      tag: el.tagName.toLowerCase(),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      y: +(r.top + scrollY).toFixed(1),
      bg: s.backgroundColor,
      color: s.color,
      radius: s.borderRadius,
      pad: s.padding,
      border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
    };
  };

  // Find filter row
  const allLabel = [...document.querySelectorAll("*")].find(
    (n) => (n.textContent || "").replace(/\s+/g, " ").trim() === "All Products" && n.children.length === 0,
  );
  let row = allLabel;
  for (let i = 0; i < 10 && row; i++) {
    const t = (row.textContent || "").replace(/\s+/g, " ");
    if (t.includes("Men's Wear") && t.includes("Women's Wear") && row.getBoundingClientRect().height < 80)
      break;
    row = row.parentElement;
  }

  const tabs = [...(row?.querySelectorAll("a,button,div") || [])]
    .filter((el) => {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      return ["All Products", "Men's Wear", "Women's Wear", "Children's Wear"].includes(t);
    })
    .map((el) => dump(el));

  // Click women's and observe DOM changes / opacity / display
  const women = [...document.querySelectorAll("*")].find(
    (n) => (n.textContent || "").replace(/\s+/g, " ").trim() === "Women's Wear" && n.children.length === 0,
  );
  const before = [...document.querySelectorAll("a")].filter((a) => /\$\d+\.\d{2}/.test(a.textContent || "")).map((a) => ({
    href: a.getAttribute("href"),
    opacity: getComputedStyle(a).opacity,
    display: getComputedStyle(a).display,
    h: a.getBoundingClientRect().height,
  }));
  (women?.closest("div[data-framer-name],a,button") || women)?.click();
  await sleep(1000);
  const after = [...document.querySelectorAll("a")].filter((a) => /\$\d+\.\d{2}/.test(a.textContent || "")).map((a) => ({
    href: a.getAttribute("href"),
    opacity: getComputedStyle(a).opacity,
    display: getComputedStyle(a).display,
    h: a.getBoundingClientRect().height,
    name: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 50),
  }));

  // Active tab style after click
  const womenAfter = dump(
    [...document.querySelectorAll("*")].find(
      (n) => (n.textContent || "").replace(/\s+/g, " ").trim() === "Women's Wear" && n.children.length === 0,
    )?.parentElement,
  );
  const allAfter = dump(
    [...document.querySelectorAll("*")].find(
      (n) => (n.textContent || "").replace(/\s+/g, " ").trim() === "All Products" && n.children.length === 0,
    )?.parentElement,
  );

  // Hero CTAs
  const explore = [...document.querySelectorAll("a")].find((a) =>
    (a.textContent || "").includes("Explore stories"),
  );
  const about = [...document.querySelectorAll("a")].find((a) =>
    (a.textContent || "").replace(/\s+/g, " ").includes("About usAbout us") ||
    ((a.textContent || "").replace(/\s+/g, " ").trim() === "About us"),
  );

  // Shop section eyebrow
  const shopLabel = [...document.querySelectorAll("p,span")].find((n) =>
    (n.textContent || "").trim() === "Shop" && n.getBoundingClientRect().y > 500,
  );

  // Filter row position relative to products
  const firstProduct = [...document.querySelectorAll("a")].find((a) =>
    (a.getAttribute("href") || "").includes("textured-knitted"),
  );

  return {
    filterRow: dump(row),
    tabs: tabs.slice(0, 8),
    beforeCount: before.filter((b) => b.h > 50).length,
    afterCount: after.filter((b) => b.h > 50 && b.opacity !== "0").length,
    afterVisible: after.filter((b) => b.h > 50 && Number(b.opacity) > 0.5).map((b) => b.name),
    changed: JSON.stringify(before) !== JSON.stringify(after),
    womenAfter,
    allAfter,
    explore: explore
      ? { href: explore.getAttribute("href"), ...dump(explore) }
      : null,
    about: about ? { href: about.getAttribute("href"), ...dump(about) } : null,
    shopLabel: dump(shopLabel),
    firstProductY: firstProduct ? firstProduct.getBoundingClientRect().top + scrollY : null,
    filterY: row ? row.getBoundingClientRect().top + scrollY : null,
  };
});

// Responsive grid
const grids = {};
for (const [w, h] of [
  [1440, 900],
  [1024, 800],
  [810, 900],
  [390, 844],
]) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(600);
  grids[w] = await page.evaluate(() => {
    const a = [...document.querySelectorAll("a")].find((el) =>
      (el.getAttribute("href") || "").includes("textured-knitted"),
    );
    let grid = a?.parentElement;
    for (let i = 0; i < 8 && grid; i++) {
      if (getComputedStyle(grid).display.includes("grid")) break;
      grid = grid.parentElement;
    }
    const s = grid ? getComputedStyle(grid) : null;
    const card = a?.getBoundingClientRect();
    return {
      cols: s?.gridTemplateColumns,
      gap: s?.gap,
      gridW: grid?.getBoundingClientRect().width,
      cardW: card?.width,
      cardH: card?.height,
      mediaH: a?.querySelector("img")?.getBoundingClientRect().height,
    };
  });
}

fs.writeFileSync(
  "out-shop/filter-detail.json",
  JSON.stringify({ detail, grids }, null, 2),
);
console.log(JSON.stringify({ detail, grids }, null, 2));
await browser.close();
