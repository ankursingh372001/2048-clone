import Cell from "./Cell.js";

export default class GameBoard {
	#gameBoardElement;
	#currentScoreElement;
	#bestScoreElement;
	#gridSize;
	#cells;
	#currentScore;
	#bestScore;

	constructor() {
		this.#gameBoardElement = document.getElementById("game-board");
		this.#currentScoreElement = document.querySelector("#current-score .score-value");
		this.#bestScoreElement = document.querySelector("#best-score .score-value");
		this.#gridSize = 4;
		this.createCells();

		this.#currentScore = 0;
		this.#currentScoreElement.textContent = this.#currentScore;

		// set best score from local storage
		if (localStorage.getItem("bestScore")) {
			this.#bestScore = parseInt(localStorage.getItem("bestScore"));
		} else {
			this.#bestScore = 0;
			localStorage.setItem("bestScore", "" + this.#bestScore);
		}

		this.#bestScoreElement.textContent = this.#bestScore;
	}

	createCells() {
		const n = this.#gridSize;
		const cells = new Array(n);

		for (let r = 0; r < this.#gridSize; ++r) {
			cells[r] = new Array(n);

			for (let c = 0; c < this.#gridSize; ++c) {
				cells[r][c] = new Cell(this.#gameBoardElement, r, c);
			}
		}

		this.#cells = cells;
	}

	getRandomEmptyCell() {
		const n = this.#gridSize;
		const cells = this.#cells;

		const emptycells = [].concat(...this.#cells).filter(cell => cell.tile == null);

		for (let r = 0; r < n; ++r) {
			for (let c = 0; c < n; ++c) {
				if (cells[r][c].tile === null) {
					emptycells.push(cells[r][c]);
				}
			}
		}

		if (emptycells.length == 0) return null;

		return emptycells[Math.floor(Math.random() * emptycells.length)];
	}

	initNewGame() {
		const n = this.#gridSize;
		const cells = this.#cells;

		localStorage.setItem("currentScore", 0);
		this.#currentScore = parseInt(localStorage.getItem("currentScore"));
		this.#currentScoreElement.textContent = this.#currentScore;

		for (let r = 0; r < n; ++r) {
			for (let c = 0; c < n; ++c) {
				if (cells[r][c].tile) {
					cells[r][c].tile.tileElement.remove();
					cells[r][c].tile = null;
				}
			}
		}
	}

	// canSlideUtil will check if it is possible to slide at least one tile to left
	canSlideUtil(cells) {
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
		const cells = this.rotateGameboard(this.#cells, 0);
		return this.canSlideUtil(cells);
	}

	canSlideDown() {
		const cells = this.rotateGameboard(this.#cells, 1);
		return this.canSlideUtil(cells);
	}

	canSlideRight() {
		const cells = this.rotateGameboard(this.#cells, 2);
		return this.canSlideUtil(cells);
	}

	canSlideUp() {
		const cells = this.rotateGameboard(this.#cells, 3);
		return this.canSlideUtil(cells);
	}

	// sllide tiles util will slide and merge tiles to the left wherever possible
	slideTilesUtil(cells) {
		const n = this.#gridSize;

		for (let r = 0; r < n; ++r) {
			for (let c = 1; c < n; ++c) {
				if (cells[r][c].tile == null) continue;

				let newColumn = c; // stores new column index of current tile
				let willSlide = false; // stores will current tile will slide
				let willMerge = false; // stores will current tile will merge with another tile

				for (let t = c - 1; t >= 0; --t) {
					if (cells[r][t].tile == null) {
						newColumn = t;
						willSlide = true;
					} else if (cells[r][t].mergeTile == null && cells[r][t].tile.data == cells[r][c].tile.data) {
						newColumn = t;
						willSlide = true;
						willMerge = true;
					} else {
						break;
					}
				}

				let oldCell = cells[r][c];
				let newCell = cells[r][newColumn];

				if (willMerge) {
					newCell.mergeTile = oldCell.tile;
					oldCell.tile = null;
				} else if (willSlide) {
					newCell.tile = oldCell.tile;
					oldCell.tile = null;
				}
			}
		}

		for (let r = 0; r < n; ++r) {
			for (let c = 0; c < n; ++c) {
				if (cells[r][c].mergeTile) {
					cells[r][c].mergeTile.tileElement.remove();
					cells[r][c].mergeTile = null;
					cells[r][c].tile.data = 2 * cells[r][c].tile.data;
					this.#currentScore += cells[r][c].tile.data;
				}
			}
		}

		this.#currentScoreElement.textContent = this.#currentScore;

		if (this.#bestScore < this.#currentScore) {
			this.#bestScore = this.#currentScore;
			this.#bestScoreElement.textContent = this.#bestScore;
			localStorage.setItem("bestScore", "" + this.#bestScore);
		}
	}

	slideLeft() {
		const cells = this.rotateGameboard(this.#cells, 0);
		this.slideTilesUtil(cells);
	}

	slideDown() {
		const cells = this.rotateGameboard(this.#cells, 1);
		this.slideTilesUtil(cells);
	}

	slideRight() {
		const cells = this.rotateGameboard(this.#cells, 2);
		this.slideTilesUtil(cells);
	}

	slideUp() {
		const cells = this.rotateGameboard(this.#cells, 3);
		this.slideTilesUtil(cells);
	}

	// rotateGameboard will rotate a gameboard by 90 * count degrees colockwise
	rotateGameboard(cells, count) {
		if (count === 0) return cells;

		const n = this.#gridSize;
		cells = cells.map((row, i) => row.map((cell, j) => cells[n - 1 - j][i]));

		return this.rotateGameboard(cells, count - 1);
	}
}
