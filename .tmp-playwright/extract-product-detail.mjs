import { chromium } from "./package/index.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "out-product-detail");
fs.mkdirSync(OUT, { recursive: true });

const LIVE = "https://wearix.framer.website";

async function extractProduct(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(800);
  return page.evaluate(() => {
    const text = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
    const h1 = document.querySelector("h1");
    const allText = document.body.innerText;

    // prices
    const priceEls = [...document.querySelectorAll("p, span, div, h2, h3")]
      .map((el) => text(el))
      .filter((t) => /^\$?\d+(\.\d+)?$/.test(t) || /^\$\d+/.test(t));

    // Find Order Now
    const order =
      [...document.querySelectorAll("a,button")].find((el) =>
        /order now/i.test(text(el)),
      ) || null;

    // images in main product area
    const imgs = [...document.querySelectorAll("img")]
      .map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt || "",
        w: img.naturalWidth,
        h: img.naturalHeight,
      }))
      .filter((i) => i.src && !i.src.includes("svg") && i.w > 80);

    // labels Material / Care / Warranty
    const findAfter = (label) => {
      const nodes = [...document.querySelectorAll("p,span,div,h2,h3,h4")];
      for (let i = 0; i < nodes.length; i++) {
        if (text(nodes[i]).toLowerCase() === label.toLowerCase()) {
          // next sibling-ish text
          for (let j = i + 1; j < Math.min(i + 6, nodes.length); j++) {
            const t = text(nodes[j]);
            if (t && t.toLowerCase() !== label.toLowerCase() && t.length > 3) {
              return t;
            }
          }
        }
      }
      return null;
    };

    const badges = [...document.querySelectorAll("p,span,div")]
      .map((el) => text(el))
      .filter((t) => t === "New" || t === "Best seller");

    const categoryCandidates = [...document.querySelectorAll("p,span,div,a")]
      .map((el) => text(el))
      .filter((t) =>
        /^(Men|Women|Children|Men'?s|Women'?s|Unisex|Accessories)/i.test(t),
      );

    // trust features
    const trust = ["Trusted Quality", "Real Time Tracking", "Secure Payments", "Easy Returns"]
      .filter((t) => allText.includes(t));

    // description: long paragraph near h1
    let description = null;
    if (h1) {
      const paras = [...document.querySelectorAll("p")].map((p) => text(p));
      description =
        paras.find((p) => p.length > 60 && !p.includes("Subscribe")) || null;
    }

    return {
      title: text(h1),
      orderHref: order?.getAttribute("href") || null,
      orderTag: order?.tagName || null,
      material: findAfter("Material"),
      care: findAfter("Care"),
      warranty: findAfter("Warranty"),
      badges: [...new Set(badges)].slice(0, 3),
      categoryCandidates: [...new Set(categoryCandidates)].slice(0, 8),
      priceEls: [...new Set(priceEls)].slice(0, 10),
      description,
      trust,
      images: imgs.slice(0, 12),
      hasSocial: !!document.body.innerText.match(/Stay connected|community/i),
      hasFooter: !!document.querySelector("footer") || allText.includes("Quick Links"),
    };
  });
}

async function main() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Collect shop product links
  await page.goto(`${LIVE}/shop`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1000);
  const links = await page.evaluate(() => {
    const as = [...document.querySelectorAll('a[href*="/shop/"]')];
    const out = [];
    const seen = new Set();
    for (const a of as) {
      const href = a.getAttribute("href") || "";
      if (!href.includes("/shop/")) continue;
      const url = href.startsWith("http")
        ? href
        : new URL(href, location.origin).pathname;
      const path = url.replace(location.origin, "");
      if (path === "/shop" || path === "/shop/") continue;
      if (seen.has(path)) continue;
      seen.add(path);
      const name = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120);
      out.push({ path, name });
    }
    return out;
  });

  fs.writeFileSync(path.join(OUT, "shop-links.json"), JSON.stringify(links, null, 2));
  console.log("LINKS", links.length, links.map((l) => l.path).join("\n"));

  // Sample detailed extract
  const sample = await extractProduct(
    page,
    `${LIVE}/shop/textured-knitted-shirt`,
  );
  fs.writeFileSync(path.join(OUT, "sample.json"), JSON.stringify(sample, null, 2));
  console.log("SAMPLE", JSON.stringify(sample, null, 2));

  // Extract all products (limit concurrency 1 for stability)
  const products = [];
  for (const link of links) {
    try {
      const data = await extractProduct(page, `${LIVE}${link.path}`);
      products.push({ ...link, ...data });
      console.log("OK", link.path, data.title);
    } catch (e) {
      products.push({ ...link, error: String(e) });
      console.log("FAIL", link.path, e);
    }
  }

  fs.writeFileSync(path.join(OUT, "all-products.json"), JSON.stringify(products, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
