window.InitRV = function InitRV(id) {
	$.getScript("https://static.ultra-rv.com/rv-min.js", () => {
		const userId = id === undefined ? "Guest" : id;
		const ironRV = IronRV.getInstance({
			applicationKey: "1-mb5whk",
			applicationUserId: userId,
		});

		ironRV.addListener(IronRV.EVENTS.READY, () => {
			gameInstance.SendMessage("MainMenuManagers", "RvReady");
		});

		ironRV.addListener(IronRV.EVENTS.CLOSE, () => {
			gameInstance.SendMessage("MainMenuManagers", "RvWatchComplete", "false");
		});

		ironRV.addListener(IronRV.EVENTS.COMPLETION, () => {
			gameInstance.SendMessage("MainMenuManagers", "RvWatchComplete", "true");
		});

		ironRV.addListener(IronRV.EVENTS.AD_BLOCK, () => {
			ironRV.showAdBlockMessage();
		});

		ironRV.addListener(IronRV.EVENTS.INIT_ERROR, () => {});

		window.showRV = () => {
			ironRV.show();
		};
	});
};
