rows = 100;
columns = 200;
cellSize = 6;
borderSize = 0;
fps = 500;
field = [];
updatingArray = [];
fps = 10;
isPaused = false;
initialEmptyPart = 0.3;
initialDensity = 0.1;
cellColor = "white";
emptyCellColor = "darkslategray";

canvas = document.getElementById("canvas");
canvas.height = rows * cellSize;
canvas.width = columns * cellSize;
ctx = canvas.getContext('2d');

canvasLeft = canvas.offsetLeft;
canvasTop = canvas.offsetTop;

canvas.addEventListener("click", cellClick, false);

stepBtn = document.getElementById("step");
pauseBtn = document.getElementById("pause");
runBtn = document.getElementById("run");
updateBtns();

population = 0;
populationLabel = document.getElementById("population");

iterationLabel = document.getElementById("iteration");
iteration = 0;


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

function updateCell(row, column) {
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
			updatingArray.push([row, column]);
			population += 1;
		}
	} else {
		if (neibCount != 3 && neibCount != 2) {
			updatingArray.push([row, column]);
			population -= 1;
		}
	}
};

function makeOneStep(force) {
	if (!force && isPaused) {
		return;
	}

	for (var row = 0; row < rows; row++) {
		for (var column = 0; column < columns; column++) {
			updateCell(row, column);
		}
	}

	while (updatingArray.length > 0) {
		var rcArr = updatingArray.pop();
		var row = rcArr[0];
		var column = rcArr[1];
		if (field[row][column] == 1) {
			field[row][column] = 0;
		} else {
			field[row][column] = 1;
		}
		renderCell(row, column);
	}

	updatePopulation();

	iteration += 1;
	updateIteration();
};

function pause() {
	isPaused = true;
	updateBtns();
};

function run() {
	isPaused = false;
	updateBtns();
};

function updateBtns() {
	if (isPaused) {
		stepBtn.removeAttribute('disabled');
		runBtn.removeAttribute('disabled');
		pauseBtn.setAttribute('disabled', 'true');
	} else {
		stepBtn.setAttribute('disabled', 'true');
		runBtn.setAttribute('disabled', 'true');
		pauseBtn.removeAttribute('disabled');
	}
};

function cellClick(event) {
	var x = event.pageX - canvasLeft;
	var y = event.pageY - canvasTop;

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


// отмотка на несколько ходов