// Virtual Dog Park - behaviour for the encyclopedia and the virtual dog.

// ---------- 1. Page footer ----------

// Put the current year in the footer so the page never shows an old date.
const yearSpan = document.getElementById("year");
yearSpan.textContent = new Date().getFullYear();


// ---------- 2. Rules and data ----------

// Each breed points at the local SVG file that belongs to it.
const BREEDS = {
  Beagle: { image: "assets/beagle.svg", alt: "Illustration of a Beagle" },
  "Golden Retriever": {
    image: "assets/golden-retriever.svg",
    alt: "Illustration of a Golden Retriever",
  },
  Poodle: { image: "assets/poodle.svg", alt: "Illustration of a Poodle" },
};

const START_HAPPINESS = 50; // a brand new dog starts here
const HAPPINESS_STEP = 10; // Feed and Play add this much
const MAX_HAPPINESS = 100; // happiness is never allowed above this
const DAY_HAPPINESS_COST = 5; // every next day costs this much happiness
const NAME_LIMIT = 20; // longest name we accept

// The browser keeps the saved dog under this one key.
const STORAGE_KEY = "virtualDogParkPetV1";

// The one true rule for growth stages. Every place that needs a stage
// asks this function, so the rule lives in a single spot.
function stageFor(day) {
  if (day >= 4) return "Adult Dog";
  if (day >= 2) return "Young Dog";
  return "Puppy";
}

// How full the growth bar should be, in percent.
function growthPercent(day) {
  if (day >= 4) return 100;
  if (day >= 2) return 66;
  return 33;
}

// A short name used as a CSS class: puppy / young / adult.
function stageClass(day) {
  if (day >= 4) return "stage-adult";
  if (day >= 2) return "stage-young";
  return "stage-puppy";
}

// The adopted dog. It stays null until the visitor adopts one.
let dog = null;


// ---------- 3. Elements we need ----------

const adoptForm = document.getElementById("adopt-form");
const breedSelect = document.getElementById("breed-select");
const nameInput = document.getElementById("dog-name");
const errorBox = document.getElementById("adopt-error");

const dogPanel = document.getElementById("dog-panel");
const dogPicture = document.getElementById("dog-picture");
const dogTitle = document.getElementById("dog-title");
const dogBreed = document.getElementById("dog-breed");
const dogDay = document.getElementById("dog-day");
const dogStage = document.getElementById("dog-stage");
const dogHappiness = document.getElementById("dog-happiness");
const growthText = document.getElementById("growth-text");
const growthFill = document.getElementById("growth-fill");

const feedButton = document.getElementById("feed-btn");
const playButton = document.getElementById("play-btn");
const nextDayButton = document.getElementById("next-day-btn");
const startOverButton = document.getElementById("start-over-btn");


// ---------- 4. Small helpers ----------

// Keep happiness inside 0..100. One shared place for both limits.
function clampHappiness(value) {
  return Math.min(Math.max(value, 0), MAX_HAPPINESS);
}

// Show a friendly message under the form.
function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function hideError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
}


// ---------- 5. Saving and loading ----------

// Write the dog into this browser's localStorage.
// This data stays on this device; it is never sent to GitHub.
function saveDog() {
  if (dog === null) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  const data = JSON.stringify(dog);
  localStorage.setItem(STORAGE_KEY, data);
}

// Read the saved dog back. Returns null when nothing is saved
// or when the saved data does not look like a dog.
function loadDog() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;

  try {
    const saved = JSON.parse(raw);
    if (saved === null || typeof saved.name !== "string") return null;
    if (!BREEDS[saved.breed]) return null;

    const day = Number(saved.day);
    const happiness = Number(saved.happiness);
    if (!Number.isFinite(day) || !Number.isFinite(happiness)) return null;

    return {
      name: saved.name,
      breed: saved.breed,
      day: Math.max(1, Math.floor(day)),
      happiness: clampHappiness(happiness),
    };
  } catch (error) {
    return null;
  }
}


// ---------- 6. Adopting ----------

// Runs when the visitor submits the form.
function adoptDog(event) {
  event.preventDefault();

  // trim() removes spaces at the start and the end, but keeps inner spaces.
  const name = nameInput.value.trim();

  if (name === "") {
    showError("Please type a name for your dog before adopting.");
    nameInput.focus();
    return;
  }

  if (name.length > NAME_LIMIT) {
    showError("Please keep the name to 20 characters or fewer.");
    nameInput.focus();
    return;
  }

  hideError();

  // A new dog always starts on Day 1 with happiness 50.
  dog = {
    name: name,
    breed: breedSelect.value,
    day: 1,
    happiness: START_HAPPINESS,
  };

  saveDog();
  renderDog();
}


// ---------- 7. Drawing the dog on screen ----------

function renderDog() {
  // No dog yet: show the adoption form and hide the dog panel.
  if (dog === null) {
    adoptForm.hidden = false;
    dogPanel.hidden = true;
    return;
  }

  const breed = BREEDS[dog.breed];
  const stage = stageFor(dog.day);

  // textContent treats the name as plain text, so a name like <b>Hi</b>
  // can never become real HTML on the page.
  dogTitle.textContent = dog.name;
  dogBreed.textContent = dog.breed;
  dogDay.textContent = dog.day;
  dogStage.textContent = stage;
  dogHappiness.textContent = dog.happiness;
  growthText.textContent = stage;

  // Show growth three ways: the bar, the picture size, and the text above.
  growthFill.style.width = growthPercent(dog.day) + "%";
  dogPicture.className = "dog-picture " + stageClass(dog.day);
  dogPicture.src = breed.image;
  dogPicture.alt = breed.alt;

  adoptForm.hidden = true;
  dogPanel.hidden = false;
}


// ---------- 8. Caring for the dog ----------

// Feed and Play both raise happiness by the same amount.
function changeHappiness(amount) {
  if (dog === null) return;
  dog.happiness = clampHappiness(dog.happiness + amount);
  saveDog();
  renderDog();
}

// Next Day moves time forward: one more day, five less happiness.
function goToNextDay() {
  if (dog === null) return;
  dog.day = dog.day + 1;
  dog.happiness = clampHappiness(dog.happiness - DAY_HAPPINESS_COST);
  saveDog();
  renderDog();
}

// Start Over asks first, then forgets the saved dog and shows the form again.
function startOver() {
  if (dog === null) return;

  const confirmed = window.confirm(
    "Start over? This deletes your saved dog and returns to the adoption form."
  );
  if (!confirmed) return; // the visitor cancelled, so keep the dog

  dog = null;
  localStorage.removeItem(STORAGE_KEY);
  nameInput.value = "";
  hideError();
  renderDog();
}


// ---------- 9. Wiring up the buttons ----------

adoptForm.addEventListener("submit", adoptDog);

feedButton.addEventListener("click", function () {
  changeHappiness(HAPPINESS_STEP);
});

playButton.addEventListener("click", function () {
  changeHappiness(HAPPINESS_STEP);
});

nextDayButton.addEventListener("click", goToNextDay);
startOverButton.addEventListener("click", startOver);


// ---------- 10. Coming back after a refresh ----------

// Try to restore the saved dog when the page opens.
dog = loadDog();
renderDog();
