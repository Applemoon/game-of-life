const Game = function() {
	this.fps = 160;
	this.rows = 65;
	this.columns = 130;
	this.cellSize = 10;
	this.field = [];
	this.nextField = [];
	this.fps = 10;
	this.isPaused = false;
	this.container = document.getElementById("container");
	
	this.stepBtn = document.getElementById("step");
	this.pauseBtn = document.getElementById("pause");
	this.runBtn = document.getElementById("run");
	this.updateBtns();
}

Game.prototype = {
	start: function() {
		this.field = [];
		this.nextField = [];
		for (var row = 0; row < this.rows; row++) {
			this.field[row] = [];
			for (var column = 0; column < this.columns; column++) {
      			this.field[row][column] = Math.random() < 0.5 ? 0 : 1;

				var newCell = document.createElement('div');
				newCell.id = row + "-" + column;
				newCell.style.top = (this.cellSize * 1.1) * row + 'px';
				newCell.style.left = (this.cellSize * 1.1) * column + 'px';
				newCell.style.position = 'absolute';
				newCell.style.width = this.cellSize + 'px';
				newCell.style.height = this.cellSize + 'px';

				container.appendChild(newCell);
  			}
  			this.nextField[row] = this.field.slice();
		}

		this.timer = setInterval(this.makeOneStep.bind(this), 1000 / this.fps);
	},

	render: function() {
		for (var row = 0; row < this.rows; row++) {
			for (var column = 0; column < this.columns; column++) {
				var curId = row + "-" + column;
				var curCell = document.getElementById(curId);
				if (this.field[row][column] == 0) {
					curCell.style.backgroundColor = 'lightgrey';
				} else {
					curCell.style.backgroundColor = 'green';
				}
			}
		}
	},

	updateCell: function(row, column) {
		var topRow = row - 1;
		if (topRow < 0) {
			topRow = this.rows - 1;
		}

		var bottomRow = row + 1;
		if (bottomRow == this.rows) {
			bottomRow = 0;
		}

		var leftColumn = column - 1;
		if (leftColumn < 0) {
			leftColumn = this.columns - 1;
		}

		var rightColumn = column + 1;
		if (rightColumn == this.columns) {
			rightColumn = 0;
		}

		var neibCount = this.field[topRow][leftColumn] + this.field[topRow][column] + this.field[topRow][rightColumn] +
			this.field[row][leftColumn] + this.field[row][rightColumn] +
			this.field[bottomRow][leftColumn] + this.field[bottomRow][column] + this.field[bottomRow][rightColumn];

		if (this.field[row][column] == 0) {
			if (neibCount == 3) {
				return 1;
			}

			return 0;
		} else {
			if (neibCount != 3 && neibCount != 2) {
				return 0;
			}
			
			return 1;
		}
	},

	makeOneStep: function(force) {
		if (!force && this.isPaused) {
			return;
		}

		for (var row = 0; row < this.rows; row++) {
			for (var column = 0; column < this.columns; column++) {
				this.nextField[row][column] = this.updateCell(row, column);
			}
		}

		for (var row = 0; row < this.rows; row++) {
			this.field[row] = this.nextField[row].slice();
		}

		this.render();
	},

	pause: function() {
		this.isPaused = true;
		this.updateBtns();
	},

	run: function() {
		this.isPaused = false;
		this.updateBtns();
	},

	updateBtns: function() {
		if (this.isPaused) {
			this.stepBtn.removeAttribute('disabled');
			this.runBtn.removeAttribute('disabled');
			this.pauseBtn.setAttribute('disabled', 'true');
		} else {
			this.stepBtn.setAttribute('disabled', 'true');
			this.runBtn.setAttribute('disabled', 'true');
			this.pauseBtn.removeAttribute('disabled');
		}
	},
};
