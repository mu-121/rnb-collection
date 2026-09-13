import { chromium } from "./package/index.mjs";
import fs from "node:fs";

const LIVE = "https://wearix.framer.website";
const slugs = JSON.parse(
  fs.readFileSync("./out-product-detail/shop-links.json", "utf8"),
).map((l) => l.path.replace("/shop/", ""));

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const out = {};

for (const slug of slugs) {
  await page.goto(`${LIVE}/shop/${slug}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(500);
  const data = await page.evaluate(() => {
    const text = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
    const title =
      text(document.querySelector("h1")) ||
      text(document.querySelector("h2")) ||
      text(document.querySelector("h3"));
    const paras = [...document.querySelectorAll("p")]
      .map((p) => text(p))
      .filter(
        (t) =>
          t.length > 40 &&
          !/Subscribe|Trusted|Real Time|Secure|Easy Returns|Quick Links|Stay connected|Connect with us/i.test(
            t,
          ),
      );
    return { title, description: paras[0] || null };
  });
  out[slug] = data;
  console.log(slug, "=>", data.description?.slice(0, 60));
}

fs.writeFileSync(
  "./out-product-detail/descriptions.json",
  JSON.stringify(out, null, 2),
);
await browser.close();
