/* Requiem World — Bubble API Connected app.js */

const ION_TOKEN =
  (typeof process !== "undefined" && process?.env?.CESIUM_ION_TOKEN) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZjljNTU2NC02MDA5LTQxYTAtYjA0NS1iZThiYjNhNmExMzMiLCJpZCI6MzQ2OTYxLCJpYXQiOjE3NTk1MjYyMjF9.jBCAWAheNm9PCh-5Cn8cx3yGlyj3dVTmlOgLuQZiSME";

const BUBBLE_CANDLE_API =
  "https://requiemlegacy.com/version-test/api/1.1/obj/candle";

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
  temp_private: ASSETS.candles.lockedTemporary,
  temp_public: ASSETS.candles.unlockedTemporary,
  perm_private: ASSETS.candles.lockedPermanent,
  perm_public: ASSETS.candles.unlockedPermanent,
  baseline_universal: ASSETS.candles.unlockedPermanent,
  baseline_christian: ASSETS.candles.unlockedPermanent,
  baseline_catholic: ASSETS.candles.unlockedPermanent,
};
function getUserFaithTrack() {
  const params = new URLSearchParams(window.location.search);
  return String(
    params.get("faith") ||
      window.REQUIEM_FAITH_TRACK ||
      "universal"
  ).toLowerCase();
}

function canSeeBaseline(layer) {
  const userTrack = getUserFaithTrack();
  const candleLayer = String(layer || "universal").toLowerCase();

  if (userTrack === "catholic") return true;
  if (userTrack === "christian") {
    return candleLayer === "universal" || candleLayer === "christian";
  }
  return candleLayer === "universal";
}

function b(id, name, layer, type, lat, lon) {
  return {
    id: `baseline-${id}`,
    candle_id: `baseline-${id}`,
    displayName: name,
    visibility: "Baseline",
    isBaseline: true,
    baselineLayer: layer,
    baselineType: type,
    candleKey: `baseline_${layer}`,
    cesium_latitude: lat,
    cesium_longitude: lon,
  };
}

