* Requiem World — Premium UI + Private Dignity + Ground View Cinematic + High-Lat Zoom Fix (Full app.js)
   Works with your current index.html ids:
   #cesiumContainer, homeBtn, searchInput, moodBtn, audioBtn, zoomInBtn, zoomOutBtn
   arrival: #arrival #enterBtn
   modals: #notice #noticeTitle #noticeBody #noticeClose
           #card #cardTitle #cardSubtitle #cardImg #cardActions #cardClose

   Key updates:
   - Private candle copy: "Details are privately held. The light remains."
   - "Because of you..." used ONLY for actual candle-lighting flows (not Coming Soon)
   - Coming Soon statements upgraded (Memory Card / Garden / My Candles / Stones)
   - Ground View is true ground-level, looking up, candle centered
   - Fix: can’t zoom into higher latitudes (clears constrainedAxis)

   Removed (per your request):
   - Share Candle
   - Copy Candle ID
*/

const ION_TOKEN =
  (typeof process !== "undefined" && process?.env?.CESIUM_ION_TOKEN) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjljNTU2NC02MDA5LTQxYTAtYjA0NS1iZThiYjNhNmExMzMiLCJpZCI6MzQ2OTYxLCJpYXQiOjE3NTk1MjYyMjF9.jBCAWAheNm9PCh-5Cn8cx3yGlyj3dVTmlOgLuQZiSME";

const ASSETS = {
  audio: {
    grateful:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771086108674x366349600830955300/grateful_compressed_96k_mono.mp3",
    hopeful:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771086189468x176430235434081660/hopeful_compressed_96k_mono.mp3",
    reflective:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771086221028x979667938050800300/reflective_compressed_96k_mono.mp3",
    mourning:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771086244458x393917371272855000/mourning_compressed_96k_mono.mp3",
  },
  candles: {
    lockedTemporary:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771086319605x276178634990445600/optimized_locked_votive.png",
    unlockedTemporary:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771087090232x588699361257701600/optimized_unlocked_votive.png",
    lockedPermanent:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771087130166x624090869383513600/locked_candle_cesium_clean%20%281%29.png",
    unlockedPermanent:
      "https://80c256193f5bf7cb9877ffee1793ac37.cdn.bubble.io/f1771087164139x107728698553731340/unlocked_candle_cesium_clean.png",
  },
};

const CANDLE_IMG = {
  temp_locked: ASSETS.candles.lockedTemporary,
  temp_public: ASSETS.candles.unlockedTemporary,
  perm_locked: ASSETS.candles.lockedPermanent,
  perm_public: ASSETS.candles.unlockedPermanent,
};

const AUDIO_BY_MOOD = {
  reflective: ASSETS.audio.reflective,
  hopeful: ASSETS.audio.hopeful,
  mourning: ASSETS.audio.mourning,
  grateful: ASSETS.audio.grateful,
};

const DEFAULT_MOOD = "reflective";
const MOODS = ["reflective", "hopeful", "mourning", "grateful"];

// Bubble-provided identity hooks (optional)
const CURRENT_USER_ID = (() => {
  try {
    return window.REQUIEM_USER_ID || null;
  } catch {
    return null;
  }
})();
const SAVED_CANDLE_IDS = (() => {
  try {
    const arr = window.REQUIEM_SAVED_CANDLE_IDS;
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch {
    return new Set();
  }
})();
function isSavedCandleId(id) {
  return !!(id && SAVED_CANDLE_IDS.has(String(id)));
}

// Optional: Bubble can pass real candle objects later
function getBubbleCandles() {
  try {
    const arr = window.REQUIEM_CANDLES;
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

// ---------- DOM helpers ----------
const $ = (id) => document.getElementById(id);
const on = (id, evt, fn) => $(id)?.addEventListener(evt, fn);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function show(el) {
  el?.classList?.remove("rq-hidden");
}
function hide(el) {
  el?.classList?.add("rq-hidden");
}

function showNotice(bodyText, title = "Notice") {
  const n = $("notice");
  const body = $("noticeBody");
  const t = $("noticeTitle");
  if (t) t.textContent = title;
  if (body) body.textContent = bodyText;
  show(n);
}
function hideNotice() {
  hide($("notice"));
}
function showCard() {
  show($("card"));
}
function hideCard() {
  hide($("card"));
}
function wireModalClose(modalId, closeId) {
  const modal = $(modalId);
  const close = $(closeId);
  close?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    hide(modal);
  });
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) hide(modal);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide(modal);
  });
}

