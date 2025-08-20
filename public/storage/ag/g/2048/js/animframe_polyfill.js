(() => {
	var lastTime = 0;
	var vendors = ["webkit", "moz"];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
		window.cancelAnimationFrame =
			window[vendors[x] + "CancelAnimationFrame"] ||
			window[vendors[x] + "CancelRequestAnimationFrame"];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (callback) => {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(() => {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = (id) => {
			clearTimeout(id);
		};
	}
})();