const BASELINE_CANDLES_DISABLED = [
  // UNIVERSAL — literary / storytelling
  b("shakespeare", "William Shakespeare", "universal", "literary", 52.1917, -1.7080),
  b("chaucer", "Geoffrey Chaucer", "universal", "literary", 51.5072, -0.1276),
  b("homer", "Homer", "universal", "literary", 38.4192, 27.1287),
  b("gilgamesh", "The Epic of Gilgamesh", "universal", "literary", 31.3242, 45.6369),
  b("jane-austen", "Jane Austen", "universal", "literary", 51.0608, -1.3131),
  b("tolstoy", "Leo Tolstoy", "universal", "literary", 54.0719, 37.5267),
  b("victor-hugo", "Victor Hugo", "universal", "literary", 48.8566, 2.3522),
  b("stevenson", "Robert Louis Stevenson", "universal", "literary", 55.9533, -3.1883),
  b("beatrix-potter", "Beatrix Potter", "universal", "literary", 54.3809, -2.9060),
  b("aa-milne", "A. A. Milne", "universal", "literary", 51.2362, 0.0345),
  b("dr-seuss", "Dr. Seuss", "universal", "literary", 42.1015, -72.5898),
  b("eb-white", "E. B. White", "universal", "literary", 44.1560, -68.7436),
  b("mark-twain", "Mark Twain", "universal", "literary", 39.7084, -91.3585),
  b("jules-verne", "Jules Verne", "universal", "literary", 47.2184, -1.5536),
  b("laura-ingalls-wilder", "Laura Ingalls Wilder", "universal", "literary", 44.5436, -92.5552),
  b("andersen", "Hans Christian Andersen", "universal", "literary", 55.4038, 10.4024),
  b("tagore", "Rabindranath Tagore", "universal", "literary", 22.5726, 88.3639),
  b("basho", "Matsuo Bashō", "universal", "literary", 35.6762, 139.6503),
  b("murasaki", "Murasaki Shikibu", "universal", "literary", 35.0116, 135.7681),
  b("chinua-achebe", "Chinua Achebe", "universal", "literary", 6.1667, 6.7833),
  b("khalil-gibran", "Khalil Gibran", "universal", "literary", 34.2500, 36.0167),
  b("rumi", "Rumi", "universal", "literary", 37.8715, 32.4846),
  b("sun-tzu", "Sun Tzu", "universal", "literary", 36.6683, 117.0208),

  // UNIVERSAL — dignity / service
  b("florence-nightingale", "Florence Nightingale", "universal", "dignity", 43.7696, 11.2558),
  b("clara-barton", "Clara Barton", "universal", "dignity", 42.2626, -71.8023),
  b("helen-keller", "Helen Keller", "universal", "dignity", 34.7312, -87.7025),
  b("fred-rogers", "Fred Rogers", "universal", "dignity", 40.3015, -79.5389),
  b("anne-frank", "Anne Frank", "universal", "dignity", 52.3676, 4.9041),
  b("harriet-tubman", "Harriet Tubman", "universal", "dignity", 42.9317, -76.5661),
  b("raoul-wallenberg", "Raoul Wallenberg", "universal", "dignity", 59.3293, 18.0686),
  b("irena-sendler", "Irena Sendler", "universal", "dignity", 52.2297, 21.0122),
  b("wangari-maathai", "Wangari Maathai", "universal", "dignity", -0.4167, 36.9500),

  // UNIVERSAL — discovery / beauty / achievement
  b("galileo", "Galileo Galilei", "universal", "discovery", 43.7228, 10.4017),
  b("newton", "Isaac Newton", "universal", "discovery", 52.8090, -0.6280),
  b("kepler", "Johannes Kepler", "universal", "discovery", 48.7758, 9.1829),
  b("tesla", "Nikola Tesla", "universal", "discovery", 44.5667, 15.3181),
  b("marie-curie", "Marie Curie", "universal", "discovery", 52.2297, 21.0122),
  b("pasteur", "Louis Pasteur", "universal", "discovery", 47.0920, 5.4890),
  b("jonas-salk", "Jonas Salk", "universal", "discovery", 40.7128, -74.0060),
  b("avicenna", "Ibn Sina / Avicenna", "universal", "discovery", 39.6542, 66.9597),
  b("al-khwarizmi", "Al-Khwarizmi", "universal", "discovery", 41.3775, 60.3619),

  // UNIVERSAL — music
  b("beethoven", "Ludwig van Beethoven", "universal", "music", 50.7374, 7.0982),
  b("mozart", "Wolfgang Amadeus Mozart", "universal", "music", 47.8095, 13.0550),
  b("chopin", "Frédéric Chopin", "universal", "music", 52.2297, 21.0122),
  b("vivaldi", "Antonio Vivaldi", "universal", "music", 45.4408, 12.3155),
  b("louis-armstrong", "Louis Armstrong", "universal", "music", 29.9511, -90.0715),
  b("duke-ellington", "Duke Ellington", "universal", "music", 38.9072, -77.0369),
  b("ella-fitzgerald", "Ella Fitzgerald", "universal", "music", 37.0871, -76.4730),
  b("johnny-cash", "Johnny Cash", "universal", "music", 35.1473, -90.0489),
  b("miriam-makeba", "Miriam Makeba", "universal", "music", -26.2041, 28.0473),
  b("ravi-shankar", "Ravi Shankar", "universal", "music", 25.3176, 82.9739),
  b("teresa-teng", "Teresa Teng", "universal", "music", 23.6978, 120.9605),
  b("nusrat-fateh-ali-khan", "Nusrat Fateh Ali Khan", "universal", "music", 31.4504, 73.1350),
  b("villa-lobos", "Heitor Villa-Lobos", "universal", "music", -22.9068, -43.1729),

  // UNIVERSAL — art
  b("leonardo", "Leonardo da Vinci", "universal", "art", 43.7833, 10.9167),
  b("michelangelo", "Michelangelo", "universal", "art", 43.7711, 11.2486),
  b("raphael", "Raphael", "universal", "art", 43.7262, 12.6363),
  b("donatello", "Donatello", "universal", "art", 43.7711, 11.2486),
  b("rembrandt", "Rembrandt", "universal", "art", 52.1601, 4.4970),
  b("vermeer", "Vermeer", "universal", "art", 52.0116, 4.3571),
  b("monet", "Claude Monet", "universal", "art", 49.0756, 1.5339),
  b("van-gogh", "Vincent van Gogh", "universal", "art", 51.4381, 5.4752),
  b("hokusai", "Hokusai", "universal", "art", 35.6762, 139.6503),
  b("rockwell", "Norman Rockwell", "universal", "art", 42.2876, -73.3204),
  b("okeeffe", "Georgia O’Keeffe", "universal", "art", 35.6870, -105.9378),

  // UNIVERSAL — olympians
  b("jesse-owens", "Jesse Owens", "universal", "olympian", 33.5207, -86.8025),
  b("wilma-rudolph", "Wilma Rudolph", "universal", "olympian", 36.5298, -87.3595),
  b("emil-zatopek", "Emil Zátopek", "universal", "olympian", 49.8209, 18.2625),
  b("paavo-nurmi", "Paavo Nurmi", "universal", "olympian", 60.4518, 22.2666),
  b("mark-spitz", "Mark Spitz", "universal", "olympian", 38.2542, -85.7594),
  b("peggy-fleming", "Peggy Fleming", "universal", "olympian", 37.7749, -122.4194),
  b("eric-heiden", "Eric Heiden", "universal", "olympian", 43.0731, -89.4012),

  // CHRISTIAN — scripture
  b("adam", "Adam", "christian", "scripture", 31.7683, 35.2137),
  b("eve", "Eve", "christian", "scripture", 31.7683, 35.2137),
  b("noah", "Noah", "christian", "scripture", 39.7020, 44.2990),
  b("abraham", "Abraham", "christian", "scripture", 31.5240, 35.1107),
  b("sarah", "Sarah", "christian", "scripture", 31.5240, 35.1107),
  b("isaac", "Isaac", "christian", "scripture", 31.5240, 35.1107),
  b("jacob", "Jacob", "christian", "scripture", 31.5240, 35.1107),
  b("joseph-ot", "Joseph", "christian", "scripture", 30.0444, 31.2357),
  b("moses", "Moses", "christian", "scripture", 28.5392, 33.9756),
  b("miriam", "Miriam", "christian", "scripture", 28.5392, 33.9756),
  b("ruth", "Ruth", "christian", "scripture", 31.7054, 35.2024),
  b("david", "David", "christian", "scripture", 31.7683, 35.2137),
  b("solomon", "Solomon", "christian", "scripture", 31.7683, 35.2137),
  b("elijah", "Elijah", "christian", "scripture", 32.7940, 35.0150),
  b("esther", "Esther", "christian", "scripture", 34.7980, 48.5150),
  b("isaiah", "Isaiah", "christian", "scripture", 31.7683, 35.2137),
  b("jeremiah", "Jeremiah", "christian", "scripture", 31.7683, 35.2137),
  b("daniel", "Daniel", "christian", "scripture", 32.1942, 48.2436),
  b("job", "Job", "christian", "scripture", 30.5852, 36.2384),
  b("jonah", "Jonah", "christian", "scripture", 36.3400, 43.1300),

  // CHRISTIAN — apostolic / early
  b("saint-joseph", "Saint Joseph", "christian", "apostolic", 32.6996, 35.3035),
  b("mary-magdalene", "Mary Magdalene", "christian", "apostolic", 32.8333, 35.5167),
  b("john-the-baptist", "John the Baptist", "christian", "apostolic", 31.7683, 35.2137),
  b("lazarus", "Lazarus", "christian", "apostolic", 31.7707, 35.2637),
  b("peter-apostle", "Peter", "christian", "apostolic", 41.9028, 12.4534),
  b("andrew-apostle", "Andrew", "christian", "apostolic", 40.6401, 22.9444),
  b("james-apostle", "James", "christian", "apostolic", 42.8805, -8.5457),
  b("john-apostle", "John", "christian", "apostolic", 37.9390, 27.3410),
  b("thomas-apostle", "Thomas", "christian", "apostolic", 13.0827, 80.2707),
  b("matthew-apostle", "Matthew", "christian", "apostolic", 32.7940, 34.9896),
  b("stephen-martyr", "Stephen", "christian", "apostolic", 31.7683, 35.2137),
  b("timothy", "Timothy", "christian", "apostolic", 39.9208, 32.8541),
  b("barnabas", "Barnabas", "christian", "apostolic", 35.1856, 33.3823),
  b("lydia", "Lydia", "christian", "apostolic", 41.0112, 24.2867),
  b("priscilla-aquila", "Priscilla and Aquila", "christian", "apostolic", 41.9028, 12.4964),

  // CHRISTIAN — theology / writers / witness
  b("augustine", "Saint Augustine", "christian", "theology", 36.9000, 7.7667),
  b("athanasius", "Saint Athanasius", "christian", "theology", 31.2001, 29.9187),
  b("chrysostom", "Saint John Chrysostom", "christian", "theology", 41.0082, 28.9784),
  b("basil", "Saint Basil the Great", "christian", "theology", 38.7205, 35.4826),
  b("gregory-nazianzus", "Saint Gregory of Nazianzus", "christian", "theology", 38.3500, 34.0300),
  b("irenaeus", "Saint Irenaeus", "christian", "theology", 45.7640, 4.8357),
  b("justin-martyr", "Saint Justin Martyr", "christian", "theology", 32.2211, 35.2544),
  b("ignatius-antioch", "Saint Ignatius of Antioch", "christian", "theology", 36.2021, 36.1600),
  b("jerome", "Saint Jerome", "christian", "theology", 31.7054, 35.2024),
  b("ephrem", "Saint Ephrem the Syrian", "christian", "theology", 36.8479, 40.0500),
  b("cs-lewis", "C. S. Lewis", "christian", "christian_writer", 54.5973, -5.9301),
  b("george-macdonald", "George MacDonald", "christian", "christian_writer", 57.1497, -2.0943),
  b("dostoevsky", "Fyodor Dostoevsky", "christian", "christian_writer", 59.9311, 30.3609),
  b("kierkegaard", "Søren Kierkegaard", "christian", "christian_writer", 55.6761, 12.5683),
  b("john-bunyan", "John Bunyan", "christian", "christian_writer", 52.1357, -0.4667),
  b("bonhoeffer", "Dietrich Bonhoeffer", "christian", "witness", 52.5200, 13.4050),
  b("corrie-ten-boom", "Corrie ten Boom", "christian", "witness", 52.3874, 4.6462),
  b("wurmbrand", "Richard Wurmbrand", "christian", "witness", 44.4268, 26.1025),
  b("watchman-nee", "Watchman Nee", "christian", "witness", 31.2304, 121.4737),
  b("jesus-christ", "Jesus Christ", "christian", "sacred_center", 31.7683, 35.2137),

  // CATHOLIC — saints / mystics / doctors / popes
  b("francis-assisi", "Saint Francis of Assisi", "catholic", "saint", 43.0707, 12.6170),
  b("clare-assisi", "Saint Clare of Assisi", "catholic", "saint", 43.0707, 12.6170),
  b("benedict", "Saint Benedict", "catholic", "saint", 41.4900, 13.8130),
  b("dominic", "Saint Dominic", "catholic", "saint", 41.9028, 12.4964),
  b("ignatius-loyola", "Saint Ignatius of Loyola", "catholic", "saint", 43.1730, -2.2810),
  b("anthony-padua", "Saint Anthony of Padua", "catholic", "saint", 45.4064, 11.8768),
  b("padre-pio", "Saint Padre Pio", "catholic", "saint", 41.7060, 15.7277),
  b("maximilian-kolbe", "Saint Maximilian Kolbe", "catholic", "saint", 50.0347, 19.1783),
  b("gianna-molla", "Saint Gianna Beretta Molla", "catholic", "saint", 45.4700, 8.8800),
  b("damien-molokai", "Saint Damien of Molokai", "catholic", "saint", 21.1893, -156.9840),
  b("vincent-de-paul", "Saint Vincent de Paul", "catholic", "saint", 43.7102, -1.0537),
  b("joan-of-arc", "Saint Joan of Arc", "catholic", "saint", 48.4439, 5.6750),
  b("cecilia", "Saint Cecilia", "catholic", "saint", 41.9028, 12.4964),
  b("therese-lisieux", "Saint Thérèse of Lisieux", "catholic", "mystic", 49.1466, 0.2293),
  b("teresa-avila", "Saint Teresa of Ávila", "catholic", "mystic", 40.6567, -4.6812),
  b("john-cross", "Saint John of the Cross", "catholic", "mystic", 41.7667, -2.4667),
  b("hildegard", "Saint Hildegard of Bingen", "catholic", "mystic", 49.9667, 7.9000),
  b("faustina", "Saint Faustina Kowalska", "catholic", "mystic", 52.2297, 21.0122),
  b("aquinas", "Saint Thomas Aquinas", "catholic", "theologian", 41.4920, 13.8330),
  b("bonaventure", "Saint Bonaventure", "catholic", "theologian", 42.6300, 12.1100),
  b("anselm", "Saint Anselm", "catholic", "theologian", 45.7370, 7.3200),
  b("gregory-great", "Pope Saint Gregory the Great", "catholic", "pope", 41.9028, 12.4964),
  b("leo-great", "Pope Saint Leo the Great", "catholic", "pope", 41.9028, 12.4964),
  b("john-paul-ii", "Pope Saint John Paul II", "catholic", "pope", 49.8833, 19.4930),
  b("benedict-xvi", "Pope Benedict XVI", "catholic", "pope", 48.1351, 12.5820),
  b("john-xxiii", "Pope Saint John XXIII", "catholic", "pope", 45.6648, 9.5780),
  b("leo-xiii", "Pope Leo XIII", "catholic", "pope", 41.9028, 12.4964),
  b("newman", "Saint John Henry Newman", "catholic", "theologian", 52.4862, -1.8904),
  b("fulton-sheen", "Fulton Sheen", "catholic", "theologian", 40.6936, -89.5889),
  b("edith-stein", "Saint Edith Stein", "catholic", "theologian", 51.1079, 17.0385),
  b("mother-angelica", "Mother Angelica", "catholic", "modern_witness", 33.5186, -86.8104),
  b("carlo-acutis", "Carlo Acutis", "catholic", "modern_witness", 45.4642, 9.1900),
  b("pier-giorgio", "Pier Giorgio Frassati", "catholic", "modern_witness", 45.0703, 7.6869),
  b("josephine-bakhita", "Saint Josephine Bakhita", "catholic", "global_saint", 12.8628, 30.2176),
  b("andrew-kim", "Saint Andrew Kim Taegon", "catholic", "global_saint", 36.3504, 127.3845),
  b("lorenzo-ruiz", "Saint Lorenzo Ruiz", "catholic", "global_saint", 14.5995, 120.9842),
  b("alphonsa", "Saint Alphonsa", "catholic", "global_saint", 9.5916, 76.5222),
  b("rose-lima", "Saint Rose of Lima", "catholic", "global_saint", -12.0464, -77.0428),
  b("martin-de-porres", "Saint Martín de Porres", "catholic", "global_saint", -12.0464, -77.0428),
  b("juan-diego", "Saint Juan Diego", "catholic", "global_saint", 19.4847, -99.1171),
  b("mary-mackillop", "Saint Mary MacKillop", "catholic", "global_saint", -37.8136, 144.9631),
  b("kateri", "Saint Kateri Tekakwitha", "catholic", "global_saint", 42.9334, -74.3430),
  b("seton", "Saint Elizabeth Ann Seton", "catholic", "global_saint", 39.7045, -77.3269),
  b("drexel", "Saint Katharine Drexel", "catholic", "global_saint", 39.9526, -75.1652),
];

