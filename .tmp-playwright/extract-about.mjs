import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const OUT = path.resolve("out-about");
fs.mkdirSync(OUT, { recursive: true });

const URL = "https://wearix.framer.website/about";
const VIEWPORTS = [
  { name: "1440", w: 1440, h: 900 },
  { name: "1024", w: 1024, h: 800 },
  { name: "390", w: 390, h: 844 },
];

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

function box(el, pageEvalHelpers = false) {
  // used inside page.evaluate via stringified helpers
}

async function extractViewport(vp) {
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 1,
  });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(3000);

  // scroll to trigger lazy content / animations
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += Math.max(200, window.innerHeight * 0.6)) {
      window.scrollTo(0, y);
      await sleep(200);
    }
    window.scrollTo(0, 0);
    await sleep(500);
  });

  await page.screenshot({
    path: path.join(OUT, `about-${vp.name}.png`),
    fullPage: true,
  });

  const data = await page.evaluate(() => {
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        top: +(r.top + window.scrollY).toFixed(1),
      };
    };
    const styleDump = (el) => {
      if (!el) return null;
      const s = cs(el);
      return {
        ...rect(el),
        display: s.display,
        flexDir: s.flexDirection,
        align: s.alignItems,
        justify: s.justifyContent,
        gap: s.gap,
        padding: s.padding,
        margin: s.margin,
        maxWidth: s.maxWidth,
        width: s.width,
        height: s.height,
        bg: s.backgroundColor,
        bgImage: s.backgroundImage?.slice(0, 400),
        color: s.color,
        fontFamily: s.fontFamily?.slice(0, 100),
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        textAlign: s.textAlign,
        borderRadius: s.borderRadius,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
        opacity: s.opacity,
        transform: s.transform === "none" ? "none" : s.transform.slice(0, 120),
        objectFit: s.objectFit,
        objectPosition: s.objectPosition,
        overflow: s.overflow,
        position: s.position,
        zIndex: s.zIndex,
      };
    };

    const textNodes = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,span,li")]
      .map((el) => {
        const t = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!t || t.length > 220) return null;
        // skip pure whitespace / duplicates of parent
        if (el.children.length > 3 && t.length > 80) return null;
        return {
          tag: el.tagName.toLowerCase(),
          text: t,
          name: el.getAttribute("data-framer-name"),
          href: el.getAttribute("href"),
          role: el.getAttribute("role"),
          ...styleDump(el),
        };
      })
      .filter(Boolean);

    // Unique meaningful headings/CTAs
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || "").replace(/\s+/g, " ").trim(),
      name: el.getAttribute("data-framer-name"),
      ...styleDump(el),
    }));

    const links = [...document.querySelectorAll("a")].map((a) => ({
      text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
      href: a.getAttribute("href"),
      name: a.getAttribute("data-framer-name"),
      ...styleDump(a),
    }));

    const images = [...document.querySelectorAll("img")].map((img) => {
      const src = img.currentSrc || img.src || img.getAttribute("src") || "";
      return {
        src,
        alt: img.alt || "",
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        ...styleDump(img),
        parentName: img.closest("[data-framer-name]")?.getAttribute("data-framer-name"),
      };
    });

    const videos = [...document.querySelectorAll("video")].map((v) => ({
      src: v.currentSrc || v.src || "",
      poster: v.poster || "",
      ...styleDump(v),
    }));

    const svgs = [...document.querySelectorAll("svg")].slice(0, 80).map((svg) => {
      const paths = [...svg.querySelectorAll("path")].map((p) => ({
        d: (p.getAttribute("d") || "").slice(0, 200),
        fill: p.getAttribute("fill") || getComputedStyle(p).fill,
        stroke: p.getAttribute("stroke") || getComputedStyle(p).stroke,
        strokeWidth: p.getAttribute("stroke-width") || getComputedStyle(p).strokeWidth,
      }));
      return {
        w: svg.getAttribute("width"),
        h: svg.getAttribute("height"),
        viewBox: svg.getAttribute("viewBox"),
        parentName: svg.closest("[data-framer-name]")?.getAttribute("data-framer-name"),
        ...styleDump(svg),
        paths: paths.slice(0, 6),
        outerHTML: svg.outerHTML.slice(0, 500),
      };
    });

    // Top-level Framer sections
    const sectionRoots = [
      ...document.querySelectorAll(
        '[data-framer-name], section, [data-framer-component-type="Section"]',
      ),
    ];
    const named = [...document.querySelectorAll("[data-framer-name]")].map((el) => ({
      name: el.getAttribute("data-framer-name"),
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160),
      ...styleDump(el),
    }));

    // Approximate section stack by large containers with substantial height
    const candidates = [...document.querySelectorAll("div,section")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < window.innerWidth * 0.8 || r.height < 80) return null;
        const s = cs(el);
        return {
          name: el.getAttribute("data-framer-name"),
          id: el.id || null,
          className: (el.className || "").toString().slice(0, 80),
          textPreview: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 140),
          top: +(r.top + window.scrollY).toFixed(1),
          h: +r.height.toFixed(1),
          w: +r.width.toFixed(1),
          bg: s.backgroundColor,
          bgImage: s.backgroundImage?.slice(0, 300),
          padding: s.padding,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.top - b.top);

    // Deduplicate nested by similar top
    const sections = [];
    for (const c of candidates) {
      const last = sections[sections.length - 1];
      if (last && Math.abs(last.top - c.top) < 8 && Math.abs(last.h - c.h) < 40) continue;
      // keep only reasonably distinct bands
      if (last && c.top >= last.top && c.top + c.h <= last.top + last.h + 2 && c.h < last.h * 0.95)
        continue;
      sections.push(c);
    }

    // Animation / transform samples on key elements
    const animSamples = headings.concat(
      [...document.querySelectorAll("[style*='transform'], [style*='opacity']")].slice(0, 40).map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
        name: el.getAttribute("data-framer-name"),
        ...styleDump(el),
      })),
    );

    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      headings,
      links: links.filter((l) => l.text || l.href),
      images,
      videos,
      svgs,
      named: named.filter((n) => n.name).slice(0, 200),
      sections: sections.slice(0, 40),
      textNodes: textNodes.slice(0, 250),
      animSamples: animSamples.slice(0, 80),
    };
  });

  // Capture animation initial/final by checking mid-scroll
  const animProbe = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const probe = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        opacity: s.opacity,
        transform: s.transform,
        top: r.top,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
      };
    };
    const targets = ["h1", "h2", "h5", "img"];
    window.scrollTo(0, 0);
    await sleep(300);
    const atTop = Object.fromEntries(targets.map((t) => [t, probe(t)]));
    window.scrollTo(0, 600);
    await sleep(800);
    const mid = Object.fromEntries(targets.map((t) => [t, probe(t)]));
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(800);
    const bottom = Object.fromEntries(
      ["h2", "h5", "[data-framer-name]"].map((t) => [t, probe(t)]),
    );
    return { atTop, mid, bottom };
  });

  fs.writeFileSync(
    path.join(OUT, `about-${vp.name}.json`),
    JSON.stringify({ viewport: vp, data, animProbe }, null, 2),
  );

  await page.close();
  return { vp, imageCount: data.images.length, headings: data.headings.map((h) => h.text) };
}

const results = [];
for (const vp of VIEWPORTS) {
  console.log("Extracting", vp.name);
  results.push(await extractViewport(vp));
}

// Download unique image URLs from 1440 extract for hashing
const d1440 = JSON.parse(fs.readFileSync(path.join(OUT, "about-1440.json"), "utf8"));
const urls = [
  ...new Set(
    d1440.data.images
      .map((i) => i.src)
      .filter((u) => u && u.startsWith("http")),
  ),
];

const assetMeta = [];
for (const url of urls) {
  try {
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const md5 = crypto.createHash("md5").update(buf).digest("hex");
    const name = url.split("/").pop()?.split("?")[0] || "asset";
    const file = path.join(OUT, `live-${name}`);
    fs.writeFileSync(file, buf);
    assetMeta.push({ url, bytes: buf.length, md5, file: path.basename(file) });
    console.log("Saved", name, md5, buf.length);
  } catch (e) {
    assetMeta.push({ url, error: String(e) });
  }
}
fs.writeFileSync(path.join(OUT, "assets.json"), JSON.stringify(assetMeta, null, 2));
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify({ results, assetMeta }, null, 2));

console.log("DONE", results);
await browser.close();
