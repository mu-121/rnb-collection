import { chromium } from "./package/index.mjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const OUT = path.resolve("out-nf");
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 952 }, deviceScaleFactor: 1 });
await page.goto("https://wearix.framer.website/", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(2500);
await page.evaluate(() => {
  const f = document.querySelector("footer");
  f?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(400);

const layout = await page.evaluate(() => {
  const root = document.querySelector("footer");
  const container = [...root.querySelectorAll("[data-framer-name='Container']")][0];

  function info(el, label) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      label,
      name: el.getAttribute("data-framer-name"),
      x: +r.x.toFixed(1),
      y: +r.y.toFixed(1),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      gap: s.gap,
      padding: s.padding,
      display: s.display,
      flexDir: s.flexDirection,
      justify: s.justifyContent,
      align: s.alignItems,
      bg: s.backgroundColor,
      radius: s.borderRadius,
      children: [...el.children].length,
    };
  }

  // Walk structure
  const walk = (el, depth = 0) => {
    if (depth > 4) return null;
    const r = el.getBoundingClientRect();
    if (r.height < 5 || r.width < 5) return null;
    return {
      name: el.getAttribute("data-framer-name"),
      tag: el.tagName,
      x: +r.x.toFixed(0),
      y: +r.y.toFixed(0),
      w: +r.width.toFixed(0),
      h: +r.height.toFixed(0),
      gap: getComputedStyle(el).gap,
      display: getComputedStyle(el).display,
      flexDir: getComputedStyle(el).flexDirection,
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
      kids: [...el.children].slice(0, 12).map((c) => walk(c, depth + 1)).filter(Boolean),
    };
  };

  // Newsletter row - heading + form parents
  const h4 = [...root.querySelectorAll("h4")].find((n) =>
    (n.textContent || "").includes("Subscribe")
  );
  let newsRow = h4;
  for (let i = 0; i < 8; i++) {
    newsRow = newsRow?.parentElement;
    if (!newsRow) break;
    const form = newsRow.querySelector("form");
    if (form && newsRow.getBoundingClientRect().width > 800) break;
  }

  // Contact button
  const contactBtn = [...root.querySelectorAll("a")].find((a) =>
    (a.textContent || "").includes("Contact Wearix")
  );

  // Columns: Quick links, Follow us, Get in touch
  const ql = [...root.querySelectorAll("*")].find(
    (n) => (n.textContent || "").trim() === "Quick Links" && n.children.length === 0
  );
  const fu = [...root.querySelectorAll("*")].find(
    (n) => (n.textContent || "").trim() === "Follow us:" && n.children.length === 0
  );
  const git = [...root.querySelectorAll("*")].find(
    (n) => (n.textContent || "").trim() === "Get in touch" && n.children.length === 0
  );

  // climb to column wrappers
  function columnOf(leaf) {
    let n = leaf;
    for (let i = 0; i < 10; i++) {
      n = n?.parentElement;
      if (!n) return null;
      const r = n.getBoundingClientRect();
      // column-ish
      if (r.width > 80 && r.width < 400 && r.height > 100) {
        return info(n, leaf.textContent.trim());
      }
    }
    return null;
  }

  // Logo small and large
  const logos = [...root.querySelectorAll("img")].map((img) => {
    const r = img.getBoundingClientRect();
    const a = img.closest("a");
    return {
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      x: +r.x.toFixed(1),
      y: +r.y.toFixed(1),
      opacity: getComputedStyle(img).opacity,
      href: a?.getAttribute("href"),
      parentOpacity: a ? getComputedStyle(a).opacity : null,
      mixBlend: getComputedStyle(img).mixBlendMode,
      filter: getComputedStyle(img).filter,
    };
  });

  // Divider lines?
  const dividers = [...root.querySelectorAll("*")].filter((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return r.height <= 2 && r.width > 200 && (s.backgroundColor.includes("255") || s.borderTopWidth !== "0px");
  }).map((el) => info(el, "divider"));

  // Contact button styles
  const btn = contactBtn
    ? {
        ...info(contactBtn, "Contact Wearix"),
        bg: getComputedStyle(contactBtn).backgroundColor,
        color: getComputedStyle(contactBtn.querySelector("p,span") || contactBtn).color,
        padding: getComputedStyle(contactBtn).padding,
        radius: getComputedStyle(contactBtn).borderRadius,
        fontSize: getComputedStyle(contactBtn.querySelector("p,span") || contactBtn).fontSize,
      }
    : null;

  // Column headings styles
  const colHead = (text) => {
    const el = [...root.querySelectorAll("*")].find(
      (n) => (n.textContent || "").trim() === text && n.children.length === 0
    );
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      text,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      color: s.color,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
      ...info(el.parentElement, "col"),
    };
  };

  // Link styles for nav
  const navLink = [...root.querySelectorAll("a")].find((a) => (a.textContent || "").trim() === "Home");
  const navStyle = navLink
    ? {
        fontSize: getComputedStyle(navLink).fontSize,
        fontWeight: getComputedStyle(navLink).fontWeight,
        color: getComputedStyle(navLink.querySelector("p,span") || navLink).color,
        lineHeight: getComputedStyle(navLink).lineHeight,
        letterSpacing: getComputedStyle(navLink).letterSpacing,
      }
    : null;

  // Social link style
  const social = [...root.querySelectorAll("a")].find((a) =>
    (a.textContent || "").includes("Instagram")
  );
  const socialStyle = social
    ? {
        fontSize: getComputedStyle(social.querySelector("p,span") || social).fontSize,
        color: getComputedStyle(social.querySelector("p,span") || social).color,
        fontWeight: getComputedStyle(social.querySelector("p,span") || social).fontWeight,
      }
    : null;

  // Contact item (email row)
  const emailLink = [...root.querySelectorAll("a")].find((a) =>
    (a.textContent || "").includes("test@gmail.com")
  );
  const contactItem = emailLink
    ? {
        ...info(emailLink, "email"),
        display: getComputedStyle(emailLink).display,
        gap: getComputedStyle(emailLink).gap,
        align: getComputedStyle(emailLink).alignItems,
        color: getComputedStyle(emailLink).color,
        fontSize: getComputedStyle(emailLink).fontSize,
        // parent row
        parent: info(emailLink.parentElement, "email-parent"),
      }
    : null;

  return {
    container: info(container, "container"),
    tree: walk(container, 0),
    newsRow: info(newsRow, "newsRow"),
    cols: {
      quick: columnOf(ql),
      follow: columnOf(fu),
      touch: columnOf(git),
    },
    logos,
    dividers,
    btn,
    colHeads: {
      quick: colHead("Quick Links"),
      follow: colHead("Follow us:"),
      touch: colHead("Get in touch"),
    },
    navStyle,
    socialStyle,
    contactItem,
    // gap between news and brand block
    newsToBrand: (() => {
      const newsBottom = newsRow?.getBoundingClientRect().bottom;
      const logo = logos[0];
      return logo && newsBottom ? +(logo.y - newsBottom).toFixed(1) : null;
    })(),
  };
});