window.parent.postMessage(
  {
    source: "requiem-world",
    type: "READY_FOR_CANDLES"
  },
  "*"
);

window.addEventListener("message", (event) => {
  if (!event.data) return;

 console.log("MESSAGE RECEIVED", event.data);

if (event.data.source !== "requiem-bubble") return;
  if (event.data.type !== "LOAD_CANDLES") return;

 window.REQUIEM_CANDLES = event.data.candles || [];

console.log("World received " + window.REQUIEM_CANDLES.length + " candles");

setTimeout(() => {
  if (typeof buildLayers === "function") {
    buildLayers();
  }

  if (viewer) {
    viewer.scene.requestRender();
  }
}, 500);
});
const AUDIO_BY_MOOD = {
  reflective: ASSETS.audio.reflective,
  hopeful: ASSETS.audio.hopeful,
  mourning: ASSETS.audio.mourning,
  grateful: ASSETS.audio.grateful,
};

const DEFAULT_MOOD = "reflective";
const MOODS = ["reflective", "hopeful", "mourning", "grateful"];

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

let bubbleApiCandles = null;

function isAllSoulsDay(date = new Date()) {
  return date.getMonth() === 10 && date.getDate() === 2;
}

function isTrueValue(value) {
  return (
    value === true ||
    value === 1 ||
    String(value || "").toLowerCase() === "true" ||
    String(value || "").toLowerCase() === "yes"
  );
}

