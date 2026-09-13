import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://wearix.framer.website/about", {
  waitUntil: "networkidle",
  timeout: 60000,
});
const info = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll("p,span,div,h1,h2,h3,a")].filter(
    (el) => (el.textContent || "").trim() === "About Wearix",
  );
  return nodes.slice(0, 5).map((el) => {
    const s = getComputedStyle(el);
    let pill = el;
    for (let i = 0; i < 4 && pill; i++) {
      const bg = getComputedStyle(pill).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") break;
      pill = pill.parentElement;
    }
    const ps = pill ? getComputedStyle(pill) : null;
    const mark = pill?.querySelector("svg");
    const markWrap = mark?.parentElement;
    const ms = markWrap ? getComputedStyle(markWrap) : null;
    return {
      color: s.color,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      pillBg: ps?.backgroundColor,
      pillRadius: ps?.borderRadius,
      pillPad: ps
        ? `${ps.paddingTop} ${ps.paddingRight} ${ps.paddingBottom} ${ps.paddingLeft}`
        : null,
      markBg: ms?.backgroundColor,
      markColor: ms?.color,
      markSize: ms ? `${ms.width}x${ms.height}` : null,
      svg: mark?.outerHTML?.slice(0, 500),
    };
  });
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({
  path: "out-about/live-about-badge.png",
  clip: { x: 500, y: 700, width: 440, height: 200 },
});
await browser.close();