fs.writeFileSync(path.join(OUT, "layout-desktop.json"), JSON.stringify(layout, null, 2));
console.log(JSON.stringify(layout, null, 2));

// Icon symbols
const icons = await page.evaluate(() => {
  return ["1233169835", "469908671", "3061636003"].map((id) => {
    const el = document.getElementById(id);
    return { id, html: el?.outerHTML || null };
  });
});
fs.writeFileSync(path.join(OUT, "icons.json"), JSON.stringify(icons, null, 2));
console.log("icons", icons.map((i) => ({ id: i.id, len: i.html?.length, preview: i.html?.slice(0, 200) })));

// Compare logo to local
const logoUrl = "https://framerusercontent.com/images/k3mQgskzRmcKKsc3Urx85y2azU.svg?width=67&height=23";
const res = await fetch(logoUrl);
const buf = Buffer.from(await res.arrayBuffer());
const liveMd5 = crypto.createHash("md5").update(buf).digest("hex");
fs.writeFileSync(path.join(OUT, "live-logo.svg"), buf);

const localLogo = fs.readFileSync("/home/usman/Blockmob/rnb-collections/public/Images/wearix-001.svg");
const localMd5 = crypto.createHash("md5").update(localLogo).digest("hex");
console.log("logo md5 live", liveMd5, "local", localMd5, "match", liveMd5 === localMd5);
console.log("live logo", buf.toString("utf8").slice(0, 300));
console.log("local logo", localLogo.toString("utf8").slice(0, 300));