function isTemporaryCandleActive(c) {
  if (isAllSoulsDay()) return true;

  const isTemporary =
    isTrueValue(c.is_temporary_boolean) ||
    isTrueValue(c.is_temporary) ||
    isTrueValue(c.has_expiry_boolean) ||
    isTrueValue(c.has_expiry);

  if (!isTemporary) return true;

  const expiresAt =
    c.temp_expires_at_date ||
    c.temp_expires_at ||
    c.expires_at_date ||
    c.expires_at;

  if (!expiresAt) return false;

  return new Date(expiresAt) > new Date();
}

async function fetchBubbleCandles() {

  try {
    const res = await fetch(BUBBLE_CANDLE_API);
    const data = await res.json();
    const results = data?.response?.results || [];
    console.log("[Requiem RAW API]", results);

   bubbleApiCandles = results
  .filter((c) =>
    String(c.is_world_ready_boolean).toLowerCase() === "true" ||
    c.is_world_ready_boolean === true ||
    c.is_world_ready_boolean === 1
  )
  .map((c) => {
        const isBaseline =
          c.is_baseline_candle_boolean === true ||
          String(c.world_visibility_text || "").toLowerCase() === "baseline";

     const candleKey = "perm_public";
    
        return {
          id: c._id,
          candle_id: c._id,

          cesium_latitude:
            c.cesium_latitude_number ?? c.lat_number ?? c.lat,

          cesium_longitude:
            c.cesium_longitude_number ??
            c.lon_number ??
            c.lng_number ??
            c.longitude_number,

          displayName:
            c.honoree_display_name_text ||
            c.honoree_name_text ||
            c.title_text ||
            c.owner_display_name_text ||
            "A Beloved Soul",

          visibility:
            c.world_visibility_text ||
            c.visibility_option_visibility ||
            "Private",

          isBaseline,
          baselineLayer: c.baseline_layer_text || null,
          baselineType: c.baseline_type_text || null,

          candleKey,

          ownerId: c.owner_user || c.Creator || null,
        };
      })
      .filter(
        (c) =>
          Number.isFinite(Number(c.cesium_latitude)) &&
          Number.isFinite(Number(c.cesium_longitude))
      );

    console.log("[Requiem] Bubble candles loaded:", bubbleApiCandles.length);
    console.log("[Requiem] Bubble candles:", bubbleApiCandles);

    return bubbleApiCandles;
  } catch (err) {
    console.error("[Requiem] Bubble candle API failed:", err);
    bubbleApiCandles = null;
    return null;
  }
}

