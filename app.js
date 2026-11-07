import init, { analyze, apply_recovery, compare_reports } from "./pkg/roadlint_wasm.js";

const example = {
  feed_info: {
    update_date: "2020-06-18T15:00:00Z",
    publisher: "RoadLint local example",
    version: "4.2",
    data_sources: [{ data_source_id: "local", organization_name: "RoadLint" }],
  },
  type: "FeatureCollection",
  features: [],
};

const input = document.querySelector("#input-json");
const version = document.querySelector("#version");
const fileInput = document.querySelector("#file-input");
const fileName = document.querySelector("#file-name");
const feedUrl = document.querySelector("#feed-url");
const loadUrlButton = document.querySelector("#load-url");
const feedUrlLabel = document.querySelector("#feed-url-label");
const feedUrlHelp = document.querySelector("#feed-url-help");
const resultPanel = document.querySelector("#result-panel");
const statusBadge = document.querySelector("#status-badge");
const summary = document.querySelector("#summary");
const reportContext = document.querySelector("#report-context");
const ruleResults = document.querySelector("#rule-results");
const coverageLimitNote = document.querySelector("#coverage-limit-note");
const loadMoreRules = document.querySelector("#load-more-rules");
const ruleCount = document.querySelector("#rule-count");
const diagnostics = document.querySelector("#diagnostics");
const diagnosticCount = document.querySelector("#diagnostic-count");
const diagnosticFilter = document.querySelector("#diagnostic-filter");
const diagnosticSearch = document.querySelector("#diagnostic-search");
const diagnosticLimitNote = document.querySelector("#diagnostic-limit-note");
const loadMoreDiagnostics = document.querySelector("#load-more-diagnostics");
const measurements = document.querySelector("#measurements");
const measurementCount = document.querySelector("#measurement-count");
const runtimeNote = document.querySelector("#runtime-note");
const inputHelp = document.querySelector("#input-help");
const compareStatus = document.querySelector("#compare-status");
const baselineReportFile = document.querySelector("#baseline-report-file");
const currentReportFile = document.querySelector("#current-report-file");
const baselineReportName = document.querySelector("#baseline-report-name");
const currentReportName = document.querySelector("#current-report-name");
const compareReportsButton = document.querySelector("#compare-reports");
const downloadDiffButton = document.querySelector("#download-diff");
const compareHelp = document.querySelector("#compare-help");
const diffResult = document.querySelector("#diff-result");
const timingNote = document.querySelector("#timing-note");
const diffSummary = document.querySelector("#diff-summary");
const diffContext = document.querySelector("#diff-context");
const diffLifecycle = document.querySelector("#diff-lifecycle");
const diffLifecycleCount = document.querySelector("#diff-lifecycle-count");
const diffStateFilter = document.querySelector("#diff-state-filter");
const diffSearch = document.querySelector("#diff-search");
const diffLimitNote = document.querySelector("#diff-limit-note");
const loadMoreDiff = document.querySelector("#load-more-diff");
const diffRuleChanges = document.querySelector("#diff-rule-changes");
const diffRuleCount = document.querySelector("#diff-rule-count");
const recoveryProfileFile = document.querySelector("#recovery-profile-file");
const recoveryProfileName = document.querySelector("#recovery-profile-name");
const allowLossy = document.querySelector("#allow-lossy");
const applyRecoveryButton = document.querySelector("#apply-recovery");
const recoveryStatus = document.querySelector("#recovery-status");
const recoveryHelp = document.querySelector("#recovery-help");
const recoveryResult = document.querySelector("#recovery-result");
const recoverySummary = document.querySelector("#recovery-summary");
const downloadRecoveryRawButton = document.querySelector("#download-recovery-raw");
const downloadRecoveryPostButton = document.querySelector("#download-recovery-post");
const downloadRecoveryEnvelopeButton = document.querySelector("#download-recovery-envelope");
const setRecoveryPostCurrentButton = document.querySelector("#set-recovery-post-current");
const languageSelect = document.querySelector("#language-select");
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleIcon = document.querySelector("#theme-toggle-icon");
const themeToggleLabel = document.querySelector("#theme-toggle-label");
const workspaceNavLinks = [...document.querySelectorAll(".workspace-nav a")];

