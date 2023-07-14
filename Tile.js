import styles from "./TileStyles.js";

export default class Tile {
	#tileElement;
	#row;
	#col;
	#data;

	constructor(gameBoardElement) {
		// create a tile
		const tileElement = document.createElement("div");
		tileElement.classList.add("tile");

		// set data inside tile
		let data = Math.random() > 0.5 ? 2 : 4;
		tileElement.textContent = data;

		// add tile to gameboard
		gameBoardElement.append(tileElement);

		// set class properties
		this.#tileElement = tileElement;
		this.#data = data;
		this.setTileStyle();
	}

	get tileElement() {
		return this.#tileElement;
	}

	get data() {
		return this.#data;
	}

	set data(value) {
		this.#tileElement.textContent = value;
		this.#data = value;
		this.setTileStyle();
	}

	get row() {
		return this.#row;
	}

	set row(value) {
		this.#row = value;
		this.#tileElement.style.setProperty("--r", value);
	}

	get col() {
		return this.#col;
	}

	set col(value) {
		this.#col = value;
		this.#tileElement.style.setProperty("--c", value);
	}

	setTileStyle() {
		let index = Math.min(Math.log2(this.#data) - 1);
		this.#tileElement.style.backgroundColor = styles[index].backgroundColor;
		this.#tileElement.style.color = styles[index].color;
		this.#tileElement.style.fontSize = styles[index].fontSize;
	}
}