// ---------- Bubble emit ----------
function bubbleEmit(type, payload = {}) {
  const msg = { source: "requiem-world", type, payload };
  try {
    window.parent?.postMessage(msg, "*");
  } catch {}

  try {
    if (type === "VIEW_MEMORY_CARD" && window.bubble_fn_memory_card) {
      window.bubble_fn_memory_card(JSON.stringify(payload));
      return true;
    }
    if (type === "ENTER_MEMORIAL_GARDEN" && window.bubble_fn_enter_garden) {
      window.bubble_fn_enter_garden(JSON.stringify(payload));
      return true;
    }
    if (type === "ADD_TO_MY_CANDLES" && window.bubble_fn_add_to_my_candles) {
      window.bubble_fn_add_to_my_candles(JSON.stringify(payload));
      return true;
    }
    if (type === "BUY_STONE" && window.bubble_fn_buy_stone) {
      window.bubble_fn_buy_stone(JSON.stringify(payload));
      return true;
    }
    if (type === "LIGHT_TEMP_CANDLE" && window.bubble_fn_light_temp_candle) {
      window.bubble_fn_light_temp_candle(JSON.stringify(payload));
      return true;
    }
  } catch {}
  return false;
}

// ✅ “Because of you…” ONLY for candle lighting moments (not Coming Soon)
function blessingLine() {
  return "Because of you, a soul is remembered.";
}

// Premium “In Preparation” copy
const PREP_COPY = {
  MEMORY_CARD: {
    title: "Memory Card — In Preparation",
    body: "A space for names, stories, and details is on its way.",
  },
  MEMORIAL_GARDEN: {
    title: "Memorial Garden — In Preparation",
    body: "A quiet place for stones, notes, and remembrance is on its way.",
  },
  MY_CANDLES: {
    title: "My Candles — In Preparation",
    body: "A personal place to return to the lights you’ve saved.",
  },
  STONES: {
    title: "Requiem Stones — In Preparation",
    body: "A way to leave a quiet mark of presence.",
  },
};

function showPrep(key) {
  const c = PREP_COPY[key] || { title: "In Preparation", body: "On its way." };
  showNotice(c.body, c.title);
}

// ---------- Audio ----------
let bgAudio = null;
let audioUnlocked = false;

function ensureAudioEl() {
  if (bgAudio) return bgAudio;
  bgAudio = document.createElement("audio");
  bgAudio.preload = "auto";
  bgAudio.loop = true;
  bgAudio.volume = 0;
  try {
    bgAudio.crossOrigin = "anonymous";
  } catch {}
  document.body.appendChild(bgAudio);
  return bgAudio;
}

