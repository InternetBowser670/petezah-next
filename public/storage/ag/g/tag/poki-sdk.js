(() => {
	var e = (e) => {
			var n = RegExp("[?&]" + e + "=([^&]*)").exec(window.location.search);
			return n && decodeURIComponent(n[1].replace(/\+/g, " "));
		},
		n = "kids" === e("tag"),
		t = new ((() => {
			function e() {
				(this.queue = []),
					(this.init = (n) => (
						void 0 === n && (n = {}),
						new Promise((t, o) => {
							this.enqueue("init", n, t, o);
						})
					)),
					(this.rewardedBreak = () =>
						new Promise((e) => {
							e(!1);
						})),
					(this.noArguments = (n) => () => {
						this.enqueue(n);
					}),
					(this.oneArgument = (n) => (t) => {
						this.enqueue(n, t);
					}),
					(this.handleAutoResolvePromise = () =>
						new Promise((e) => {
							e();
						})),
					(this.throwNotLoaded = () => {
						console.debug(
							"PokiSDK is not loaded yet. Not all methods are available.",
						);
					});
			}
			return (
				(e.prototype.enqueue = function (e, t, o, i) {
					var r = {
						fn: e,
						options: t,
						resolveFn: o,
						rejectFn: i,
					};
					n ? i && i() : this.queue.push(r);
				}),
				(e.prototype.dequeue = function () {
					for (
						var e = () => {
							var e = n.queue.shift(),
								t = e,
								o = t.fn,
								i = t.options;
							"function" == typeof window.PokiSDK[o]
								? (null == e ? void 0 : e.resolveFn) ||
									(null == e ? void 0 : e.rejectFn)
									? window.PokiSDK[o](i)
											.then(() => {
												for (var n = [], t = 0; t < arguments.length; t++)
													n[t] = arguments[t];
												"function" == typeof e.resolveFn &&
													e.resolveFn.apply(e, n);
											})
											.catch(() => {
												for (var n = [], t = 0; t < arguments.length; t++)
													n[t] = arguments[t];
												"function" == typeof e.rejectFn &&
													e.rejectFn.apply(e, n);
											})
									: void 0 !== (null == e ? void 0 : e.fn) &&
										window.PokiSDK[o](i)
								: console.error("Cannot execute " + e.fn);
						};
						this.queue.length > 0;
					)
						e();
				}),
				e
			);
		})())();
	(window.PokiSDK = {
		init: t.init,
		initWithVideoHB: t.init,
		customEvent: t.throwNotLoaded,
		commercialBreak: t.handleAutoResolvePromise,
		rewardedBreak: t.rewardedBreak,
		displayAd: t.throwNotLoaded,
		destroyAd: t.throwNotLoaded,
		getLeaderboard: t.handleAutoResolvePromise,
		getSharableURL: () => new Promise((e, n) => n()),
		getURLParam: (n) => e("gd" + n) || e(n) || "",
	}),
		[
			"disableProgrammatic",
			"gameLoadingStart",
			"gameLoadingFinished",
			"gameInteractive",
			"roundStart",
			"roundEnd",
			"muteAd",
		].forEach((e) => {
			window.PokiSDK[e] = t.noArguments(e);
		}),
		[
			"setDebug",
			"gameplayStart",
			"gameplayStop",
			"gameLoadingProgress",
			"happyTime",
			"setPlayerAge",
			"togglePlayerAdvertisingConsent",
			"logError",
			"sendHighscore",
			"setDebugTouchOverlayController",
		].forEach((e) => {
			window.PokiSDK[e] = t.oneArgument(e);
		});
	var o,
		i =
			((o = window.pokiSDKVersion) || (o = e("ab") || "v2.263.0"),
			"poki-sdk-" + (n ? "kids" : "core") + "-" + o + ".js"),
		r = document.createElement("script");
	r.setAttribute("src", i),
		r.setAttribute("type", "text/javascript"),
		r.setAttribute("crossOrigin", "anonymous"),
		(r.onload = () => t.dequeue()),
		document.head.appendChild(r);
})();
