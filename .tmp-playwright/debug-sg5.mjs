import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/?t=" + Date.now(), {
  waitUntil: "networkidle",
  timeout: 60000,
});
console.log("top", await page.evaluate(() => window.__sgDebug?.()));
await page.locator(".social-gallery").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
console.log("scrolled", await page.evaluate(() => window.__sgDebug?.()));
await page.waitForTimeout(1000);
console.log("later", await page.evaluate(() => window.__sgDebug?.()));
const style = await page.evaluate(
  () => document.querySelector(".social-gallery__stage")?.getAttribute("style"),
);
console.log("style", style);
await browser.close();
