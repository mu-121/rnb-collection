import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/about", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.locator(".about-mission__eyebrow").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const styles = await page.evaluate(() => {
  const eyebrow = document.querySelector(".about-mission__eyebrow");
  const mark = document.querySelector(".about-mission__eyebrow-mark");
  const label = document.querySelector(".about-mission__eyebrow-label");
  const es = getComputedStyle(eyebrow);
  const ms = getComputedStyle(mark);
  const ls = getComputedStyle(label);
  return {
    pillBg: es.backgroundColor,
    pillRadius: es.borderRadius,
    pillPad: `${es.paddingTop} ${es.paddingRight} ${es.paddingBottom} ${es.paddingLeft}`,
    markBg: ms.backgroundImage || ms.backgroundColor,
    markColor: ms.color,
    markSize: `${ms.width}x${ms.height}`,
    labelColor: ls.color,
    labelText: label?.textContent?.trim(),
  };
});
console.log(JSON.stringify(styles, null, 2));
const box = await page.locator(".about-mission__eyebrow").boundingBox();
await page.screenshot({
  path: "out-about/local-about-badge.png",
  clip: {
    x: Math.max(0, box.x - 40),
    y: Math.max(0, box.y - 40),
    width: box.width + 80,
    height: box.height + 80,
  },
});
await browser.close();