const UI_TRANSLATIONS = {
  en: {
    language: "Language", theme: "Theme", lightTheme: "Light mode", darkTheme: "Dark mode", feedTitle: "WZDx Work Zone Feed", localRun: "Runs locally", evidenceFirst: "Evidence first",
    localWorkspace: "LOCAL ANALYSIS WORKSPACE", seeFeedClearly: "See the feed clearly.",
    heroLede: "Bring a WZDx feed into focus, understand what needs attention, and keep every conclusion tied to retained evidence.",
    startWithFeed: "Start with a feed", howReports: "How reports are read", currentBoundary: "CURRENT BOUNDARY",
    boundaryText: "Work Zone Feed only. No upload, no automatic recovery, no approved producer profile.", localRuntime: "Local runtime", ready: "Ready when you are",
    analyze: "Analyze", report: "Report", recovery: "Recovery", compare: "Compare", ingest: "01 / INGEST",
    bringFeed: "Bring a feed into focus", ingestLede: "Everything stays in this browser tab. Choose a local file, use a fixture, or paste the source directly.",
    analysisVersion: "Analysis version", openLocalFeed: "Open a local feed", localJson: "JSON or GeoJSON · stays on this device", browseFile: "Browse file", analyzeFeed: "Analyze feed", feedUrlLabel: "Feed URL", loadUrl: "Load feed URL", feedUrlHelp: "Only the documented WSDOT 4.2 source is accepted through the local allowlist.", feedUrlInvalid: "This URL is not in the local allowlist. Use the documented WSDOT 4.2 feed URL.", feedUrlLoading: "Loading feed URL…", feedUrlFailed: "Feed URL could not be loaded",
    tryFixture: "Try a built-in fixture", emptyFeed: "Empty 4.2 feed", cleanBaseline: "clean baseline", officialSample: "Official 4.2 sample", referenceInput: "reference input",
    branchErrors: "Branch errors", propertyErrors: "Property errors", feedInfoErrors: "FeedInfo errors", relationshipErrors: "Relationship errors", utcErrors: "UTC errors", diagnosticCase: "diagnostic case",
    pasteSource: "Paste or inspect the source JSON", inputHelp: "Paste a complete WZDx Work Zone Feed, open a local JSON/GeoJSON file, or load an existing RoadLint report to inspect it.",
    reportTitle: "Analysis report", reportLede: "A compact reading of status, scope, diagnostics, and retained measurements.", waiting: "Waiting", startSignal: "Start with the signal.",
    reportIntro: "Failures are shown before the full rule inventory. The analyzer's partial coverage remains explicit.", downloadReport: "Download report JSON", useBaseline: "Use as baseline", useCurrent: "Use as current",
    findings: "FINDINGS", needsAttention: "What needs attention", allDiagnostics: "All diagnostics", failuresOnly: "Failures only", infoOnly: "Informational only", searchDiagnostics: "Search rule, message, or pointer",
    coverage: "COVERAGE", checked: "What was checked", analytics: "ANALYTICS", measurements: "Observed measurements", recoverySection: "03 / RECOVERY", applyProfile: "Apply a compatibility profile",
    recoveryHint: "Choose a profile JSON and press the explicit apply button. Recovery never runs automatically; the raw report remains separate from the post-recovery report.", chooseProfile: "Choose profile JSON", allowLossy: "Allow lossy transformations", applyRecovery: "Apply explicit recovery", noProfile: "No profile selected",
    compareSection: "04 / COMPARE", compareTitle: "Compare two reports", compareHint: "Load two existing RoadLint report JSON files, or use the latest report above as baseline/current. The Rust/WASM drift engine compares compatible analysis contexts locally.",
    baselineJson: "Baseline report JSON", currentJson: "Current report JSON", noBaseline: "No baseline selected", noCurrent: "No current report selected", compareReports: "Compare reports", downloadDiff: "Download diff JSON",
    bothCanonical: "Both inputs must be canonical RoadLint reports.", runtimeLoading: "Loading the Rust/WASM analyzer…",
    analysisStatus: "analysis status", rulesEvaluated: "rules evaluated", rulesFailures: "rules with failures", featuresObserved: "features observed", inputBytes: "input bytes",
    target: "Target", authority: "Authority", source: "Source", authorityFingerprint: "Authority fingerprint", rulesetFingerprint: "Ruleset fingerprint",
    noTargetRules: "No target-dependent rules were evaluated.", pass: "pass", fail: "fail", notApplicable: "n/a", notEvaluated: "not evaluated", noDiagnostics: "No diagnostics. The report has no emitted findings.", noMeasurements: "No analytics measurements were emitted.",
    applicationStatus: "application status", profile: "profile", changedPointers: "changed pointers", analysisContext: "analysis context", postReport: "post report",
    rawReport: "Raw report", postRecovery: "Post-recovery report", applicationEnvelope: "Application envelope", noPostReport: "No post report has been produced.",
    diagnosticLifecycle: "DIAGNOSTIC LIFECYCLE", whatChanged: "What changed between snapshots", populationMetrics: "POPULATION AND METRICS", ruleMeasurementChanges: "Rule-level and measurement changes",
  },
  tr: {
    language: "Dil", theme: "Tema", lightTheme: "Açık tema", darkTheme: "Koyu tema", feedTitle: "WZDx Çalışma Alanı Akışı", localRun: "Yerel çalışır", evidenceFirst: "Kanıt odaklı",
    localWorkspace: "YEREL ANALİZ ÇALIŞMA ALANI", seeFeedClearly: "Akışı net görün.",
    heroLede: "Bir WZDx akışını açın, dikkat gerektiren noktaları görün ve her sonucu saklanan kanıta bağlayın.",
    startWithFeed: "Akışla başla", howReports: "Raporlar nasıl okunur", currentBoundary: "MEVCUT KAPSAM",
    boundaryText: "Yalnızca Work Zone Feed. Yükleme yok, otomatik recovery yok, onaylı üretici profili yok.", localRuntime: "Yerel çalışma", ready: "Hazır",
    analyze: "Analiz", report: "Rapor", recovery: "Recovery", compare: "Karşılaştır", ingest: "01 / GİRDİ",
    bringFeed: "Bir akışı açın", ingestLede: "Her şey bu tarayıcı sekmesinde kalır. Yerel dosya seçin, fixture kullanın veya kaynağı doğrudan yapıştırın.",
    analysisVersion: "Analiz sürümü", openLocalFeed: "Yerel akış aç", localJson: "JSON veya GeoJSON · bu cihazda kalır", browseFile: "Dosya seç", analyzeFeed: "Akışı analiz et", feedUrlLabel: "Feed URL’si", loadUrl: "Feed URL’sini yükle", feedUrlHelp: "Yalnızca belgelenmiş WSDOT 4.2 kaynağı yerel allowlist üzerinden kabul edilir.", feedUrlInvalid: "Bu URL yerel allowlist içinde değil. Belgelenmiş WSDOT 4.2 feed URL’sini kullanın.", feedUrlLoading: "Feed URL’si yükleniyor…", feedUrlFailed: "Feed URL’si yüklenemedi",
    tryFixture: "Hazır fixture dene", emptyFeed: "Boş 4.2 akışı", cleanBaseline: "temiz başlangıç", officialSample: "Resmî 4.2 örneği", referenceInput: "referans girdi",
    branchErrors: "Branch hataları", propertyErrors: "Property hataları", feedInfoErrors: "FeedInfo hataları", relationshipErrors: "Relationship hataları", utcErrors: "UTC hataları", diagnosticCase: "tanı örneği",
    pasteSource: "Kaynak JSON’u yapıştır veya incele", inputHelp: "Eksiksiz bir WZDx Work Zone Feed yapıştırın, yerel JSON/GeoJSON açın veya mevcut RoadLint raporunu incelemek için yükleyin.",
    reportTitle: "Analiz raporu", reportLede: "Durum, kapsam, tanılar ve saklanan ölçümlerin kısa görünümü.", waiting: "Bekliyor", startSignal: "Önce sinyale bakın.",
    reportIntro: "Hatalar, tüm kural envanterinden önce gösterilir. Analyzer’ın kısmi kapsamı açıkça korunur.", downloadReport: "Rapor JSON’unu indir", useBaseline: "Temel olarak kullan", useCurrent: "Mevcut olarak kullan",
    findings: "BULGULAR", needsAttention: "Dikkat gerektirenler", allDiagnostics: "Tüm tanılar", failuresOnly: "Yalnızca hatalar", infoOnly: "Yalnızca bilgi", searchDiagnostics: "Kural, mesaj veya pointer ara",
    coverage: "KAPSAM", checked: "Kontrol edilenler", analytics: "ANALİTİK", measurements: "Gözlenen ölçümler", recoverySection: "03 / RECOVERY", applyProfile: "Uyumluluk profili uygula",
    recoveryHint: "Bir profil JSON’u seçin ve açık uygulama düğmesine basın. Recovery otomatik çalışmaz; ham rapor post-recovery raporundan ayrı tutulur.", chooseProfile: "Profil JSON’u seç", allowLossy: "Kayıplı dönüşümlere izin ver", applyRecovery: "Recovery’yi açıkça uygula", noProfile: "Profil seçilmedi",
    compareSection: "04 / KARŞILAŞTIR", compareTitle: "İki raporu karşılaştır", compareHint: "İki mevcut RoadLint rapor JSON’u yükleyin veya yukarıdaki son raporu temel/mevcut olarak kullanın. Rust/WASM drift motoru uyumlu analiz bağlamlarını yerelde karşılaştırır.",
    baselineJson: "Temel rapor JSON’u", currentJson: "Mevcut rapor JSON’u", noBaseline: "Temel seçilmedi", noCurrent: "Mevcut seçilmedi", compareReports: "Raporları karşılaştır", downloadDiff: "Diff JSON’unu indir",
    bothCanonical: "Her iki girdi de kanonik RoadLint raporu olmalıdır.", runtimeLoading: "Rust/WASM analyzer yükleniyor…",
    analysisStatus: "analiz durumu", rulesEvaluated: "değerlendirilen kural", rulesFailures: "hatalı kural", featuresObserved: "gözlenen feature", inputBytes: "girdi baytı",
    target: "Hedef", authority: "Yetki", source: "Kaynak", authorityFingerprint: "Yetki parmak izi", rulesetFingerprint: "Kural seti parmak izi",
    noTargetRules: "Hedefe bağlı kural değerlendirilmedi.", pass: "geçti", fail: "hata", notApplicable: "uygulanamaz", notEvaluated: "değerlendirilmedi", noDiagnostics: "Tanı yok. Raporda yayımlanmış bulgu bulunmuyor.", noMeasurements: "Analitik ölçüm üretilmedi.",
    applicationStatus: "uygulama durumu", profile: "profil", changedPointers: "değişen pointer", analysisContext: "analiz bağlamı", postReport: "post rapor",
    rawReport: "Ham rapor", postRecovery: "Post-recovery raporu", applicationEnvelope: "Uygulama zarfı", noPostReport: "Post rapor üretilmedi.",
    diagnosticLifecycle: "TANI YAŞAM DÖNGÜSÜ", whatChanged: "Snapshot’lar arasında ne değişti", populationMetrics: "POPÜLASYON VE METRİKLER", ruleMeasurementChanges: "Kural ve ölçüm değişiklikleri",
  },
};

