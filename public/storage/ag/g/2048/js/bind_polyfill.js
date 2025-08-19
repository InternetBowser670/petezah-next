Function.prototype.bind =
	Function.prototype.bind ||
	function (target) {
		return (args) => {
			if (!(args instanceof Array)) {
				args = [args];
			}
			this.apply(target, args);
		};
	};
