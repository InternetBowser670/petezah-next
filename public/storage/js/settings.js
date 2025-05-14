document.addEventListener("DOMContentLoaded", () => {
	// DOM Elements (Took FOREVER)
	const elements = {
		tabs: document.querySelectorAll(".tab") || [],
		sections: document.querySelectorAll(".section") || [],
		legalTabs: document.querySelectorAll(".legal-tab") || [],
		legalSections: document.querySelectorAll(".legal-section") || [],
		beforeUnloadToggle: document.getElementById("beforeUnloadToggle"),
		autocloakToggle: document.getElementById("autocloakToggle"),
		blockHeadersToggle: document.getElementById("blockHeadersToggle"),
		disableRightClickToggle: document.getElementById("disableRightClickToggle"),
		sitePreset: document.getElementById("sitePreset"),
		siteTitle: document.getElementById("siteTitle"),
		siteLogo: document.getElementById("siteLogo"),
		themeSelect: document.getElementById("themeSelect"),
		backgroundColor: document.getElementById("backgroundColor"),
		backgroundImage: document.getElementById("backgroundImage"),
		removeBackgroundImage: document.getElementById("removeBackgroundImage"),
		panicKey: document.getElementById("panicKey"),
		panicUrl: document.getElementById("panicUrl"),
		saveSettings: document.getElementById("saveSettings"),
		saveAppearance: document.getElementById("saveAppearance"),
		savePanicSettings: document.getElementById("savePanicSettings"),
		resetSettings: document.getElementById("resetSettings"),
		openAboutBlank: document.getElementById("openAboutBlank"),
		exportData: document.getElementById("exportData"),
		importData: document.getElementById("importData"),
		resetAllData: document.getElementById("resetAllData"),
		disableParticles: document.getElementById("disableParticles"),
	};

	// Presets with matching favicons
	const presets = {
		classroom: {
			title: "Google Classroom",
			favicon: "https://ssl.gstatic.com/classroom/favicon.ico",
		},
		schoology: {
			title: "Schoology",
			favicon:
				"https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico",
		},
		google: { title: "Google", favicon: "https://www.google.com/favicon.ico" },
		petezah: {
			title: "PeteZah",
			favicon: "/storage/images/logo-png-removebg-preview.png",
		},
	};

	// Themes
	const themes = {
		default: { bgColor: "#0A1D37", textColor: "#FFFFFF" },
		"swampy-green": { bgColor: "#1A3C34", textColor: "#D4E4D9" },
		"royal-purple": { bgColor: "#2A1A3C", textColor: "#E2D4E9" },
		"blood-red": { bgColor: "#3C0A1A", textColor: "#E9D4D4" },
		"midnight-forest": { bgColor: "#1F2A2F", textColor: "#CDE4D9" },
		"cyber-neon": { bgColor: "#1A1A2E", textColor: "#E0E0FF" },
		"desert-oasis": { bgColor: "#3C2F1A", textColor: "#E9E4D4" },
		"glacial-frost": { bgColor: "#2A3C4F", textColor: "#D4E9E9" },
	};

	// Utility Functions
	const applyGlobalSettings = () => {
		const savedTitle = localStorage.getItem("siteTitle");
		if (savedTitle) document.title = savedTitle;

		const savedLogo = localStorage.getItem("siteLogo");
		if (savedLogo) updateFavicon(savedLogo);

		const savedTheme = localStorage.getItem("theme") || "default";
		document.body.className = document.body.className.replace(/theme-\w+/g, "");
		document.body.classList.add(`theme-${savedTheme}`);

		const savedBackgroundImage = localStorage.getItem("backgroundImage");
		const savedBackgroundColor =
			localStorage.getItem("backgroundColor") || themes[savedTheme].bgColor;

		if (savedBackgroundImage) {
			document.body.style.backgroundImage = `url(${savedBackgroundImage})`;
			document.body.style.backgroundSize = "cover";
			document.body.style.backgroundRepeat = "no-repeat";
			document.body.style.backgroundPosition = "center";
			document.body.style.backgroundColor = "";
		} else {
			document.body.style.backgroundImage = "none";
			document.body.style.backgroundColor = savedBackgroundColor;
		}
		document.body.style.color = themes[savedTheme].textColor;

		applyRightClickProtection();
		applyParticleSettings();
		if (localStorage.getItem("beforeUnload") === "true") {
			window.addEventListener("beforeunload", beforeUnloadHandler);
		} else {
			window.removeEventListener("beforeunload", beforeUnloadHandler);
		}
	};

	const applyRightClickProtection = () => {
		document.removeEventListener("contextmenu", rightClickHandler);
		if (localStorage.getItem("disableRightClick") === "true") {
			document.addEventListener("contextmenu", rightClickHandler);
		}
	};

	const applyParticleSettings = () => {
		const particleContainers = document.querySelectorAll(".particles");
		const particles = document.querySelectorAll(".particle");

		if (localStorage.getItem("disableParticles") === "true") {
			particleContainers.forEach((container) => {
				if (container.parentNode) container.parentNode.removeChild(container);
			});
			particles.forEach((particle) => {
				if (particle.parentNode) particle.parentNode.removeChild(particle);
			});
		}
	};

	const broadcastSettingsChange = () => {
		localStorage.setItem("settingsUpdated", Date.now().toString());
		applyGlobalSettings();
	};

	const loadSettings = () => {
		if (elements.beforeUnloadToggle)
			elements.beforeUnloadToggle.checked =
				localStorage.getItem("beforeUnload") === "true";
		if (elements.autocloakToggle)
			elements.autocloakToggle.checked =
				localStorage.getItem("autocloak") === "true";
		if (elements.blockHeadersToggle)
			elements.blockHeadersToggle.checked =
				localStorage.getItem("blockHeaders") === "true";
		if (elements.disableRightClickToggle)
			elements.disableRightClickToggle.checked =
				localStorage.getItem("disableRightClick") === "true";
		if (elements.siteTitle)
			elements.siteTitle.value = localStorage.getItem("siteTitle") || "";
		if (elements.panicKey)
			elements.panicKey.value = localStorage.getItem("panicKey") || "";
		if (elements.panicUrl)
			elements.panicUrl.value =
				localStorage.getItem("panicUrl") || "https://classroom.google.com";
		if (elements.backgroundColor) {
			elements.backgroundColor.value =
				localStorage.getItem("backgroundColor") || themes["default"].bgColor;
		}
		if (elements.themeSelect) {
			const savedTheme = localStorage.getItem("theme") || "default";
			elements.themeSelect.value = savedTheme;
			document.body.classList.add(`theme-${savedTheme}`);
			if (!localStorage.getItem("backgroundImage")) {
				document.body.style.backgroundColor = themes[savedTheme].bgColor;
			}
			document.body.style.color = themes[savedTheme].textColor;
		}
		if (elements.disableParticles) {
			elements.disableParticles.checked =
				localStorage.getItem("disableParticles") === "true";
		}

		applyGlobalSettings();
	};

	const updateFavicon = (url) => {
		let favicon = document.querySelector('link[rel="icon"]');
		if (!favicon) {
			favicon = document.createElement("link");
			favicon.rel = "icon";
			document.head.appendChild(favicon);
		}
		favicon.href = url;
	};

	const handleTabSwitch = (tabs, sections, dataAttr) => {
		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const target = tab.getAttribute(dataAttr);
				sections.forEach((section) => section.classList.remove("active"));
				document.getElementById(target).classList.add("active");
				tabs.forEach((t) => t.classList.remove("active"));
				tab.classList.add("active");
			});
		});
	};

	const openAboutBlank = () => {
		const popup = window.open("about:blank", "_blank");
		if (!popup || popup.closed) {
			alert("Please allow popups for about:blank to work.");
			return;
		}
		popup.document.title = localStorage.getItem("siteTitle") || "Home";
		const favicon = popup.document.createElement("link");
		favicon.rel = "icon";
		favicon.href =
			localStorage.getItem("siteLogo") ||
			"/storage/images/logo-png-removebg-preview.png";
		popup.document.head.appendChild(favicon);
		const iframe = popup.document.createElement("iframe");
		iframe.src = "/index.html";
		iframe.style.cssText = "width: 100vw; height: 100vh; border: none;";
		popup.document.body.style.margin = "0";
		popup.document.body.appendChild(iframe);
	};

	const autocloak = () => {
		openAboutBlank();
		window.location.href =
			localStorage.getItem("panicUrl") || "https://classroom.google.com";
	};

	const exportData = () => {
		const data = {
			localStorage: { ...localStorage },
			cookies: document.cookie,
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "settings-export.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	const importData = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = JSON.parse(e.target.result);
			localStorage.clear();
			Object.keys(data.localStorage).forEach((key) =>
				localStorage.setItem(key, data.localStorage[key]),
			);
			document.cookie = data.cookies;
			loadSettings();
			applyGlobalSettings();
			broadcastSettingsChange();
		};
		reader.readAsText(file);
	};

	const resetAllData = () => {
		if (
			confirm(
				"Are you sure you want to reset all data? This will clear all settings, cookies, and local storage.",
			)
		) {
			localStorage.clear();
			document.cookie.split(";").forEach((cookie) => {
				document.cookie =
					cookie.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			});
			loadSettings();
			applyGlobalSettings();
			broadcastSettingsChange();
		}
	};

	// Event Handlers
	const beforeUnloadHandler = (e) => {
		e.preventDefault();
		e.returnValue = "";
	};

	const rightClickHandler = (e) => e.preventDefault();

	if (elements.beforeUnloadToggle) {
		elements.beforeUnloadToggle.addEventListener("change", () => {
			localStorage.setItem("beforeUnload", elements.beforeUnloadToggle.checked);
			applyGlobalSettings();
			broadcastSettingsChange();
		});
	}

	if (elements.autocloakToggle) {
		elements.autocloakToggle.addEventListener("change", () => {
			localStorage.setItem("autocloak", elements.autocloakToggle.checked);
			if (elements.autocloakToggle.checked) autocloak();
			broadcastSettingsChange();
		});
	}

	if (elements.blockHeadersToggle) {
		elements.blockHeadersToggle.addEventListener("change", () => {
			localStorage.setItem("blockHeaders", elements.blockHeadersToggle.checked);
			broadcastSettingsChange();
		});
	}

	if (elements.disableRightClickToggle) {
		elements.disableRightClickToggle.addEventListener("change", () => {
			localStorage.setItem(
				"disableRightClick",
				elements.disableRightClickToggle.checked,
			);
			applyGlobalSettings();
			broadcastSettingsChange();
		});
	}

	if (elements.sitePreset) {
		elements.sitePreset.addEventListener("change", () => {
			const preset = elements.sitePreset.value;
			if (preset !== "custom") {
				elements.siteTitle.value = presets[preset].title;
				localStorage.setItem("siteTitle", presets[preset].title);
				localStorage.setItem("siteLogo", presets[preset].favicon);
				applyGlobalSettings();
				broadcastSettingsChange();
			}
		});
	}

	if (elements.saveSettings) {
		elements.saveSettings.addEventListener("click", () => {
			if (elements.siteTitle.value) {
				localStorage.setItem("siteTitle", elements.siteTitle.value);
			}
			if (elements.siteLogo.files[0]) {
				const reader = new FileReader();
				reader.onload = (e) => {
					localStorage.setItem("siteLogo", e.target.result);
					applyGlobalSettings();
					broadcastSettingsChange();
				};
				reader.readAsDataURL(elements.siteLogo.files[0]);
			} else {
				applyGlobalSettings();
				broadcastSettingsChange();
			}
		});
	}

	if (elements.themeSelect) {
		elements.themeSelect.addEventListener("change", () => {
			const theme = elements.themeSelect.value;
			localStorage.setItem("theme", theme);
			document.body.className = document.body.className.replace(
				/theme-\w+/g,
				"",
			);
			document.body.classList.add(`theme-${theme}`);
			if (!localStorage.getItem("backgroundImage")) {
				document.body.style.backgroundColor = themes[theme].bgColor;
				elements.backgroundColor.value = themes[theme].bgColor;
				localStorage.setItem("backgroundColor", themes[theme].bgColor);
			}
			document.body.style.color = themes[theme].textColor;
			broadcastSettingsChange();
		});
	}

	if (elements.saveAppearance) {
		elements.saveAppearance.addEventListener("click", () => {
			localStorage.setItem("backgroundColor", elements.backgroundColor.value);
			if (elements.backgroundImage && elements.backgroundImage.files[0]) {
				const reader = new FileReader();
				reader.onload = (e) => {
					localStorage.setItem("backgroundImage", e.target.result);
					applyGlobalSettings();
					broadcastSettingsChange();
				};
				reader.readAsDataURL(elements.backgroundImage.files[0]);
			} else {
				applyGlobalSettings();
				broadcastSettingsChange();
			}
			if (elements.disableParticles) {
				localStorage.setItem(
					"disableParticles",
					elements.disableParticles.checked,
				);
				applyParticleSettings();
			}
		});
	}

	if (elements.backgroundColor) {
		elements.backgroundColor.addEventListener("input", () => {
			if (!localStorage.getItem("backgroundImage")) {
				document.body.style.backgroundColor = elements.backgroundColor.value;
			}
			localStorage.setItem("theme", "custom");
			if (elements.themeSelect) elements.themeSelect.value = "default";
		});
	}

	if (elements.backgroundImage) {
		elements.backgroundImage.addEventListener("change", () => {
			if (elements.backgroundImage.files[0]) {
				const reader = new FileReader();
				reader.onload = (e) => {
					document.body.style.backgroundImage = `url(${e.target.result})`;
					document.body.style.backgroundSize = "cover";
					document.body.style.backgroundRepeat = "no-repeat";
					document.body.style.backgroundPosition = "center";
					document.body.style.backgroundColor = "";
				};
				reader.readAsDataURL(elements.backgroundImage.files[0]);
			}
		});
	}

	if (elements.removeBackgroundImage) {
		elements.removeBackgroundImage.addEventListener("click", () => {
			localStorage.removeItem("backgroundImage");
			document.body.style.backgroundImage = "none";
			document.body.style.backgroundColor =
				elements.backgroundColor.value || themes["default"].bgColor;
			broadcastSettingsChange();
		});
	}

	if (elements.disableParticles) {
		elements.disableParticles.addEventListener("change", () => {
			localStorage.setItem(
				"disableParticles",
				elements.disableParticles.checked,
			);
			applyParticleSettings();
			broadcastSettingsChange();
		});
	}

	if (elements.savePanicSettings) {
		elements.savePanicSettings.addEventListener("click", () => {
			localStorage.setItem("panicKey", elements.panicKey.value);
			localStorage.setItem("panicUrl", elements.panicUrl.value);
			broadcastSettingsChange();
		});
	}

	if (elements.resetSettings) {
		elements.resetSettings.addEventListener("click", () => {
			if (confirm("Are you sure you want to reset all settings to default?")) {
				localStorage.clear();
				loadSettings();
				applyGlobalSettings();
				broadcastSettingsChange();
			}
		});
	}

	if (elements.openAboutBlank) {
		elements.openAboutBlank.addEventListener("click", openAboutBlank);
	}

	if (elements.exportData) {
		elements.exportData.addEventListener("click", exportData);
	}

	if (elements.importData) {
		elements.importData.addEventListener("change", importData);
	}

	if (elements.resetAllData) {
		elements.resetAllData.addEventListener("click", resetAllData);
	}

	window.addEventListener("keydown", (e) => {
		const panicKey = localStorage.getItem("panicKey");
		const panicUrl = localStorage.getItem("panicUrl");
		if (panicKey && panicUrl && e.key === panicKey) {
			window.location.href = panicUrl;
		}
	});

	window.addEventListener("storage", (e) => {
		if (e.key === "settingsUpdated") {
			applyGlobalSettings();
		}
	});

	// Initialization
	loadSettings();
	handleTabSwitch(elements.tabs, elements.sections, "data-tab");
	handleTabSwitch(elements.legalTabs, elements.legalSections, "data-legal");

	const inIframe = window !== window.top;
	if (
		!inIframe &&
		elements.autocloakToggle &&
		elements.autocloakToggle.checked &&
		!navigator.userAgent.includes("Firefox")
	) {
		autocloak();
	}
});

// Event Handlers
const beforeUnloadHandler = (e) => {
	e.preventDefault();
	e.returnValue = "";
};

const rightClickHandler = (e) => e.preventDefault();
