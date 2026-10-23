import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Window } from "happy-dom";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spanish = await fs.readFile(path.join(root, "dist/index.html"), "utf8");
const english = await fs.readFile(
  path.join(root, "dist/en/index.html"),
  "utf8",
);
const storageKey = "hooksage:privacy-choice";
const campaignKey = "hooksage:campaign";
const maxAge = 180 * 24 * 60 * 60 * 1000;
const windows = [];
const saved = (choice = "accepted", savedAt = Date.now(), version = 1) =>
  JSON.stringify({ version, choice, savedAt });

function fixture(options = {}) {
  const window = new Window({
    url:
      options.url || "https://hooksage.com" + (options.english ? "/en/" : "/"),
    settings: {
      enableJavaScriptEvaluation: true,
      // All evaluated markup is the trusted local build; remote scripts stay disabled.
      suppressInsecureJavaScriptEnvironmentWarning: true,
      disableCSSFileLoading: true,
      // Tests never fetch or run Meta's script, nor any bundled app JavaScript.
      disableJavaScriptFileLoading: true,
    },
  });
  windows.push(window);
  window.fetch = () => {
    throw new Error("Consent tests must not make network requests");
  };
  window.dataLayer = [];
  const session = window.sessionStorage;
  if (options.campaignSaved !== undefined)
    session.setItem(campaignKey, options.campaignSaved);
  const sessionOperations = [];
  Object.defineProperty(window, "sessionStorage", {
    value: new Proxy(session, {
      get(target, property) {
        if (["getItem", "setItem", "removeItem"].includes(property))
          return (...args) => {
            sessionOperations.push({ method: property, key: args[0] });
            return target[property](...args);
          };
        return Reflect.get(target, property);
      },
    }),
  });
  if (options.saved !== undefined)
    window.localStorage.setItem(storageKey, options.saved);
  if (options.gpc)
    Object.defineProperty(window.navigator, "globalPrivacyControl", {
      value: true,
    });
  if (options.dnt)
    Object.defineProperty(window.navigator, "doNotTrack", { value: "1" });
  if (options.blockStorage)
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("storage_disabled");
      },
    });
  let markup = options.english ? english : spanish;
  if (options.disabled)
    markup = markup.replace('data-enabled="true"', 'data-enabled="false"');
  window.document.write(markup);
  assert.ok(
    window.HooksageConsent,
    "The consent component was rendered and ran",
  );
  const panel = window.document.querySelector("#cookie-consent");
  const button = window.document.createElement("button");
  button.dataset.cookieSettings = "";
  window.document.body.appendChild(button);
  const click = (selector) => panel.querySelector(selector).click();
  const emitLead = () =>
    window.dispatchEvent(
      new window.CustomEvent("hooksage:funnel", {
        detail: {
          event: "generate_lead",
          // The provider must ignore arbitrary properties on internal events.
          email: "never-send@example.com",
          footageUrl: "https://example.com/private-clip",
        },
      }),
    );
  const commands = () =>
    Array.from(window.fbq?.queue || [], (command) => Array.from(command));
  return {
    window,
    panel,
    click,
    emitLead,
    commands,
    sessionOperations,
    campaignStorage: () => session.getItem(campaignKey),
    settings: () => button.click(),
    scripts: () =>
      window.document.querySelectorAll("script[data-hooksage-pixel]").length,
  };
}

