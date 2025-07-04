# Deal or Decline

A web-based card game that captures the tension and excitement of the classic TV game show "Deal or No Deal." Choose your lucky card and test your nerve against the dealer\!

**➡️ [Live Demo](https://ryanmpierson.com/arcade/deal-or-decline/) ⬅️**

*(To add your own gameplay GIF, you can use a free tool like Giphy Capture or LICEcap, record a short clip of your game, and replace the link above.)*

## About The Project

This project is a front-end web application built with vanilla HTML, CSS, and JavaScript. It recreates the core gameplay loop of "Deal or No Deal," replacing the classic briefcases with a grid of interactive cards. The goal was to create a clean, responsive, and engaging user experience with dynamic calculations for the dealer's offers and game show-style audio feedback.

-----

## Features

  * **Interactive Card Grid:** A scalable grid of 26 cards, each with a hidden monetary value.
  * **Player's Choice:** Select your own "lucky card" to keep until the end.
  * **Progressive Gameplay:** Play through multiple rounds, eliminating a decreasing number of cards each round.
  * **Dynamic Dealer Offers:** The dealer calculates and presents a buyout offer based on the average value of the remaining cards.
  * **Deal or Decline:** Make the tough choice to accept the dealer's offer or decline it to continue playing.
  * **Dynamic Money Board:** A side panel dynamically updates to show which monetary values are still in play.
  * **Responsive Design:** The layout fluidly adapts to different screen sizes, from mobile devices to large desktop monitors.
  * **Audio Feedback:** Sound effects for key events like flipping a card, receiving an offer, and winning the game.

-----

## Built With

  * Assistance from: Gemini 2.5 Pro
  * VS Code

-----

## Getting Started

This is a pure front-end project and requires no special installation or build steps.

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/deal-or-decline.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd deal-or-decline
    ```
3.  Open the `index.html` file in your web browser.

-----

## How It Works

The project is organized into three main files:

  * **`index.html`**: Provides the basic structure for the game, including the card grid, player/dealer areas, and the money board. It also includes the `<audio>` elements for the sound effects.
  * **`style.css`**: Handles all the styling, layout, and animations. It uses modern CSS features like Flexbox, Grid, and `clamp()` for a fully responsive design.
  * **`script.js`**: Contains all the game logic. It is wrapped in a `DOMContentLoaded` listener to ensure it only runs after the page is fully loaded. This file is responsible for:
      * Shuffling and assigning card values.
      * Handling all user clicks and game states (`picking`, `eliminating`, `offer`).
      * Calculating the dealer's offer.
      * Playing sound effects for different events.
      * Updating the DOM to reflect the game's progress.
