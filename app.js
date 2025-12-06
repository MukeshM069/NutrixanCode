let points = 0;
let waterCount = 0;
const dailyGoal = 8;
const views = [
  "home",
  "progress",
  "commitment",
  "workout",
  "mental",
  "mood",
  "hydration",
  "sleep",
  "steps",
  "nutrition",
  "timer"
];
let calendarGenerated = false;
let stepsToday = 0;
let calTotal = 0;

const rootEl = document.documentElement;
const darkToggle = document.getElementById("darkToggle");
function applyTheme(theme) {
  const dark = theme === "dark";
  rootEl.classList.toggle("dark", dark);
  darkToggle.setAttribute("aria-pressed", String(dark));
  darkToggle.textContent = dark ? "☀️ Light mode" : "🌙 Dark mode";
  localStorage.setItem("nx_theme", theme);
}
darkToggle.addEventListener("click", () => {
  const next = rootEl.classList.contains("dark") ? "light" : "dark";
  applyTheme(next);
});
applyTheme(
  localStorage.getItem("nx_theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
);

function showSection(id) {
  views.forEach((v) => {
    const el = document.getElementById(v);
    if (el) el.classList.toggle("active", v === id);
  });
  if (id === "commitment" && !calendarGenerated) {
    generateCalendar();
  }
}
document.querySelectorAll("#main-nav [data-section]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(btn.dataset.section);
  });
});
document
  .getElementById("site-title")
  .addEventListener("click", () => showSection("home"));
showSection("home");

const tips = [
  "Eat more fruits and vegetables.",
  "Drink at least 8 glasses of water daily.",
  "Avoid sugary drinks.",
  "Choose whole grains when possible.",
  "Prioritize lean protein at meals.",
  "Carry a water bottle everywhere."
];
function generateTip() {
  const el = document.getElementById("tip-of-the-day");
  if (!el) return;
  const i = Math.floor(Math.random() * tips.length);
  el.textContent = tips[i];
}
const affirmations = [
  "You are capable of achieving greatness.",
  "Every day is a new opportunity for growth.",
  "You have the strength to overcome any challenge.",
  "Believe in yourself; progress compounds.",
  "Small habits make big changes."
];

const mealPlans = {
  vegetarian: ["Tofu veggie stir-fry", "Quinoa & black beans", "Veggie chili"],
  "low-carb": [
    "Grilled salmon + broccoli",
    "Chicken Caesar (no croutons)",
    "Zoodles + shrimp"
  ],
  "no-dairy": [
    "Coconut chicken curry",
    "Steak + asparagus",
    "Avocado tuna salad"
  ],
  default: [
    "Roast chicken + sweet potato",
    "Pasta + marinara",
    "Turkey sandwich on whole-grain"
  ]
};
function submitMealPlan() {
  const name = (document.getElementById("name").value || "").trim();
  const goal = document.getElementById("goal").value;
  const prefs = (document.getElementById("preferences").value || "")
    .trim()
    .toLowerCase();
  if (!name || !goal) {
    alert("Please fill Name and Health Goal.");
    return;
  }
  const box = document.getElementById("meal-plan-display");
  const meals =
    prefs && mealPlans[prefs] ? mealPlans[prefs] : mealPlans.default;
  box.innerHTML = `
    <h3>Meal Plan for ${name}</h3>
    <p><strong>Goal:</strong> ${goal}</p>
    <p><strong>Preferences:</strong> ${prefs || "None"}</p>
    <ul>${meals.map((m) => `<li>${m}</li>`).join("")}</ul>
  `;
}

const workoutPlans = {
  "muscle-gain": {
    beginner: ["Push-ups", "Squats", "Plank"],
    intermediate: ["Deadlift", "Bench press", "Pull-ups"]
  },
  "weight-loss": {
    beginner: ["Walking", "Cycling", "Bodyweight squats"],
    intermediate: ["Running", "Swimming", "HIIT circuits"]
  },
  "general-fitness": {
    beginner: ["Walk 30 min", "Mobility routine", "Light core"],
    intermediate: ["Jog 20–30 min", "Full-body circuit", "Stretching"]
  }
};
function recommendWorkouts() {
  const goal = document.getElementById("workout-goal").value;
  const exp = document.getElementById("experience").value;
  const out = document.getElementById("workout-results");
  const workouts = workoutPlans[goal]?.[exp] || [];
  out.innerHTML = workouts.length
    ? `<ul>${workouts.map((w) => `<li>${w}</li>`).join("")}</ul>`
    : `<p class="muted">No recommendations for that combo yet.</p>`;
}

