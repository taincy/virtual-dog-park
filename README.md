# Virtual Dog Park

A small dog encyclopedia and virtual pet website built for a first-year programming
lab. It uses only HTML, CSS, and vanilla JavaScript: no framework, no build step,
no backend, and no external images.

## Features

- **Dog Encyclopedia** - three breeds (Beagle, Golden Retriever, Poodle). Each card
  has a locally drawn SVG illustration and short, easy-to-read notes about size,
  personality, and everyday care.
- **Adopt a dog** - choose one of the three breeds, type a name, and click Adopt.
  The name is trimmed, must not be empty, and may be at most 20 characters.
- **Feed and Play** - each click adds 10 happiness.
- **Next Day** - moves time forward by one day and costs 5 happiness.
- **Visible growth** - a growth bar, a slightly larger dog illustration, and a
  written growth stage. The stage name is always written out as text, so it is
  never communicated by colour or size alone.
- **Saved progress** - the adopted dog comes back after a page refresh in the same
  browser.
- **Start Over** - asks for confirmation before deleting saved progress.

## How to preview the page

The page must be opened through a local web server. Opening `index.html` directly
as a `file://` address can make saved progress behave differently.

1. Open the project folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` in the Explorer and choose **Open with Live Server**.
4. The browser opens an address such as `http://127.0.0.1:5500`.

Use the same browser and the same local address for every test, because saved
progress belongs to that address.

## Growth and happiness rules

| Day | Growth stage |
| --- | --- |
| 1 | Puppy |
| 2 and 3 | Young Dog |
| 4 and later | Adult Dog |

- A new dog starts on Day 1 as a Puppy with happiness 50.
- **Feed** or **Play**: happiness +10.
- **Next Day**: day +1 and happiness -5.
- Happiness is always kept between 0 and 100.

## Where the pet is saved

The adopted dog is stored in the browser's `localStorage` under the key
`virtualDogParkPetV1`. That data lives only on this device, in this browser, for
this address. It is **not** stored in a GitHub account and is **not** part of the
repository. Clearing the browser data removes the dog. Only one dog is stored at
a time.

## Manual testing checklist

- [ ] The encyclopedia shows exactly three breeds and three illustrations.
- [ ] A valid name can adopt a dog; an empty or space-only name is rejected with a
  helpful message.
- [ ] Leading and trailing spaces are removed, spaces inside the name are kept, and
  the name stops at 20 characters.
- [ ] A name containing `<` or `>` is shown as plain text, not as HTML.
- [ ] Feed and Play each add 10 happiness and stop at 100.
- [ ] Next Day adds a day, lowers happiness by 5, and never goes below 0.
- [ ] The stage is Puppy on Day 1, Young Dog on Days 2-3, and Adult Dog from Day 4.
- [ ] The growth bar and the illustration size change between the three stages.
- [ ] A refresh restores the same dog in the same browser and address.
- [ ] Start Over asks for confirmation: cancel keeps the dog, confirm clears it.
- [ ] The page stays readable in a narrow window with no sideways scrolling.

## Illustrations

The three SVG files in `assets/` are original illustrations drawn for this project.
They are not photographs of real dogs, and no copyrighted images or external image
services are used.

## A note on this checklist

The checklist above is meant to be followed by hand in a browser. This README does
not claim that an automated test suite or a browser automation tool verified the
page; the results come from a person clicking through the page.