async function fadeVolume(target, ms) {
  if (!bgAudio) return;
  const start = bgAudio.volume ?? 1;
  const t0 = performance.now();
  const dur = Math.max(1, ms);
  return new Promise((resolve) => {
    function tick(now) {
      const p = clamp((now - t0) / dur, 0, 1);
      bgAudio.volume = clamp(start + (target - start) * p, 0, 1);
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

async function unlockAudioOnce() {
  ensureAudioEl();
  if (audioUnlocked) return true;
  try {
    bgAudio.src = AUDIO_BY_MOOD[DEFAULT_MOOD];
    bgAudio.volume = 0;
    const p = bgAudio.play();
    if (p?.catch) await p.catch(() => {});
    audioUnlocked = !bgAudio.paused;
    if (audioUnlocked) {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    }
    return audioUnlocked;
  } catch {
    return false;
  }
}

async function playWithFade() {
  ensureAudioEl();
  try {
    if (!audioUnlocked) await unlockAudioOnce();
    bgAudio.volume = 0;
    await bgAudio.play();
    await fadeVolume(0.85, 2800);
  } catch {
    showNotice("Audio is blocked until you interact. Tap the ♪ button once.");
  }
}

async function pauseWithFade() {
  if (!bgAudio) return;
  try {
    await fadeVolume(0, 300);
  } catch {}
  try {
    bgAudio.pause();
  } catch {}
}

async function setTrack(mood) {
  ensureAudioEl();
  const url = AUDIO_BY_MOOD[mood];
  if (!url) return;
  const wasPlaying = !bgAudio.paused;
  if (wasPlaying) await fadeVolume(0, 200);
  bgAudio.src = url;
  bgAudio.load();
  if (wasPlaying) await playWithFade();
}

function setupAudioUI() {
  on("audioBtn", "click", async () => {
    ensureAudioEl();
    if (!audioUnlocked) await unlockAudioOnce();
    if (bgAudio.paused) await playWithFade();
    else await pauseWithFade();
  });
}

// ---------- Mood ----------
function setupMoodUI() {
  let mood = DEFAULT_MOOD;
  const b = $("moodBtn");
  if (!b) return;
  b.textContent = mood;
  b.addEventListener("click", async () => {
    const i = MOODS.indexOf(mood);
    mood = MOODS[(i + 1) % MOODS.length];
    b.textContent = mood;
    await setTrack(mood);
  });
}

// ---------- Search placeholder ----------
function setupSearchUI() {
  on("searchInput", "keydown", (e) => {
    if (e.key !== "Enter") return;
    showNotice("Search captured. Next step: wire to public candle lookup.");
  });
}

// ---------- Cesium ----------
let viewer = null;

// Camera presets
const CAMERA_HOME = { lon: -30, lat: 20, height: 16000000 };
const CAMERA_ARRIVAL_START = { lon: -30, lat: 20, height: 34000000 };

let enteredOnce = false;
let HOME_VIEW = null;

const MAX_ZOOM_OUT = 30000000;
const MIN_ZOOM_IN = 35;

const LAYER_THRESHOLDS = { FAR: 11000000, MID: 3500000 };

function snapshotCameraView(v) {
  try {
    const c = v.camera.positionCartographic;
    return {
      lon: Cesium.Math.toDegrees(c.longitude),
      lat: Cesium.Math.toDegrees(c.latitude),
      height: c.height,
      heading: v.camera.heading,
      pitch: v.camera.pitch,
      roll: v.camera.roll,
    };
  } catch {
    return null;
  }
}
function flyToView(v, view, duration = 2.4) {
  if (!v || !view) return;
  v.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(view.lon, view.lat, view.height),
    orientation: {
      heading: view.heading ?? v.camera.heading,
      pitch: view.pitch ?? v.camera.pitch,
      roll: view.roll ?? v.camera.roll,
    },
    duration,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}

function getCameraHeight() {
  if (!viewer) return CAMERA_HOME.height;
  const c = viewer.camera.positionCartographic;
  return c?.height ?? CAMERA_HOME.height;
}

// Imagery: OSM fallback + ESRI preferred
function addOSM(v) {
  return v.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c"],
    })
  );
}
async function addESRI(v) {
  const provider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
  );
  return v.imageryLayers.addImageryProvider(provider);
}
async function applyBeautifulImagery(v) {
  if (ION_TOKEN && !ION_TOKEN.includes("PASTE_NEW_ION_TOKEN_HERE")) {
    Cesium.Ion.defaultAccessToken = ION_TOKEN;
  }
  v.imageryLayers.removeAll();
  const osm = addOSM(v);
  try {
    await addESRI(v);
    v.imageryLayers.remove(osm, true);
  } catch {}
  v.scene.globe.enableLighting = true;
  v.scene.highDynamicRange = true;
  v.scene.fog.enabled = false;
}

// ---------- Twinkle + candle layers ----------
let layerFarTwinkles = [];
let layerClusters = [];
let layerCloseCandles = [];
let layerCloseAuras = [];
let visibleAnimEntities = [];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const SEED_REGIONS = [
  { lon: -77, lat: 39, spread: 10, count: 80 },
  { lon: -0.1, lat: 51.5, spread: 12, count: 70 },
  { lon: 78, lat: 22, spread: 14, count: 60 },
  { lon: 139, lat: 35, spread: 10, count: 50 },
  { lon: -46, lat: -23, spread: 12, count: 45 },
];

