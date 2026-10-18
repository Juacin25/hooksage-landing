import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Window } from "happy-dom";
import sharp from "sharp";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const html = await fs.readFile(path.join(dist, "index.html"), "utf8");
let passed = 0;
const ok = (label) => {
  passed++;
  console.log(`PASS ${label}`);
};
async function fixture(fetcher, options = {}) {
  const window = new Window({
    url: options.url || "http://localhost:4321/",
    settings: {
      enableJavaScriptEvaluation: true,
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
    },
  });
  window.dataLayer = [];
  if (options.saved)
    window.sessionStorage.setItem("hooksage:campaign", options.saved);
  if (options.blockStorage)
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("storage_disabled");
      },
    });
  window.fetch =
    fetcher ||
    (() => {
      throw new Error("Unexpected network request");
    });
  if (options.noFetch) window.fetch = undefined;
  window.document.write(html);
  for (const tag of window.document.querySelectorAll('script[type="module"]')) {
    if (tag.hasAttribute("src")) {
      const source = await fs.readFile(
        path.join(dist, tag.getAttribute("src")),
        "utf8",
      );
      window.eval(source);
    } // Inline modules are evaluated once by Happy DOM when document.write runs.
  }
  return window;
}
const w = await fixture();
const doc = w.document;
assert.equal(doc.documentElement.lang, "es-UY");
assert.equal(doc.querySelectorAll("h1").length, 1);
assert.equal(doc.querySelectorAll(".display-xl").length, 1);
assert.ok(doc.title.length <= 60);
assert.match(doc.title, /Edición de videos para startups y pymes/);
assert.equal(
  doc.querySelector("h1").textContent.trim().replace(/\s+/g, " "),
  "Más videos. Menos horas editando.",
);
assert.equal(schemaOffer(), undefined);
function schemaOffer() {
  return JSON.parse(
    doc.querySelector('script[type="application/ld+json"]').textContent,
  )["@graph"].find((item) => item["@type"] === "SoftwareApplication").offers;
}
for (const cta of doc.querySelectorAll("a[data-waitlist-cta]"))
  assert.ok(cta.getAttribute("href").includes("#empezar"));
