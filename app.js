import GameBoard from "./GameBoard.js";
import Tile from "./Tile.js";

const gameBoardElement = document.getElementById("game-board");

const gameBoard = new GameBoard(gameBoardElement);
gameBoard.setGameBoardDimensions();
gameBoard.createCells();

gameBoard.getRandomEmptyCell().tile = new Tile(gameBoardElement);
gameBoard.getRandomEmptyCell().tile = new Tile(gameBoardElement);

function setupInput() {
	// wait for the animation to finish first
	// that is why once.
	window.addEventListener("keydown", handleInput, { once: true });
}

function handleInput(e) {
	if (e.key === "ArrowUp") gameBoard.moveUp();
	else if (e.key === "ArrowDown") gameBoard.moveDown();
	else if (e.key === "ArrowLeft") gameBoard.moveLeft();
	else if (e.key === "ArrowRight") gameBoard.moveRight();

	// other code
	// let emptyCell = gameBoard.getRandomEmptyCell();

	// if (emptyCell == null) confirm("game over");
	// else emptyCell.tile = new Tile(gameBoardElement);

	setupInput();
}

setupInput();
