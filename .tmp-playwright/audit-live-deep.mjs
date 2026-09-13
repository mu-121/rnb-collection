import { chromium } from "./package/index.mjs";
import fs from "node:fs";

const LIVE = "https://wearix.framer.website/shop/textured-knitted-shirt";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function deep(width) {
  const page = await browser.newPage({ viewport: { width, height: 1100 } });
  await page.goto(LIVE, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1000);

  const data = await page.evaluate(() => {
    const text = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        x: +r.left.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        radius: s.borderRadius,
        bg: s.backgroundColor,
        display: s.display,
        gap: s.gap,
        p: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
        overflow: `${s.overflowX}/${s.overflowY}`,
      };
    };

    // Find "New" badge near product
    const badge = [...document.querySelectorAll("div,span,p")].find(
      (el) => text(el) === "New" || /^New$/.test(text(el)),
    );
    const badgeWrap = badge?.closest("div");

    // Find Shop pill
    const shopPill = [...document.querySelectorAll("div,span,a,p")].find(
      (el) => text(el) === "Shop" && el.getBoundingClientRect().width < 120,
    );

    // Find thumbnails - small square images near gallery
    const allImgs = [...document.querySelectorAll("img")].map((img) => {
      const r = img.getBoundingClientRect();
      return {
        src: (img.currentSrc || img.src).split("?")[0].split("/").pop(),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        x: +r.left.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        top: +r.top.toFixed(1),
        opacity: getComputedStyle(img).opacity,
        radius: getComputedStyle(img.parentElement || img).borderRadius,
        parent: (img.parentElement?.className || "").toString().slice(0, 60),
      };
    });

    const thumbs = allImgs.filter(
      (i) => i.w >= 40 && i.w <= 100 && i.h >= 40 && i.h <= 100 && i.y < 900,
    );
    const mains = allImgs.filter(
      (i) => i.w > 200 && i.h > 250 && i.y < 900 && i.opacity !== "0",
    );

    // Material row
    const materialLabel = [...document.querySelectorAll("p,span,div")].find(
      (el) => text(el) === "Material",
    );

    // Section background card?
    const grayCards = [...document.querySelectorAll("div")]
      .map((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          bg: s.backgroundColor,
          radius: s.borderRadius,
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          x: +r.left.toFixed(1),
          y: +(r.top + scrollY).toFixed(1),
          className: (el.className || "").toString().slice(0, 50),
        };
      })
      .filter(
        (c) =>
          c.bg.includes("243") ||
          c.bg.includes("248") ||
          c.bg.includes("242") ||
          c.bg === "rgb(243, 243, 243)" ||
          c.bg === "rgb(248, 248, 248)" ||
          c.bg === "rgb(238, 238, 238)",
      )
      .filter((c) => c.w > 400 && c.y < 1000)
      .slice(0, 10);

    // Trust cards
    const trustTitles = ["Trusted Quality", "Real Time Tracking", "Secure Payments", "Easy Returns"].map(
      (t) => {
        const el = [...document.querySelectorAll("p,h2,h3,h4,div,span")].find(
          (n) => text(n) === t,
        );
        const card = el?.closest("div");
        // climb to card-sized
        let cur = el;
        for (let i = 0; i < 6 && cur; i++) {
          const r = cur.getBoundingClientRect();
          if (r.width > 180 && r.height > 80) break;
          cur = cur.parentElement;
        }
        return { title: t, box: box(cur) };
      },
    );

    const order = [...document.querySelectorAll("a")].find((a) =>
      /order now/i.test(text(a)),
    );
    const title = [...document.querySelectorAll("h1,h2,h3")].find((el) =>
      /Textured/i.test(text(el)),
    );

    // Click second thumb if exists and see if main changes
    return {
      badge: box(badgeWrap),
      badgeText: text(badgeWrap),
      shopPill: shopPill
        ? { text: text(shopPill), box: box(shopPill), parentBg: getComputedStyle(shopPill).backgroundColor, radius: getComputedStyle(shopPill).borderRadius, pad: getComputedStyle(shopPill).padding }
        : null,
      thumbs,
      mains: mains.slice(0, 6),
      grayCards,
      trustTitles,
      order: box(order),
      title: box(title),
      materialLabel: materialLabel
        ? {
            text: text(materialLabel),
            box: box(materialLabel),
            prev: materialLabel.previousElementSibling?.tagName,
            parentHTML: materialLabel.parentElement?.innerHTML?.slice(0, 400),
          }
        : null,
    };
  });

  // Try clicking through thumbs
  const thumbButtons = page.locator("img").filter({
    hasNot: page.locator("xpath=.."),
  });
  // Find small images and click
  const thumbInfo = await page.evaluate(async () => {
    const small = [...document.querySelectorAll("img")].filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width >= 40 && r.width <= 100 && r.height >= 40 && r.height <= 100 && r.top < 800;
    });
    const results = [];
    for (let i = 0; i < Math.min(small.length, 5); i++) {
      const img = small[i];
      const clickable = img.closest("button,a,div") || img;
      clickable.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 350));
      const visibleMain = [...document.querySelectorAll("img")].find((im) => {
        const r = im.getBoundingClientRect();
        return r.width > 300 && r.height > 300 && r.top < 800 && getComputedStyle(im).opacity !== "0";
      });
      results.push({
        thumbSrc: (img.currentSrc || img.src).split("/").pop()?.split("?")[0],
        mainSrc: (visibleMain?.currentSrc || visibleMain?.src || "")
          .split("/")
          .pop()
          ?.split("?")[0],
        thumbBorder: getComputedStyle(img.parentElement || img).border,
        thumbOutline: getComputedStyle(img.parentElement || img).outline,
        parentRadius: getComputedStyle(img.parentElement || img).borderRadius,
        parentBox: (() => {
          const r = (img.parentElement || img).getBoundingClientRect();
          return { w: r.width, h: r.height };
        })(),
      });
    }
    return { thumbCount: small.length, results };
  });

  await page.close();
  return { width, data, thumbInfo };
}

const out = {
  1440: await deep(1440),
  1024: await deep(1024),
  390: await deep(390),
};
fs.writeFileSync("./out-product-audit/live-deep.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2).slice(0, 12000));
await browser.close();