const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
let currentLanguage = requestedLanguage === "tr" || (requestedLanguage !== "en" && localStorage.getItem("roadlint-language") === "tr") ? "tr" : "en";
const requestedTheme = new URLSearchParams(window.location.search).get("theme");
let currentTheme = requestedTheme === "light" || requestedTheme === "dark" ? requestedTheme : localStorage.getItem("roadlint-theme") === "light" ? "light" : "dark";
function t(key) { return UI_TRANSLATIONS[currentLanguage]?.[key] ?? UI_TRANSLATIONS.en[key] ?? key; }
function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
  localStorage.setItem("roadlint-theme", currentTheme);
  const switchingTo = currentTheme === "dark" ? "lightTheme" : "darkTheme";
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", `${t("theme")}: ${t(switchingTo)}`);
    themeToggle.setAttribute("aria-pressed", String(currentTheme === "light"));
  }
  if (themeToggleIcon) themeToggleIcon.textContent = currentTheme === "dark" ? "☼" : "☾";
  if (themeToggleLabel) themeToggleLabel.textContent = t(switchingTo);
}
function setUiText(selector, key) {
  document.querySelectorAll(selector).forEach((element) => {
    const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.nodeValue = `${t(key)} `;
    else element.textContent = t(key);
  });
}
function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  if (languageSelect) languageSelect.value = currentLanguage;
  const labels = {
    ".app-context span:first-child": "feedTitle", ".app-badges > .local-chip": "localRun", ".scope-chip": "evidenceFirst",
    ".hero .eyebrow": "localWorkspace", ".hero h1": "seeFeedClearly", ".hero .lede": "heroLede",
    ".hero-actions .primary": "startWithFeed", ".hero-actions .text-link": "howReports", ".boundary-label": "currentBoundary",
    ".boundary-card > p:not(.boundary-label)": "boundaryText", ".boundary-rule span": "localRuntime", ".boundary-rule b": "ready",
    ".workspace-nav a:nth-child(1)": "analyze", ".workspace-nav a:nth-child(2)": "report", ".workspace-nav a:nth-child(3)": "recovery", ".workspace-nav a:nth-child(4)": "compare",
    "#input-panel .eyebrow": "ingest", "#input-title": "bringFeed", "#input-panel .section-lede": "ingestLede", ".version-control span": "analysisVersion",
    ".drop-copy strong": "openLocalFeed", ".drop-copy span": "localJson", ".file-picker[for='file-input']": "browseFile", "#analyze": "analyzeFeed", "#feed-url-label": "feedUrlLabel", "#load-url": "loadUrl", "#feed-url-help": "feedUrlHelp",
    ".sample-menu summary": "tryFixture", ".editor-panel summary": "pasteSource", "#input-help": "inputHelp",
    "#result-title": "reportTitle", "#result-panel .section-lede": "reportLede", ".report-intro strong": "startSignal", ".report-intro span": "reportIntro",
    "#download-report": "downloadReport", "#set-report-baseline": "useBaseline", "#set-report-current": "useCurrent", ".diagnostics-section .eyebrow": "findings", ".diagnostics-section h3": "needsAttention",
    "#diagnostic-filter option[value='all']": "allDiagnostics", "#diagnostic-filter option[value='FAIL']": "failuresOnly", "#diagnostic-filter option[value='INFO']": "infoOnly",
    "#diagnostic-search": "searchDiagnostics", ".result-section:nth-of-type(2) .eyebrow": "coverage", ".result-section:nth-of-type(2) h3": "checked", ".result-section:nth-of-type(3) .eyebrow": "analytics", ".result-section:nth-of-type(3) h3": "measurements",
    "#recovery-panel .eyebrow": "recoverySection", "#recovery-title": "applyProfile", "#recovery-panel > .hint": "recoveryHint", ".file-picker[for='recovery-profile-file']": "chooseProfile", ".checkbox-control span": "allowLossy", "#apply-recovery": "applyRecovery",
    "#compare-panel .eyebrow": "compareSection", "#compare-title": "compareTitle", "#compare-panel > .hint": "compareHint", ".compare-file:first-child span": "baselineJson", ".compare-file:last-of-type span": "currentJson", "#compare-reports": "compareReports", "#download-diff": "downloadDiff", "#compare-help": "bothCanonical",
    "#runtime-note": "runtimeLoading",
  };
  Object.entries(labels).forEach(([selector, key]) => setUiText(selector, key));
  const options = { "#load-example": "emptyFeed", "#load-official": "officialSample", "#load-negative": "branchErrors", "#load-property-negative": "propertyErrors", "#load-feed-info-negative": "feedInfoErrors", "#load-relationship-negative": "relationshipErrors", "#load-utc-negative": "utcErrors" };
  Object.entries(options).forEach(([selector, key]) => setUiText(`${selector} span`, key));
  ["#load-negative small", "#load-property-negative small", "#load-feed-info-negative small", "#load-relationship-negative small", "#load-utc-negative small"].forEach((selector) => setUiText(selector, "diagnosticCase"));
  setUiText("#load-example small", "cleanBaseline");
  setUiText("#load-official small", "referenceInput");
  setUiText("#recovery-raw-json", "rawReport");
  setUiText("#recovery-post-json", "noPostReport");
  setUiText("#recovery-envelope-json", "applicationEnvelope");
  if (input) input.placeholder = currentLanguage === "tr" ? "WZDx Work Zone Feed JSON’unu buraya yapıştırın veya yukarıdaki yerel dosyayı kullanın." : "Paste a complete WZDx Work Zone Feed JSON here, or use a local file above.";
  if (feedUrl) feedUrl.placeholder = "https://wzdx.wsdot.wa.gov/api/v4/WorkZoneFeed";
  if (diagnosticSearch) diagnosticSearch.placeholder = t("searchDiagnostics");
  if (languageSelect) languageSelect.setAttribute("aria-label", t("language"));
  applyTheme();
  if (runtimeNote && wasmReady) runtimeNote.textContent = currentLanguage === "tr" ? "Rust/WASM analyzer hazır · yalnızca yerel analiz" : "Rust/WASM analyzer ready · local-only analysis";
  window.dispatchEvent(new CustomEvent("roadlint-language-change", { detail: currentLanguage }));
}
const DEFAULT_INPUT_HELP = "Paste a complete WZDx Work Zone Feed, open a local JSON/GeoJSON file, or load an existing RoadLint report to inspect it.";
const DIAGNOSTICS_PAGE_SIZE = 100;
const DIFF_PAGE_SIZE = 250;
const COVERAGE_PAGE_SIZE = 12;
const LARGE_INPUT_BYTES = 5 * 1024 * 1024;
const measurementExample = new URLSearchParams(window.location.search).get("measurement");
let latestReport = null;
let latestDiff = null;
let baselineReport = null;
let currentReport = null;
let wasmReady = false;
let wasmInitializationMs = null;
let inputLabel = "Inline input";
let latestInputText = null;
let selectedRecoveryProfileJson = null;
let selectedRecoveryProfileName = null;
let latestRecoveryEnvelope = null;
const recoveryJsonValues = { raw: null, post: null, envelope: null };
let diagnosticVisibleLimit = DIAGNOSTICS_PAGE_SIZE;
let diffVisibleLimit = DIFF_PAGE_SIZE;
let ruleVisibleLimit = COVERAGE_PAGE_SIZE;

function setExample() {
  input.value = JSON.stringify(example, null, 2);
  input.placeholder = "";
  inputHelp.textContent = DEFAULT_INPUT_HELP;
  inputLabel = "Empty 4.2 feed";
  fileName.textContent = "Empty 4.2 feed loaded · analyzing…";
  analyzeCurrentInput();
}

async function loadBundledExample(path, label) {
  try {
    const totalStart = performance.now();
    const jsHeapSamples = [];
    recordJavaScriptHeapSample(jsHeapSamples, "before_file_read");
    const fileReadStart = performance.now();
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const fileReadMs = performance.now() - fileReadStart;
    recordJavaScriptHeapSample(jsHeapSamples, "after_file_read");
    const inputBytes = new Blob([text]).size;
    if (inputBytes > LARGE_INPUT_BYTES) {
      input.value = "";
      input.placeholder = `${label} loaded (${formatBytes(inputBytes)}). The large file is analyzed without filling the editor.`;
      inputHelp.textContent = "Large input stays local and out of the editor to keep the page responsive.";
    } else {
      input.value = text;
      input.placeholder = "";
      inputHelp.textContent = DEFAULT_INPUT_HELP;
    }
    inputLabel = label;
    fileName.textContent = `${label} loaded · analyzing…`;
    await analyzeCurrentInput(text, { totalStart, fileReadMs, jsHeapSamples });
  } catch (error) {
    runtimeNote.textContent = `Example could not be loaded: ${error}`;
  }
}

const ALLOWLISTED_FEED_URL = "https://wzdx.wsdot.wa.gov/api/v4/WorkZoneFeed";

async function loadFeedUrl() {
  const rawUrl = feedUrl.value.trim();
  let normalizedUrl;
  try {
    normalizedUrl = new URL(rawUrl).toString().replace(/\/$/, "");
  } catch {
    feedUrlHelp.textContent = t("feedUrlInvalid");
    return;
  }
  if (normalizedUrl !== ALLOWLISTED_FEED_URL) {
    feedUrlHelp.textContent = t("feedUrlInvalid");
    return;
  }

  loadUrlButton.disabled = true;
  feedUrlHelp.textContent = t("feedUrlLoading");
  try {
    const endpoint = ["localhost", "127.0.0.1"].includes(window.location.hostname) ? "/api/live-feed?source=wsdot" : "./live-feed.json";
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const envelope = await response.json();
    const feed = envelope.feed ?? envelope;
    const text = JSON.stringify(feed);
    inputLabel = rawUrl;
    if (text.length <= LARGE_INPUT_BYTES) {
      input.value = text;
      input.placeholder = "";
    } else {
      input.value = "";
      input.placeholder = `${rawUrl} loaded (${formatBytes(text.length)}). The feed stays out of the editor.`;
    }
    fileName.textContent = `${rawUrl} loaded · analyzing…`;
    await analyzeCurrentInput(text, { totalStart: performance.now() });
    feedUrlHelp.textContent = t("feedUrlHelp");
  } catch (error) {
    feedUrlHelp.textContent = `${t("feedUrlFailed")}: ${error.message ?? error}`;
  } finally {
    loadUrlButton.disabled = false;
  }
}

