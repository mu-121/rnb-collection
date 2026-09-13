import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e));
page.on("console", (m) => {
  if (m.type() === "error") console.log("ERR", m.text());
});
await page.goto("http://127.0.0.1:3000/?cb=" + Date.now(), {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const section = document.querySelector(".social-gallery");
  const stage = document.querySelector(".social-gallery__stage");
  const hit = document.querySelector(".social-gallery__hit");
  return {
    section: !!section,
    stage: !!stage,
    hit: !!hit,
    stageClass: stage?.className,
    reactFiber: stage ? Object.keys(stage).filter((k) => k.startsWith("__react")) : [],
    debug: typeof window.__sgDebug,
    htmlSnippet: section?.outerHTML?.slice(0, 500),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