function makePoints() {
  const pts = [];
  SEED_REGIONS.forEach((r) => {
    for (let i = 0; i < r.count; i++) {
      pts.push({
        lon: r.lon + randomBetween(-r.spread, r.spread),
        lat: r.lat + randomBetween(-r.spread * 0.7, r.spread * 0.7),
      });
    }
  });
  for (let i = 0; i < 120; i++) {
    pts.push({ lon: randomBetween(-180, 180), lat: randomBetween(-65, 65) });
  }
  return pts;
}

function makeAuraDataUrl(size = 160) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const r = size / 2;

  const g = ctx.createRadialGradient(r, r, 0, r, r, r);
  g.addColorStop(0.0, "rgba(255, 220, 160, 0.95)");
  g.addColorStop(0.18, "rgba(255, 205, 130, 0.55)");
  g.addColorStop(0.52, "rgba(255, 190, 110, 0.18)");
  g.addColorStop(1.0, "rgba(255, 190, 110, 0.0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();
  return c.toDataURL("image/png");
}
const AURA_IMG = makeAuraDataUrl(160);

function clearEntities(list) {
  if (!viewer) return;
  for (const e of list) {
    try {
      viewer.entities.remove(e);
    } catch {}
  }
}

function setEntitiesVisible(list, visible) {
  for (const e of list) e.show = visible;
}

function updateLayerVisibility() {
  const h = getCameraHeight();
  const farOn = h > LAYER_THRESHOLDS.FAR;
  const midOn = h <= LAYER_THRESHOLDS.FAR && h > LAYER_THRESHOLDS.MID;
  const closeOn = h <= LAYER_THRESHOLDS.MID;

  setEntitiesVisible(layerFarTwinkles, farOn);
  setEntitiesVisible(layerClusters, midOn);
  setEntitiesVisible(layerCloseAuras, closeOn);
  setEntitiesVisible(layerCloseCandles, closeOn);

  visibleAnimEntities = [];
  if (farOn) visibleAnimEntities = visibleAnimEntities.concat(layerFarTwinkles);
  if (midOn) visibleAnimEntities = visibleAnimEntities.concat(layerClusters);
  if (closeOn)
    visibleAnimEntities = visibleAnimEntities.concat(
      layerCloseAuras,
      layerCloseCandles
    );
}

function pickDemoName(i) {
  const names = [
    "Candle of Remembrance",
    "Beloved Soul",
    "In Loving Memory",
    "A Light in the World",
    "Forever Loved",
  ];
  return names[i % names.length];
}

