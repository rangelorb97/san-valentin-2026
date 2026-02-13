// ===============================
// ELEMENTS
// ===============================
const askScreen = document.getElementById("askScreen");
const timelineScreen = document.getElementById("timelineScreen");

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const imageDisplay = document.getElementById("imageDisplay");
const valentineQuestion = document.getElementById("valentineQuestion");
const responseButtons = document.getElementById("responseButtons");

const timelineTrack = document.getElementById("timelineTrack");
const replayConfetti = document.getElementById("replayConfetti");
const backBtn = document.getElementById("backBtn");

// ===============================
// ASSETS
// ===============================
const imagePaths = [
  "./images/image1.gif",
  "./images/image2.gif",
  "./images/image3.gif",
  "./images/image4.gif",
  "./images/image5.gif",
  "./images/image6.gif",
  "./images/image7.gif",
];

const CLICK_SOUND = "./sounds/click.mp3";
const MUSIC = "./sounds/music.mp3"; // add this file if you want music

// ===============================
// STATE
// ===============================
let noClickCount = 0;

// Music (fade in on YES)
const bgMusic = new Audio(MUSIC);
bgMusic.loop = true;
bgMusic.volume = 0;

// ===============================
// HELPERS
// ===============================
function playSound(soundPath) {
  const audio = new Audio(soundPath);
  audio.play().catch(() => {});
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// ===============================
// SOFT FLOATING HEARTS
// ===============================
const heartsLayer = document.getElementById("heartsLayer");

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💗" : "💖";

  const x = Math.random() * (window.innerWidth - 20);
  heart.style.left = `${x}px`;

  heartsLayer.appendChild(heart);

  const drift = (Math.random() * 80) - 40; // -40..40
  const duration = 5500 + Math.random() * 3000;

  anime({
    targets: heart,
    translateY: -(window.innerHeight + 140),
    translateX: drift,
    opacity: [
      { value: 0.0, duration: 0 },
      { value: 0.55, duration: 700 },
      { value: 0.0, duration: 900, delay: duration - 1600 }
    ],
    duration,
    easing: "linear",
    complete: () => heart.remove()
  });
}
setInterval(spawnHeart, 1200);

// ===============================
// NO BUTTON CLICK LOGIC (back to original style)
// - click "No" => text changes, YES grows, image changes
// - at 4th click, replace with "runaway" button that escapes hover/click
// ===============================
let runawayButtonCreated = false;

function createRunawayButton() {
  if (runawayButtonCreated) return;
  runawayButtonCreated = true;

  const newButton = document.createElement("button");
  newButton.id = "runawayButton";
  newButton.textContent = "NO SE PUEDE UN NOOO";
  newButton.className = "btn btn-no"; // uses your CSS button style

  // Put it near the original buttons area first (without overlapping)
  newButton.style.position = "fixed";
  newButton.style.zIndex = "9999";

  const yesRect = yesButton.getBoundingClientRect();
  const startLeft = yesRect.left + yesRect.width + 14;
  const startTop = yesRect.top;

  newButton.style.left = `${Math.min(startLeft, window.innerWidth - 160)}px`;
  newButton.style.top = `${Math.min(startTop, window.innerHeight - 70)}px`;

  // Replace old No button with runaway
  const oldNo = document.getElementById("noButton");
  if (oldNo) oldNo.replaceWith(newButton);

  const moveButton = () => {
    const maxX = window.innerWidth - newButton.offsetWidth - 10;
    const maxY = window.innerHeight - newButton.offsetHeight - 10;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    anime.remove(newButton);
    anime({
      targets: newButton,
      left: `${newX}px`,
      top: `${newY}px`,
      duration: 450,
      easing: "easeOutCirc",
    });
  };

  // Escape on hover & click
  newButton.addEventListener("mouseover", moveButton);
  newButton.addEventListener("click", () => {
    playSound(CLICK_SOUND);
    moveButton();
  });
}

noButton.addEventListener("click", () => {
  playSound(CLICK_SOUND);

  // increment clicks (cap)
  if (noClickCount < 6) noClickCount++;

  // image changes
  imageDisplay.src = imagePaths[Math.min(noClickCount, imagePaths.length - 1)];

  // YES grows
  const growPx = 22;
  const growFont = 10;

  const curH = parseFloat(getComputedStyle(yesButton).height);
  const curW = parseFloat(getComputedStyle(yesButton).width);
  const curF = parseFloat(getComputedStyle(yesButton).fontSize);

  yesButton.style.height = `${curH + growPx}px`;
  yesButton.style.width = `${curW + growPx}px`;
  yesButton.style.fontSize = `${curF + growFont}px`;

  // NO text changes
  const messages = [
    "No",
    "Segurito?",
    "DEVERASSS?",
    "NO TE CREOOOOO",
    "NO SE PUEDE UN NOOO",
  ];

  // At 4th click => replace with runaway
  if (noClickCount >= 4) {
    createRunawayButton();
  } else {
    noButton.textContent = messages[Math.min(noClickCount, messages.length - 1)];
  }
});

