import Cell from "./Cell.js";
import Tile from "./Tile.js";

export default class GameBoard {
	#gameBoardElement;
	#gridSize;
	// #cellSize;
	// #cellGap;
	#cells;
	#currentScore;
	#bestScore;

	constructor(gameBoardElement) {
		this.#gameBoardElement = gameBoardElement;
		this.#currentScore = 0;
		this.#bestScore = 0;
		this.setGameBoardDimensions();
		this.createCells();
	}

	setGameBoardDimensions() {
		this.#gridSize = 4;
		// this.#cellSize = 15;
		// this.#cellGap = 2;

		this.#gameBoardElement.style.setProperty("--grid-size", this.#gridSize);
		// this.#gameBoardElement.style.setProperty("--cell-size", `${this.#cellSize}vmin`);
		// this.#gameBoardElement.style.setProperty("--cell-gap", `${this.#cellGap}vmin`);
	}

	createCells() {
		const gameBoardElement = this.#gameBoardElement;
		let m = this.#gridSize;
		let n = this.#gridSize;

		const cells = [];

		for (let r = 0; r < m; ++r) {
			const cellRow = [];

			for (let c = 0; c < n; ++c) {
				cellRow.push(new Cell(gameBoardElement, r, c));
			}

			cells.push(cellRow);
		}

		this.#cells = cells;
	}

	get currentScore() {
		return this.#currentScore;
	}

	getRandomEmptyCell() {
		let m = this.#gridSize;
		let n = this.#gridSize;
		const cells = this.#cells;

		const emptycells = [];

		for (let i = 0; i < m; ++i) {
			for (let j = 0; j < n; ++j) {
				if (cells[i][j].tile == null) {
					emptycells.push(cells[i][j]);
				}
			}
		}

		if (emptycells.length == 0) return null;

		const randomIndex = Math.floor(Math.random() * emptycells.length);
		return emptycells[randomIndex];
	}

	// it will check if it is possible to slide any tile to left
	canSlide(cells) {
		const n = this.#gridSize;

		for (let r = 0; r < n; ++r) {
			for (let c = 1; c < n; ++c) {
				if (cells[r][c].tile == null) continue;
				if (cells[r][c - 1].tile === null) return true;
				if (cells[r][c - 1].tile.data === cells[r][c].tile.data) return true;
			}
		}

		return false;
	}

	canSlideLeft() {
		const cells = this.rotateGameBoard(this.#cells, 0);
		return this.canSlide(cells);
	}

	canSlideDown() {
		const cells = this.rotateGameBoard(this.#cells, 1);
		return this.canSlide(cells);
	}

	canSlideRight() {
		const cells = this.rotateGameBoard(this.#cells, 2);
		return this.canSlide(cells);
	}

	canSlideUp() {
		const cells = this.rotateGameBoard(this.#cells, 3);
		return this.canSlide(cells);
	}

	// it will move tiles to left
	moveTiles(cells) {
		const m = this.#gridSize;
		const n = this.#gridSize;

		for (let r = 0; r < m; ++r) {
			// from column 0 to t - 1 you cannot merge any tiles
			let t = 0;

			for (let c = 1; c < n; ++c) {
				if (cells[r][c].tile == null) continue;

				let C = c; // column number of cell where current tile can be moved
				let willMerge = false; // it tracks whether current will be merged with another tile

				for (let j = c - 1; j >= t; --j) {
					if (cells[r][j].tile == null) {
						C = j;
						continue;
					}

					if (cells[r][c].tile.data == cells[r][j].tile.data) {
						C = j;
						willMerge = true;
					}

					break;
				}

				if (willMerge) t = C + 1;
				else t = C;

				if (C == c) continue;

				this.slideTile(cells[r][c], cells[r][C]);
			}
		}
	}

	slideTile(oldCell, newCell) {
		// if you are moving the tile to empty cell
		if (newCell.tile == null) {
			newCell.tile = oldCell.tile;
			oldCell.tile = null;
			return;
		}

		// if you are moving the tile to a cell with same data
		let data = newCell.tile.data + oldCell.tile.data;
		newCell.tile.data = data;
		this.#currentScore += data;
		oldCell.tile.tileElement.remove();
		oldCell.tile = null;
	}

	moveLeft() {
		const cells = this.rotateGameBoard(this.#cells, 0);
		this.moveTiles(cells);
	}

	moveDown() {
		const cells = this.rotateGameBoard(this.#cells, 1);
		this.moveTiles(cells);
	}

	moveRight() {
		const cells = this.rotateGameBoard(this.#cells, 2);
		this.moveTiles(cells);
	}

	moveUp() {
		const cells = this.rotateGameBoard(this.#cells, 3);
		this.moveTiles(cells);
	}

	// rotate gameboard by 90 degrees * count times clockwise
	rotateGameBoard(cells, count) {
		if (count === 0) return cells;

		const n = this.#gridSize;
		cells = cells.map((row, i) => row.map((cell, j) => cells[n - 1 - j][i]));

		return this.rotateGameBoard(cells, count - 1);
	}
}
