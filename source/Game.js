(function(global) {


	(function(document) {



	})(global.document);


	const Game = function() {
		this.fps = 60;
		this._has_ended  = false;
		this.rows = 20;
		this.columns = 40;
		this.cellSize = 20;
		this.field = [];
		this.nextField = [];
		this.fps = 10;
		this.isPaused = false;
	}

	Game.prototype = {
		start: function() {
			this.field = [];
			this.nextField = [];
			for (var row = 0; row < this.rows; row++) {
				this.field[row] = [];
				for (var column = 0; column < this.columns; column++) {
	      			this.field[row][column] = 0;
	  			}
	  			this.nextField[row] = this.field.slice();
			}

			this.field[1][3] = 1;
			this.field[2][3] = 1;
			this.field[3][3] = 1;
			this.field[2][3] = 1;
			this.field[3][2] = 1;
			this.field[2][1] = 1;

			this.timer = setInterval(this.makeOneStep.bind(this), 1000 / this.fps);
		},

		render: function() {
			var container = document.getElementById("container");
			container.innerHTML = '';

// 			Option 2 (much faster):

// var myNode = document.getElementById("foo");
// while (myNode.firstChild) {
//     myNode.removeChild(myNode.firstChild);
// }

			for (var row = 0; row < this.rows; row++) {
				for (var column = 0; column < this.columns; column++) {
					var newCell = document.createElement('div');
					newCell.className = 'cell';
					newCell.style.top = (this.cellSize * 1.1) * row + 'px';
					newCell.style.left = (this.cellSize * 1.1) * column + 'px';
					newCell.style.position = 'absolute';
					newCell.style.width = this.cellSize + 'px';
					newCell.style.height = this.cellSize + 'px';
					// newCell.dataset.row = row;
					// newCell.dataset.column = column;

					if (this.field[row][column] == 0) {
						newCell.style.backgroundColor = 'lightgrey';
					} else {
						newCell.style.backgroundColor = 'green';
					}

					container.appendChild(newCell);
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

		makeOneStep: function() {
			if (this.isPaused) {
				return;
			}

			for (var row = 0; row < this.rows; row++) {
				for (var column = 0; column < this.columns; column++) {
					var res = this.updateCell(row, column);
					this.nextField[row][column] = res;
				}
			}

			for (var row = 0; row < this.rows; row++) {
				this.field[row] = this.nextField[row].slice();
			}

			this.render();
		},

		pause: function() {
			this.isPaused = true;
		},

		run: function() {
			this.isPaused = false;
		},
	};

	global.Game = Game;

})(this);