function buildLayers() {
  if (!viewer) return;

  clearEntities(layerFarTwinkles);
  clearEntities(layerClusters);
  clearEntities(layerCloseAuras);
  clearEntities(layerCloseCandles);

  layerFarTwinkles = [];
  layerClusters = [];
  layerCloseAuras = [];
  layerCloseCandles = [];

  const bubbleCandles = getBubbleCandles();
  const pts = bubbleCandles
    ? bubbleCandles
        .map((c) => ({
          lon:
            Number(c.cesium_longitude ?? c.lon ?? c.longitude ?? c.lng) || null,
          lat: Number(c.cesium_latitude ?? c.lat ?? c.latitude) || null,
          c,
        }))
        .filter((x) => typeof x.lon === "number" && typeof x.lat === "number")
    : makePoints().map((p) => ({ ...p, c: null }));

  layerFarTwinkles = pts.slice(0, 180).map((p) =>
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 0),
      point: {
        pixelSize: 2,
        color: new Cesium.Color(1.0, 0.84, 0.55, 0.55),
        outlineColor: new Cesium.Color(1, 1, 1, 0.12),
        outlineWidth: 1,
        disableDepthTestDistance: 2500000,
      },
      properties: {
        tw: true,
        kind: "far",
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: randomBetween(0.6, 1.2),
        twBase: randomBetween(0.25, 0.55),
        twAmp: randomBetween(0.15, 0.28),
      },
    })
  );

  layerClusters = pts.slice(60, 230).map((p) =>
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 0),
      point: {
        pixelSize: 4,
        color: new Cesium.Color(1.0, 0.82, 0.52, 0.52),
        outlineColor: new Cesium.Color(1, 1, 1, 0.1),
        outlineWidth: 1,
        disableDepthTestDistance: 2500000,
      },
      properties: {
        tw: true,
        kind: "cluster",
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: randomBetween(0.5, 1.0),
        twBase: randomBetween(0.32, 0.58),
        twAmp: randomBetween(0.18, 0.3),
      },
    })
  );

  const HOVER_METERS = 28;

  pts.slice(0, 140).forEach((p, i) => {
    let candleKey = "temp_public";
    if (p.c?.candleKey) candleKey = String(p.c.candleKey);
    else {
      if (i % 11 === 0) candleKey = "temp_locked";
      else if (i % 9 === 0) candleKey = "perm_locked";
      else if (i % 4 === 0) candleKey = "perm_public";
    }

    const img = CANDLE_IMG[candleKey] || CANDLE_IMG.perm_public;
    const isLocked = candleKey === "temp_locked" || candleKey === "perm_locked";

    const candleId = String(p.c?.id ?? p.c?.candle_id ?? `demo-${i}`);
    const ownerId =
      String(p.c?.ownerId ?? p.c?.owner_user ?? p.c?.owner ?? "") || null;

    const displayName =
      (p.c?.honoree_display_name ||
        p.c?.honoree_full_name ||
        p.c?.displayName ||
        pickDemoName(i)) + (p.c ? "" : ` ${i + 1}`);

    const visibility = String(p.c?.visibility ?? "").toLowerCase();
    const isPublicFlag = visibility ? visibility !== "private" : !isLocked;

    const pos = Cesium.Cartesian3.fromDegrees(p.lon, p.lat, HOVER_METERS);

    const aura = viewer.entities.add({
      position: pos,
      billboard: {
        image: AURA_IMG,
        width: 150,
        height: 150,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        disableDepthTestDistance: 900000,
        translucencyByDistance: new Cesium.NearFarScalar(2.0e5, 0.88, 1.6e7, 0),
        scaleByDistance: new Cesium.NearFarScalar(1.5e5, 0.95, 2.2e6, 0.55),
        color: new Cesium.Color(1, 1, 1, 0.38),
      },
      properties: {
        tw: true,
        kind: "aura",
        candleId,
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: randomBetween(0.7, 1.25),
        twBase: randomBetween(0.3, 0.4),
        twAmp: randomBetween(0.14, 0.2),
      },
    });

    const candle = viewer.entities.add({
      position: pos,
      billboard: {
        image: img,
        width: 42,
        height: 42,
        scale: 1.0,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.HorizontalOrigin.BOTTOM,
        disableDepthTestDistance: 900000,
        translucencyByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 1.6e7, 0),
        scaleByDistance: new Cesium.NearFarScalar(2.0e5, 1.0, 2.2e6, 0.65),
        color: new Cesium.Color(1, 1, 1, 1),
      },
      properties: {
        tw: true,
        kind: "candle",
        candleId,
        ownerId,
        candleKey,
        isLocked,
        isPublicFlag,
        displayName,
        honoree_display_name: p.c?.honoree_display_name || null,
        honoree_full_name: p.c?.honoree_full_name || null,
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: randomBetween(0.55, 1.05),
        twBase: randomBetween(0.8, 0.92),
        twAmp: randomBetween(0.06, 0.1),
      },
    });

    layerCloseAuras.push(aura);
    layerCloseCandles.push(candle);
  });

  updateLayerVisibility();
}