function isRoadLintReport(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.report_schema_version &&
      Array.isArray(value.rule_summaries) &&
      Array.isArray(value.diagnostics),
  );
}

function notifyMapFeed(text, label, report) {
  let feed;
  try {
    feed = JSON.parse(text);
  } catch {
    return;
  }
  if (feed?.type !== "FeatureCollection" || !Array.isArray(feed.features)) return;
  const detail = { feed, text, label, report };
  window.__roadlintLatestFeedAnalysis = detail;
  window.dispatchEvent(new CustomEvent("roadlint-feed-analysis", { detail }));
}

function roundMilliseconds(value) {
  return value === null || value === undefined ? null : Math.round(value * 1000) / 1000;
}

function readJavaScriptHeapSample(phase) {
  const memory = performance.memory;
  if (!memory || typeof memory.usedJSHeapSize !== "number") return null;
  return {
    phase,
    used_js_heap_bytes: memory.usedJSHeapSize,
    total_js_heap_bytes: memory.totalJSHeapSize,
    js_heap_limit_bytes: memory.jsHeapSizeLimit,
  };
}

function recordJavaScriptHeapSample(samples, phase) {
  const sample = readJavaScriptHeapSample(phase);
  if (sample) samples.push(sample);
}

function buildUnsupportedMemoryEvidence(kind, reason) {
  return {
    measured: false,
    status: "unsupported",
    method: kind,
    reason,
  };
}

async function measureBrowserMemory(jsHeapSamples) {
  const latestJsHeapSample = jsHeapSamples[jsHeapSamples.length - 1] ?? null;
  const observedBoundaryMax = jsHeapSamples.reduce(
    (maximum, sample) => Math.max(maximum, sample.used_js_heap_bytes),
    0,
  );
  let userAgentSpecificMemory = null;
  if (typeof performance.measureUserAgentSpecificMemory === "function") {
    try {
      const sample = await performance.measureUserAgentSpecificMemory();
      userAgentSpecificMemory = {
        measured: true,
        status: "measured",
        method: "performance.measureUserAgentSpecificMemory",
        scope: "browser agent memory for this origin at the post-render sample",
        bytes: sample.bytes,
        breakdown: Array.isArray(sample.breakdown)
          ? sample.breakdown.slice(0, 50).map((item) => ({
              bytes: item.bytes,
              types: item.types,
              attribution: item.attribution,
            }))
          : [],
        user_agent_specific_memory_available: true,
      };
    } catch (error) {
      userAgentSpecificMemory = {
        measured: false,
        status: "measurement-error",
        method: "performance.measureUserAgentSpecificMemory",
        reason: `${error?.name ?? "Error"}: ${error?.message ?? String(error)}`,
        user_agent_specific_memory_available: true,
      };
    }
  }

  const currentJsHeap = latestJsHeapSample
    ? {
        measured: true,
        status: "measured",
        method: "performance.memory.usedJSHeapSize",
        scope: "current JavaScript heap only; excludes unreported browser/WASM allocations",
        used_js_heap_bytes: latestJsHeapSample.used_js_heap_bytes,
        total_js_heap_bytes: latestJsHeapSample.total_js_heap_bytes,
        js_heap_limit_bytes: latestJsHeapSample.js_heap_limit_bytes,
        user_agent_specific_memory_available: Boolean(
          typeof performance.measureUserAgentSpecificMemory === "function",
        ),
      }
    : {
        measured: false,
        status: "not-measured",
        method: "No supported browser memory API was available after rendering.",
        reason: "This run records timing only and makes no browser memory or heap claim.",
        user_agent_specific_memory_available: Boolean(
          typeof performance.measureUserAgentSpecificMemory === "function",
        ),
      };

  return {
    ...(userAgentSpecificMemory?.measured ? userAgentSpecificMemory : currentJsHeap),
    user_agent_specific_memory: userAgentSpecificMemory ?? {
      measured: false,
      status: "not-available",
      method: "performance.measureUserAgentSpecificMemory",
      reason: "The selected browser did not expose this API.",
    },
    js_heap_samples: jsHeapSamples,
    observed_boundary_max_js_heap_bytes: observedBoundaryMax || null,
    observed_boundary_max_scope:
      "maximum of samples taken at phase boundaries; synchronous WASM execution is not sampled internally",
    peak_browser_memory: buildUnsupportedMemoryEvidence(
      "No standard browser API exposes peak allocation across this synchronous operation.",
      "Boundary samples do not establish a true peak; browser scheduling and allocations between samples remain unobserved.",
    ),
    total_browser_memory: buildUnsupportedMemoryEvidence(
      "No standard browser API exposes total browser-process memory for this page.",
      "performance.memory is JavaScript-heap-only; user-agent-specific memory, when available, is origin-scoped and is not total browser-process memory.",
    ),
    wasm_memory: buildUnsupportedMemoryEvidence(
      "No supported API exposes the WASM linear-memory allocation separately in this page.",
      "The WASM runtime is included in the operation timing, but its allocation is not attributed by the available memory APIs.",
    ),
  };
}

async function publishTiming(timing) {
  const memory = await measureBrowserMemory(timing.js_heap_samples ?? []);
  const normalized = {
    ...timing,
    initialization_ms: roundMilliseconds(timing.initialization_ms),
    file_read_ms: roundMilliseconds(timing.file_read_ms),
    json_parse_ms: roundMilliseconds(timing.json_parse_ms),
    wasm_analyze_and_serialize_ms: roundMilliseconds(timing.wasm_analyze_and_serialize_ms),
    report_render_ms: roundMilliseconds(timing.report_render_ms),
    total_ms: roundMilliseconds(timing.total_ms),
    runtime_context: {
      ...(timing.runtime_context ?? {}),
      browser_user_agent: navigator.userAgent,
      browser_platform: navigator.platform,
      cross_origin_isolated: Boolean(window.crossOriginIsolated),
    },
    memory,
  };
  window.__roadlintLastTiming = normalized;
  if (timingNote) {
    timingNote.dataset.measurement = JSON.stringify(normalized);
    const stages = [
      `init ${normalized.initialization_ms ?? "—"} ms`,
      `file ${normalized.file_read_ms ?? "—"} ms`,
      `parse ${normalized.json_parse_ms ?? "—"} ms`,
      `WASM ${normalized.wasm_analyze_and_serialize_ms ?? "—"} ms`,
      `render ${normalized.report_render_ms ?? "—"} ms`,
      `total ${normalized.total_ms ?? "—"} ms`,
    ];
    const memoryLabel = normalized.memory.measured
      ? `JS heap boundary max ${formatBytes(
          normalized.memory.observed_boundary_max_js_heap_bytes ??
            normalized.memory.bytes ??
            normalized.memory.used_js_heap_bytes,
        )}`
      : "memory not measured";
    timingNote.textContent = `Browser timing · ${stages.join(" · ")} · ${memoryLabel}`;
  }
}

