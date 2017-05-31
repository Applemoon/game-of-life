rows = 100;
columns = 200;
cellSize = 6;
borderSize = 0;
fps = 500;
field = [];
updatingArrays = [];
fps = 10;
isPaused = false;
initialEmptyPart = 0;
initialDensity = 0.5;
cellColor = "white";
emptyCellColor = "darkslategray";

canvas = document.getElementById("canvas");
canvas.height = rows * cellSize;
canvas.width = columns * cellSize;
ctx = canvas.getContext('2d');

canvas.addEventListener("click", cellClick);

runPauseBtn = document.getElementById("run-pause");
runPauseBtn.addEventListener("click", togglePause, false);

stepBtn = document.getElementById("step");
stepBtn.addEventListener("click", function() {
	makeOneStep(true);
}, false);

stepBackBtn = document.getElementById("stepBack");
stepBackBtn.addEventListener("click", stepBack, false);

reloadBtn = document.getElementById("reload");
reloadBtn.addEventListener("click", function() { 
	location.reload(); 
}, false);

clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", clearField, false);

population = 0;
populationLabel = document.getElementById("population");

iteration = 0;
iterationLabel = document.getElementById("iteration");


function start() {
	field = [];
	isPaused = false;
	for (var row = 0; row < rows; row++) {
		field[row] = [];
		for (var column = 0; column < columns; column++) {
			if (row > rows * initialEmptyPart && 
				row < rows * (1 - initialEmptyPart) && 
				column > columns * initialEmptyPart && 
				column < columns * (1 - initialEmptyPart)) {
  				field[row][column] = Math.random() > initialDensity ? 0 : 1;
  				if (field[row][column] == 1) {
  					population += 1;
  				} 
  			} else {
  				field[row][column] = 0;
  			}
  			renderCell(row, column);
		}
	}

	timer = setInterval(makeOneStep.bind(this), 1000 / fps);

	iteration = 0;
	updateIteration();
};

function renderCell(row, column) {
	if (field[row][column] == 0) {
		ctx.fillStyle = emptyCellColor;
	} else {
		ctx.fillStyle = cellColor;
	}
	var x = column * cellSize;
	var y = row * cellSize;
	ctx.fillRect(x, y, 
		cellSize - borderSize, cellSize - borderSize);
};

function calcCell(row, column) {
	var topRow = row - 1;
	if (topRow < 0) {
		topRow = rows - 1;
	}

	var bottomRow = row + 1;
	if (bottomRow == rows) {
		bottomRow = 0;
	}

	var leftColumn = column - 1;
	if (leftColumn < 0) {
		leftColumn = columns - 1;
	}

	var rightColumn = column + 1;
	if (rightColumn == columns) {
		rightColumn = 0;
	}

	var neibCount = field[topRow][leftColumn] + field[topRow][column] + field[topRow][rightColumn] +
		field[row][leftColumn] + field[row][rightColumn] +
		field[bottomRow][leftColumn] + field[bottomRow][column] + field[bottomRow][rightColumn];

	if (field[row][column] == 0) {
		if (neibCount == 3) {
			updatingArrays[updatingArrays.length - 1].push([row, column]);
		}
	} else {
		if (neibCount != 3 && neibCount != 2) {
			updatingArrays[updatingArrays.length - 1].push([row, column]);
		}
	}
};

function makeOneStep(force) {
	if (!force && isPaused) {
		return;
	}

	updatingArrays.push([]);
	for (var row = 0; row < rows; row++) {
		for (var column = 0; column < columns; column++) {
			calcCell(row, column);
		}
	}

	for (var i = 0; i < updatingArrays[updatingArrays.length - 1].length; i++) {
		var rowColumnArray = updatingArrays[updatingArrays.length - 1][i];
		var row = rowColumnArray[0];
		var column = rowColumnArray[1];
		if (field[row][column] == 1) {
			field[row][column] = 0;
			population -= 1;
		} else {
			field[row][column] = 1;
			population += 1;
		}
		renderCell(row, column);
	}

	updatePopulation();

	iteration += 1;
	updateIteration();
	updateBtns();
};

function stepBack() {
	if (updatingArrays.length == 0) {
		return;
	}

	var lastUpdatingArray = updatingArrays.pop();

	for (var i = 0; i < lastUpdatingArray.length; i++) {
		var rowColumnArray = lastUpdatingArray[i];
		var row = rowColumnArray[0];
		var column = rowColumnArray[1];
		if (field[row][column] == 1) {
			field[row][column] = 0;
			population -= 1;
		} else {
			field[row][column] = 1;
			population += 1;
		}
		renderCell(row, column);
	}

	updatePopulation();

	iteration -= 1;
	updateIteration();
	updateBtns();
};

function updateBtns() {
	if (isPaused) {
		stepBtn.removeAttribute('disabled');
		runPauseBtn.innerHTML = "&#9658; Run";
	} else {
		stepBtn.setAttribute('disabled', 'true');
		// runPauseBtn.innerHTML = "Pause";
		runPauseBtn.innerHTML = "&#10073;&#10073; Pause";
	}

	if (updatingArrays.length == 0 || !isPaused) {
		stepBackBtn.setAttribute('disabled', 'true');
	} else {
		stepBackBtn.removeAttribute('disabled');
	}
};

function cellClick(event) {
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;

	var column = (x - x % cellSize) / cellSize;
	var row = (y - y % cellSize) / cellSize;

	if (field[row][column] == 1) {
		field[row][column] = 0;
		population -= 1;
	} else {
		field[row][column] = 1;
		population += 1;
	}
	renderCell(row, column);
	updatingArrays[updatingArrays.length - 1].push([row, column]);

	updatePopulation();
};

function clearField() {
	for (var row = 0; row < rows; row++) {
		field[row] = [];
		for (var column = 0; column < columns; column++) {
			field[row][column] = 0;
			renderCell(row, column);
		}
	}
	population = 0;
	updatePopulation();
};

function updatePopulation() {
	populationLabel.innerHTML = "Population: " + population;
};

function updateIteration() {
	iterationLabel.innerHTML = "Time: " + iteration;
};

function togglePause() {
	isPaused = !isPaused;
	updateBtns();
};


// нетронутые клетки
// еще украшательства кнопок (стили)
// развернуть на сервере