function updateHydrationDisplay() {
  const el = document.getElementById("water-count");
  if (el) el.textContent = waterCount;
}
function addWater() {
  if (waterCount < dailyGoal) {
    waterCount++;
    updateHydrationDisplay();
    if (waterCount === dailyGoal) alert("Great job—hydration goal reached!");
  }
}
function resetHydration() {
  waterCount = 0;
  updateHydrationDisplay();
}

function generateCalendar() {
  const cal = document.getElementById("calendar");
  if (!cal) return;
  cal.innerHTML = "";
  const days = 31;
  for (let i = 1; i <= days; i++) {
    const d = document.createElement("div");
    d.className = "day";
    d.textContent = i;
    d.addEventListener("click", () => {
      d.classList.toggle("selected");
      points = Math.max(
        0,
        points + (d.classList.contains("selected") ? 1 : -1)
      );
      updatePointsDisplay();
    });
    cal.appendChild(d);
  }
  calendarGenerated = true;
}
function updatePointsDisplay() {
  const el = document.getElementById("points");
  if (el) el.textContent = points;
}
function redeemReward(name, cost) {
  if (points < cost) {
    alert("Not enough points.");
    return;
  }
  points -= cost;
  updatePointsDisplay();
  const msg = document.getElementById("reward-message");
  if (msg) msg.textContent = `Redeemed: ${name}`;
}

function logMood() {
  const mood = document.getElementById("mood-select").value;
  const notes = (document.getElementById("mood-notes").value || "").trim();
  const list = document.getElementById("mood-history");
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleString()} — ${mood} — ${
    notes || "No notes."
  }`;
  list.appendChild(li);
  document.getElementById("mood-form").reset();
}

function logSleep() {
  const date = document.getElementById("sleep-date").value;
  const dur = document.getElementById("sleep-duration").value;
  const notes = (document.getElementById("sleep-notes").value || "").trim();
  if (!date || !dur) {
    alert("Please enter date & hours.");
    return;
  }
  const list = document.getElementById("sleep-history");
  const ph = list.querySelector("p");
  if (ph) ph.remove();
  const li = document.createElement("li");
  li.innerHTML = `<strong>${date}</strong> — ${dur} hours${
    notes ? ` — ${notes}` : ""
  }`;
  list.appendChild(li);
  document.getElementById("sleep-form").reset();
}

function addSteps() {
  const n = Number(document.getElementById("steps-today").value || 0);
  stepsToday = Math.max(0, stepsToday + n);
  document.getElementById("steps-total").textContent = stepsToday;
  const list = document.getElementById("steps-history");
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} — +${n} steps`;
  list.prepend(li);
  document.getElementById("steps-today").value = "";
}
function resetSteps() {
  stepsToday = 0;
  document.getElementById("steps-total").textContent = stepsToday;
}

document.getElementById("nutrition-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = (document.getElementById("food-name").value || "").trim();
  const cal = Number(document.getElementById("food-cal").value || 0);
  const notes = (document.getElementById("food-notes").value || "").trim();
  if (!name) {
    alert("Please enter a food name.");
    return;
  }
  const tbody = document.getElementById("nutrition-entries");
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${new Date().toLocaleTimeString()}</td><td>${name}</td><td>${cal}</td><td>${notes}</td>`;
  tbody.prepend(tr);
  calTotal += cal;
  document.getElementById("cal-total").textContent = calTotal;
  e.target.reset();
});

let swTimer = null,
  swStart = 0;
function formatMs(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const t = Math.floor((ms % 1000) / 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${t}`;
}
function stopwatchTick() {
  const ms = Date.now() - swStart;
  document.getElementById("stopwatch-display").textContent = formatMs(ms);
}
function stopwatchStart() {
  if (swTimer) return;
  swStart = Date.now();
  swTimer = setInterval(stopwatchTick, 100);
}
function stopwatchStop() {
  if (!swTimer) return;
  clearInterval(swTimer);
  swTimer = null;
}
function stopwatchReset() {
  stopwatchStop();
  document.getElementById("stopwatch-display").textContent = "00:00.0";
}

