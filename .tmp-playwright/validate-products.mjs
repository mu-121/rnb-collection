import { chromium } from "./package/index.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = path.resolve(__dirname, "out-product-detail");
fs.mkdirSync(OUT, { recursive: true });

const expected = JSON.parse(
  fs.readFileSync(path.join(OUT, "final-details.json"), "utf8"),
);

async function main() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const report = { base: BASE, products: [], pages: {}, console: [] };

  for (const p of expected) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const res = await page.goto(`${BASE}/shop/${p.slug}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(400);
      const data = await page.evaluate(() => {
      const text = (sel) =>
        (document.querySelector(sel)?.textContent || "")
          .replace(/\s+/g, " ")
          .trim();
      const order = document.querySelector(".product-info__order");
      const thumbs = [
        ...document.querySelectorAll(".product-gallery__thumb"),
      ].length;
      const badgeOnGallery = !!document.querySelector(".product-gallery__badge");
      const broken = [...document.querySelectorAll("img")].filter(
        (img) => img.naturalWidth === 0 && img.complete,
      ).length;
      const stage = document.querySelector(".product-gallery__stage");
      const thumbsEl = document.querySelector(".product-gallery__thumbs");
      const stageBox = stage?.getBoundingClientRect();
      const thumbsBox = thumbsEl?.getBoundingClientRect();
      const thumbsOverlay =
        !!stageBox &&
        !!thumbsBox &&
        thumbsBox.top >= stageBox.top &&
        thumbsBox.bottom <= stageBox.bottom + 1;
      return {
        title: text(".product-info__title"),
        badge: text(".product-gallery__badge"),
        wear: text(".product-info__wear"),
        shopPill: text(".product-info__shop-pill"),
        price: text(".product-info__price"),
        compare: text(".product-info__compare"),
        description: text(".product-info__description"),
        material: text(".product-details__row:nth-child(1) dd"),
        care: text(".product-details__row:nth-child(2) dd"),
        warranty: text(".product-details__row:nth-child(3) dd"),
        orderText: text(".product-info__order"),
        orderHref: order?.getAttribute("href") || null,
        orderFullWidth: (() => {
          const info = document.querySelector(".product-info");
          if (!order || !info) return false;
          return Math.abs(order.getBoundingClientRect().width - info.getBoundingClientRect().width) < 2;
        })(),
        trustCount: document.querySelectorAll(".product-trust__card").length,
        social: !!document.querySelector(".social-gallery"),
        footer: !!document.querySelector(".footer"),
        thumbs,
        badgeOnGallery,
        thumbsOverlay,
        mainImg: document
          .querySelector(".product-gallery__main-image")
          ?.getAttribute("src"),
        overflowX:
          document.documentElement.scrollWidth > window.innerWidth + 1,
        broken,
      };
    });

    const pass =
      res?.status() === 200 &&
      data.title === p.name &&
      data.price === `USD $${p.price.toFixed(2)}` &&
      data.compare === `USD $${p.compareAtPrice.toFixed(2)}` &&
      data.material === p.material &&
      data.care === p.care &&
      data.warranty === p.warranty &&
      data.orderText.includes("Order Now") &&
      data.orderHref === p.orderHref &&
      data.trustCount === 4 &&
      data.social &&
      data.footer &&
      data.thumbs === 5 &&
      data.badgeOnGallery &&
      data.thumbsOverlay &&
      data.shopPill === "Shop" &&
      !data.overflowX &&
      data.broken === 0;

    report.products.push({
      slug: p.slug,
      status: res?.status() ?? null,
      pass,
      data,
      expected: {
        name: p.name,
        price: p.price,
        material: p.material,
      },
      errors: errors.filter(
        (e) =>
          !e.includes("WebSocket") &&
          !e.includes("quality") &&
          !e.includes("Configured"),
      ),
    });
    console.log(pass ? "PASS" : "FAIL", p.slug, data.title, data.price);
    await page.close();
  }

  // regression pages
  for (const route of ["/", "/about", "/shop", "/blog", "/contact"]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    const res = await page.goto(`${BASE}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    const shopCount =
      route === "/shop"
        ? await page.locator(".product-card").count()
        : null;
    report.pages[route] = {
      status: res?.status() ?? null,
      shopCount,
    };
    await page.close();
  }

  // responsive sample
  const page = await browser.newPage();
  for (const w of [1440, 1024, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`${BASE}/shop/textured-knitted-shirt`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(200);
    const m = await page.evaluate(() => ({
      overflowX:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      orderVisible: !!document.querySelector(".product-info__order"),
      title: document.querySelector(".product-info__title")?.textContent?.trim(),
    }));
    report[`responsive_${w}`] = m;
  }
  await page.close();

  fs.writeFileSync(
    path.join(OUT, "validation.json"),
    JSON.stringify(report, null, 2),
  );
  const failed = report.products.filter((p) => !p.pass);
  console.log(
    "\nSUMMARY",
    report.products.length - failed.length,
    "/",
    report.products.length,
    "pass",
  );
  if (failed.length) {
    console.log(JSON.stringify(failed, null, 2));
  }
  console.log("PAGES", report.pages);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
