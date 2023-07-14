import Tile from "./Tile.js";

export default class Cell {
	#cellElement;
	#row;
	#col;
	#newTile;
	#tile;

	constructor(gameBoardElement, row, col) {
		// create a cell
		this.#cellElement = document.createElement("div");
		this.#cellElement.classList.add("cell");

		// add cell element to gameboard
		gameBoardElement.appendChild(this.#cellElement);

		// add some properties to cell
		this.#row = row;
		this.#col = col;
		this.#tile = null;
	}

	get cell() {
		return this.#cellElement;
	}

	get row() {
		return this.#row;
	}

	get col() {
		return this.#col;
	}

	get tile() {
		return this.#tile;
	}

	set tile(tile) {
		this.#tile = tile;

		if (tile == null) return;

		tile.row = this.#row;
		tile.col = this.#col;
	}
}