assert.equal(doc.querySelectorAll(".showcase-card").length, 4);
assert.ok(doc.querySelector('meta[name="description"]').content.length <= 155);
assert.equal(
  doc.querySelector('link[rel="canonical"]').href,
  "https://hooksage.com/",
);
assert.equal(doc.querySelectorAll('link[rel="preload"][as="font"]').length, 2);
const schema = JSON.parse(
  doc.querySelector('script[type="application/ld+json"]').textContent,
);
const faq = schema["@graph"].find((item) => item["@type"] === "FAQPage");
assert.equal(faq.mainEntity.length, 6);
const summaries = [...doc.querySelectorAll(".faq-list summary")].map((item) =>
  item.textContent.trim(),
);
assert.deepEqual(
  faq.mainEntity.map((item) => item.name),
  summaries,
);
ok("Homepage language, headings, metadata, preloads and FAQ schema match");
const pageTitles = new Set();
const pageDescriptions = new Set();
for (const slug of [
  "startups",
  "pymes",
  "marca-personal",
  "equipos-de-marketing",
]) {
  const page = new Window();
  page.document.write(
    await fs.readFile(
      path.join(dist, `videos-para-${slug}/index.html`),
      "utf8",
    ),
  );
  assert.equal(page.document.querySelectorAll("h1").length, 1);
  assert.ok(page.document.title.length <= 60);
  const description = page.document.querySelector(
    'meta[name="description"]',
  ).content;
  assert.ok(description.length <= 155);
  pageTitles.add(page.document.title);
  pageDescriptions.add(description);
  const leadUrl = new URL(
    page.document.querySelector('a[data-cta-location="business"]').href,
    "https://hooksage.com",
  );
  assert.equal(leadUrl.searchParams.get("rubro"), slug);
  assert.equal(leadUrl.hash, "#empezar");
  for (const cta of page.document.querySelectorAll("a[data-waitlist-cta]")) {
    const target = new URL(cta.href, "https://hooksage.com");
    assert.equal(target.searchParams.get("rubro"), slug);
    assert.equal(target.hash, "#empezar");
  }
  assert.equal(
    page.document.querySelectorAll(".business-ideas .hs-feature").length,
    3,
  );
  assert.ok(
    page.document
      .querySelector('link[rel="canonical"]')
      .href.endsWith(`/videos-para-${slug}/`),
  );
  await page.happyDOM.close();
}
assert.equal(pageTitles.size, 4);
assert.equal(pageDescriptions.size, 4);
ok("Four business pages have unique metadata and relevant waitlist links");
for (const pill of doc.querySelectorAll("[data-tone]")) {
  pill.click();
  assert.equal(
    doc.querySelectorAll('[data-tone][aria-pressed="true"]').length,
    1,
  );
  assert.equal(
    doc.querySelector("[data-tone-preview] [data-sample-badge]").textContent,
    pill.dataset.tone,
  );
  assert.equal(
    doc.querySelector("#tone-sample-title").textContent,
    pill.dataset.title,
  );
  assert.equal(
    doc.querySelector("#tone-sample-description").textContent,
    pill.dataset.description,
  );
}
const productPill = [...doc.querySelectorAll("[data-tone]")].find(
  (pill) => pill.dataset.tone === "Demo de producto",
);
productPill.click();
assert.equal(
  doc.querySelector("[data-tone-preview] .media-window").dataset.mediaKind,
  "product",
);
assert.equal(
  doc.querySelector("[data-tone-preview] [data-sample-label]").textContent,
  "Captura de Drivo",
);
assert.match(doc.querySelector("[data-tone-preview] img").alt, /Drivo/);
doc.querySelector('[data-tone="Equipo"]').click();
assert.equal(
  doc.querySelector("[data-tone-preview] .media-window").dataset.mediaKind,
  "photo",
);
assert.equal(
  doc.querySelector("[data-tone-preview] [data-sample-label]").textContent,
  "Foto de referencia",
);
ok(
  "All five tone choices update preview, descriptions, media kind, labels and aria-pressed",
);
const previewPhoto = doc.querySelector(
  "[data-tone-preview] [data-sample-photo]",
);
const previewSource = doc.querySelector(
  "[data-tone-preview] [data-sample-source]",
);
assert.match(previewPhoto.srcset, /team-collaboration-360.webp/);
assert.match(previewSource.srcset, /team-collaboration-360.avif/);
assert.match(previewPhoto.alt, /referencia/);
assert.equal(doc.querySelectorAll(".media-reference").length, 9);
for (const name of [
  "founder-interview",
  "drivo-product",
  "creator-podcast",
  "product-campaign",
]) {
  for (const extension of ["avif", "webp"]) {
    await fs.access(path.join(dist, `media/${name}.${extension}`));
    await fs.access(path.join(dist, `media/${name}-360.${extension}`));
  }
}
for (const link of doc.querySelectorAll(".business-rail a")) {
  assert.ok(doc.querySelector(link.getAttribute("href")));
}
ok(
  "Reference media exists in both responsive formats, labels are visible and categories link to content",
);

const originalGalleryPhotos = new Set(
  [...doc.querySelectorAll(".showcase-card img")].map((img) =>
    img.getAttribute("src"),
  ),
);
const lowerGalleryPhotos = [
  ...doc.querySelectorAll(".examples-grid .media-card img"),
].map((img) => img.getAttribute("src"));
assert.equal(originalGalleryPhotos.size, 4);
assert.equal(new Set(lowerGalleryPhotos).size, 4);
for (const photo of lowerGalleryPhotos)
  assert.ok(!originalGalleryPhotos.has(photo));
