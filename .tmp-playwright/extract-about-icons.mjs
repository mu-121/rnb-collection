import { chromium } from "./package/index.mjs";
import fs from "fs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://wearix.framer.website/about", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await page.waitForTimeout(2000);

const out = await page.evaluate(() => {
  const symbolIds = [
    "505080380", // ranking/star in about eyebrow?
    "3953775718",
    "3752660003",
    "1571224757",
    "535953797",
  ];
  const symbols = {};
  for (const id of symbolIds) {
    const el = document.querySelector(`symbol#${CSS.escape(id)}, [id="${id}"]`);
    symbols[id] = el ? el.outerHTML : null;
  }
  // Also grab all symbol defs
  const allSymbols = [...document.querySelectorAll("symbol")].map((s) => ({
    id: s.id,
    html: s.outerHTML.slice(0, 1200),
  }));

  // Trust stars - look near rating text
  const rating = [...document.querySelectorAll("p")].find((p) =>
    (p.textContent || "").includes("4.9/5 rating"),
  );
  let trustLeft = rating;
  for (let i = 0; i < 8 && trustLeft; i++) {
    const r = trustLeft.getBoundingClientRect();
    if (r.width > 250 && r.width < 450) break;
    trustLeft = trustLeft.parentElement;
  }

  // Hero body full paragraph (may be split spans)
  const bodyCandidates = [...document.querySelectorAll("p")].filter((p) =>
    (p.textContent || "").includes("We focus on creating"),
  );
  const body = bodyCandidates.map((p) => {
    const s = getComputedStyle(p);
    const r = p.getBoundingClientRect();
    return {
      text: p.textContent.replace(/\s+/g, " ").trim(),
      fontSize: s.fontSize,
      color: s.color,
      opacity: s.opacity,
      w: r.width,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
      fontWeight: s.fontWeight,
    };
  });

  // Hero eyebrow chip
  const know = [...document.querySelectorAll("p")].find((p) =>
    (p.textContent || "").trim() === "Know about Wearix",
  );
  let chip = know;
  for (let i = 0; i < 10 && chip; i++) {
    const s = getComputedStyle(chip);
    const r = chip.getBoundingClientRect();
    if (
      (s.backgroundColor.includes("255, 255, 255") || s.borderRadius.includes("999") || s.borderRadius.includes("50")) &&
      r.width > 140 &&
      r.width < 280
    )
      break;
    chip = chip.parentElement;
  }
  const chipDump = chip
    ? {
        text: chip.innerText.replace(/\s+/g, " ").trim(),
        w: chip.getBoundingClientRect().width,
        h: chip.getBoundingClientRect().height,
        bg: getComputedStyle(chip).backgroundColor,
        radius: getComputedStyle(chip).borderRadius,
        padding: getComputedStyle(chip).padding,
        gap: getComputedStyle(chip).gap,
        display: getComputedStyle(chip).display,
        border: `${getComputedStyle(chip).borderTopWidth} ${getComputedStyle(chip).borderTopStyle} ${getComputedStyle(chip).borderTopColor}`,
        html: chip.innerHTML.slice(0, 800),
      }
    : null;

  // Overlay search broader
  const overlays = [...document.querySelectorAll("div")].filter((d) => {
    const name = d.getAttribute("data-framer-name") || "";
    return /overlay|Overlay|scrim/i.test(name);
  }).map((d) => {
    const s = getComputedStyle(d);
    return { name: d.getAttribute("data-framer-name"), bg: s.backgroundColor, bgImage: s.backgroundImage.slice(0, 300), opacity: s.opacity };
  });

  // About Wearix eyebrow row
  const aw = [...document.querySelectorAll("p")].find((p) =>
    (p.textContent || "").trim() === "About Wearix",
  );
  let awRow = aw;
  for (let i = 0; i < 8 && awRow; i++) {
    const r = awRow.getBoundingClientRect();
    if (r.width > 110 && r.width < 180 && getComputedStyle(awRow).display.includes("flex")) break;
    awRow = awRow.parentElement;
  }

  // Stat card overlay gradient
  const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.trim() === "10M+");
  let card = h2;
  for (let i = 0; i < 8 && card; i++) {
    if (card.getBoundingClientRect().height > 200) break;
    card = card.parentElement;
  }
  const cardLayers = card
    ? [...card.querySelectorAll("div")].slice(0, 20).map((d) => {
        const s = getComputedStyle(d);
        const r = d.getBoundingClientRect();
        return {
          name: d.getAttribute("data-framer-name"),
          bg: s.backgroundColor,
          bgImage: s.backgroundImage.slice(0, 250),
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
        };
      }).filter((x) => x.bgImage !== "none" || x.bg.includes("rgba") || (x.name && /overlay|gradient/i.test(x.name)))
    : [];

  // Trust row dimensions
  let trustRow = rating;
  for (let i = 0; i < 12 && trustRow; i++) {
    const r = trustRow.getBoundingClientRect();
    if (r.width > 1100) break;
    trustRow = trustRow.parentElement;
  }

  return {
    symbols,
    allSymbols: allSymbols.filter((s) =>
      symbolIds.includes(s.id) || ["1715494072", "505080380"].includes(s.id),
    ),
    allSymbolIds: allSymbols.map((s) => s.id),
    trustLeft: trustLeft
      ? {
          w: trustLeft.getBoundingClientRect().width,
          h: trustLeft.getBoundingClientRect().height,
          html: trustLeft.innerHTML.slice(0, 1500),
          text: trustLeft.innerText.replace(/\s+/g, " ").trim(),
        }
      : null,
    trustRow: trustRow
      ? {
          y: trustRow.getBoundingClientRect().top + scrollY,
          w: trustRow.getBoundingClientRect().width,
          h: trustRow.getBoundingClientRect().height,
          padding: getComputedStyle(trustRow).padding,
          gap: getComputedStyle(trustRow).gap,
          display: getComputedStyle(trustRow).display,
          justify: getComputedStyle(trustRow).justifyContent,
          align: getComputedStyle(trustRow).alignItems,
          bg: getComputedStyle(trustRow).backgroundColor,
        }
      : null,
    body,
    chipDump,
    overlays,
    awRow: awRow
      ? {
          w: awRow.getBoundingClientRect().width,
          h: awRow.getBoundingClientRect().height,
          gap: getComputedStyle(awRow).gap,
          display: getComputedStyle(awRow).display,
          html: awRow.innerHTML.slice(0, 1000),
          svg: awRow.querySelector("svg")?.outerHTML,
        }
      : null,
    cardLayers,
  };
});

fs.writeFileSync("out-about/icons-detail.json", JSON.stringify(out, null, 2));
console.log("symbol keys", Object.keys(out.symbols), "found", Object.values(out.symbols).filter(Boolean).length);
console.log("allSymbolIds sample", out.allSymbolIds.slice(0, 30));
console.log("chip", out.chipDump);
console.log("body", out.body);
console.log("trustRow", out.trustRow);
console.log("trustLeft text", out.trustLeft?.text);
console.log("awRow", out.awRow && { ...out.awRow, html: out.awRow.html?.slice(0, 200), svg: out.awRow.svg?.slice(0, 200) });
console.log("overlays", out.overlays);
console.log("cardLayers", out.cardLayers?.slice(0, 8));
await browser.close();
