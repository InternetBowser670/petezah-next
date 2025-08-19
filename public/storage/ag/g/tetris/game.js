var LEFT = -1;
var RIGHT = 1;

// Shape object includes name, location of starting blocks,
// and location of the pivot block.
var SHAPES = [
	{
		name: "I",
		startingCoordinates: [
			[1, 3],
			[1, 5],
			[1, 6],
		],
		pivot: [1, 4],
	},
	{
		name: "O",
		startingCoordinates: [
			[0, 4],
			[0, 5],
			[1, 5],
		],
		pivot: [1, 4],
	},
	{
		name: "T",
		startingCoordinates: [
			[0, 4],
			[1, 3],
			[1, 5],
		],
		pivot: [1, 4],
	},
	{
		name: "S",
		startingCoordinates: [
			[0, 4],
			[0, 5],
			[1, 3],
		],
		pivot: [1, 4],
	},
	{
		name: "Z",
		startingCoordinates: [
			[0, 3],
			[0, 4],
			[1, 5],
		],
		pivot: [1, 4],
	},
	{
		name: "J",
		startingCoordinates: [
			[0, 3],
			[1, 3],
			[1, 5],
		],
		pivot: [1, 4],
	},
	{
		name: "L",
		startingCoordinates: [
			[0, 5],
			[1, 3],
			[1, 5],
		],
		pivot: [1, 4],
	},
];

function Game(height, width, level) {
	this.level = level || 0;
	this.height = height;
	this.width = width;
	this.board = createBoard(height, width);
	this.shapeList = SHAPES;
	this.gotShape = false;
	this.clearedLines = 0;
	this.score = 0;
	this.currentShape = null;
	this.dead = false;
	this.interval = null;
	this.speed = 1000;
	this.newLevelFlag = true;
}

Game.prototype.getPoint = function (row, col) {
	if (!this.board[row] || !this.board[0][col]) {
		return -1;
	}
	var itemAtCoordinates = this.board[row][col];

	return itemAtCoordinates;
};

Game.prototype.setPoint = function (row, col, item) {
	this.board[row][col] = item;
};

Game.prototype.getActiveBlockLocations = function () {
	// Returns a list of row col location pairs for active blocks
	var blocks = [];
	var bCount = 0;

	this.board.some(function (row, rowIndex) {
		row.forEach(function (col, colIndex) {
			if (col === "o" || col === "O") {
				blocks.push({
					row: rowIndex,
					col: colIndex,
					blockType: col,
					currentShape: this.currentShape,
				});
				bCount += 1;
			}
		}, this);

		return bCount === 4;
	}, this);

	return blocks;
};

Game.prototype.getTargetLocations = (blockList, f) => {
	var targetList = blockList.map(f);

	return targetList;
};

Game.prototype.checkLegality = function (blockList) {
	// CHecks legality. Returns 'clear' or reason that move is illegal.
	var isLegal = "clear";

	blockList.some(function (block) {
		var itemAtPoint = this.getPoint(block.row, block.col);

		if (itemAtPoint === -1) {
			if (block.col < 0) {
				isLegal = "offLeft";
			} else if (block.col > this.width - 1) {
				isLegal = "offRight";
			} else {
				isLegal = "offBottom";
			}

			return false;
		} else if (itemAtPoint.indexOf("X") > -1) {
			isLegal = "X";

			return false;
		}
	}, this);

	return isLegal;
};

Game.prototype.transformBlocks = function (blockList, targetList) {
	// Wipe previous location.
	blockList.forEach(function (block) {
		this.setPoint(block.row, block.col, ".");
	}, this);

	// Set target location.
	targetList.forEach(function (block) {
		this.setPoint(block.row, block.col, block.blockType);
	}, this);

	this.checkRows();
};

Game.prototype.step = function (objRef) {
	// set this ref to work correctly with interval function.
	if (!this) {
	}

	this.checkRows();

	// Check for new shape or death.
	if (this.gotShape === false) {
		this.newShape();
	}

	if (this.dead) {
		clearInterval(this.interval);
		this.death();
		return;
	}

	this.moveDown();

	this.updateState();

	// Reset timer on level change
	if (this.newLevelFlag === true) {
		if (this.interval) {
			clearInterval(this.interval);
		}

		this.interval = setInterval(this.step, this.speed, this);
		this.newLevelFlag = false;
	}
};