try {
  const first = fixture();
  assert.equal(first.panel.hidden, false);
  assert.equal(first.window.HooksageConsent.allowsMarketing(), false);
  assert.equal(first.scripts(), 0);
  assert.equal(first.window.fbq, undefined);
  assert.equal(first.window.dataLayer.length, 0);
  assert.equal(
    first.window.document.querySelectorAll(
      'img[src*="facebook.com"], script[src*="facebook.net"]',
    ).length,
    0,
  );
  assert.equal(
    first.panel.querySelector("[data-cookie-accept]").className,
    first.panel.querySelector("[data-cookie-reject]").className,
    "Accept and reject have the same visual treatment",
  );
  assert.equal(first.panel.querySelector("a").pathname, "/privacidad/");
  first.emitLead();
  assert.equal(first.window.fbq, undefined);
  first.click("[data-cookie-reject]");
  assert.equal(first.panel.hidden, true);
  const rejected = JSON.parse(first.window.localStorage.getItem(storageKey));
  assert.deepEqual(Object.keys(rejected).sort(), [
    "choice",
    "savedAt",
    "version",
  ]);
  assert.equal(rejected.choice, "rejected");
  assert.equal(first.scripts(), 0);
  first.settings();
  assert.equal(first.panel.hidden, false);
  assert.equal(first.panel.querySelector("[data-cookie-close]").hidden, false);
  first.click("[data-cookie-close]");
  assert.equal(first.panel.hidden, true);
  console.log(
    "PASS Default and rejection send no Meta requests or dataLayer events",
  );

  first.settings();
  first.click("[data-cookie-accept]");
  assert.equal(first.window.HooksageConsent.allowsMarketing(), true);
  assert.equal(first.scripts(), 1);
  assert.deepEqual(first.commands(), [
    ["set", "autoConfig", false, "1119851420489248"],
    ["consent", "grant"],
    ["init", "1119851420489248"],
    ["track", "PageView"],
  ]);
  first.emitLead();
  assert.deepEqual(first.commands().at(-1), ["track", "Lead"]);
  first.window.HooksageFunnel.track("waitlist_cta_click", {
    cta_location: "hero",
  });
  assert.equal(first.window.dataLayer.length, 1);
  assert.equal(first.window.dataLayer[0].event, "waitlist_cta_click");
  assert.doesNotMatch(
    JSON.stringify(first.commands()),
    /never-send|private-clip/,
  );
  first.settings();
  first.click("[data-cookie-accept]");
  assert.equal(first.scripts(), 1);
  assert.equal(
    first.commands().filter((command) => command[1] === "PageView").length,
    1,
  );
  console.log(
    "PASS Explicit acceptance loads one pixel and sends only allowed event arguments",
  );

  const name = first.window.document.querySelector("#contact-name");
  name.value = "Unsubmitted name";
  first.window.document.cookie = "_fbp=example; path=/; domain=.hooksage.com";
  first.window.document.cookie = "_fbc=example; path=/";
  first.window.document.cookie = "keep=essential; path=/";
  first.settings();
  first.click("[data-cookie-reject]");
  assert.equal(first.window.HooksageConsent.allowsMarketing(), false);
  assert.deepEqual(first.commands().at(-1), ["consent", "revoke"]);
  assert.equal(
    first.commands().some((command) => command[0] === "track"),
    false,
    "Revoking also drops events queued while the provider was loading",
  );
  assert.doesNotMatch(first.window.document.cookie, /_fbp|_fbc/);
  assert.match(first.window.document.cookie, /keep=essential/);
  const afterRevoke = first.commands().length;
  first.emitLead();
  first.window.HooksageFunnel.track("generate_lead");
  assert.equal(first.commands().length, afterRevoke);
  assert.equal(first.window.dataLayer.length, 1);
  assert.equal(name.value, "Unsubmitted name");
  console.log(
    "PASS Revoking stops future events, clears Meta cookies and preserves form data",
  );

  const campaignUrl =
    "https://hooksage.com/videos-para-pymes/?utm_source=instagram&utm_medium=paid_social&utm_campaign=trial";
  const staleCampaign = JSON.stringify({
    landing_path: "/videos-para-startups/",
    utm_source: "stale_campaign",
    captured_at: Date.now(),
  });
  const attribution = (fixture) =>
    JSON.parse(JSON.stringify(fixture.window.HooksageFunnel.getAttribution()));
  const awaiting = fixture({
    url: campaignUrl,
    campaignSaved: staleCampaign,
  });
  for (const unconsented of [
    awaiting,
    fixture({
      url: campaignUrl,
      saved: saved("rejected"),
      campaignSaved: staleCampaign,
    }),
    fixture({
      url: campaignUrl,
      saved: saved(),
      gpc: true,
      campaignSaved: staleCampaign,
    }),
    fixture({
      url: campaignUrl,
      saved: saved(),
      disabled: true,
      campaignSaved: staleCampaign,
    }),
  ]) {
    assert.deepEqual(attribution(unconsented), {
      landing_path: "/videos-para-pymes/",
    });
    assert.equal(unconsented.campaignStorage(), null);
    assert.equal(
      unconsented.sessionOperations.some(
        (operation) =>
          operation.key === campaignKey &&
          ["getItem", "setItem"].includes(operation.method),
      ),
      false,
      "Optional campaign storage must not be read or written without permission",
    );
  }
  awaiting.click("[data-cookie-accept]");
  assert.deepEqual(attribution(awaiting), {
    landing_path: "/videos-para-pymes/",
    utm_source: "instagram",
    utm_medium: "paid_social",
    utm_campaign: "trial",
  });
  const activeCampaign = JSON.parse(awaiting.campaignStorage());
  assert.equal(activeCampaign.utm_source, "instagram");
  assert.ok(Date.now() - activeCampaign.captured_at < 1000);
  awaiting.window.document.querySelector("#contact-name").value =
    "Keep my unsubmitted form";
  awaiting.settings();
  awaiting.click("[data-cookie-reject]");
  assert.equal(
    awaiting.campaignStorage(),
    null,
    "Rejection clears attribution immediately through the consent event",
  );
  assert.deepEqual(attribution(awaiting), {
    landing_path: "/videos-para-pymes/",
  });
  assert.equal(
    awaiting.window.document.querySelector("#contact-name").value,
    "Keep my unsubmitted form",
  );
  const crossTabCampaign = fixture({
    url: campaignUrl,
    saved: saved(),
  });
  assert.ok(crossTabCampaign.campaignStorage());
  crossTabCampaign.window.localStorage.setItem(storageKey, saved("rejected"));
  crossTabCampaign.window.dispatchEvent(
    new crossTabCampaign.window.StorageEvent("storage", { key: storageKey }),
  );
  assert.equal(crossTabCampaign.campaignStorage(), null);
  assert.deepEqual(attribution(crossTabCampaign), {
    landing_path: "/videos-para-pymes/",
  });
  const apiDenied = fixture({ url: campaignUrl, saved: saved() });
  assert.ok(apiDenied.campaignStorage());
  apiDenied.window.HooksageConsent = { allowsMarketing: () => false };
  assert.deepEqual(attribution(apiDenied), {
    landing_path: "/videos-para-pymes/",
  });
  assert.equal(apiDenied.campaignStorage(), null);
  console.log(
    "PASS Campaign attribution starts only after permission and clears on rejection, cross-tab or denied API",
  );

  const returning = fixture({ saved: saved() });
  assert.equal(returning.panel.hidden, true);
  assert.equal(returning.scripts(), 1);
  assert.equal(returning.window.HooksageConsent.allowsMarketing(), true);
  const optedOut = fixture({ saved: saved("rejected") });
  assert.equal(optedOut.panel.hidden, true);
  assert.equal(optedOut.scripts(), 0);
  for (const bad of [
    saved("accepted", Date.now() - maxAge - 1000),
    saved("accepted", Date.now() + 60_000),
    saved("accepted", Date.now(), 0),
    '{"choice":"accepted"}',
    "not json",
  ]) {
    const invalid = fixture({ saved: bad });
    assert.equal(invalid.panel.hidden, false);
    assert.equal(invalid.scripts(), 0);
    assert.equal(invalid.window.HooksageConsent.allowsMarketing(), false);
  }
  console.log(
    "PASS Saved choices work and expired, future or invalid choices never authorize tracking",
  );

  const gpc = fixture({ saved: saved(), gpc: true });
  assert.equal(gpc.scripts(), 0);
  assert.equal(gpc.window.HooksageConsent.allowsMarketing(), false);
  gpc.settings();
  assert.equal(gpc.panel.querySelector("[data-cookie-accept]").disabled, true);
  assert.match(gpc.panel.textContent, /Global Privacy Control/);
  const dnt = fixture({ dnt: true });
  assert.equal(dnt.scripts(), 0);
  assert.equal(dnt.window.HooksageConsent.allowsMarketing(), false);
  assert.equal(dnt.panel.querySelector("[data-cookie-signal]").hidden, false);
  dnt.click("[data-cookie-accept]");
  assert.equal(dnt.scripts(), 1);
  const privateStorage = fixture({ blockStorage: true });
  assert.equal(privateStorage.scripts(), 0);
  privateStorage.click("[data-cookie-accept]");
  assert.equal(privateStorage.scripts(), 1);
  privateStorage.settings();
  privateStorage.click("[data-cookie-reject]");
  assert.equal(privateStorage.window.HooksageConsent.allowsMarketing(), false);
  console.log(
    "PASS GPC overrides acceptance, DNT defaults off and unavailable storage stays usable",
  );

  returning.window.localStorage.setItem(storageKey, saved("rejected"));
  returning.window.dispatchEvent(
    new returning.window.StorageEvent("storage", { key: storageKey }),
  );
  assert.equal(returning.window.HooksageConsent.allowsMarketing(), false);
  assert.deepEqual(returning.commands().at(-1), ["consent", "revoke"]);
  const disabled = fixture({ saved: saved(), disabled: true });
  assert.equal(disabled.panel.hidden, true);
  assert.equal(disabled.scripts(), 0);
  disabled.emitLead();
  assert.equal(disabled.window.fbq, undefined);
  disabled.settings();
  assert.equal(disabled.panel.hidden, false);
  assert.equal(
    disabled.panel.querySelector("[data-cookie-accept]").hidden,
    true,
  );
  assert.match(disabled.panel.textContent, /deshabilitada/);
  console.log(
    "PASS Cross-tab rejection revokes and disabled builds never activate the provider",
  );

  const en = fixture({ english: true });
  assert.equal(en.panel.querySelector("a").pathname, "/en/privacy/");
  assert.equal(en.panel.querySelector("h2").textContent, "Optional cookies");
  assert.equal(
    en.panel.querySelector("[data-cookie-reject]").textContent.trim(),
    "Reject",
  );
  assert.doesNotMatch(spanish, /<noscript>\s*<img[^>]+facebook/s);
  console.log(
    "PASS English controls link to privacy and no noscript tracking beacon remains",
  );
} finally {
  await Promise.all(windows.map((window) => window.happyDOM.close()));
}
