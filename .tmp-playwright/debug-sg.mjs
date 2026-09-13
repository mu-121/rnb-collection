import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => console.log("CONSOLE", m.type(), m.text()));
page.on("pageerror", (e) => console.log("PAGEERROR", e));
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.locator(".social-gallery").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const stage = document.querySelector(".social-gallery__stage");
  const hit = document.querySelector(".social-gallery__hit");
  const carousel = document.querySelector(".social-gallery__carousel");
  const section = document.querySelector(".social-gallery");
  const sr = section.getBoundingClientRect();
  return {
    transform: stage?.getAttribute("style"),
    computed: stage ? getComputedStyle(stage).transform : null,
    scale: getComputedStyle(carousel).getPropertyValue("--sg-scale"),
    hit: hit.getBoundingClientRect().toJSON(),
    carousel: carousel.getBoundingClientRect().toJSON(),
    section: { top: sr.top, bottom: sr.bottom, h: sr.height },
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    ioRatio: (() => {
      const r = section.getBoundingClientRect();
      const vh = innerHeight;
      const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      return visible / r.height;
    })(),
  };
});
console.log(JSON.stringify(info, null, 2));
await page.waitForTimeout(1500);
const t2 = await page.evaluate(
  () => document.querySelector(".social-gallery__stage")?.getAttribute("style"),
);
console.log("after wait", t2);
await browser.close();