function getBubbleCandles() {
  try {
    if (Array.isArray(bubbleApiCandles)) return bubbleApiCandles;

    const arr = window.REQUIEM_CANDLES;
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

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

function hideCard() {
  hide($("card"));
}

function showCard() {
  const card = $("card");
  if (!card) return;

  card.classList.remove("rq-hidden");
  card.style.display = "flex";
  card.style.opacity = "1";
  card.style.pointerEvents = "auto";
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

function blessingLine() {
  return "Because of you, a soul is remembered.";
}

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

function setupSearchUI() {
  const input = $("searchInput");
  if (!input) return;

  input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    const q = input.value.trim().toLowerCase();
    if (!q) return;

    const allCandles = [...layerCloseCandles];

    let found = null;

    for (const entity of allCandles) {
      const name =
        (
          entity?.properties?.displayName?.getValue?.() ??
          entity?.properties?.displayName ??
          ""
        ).toLowerCase();

      if (name.includes(q)) {
        found = entity;
        break;
      }
    }

    if (!found) {
      showNotice(
        "No public candle matched that search.",
        "Search"
      );
      return;
    }

  const pos = found.position.getValue(Cesium.JulianDate.now());
const carto = Cesium.Cartographic.fromCartesian(pos);

const destination = Cesium.Cartesian3.fromRadians(
  carto.longitude,
  carto.latitude,
  90000
);

viewer.camera.flyTo({
  destination,
  duration: 2.6,
  easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  complete: () => {
    setTimeout(() => {
      openCandleCard(found);
    }, 700);
    },
  });
  });
}

let viewer = null;

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
  if (closeOn) {
    visibleAnimEntities = visibleAnimEntities.concat(
      layerCloseAuras,
      layerCloseCandles
    );
  }
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

  const bubbleCandles = window.REQUIEM_CANDLES || [];
  
  const realCandles = bubbleCandles
  ? bubbleCandles
      .map((c) => ({
        lon: Number(c.cesium_longitude ?? c.lon ?? c.longitude ?? c.lng),
        lat: Number(c.cesium_latitude ?? c.lat ?? c.latitude),
        c,
      }))
      .filter(
        (x) =>
          Number.isFinite(Number(x.lon)) &&
          Number.isFinite(Number(x.lat))
      )
  : [];

const baselineCandles = []
.filter((c) =>
  String(c.is_world_ready_boolean).toLowerCase() === "true" ||
  c.is_world_ready_boolean === true ||
  c.is_world_ready_boolean === 1
)
  .map((c) => ({
    lon: Number(c.cesium_longitude),
    lat: Number(c.cesium_latitude),
    c,
  }));

const pts = [...realCandles, ...baselineCandles];
  
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
      if (i % 11 === 0) candleKey = "temp_private";
      else if (i % 9 === 0) candleKey = "perm_private";
      else if (i % 4 === 0) candleKey = "perm_public";
    }

    const img = CANDLE_IMG[candleKey] || CANDLE_IMG.perm_public;

    const isLocked =
      candleKey === "temp_private" ||
      candleKey === "perm_private" ||
      String(p.c?.visibility || "").toLowerCase() === "private";

    const candleId = String(p.c?.id ?? p.c?.candle_id ?? `demo-${i}`);
    const ownerId =
      String(p.c?.ownerId ?? p.c?.owner_user ?? p.c?.owner ?? "") || null;

    const displayName =
      (p.c?.displayName ||
        p.c?.honoree_display_name ||
        p.c?.honoree_full_name ||
        pickDemoName(i)) + (p.c ? "" : ` ${i + 1}`);

    const visibility = String(p.c?.visibility ?? "").toLowerCase();
    const isPublicFlag =
      visibility === "public" ||
      visibility === "baseline" ||
      (!visibility && !isLocked);

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
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
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
        isBaseline: p.c?.isBaseline || false,
        baselineLayer: p.c?.baselineLayer || null,
        baselineType: p.c?.baselineType || null,
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

  const visibility =
    entity?.properties?.isPublicFlag?.getValue?.() ??
    entity?.properties?.isPublicFlag ??
    false;

  const locked = key === "temp_private" || key === "perm_private";

  if (visibility) return true;
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

