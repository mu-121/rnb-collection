import { chromium, devices } from "./package/index.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = path.resolve(__dirname, "out-social-gallery");
fs.mkdirSync(OUT, { recursive: true });

const WIDTHS = [
  320, 375, 390, 414, 480, 540, 768, 810, 834, 912, 1024, 1200, 1280, 1366,
  1440, 1600, 1920,
];

async function measure(page, label) {
  return page.evaluate((lbl) => {
    const section = document.querySelector(".social-gallery");
    const stage = document.querySelector(".social-gallery__stage");
    const heading = document.querySelector(".social-gallery__heading");
    const body = document.querySelector(".social-gallery__body");
    const actions = document.querySelector(".social-gallery__actions");
    const carousel = document.querySelector(".social-gallery__carousel");
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    const overflowX = docW > winW + 1;
    const scale = carousel
      ? getComputedStyle(carousel).getPropertyValue("--sg-scale").trim()
      : null;
    const rot = stage?.style.transform || "";
    const rotMatch = /rotateY\((-?\d+(?:\.\d+)?)deg\)/.exec(rot);
    return {
      label: lbl,
      overflowX,
      docW,
      winW,
      scale,
      rotation: rotMatch ? Number(rotMatch[1]) : null,
      headingOverflow: heading
        ? heading.scrollWidth > heading.clientWidth + 2
        : null,
      bodyOverflow: body ? body.scrollWidth > body.clientWidth + 2 : null,
      actionsH: actions?.getBoundingClientRect().height ?? null,
      carouselH: carousel?.getBoundingClientRect().height ?? null,
      sectionInView:
        !!section &&
        section.getBoundingClientRect().top < window.innerHeight &&
        section.getBoundingClientRect().bottom > 0,
    };
  }, label);
}

async function sampleRotation(page, samples = 8, delay = 80) {
  const values = [];
  for (let i = 0; i < samples; i++) {
    const r = await page.evaluate(() => {
      const stage = document.querySelector(".social-gallery__stage");
      const rot = stage?.style.transform || "";
      const m = /rotateY\((-?\d+(?:\.\d+)?)deg\)/.exec(rot);
      return m ? Number(m[1]) : null;
    });
    values.push(r);
    await page.waitForTimeout(delay);
  }
  return values;
}

async function main() {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const report = {
    base: BASE,
    widths: {},
    autoRotation: null,
    drag: null,
    inertia: null,
    pauseWhileInteracting: null,
    resumeAfter: null,
    intersectionObserver: null,
    reducedMotion: null,
    consoleErrors: [],
    pages: {},
  };

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => report.consoleErrors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") report.consoleErrors.push(msg.text());
    });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
    await page.locator(".social-gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.locator(".social-gallery").scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const m = await measure(page, String(w));
      report.widths[w] = m;
      await page.screenshot({
        path: path.join(OUT, `home-sg-${w}.png`),
        fullPage: false,
      });
    }
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
    await page.locator(".social-gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const before = await sampleRotation(page, 10, 100);
    const deltas = [];
    for (let i = 1; i < before.length; i++) {
      if (before[i] != null && before[i - 1] != null) {
        deltas.push(before[i] - before[i - 1]);
      }
    }
    const avgDelta =
      deltas.reduce((a, b) => a + b, 0) / Math.max(deltas.length, 1);
    report.autoRotation = {
      samples: before,
      avgDeltaPer100ms: avgDelta,
      pass: avgDelta > 0.2 && avgDelta < 3,
    };

    const hit = page.locator(".social-gallery__hit");
    const box = await hit.boundingBox();
    const r0 = before[before.length - 1];
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(400);
    const duringDrag = await sampleRotation(page, 5, 80);
    const dragStill = duringDrag.every(
      (v) => v != null && Math.abs(v - duringDrag[0]) < 0.05,
    );
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, {
      steps: 8,
    });
    const afterMove = await page.evaluate(() => {
      const stage = document.querySelector(".social-gallery__stage");
      const rot = stage?.style.transform || "";
      const m = /rotateY\((-?\d+(?:\.\d+)?)deg\)/.exec(rot);
      return m ? Number(m[1]) : null;
    });
    report.drag = {
      start: r0,
      afterMove,
      moved: afterMove != null && Math.abs(afterMove - r0) > 5,
      pauseWhileHeldStill: dragStill,
    };
    report.pauseWhileInteracting = {
      pass: dragStill === true,
      samples: duringDrag,
    };

    await page.mouse.up();
    // Leave hover zone so resume uses full auto speed.
    await page.mouse.move(10, 10);
    await page.waitForTimeout(200);
    const coastSamples = await sampleRotation(page, 12, 60);
    let coasting = false;
    for (let i = 1; i < coastSamples.length; i++) {
      const d = coastSamples[i] - coastSamples[i - 1];
      if (Math.abs(d) > 0.5) coasting = true;
    }
    await page.waitForTimeout(900);
    const resumeSamples = await sampleRotation(page, 8, 100);
    const resumeDeltas = [];
    for (let i = 1; i < resumeSamples.length; i++) {
      resumeDeltas.push(resumeSamples[i] - resumeSamples[i - 1]);
    }
    const resumeAvg =
      resumeDeltas.reduce((a, b) => a + b, 0) / Math.max(resumeDeltas.length, 1);
    report.inertia = { samples: coastSamples, pass: coasting || resumeAvg > 0 };
    report.resumeAfter = {
      resumeAvgPer100ms: resumeAvg,
      samples: resumeSamples,
      pass: resumeAvg > 0.2,
    };

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const off = await sampleRotation(page, 6, 100);
    const offStill = off.every((v) => Math.abs(v - off[0]) < 0.05);
    await page.locator(".social-gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const back = await sampleRotation(page, 6, 100);
    const backMoving = back[back.length - 1] - back[0] > 0.3;
    report.intersectionObserver = {
      pausedOffscreen: offStill,
      resumedOnscreen: backMoving,
      pass: offStill && backMoving,
    };

    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
    await page.locator(".social-gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const samples = await sampleRotation(page, 8, 100);
    const still = samples.every((v) => Math.abs(v - samples[0]) < 0.05);
    const hit = page.locator(".social-gallery__hit");
    const box = await hit.boundingBox();
    const before = samples[0];
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2, {
      steps: 6,
    });
    await page.mouse.up();
    const after = await page.evaluate(() => {
      const stage = document.querySelector(".social-gallery__stage");
      const rot = stage?.style.transform || "";
      const m = /rotateY\((-?\d+(?:\.\d+)?)deg\)/.exec(rot);
      return m ? Number(m[1]) : null;
    });
    report.reducedMotion = {
      autoDisabled: still,
      dragWorks: after != null && Math.abs(after - before) > 3,
      pass: still && after != null && Math.abs(after - before) > 3,
    };
    await context.close();
  }

  for (const route of ["/", "/about", "/shop", "/blog"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    const res = await page.goto(`${BASE}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.locator(".social-gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const moving = await sampleRotation(page, 5, 100);
    const delta = moving[moving.length - 1] - moving[0];
    report.pages[route] = {
      status: res?.status() ?? null,
      hasGallery: await page.locator(".social-gallery").count(),
      autoMoving: delta > 0.2,
      errors,
    };
    await context.close();
  }

  {
    const context = await browser.newContext({
      ...devices["iPhone 12"],
    });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
    await page.locator(".social-gallery").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    report.touch = await measure(page, "iphone12");
    await context.close();
  }

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
