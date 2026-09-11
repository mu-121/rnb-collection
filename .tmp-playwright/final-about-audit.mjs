import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";

const OUT = path.resolve("out-final-audit");
fs.mkdirSync(OUT, { recursive: true });

const LOCAL_ABOUT = "http://localhost:3000/about";
const LOCAL_HOME = "http://localhost:3000/";
const LIVE_ABOUT = "https://wearix.framer.website/about";
const LIVE_HOME = "https://wearix.framer.website/";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

function box(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  return {
    w: +r.width.toFixed(1),
    h: +r.height.toFixed(1),
    y: +(r.top + scrollY).toFixed(1),
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    fontFamily: s.fontFamily.slice(0, 60),
    color: s.color,
    bg: s.backgroundColor,
    padding: s.padding,
  };
}

async function auditAbout(url, label, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("response", (res) => {
    const u = res.url();
    if (res.status() >= 400 && /\.(png|jpe?g|webp|svg|woff2?|ttf|css|js)(\?|$)/i.test(u)) {
      failed.push({ status: res.status(), url: u.slice(0, 160) });
    }
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1800);

  // marquee motion probe
  const marquee = await page.evaluate(async () => {
    const track =
      document.querySelector(".about-trust__marquee-track") ||
      document.querySelector("[data-framer-name='Logo']")?.parentElement;
    if (!track) return null;
    const el = track.firstElementChild || track;
    const x1 = el.getBoundingClientRect().x;
    await new Promise((r) => setTimeout(r, 500));
    const x2 = el.getBoundingClientRect().x;
    return { dx: +(x2 - x1).toFixed(2), moving: Math.abs(x2 - x1) > 0.5 };
  });

  const data = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const qa = (s) => [...document.querySelectorAll(s)];
    const textExact = (t) =>
      qa("*").find((n) => (n.textContent || "").replace(/\s+/g, " ").trim() === t && n.children.length === 0);

    const dump = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        fontFamily: s.fontFamily.slice(0, 80),
        color: s.color,
        bg: s.backgroundColor,
        padding: s.padding,
        maxWidth: s.maxWidth,
        objectFit: s.objectFit,
        objectPosition: s.objectPosition,
        borderRadius: s.borderRadius,
      };
    };

    const isLocal = !!q(".about-hero");
    const hero = q(".about-hero") || q("[data-framer-name='Hero section']");
    const h1 = q("h1");
    const body = textExact(
      "We focus on creating essential garments that remain relevant, functional, and refined across seasons.",
    ) || qa("p").find((p) => (p.textContent || "").includes("We focus on creating"));

    const sections = isLocal
      ? qa("section").map((s) => ({
          name: s.className.toString().split(" ")[0] || s.tagName,
          h: +s.getBoundingClientRect().height.toFixed(1),
          y: +(s.getBoundingClientRect().top + scrollY).toFixed(1),
        }))
      : [
          { name: "hero", h: dump(hero)?.h, y: dump(hero)?.y },
          { name: "trust", h: null, y: null },
          { name: "mission", h: null, y: null },
          ...qa("section").map((s) => ({
            name: s.getAttribute("data-framer-name") || s.className.toString().slice(0, 30),
            h: +s.getBoundingClientRect().height.toFixed(1),
            y: +(s.getBoundingClientRect().top + scrollY).toFixed(1),
          })),
        ];

    const links = qa("a")
      .map((a) => ({
        text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
        href: a.getAttribute("href"),
      }))
      .filter((l) =>
        ["Browse collections", "About us", "See collections", "Contact us", "Shop all items"].some((t) =>
          l.text.includes(t),
        ),
      );

    const uniqLinks = [];
    const seen = new Set();
    for (const l of links) {
      const k = l.text + l.href;
      if (seen.has(k)) continue;
      seen.add(k);
      uniqLinks.push(l);
    }

    const stats = ["10M+", "98%", "300+", "500K+"].map((v) => {
      const el = qa("h2,p").find((n) => (n.textContent || "").trim() === v);
      let card = el;
      for (let i = 0; i < 8 && card; i++) {
        if (card.getBoundingClientRect().height > 200) break;
        card = card.parentElement;
      }
      return { value: v, card: dump(card), valueBox: dump(el) };
    });

    const trustRating =
      qa("p").find((p) => (p.textContent || "").includes("4.9/5")) ||
      qa("*").find((n) => (n.textContent || "").includes("4.9/5 rating"));

    const starColor = (() => {
      const stars = q(".about-trust__stars") || trustRating?.parentElement?.querySelector("svg");
      return stars ? getComputedStyle(stars).color : null;
    })();

    const imgs = qa("img").map((img) => ({
      src: (img.currentSrc || img.src || "").split("?")[0].slice(-60),
      ok: img.naturalWidth > 0 || img.complete,
      broken: img.complete && img.naturalWidth === 0,
    }));

    return {
      title: document.title,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 80),
      hero: dump(hero),
      h1: dump(h1),
      h1Text: h1?.textContent?.trim(),
      body: dump(body),
      chip: dump(q(".about-hero__chip") || textExact("Know about Wearix")?.parentElement?.parentElement),
      trustRating: dump(trustRating),
      starColor,
      missionHeading: dump(
        q("#about-mission-heading") ||
          qa("h5,h2").find((h) => (h.textContent || "").includes("More than fashion")),
      ),
      stats,
      sections: isLocal
        ? sections
        : sections,
      sectionNames: isLocal
        ? sections.map((s) => s.name)
        : [
            "announce+header+hero",
            "trust",
            "mission+stats",
            "social",
            "newsletter",
            "footer",
          ],
      headings: qa("h1,h2,h5").map((h) => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent.replace(/\s+/g, " ").trim().slice(0, 90),
      })),
      links: uniqLinks,
      brokenImages: imgs.filter((i) => i.broken).length,
      imageCount: imgs.length,
      hasSocial: !!(q(".social-gallery") || qa("h2").find((h) => (h.textContent || "").includes("See our community"))),
      hasNewsletter: !!(q(".newsletter") || qa("h4,h2").find((h) => (h.textContent || "").includes("Subscribe"))),
      hasFooter: !!q("footer"),
      orangePresent: getComputedStyle(document.documentElement).cssText.includes("255, 106") ||
        !!qa("*").find((el) => {
          const c = getComputedStyle(el).color;
          const f = getComputedStyle(el).fill;
          return c.includes("255, 106") || f.includes("255, 106");
        }),
    };
  });

  await page.screenshot({ path: path.join(OUT, `${label}-about-${w}.png`), fullPage: true });
  await page.close();
  return { label, w, marquee, data, errors: errors.slice(0, 20), failed: failed.slice(0, 20) };
}