Game.prototype.newShape = function () {
	// Select shape
	var type = randomShape();
	this.currentShape = type;

	for (var i = 0; i < this.shapeList.length; i++) {
		if (this.shapeList[i].name === type) {
			// Write shape to page from stored coordinate pairs (x=[0], y=[1])
			var chosenShape = this.shapeList[i];

			for (var j = 0; j < chosenShape.startingCoordinates.length; j++) {
				var point = chosenShape.startingCoordinates[j];

				// Check death.
				if (this.getPoint(point[0], point[1]) !== ".") {
					this.dead = true;
					console.log("death");
				}

				this.setPoint(point[0], point[1], "o");
			}

			this.setPoint(chosenShape.pivot[0], chosenShape.pivot[1], "O");
			this.gotShape = true;
			return;
		}
	}
};

Game.prototype.checkRows = function () {
	// Check rows and apply scoring.
	var fullRow = true;
	var rowMulti = 0;
	var rowsCleared = false;

	// Check for cleared rows.
	this.board.forEach(function (row, rowIndex) {
		fullRow = true;

		row.forEach((col) => {
			if (col.indexOf("X") === -1) {
				fullRow = false;
			}
		}, this);

		if (fullRow === true) {
			this.board.splice(rowIndex, 1);
			var newRow = [];

			for (var i = 0; i < this.width; i++) {
				newRow.push(".");
			}

			rowsCleared = true;
			this.board.unshift(newRow);
			rowMulti += 1;
		}
	}, this);

	// Calculate score increase
	if (rowsCleared) {
		this.clearedLines += rowMulti;
		this.score += rowMulti * 2 * 10 * (this.level + 1);
		this.increaseLevelCheck();
	}
};

Game.prototype.increaseLevelCheck = function () {
	var level = Math.floor(this.clearedLines / 10);

	if (level > this.level) {
		this.speed *= 0.75;
		this.level += 1;
		this.newLevelFlag = true;
	}
};

Game.prototype.moveSideways = function (transform) {
	var blockList = this.getActiveBlockLocations();

	var targetList = this.getTargetLocations(blockList, (block) => {
		// Clone block.
		var newBlock = JSON.parse(JSON.stringify(block));
		newBlock.col += transform;
		return newBlock;
	});

	if (this.checkLegality(targetList) === "clear") {
		this.transformBlocks(blockList, targetList);
		this.updateState();
	}
};

Game.prototype.moveDown = function () {
	var blockList = this.getActiveBlockLocations();

	var targetList = this.getTargetLocations(blockList, (block) => {
		// Clone obj to prevent modification of original.
		var newBlock = JSON.parse(JSON.stringify(block));
		newBlock.row += 1;
		return newBlock;
	});

	var isLegal = this.checkLegality(targetList);

	// Check legality then move or convert to landed.
	if (isLegal === "clear") {
		this.transformBlocks(blockList, targetList);
	} else {
		targetList = this.getTargetLocations(blockList, convertShape);
		this.transformBlocks(blockList, targetList);
		this.gotShape = false;
	}
	this.updateState();
};