// Twinkle loop
let twinkleRunning = false;
function startTwinkleLoop() {
  if (twinkleRunning) return;
  twinkleRunning = true;

  function tick(now) {
    if (!viewer) return;
    const t = now / 1000;

    for (const e of visibleAnimEntities) {
      const p = e.properties;
      if (!p?.tw) continue;

      const phase = p.twPhase?.getValue?.() ?? p.twPhase ?? 0;
      const speed = p.twSpeed?.getValue?.() ?? p.twSpeed ?? 1;
      const base = p.twBase?.getValue?.() ?? p.twBase ?? 0.6;
      const amp = p.twAmp?.getValue?.() ?? p.twAmp ?? 0.2;

      const pulse = base + Math.sin(t * speed + phase) * amp;
      const alpha = clamp(pulse, 0.08, 1.0);

      if (e.point) {
        const c = e.point.color.getValue();
        e.point.color = new Cesium.Color(c.red, c.green, c.blue, alpha);
      }

      if (e.billboard) {
        const kind = p.kind?.getValue?.() ?? p.kind ?? "";
        const candleId = p.candleId?.getValue?.() ?? p.candleId ?? null;
        const saved = isSavedCandleId(candleId);

        if (kind === "aura") {
          const savedBoost = saved ? 0.18 : 0.0;
          const a = clamp(alpha + savedBoost, 0.12, 0.95);
          e.billboard.color = new Cesium.Color(1, 1, 1, a);
          const breathe =
            1.0 + Math.sin(t * speed + phase) * (saved ? 0.09 : 0.07);
          e.billboard.scale = clamp(breathe, 0.92, 1.14);
        }

        if (kind === "candle") {
          const savedLift = saved ? 0.06 : 0.0;
          const a = clamp(
            0.92 + Math.sin(t * speed + phase) * 0.05 + savedLift,
            0.78,
            1.0
          );
          e.billboard.color = new Cesium.Color(1, 1, 1, a);
        }
      }
    }

    viewer.scene.requestRender();
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ---------- Click logic ----------
function isOwnerOfEntity(entity) {
  const ownerId =
    entity?.properties?.ownerId?.getValue?.() ??
    entity?.properties?.ownerId ??
    null;
  return !!(CURRENT_USER_ID && ownerId && CURRENT_USER_ID === ownerId);
}

function isPublicEffective(entity) {
  const key =
    entity?.properties?.candleKey?.getValue?.() ??
    entity?.properties?.candleKey ??
    "perm_public";
  const locked = key === "temp_locked" || key === "perm_locked";
  if (!locked) return true;
  return isOwnerOfEntity(entity);
}

function readDisplayName(entity) {
  const p = entity?.properties;
  const n =
    p?.displayName?.getValue?.() ??
    p?.displayName ??
    p?.honoree_display_name?.getValue?.() ??
    p?.honoree_display_name ??
    p?.honoree_full_name?.getValue?.() ??
    p?.honoree_full_name ??
    null;
  return (n && String(n).trim()) || null;
}

// ✅ Ground View — true ground-level, looking up, candle centered
function flyToGroundView(entity) {
  if (!viewer || !entity) return;

  const now = Cesium.JulianDate.now();
  const pos = entity.position.getValue(now);
  if (!pos) return;

  const carto = Cesium.Cartographic.fromCartesian(pos);
  const lon = carto.longitude;
  const lat = carto.latitude;

  const groundTarget = Cesium.Cartesian3.fromRadians(lon, lat, 2.0);
  const sphere = new Cesium.BoundingSphere(groundTarget, 18.0);

  const heading = viewer.camera.heading;
  const pitchUp = Cesium.Math.toRadians(8);
  const range = 260;

  viewer.camera.flyToBoundingSphere(sphere, {
    duration: 2.25,
    offset: new Cesium.HeadingPitchRange(heading, pitchUp, range),
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}

function openCandleCard(entity) {
  const cardTitle = $("cardTitle");
  const cardSubtitle = $("cardSubtitle");
  const cardImg = $("cardImg");
  const actions = $("cardActions");

  if (cardImg) {
    cardImg.style.width = "92px";
    cardImg.style.height = "92px";
    cardImg.style.objectFit = "contain";
    cardImg.style.filter = "drop-shadow(0 10px 22px rgba(0,0,0,0.35))";
  }

  const candleKey =
    entity?.properties?.candleKey?.getValue?.() ??
    entity?.properties?.candleKey ??
    "perm_public";
  const candleId =
    entity?.properties?.candleId?.getValue?.() ??
    entity?.properties?.candleId ??
    null;

  const img = CANDLE_IMG[candleKey] || CANDLE_IMG.perm_public;
  const publicEffective = isPublicEffective(entity);
  const saved = isSavedCandleId(candleId);

  const typeLabel = (() => {
    if (candleKey === "perm_public" || candleKey === "perm_locked")
      return "Permanent Candle";
    if (candleKey === "temp_public" || candleKey === "temp_locked")
      return "Temporary Candle";
    return "Candle";
  })();

  const displayName = readDisplayName(entity);
  const title = publicEffective ? displayName || typeLabel : "Private Candle";

  let subtitle = publicEffective
    ? `${typeLabel} • Public candle\nSome candles are public. Some are private. Dignity is always equal.`
    : "Details are privately held. The light remains.";

  if (saved && publicEffective)
    subtitle += "\nSaved candles glow slightly brighter.";

  if (cardTitle) cardTitle.textContent = title;
  if (cardSubtitle) cardSubtitle.textContent = subtitle;
  if (cardImg) cardImg.src = img;

  const payload = {
    candleId,
    candleKey,
    displayName,
    ownerId:
      entity?.properties?.ownerId?.getValue?.() ??
      entity?.properties?.ownerId ??
      null,
    isOwner: isOwnerOfEntity(entity),
    isPublicEffective: publicEffective,
    saved,
  };

  function addBtn(label, fn, full = false) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "rq-actionBtn" + (full ? " full" : "");
    b.textContent = label;
    b.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fn();
    });
    actions.appendChild(b);
  }

  if (actions) actions.innerHTML = "";

  function lightTempCandle() {
    hideCard();
    const ok = bubbleEmit("LIGHT_TEMP_CANDLE", payload);
    if (!ok) showNotice(blessingLine(), "Light a Temporary Candle");
  }

  if (!publicEffective) {
    addBtn(
      "Return",
      () => {
        hideCard();
        returnToHome();
      },
      true
    );
    showCard();
    return;
  }

  addBtn("View Memory Card", () => {
    hideCard();
    const ok = bubbleEmit("VIEW_MEMORY_CARD", payload);
    if (!ok) showPrep("MEMORY_CARD");
  });

  if (candleKey === "perm_public" || candleKey === "perm_locked") {
    addBtn("Enter Memorial Garden", () => {
      hideCard();
      const ok = bubbleEmit("ENTER_MEMORIAL_GARDEN", payload);
      if (!ok) showPrep("MEMORIAL_GARDEN");
    });

    addBtn("Add to My Candles", () => {
      hideCard();
      const ok = bubbleEmit("ADD_TO_MY_CANDLES", payload);
      if (!ok) showPrep("MY_CANDLES");
    });

    addBtn("Buy Requiem Stone", () => {
      hideCard();
      const ok = bubbleEmit("BUY_STONE", payload);
      if (!ok) showPrep("STONES");
    });
  }

  addBtn("Ground View", () => {
    hideCard();
    flyToGroundView(entity);
  });

  if (candleKey === "perm_public") {
    addBtn("Light a Temporary Candle", () => lightTempCandle(), true);
  } else {
    addBtn(
      "Return",
      () => {
        hideCard();
        returnToHome();
      },
      true
    );
  }

  showCard();
}

function setupCandleClick() {
  if (!viewer) return;

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((movement) => {
    const picks = viewer.scene.drillPick(movement.position, 8);
    if (!picks || !picks.length) return;

    let candleEntity = null;
    for (const p of picks) {
      const e = p?.id;
      const kind =
        e?.properties?.kind?.getValue?.() ?? e?.properties?.kind ?? "";
      if (kind === "candle") {
        candleEntity = e;
        break;
      }
    }
    if (!candleEntity) return;

    openCandleCard(candleEntity);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// ---------- Arrival ----------
function setupArrival() {
  const arrival = $("arrival");
  const enterBtn = $("enterBtn");

  function hideArrival() {
    if (!arrival) return;
    arrival.style.opacity = "0";
    arrival.style.pointerEvents = "none";
    setTimeout(() => {
      arrival.style.display = "none";
    }, 450);
  }

  if (!enteredOnce) {
    if (arrival) arrival.style.display = "flex";
  } else {
    if (arrival) arrival.style.display = "none";
  }

  enterBtn?.addEventListener("click", async () => {
    if (enteredOnce) return;
    enteredOnce = true;

    hideArrival();

    await unlockAudioOnce();
    playWithFade();

    if (!viewer) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        CAMERA_HOME.lon,
        CAMERA_HOME.lat,
        CAMERA_HOME.height
      ),
      duration: 3.0,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
      complete: () => {
        HOME_VIEW = snapshotCameraView(viewer);
      },
    });

    setTimeout(() => {
      if (viewer && !HOME_VIEW) HOME_VIEW = snapshotCameraView(viewer);
    }, 3600);
  });
}

function returnToHome() {
  if (!viewer) return;
  const arrival = $("arrival");
  if (arrival) arrival.style.display = "none";

  if (HOME_VIEW) flyToView(viewer, HOME_VIEW, 2.2);
  else {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        CAMERA_HOME.lon,
        CAMERA_HOME.lat,
        CAMERA_HOME.height
      ),
      duration: 2.2,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });
  }
}