async function analyzeCurrentInput(providedText = null, timingContext = null) {
  const text = (providedText ?? input.value).trim();
  if (!text) {
    runtimeNote.textContent = "Paste a feed or open a local JSON file first.";
    return;
  }

  const totalStart = timingContext?.totalStart ?? performance.now();
  const jsHeapSamples = [...(timingContext?.jsHeapSamples ?? [])];
  recordJavaScriptHeapSample(jsHeapSamples, "before_json_parse");
  const parseStart = performance.now();
  let parsed;
  try {
    parsed = JSON.parse(text);
    if (isRoadLintReport(parsed)) {
      latestInputText = null;
      renderReport(parsed, "Existing RoadLint report · viewer mode");
      fileName.textContent = `${inputLabel} loaded · viewer mode`;
      runtimeNote.textContent = "Report viewer ready · nothing was uploaded";
      return;
    }
  } catch {
    // Let the Rust analyzer produce the canonical fatal JSON report.
  }
  const parseEnd = performance.now();
  recordJavaScriptHeapSample(jsHeapSamples, "after_json_parse");

  latestInputText = text;

  if (!wasmReady) {
    runtimeNote.textContent = "Input loaded. The Rust/WASM analyzer is still loading.";
    return;
  }

  try {
    recordJavaScriptHeapSample(jsHeapSamples, "before_wasm_analysis");
    const wasmStart = performance.now();
    const report = analyze(text, version.value);
    const wasmEnd = performance.now();
    recordJavaScriptHeapSample(jsHeapSamples, "after_wasm_analysis_and_serialization");
    const renderStart = performance.now();
    renderReport(report, "Fresh analysis · local-only");
    notifyMapFeed(text, inputLabel, report);
    const renderEnd = performance.now();
    recordJavaScriptHeapSample(jsHeapSamples, "after_report_render");
    await publishTiming({
      initialization_ms: wasmInitializationMs,
      file_read_ms: timingContext?.fileReadMs ?? null,
      json_parse_ms: parseEnd - parseStart,
      wasm_analyze_and_serialize_ms: wasmEnd - wasmStart,
      report_render_ms: renderEnd - renderStart,
      total_ms: renderEnd - totalStart,
      input_sha256: report.input?.sha256 ?? null,
      input_bytes: report.input?.byte_count ?? null,
      analysis_status: report.analysis_status ?? null,
      js_heap_samples: jsHeapSamples,
    });
    fileName.textContent = `${inputLabel} analyzed successfully`;
    runtimeNote.textContent = "Rust/WASM analyzer ready · local-only analysis";
  } catch (error) {
    runtimeNote.textContent = `Analysis could not start: ${error}`;
  }
}

function renderSummary(report) {
  const ruleSummaries = report.rule_summaries ?? [];
  const failedRules = ruleSummaries.filter((item) => item.population?.fail > 0).length;
  const featureCount = report.measurements?.find((item) => item.metric === "feature_count")?.value;
  const cards = [
    [report.analysis_status ?? "unknown", t("analysisStatus")],
    [ruleSummaries.length, t("rulesEvaluated")],
    [failedRules, t("rulesFailures")],
    [featureCount ?? "—", t("featuresObserved")],
    [report.input?.byte_count ?? "—", t("inputBytes")],
  ];
  summary.innerHTML = cards
    .map(
      ([value, label]) =>
        `<div class="summary-card"><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(label)}</span></div>`,
    )
    .join("");
}

function renderContext(report) {
  const target = report.target_resolution?.selected_target;
  const source = report.input?.source?.label ?? "inline input";
  const context = [
    [t("target"), target ? `${target.standard} · ${target.feed_family} · ${target.version}` : "unresolved"],
    [t("authority"), target?.authority_revision ?? "—"],
    [t("source"), source],
    [t("authorityFingerprint"), shorten(report.fingerprints?.authority_sha256)],
    [t("rulesetFingerprint"), shorten(report.fingerprints?.ruleset_sha256)],
  ];
  reportContext.innerHTML = context
    .map(
      ([label, value]) =>
        `<div class="context-item"><span>${escapeHtml(label)}</span><strong title="${escapeHtml(String(value))}">${escapeHtml(String(value))}</strong></div>`,
    )
    .join("");
}

function renderRuleResults(report) {
  const rules = report.rule_summaries ?? [];
  ruleCount.textContent = `${rules.length} ${currentLanguage === "tr" ? "kural" : `rule${rules.length === 1 ? "" : "s"}`}`;
  const visibleRules = rules.slice(0, ruleVisibleLimit);
  const remaining = Math.max(0, rules.length - visibleRules.length);
  coverageLimitNote.hidden = remaining === 0;
  loadMoreRules.hidden = remaining === 0;
  if (remaining > 0) {
    coverageLimitNote.textContent = currentLanguage === "tr"
      ? `İlk ${visibleRules.length} kural gösteriliyor · ${remaining} kural daha var.`
      : `Showing the first ${visibleRules.length} rules · ${remaining} more available.`;
    loadMoreRules.textContent = currentLanguage === "tr"
      ? `Sonraki ${Math.min(COVERAGE_PAGE_SIZE, remaining)} kuralı göster`
      : `Show next ${Math.min(COVERAGE_PAGE_SIZE, remaining)} rules`;
  }
  if (rules.length === 0) {
    ruleResults.innerHTML = `<div class="empty">${escapeHtml(t("noTargetRules"))}</div>`;
    return;
  }
  ruleResults.innerHTML = visibleRules
    .map((rule) => {
      const population = rule.population ?? {};
      const fail = population.fail ?? 0;
      const rowClass = fail > 0 ? "rule-row has-fail" : "rule-row passed";
      return `
        <article class="${rowClass}">
          <div class="rule-title"><code>${escapeHtml(rule.rule_id)}</code><span>${escapeHtml(rule.execution_kind ?? "ASSERTION")}</span></div>
          <div class="rule-counts">
            ${countPill(population.pass, t("pass"), "pass")}
            ${countPill(population.fail, t("fail"), "fail")}
            ${countPill(population.not_applicable, t("notApplicable"), "neutral")}
            ${countPill(population.not_evaluated, t("notEvaluated"), "neutral")}
          </div>
        </article>`;
    })
    .join("");
}

function countPill(value, label, tone) {
  return `<span class="count-pill ${tone}"><strong>${escapeHtml(String(value ?? 0))}</strong><small>${escapeHtml(label)}</small></span>`;
}

function renderDiagnostics(report) {
  const allDiagnostics = report.diagnostics ?? [];
  const filter = diagnosticFilter.value;
  const query = diagnosticSearch.value.trim().toLowerCase();
  const filtered = allDiagnostics.filter((item) => {
    const stateMatches = filter === "all" || item.state === filter;
    const haystack = [item.rule_id, item.message, item.pointer, item.subject_id, item.severity]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return stateMatches && (!query || haystack.includes(query));
  });
  const visible = filtered.slice(0, diagnosticVisibleLimit);
  const remaining = filtered.length - visible.length;
  diagnosticCount.textContent =
    remaining > 0
      ? currentLanguage === "tr" ? `${visible.length} / ${filtered.length} eşleşen gösteriliyor · toplam ${allDiagnostics.length}` : `${visible.length} shown of ${filtered.length} matching · ${allDiagnostics.length} total`
      : currentLanguage === "tr" ? `${filtered.length} / ${allDiagnostics.length}` : `${filtered.length} of ${allDiagnostics.length}`;
  diagnosticLimitNote.hidden = remaining === 0;
  loadMoreDiagnostics.hidden = remaining === 0;
  if (remaining > 0) {
    diagnosticLimitNote.textContent = currentLanguage === "tr" ? `İlk ${visible.length} eşleşen tanı gösteriliyor. Aramayı daraltın veya daha fazla yükleyin; raporda toplam ${allDiagnostics.length} tanı var.` : `Showing the first ${visible.length} matching diagnostics. Refine the search or load more; the report still contains all ${allDiagnostics.length}.`;
    loadMoreDiagnostics.textContent = currentLanguage === "tr" ? `Sonraki ${Math.min(DIAGNOSTICS_PAGE_SIZE, remaining)} tanıyı yükle` : `Load next ${Math.min(DIAGNOSTICS_PAGE_SIZE, remaining)} diagnostics`;
  }
  if (filtered.length === 0) {
    diagnostics.innerHTML =
      allDiagnostics.length === 0
        ? `<div class="empty success-empty">${escapeHtml(t("noDiagnostics"))}</div>`
        : `<div class="empty">${currentLanguage === "tr" ? "Geçerli filtreyle eşleşen tanı yok." : "No diagnostics match the current filter."}</div>`;
    return;
  }
  diagnostics.innerHTML = visible
    .map(
      (item) => `
      <article class="diagnostic ${escapeHtml(String(item.state ?? "").toLowerCase())}" data-diagnostic-index="${allDiagnostics.indexOf(item)}" role="button" tabindex="0">
        <div class="diagnostic-head"><code>${escapeHtml(item.rule_id ?? "unknown")}</code><span class="state">${escapeHtml(item.state ?? "INFO")}</span><span class="severity">${escapeHtml(item.severity ?? "INFO")}</span></div>
        <p>${escapeHtml(item.message ?? "No message")}</p>
        <small>${escapeHtml(item.pointer ?? "—")}${item.subject_id ? ` · subject ${escapeHtml(item.subject_id)}` : ""}</small>
      </article>`,
    )
    .join("");
}

