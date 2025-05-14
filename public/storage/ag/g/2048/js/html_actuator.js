function HTMLActuator() {
	this.tileContainer = document.querySelector(".tile-container");
	this.scoreContainer = document.querySelector(".score-container");
	this.bestContainer = document.querySelector(".best-container");
	this.messageContainer = document.querySelector(".game-message");

	this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
	window.requestAnimationFrame(() => {
		this.clearContainer(this.tileContainer);

		grid.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					this.addTile(cell);
				}
			});
		});

		this.updateScore(metadata.score);
		this.updateBestScore(metadata.bestScore);

		if (metadata.terminated) {
			if (metadata.over) {
				this.message(false); // You lose
			} else if (metadata.won) {
				this.message(true); // You win!
			}
		}
	});
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
	this.clearMessage();
};

HTMLActuator.prototype.clearContainer = (container) => {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

HTMLActuator.prototype.addTile = function (tile) {
	var wrapper = document.createElement("div");
	var inner = document.createElement("div");
	var position = tile.previousPosition || { x: tile.x, y: tile.y };
	var positionClass = this.positionClass(position);

	// We can't use classlist because it somehow glitches when replacing classes
	var classes = ["tile", "tile-" + tile.value, positionClass];

	if (tile.value > 2048) classes.push("tile-super");

	this.applyClasses(wrapper, classes);

	inner.classList.add("tile-inner");
	inner.textContent = tile.value;

	if (tile.previousPosition) {
		// Make sure that the tile gets rendered in the previous position first
		window.requestAnimationFrame(() => {
			classes[2] = this.positionClass({ x: tile.x, y: tile.y });
			this.applyClasses(wrapper, classes); // Update the position
		});
	} else if (tile.mergedFrom) {
		classes.push("tile-merged");
		this.applyClasses(wrapper, classes);

		// Render the tiles that merged
		tile.mergedFrom.forEach((merged) => {
			this.addTile(merged);
		});
	} else {
		classes.push("tile-new");
		this.applyClasses(wrapper, classes);
	}

	// Add the inner part of the tile to the wrapper
	wrapper.appendChild(inner);

	// Put the tile on the board
	this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = (element, classes) => {
	element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = (position) => ({
	x: position.x + 1,
	y: position.y + 1,
});

HTMLActuator.prototype.positionClass = function (position) {
	position = this.normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
	this.clearContainer(this.scoreContainer);

	var difference = score - this.score;
	this.score = score;

	this.scoreContainer.textContent = this.score;

	if (difference > 0) {
		var addition = document.createElement("div");
		addition.classList.add("score-addition");
		addition.textContent = "+" + difference;

		this.scoreContainer.appendChild(addition);
	}
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
	this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
	var type = won ? "game-won" : "game-over";
	var message = won ? "You win!" : "Game over!";

	this.messageContainer.classList.add(type);
	this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
	// IE only takes one value to remove at a time.
	this.messageContainer.classList.remove("game-won");
	this.messageContainer.classList.remove("game-over");
};
