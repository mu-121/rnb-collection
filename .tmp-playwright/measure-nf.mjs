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

async function deep(vpName, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto("https://wearix.framer.website/", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(2500);

  await page.evaluate(() => {
    const f = document.querySelector("footer");
    f?.scrollIntoView({ block: "start" });
    f?.setAttribute("data-footer-root", "1");
  });
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    const root = document.querySelector("[data-footer-root]") || document.querySelector("footer");
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        padding: s.padding,
        gap: s.gap,
        bg: s.backgroundColor,
        color: s.color,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        fontFamily: s.fontFamily.slice(0, 80),
        radius: s.borderRadius,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
        display: s.display,
        flexDir: s.flexDirection,
        gridCols: s.gridTemplateColumns,
        align: s.alignItems,
        justify: s.justifyContent,
        textAlign: s.textAlign,
        opacity: s.opacity,
        transform: s.transform === "none" ? "none" : s.transform.slice(0, 80),
      };
    };

    const textExact = (exact) => {
      const el = [...root.querySelectorAll("*")].find(
        (n) => (n.textContent || "").trim() === exact && n.children.length === 0
      );
      return el ? { text: exact, ...box(el) } : null;
    };

    // Newsletter parts
    const heading = [...root.querySelectorAll("h1,h2,h3,h4,h5")].find((n) =>
      (n.textContent || "").includes("Subscribe")
    );
    const form = root.querySelector("form");
    const email = root.querySelector('input[type="email"]');
    const submit = root.querySelector('input[type="submit"], button[type="submit"]');

    // All links
    const links = [...root.querySelectorAll("a")].map((a) => ({
      text: a.textContent.replace(/\s+/g, " ").trim().slice(0, 60),
      href: a.getAttribute("href"),
      name: a.getAttribute("data-framer-name"),
      box: box(a),
    }));

    // SVGs
    const svgs = [...root.querySelectorAll("svg")].map((svg, i) => {
      const r = svg.getBoundingClientRect();
      const use = svg.querySelector("use");
      return {
        i,
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
        viewBox: svg.getAttribute("viewBox"),
        useHref: use?.getAttribute("href"),
        html: svg.outerHTML.slice(0, 700),
        nearby: svg.closest("a")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 40)
          || svg.parentElement?.parentElement?.textContent?.replace(/\s+/g, " ").trim().slice(0, 40),
      };
    });

    // Images / logos
    const imgs = [...root.querySelectorAll("img")].map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      ...box(img),
      natural: { w: img.naturalWidth, h: img.naturalHeight },
    }));

    // Framer names tree (top level)
    const named = [...root.querySelectorAll("[data-framer-name]")]
      .map((el) => ({
        name: el.getAttribute("data-framer-name"),
        tag: el.tagName,
        ...box(el),
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
      }))
      .filter((n) => n.h > 10 && n.w > 10);

    // Unique named containers of interest
    const keyNames = [...new Set(named.map((n) => n.name))];

    // Form details
    const formInfo = form
      ? {
          action: form.getAttribute("action"),
          method: form.getAttribute("method"),
          ...box(form),
          html: form.outerHTML.slice(0, 800),
        }
      : null;

    const emailInfo = email
      ? {
          type: email.type,
          placeholder: email.placeholder,
          required: email.required,
          name: email.name,
          ...box(email),
          cs: {
            bg: getComputedStyle(email).backgroundColor,
            border: `${getComputedStyle(email).borderTopWidth} ${getComputedStyle(email).borderTopStyle} ${getComputedStyle(email).borderTopColor}`,
            radius: getComputedStyle(email).borderRadius,
            padding: getComputedStyle(email).padding,
            color: getComputedStyle(email).color,
            fontSize: getComputedStyle(email).fontSize,
          },
        }
      : null;

    const submitInfo = submit
      ? {
          type: submit.type,
          value: submit.value || submit.textContent,
          ...box(submit),
          cs: {
            bg: getComputedStyle(submit).backgroundColor,
            color: getComputedStyle(submit).color,
            radius: getComputedStyle(submit).borderRadius,
            padding: getComputedStyle(submit).padding,
            fontSize: getComputedStyle(submit).fontSize,
            fontWeight: getComputedStyle(submit).fontWeight,
            border: `${getComputedStyle(submit).borderTopWidth} ${getComputedStyle(submit).borderTopStyle}`,
            cursor: getComputedStyle(submit).cursor,
          },
        }
      : null;

    // Children of footer
    const children = [...root.children].map((c) => ({
      name: c.getAttribute("data-framer-name"),
      tag: c.tagName,
      cls: String(c.className).slice(0, 40),
      ...box(c),
      text: (c.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100),
    }));

    return {
      footer: box(root),
      footerPadding: getComputedStyle(root).padding,
      footerBg: getComputedStyle(root).backgroundColor,
      heading: heading ? { text: heading.textContent.trim(), tag: heading.tagName, ...box(heading) } : null,
      brandDesc: textExact("A sophisticated e-commerce template designed for modern and minimalist brands."),
      quickLinks: textExact("Quick Links"),
      followUs: textExact("Follow us:"),
      getInTouch: textExact("Get in touch"),
      emailText: textExact("test@gmail.com"),
      phone: textExact("+001 234 567 890"),
      location: textExact("London, England"),
      home: textExact("Home"),
      about: textExact("About"),
      blog: textExact("Blog"),
      shop: textExact("Shop"),
      reviews: textExact("Reviews"),
      styles: textExact("Styles"),
      formInfo,
      emailInfo,
      submitInfo,
      links,
      svgs,
      imgs,
      keyNames,
      named: named.filter((n) =>
        /newsletter|form|footer|link|social|brand|contact|subscribe|column|wrapper|desktop|tablet|phone|logo/i.test(
          n.name || ""
        )
      ).slice(0, 60),
      children,
      // copyright?
      allLeafTexts: [...root.querySelectorAll("*")]
        .filter((n) => n.children.length === 0)
        .map((n) => (n.textContent || "").replace(/\s+/g, " ").trim())
        .filter((t) => t && t.length < 100),
    };
  });

  // Screenshot
  const el = await page.$("[data-footer-root], footer");
  if (el) await el.screenshot({ path: path.join(OUT, `live-footer-${vpName}.png`) });

  // Form interaction test (desktop only)
  let formTest = null;
  if (vpName === "desktop") {
    const emailSel = 'footer input[type="email"]';
    const submitSel = 'footer input[type="submit"], footer button[type="submit"]';
    // empty submit
    await page.click(submitSel);
    await page.waitForTimeout(400);
    const afterEmpty = await page.evaluate(() => {
      const email = document.querySelector('footer input[type="email"]');
      return {
        validationMessage: email?.validationMessage,
        validity: email ? { valueMissing: email.validity.valueMissing, typeMismatch: email.validity.typeMismatch } : null,
        focused: document.activeElement === email,
      };
    });
    // invalid email
    await page.fill(emailSel, "not-an-email");
    await page.click(submitSel);
    await page.waitForTimeout(400);
    const afterInvalid = await page.evaluate(() => {
      const email = document.querySelector('footer input[type="email"]');
      return {
        validationMessage: email?.validationMessage,
        validity: email ? { valueMissing: email.validity.valueMissing, typeMismatch: email.validity.typeMismatch } : null,
      };
    });
    // valid email - see what happens
    await page.fill(emailSel, "test@example.com");
    const beforeUrl = page.url();
    await page.click(submitSel);
    await page.waitForTimeout(800);
    const afterValid = await page.evaluate(() => {
      const root = document.querySelector("footer");
      return {
        url: location.href,
        bodyText: (root?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 300),
        successLike: /thank|success|subscribed|check your/i.test(root?.textContent || ""),
      };
    });
    formTest = { afterEmpty, afterInvalid, afterValid, beforeUrl };

    // Hover tests
    const hoverBtn = await page.evaluate(() => {
      const submit = document.querySelector('footer input[type="submit"], footer button[type="submit"]');
      const s = getComputedStyle(submit);
      return { bg: s.backgroundColor, opacity: s.opacity, transform: s.transform, cursor: s.cursor };
    });
    const submitBox = await page.locator(submitSel).boundingBox();
    await page.mouse.move(submitBox.x + submitBox.width / 2, submitBox.y + submitBox.height / 2);
    await page.waitForTimeout(400);
    const hoverBtnAfter = await page.evaluate(() => {
      const submit = document.querySelector('footer input[type="submit"], footer button[type="submit"]');
      const s = getComputedStyle(submit);
      // also check parent
      const p = submit.parentElement;
      return {
        bg: s.backgroundColor,
        opacity: s.opacity,
        transform: s.transform,
        parentOpacity: p ? getComputedStyle(p).opacity : null,
        parentTransform: p ? getComputedStyle(p).transform : null,
        parentBg: p ? getComputedStyle(p).backgroundColor : null,
      };
    });

    // Link hover
    const linkHover = await page.evaluate(async () => {
      const a = [...document.querySelectorAll("footer a")].find((x) =>
        (x.textContent || "").includes("Instagram")
      );
      if (!a) return null;
      const before = {
        color: getComputedStyle(a).color,
        opacity: getComputedStyle(a).opacity,
        textDecoration: getComputedStyle(a).textDecoration,
        transform: getComputedStyle(a).transform,
      };
      a.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 300));
      const after = {
        color: getComputedStyle(a).color,
        opacity: getComputedStyle(a).opacity,
        textDecoration: getComputedStyle(a).textDecoration,
        transform: getComputedStyle(a).transform,
      };
      return { before, after };
    });

    data.interactions = { hoverBtn, hoverBtnAfter, linkHover, formTest };
  }

  await page.close();
  return data;
}

