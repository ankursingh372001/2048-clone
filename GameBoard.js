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
		this.createCells();

		// set current score from local storage
		this.#currentScore = this.getScoreFromLocalStorage("currentScore");
		this.#currentScoreElement.textContent = this.#currentScore;

		// set best score from local storage
		this.#bestScore = this.getScoreFromLocalStorage("bestScore");
		this.#bestScoreElement.textContent = this.#bestScore;
	}

	// Descripttion = create cells
	createCells() {
		this.#cells = Array.from(Array(this.#gridSize), () => new Array(this.#gridSize));

		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 0; c < this.#gridSize; ++c) {
				this.#cells[r][c] = new Cell(this.#gameBoardElement, r, c);
			}
		}
	}

	// Description = get score from local storage
	getScoreFromLocalStorage(key) {
		if (localStorage.getItem(key) == null) {
			localStorage.setItem(key, toString(0));
		}

		return parseInt(localStorage.getItem(key));
	}

	// Description = set score in local storage
	setScoreInLocalStorage(key, value) {
		if (localStorage.getItem(key) == null) {
			localStorage.setItem(key, toString(0));
		}

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
		const n = this.#gridSize;

		for (let r = 0; r < this.#gridSize; ++r) {
			let t = 0; // from column 0 to t - 1 you cannot merge any tiles

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

	moveTilesMethodUpdate(cells) {
		for (let r = 0; r < this.#gridSize; ++r) {
			for (let c = 1; c < this.#gridSize.size(); ++c) {
				if (cells[r][c].tile == null) continue;

				let newColumn = c; // stores new column index of current tile
				let willSlide = false; // stores will current tile will slide
				let willMerge = false; // stores will current tile will merge with another tile

				for (let t = c - 1; t >= 0; --t) {
					if (cells[r][t].tile == null) {
						newColumn = t;
						willSlide = true;
					} else if (cells[r][t].newTile == null && cells[r][t].tile.data == cells[r][c].tile.data) {
						newColumn = t;
						willSlide = true;
						willMerge = true;
					} else {
						break;
					}
				}

				this.slideTile(cells[r][c], cells[r][newColumn]);
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