// ---------- Zoom buttons ----------
function zoomStep(isIn) {
  if (!viewer) return;
  const carto = viewer.camera.positionCartographic;
  const h = carto?.height ?? CAMERA_HOME.height;
  const step = clamp(h * 0.22, 30, 4200000);
  if (isIn) viewer.camera.zoomIn(step);
  else viewer.camera.zoomOut(step);
  viewer.scene.requestRender();
}

// ---------- Init Cesium ----------
async function initCesium() {
  if (typeof Cesium === "undefined") {
    showNotice(
      "Cesium did not load. In CodeSandbox, make sure Cesium is included/available to app.js (dependency + proper setup).",
      "Load Error"
    );
    return;
  }

  if (ION_TOKEN && !ION_TOKEN.includes("PASTE_NEW_ION_TOKEN_HERE")) {
    Cesium.Ion.defaultAccessToken = ION_TOKEN;
  }

  viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    fullscreenButton: false,
    vrButton: false,
    infoBox: false,
    selectionIndicator: false,
    imageryProvider: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    requestRenderMode: true,
    maximumRenderTimeChange: 1 / 30,
  });

  viewer.scene.backgroundColor = Cesium.Color.BLACK;
  viewer.scene.globe.baseColor = Cesium.Color.BLACK;

  viewer.scene.screenSpaceCameraController.minimumZoomDistance = MIN_ZOOM_IN;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = MAX_ZOOM_OUT;

  viewer.scene.screenSpaceCameraController.enableTilt = true;
  viewer.scene.screenSpaceCameraController.enableLook = true;
  viewer.scene.screenSpaceCameraController.enableRotate = true;
  viewer.scene.screenSpaceCameraController.enableZoom = true;
  viewer.scene.screenSpaceCameraController.enableTranslate = true;

  // ✅ FIX: higher latitude zoom/navigation issues
  viewer.scene.screenSpaceCameraController.constrainedAxis = undefined;
  viewer.camera.constrainedAxis = undefined;

  viewer.scene.fog.enabled = false;

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      CAMERA_ARRIVAL_START.lon,
      CAMERA_ARRIVAL_START.lat,
      CAMERA_ARRIVAL_START.height
    ),
  });

  try {
    viewer.cesiumWidget.creditContainer.style.opacity = "0.7";
    viewer.cesiumWidget.creditContainer.style.transform = "scale(0.92)";
  } catch {}

  await applyBeautifulImagery(viewer);

  buildLayers();
  setupCandleClick();
  startTwinkleLoop();

  let raf = null;
  viewer.camera.changed.addEventListener(() => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      updateLayerVisibility();
      viewer.scene.requestRender();
    });
  });

  on("homeBtn", "click", () => returnToHome());
  on("zoomInBtn", "click", () => zoomStep(true));
  on("zoomOutBtn", "click", () => zoomStep(false));
}

// ---------- UI wiring ----------
function setupUI() {
  wireModalClose("notice", "noticeClose");
  wireModalClose("card", "cardClose");

  const arrival = $("arrival");
  if (arrival) arrival.style.pointerEvents = "auto";
}

// ---------- Boot ----------
async function boot() {
  setupUI();
  setupAudioUI();
  setupMoodUI();
  setupSearchUI();

  // Attach the Enter button immediately, even if Cesium takes time to load
  setupArrival();

  await initCesium();
}

boot().catch((e) => {
  console.error("[Requiem boot error]", e);
  showNotice("A startup error occurred. Refresh and try again.", "Error");
});
