import Tile from "./Tile.js";

export default class Cell {
	#cellElement;
	#tile;
	#row;
	#col;

	constructor(gameBoardElement, row, col) {
		// create a cell
		const cellElement = document.createElement("div");
		cellElement.classList.add("cell");

		// add cell element to gameboard
		gameBoardElement.appendChild(cellElement);

		// add some properties to cell
		this.#cellElement = cellElement;
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