function flyToGroundView(entity) {
  if (!viewer || !entity) return;

  const now = Cesium.JulianDate.now();
  const pos = entity.position.getValue(now);
  if (!pos) return;

  const carto = Cesium.Cartographic.fromCartesian(pos);

  const lon = Cesium.Math.toDegrees(carto.longitude);
  const lat = Cesium.Math.toDegrees(carto.latitude);

  // Camera position slightly behind candle
  const cameraOffset = Cesium.Cartesian3.fromDegrees(
    lon,
    lat - 0.0018,
    120
  );

  const candleTarget = Cesium.Cartesian3.fromDegrees(
    lon,
    lat,
    28
  );

  viewer.camera.flyTo({
    destination: cameraOffset,

    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-12),
      roll: 0,
    },

    duration: 2.8,

    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,

    complete: () => {
      viewer.camera.lookAt(
        candleTarget,
        new Cesium.HeadingPitchRange(
          0,
          Cesium.Math.toRadians(-8),
          140
        )
      );

      setTimeout(() => {
        viewer.camera.lookAtTransform(
          Cesium.Matrix4.IDENTITY
        );
      }, 100);
    },
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
  entity?.candleKey ??
  "perm_public";

  const candleId =
    entity?.properties?.candleId?.getValue?.() ??
    entity?.properties?.candleId ??
    null;

  const isBaseline =
    entity?.properties?.isBaseline?.getValue?.() ??
    entity?.properties?.isBaseline ??
    false;

  const img = CANDLE_IMG[candleKey] || CANDLE_IMG.perm_public;
  const publicEffective = isPublicEffective(entity);
  const saved = isSavedCandleId(candleId);

  const typeLabel = isBaseline
    ? "Baseline Candle"
    : candleKey === "perm_public" || candleKey === "perm_private"
      ? "Permanent Candle"
      : candleKey === "temp_public" || candleKey === "temp_private"
        ? "Temporary Candle"
        : "Candle";

  const displayName = readDisplayName(entity);
  const title = publicEffective ? displayName || typeLabel : "Private Candle";

  let subtitle = publicEffective
    ? `${typeLabel} • Public candle\nSome candles are public. Some are private. Dignity is always equal.`
    : "Details are privately held. The light remains.";

  if (isBaseline) {
    subtitle = "A seeded light in the World of Remembrance.";
  }

  if (saved && publicEffective) {
    subtitle += "\nSaved candles glow slightly brighter.";
  }

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

 if (!publicEffective) {
  if (cardTitle) cardTitle.textContent = "Private Remembrance";

  if (cardSubtitle) {
    cardSubtitle.innerHTML = `
      <strong>Someone mattered.</strong><br>
      <strong>Someone is remembered.</strong><br><br>
      Privacy is respected.<br>
      Worth is unchanged.<br><br>
      <strong>Dignity is always equal.</strong>
    `;
  }

  if (actions) actions.innerHTML = "";

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
  console.log("VIEW MEMORY CARD CLICKED: " + candleId);

  window.parent.postMessage(
    {
      source: "requiem-world",
      type: "OPEN_MEMORY_CARD",
      candleId: String(candleId || "")
    },
    "*"
  );

  hideCard();
});

 addBtn("Ground View", () => {
  hideCard();
  flyToGroundView(entity);
});

