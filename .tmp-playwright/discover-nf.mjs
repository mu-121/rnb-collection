import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";

const OUT = path.resolve("out-nf");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 952 }, deviceScaleFactor: 1 });
await page.goto("https://wearix.framer.website/", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(3000);

// Discover sections after social gallery
const discovery = await page.evaluate(() => {
  const social = [...document.querySelectorAll("h1,h2,h3")].find((n) =>
    (n.textContent || "").includes("See our community")
  );
  let socialRoot = social;
  while (socialRoot && socialRoot.parentElement) {
    socialRoot = socialRoot.parentElement;
    if (socialRoot.tagName === "SECTION" || socialRoot.getBoundingClientRect().height > 700) break;
  }

  // Find footer
  const footer = document.querySelector("footer") ||
    [...document.querySelectorAll("section,div")].find((el) => {
      const t = (el.textContent || "");
      return t.includes("Privacy") && t.includes("Quick links") && el.querySelectorAll("a").length > 8;
    });

  // Find newsletter by subscribe text
  const sub = [...document.querySelectorAll("*")].find((n) =>
    /subscribe to our news/i.test((n.textContent || "").trim()) && (n.textContent || "").trim().length < 80
  );

  let newsRoot = sub;
  while (newsRoot && newsRoot.parentElement) {
    newsRoot = newsRoot.parentElement;
    const h = newsRoot.getBoundingClientRect().height;
    if ((newsRoot.tagName === "SECTION" || h > 200) && h < 800 && newsRoot.querySelector("input,form,button")) break;
  }

  const texts = [];
  for (const el of document.querySelectorAll("h1,h2,h3,h4,p,span,label,button,a,input")) {
    const t = (el.tagName === "INPUT" ? el.placeholder || el.value : el.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!t || t.length > 160) continue;
    if (/subscribe|email|news|footer|privacy|terms|quick|instagram|dribbble|copyright|©|wearix|contact|follow/i.test(t)) {
      texts.push({
        tag: el.tagName,
        name: el.getAttribute("data-framer-name"),
        t,
        href: el.getAttribute("href"),
        type: el.getAttribute("type"),
        placeholder: el.getAttribute("placeholder"),
      });
    }
  }

  return {
    socialName: socialRoot?.getAttribute("data-framer-name"),
    newsFound: !!newsRoot,
    newsName: newsRoot?.getAttribute("data-framer-name"),
    newsTag: newsRoot?.tagName,
    newsText: (newsRoot?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 400),
    footerTag: footer?.tagName,
    footerName: footer?.getAttribute("data-framer-name"),
    footerText: (footer?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 600),
    texts: texts.slice(0, 80),
    // sections near end
    endSections: [...document.querySelectorAll("section")].slice(-6).map((s) => ({
      name: s.getAttribute("data-framer-name"),
      h: +s.getBoundingClientRect().height.toFixed(1),
      text: (s.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
    })),
  };
});

fs.writeFileSync(path.join(OUT, "discovery.json"), JSON.stringify(discovery, null, 2));
console.log(JSON.stringify(discovery, null, 2));

await browser.close();
