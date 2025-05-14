// A unminified version is at og-sw.js
self.addEventListener("install", (event) => {
	console.log("SW installing...");
	event.waitUntil(
		caches
			.open("soundboard-cache-v1")
			.then((cache) =>
				cache.addAll([
					"/",
					"index.html",
					"css/styles.css",
					"css/spinner.css",
					"img/mlg-favicon.png",
					"loader.js",
					"sounds.json",
				]),
			),
	);
});
self.addEventListener("activate", (event) => {
	console.log("SW activating...");
});
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => response || fetch(event.request)),
	);
});