let intTimer = null,
  phase = "rest",
  left = 0,
  rounds = 0;
function beep() {
  const a = document.getElementById("beep");
  try {
    a.currentTime = 0;
    a.play();
  } catch {}
}
function intervalStart() {
  if (intTimer) return;
  const work = Number(document.getElementById("int-work").value || 30);
  const rest = Number(document.getElementById("int-rest").value || 15);
  rounds = Number(document.getElementById("int-rounds").value || 8);
  if (work < 5 || rest < 5 || rounds < 1) {
    alert("Please set sensible interval values.");
    return;
  }
  phase = "work";
  left = work;
  updateIntStatus();
  intTimer = setInterval(() => {
    left--;
    if (left <= 0) {
      beep();
      if (phase === "work") {
        phase = "rest";
        left = rest;
      } else {
        rounds--;
        if (rounds <= 0) {
          intervalStop();
          document.getElementById("int-status").textContent =
            "Done! Great job.";
          return;
        }
        phase = "work";
        left = work;
      }
    }
    updateIntStatus();
  }, 1000);
}
function intervalStop() {
  if (!intTimer) return;
  clearInterval(intTimer);
  intTimer = null;
}
function updateIntStatus() {
  document.getElementById(
    "int-status"
  ).textContent = `Phase: ${phase.toUpperCase()} • ${left}s left • Rounds left: ${rounds}`;
}

async function shareProgress() {
  const text = [
    `Nutrixan progress`,
    `Hydration: ${waterCount}/${dailyGoal} glasses`,
    `Steps today: ${stepsToday}`,
    `Points: ${points}`
  ].join("\n");

  const status = document.getElementById("shareStatus");
  try {
    if (navigator.share) {
      await navigator.share({ title: "My Nutrixan Progress", text });
      status.textContent = "Shared!";
    } else {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied summary to clipboard!";
    }
  } catch (e) {
    status.textContent = "Could not share.";
  }
  setTimeout(() => (status.textContent = ""), 3000);
}

setInterval(() => {
  const el = document.getElementById("affirmation");
  if (!el) return;
  el.textContent =
    affirmations[Math.floor(Math.random() * affirmations.length)];
}, 8000);

document.getElementById("year").textContent = new Date().getFullYear();

const fab = document.getElementById("nx-chat-fab");
const panel = document.getElementById("nx-chat-panel");
const closeBtn = document.getElementById("nx-chat-close");
const logEl = document.getElementById("nx-chat-log");
const form = document.getElementById("nx-chat-form");
const input = document.getElementById("nx-chat-input");

function pushMsg(text, who = "bot") {
  const d = document.createElement("div");
  d.className = "nx-msg" + (who === "user" ? " user" : "");
  d.textContent = text;
  logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
}
fab.onclick = () => {
  panel.style.display = "flex";
  input.focus();
};
closeBtn.onclick = () => {
  panel.style.display = "none";
};

async function chatRequest(message) {
  // If deployed to Netlify with a serverless function, this will work.
  try {
    const r = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    if (r.ok) {
      const data = await r.json();
      return data.reply;
    }
  } catch (e) {}

  const lower = message.toLowerCase();
  if (lower.includes("hydration"))
    return "Aim for 8 glasses today. You can log them in the Hydration tab.";
  if (lower.includes("meal") || lower.includes("food"))
    return "Try lean protein + veggies + whole grains. Use the Meal Plan form on Home.";
  if (lower.includes("workout"))
    return "Try a 20-minute full-body circuit: squats, push-ups, rows, planks (3 rounds).";
  if (lower.includes("sleep"))
    return "Keep a consistent schedule and limit screens 1 hour before bed.";
  return "I’m here to help with meals, workouts, sleep, hydration, and using the site!";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  input.value = "";
  pushMsg(q, "user");
  pushMsg("Thinking…");
  const reply = await chatRequest(q);
  logEl.lastChild.textContent = reply || "Sorry, I had trouble answering that.";
});
setTimeout(
  () => pushMsg("Hi! I can suggest meals, workouts, and help track goals."),
  500
);
