import { chromium } from "./package/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const s = await page.evaluate(() => {
  const chip = document.querySelector(".about-hero__chip");
  const pill = document.querySelector(".about-hero__chip-pill");
  const glass = document.querySelector(".about-hero__btn--glass");
  const solid = document.querySelector(".about-hero__btn--solid");
  const stars = document.querySelector(".about-trust__stars");
  const cs = getComputedStyle;
  return {
    chip: {
      bg: cs(chip).backgroundColor,
      radius: cs(chip).borderRadius,
      pad: cs(chip).padding,
      gap: cs(chip).gap,
      w: chip.getBoundingClientRect().width,
    },
    pill: {
      bg: cs(pill).backgroundColor,
      color: cs(pill).color,
      text: pill.textContent,
    },
    solid: { bg: cs(solid).backgroundColor, color: cs(solid).color },
    glass: { bg: cs(glass).backgroundColor, color: cs(glass).color },
    stars: cs(stars).color,
    avatars: document.querySelectorAll(".about-trust__avatar").length,
    rating: document.querySelector(".about-trust__rating")?.textContent,
  };
});
console.log(JSON.stringify({ s, errors }, null, 2));
await browser.close();