Game.prototype.rotate = function (direction) {
	// Declared here to prevent repetition
	// Consider for general style?
	var rotate = "";
	var pivotIndex;
	var pivotYRow;
	var pivotXCol;

	switch (this.currentShape) {
		case "I":
			// Add code for 'proper' I rotation later
			rotate = "I";
			break;
		case "O":
			return;
		case "T":
		case "S":
		case "Z":
		case "J":
		case "L":
			break;
	}

	var blockList = this.getActiveBlockLocations();

	blockList.forEach((block, blockIndex) => {
		if (block.blockType === "O") {
			pivotIndex = blockIndex;
			pivotYRow = block.row;
			pivotXCol = block.col;
		}
	});

	// Get  differences from pivot
	blockList.forEach((block, blockIndex) => {
		if (blockIndex !== pivotIndex) {
			var rowDifference = block.row - blockList[pivotIndex].row;
			var colDifference = block.col - blockList[pivotIndex].col;

			if (direction === "clockwise") {
				block.xColTransform = pivotXCol - rowDifference;
				block.yRowTransform = pivotYRow + colDifference;
			} else {
				block.xColTransform = pivotXCol + rowDifference;
				block.yRowTransform = pivotYRow - colDifference;
			}
		}
	});

	var targetList = this.getTargetLocations(blockList, (block) => {
		if (!isNaN(block.xColTransform)) {
			// Seperate into function for clarity
			var newBlock = JSON.parse(JSON.stringify(block));
			newBlock.row = block.yRowTransform;
			newBlock.col = block.xColTransform;
			return newBlock;
		} else {
			return block;
		}
	});

	// Kick to side if next to wall. Cancel if overlapping block
	targetList = this.rotateCollisionHandler(targetList);

	// If handler has returned false, cancel rotation.
	if (!targetList) {
		return;
	}

	this.transformBlocks(blockList, targetList);

	this.updateState();
};

Game.prototype.rotateCollisionHandler = function (targetList) {
	var isLegal = this.checkLegality(targetList);

	if (isLegal !== "clear") {
		if (isLegal === "offLeft") {
			targetList = this.getTargetLocations(
				targetList,
				(block) => {
					var newBlock = JSON.parse(JSON.stringify(block));
					newBlock.col += 1;
					return newBlock;
				},
				this,
			);

			// Check again after 'kick'.
			return this.rotateCollisionHandler(targetList);
		} else if (isLegal === "offRight") {
			targetList = this.getTargetLocations(
				targetList,
				(block) => {
					var newBlock = JSON.parse(JSON.stringify(block));
					newBlock.col -= 1;

					return newBlock;
				},
				this,
			);

			return this.rotateCollisionHandler(targetList);
		}

		if (isLegal === "X") {
			return false;
		}
	}

	return targetList;
};

Game.prototype.updateState = function () {
	var resultString = "";

	// row and column measured from top-left.
	this.board.forEach(function (row) {
		row.forEach(function (col) {
			if (col[0] === ".") {
				resultString += "N";
			} else if (col[0] === "o" || col[0] === "O") {
				resultString += this.currentShape;
			} else if (col[0] === "X") {
				resultString += col[1];
			}
		}, this);
	}, this);

	// Better way to seperate view from logic?

	this.canvas.redraw(resultString);
	displayCurrentInfo(this.level, this.score, this.clearedLines);
};

Game.prototype.death = () => {
	console.log("You died!");
	gameOver();
};

function createBoard(height, width) {
	//defaults
	if (!height) {
		height = 22;
	}

	if (!width) {
		width = 10;
	}

	var board = [];

	for (var i = 0; i < height; i++) {
		board[i] = [];

		for (var j = 0; j < width; j++) {
			board[i][j] = ".";
		}
	}

	return board;
}

function randomShape() {
	var shapeString = "IOTSZJL";
	var randNum = Math.floor(Math.random() * shapeString.length);

	return shapeString.charAt(randNum);
}

function convertShape(block) {
	// Current shape needed to retain color after landing.
	block.blockType = "X" + block.currentShape;

	return block;
}

function addKeyboardControl(GameObject) {
	document.addEventListener("keydown", (event) => {
		switch (event.keyCode) {
			case 37:
				GameObject.moveSideways(LEFT);
				break;
			case 39:
				GameObject.moveSideways(RIGHT);
				break;
			case 38:
				GameObject.rotate("clockwise");
				break;
			case 90:
				GameObject.rotate("anti-clockwise");
				break;
			case 40:
				GameObject.moveDown();
				break;
		}
	});
}

function run(height, width, level, event) {
	height = 20;
	width = 10;
	level = 0;
	console.log("starting game");

	var currentGame = new Game(height, width, level);
	currentGame.canvas = new Canvas(height, width);
	addKeyboardControl(currentGame);
	currentGame.step();
}
