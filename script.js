// Floating hearts in the background
const hearts = ["💖", "💕", "💗", "❤️", "💘", "🌹"];

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

// Surprise button
const messages = [
  "I love you more than words can say, Jahnavi 💞",
  "You + Me = Forever 💍",
  "You're my favorite hello and my hardest goodbye 🥰",
  "Thank you for being my everything 🌷",
  "You are, and always will be, the best for me 💖",
];

let i = 0;
const btn = document.getElementById("loveBtn");
const surprise = document.getElementById("surprise");

btn.addEventListener("click", () => {
  surprise.textContent = messages[i % messages.length];
  surprise.style.animation = "none";
  // reflow to restart animation
  void surprise.offsetWidth;
  surprise.style.animation = "rise 0.5s ease-out";
  // burst of hearts
  for (let k = 0; k < 12; k++) setTimeout(spawnHeart, k * 60);
  i++;
});