// Tablet + mobile structure
for (const [name, w, h] of [["tablet", 1024, 900], ["mobile", 390, 844]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.querySelector("footer")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    const root = document.querySelector("footer");
    const container = [...root.querySelectorAll("[data-framer-name='Container']")][0];
    const h4 = [...root.querySelectorAll("h4")].find((n) =>
      (n.textContent || "").includes("Subscribe")
    );
    const form = root.querySelector("form");
    const email = root.querySelector('input[type="email"]');
    const submit = root.querySelector('input[type="submit"]');
    const logos = [...root.querySelectorAll("img")].map((img) => {
      const r = img.getBoundingClientRect();
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), y: +r.y.toFixed(1), opacity: getComputedStyle(img).opacity };
    });
    // accordion buttons?
    const buttons = [...root.querySelectorAll("button")].map((b) => ({
      text: b.textContent.replace(/\s+/g, " ").trim().slice(0, 40),
      aria: b.getAttribute("aria-expanded"),
    }));
    return {
      footer: {
        h: +root.getBoundingClientRect().height.toFixed(1),
        padding: getComputedStyle(root).padding,
        bg: getComputedStyle(root).backgroundColor,
      },
      container: container
        ? {
            w: +container.getBoundingClientRect().width.toFixed(1),
            h: +container.getBoundingClientRect().height.toFixed(1),
            padding: getComputedStyle(container).padding,
            gap: getComputedStyle(container).gap,
            flexDir: getComputedStyle(container).flexDirection,
          }
        : null,
      heading: h4
        ? {
            w: +h4.getBoundingClientRect().width.toFixed(1),
            h: +h4.getBoundingClientRect().height.toFixed(1),
            fontSize: getComputedStyle(h4).fontSize,
            x: +h4.getBoundingClientRect().x.toFixed(1),
            y: +h4.getBoundingClientRect().y.toFixed(1),
          }
        : null,
      form: form
        ? {
            w: +form.getBoundingClientRect().width.toFixed(1),
            h: +form.getBoundingClientRect().height.toFixed(1),
            x: +form.getBoundingClientRect().x.toFixed(1),
            y: +form.getBoundingClientRect().y.toFixed(1),
            flexDir: getComputedStyle(form).flexDirection,
            gap: getComputedStyle(form).gap,
          }
        : null,
      email: email
        ? { w: +email.getBoundingClientRect().width.toFixed(1), h: +email.getBoundingClientRect().height.toFixed(1) }
        : null,
      submit: submit
        ? { w: +submit.getBoundingClientRect().width.toFixed(1), h: +submit.getBoundingClientRect().height.toFixed(1) }
        : null,
      logos,
      buttons,
      // positions of columns
      cols: ["Quick Links", "Follow us:", "Get in touch"].map((t) => {
        const el = [...root.querySelectorAll("*")].find(
          (n) => (n.textContent || "").trim() === t && n.children.length === 0
        );
        if (!el) return { t };
        const r = el.getBoundingClientRect();
        return { t, x: +r.x.toFixed(1), y: +r.y.toFixed(1) };
      }),
    };
  });
  await page.locator("footer").screenshot({ path: path.join(OUT, `live-footer-${name}.png`) });
  console.log("\n===", name, "===");
  console.log(JSON.stringify(m, null, 2));
}

// Hover Contact Wearix + input focus
await page.setViewportSize({ width: 1440, height: 952 });
await page.waitForTimeout(800);
await page.evaluate(() => document.querySelector("footer")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(300);

const focusTest = await page.evaluate(async () => {
  const email = document.querySelector('footer input[type="email"]');
  const before = {
    outline: getComputedStyle(email).outline,
    boxShadow: getComputedStyle(email).boxShadow,
    border: getComputedStyle(email).border,
    bg: getComputedStyle(email).backgroundColor,
  };
  email.focus();
  await new Promise((r) => setTimeout(r, 200));
  const after = {
    outline: getComputedStyle(email).outline,
    boxShadow: getComputedStyle(email).boxShadow,
    border: getComputedStyle(email).border,
    bg: getComputedStyle(email).backgroundColor,
  };
  return { before, after };
});
console.log("focus", focusTest);

// Real mouse hover on Contact Wearix and Home link
const contactBox = await page.evaluate(() => {
  const a = [...document.querySelectorAll("footer a")].find((x) =>
    (x.textContent || "").includes("Contact Wearix")
  );
  const r = a.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await page.mouse.move(contactBox.x, contactBox.y);
await page.waitForTimeout(500);
const contactHover = await page.evaluate(() => {
  const a = [...document.querySelectorAll("footer a")].find((x) =>
    (x.textContent || "").includes("Contact Wearix")
  );
  return {
    opacity: getComputedStyle(a).opacity,
    transform: getComputedStyle(a).transform,
    // hover text track
    track: a.querySelector("[class*='hover'], span span")
      ? getComputedStyle(a.querySelector("span") || a).transform
      : null,
  };
});
console.log("contact hover", contactHover);

await browser.close();