function renderMeasurements(report) {
  const values = report.measurements ?? [];
  measurementCount.textContent = `${values.length} ${currentLanguage === "tr" ? "ölçüm" : `measurement${values.length === 1 ? "" : "s"}`}`;
  if (values.length === 0) {
    measurements.innerHTML = `<div class="empty">${escapeHtml(t("noMeasurements"))}</div>`;
    return;
  }
  measurements.innerHTML = values
    .map(
      (item) => `
      <article class="measurement">
        <code>${escapeHtml(item.metric ?? "unknown metric")}</code>
        <strong>${escapeHtml(formatValue(item.value))}</strong>
        <span>${escapeHtml(item.unit ?? "")}</span>
      </article>`,
    )
    .join("");
}

function renderReport(report, mode) {
  clearRecoveryResult();
  latestReport = report;
  ruleVisibleLimit = COVERAGE_PAGE_SIZE;
  diagnosticVisibleLimit = DIAGNOSTICS_PAGE_SIZE;
  diagnosticFilter.value = "all";
  diagnosticSearch.value = "";
  resultPanel.hidden = false;
  statusBadge.textContent = report.analysis_status ?? "unknown";
  statusBadge.className = `status-badge ${report.analysis_status ?? "unknown"}`;
  renderSummary(report);
  renderContext(report);
  renderRuleResults(report);
  renderDiagnostics(report);
  renderMeasurements(report);
  const inputHash = report.input?.sha256 ? `Input SHA-256: ${report.input.sha256}` : mode;
  document.querySelector("#report-note").textContent = `${mode} · ${inputHash}`;
  updateComparisonControls();
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateRecoveryControls() {
  const ready = Boolean(wasmReady && latestInputText && selectedRecoveryProfileJson);
  applyRecoveryButton.disabled = !ready;
  setRecoveryPostCurrentButton.disabled = !latestRecoveryEnvelope?.post_report;
  if (latestRecoveryEnvelope) return;
  if (!wasmReady) {
    recoveryHelp.textContent = currentLanguage === "tr" ? "Rust/WASM recovery çalışma zamanı hâlâ yükleniyor." : "The Rust/WASM recovery runtime is still loading.";
  } else if (!latestInputText) {
    recoveryHelp.textContent = currentLanguage === "tr" ? "Recovery profili uygulamadan önce bir akışı analiz edin." : "Analyze a feed before applying a recovery profile.";
  } else if (!selectedRecoveryProfileJson) {
    recoveryHelp.textContent = currentLanguage === "tr" ? "Açık uygulamayı etkinleştirmek için üretici-nötr bir profil JSON’u seçin." : "Choose a producer-neutral profile JSON to enable explicit application.";
  } else {
    recoveryHelp.textContent = currentLanguage === "tr" ? `${selectedRecoveryProfileName ?? "Seçili profil"} açıkça uygulanmaya hazır. Otomatik recovery devre dışı.` : `Ready to apply ${selectedRecoveryProfileName ?? "the selected profile"} explicitly. Automatic recovery is disabled.`;
  }
}

function clearRecoveryResult() {
  latestRecoveryEnvelope = null;
  recoveryResult.hidden = true;
  recoveryStatus.textContent = "Waiting";
  recoveryStatus.className = "status-badge waiting";
  for (const key of Object.keys(recoveryJsonValues)) {
    recoveryJsonValues[key] = null;
  }
  document.querySelector("#recovery-raw-json").textContent = "Expand to render the raw report JSON.";
  document.querySelector("#recovery-post-json").textContent = "No post report has been produced.";
  document.querySelector("#recovery-envelope-json").textContent = "Expand to render the application envelope JSON.";
  updateRecoveryControls();
}

function renderRecoverySummary(envelope) {
  const context = envelope.analysis_context?.compatible ? "compatible" : "not comparable";
  const post = envelope.post_report ? "available" : "not produced";
  const cards = [
    [envelope.status ?? "unknown", t("applicationStatus")],
    [envelope.profile_id ?? "—", t("profile")],
    [envelope.changed_count ?? 0, t("changedPointers")],
    [context, t("analysisContext")],
    [post, t("postReport")],
  ];
  recoverySummary.innerHTML = cards
    .map(
      ([value, label]) =>
        `<div class="summary-card"><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(label)}</span></div>`,
    )
    .join("");
}

function renderRecoveryJson(key, value) {
  recoveryJsonValues[key] = value;
  const details = document.querySelector(`[data-recovery-json="${key}"]`);
  const preview = document.querySelector(`#recovery-${key}-json`);
  details.open = false;
  preview.textContent = value === null ? "No post report has been produced." : "Expand to render JSON.";
}

function renderRecoveryEnvelope(envelope) {
  latestRecoveryEnvelope = envelope;
  recoveryResult.hidden = false;
  recoveryStatus.textContent = envelope.status ?? "unknown";
  recoveryStatus.className = `status-badge ${(envelope.status ?? "waiting").toLowerCase()}`;
  renderRecoverySummary(envelope);
  renderRecoveryJson("raw", envelope.raw_report ?? null);
  renderRecoveryJson("post", envelope.post_report ?? null);
  renderRecoveryJson("envelope", envelope);
  downloadRecoveryPostButton.disabled = !envelope.post_report;
  setRecoveryPostCurrentButton.disabled = !envelope.post_report;
  recoveryHelp.textContent = envelope.post_report
    ? "Raw and post-recovery reports are retained separately; the application envelope records the explicit result."
    : `No post report was produced: ${envelope.status ?? "recovery rejected"}.`;
  recoveryResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

function downloadJson(value, filename) {
  if (!value) return;
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function applySelectedRecovery() {
  if (!latestInputText || !selectedRecoveryProfileJson || !wasmReady) return;
  recoveryStatus.textContent = "Applying…";
  recoveryStatus.className = "status-badge partial";
  try {
    renderRecoveryEnvelope(
      apply_recovery(
        latestInputText,
        selectedRecoveryProfileJson,
        version.value,
        true,
        allowLossy.checked,
      ),
    );
  } catch (error) {
    recoveryStatus.textContent = "Error";
    recoveryStatus.className = "status-badge fatal";
    recoveryHelp.textContent = `Recovery could not start: ${error}`;
  }
}

function setComparisonSlot(slot, report, label) {
  if (slot === "baseline") {
    baselineReport = report;
    baselineReportName.textContent = label;
  } else {
    currentReport = report;
    currentReportName.textContent = label;
  }
  updateComparisonControls();
}

function updateComparisonControls() {
  const ready = Boolean(wasmReady && baselineReport && currentReport);
  compareReportsButton.disabled = !ready;
  downloadDiffButton.disabled = !latestDiff;
  if (baselineReport && currentReport) {
    compareStatus.textContent = wasmReady ? "Ready" : "WASM loading";
    compareStatus.className = `status-badge ${wasmReady ? "complete" : "partial"}`;
    compareHelp.textContent = "Both reports loaded. Compare them locally with the Rust/WASM drift engine.";
  } else {
    compareStatus.textContent = "Waiting";
    compareStatus.className = "status-badge waiting";
    compareHelp.textContent = "Both inputs must be canonical RoadLint reports.";
  }
  updateRecoveryControls();
}

async function loadReportForComparison(file, slot) {
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!isRoadLintReport(parsed)) {
      throw new Error("The file is not a canonical RoadLint report JSON");
    }
    setComparisonSlot(slot, parsed, `${file.name} · ${formatBytes(file.size)}`);
  } catch (error) {
    compareHelp.textContent = `Could not load ${slot} report: ${error.message ?? error}`;
  }
}

function renderDiffSummary(diff) {
  const lifecycle = diff.diagnostic_lifecycle ?? [];
  const count = (state) => lifecycle.filter((item) => item.state === state).length;
  const semantic = diff.semantic_drift_observed;
  const cards = [
    [diff.analysis_context_compatible ? (currentLanguage === "tr" ? "uyumlu" : "compatible") : (currentLanguage === "tr" ? "değişti" : "changed"), t("analysisContext")],
    [semantic === null ? "—" : semantic ? (currentLanguage === "tr" ? "evet" : "yes") : (currentLanguage === "tr" ? "hayır" : "no"), currentLanguage === "tr" ? "semantik drift" : "semantic drift"],
    [count("NEW"), currentLanguage === "tr" ? "yeni tanı" : "new diagnostics"],
    [count("CHANGED"), currentLanguage === "tr" ? "değişen tanı" : "changed diagnostics"],
    [count("RESOLVED"), currentLanguage === "tr" ? "çözülen tanı" : "resolved diagnostics"],
    [count("PERSISTING"), currentLanguage === "tr" ? "devam eden tanı" : "persisting diagnostics"],
  ];
  diffSummary.innerHTML = cards
    .map(
      ([value, label]) =>
        `<div class="summary-card"><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(label)}</span></div>`,
    )
    .join("");
}

function renderDiffContext(diff) {
  const changes = Object.entries(diff.context_changes ?? {});
  const items = changes.length
    ? changes.map(([key, value]) => [key, `${formatValue(value.before)} → ${formatValue(value.after)}`])
    : [[currentLanguage === "tr" ? "Analiz bağlamı" : "Analysis context", currentLanguage === "tr" ? "Uyumlu" : "Compatible"]];
  items.push(
    [currentLanguage === "tr" ? "Girdi değişti" : "Input changed", diff.input?.changed ? (currentLanguage === "tr" ? "Evet" : "Yes") : (currentLanguage === "tr" ? "Hayır" : "No")],
    [currentLanguage === "tr" ? "Temel bayt" : "Baseline bytes", formatValue(diff.input?.before_byte_count)],
    [currentLanguage === "tr" ? "Mevcut bayt" : "Current bytes", formatValue(diff.input?.after_byte_count)],
  );
  diffContext.className = `report-context ${changes.length ? "diff-context-changed" : ""}`;
  diffContext.innerHTML = items
    .map(
      ([label, value]) =>
        `<div class="context-item"><span>${escapeHtml(label)}</span><strong title="${escapeHtml(String(value))}">${escapeHtml(String(value))}</strong></div>`,
    )
    .join("");
}

function lifecycleIdentity(item) {
  const identity = item.identity ?? {};
  const subject = identity.subject_id ? `subject ${identity.subject_id}` : `pointer ${identity.pointer ?? "—"}`;
  const locator = identity.subject_locator ? ` · ${identity.subject_locator}` : "";
  return `${identity.rule_id ?? "unknown"} · ${subject}${locator}`;
}

function renderDiffLifecycle(diff) {
  const allItems = diff.diagnostic_lifecycle ?? [];
  const filter = diffStateFilter.value;
  const query = diffSearch.value.trim().toLowerCase();
  const filtered = allItems.filter((item) => {
    const haystack = `${item.state} ${lifecycleIdentity(item)} ${JSON.stringify(item.before ?? [])} ${JSON.stringify(item.after ?? [])}`.toLowerCase();
    return (filter === "all" || item.state === filter) && (!query || haystack.includes(query));
  });
  const visible = filtered.slice(0, diffVisibleLimit);
  const remaining = filtered.length - visible.length;
  diffLifecycleCount.textContent =
    remaining > 0
      ? currentLanguage === "tr" ? `${visible.length} / ${filtered.length} eşleşen gösteriliyor · toplam ${allItems.length}` : `${visible.length} shown of ${filtered.length} matching · ${allItems.length} total`
      : currentLanguage === "tr" ? `${filtered.length} / ${allItems.length}` : `${filtered.length} of ${allItems.length}`;
  diffLimitNote.hidden = remaining === 0;
  loadMoreDiff.hidden = remaining === 0;
  if (remaining > 0) {
    diffLimitNote.textContent = currentLanguage === "tr" ? `İlk ${visible.length} eşleşen yaşam döngüsü değişikliği gösteriliyor. Diff toplam ${allItems.length} kaydı içeriyor.` : `Showing the first ${visible.length} matching lifecycle changes. The diff still contains all ${allItems.length}.`;
    loadMoreDiff.textContent = currentLanguage === "tr" ? `Sonraki ${Math.min(DIFF_PAGE_SIZE, remaining)} değişikliği yükle` : `Load next ${Math.min(DIFF_PAGE_SIZE, remaining)} changes`;
  }
  if (filtered.length === 0) {
    diffLifecycle.innerHTML = `<div class="empty success-empty">${currentLanguage === "tr" ? "Geçerli filtreyle eşleşen yaşam döngüsü değişikliği yok." : "No lifecycle changes match the current filter."}</div>`;
    return;
  }
  diffLifecycle.innerHTML = visible
    .map(
      (item) => {
        const lifecycleMessage = {
          NEW: "The occurrence appears in the current report.",
          PERSISTING: "The same semantic occurrence remains.",
          CHANGED: "The occurrence changed between reports.",
          RESOLVED: "The occurrence is absent from the current report.",
        }[item.state] ?? "The occurrence changed between reports.";
        return `
        <article class="diagnostic ${escapeHtml(String(item.state ?? "").toLowerCase())}">
          <div class="diagnostic-head"><code>${escapeHtml(lifecycleIdentity(item))}</code><span class="state">${escapeHtml(item.state ?? "unknown")}</span></div>
          <p>${escapeHtml(lifecycleMessage)}</p>
          <small>Before: ${escapeHtml(formatValue(item.before ?? []))} · After: ${escapeHtml(formatValue(item.after ?? []))}</small>
        </article>`;
      },
    )
    .join("");
}

function renderDiffRuleChanges(diff) {
  const rows = [];
  for (const item of diff.rule_failure_lifecycle ?? []) {
    rows.push({
      kind: "rule failure",
      rule: item.rule_id,
      state: item.state,
      detail: `${item.before_fail} failures → ${item.after_fail} failures`,
    });
  }
  for (const item of diff.population_deltas ?? []) {
    rows.push({
      kind: "population",
      rule: item.rule_id,
      state: "CHANGED",
      detail: `${formatValue(item.before)} → ${formatValue(item.after)}`,
    });
  }
  for (const item of diff.measurement_deltas ?? []) {
    rows.push({
      kind: `measurement · ${item.metric}`,
      rule: item.rule_id,
      state: "CHANGED",
      detail: `${formatValue(item.before)} → ${formatValue(item.after)}`,
    });
  }
  diffRuleCount.textContent = `${rows.length} change${rows.length === 1 ? "" : "s"}`;
  if (rows.length === 0) {
    diffRuleChanges.innerHTML = '<div class="empty success-empty">No rule-level or measurement changes.</div>';
    return;
  }
  diffRuleChanges.innerHTML = rows
    .map(
      (row) => `
        <article class="drift-row">
          <div class="drift-row-head"><code>${escapeHtml(row.rule ?? "unknown")}</code><span class="state">${escapeHtml(row.state)}</span><small>${escapeHtml(row.kind)}</small></div>
          <small>${escapeHtml(row.detail)}</small>
        </article>`,
    )
    .join("");
}

function renderDiff(diff) {
  latestDiff = diff;
  diffVisibleLimit = DIFF_PAGE_SIZE;
  diffStateFilter.value = "all";
  diffSearch.value = "";
  diffResult.hidden = false;
  renderDiffSummary(diff);
  renderDiffContext(diff);
  renderDiffLifecycle(diff);
  renderDiffRuleChanges(diff);
  updateComparisonControls();
}

function compareLoadedReports() {
  if (!baselineReport || !currentReport) return;
  if (!wasmReady) {
    compareHelp.textContent = "The Rust/WASM drift engine is still loading.";
    return;
  }
  try {
    renderDiff(compare_reports(JSON.stringify(baselineReport), JSON.stringify(currentReport)));
    compareStatus.textContent = "Compared";
    compareStatus.className = "status-badge complete";
  } catch (error) {
    compareHelp.textContent = `Comparison could not start: ${error}`;
  }
}

function formatValue(value) {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function shorten(value) {
  if (!value) return "—";
  return `${value.slice(0, 12)}…`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

document.querySelector("#load-example").addEventListener("click", setExample);
document.querySelector("#load-official").addEventListener("click", () => {
  loadBundledExample("examples/wzdx-4.2-scenario1-simple-multipoint.geojson", "Official 4.2 sample");
});
document.querySelector("#load-negative").addEventListener("click", () => {
  loadBundledExample("examples/wzf_branch_semantics_negative.json", "Branch errors");
});
document.querySelector("#load-property-negative").addEventListener("click", () => {
  loadBundledExample("examples/wzf_branch_property_semantics_negative.json", "Property errors");
});
document.querySelector("#load-feed-info-negative").addEventListener("click", () => {
  loadBundledExample("examples/wzf_feed_info_negative.json", "FeedInfo errors");
});
document.querySelector("#load-relationship-negative").addEventListener("click", () => {
  loadBundledExample("examples/wzf_relationship_negative.json", "Relationship errors");
});
document.querySelector("#load-utc-negative").addEventListener("click", () => {
  loadBundledExample("examples/wzf_utc_negative.json", "UTC errors");
});
recoveryProfileFile.addEventListener("change", async () => {
  const [file] = recoveryProfileFile.files;
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !parsed.profile_id || !parsed.activation) {
      throw new Error("The file is not a recovery profile JSON");
    }
    selectedRecoveryProfileJson = text;
    selectedRecoveryProfileName = file.name;
    recoveryProfileName.textContent = `${file.name} · ready for explicit application`;
    updateRecoveryControls();
  } catch (error) {
    selectedRecoveryProfileJson = null;
    selectedRecoveryProfileName = null;
    recoveryProfileName.textContent = "No valid profile selected";
    recoveryHelp.textContent = `Could not load recovery profile: ${error.message ?? error}`;
    updateRecoveryControls();
  }
});
allowLossy.addEventListener("change", updateRecoveryControls);
applyRecoveryButton.addEventListener("click", applySelectedRecovery);
version.addEventListener("change", () => {
  clearRecoveryResult();
  updateRecoveryControls();
});
fileInput.addEventListener("change", async () => {
  const [file] = fileInput.files;
  if (!file) return;
  const totalStart = performance.now();
  const jsHeapSamples = [];
  recordJavaScriptHeapSample(jsHeapSamples, "before_file_read");
  const fileReadStart = performance.now();
  const text = await file.text();
  const fileReadMs = performance.now() - fileReadStart;
  recordJavaScriptHeapSample(jsHeapSamples, "after_file_read");
  if (file.size > LARGE_INPUT_BYTES) {
    input.value = "";
    input.placeholder = `${file.name} loaded (${formatBytes(file.size)}). The large file is analyzed without filling the editor.`;
    inputHelp.textContent = "Large input stays local and out of the editor to keep the page responsive. Upload it again if you want to re-run the analysis.";
  } else {
    input.value = text;
    input.placeholder = "";
    inputHelp.textContent = DEFAULT_INPUT_HELP;
  }
  inputLabel = file.name;
  fileName.textContent = `${file.name} loaded · analyzing…`;
  await analyzeCurrentInput(text, { totalStart, fileReadMs, jsHeapSamples });
  // Allow the same retained snapshot to be selected again for a controlled repeat.
  fileInput.value = "";
});
document.querySelector("#analyze").addEventListener("click", () => analyzeCurrentInput());
loadUrlButton.addEventListener("click", loadFeedUrl);
workspaceNavLinks.forEach((link) => link.addEventListener("click", (event) => {
  const target = document.querySelector(link.getAttribute("href"));
  if (!target || target.hidden) return;
  event.preventDefault();
  workspaceNavLinks.forEach((item) => item.classList.toggle("active", item === link));
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", link.getAttribute("href"));
}));
feedUrl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadFeedUrl();
  }
});
loadMoreRules.addEventListener("click", () => {
  ruleVisibleLimit += COVERAGE_PAGE_SIZE;
  if (latestReport) renderRuleResults(latestReport);
});
diagnosticFilter.addEventListener("change", () => {
  diagnosticVisibleLimit = DIAGNOSTICS_PAGE_SIZE;
  if (latestReport) renderDiagnostics(latestReport);
});
diagnosticSearch.addEventListener("input", () => {
  diagnosticVisibleLimit = DIAGNOSTICS_PAGE_SIZE;
  if (latestReport) renderDiagnostics(latestReport);
});
loadMoreDiagnostics.addEventListener("click", () => {
  diagnosticVisibleLimit += DIAGNOSTICS_PAGE_SIZE;
  if (latestReport) renderDiagnostics(latestReport);
});
function requestMapDiagnostic(index) {
  const diagnostic = latestReport?.diagnostics?.[index];
  if (diagnostic) window.dispatchEvent(new CustomEvent("roadlint-focus-diagnostic", { detail: { diagnostic } }));
}
diagnostics.addEventListener("click", (event) => {
  const item = event.target.closest("[data-diagnostic-index]");
  if (item) requestMapDiagnostic(Number(item.dataset.diagnosticIndex));
});
diagnostics.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const item = event.target.closest("[data-diagnostic-index]");
  if (item) { event.preventDefault(); requestMapDiagnostic(Number(item.dataset.diagnosticIndex)); }
});
document.querySelector("#download-report").addEventListener("click", () => {
  if (!latestReport) return;
  const blob = new Blob([JSON.stringify(latestReport, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "roadlint-report.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});
document.querySelector("#set-report-baseline").addEventListener("click", () => {
  if (latestReport) setComparisonSlot("baseline", latestReport, "Latest analyzed report");
});
document.querySelector("#set-report-current").addEventListener("click", () => {
  if (latestReport) setComparisonSlot("current", latestReport, "Latest analyzed report");
});
baselineReportFile.addEventListener("change", () => {
  loadReportForComparison(baselineReportFile.files[0], "baseline");
});
currentReportFile.addEventListener("change", () => {
  loadReportForComparison(currentReportFile.files[0], "current");
});
compareReportsButton.addEventListener("click", compareLoadedReports);
downloadRecoveryRawButton.addEventListener("click", () => {
  downloadJson(latestRecoveryEnvelope?.raw_report, "roadlint-recovery-raw-report.json");
});
downloadRecoveryPostButton.addEventListener("click", () => {
  downloadJson(latestRecoveryEnvelope?.post_report, "roadlint-recovery-post-report.json");
});
downloadRecoveryEnvelopeButton.addEventListener("click", () => {
  downloadJson(latestRecoveryEnvelope, "roadlint-recovery-application-envelope.json");
});
setRecoveryPostCurrentButton.addEventListener("click", () => {
  if (latestRecoveryEnvelope?.post_report) {
    setComparisonSlot("current", latestRecoveryEnvelope.post_report, "Post-recovery report");
  }
});
diffStateFilter.addEventListener("change", () => {
  diffVisibleLimit = DIFF_PAGE_SIZE;
  if (latestDiff) renderDiffLifecycle(latestDiff);
});
diffSearch.addEventListener("input", () => {
  diffVisibleLimit = DIFF_PAGE_SIZE;
  if (latestDiff) renderDiffLifecycle(latestDiff);
});
loadMoreDiff.addEventListener("click", () => {
  diffVisibleLimit += DIFF_PAGE_SIZE;
  if (latestDiff) renderDiffLifecycle(latestDiff);
});
downloadDiffButton.addEventListener("click", () => {
  if (!latestDiff) return;
  const blob = new Blob([JSON.stringify(latestDiff, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "roadlint-report-diff.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});

document.querySelectorAll("[data-recovery-json]").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    const key = details.dataset.recoveryJson;
    const value = recoveryJsonValues[key];
    const preview = details.querySelector(".json-preview");
    preview.textContent = value === null ? "No post report has been produced." : JSON.stringify(value, null, 2);
  });
});

languageSelect?.addEventListener("change", () => {
  currentLanguage = languageSelect.value === "tr" ? "tr" : "en";
  localStorage.setItem("roadlint-language", currentLanguage);
  applyLanguage();
  if (latestReport) {
    renderSummary(latestReport);
    renderContext(latestReport);
    renderRuleResults(latestReport);
    renderDiagnostics(latestReport);
    renderMeasurements(latestReport);
  }
  if (latestRecoveryEnvelope) renderRecoverySummary(latestRecoveryEnvelope);
  updateRecoveryControls();
  if (latestDiff) {
    renderDiffSummary(latestDiff);
    renderDiffContext(latestDiff);
    renderDiffLifecycle(latestDiff);
    renderDiffRuleChanges(latestDiff);
  }
});
themeToggle?.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme();
});

applyTheme();
applyLanguage();
input.placeholder = currentLanguage === "tr" ? "WZDx Work Zone Feed JSON’unu buraya yapıştırın veya yukarıdaki yerel dosyayı kullanın." : "Paste a complete WZDx Work Zone Feed JSON here, or use a local file above.";
if (measurementExample !== "florida-2026-08-19") {
  input.value = "";
  inputLabel = "Inline input";
  fileName.textContent = "No file selected";
  resultPanel.hidden = true;
}
try {
  const wasmInitializationStart = performance.now();
  await init();
  wasmInitializationMs = performance.now() - wasmInitializationStart;
  wasmReady = true;
  runtimeNote.textContent = currentLanguage === "tr" ? "Rust/WASM analyzer hazır · yalnızca yerel analiz" : "Rust/WASM analyzer ready · local-only analysis";
  updateComparisonControls();
  if (measurementExample === "florida-2026-08-19") {
    await loadBundledExample(
      "../../tests/feeds/registry/2026-08-19/florida-fldot-v4.2.geojson",
      "Florida 2026-08-19 measurement input",
    );
  } else if (input.value.trim()) {
    analyzeCurrentInput();
  }
} catch (error) {
  runtimeNote.textContent = `WASM bundle not found. Build the test page first: ${error}`;
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}