for (const name of [
  "startup-talk",
  "business-story",
  "personal-story",
  "team-collaboration",
  "team-workspace",
]) {
  for (const ext of ["avif", "webp"])
    for (const suffix of ["", "-360"])
      await fs.access(path.join(dist, `media/${name}${suffix}.${ext}`));
}
assert.equal(doc.querySelectorAll(".workflow-steps li").length, 3);
assert.equal(doc.querySelectorAll("#como-funciona .hs-feature").length, 0);
assert.match(
  doc.querySelector(".workflow-photo figcaption").textContent,
  /Foto de referencia/,
);
ok(
  "Workflow has three editorial steps and the lower gallery uses four different photos",
);
const planText = doc.querySelector("#precio").textContent.replace(/\s+/g, " ");
assert.equal(doc.querySelectorAll(".pricing-grid .hs-price").length, 3);
for (const [name, price, quota] of [
  ["Founder", "14,97", 15],
  ["Pyme", "29,99", 40],
  ["Marca Personal", "49,99", 100],
]) {
  const card = [...doc.querySelectorAll(".pricing-grid .hs-price")].find(
    (item) => item.querySelector("h3").textContent.trim() === name,
  );
  assert.ok(card);
  assert.ok(
    card.querySelector(".hs-price__amount").textContent.includes(price),
  );
  assert.equal(
    Number(card.querySelector(".price-quota strong").textContent),
    quota,
  );
  assert.match(card.textContent, /videos exportados por semana/);
  assert.ok(
    faq.mainEntity.some((item) =>
      item.acceptedAnswer.text.includes(
        `${name}: US$${price} al mes y ${quota} videos exportados por semana`,
      ),
    ),
  );
}
assert.doesNotMatch(planText, /Plan Base|próximamente/);
assert.match(
  doc.querySelector(".reassurance").textContent,
  /Primer video gratis al registrarse/,
);
assert.doesNotMatch(
  doc.querySelector(".reassurance").textContent,
  /Uruguay|Argentina/,
);
assert.match(planText, /15 videos exportados por semana/);
assert.match(planText, /US\$\s*14,97\s*\/ mes/);
assert.doesNotMatch(
  doc.body.textContent,
  /MXN|CDMX|IVA incluido|restaurantes|taquerías/i,
);
assert.doesNotMatch(
  doc.body.textContent,
  /20 videos exportados|\b20 por semana|(?:15|20) videos (?:de 15 segundos )?al mes|0[.,]75 por video/,
);
assert.ok(
  faq.mainEntity.some(
    (item) =>
      /15 videos exportados por semana/.test(item.acceptedAnswer.text) &&
      /US\$14,97 al mes/.test(item.acceptedAnswer.text),
  ),
);
ok(
  "The base plan states weekly exports while keeping the monthly billing price",
);