async function auditHome(url, label, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const dump = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        h: +r.height.toFixed(1),
        y: +(r.top + scrollY).toFixed(1),
        w: +r.width.toFixed(1),
        bg: s.backgroundColor,
        fontSize: s.fontSize,
        color: s.color,
      };
    };
    const q = (s) => document.querySelector(s);
    const sections = {
      announce: dump(q(".announce")),
      header: dump(q(".site-header")),
      hero: dump(q(".hero")),
      newArrivals: dump(q(".new-arrivals")),
      brandStory: dump(q(".brand-story")),
      bestSellers: dump(q(".best-sellers")),
      collections: dump(q(".collections")),
      reviews: dump(q(".customer-reviews")),
      features: dump(q(".features")),
      blog: dump(q(".blog")),
      social: dump(q(".social-gallery")),
      newsletter: dump(q(".newsletter")),
      footer: dump(q("footer")),
    };
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      h1: q("h1")?.textContent?.trim(),
      sections,
      order: Object.entries(sections)
        .filter(([, v]) => v)
        .sort((a, b) => a[1].y - b[1].y)
        .map(([k]) => k),
    };
  });

  await page.screenshot({ path: path.join(OUT, `${label}-home-${w}.png`), fullPage: false });
  await page.close();
  return { label, w, data, errors };
}

