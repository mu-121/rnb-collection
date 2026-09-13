import fs from "node:fs";

const all = JSON.parse(
  fs.readFileSync("./out-product-detail/all-products.json", "utf8"),
);
const clean = all.map((p) => {
  const slug = p.path.replace("/shop/", "");
  const seen = new Set();
  const images = [];
  for (const img of p.images || []) {
    const base = img.src.split("?")[0];
    if (seen.has(base)) continue;
    if ((img.alt || "").includes("Woman in dark")) continue;
    if (img.w < 400) continue;
    seen.add(base);
    images.push(base);
  }
  return {
    slug,
    badge: p.badges?.[0] || null,
    wearLabel: p.categoryCandidates?.[0] || null,
    price: p.priceEls?.[0] || null,
    compare: p.priceEls?.[1] || null,
    material: p.material,
    care: p.care,
    warranty: p.warranty,
    orderHref: p.orderHref,
    images,
  };
});
fs.writeFileSync(
  "./out-product-detail/clean.json",
  JSON.stringify(clean, null, 2),
);
console.log(JSON.stringify(clean, null, 2));
