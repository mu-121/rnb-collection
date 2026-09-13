import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.locator(".social-gallery").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
const d1 = await page.evaluate(() => window.__sgDebug?.());
console.log("debug1", d1);
await page.waitForTimeout(1000);
const d2 = await page.evaluate(() => window.__sgDebug?.());
const style = await page.evaluate(
  () => document.querySelector(".social-gallery__stage")?.getAttribute("style"),
);
console.log("debug2", d2, style);
await browser.close();
