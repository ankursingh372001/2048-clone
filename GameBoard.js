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
		// store reference of required html elements
		this.#gameBoardElement = document.getElementById("game-board");
		this.#currentScoreElement = document.querySelector("#current-score .score-value");
		this.#bestScoreElement = document.querySelector("#best-score .score-value");

		// set gameboard dimension and create cells
		this.#gridSize = 4;
		this.#createCells();

		// set current score from local storage
		this.#currentScore = this.getScoreFromLocalStorage("currentScore");
		this.#currentScoreElement.textContent = this.#currentScore;

		// set best score from local storage
		this.#bestScore = this.getScoreFromLocalStorage("bestScore");
		this.#bestScoreElement.textContent = this.#bestScore;
	}

	// Description = create cells
	#createCells() {
		this.#cells = Array.from(Array(this.#gridSize), () => new Array(this.#gridSize));

		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 0; c < this.#gridSize; ++c) {
				this.#cells[r][c] = new Cell(this.#gameBoardElement, r, c);
			}
		}
	}

	// Description = get score from local storage
	getScoreFromLocalStorage(key) {
		if (!localStorage.getItem(key)) {
			localStorage.setItem(key, "0");
		}

		return parseInt(localStorage.getItem(key));
	}

	// Description = set score in local storage
	setScoreInLocalStorage(key, value) {
		localStorage.setItem(key, toString(value));
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
	#canSlideUtil(cells) {
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
		const cells = this.#rotateGameboard(this.#cells, 0);
		return this.#canSlideUtil(cells);
	}

	canSlideDown() {
		const cells = this.#rotateGameboard(this.#cells, 1);
		return this.#canSlideUtil(cells);
	}

	canSlideRight() {
		const cells = this.#rotateGameboard(this.#cells, 2);
		return this.#canSlideUtil(cells);
	}

	canSlideUp() {
		const cells = this.#rotateGameboard(this.#cells, 3);
		return this.#canSlideUtil(cells);
	}

	// Description = It will slide and merge tiles to left wherever possible
	#slideTilesUtil(cells) {
		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 1; c < this.#gridSize; ++c) {
				if (cells[r][c].tile == null) continue;

				let newColumn = c; // stores new column index of current tile
				let willSlide = false; // stores will current tile will slide
				let willMerge = false; // stores will current tile will merge with another tile

				for (let t = c - 1; t >= 0; --t) {
					if (cells[r][t].tile == null) {
						newColumn = t;
						willSlide = true;
					} else if (cells[r][t].isUpdated == false && cells[r][t].tile.data == cells[r][c].tile.data) {
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
					this.#currentScore += oldCell.tile.data;
					this.#currentScore += newCell.tile.data;

					newCell.tile.data *= 2;
					oldCell.tile.tileElement.remove();
					oldCell.tile = null;
					newCell.isUpdated = true;
				} else if (willSlide) {
					newCell.tile = oldCell.tile;
					oldCell.tile = null;
				}
			}
		}

		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 0; c < this.#gridSize; ++c) {
				if (cells[r][c].isUpdated) {
					cells[r][c].isUpdated = false;
				}
			}
		}

		this.#currentScoreElement.textContent = this.#currentScore;
		this.setScoreInLocalStorage("currentScore", this.#currentScore);

		if (this.#bestScore < this.#currentScore) {
			this.#bestScore = this.#currentScore;
			this.#bestScoreElement.textContent = this.#bestScore;
			this.setScoreInLocalStorage("bestScore", this.#bestScore);
		}
	}

	slideLeft() {
		const cells = this.#rotateGameboard(this.#cells, 0);
		this.#slideTilesUtil(cells);
	}

	slideDown() {
		const cells = this.#rotateGameboard(this.#cells, 1);
		this.#slideTilesUtil(cells);
	}

	slideRight() {
		const cells = this.#rotateGameboard(this.#cells, 2);
		this.#slideTilesUtil(cells);
	}

	slideUp() {
		const cells = this.#rotateGameboard(this.#cells, 3);
		this.#slideTilesUtil(cells);
	}

	// Description = rotate gameboard by 90 degrees * count times clockwise
	#rotateGameboard(cells, count) {
		if (count === 0) return cells;

		const n = this.#gridSize;
		cells = cells.map((row, i) => row.map((cell, j) => cells[n - 1 - j][i]));

		return this.#rotateGameboard(cells, count - 1);
	}
}