// ===============================
// TIMELINE DATA (EDIT THIS to make it personal)
// ===============================
const timelineItems = [
  { year: "2019", title: "Cádiz ✨", text: "Nos conocimos, y de ahi en adelante...", img: "./images/2019.jpg" },
  { year: "2020", title: "Long distance 💌", text: "A través de intercambios ... ", img: "./images/2020.jpg" },
  { year: "2021", title: "More us", text: "A través de pandemias...", img: "./images/2021.jpg" },
  { year: "2022", title: "Teamwork", text: "En cumpleaños y eventos...", img: "./images/2022.jpg" },
  { year: "2023", title: "Future mode", text: "En salidas y viajes...", img: "./images/2023.jpg" },
  { year: "2024", title: "Today 💍", text: "Descubrimos que eramos el uno para el otro", img: "./images/2024.jpg" },
  { year: "2025", title: "Future mode", text: "Por siempre...", img: "./images/2025.jpg" },
  { year: "2026", title: "Today 💍", text: "...mi San Valentin ♥️ ", img: "./images/2026.jpg" },
];

// ===============================
// BUILD TIMELINE
// NOTE: your HTML/CSS version moved timeline-line into the wrap.
// If your HTML still injects the line here, it won't break anything,
// but ideally remove the line creation here if it's already in HTML.
// ===============================
function renderTimeline() {
  timelineTrack.innerHTML = "";

  timelineItems.forEach((item) => {
    const node = document.createElement("div");
    node.className = "node";

    node.innerHTML = `
      <div class="node-dot"></div>
      <div class="node-title">${item.year} </div>
      <div class="node-text">${item.text}</div>
      ${item.img ? `<img class="node-img" src="${item.img}" alt="${item.title}">` : ""}
    `;

    timelineTrack.appendChild(node);
  });
}
renderTimeline();

// ===============================
// DRAGGABLE TIMELINE (POINTER EVENTS) ✅
// ===============================
let isDragging = false;
let pointerId = null;
let startX = 0;
let startTranslateX = 0;
let currentTranslateX = 0;

function setTrackX(x) {
  currentTranslateX = x;
  timelineTrack.style.transform = `translate3d(${x}px, 0, 0)`;
}

function getDragBounds() {
  const wrap = document.getElementById("timelineWrap");

  const wrapWidth = wrap.clientWidth;
  const trackWidth = timelineTrack.scrollWidth;

  if (trackWidth <= wrapWidth) return { minX: 0, maxX: 0 };

  const minX = -(trackWidth - wrapWidth);
  const maxX = 0;

  return { minX, maxX };
}

timelineTrack.addEventListener("pointerdown", (e) => {
  isDragging = true;
  pointerId = e.pointerId;
  timelineTrack.setPointerCapture(pointerId);

  startX = e.clientX;
  startTranslateX = currentTranslateX;

  timelineTrack.style.cursor = "grabbing";
});

timelineTrack.addEventListener("pointermove", (e) => {
  if (!isDragging || e.pointerId !== pointerId) return;

  const dx = e.clientX - startX;
  const { minX, maxX } = getDragBounds();
  const nextX = clamp(startTranslateX + dx, minX, maxX);

  setTrackX(nextX);
});

function endDrag() {
  if (!isDragging) return;

  isDragging = false;
  timelineTrack.style.cursor = "grab";

  if (pointerId !== null) {
    try {
      timelineTrack.releasePointerCapture(pointerId);
    } catch (_) {}
  }
  pointerId = null;

  const { minX, maxX } = getDragBounds();
  setTrackX(clamp(currentTranslateX, minX, maxX));
}

timelineTrack.addEventListener("pointerup", endDrag);
timelineTrack.addEventListener("pointercancel", endDrag);
timelineTrack.addEventListener("pointerleave", endDrag);

window.addEventListener("resize", () => {
  const { minX, maxX } = getDragBounds();
  setTrackX(clamp(currentTranslateX, minX, maxX));
});

// ===============================
// YES => SHOW TIMELINE + CONFETTI + MUSIC
// ===============================
function fireConfetti() {
  confetti({
    particleCount: 160,
    spread: 95,
    origin: { x: 0.5, y: 0.7 },
    colors: ["#FF5A5F", "#3DCC91", "#FFD1DC"],
  });
}

yesButton.addEventListener("click", async () => {
  playSound(CLICK_SOUND);

  // fade-in music (optional)
  try {
    await bgMusic.play();
    anime({
      targets: bgMusic,
      volume: 0.35,
      duration: 1800,
      easing: "linear"
    });
  } catch (_) {}

  // Switch screens
  askScreen.classList.add("hidden");
  timelineScreen.classList.remove("hidden");

  // Nice entrance animation
  timelineScreen.style.opacity = "0";
  timelineScreen.style.transform = "translateY(10px)";
  anime({
    targets: timelineScreen,
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 520,
    easing: "easeOutCubic"
  });

  fireConfetti();

  // reset timeline position nicely (after layout is visible)
  requestAnimationFrame(() => {
    setTrackX(0);
  });
});

replayConfetti.addEventListener("click", () => {
  playSound(CLICK_SOUND);
  fireConfetti();
});

backBtn.addEventListener("click", () => {
  playSound(CLICK_SOUND);
  timelineScreen.classList.add("hidden");
  askScreen.classList.remove("hidden");

  // stop music softly
  anime.remove(bgMusic);
  anime({
    targets: bgMusic,
    volume: 0,
    duration: 600,
    easing: "linear",
    complete: () => {
      try { bgMusic.pause(); } catch (_) {}
    }
  });
});
