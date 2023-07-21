import Cell from "./Cell.js";
import Tile from "./Tile.js";

export default class GameBoard {
	#gameBoardElement;
	#gridSize;
	#cells;
	#currentScoreElement;
	#currentScore;
	#bestScoreElement;
	#bestScore;

	constructor(gameBoardElement) {
		// set current score value from local storage
		if (localStorage.getItem("currentScore") == null) {
			localStorage.setItem("currentScore", 0);
		}

		this.#currentScore = parseInt(localStorage.getItem("currentScore"));
		this.#currentScoreElement = document.querySelector("#current-score .score-value");
		this.#currentScoreElement.textContent = this.#currentScore;

		// set best score value from local storage
		if (localStorage.getItem("bestScore") == null) {
			localStorage.setItem("bestScore", 0);
		}

		this.#bestScore = parseInt(localStorage.getItem("bestScore"));
		this.#bestScoreElement = document.querySelector("#best-score .score-value");
		this.#bestScoreElement.textContent = this.#bestScore;

		// initalize gameboard dimensions and add cells to gameboard
		this.#gameBoardElement = gameBoardElement;
		this.#gridSize = 4;

		/* create cells */
		this.#cells = [];

		for (let r = 0; r < this.#gridSize; ++r) {
			const cellRow = [];

			for (let c = 0; c < this.#gridSize; ++c) {
				cellRow.push(new Cell(this.#gameBoardElement, r, c));
			}

			this.#cells.push(cellRow);
		}
	}

	// Description = get a random empty cell
	getRandomEmptyCell() {
		const emptycells = [].concat(...this.#cells).filter(cell => cell.tile == null);

		if (emptycells.length == 0) return null;

		const randomIndex = Math.floor(Math.random() * emptycells.length);
		return emptycells[randomIndex];
	}

	// Description = initialize new game when user clicks on new game button
	initNewGame() {
		localStorage.setItem("currentScore", 0);
		this.#currentScore = parseInt(localStorage.getItem("currentScore"));
		this.#currentScoreElement.textContent = this.#currentScore;

		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 0; c < this.#gridSize; ++c) {
				if (this.#cells[r][c].tile) {
					this.#cells[r][c].tile.tileElement.remove();
					this.#cells[r][c].tile = null;
				}
			}
		}
	}

	// Description = it will check if it is possible to slide at least one tile to left
	canSlideUtil(cells) {
		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 1; c < this.#gridSize; ++c) {
				if (cells[r][c].tile == null) continue;
				if (cells[r][c - 1].tile === null) return true;
				if (cells[r][c - 1].tile.data === cells[r][c].tile.data) return true;
			}
		}

		return false;
	}

	canSlideLeft() {
		const cells = this.rotateGameBoard(this.#cells, 0);
		return this.canSlideUtil(cells);
	}

	canSlideDown() {
		const cells = this.rotateGameBoard(this.#cells, 1);
		return this.canSlideUtil(cells);
	}

	canSlideRight() {
		const cells = this.rotateGameBoard(this.#cells, 2);
		return this.canSlideUtil(cells);
	}

	canSlideUp() {
		const cells = this.rotateGameBoard(this.#cells, 3);
		return this.canSlideUtil(cells);
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

	// Description = it will move or merge tiles to left
	slideTilesUtil(cells) {
		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 0; c < this.#gridSize; ++c) {
				for (let c1 = c + 1; c1 < this.#gridSize; ++c1) {
					if (cells[r][c1].tile == null) continue;

					if (cells[r][c].tile == null) {
						cells[r][c].tile = cells[r][c1].tile;
						cells[r][c1].tile = null;
					} else if (cells[r][c].tile.data == cells[r][c1].tile.data) {
						let temp = cells[r][c].tile.tileElement;
						cells[r][c].tile = cells[r][c1].tile;
						cells[r][c].tile.data *= 2;
						cells[r][c1].tile = null;
						this.#currentScore += cells[r][c].tile.data;
						temp.remove();
					}

					break;
				}
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
