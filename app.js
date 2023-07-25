import GameBoard from "./GameBoard.js";
import Tile from "./Tile.js";

const gameBoard = new GameBoard();

const gameBoardElement = document.getElementById("game-board");
gameBoard.getRandomEmptyCell().tile = new Tile(gameBoardElement);
gameBoard.getRandomEmptyCell().tile = new Tile(gameBoardElement);

setupInput();

function handleInput(e) {
	if (e.key === "ArrowUp") {
		if (!gameBoard.canSlideUp()) {
			setupInput();
			return;
		}

		gameBoard.slideUp();
	} else if (e.key === "ArrowDown") {
		if (!gameBoard.canSlideDown()) {
			setupInput();
			return;
		}

		gameBoard.slideDown();
	} else if (e.key === "ArrowLeft") {
		if (!gameBoard.canSlideLeft()) {
			setupInput();
			return;
		}

		gameBoard.slideLeft();
	} else if (e.key === "ArrowRight") {
		if (!gameBoard.canSlideRight()) {
			setupInput();
			return;
		}

		gameBoard.slideRight();
	}

	gameBoard.getRandomEmptyCell().tile = new Tile(gameBoardElement);

	if (!gameBoard.canSlideUp() && !gameBoard.canSlideDown() && !gameBoard.canSlideLeft() && !gameBoard.canSlideRight()) {
		alert("game over");
	} else {
		setupInput();
	}
}

function setupInput() {
	// add even listener only once
	// because once a key is pressed do not perform any action on any other key press unless all animations and calculations are finished.
	window.addEventListener("keydown", handleInput, { once: true });
}

const newGameBtnElement = document.querySelector("button.restart-button");
newGameBtnElement.addEventListener("click", () => {
	gameBoard.initNewGame();
	gameBoard.getRandomEmptyCell().tile = new Tile(gameBoardElement);
	gameBoard.getRandomEmptyCell().tile = new Tile(gameBoardElement);
	setupInput();
});