addBtn(
  "Return",
  () => {
    hideCard();
    returnToHome();
  },
  true
);

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

const card = $("card");
if (card && !card.classList.contains("rq-hidden")) return;

openCandleCard(candleEntity);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

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

function zoomStep(isIn) {
  if (!viewer) return;

  const carto = viewer.camera.positionCartographic;
  const h = carto?.height ?? CAMERA_HOME.height;
  const step = clamp(h * 0.22, 30, 4200000);

  if (isIn) viewer.camera.zoomIn(step);
  else viewer.camera.zoomOut(step);

  viewer.scene.requestRender();
}

async function initCesium() {
  if (typeof Cesium === "undefined") {
    showNotice(
      "Cesium did not load. Make sure Cesium is included before app.js.",
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

 // await fetchBubbleCandles();

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

function setupUI() {
  wireModalClose("notice", "noticeClose");
  wireModalClose("card", "cardClose");

  const arrival = $("arrival");
  if (arrival) arrival.style.pointerEvents = "auto";
}

async function boot() {
  setupUI();
  setupAudioUI();
  setupMoodUI();
  setupSearchUI();

  setupArrival();

  await initCesium();
}

boot().catch((e) => {
  console.error("[Requiem boot error]", e);
  showNotice("A startup error occurred. Refresh and try again.", "Error");
});
