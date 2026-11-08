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
const NAME_LIMIT = 20; // longest name we accept

// The one true rule for growth stages. Every place that needs a stage
// asks this function, so the rule lives in a single spot.
function stageFor(day) {
  if (day >= 4) return "Adult Dog";
  if (day >= 2) return "Young Dog";
  return "Puppy";
}

// The adopted dog. It stays null until the visitor clicks Adopt.
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

const feedButton = document.getElementById("feed-btn");
const playButton = document.getElementById("play-btn");


// ---------- 4. Small helpers ----------

// Keep happiness inside 0..100. One shared place for the limit.
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


// ---------- 5. Adopting ----------

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

  renderDog();
}


// ---------- 6. Drawing the dog on screen ----------

function renderDog() {
  if (dog === null) {
    dogPanel.hidden = true;
    return;
  }

  const breed = BREEDS[dog.breed];

  // textContent treats the name as plain text, so a name like <b>Hi</b>
  // can never become real HTML on the page.
  dogTitle.textContent = dog.name;
  dogBreed.textContent = dog.breed;
  dogDay.textContent = dog.day;
  dogStage.textContent = stageFor(dog.day);
  dogHappiness.textContent = dog.happiness;

  dogPicture.src = breed.image;
  dogPicture.alt = breed.alt;

  dogPanel.hidden = false;
}


// ---------- 7. Caring for the dog ----------

// Feed and Play both raise happiness by the same amount.
function changeHappiness(amount) {
  if (dog === null) return;
  dog.happiness = clampHappiness(dog.happiness + amount);
  renderDog();
}


// ---------- 8. Wiring up the buttons ----------

adoptForm.addEventListener("submit", adoptDog);

feedButton.addEventListener("click", function () {
  changeHappiness(HAPPINESS_STEP);
});

playButton.addEventListener("click", function () {
  changeHappiness(HAPPINESS_STEP);
});
