import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.locator(".social-gallery").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
const hit = page.locator(".social-gallery__hit");
const box = await hit.boundingBox();
console.log("box", box);
const before = await page.evaluate(() => {
  const stage = document.querySelector(".social-gallery__stage");
  const m = /rotateY\((-?\d+(?:\.\d+)?)deg\)/.exec(stage?.getAttribute("style") || "");
  return m ? Number(m[1]) : null;
});
console.log("before", before);
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2, { steps: 10 });
await page.mouse.up();
const after = await page.evaluate(() => {
  const stage = document.querySelector(".social-gallery__stage");
  const m = /rotateY\((-?\d+(?:\.\d+)?)deg\)/.exec(stage?.getAttribute("style") || "");
  return { style: stage?.getAttribute("style"), rot: m ? Number(m[1]) : null };
});
console.log("after", after, "delta", after.rot - before);
await browser.close();