const fallback = await fixture(undefined, { noFetch: true });
const fallbackForm = fallback.document.querySelector("form");
assert.equal(fallbackForm.getAttribute("action"), "/api/waitlist");
assert.equal(fallbackForm.method, "post");
assert.equal(fallbackForm.noValidate, false);
assert.equal(fallbackForm.querySelector('[name="intent"]').value, "waitlist");
assert.equal(fallbackForm.querySelector('[name="landing_path"]').value, "/");
assert.equal(doc.querySelector("form").noValidate, true);
assert.equal(doc.querySelector("form").dataset.endpoint, "/api/waitlist");
assert.doesNotMatch(html, /hooksage-landing--[^\s"<>]+\.tenki\.sh/);
await fallback.happyDOM.close();
ok(
  "Production keeps the same-origin API and native POST remains available without fetch",
);

const submit = (win) =>
  win.document
    .querySelector("form")
    .dispatchEvent(
      new win.Event("submit", { bubbles: true, cancelable: true }),
    );
const fill = (win) => {
  win.document.querySelector("#business-name").value = "  Startup de prueba  ";
  win.document.querySelector("#business-type").value = "Startup";
  win.document.querySelector("#contact-name").value = "  Persona de prueba  ";
  win.document.querySelector("#email").value = "ejemplo@example.test";
  win.document.querySelector("#city").value = "  Montevideo  ";
  win.document.querySelector("#whatsapp").value = "+598 99 123 456";
  win.document.querySelector("#country").value = "UY";
};
submit(w);
assert.equal(doc.querySelectorAll('[aria-invalid="true"]').length, 6);
assert.equal(
  doc.querySelectorAll("form input:not(#website):not([type=hidden])").length,
  5,
);
assert.equal(doc.querySelectorAll("form select").length, 2);
fill(w);
doc.querySelector("#email").value = "correo-incompleto";
submit(w);
assert.equal(doc.querySelector("#email").getAttribute("aria-invalid"), "true");
assert.equal(doc.activeElement.id, "email");
fill(w);
doc.querySelector("form").dataset.endpoint = "";
submit(w);
assert.match(
  doc.querySelector("#form-status").textContent,
  /aún no está disponible/,
);
assert.equal(doc.querySelector("#form-success").hidden, true);
ok(
  "Contact, email and city validation plus missing endpoint never produce false success",
);
let payload;
let release;
let requests = 0;
const success = await fixture(
  async (url, options) => {
    assert.equal(url, "https://forms.example.test/submit");
    requests++;
    payload = JSON.parse(options.body);
    return await new Promise((resolve) => {
      release = resolve;
    });
  },
  {
    url: "http://localhost:4321/?utm_source=instagram&utm_medium=paid_social&utm_campaign=rioplatense_waitlist&utm_content=founder_reel",
  },
);
const successForm = success.document.querySelector("form");
successForm.dataset.endpoint = "https://forms.example.test/submit";
fill(success);
submit(success);
submit(success);
assert.equal(requests, 1);
assert.equal(
  success.document.querySelector('button[type="submit"]').disabled,
  true,
);
assert.equal(
  success.dataLayer.filter((item) => item.event === "generate_lead").length,
  0,
);
release({ ok: true, json: async () => ({ ok: true, created: true }) });
await new Promise((resolve) => setTimeout(resolve, 5));
assert.deepEqual(payload, {
  businessName: "Startup de prueba",
  businessType: "Startup",
  contactName: "Persona de prueba",
  email: "ejemplo@example.test",
  city: "Montevideo",
  intent: "waitlist",
  website: "",
  attribution: {
    landing_path: "/",
    utm_source: "instagram",
    utm_medium: "paid_social",
    utm_campaign: "rioplatense_waitlist",
    utm_content: "founder_reel",
  },
  whatsapp: "+59899123456",
  neighborhood: "",
  country: "UY",
});
assert.equal(successForm.hidden, true);
assert.equal(success.document.querySelector("#form-success").hidden, false);
submit(success);
assert.equal(requests, 1);
assert.equal(
  success.dataLayer.filter((item) => item.event === "generate_lead").length,
  1,
);
assert.ok(!JSON.stringify(success.dataLayer).includes("ejemplo@example.test"));
assert.ok(!JSON.stringify(success.dataLayer).includes("Startup de prueba"));
assert.ok(!JSON.stringify(success.dataLayer).includes("Persona de prueba"));
assert.ok(!JSON.stringify(success.dataLayer).includes("59899123456"));
assert.equal(
  success.document.querySelector("#success-contact").href,
  "mailto:hooksage.app@gmail.com",
);
ok(
  "Successful submission normalizes data, prevents duplicates and offers email contact",
);
for (const result of [{ ok: true, created: false }, { ok: false }]) {
  const confirmation = await fixture(async () => ({
    ok: true,
    json: async () => result,
  }));
  fill(confirmation);
  submit(confirmation);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(
    confirmation.document.querySelector("#form-success").hidden,
    result.ok !== true,
  );
  assert.equal(
    confirmation.dataLayer.filter((event) => event.event === "generate_lead")
      .length,
    0,
  );
  await confirmation.happyDOM.close();
}
ok("Duplicate or invalid confirmations never count a new lead");
for (const [country, phone, expected] of [
  ["UY", "", ""],
  ["AR", "+54 9 11 1234 5678", "+5491112345678"],
]) {
  let submitted;
  const regional = await fixture(async (_, options) => {
    submitted = JSON.parse(options.body);
    return { ok: true, json: async () => ({ ok: true, created: true }) };
  });
  fill(regional);
  regional.document.querySelector("#country").value = country;
  regional.document.querySelector("#whatsapp").value = phone;
  submit(regional);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(submitted.country, country);
  assert.equal(submitted.whatsapp, expected);
  assert.equal(regional.document.querySelector("#form-success").hidden, false);
  await regional.happyDOM.close();
}
ok(
  "Country selection supports an optional phone and normalizes Argentine mobiles",
);
const failed = await fixture(async () => ({ ok: false }));
failed.document.querySelector("form").dataset.endpoint =
  "https://forms.example.test/submit";
fill(failed);
submit(failed);
await new Promise((resolve) => setTimeout(resolve, 5));
assert.match(
  failed.document.querySelector("#form-status").textContent,
  /No pudimos enviar/,
);
assert.equal(failed.document.querySelector("#form-success").hidden, true);
assert.equal(
  failed.document.querySelector('button[type="submit"]').disabled,
  false,
);
assert.match(
  failed.document.querySelector("#business-name").value,
  /Startup de prueba/,
);
assert.equal(
  failed.dataLayer.filter((item) => item.event === "generate_lead").length,
  0,
);
assert.ok(
  failed.dataLayer.some(
    (item) =>
      item.event === "waitlist_form_error" &&
      item.error_type === "request_failed",
  ),
);
assert.equal(
  w.dataLayer.filter((item) => item.event === "generate_lead").length,
  0,
);
ok(
  "Failed or unconfigured submissions never emit conversions and preserve data",
);
const cta = doc.querySelector('a[data-cta-location="hero"]');
cta.addEventListener("click", (event) => event.preventDefault());
cta.dispatchEvent(
  new w.MouseEvent("click", { bubbles: true, cancelable: true }),
);
assert.ok(
  w.dataLayer.some(
    (item) =>
      item.event === "waitlist_cta_click" && item.cta_location === "hero",
  ),
);
for (let i = 0; i < 2; i++)
  doc
    .querySelector("#business-name")
    .dispatchEvent(new w.Event("input", { bubbles: true }));
assert.equal(
  w.dataLayer.filter((item) => item.event === "waitlist_form_start").length,
  1,
);
ok(
  "CTA placement and one form-start per page are measurable without user values",
);
const campaignWindow = await fixture(undefined, {
  url: "http://localhost:4321/videos-para-equipos-de-marketing/?utm_source=tiktok&utm_medium=paid_social&utm_campaign=rioplatense_waitlist&utm_content=equipo_proceso",
});
const saved = campaignWindow.sessionStorage.getItem("hooksage:campaign");
const destination = await fixture(undefined, {
  url: "http://localhost:4321/?rubro=equipos-de-marketing#empezar",
  saved,
});
assert.deepEqual(
  JSON.parse(JSON.stringify(destination.HooksageFunnel.getAttribution())),
  {
    landing_path: "/videos-para-equipos-de-marketing/",
    utm_source: "tiktok",
    utm_medium: "paid_social",
    utm_campaign: "rioplatense_waitlist",
    utm_content: "equipo_proceso",
  },
);
assert.equal(
  destination.document.querySelector("#business-type").value,
  "Equipo de marketing",
);
const expired = await fixture(undefined, {
  saved: JSON.stringify({
    landing_path: "/videos-para-equipos-de-marketing/",
    utm_source: "tiktok",
    captured_at: Date.now() - 31 * 60 * 1000,
  }),
});
assert.deepEqual(
  JSON.parse(JSON.stringify(expired.HooksageFunnel.getAttribution())),
  { landing_path: "/" },
);
const hostile = await fixture(undefined, {
  url: "http://localhost:4321/?rubro=__proto__&utm_source=persona%40example.com&utm_campaign=%3Cscript%3E&gclid=ignored&fbclid=ignored",
});
assert.deepEqual(
  JSON.parse(JSON.stringify(hostile.HooksageFunnel.getAttribution())),
  { landing_path: "/" },
);
assert.equal(hostile.document.querySelector("#business-type").value, "");
const noStorage = await fixture(
  async () => ({ ok: true, json: async () => ({ ok: true, created: true }) }),
  {
    blockStorage: true,
    url: "http://localhost:4321/?utm_source=facebook&utm_medium=paid_social",
  },
);
const localEvents = [];
noStorage.addEventListener("hooksage:funnel", (event) =>
  localEvents.push(event.detail),
);
Object.freeze(noStorage.dataLayer);
noStorage.document.querySelector("form").dataset.endpoint =
  "https://forms.example.test/submit";
fill(noStorage);
submit(noStorage);
await new Promise((resolve) => setTimeout(resolve, 5));
assert.equal(noStorage.document.querySelector("#form-success").hidden, false);
assert.equal(
  localEvents.filter((item) => item.event === "generate_lead").length,
  1,
);
ok(
  "Campaign attribution survives navigation, expires, rejects unsafe labels and tolerates blocked storage",
);
for (const item of [campaignWindow, destination, expired, hostile, noStorage])
  await item.happyDOM.close();
for (const [name, width, height] of [
  ["og.png", 1200, 630],
  ["apple-touch-icon.png", 180, 180],
]) {
  const metadata = await sharp(path.join(dist, name)).metadata();
  assert.equal(metadata.width, width);
  assert.equal(metadata.height, height);
}
assert.match(
  await fs.readFile(path.join(dist, "robots.txt"), "utf8"),
  /sitemap.xml/,
);
const sitemap = await fs.readFile(path.join(dist, "sitemap-0.xml"), "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, 5);
ok("OG, touch icon, robots and all five sitemap URLs exist");
for (const item of [w, success, failed]) await item.happyDOM.close();
console.log(
  `${passed} verification groups passed. No external requests were sent.`,
);
