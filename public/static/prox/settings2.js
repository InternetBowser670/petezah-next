const beforeUnloadEnabled =
	localStorage.getItem("beforeUnloadEnabled") === "true";
if (beforeUnloadEnabled) {
	window.addEventListener("beforeunload", (e) => {
		e.preventDefault();
		e.returnValue = "";
	});
}

const savedTitle = localStorage.getItem("siteTitle");
if (savedTitle) {
	document.title = savedTitle;
}

const savedLogo = localStorage.getItem("siteLogo");
if (savedLogo) {
	const logoElement = document.querySelector('link[rel="icon"]');
	if (logoElement) {
		logoElement.href = savedLogo;
	}
}

const panicKey = localStorage.getItem("panicKey");
const panicUrl = localStorage.getItem("panicUrl");
if (panicKey && panicUrl) {
	window.addEventListener("keydown", (event) => {
		if (event.key === panicKey) {
			window.location.href = panicUrl;
		}
	});
}
