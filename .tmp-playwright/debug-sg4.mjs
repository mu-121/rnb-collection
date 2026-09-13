import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const origin of ["http://localhost:3000", "http://127.0.0.1:3000"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failed = [];
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  page.on("requestfailed", (r) =>
    failed.push({ url: r.url(), err: r.failure()?.errorText }),
  );
  await page.goto(origin + "/?t=" + Date.now(), {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const stage = document.querySelector(".social-gallery__stage");
    const keys = stage ? Object.getOwnPropertyNames(stage) : [];
    const reactKeys = stage
      ? Object.keys(stage).filter(
          (k) => k.includes("react") || k.includes("React") || k.startsWith("__"),
        )
      : [];
    return {
      hasDebug: typeof window.__sgDebug,
      debug: window.__sgDebug?.(),
      reactKeys,
      keySample: keys.slice(0, 20),
      scripts: [...document.scripts].map((s) => s.src).filter(Boolean).slice(0, 8),
    };
  });
  console.log("\n===", origin, "===");
  console.log(JSON.stringify({ info, failed: failed.slice(0, 10), pageErrors }, null, 2));
  await page.close();
}

await browser.close();