const desktop = await deep("desktop", 1440, 952);
fs.writeFileSync(path.join(OUT, "desktop.json"), JSON.stringify(desktop, null, 2));
console.log("=== DESKTOP ===");
console.log("footer", desktop.footer);
console.log("heading", desktop.heading);
console.log("brandDesc", desktop.brandDesc);
console.log("form", desktop.formInfo);
console.log("email", desktop.emailInfo);
console.log("submit", desktop.submitInfo);
console.log("children", desktop.children);
console.log("keyNames", desktop.keyNames);
console.log("links", desktop.links?.map((l) => ({ text: l.text, href: l.href, w: l.box?.w, h: l.box?.h })));
console.log("svgs", desktop.svgs?.map((s) => ({ i: s.i, w: s.w, h: s.h, use: s.useHref, near: s.nearby })));
console.log("imgs", desktop.imgs);
console.log("leaf texts", [...new Set(desktop.allLeafTexts)]);
console.log("interactions", JSON.stringify(desktop.interactions, null, 2));

const tablet = await deep("tablet", 1024, 900);
fs.writeFileSync(path.join(OUT, "tablet.json"), JSON.stringify(tablet, null, 2));
console.log("\n=== TABLET ===");
console.log("footer", tablet.footer);
console.log("heading", tablet.heading);
console.log("children", tablet.children);
console.log("email", tablet.emailInfo && { w: tablet.emailInfo.w, h: tablet.emailInfo.h });
console.log("submit", tablet.submitInfo && { w: tablet.submitInfo.w, h: tablet.submitInfo.h });

const mobile = await deep("mobile", 390, 844);
fs.writeFileSync(path.join(OUT, "mobile.json"), JSON.stringify(mobile, null, 2));
console.log("\n=== MOBILE ===");
console.log("footer", mobile.footer);
console.log("heading", mobile.heading);
console.log("children", mobile.children);
console.log("email", mobile.emailInfo && { w: mobile.emailInfo.w, h: mobile.emailInfo.h, ...mobile.emailInfo.cs });
console.log("submit", mobile.submitInfo && { w: mobile.submitInfo.w, h: mobile.submitInfo.h });
console.log("named sample", mobile.named?.slice(0, 20));

await browser.close();
