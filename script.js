/* ===========================================================
   For Jahnavi — interactions + music
   =========================================================== */

/* ---------- Floating background hearts ---------- */
const hearts = ["💖", "💕", "💗", "❤️", "💘", "🌹", "💞"];

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 5 + Math.random() * 5 + "s";
  heart.style.fontSize = 1 + Math.random() * 1.5 + "rem";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 10000);
}
setInterval(spawnHeart, 600);

/* ---------- Typing tagline ---------- */
const taglines = [
  "you are the best for me 💖",
  "my favorite person in the world 🌍",
  "my best friend & my home 🏡",
  "the answer to every wish 🌟",
];
const typedEl = document.getElementById("typed");
let tIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const full = taglines[tIdx];
  if (!deleting) {
    typedEl.textContent = full.slice(0, ++cIdx);
    if (cIdx === full.length) { deleting = true; return setTimeout(typeLoop, 1800); }
  } else {
    typedEl.textContent = full.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % taglines.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

/* ---------- Flip-card reasons ---------- */
document.querySelectorAll(".reason").forEach((li) => {
  const front = li.textContent;
  const back = li.dataset.back;
  li.addEventListener("click", () => {
    li.classList.toggle("flipped");
    li.textContent = li.classList.contains("flipped") ? back : front;
    burstAt(li);
  });
});

/* ---------- Surprise button ---------- */
const messages = [
  "I love you more than words can say, Jahnavi 💞",
  "You + Me = Forever 💍",
  "You're my favorite hello and my hardest goodbye 🥰",
  "Thank you for being my everything 🌷",
  "You are, and always will be, the best for me 💖",
];
let i = 0;
const surprise = document.getElementById("surprise");
document.getElementById("loveBtn").addEventListener("click", (e) => {
  surprise.textContent = messages[i % messages.length];
  surprise.style.animation = "none";
  void surprise.offsetWidth;
  surprise.style.animation = "rise 0.5s ease-out";
  for (let k = 0; k < 12; k++) setTimeout(spawnHeart, k * 60);
  i++;
  blip(660);
});

/* ---------- Love meter ---------- */
const meterFill = document.getElementById("meterFill");
const meterText = document.getElementById("meterText");
document.getElementById("meterBtn").addEventListener("click", () => {
  meterFill.style.width = "100%";
  meterText.textContent = "Calculating...";
  setTimeout(() => { meterText.textContent = "∞ %  (it doesn't fit the bar 🥰)"; }, 1900);
  blip(550);
});

/* ---------- Click anywhere = heart burst ---------- */
function burstAt(target) {
  const rect = target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (let k = 0; k < 8; k++) {
    const h = document.createElement("div");
    h.className = "burst-heart";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = x + "px";
    h.style.top = y + "px";
    const ang = (Math.PI * 2 * k) / 8;
    h.style.setProperty("--dx", Math.cos(ang) * 80 + "px");
    h.style.setProperty("--dy", Math.sin(ang) * 80 + "px");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".music-btn")) return;
  const h = document.createElement("div");
  h.className = "burst-heart";
  h.textContent = "💗";
  h.style.left = e.clientX + "px";
  h.style.top = e.clientY + "px";
  h.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
  h.style.setProperty("--dy", "-70px");
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1000);
});

/* ===========================================================
   MUSIC
   - If a real file named song.mp3 sits next to the page, it plays.
   - Otherwise a gentle synth melody plays (no files, no copyright).
   =========================================================== */
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
const songFile = document.getElementById("songFile");

let playing = false;
let audioCtx = null;
let melodyTimer = null;
let useFile = false;

// A simple sweet melody (note frequencies in Hz), played in a loop.
const melody = [
  523, 587, 659, 587, 523, 659, 784, 659,
  587, 523, 587, 659, 523, 0, 440, 523,
];
let noteIdx = 0;

function playNote(freq) {
  if (!freq) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.5);
}

function startSynth() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  melodyTimer = setInterval(() => {
    playNote(melody[noteIdx % melody.length]);
    noteIdx++;
  }, 380);
}

function stopSynth() {
  clearInterval(melodyTimer);
  melodyTimer = null;
}

// Short UI click sound (used by buttons)
function blip(freq) {
  if (!playing || useFile || !audioCtx) return;
  playNote(freq);
}

function setPlaying(state) {
  playing = state;
  musicBtn.classList.toggle("playing", state);
  musicIcon.textContent = state ? "🎶" : "🎵";
}

musicBtn.addEventListener("click", async () => {
  if (!playing) {
    // Try the real song file first
    try {
      await songFile.play();
      useFile = true;
      setPlaying(true);
      return;
    } catch (_) {
      // No file / can't play -> fall back to synth melody
      useFile = false;
      startSynth();
      setPlaying(true);
    }
  } else {
    if (useFile) songFile.pause();
    else stopSynth();
    setPlaying(false);
  }
});
