import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";

const OUT = path.resolve("out-about");
const URL = "https://wearix.framer.website/about";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function measure(w, h, name) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const findText = (exact) =>
      [...document.querySelectorAll("*")].find(
        (n) => (n.textContent || "").replace(/\s+/g, " ").trim() === exact && n.children.length === 0,
      );
    const findIncludes = (sub) =>
      [...document.querySelectorAll("*")].find(
        (n) => (n.textContent || "").replace(/\s+/g, " ").trim().includes(sub) && n.children.length === 0,
      );
    const dump = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const parent = el.parentElement;
      const pr = parent?.getBoundingClientRect();
      const ps = parent ? getComputedStyle(parent) : null;
      return {
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
        x: +r.x.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
        bg: s.backgroundColor,
        bgImage: s.backgroundImage?.slice(0, 250),
        padding: s.padding,
        margin: s.margin,
        gap: s.gap,
        radius: s.borderRadius,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
        display: s.display,
        flexDir: s.flexDirection,
        align: s.alignItems,
        justify: s.justifyContent,
        textAlign: s.textAlign,
        maxWidth: s.maxWidth,
        opacity: s.opacity,
        parent: parent
          ? {
              name: parent.getAttribute("data-framer-name"),
              w: +pr.width.toFixed(1),
              h: +pr.height.toFixed(1),
              y: +(pr.top + scrollY).toFixed(1),
              padding: ps.padding,
              gap: ps.gap,
              display: ps.display,
              flexDir: ps.flexDirection,
              justify: ps.justifyContent,
              align: ps.alignItems,
              bg: ps.backgroundColor,
              radius: ps.borderRadius,
            }
          : null,
      };
    };

    const heroImg = document.querySelector('img[alt*="trench"], img[alt*="neon"], [data-framer-name="Hero section"] img');
    const heroSection = document.querySelector('[data-framer-name="Hero section"]') || heroImg?.closest("section") || heroImg?.parentElement;

    // Stats cards - find by stat labels
    const statLabels = [
      "Pieces worn daily",
      "Customer Satisfaction",
      "Essential Styles",
      "Community worldwide",
    ];
    const stats = statLabels.map((label) => {
      const el = findText(label);
      // climb to card-ish container
      let card = el;
      for (let i = 0; i < 8 && card; i++) {
        const r = card.getBoundingClientRect();
        if (r.height > 200 && r.width > 150) break;
        card = card.parentElement;
      }
      const img = card?.querySelector("img");
      const svg = card?.querySelector("svg");
      return {
        label: dump(el),
        value: dump(card?.querySelector("h2")),
        card: dump(card),
        img: img
          ? {
              src: img.currentSrc || img.src,
              alt: img.alt,
              w: img.getBoundingClientRect().width,
              h: img.getBoundingClientRect().height,
              objectFit: getComputedStyle(img).objectFit,
            }
          : null,
        icon: svg
          ? {
              w: svg.getAttribute("width"),
              h: svg.getAttribute("height"),
              viewBox: svg.getAttribute("viewBox"),
              html: svg.outerHTML.slice(0, 600),
            }
          : null,
      };
    });

    // Trust row
    const rating = findIncludes("4.9/5") || findIncludes("4.8/5");
    const trusted = findIncludes("Trusted by");
    let trustRow = rating;
    for (let i = 0; i < 10 && trustRow; i++) {
      const r = trustRow.getBoundingClientRect();
      if (r.width > window.innerWidth * 0.7) break;
      trustRow = trustRow.parentElement;
    }

    // Mission eyebrow
    const aboutEyebrow = findText("About Wearix") || findIncludes("About Wearix");
    const know = findIncludes("Know about");
    const aboutPill = findText("About");

    // Avatars near rating
    const avatarImgs = [...document.querySelectorAll("img")].filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width <= 45 && r.width >= 30 && r.height <= 45 && (r.top + scrollY) < 900 && (r.top + scrollY) > 500;
    });

    // Logo marquee imgs
    const logoImgs = [...document.querySelectorAll("img")].filter((img) => {
      const name = img.closest("[data-framer-name]")?.getAttribute("data-framer-name");
      return name === "Logo";
    });

    // Hero CTA buttons
    const browse = [...document.querySelectorAll("a")].find((a) =>
      (a.textContent || "").includes("Browse collections"),
    );
    const aboutUs = [...document.querySelectorAll("a")].find((a) =>
      (a.textContent || "").replace(/\s+/g, " ").trim() === "About us" ||
      (a.textContent || "").includes("About usAbout us"),
    );

    // Section backgrounds via large containers
    const missionHeading = document.querySelector("h5");
    let missionSection = missionHeading;
    for (let i = 0; i < 12 && missionSection; i++) {
      const r = missionSection.getBoundingClientRect();
      if (r.width > window.innerWidth * 0.85 && r.height > 400) break;
      missionSection = missionSection.parentElement;
    }

    // Icon next to About Wearix
    const aboutWearixIcon = aboutEyebrow?.parentElement?.querySelector("svg");

    // Star icons near rating
    const starSvgs = rating
      ? [...(trustRow || document).querySelectorAll("svg")].slice(0, 8).map((s) => s.outerHTML.slice(0, 400))
      : [];

    return {
      viewport: { w: innerWidth, h: innerHeight },
      hero: {
        section: dump(heroSection),
        img: heroImg
          ? {
              src: heroImg.currentSrc || heroImg.src,
              alt: heroImg.alt,
              ...dump(heroImg),
            }
          : null,
        h1: dump(document.querySelector("h1")),
        body: dump(findIncludes("We focus on creating")),
        know: dump(know),
        aboutPill: dump(aboutPill),
        browse: dump(browse),
        aboutUs: dump(aboutUs),
      },
      trust: {
        row: dump(trustRow),
        rating: dump(rating),
        trusted: dump(trusted),
        avatars: avatarImgs.map((img) => ({
          src: img.currentSrc || img.src,
          w: +img.getBoundingClientRect().width.toFixed(1),
          h: +img.getBoundingClientRect().height.toFixed(1),
          x: +img.getBoundingClientRect().x.toFixed(1),
        })),
        logos: [...new Set(logoImgs.map((i) => i.currentSrc || i.src))],
        stars: starSvgs,
      },
      mission: {
        eyebrow: dump(aboutEyebrow),
        heading: dump(missionHeading),
        section: dump(missionSection),
        icon: aboutWearixIcon ? aboutWearixIcon.outerHTML.slice(0, 800) : null,
        stats,
      },
      socialEyebrow: dump(findIncludes("Stay connected")),
      socialHeading: dump(document.querySelectorAll("h2")[4] || findIncludes("See our community")),
    };
  });

  // Animation probe: reload and check transforms before scroll settles
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(100);
  const early = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const s = h1 ? getComputedStyle(h1) : null;
    return h1
      ? { opacity: s.opacity, transform: s.transform, transition: s.transition }
      : null;
  });
  await page.waitForTimeout(1500);
  const late = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const s = h1 ? getComputedStyle(h1) : null;
    // also check framer appear animations on sections
    const nodes = [...document.querySelectorAll("[style*='opacity'], [data-framer-appear-id]")].slice(0, 20);
    return {
      h1: h1 ? { opacity: s.opacity, transform: s.transform, transition: s.transition } : null,
      appear: nodes.map((n) => ({
        name: n.getAttribute("data-framer-name"),
        opacity: getComputedStyle(n).opacity,
        transform: getComputedStyle(n).transform.slice(0, 80),
        text: (n.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
      })),
    };
  });

  // Logo marquee motion
  const marquee = await page.evaluate(async () => {
    const logos = [...document.querySelectorAll("[data-framer-name='Logo']")];
    if (!logos.length) return null;
    const first = logos[0];
    const x1 = first.getBoundingClientRect().x;
    await new Promise((r) => setTimeout(r, 600));
    const x2 = first.getBoundingClientRect().x;
    return { count: logos.length, dx: +(x2 - x1).toFixed(2), moving: Math.abs(x2 - x1) > 0.5 };
  });

  fs.writeFileSync(
    path.join(OUT, `measure-${name}.json`),
    JSON.stringify({ data, early, late, marquee }, null, 2),
  );
  console.log(name, "hero h", data.hero.section?.h, "stats", data.mission.stats.map((s) => s.card?.w), "marquee", marquee);
  await page.close();
}

for (const vp of [
  [1440, 900, "1440"],
  [1024, 800, "1024"],
  [390, 844, "390"],
]) {
  await measure(...vp);
}
await browser.close();
