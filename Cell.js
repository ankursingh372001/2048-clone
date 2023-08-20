import Tile from "./Tile.js";

export default class Cell {
	#cellElement;
	#row;
	#col;
	#tile;
	#mergeTile;

	constructor() {
		// create a cell
		this.#cellElement = document.createElement("div");
		this.#cellElement.classList.add("cell");

		// add some properties to cell
		this.#row = -1;
		this.#col = -1;
		this.#tile = null;
		this.#mergeTile = null;
	}

	get cellElement() {
		return this.#cellElement;
	}

	get row() {
		return this.#row;
	}

	set row(val) {
		this.#row = val;
	}

	get col() {
		return this.#col;
	}

	set col(val) {
		this.#col = val;
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

	get mergeTile() {
		return this.#mergeTile;
	}

	set mergeTile(tile) {
		this.#mergeTile = tile;

		if (tile == null) return;

		tile.row = this.#row;
		tile.col = this.#col;
	}
}