async function routeCheck() {
  const page = await browser.newPage();
  const routes = ["/", "/about", "/shop", "/contact", "/blog"];
  const out = [];
  for (const r of routes) {
    const res = await page.goto(`http://localhost:3000${r}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    }).catch((e) => null);
    const status = res?.status() ?? 0;
    const title = await page.title().catch(() => "");
    const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 120) || "");
    out.push({ route: r, status, title, snippet: bodyText.replace(/\s+/g, " ").trim() });
  }
  await page.close();
  return out;
}

const aboutViewports = [
  [1440, 900],
  [1024, 800],
  [390, 844],
  [320, 700],
  [375, 812],
  [768, 900],
  [810, 900],
  [1200, 900],
];

const report = { aboutLocal: [], aboutLive: [], homeLocal: [], routes: [], interactions: {} };

for (const [w, h] of aboutViewports) {
  report.aboutLocal.push(await auditAbout(LOCAL_ABOUT, "local", w, h));
}
for (const [w, h] of [
  [1440, 900],
  [1024, 800],
  [390, 844],
]) {
  report.aboutLive.push(await auditAbout(LIVE_ABOUT, "live", w, h));
}

for (const [w, h] of [
  [1440, 900],
  [1024, 800],
  [390, 844],
  [320, 700],
  [375, 812],
  [768, 900],
]) {
  report.homeLocal.push(await auditHome(LOCAL_HOME, "local", w, h));
}

report.routes = await routeCheck();

// interaction checks on about
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(LOCAL_ABOUT, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const hrefs = await page.evaluate(() => {
    const pick = (text) => {
      const a = [...document.querySelectorAll("a")].find((el) =>
        (el.textContent || "").replace(/\s+/g, " ").includes(text),
      );
      return a ? { text, href: a.getAttribute("href") } : null;
    };
    return {
      browse: pick("Browse collections"),
      aboutUs: pick("About us"),
      seeCollections: pick("See collections"),
      contactUs: pick("Contact us"),
      navAbout: [...document.querySelectorAll("a")].find((a) => a.getAttribute("href") === "/about")?.href,
      logo: document.querySelector(".site-header__logo")?.getAttribute("href"),
    };
  });
  // social gallery drag
  const social = await page.evaluate(async () => {
    const stage = document.querySelector(".social-gallery__stage");
    if (!stage) return { present: false };
    const before = getComputedStyle(stage).transform;
    return { present: true, transform: before.slice(0, 80) };
  });
  // reduced motion marquee
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const reduced = await page.evaluate(async () => {
    const track = document.querySelector(".about-trust__marquee-track");
    if (!track) return null;
    const anim = getComputedStyle(track).animationName;
    const el = track.firstElementChild;
    const x1 = el.getBoundingClientRect().x;
    await new Promise((r) => setTimeout(r, 400));
    const x2 = el.getBoundingClientRect().x;
    return { animationName: anim, dx: +(x2 - x1).toFixed(2) };
  });
  report.interactions = { hrefs, social, reduced };
  await page.close();
}

fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  routes: report.routes,
  interactions: report.interactions,
  aboutLocal1440: {
    sections: report.aboutLocal[0].data.sectionNames || report.aboutLocal[0].data.sections,
    h1: report.aboutLocal[0].data.h1,
    heroH: report.aboutLocal[0].data.hero?.h,
    overflow: report.aboutLocal[0].data.overflowX,
    starColor: report.aboutLocal[0].data.starColor,
    orange: report.aboutLocal[0].data.orangePresent,
    marquee: report.aboutLocal[0].marquee,
    errors: report.aboutLocal[0].errors,
    failed: report.aboutLocal[0].failed,
    brokenImages: report.aboutLocal[0].data.brokenImages,
    links: report.aboutLocal[0].data.links,
  },
  aboutLive1440: {
    h1: report.aboutLive[0].data.h1,
    heroH: report.aboutLive[0].data.hero?.h,
    starColor: report.aboutLive[0].data.starColor,
    marquee: report.aboutLive[0].marquee,
  },
  home1440order: report.homeLocal[0].data.order,
  homeOverflow: report.homeLocal.map((h) => ({ w: h.w, overflow: h.data.overflowX, heroH: h.data.sections.hero?.h })),
}, null, 2));

await browser.close();
