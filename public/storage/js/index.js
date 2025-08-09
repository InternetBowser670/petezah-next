const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const menuToggler = document.querySelector(".menu-toggler");
const mainContent = document.querySelector(".main-content");
const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
const mainFrame = document.getElementById("mainFrame");

// Initially collapse the sidebar
sidebar.classList.add("collapsed");
mainContent.classList.remove("sidebar-expanded");

// Toggle sidebar's collapsed state
sidebarToggler.addEventListener("click", () => {
	sidebar.classList.toggle("collapsed");
	mainContent.classList.toggle("sidebar-expanded");
});

// Ensure these heights match the CSS sidebar height values
const collapsedSidebarHeight = "56px"; // Height in mobile view (collapsed)
const fullSidebarHeight = "calc(100vh - 32px)"; // Height in larger screen

// Update sidebar height and menu toggle text
const toggleMenu = (isMenuActive) => {
	sidebar.style.height = isMenuActive
		? `${sidebar.scrollHeight}px`
		: collapsedSidebarHeight;
	menuToggler.querySelector("span").innerText = isMenuActive ? "close" : "menu";
};

// Toggle menu-active class and adjust height
menuToggler.addEventListener("click", () => {
	toggleMenu(sidebar.classList.toggle("menu-active"));
});

// (Optional code): Adjust sidebar height on window resize
window.addEventListener("resize", () => {
	if (window.innerWidth >= 1024) {
		sidebar.style.height = fullSidebarHeight;
	} else {
		sidebar.classList.remove("collapsed");
		sidebar.style.height = "auto";
		toggleMenu(sidebar.classList.contains("menu-active"));
	}
});

class TxtType {
	constructor(el, toRotate, period) {
		this.toRotate = toRotate;
		this.el = el;
		this.loopNum = 0;
		this.period = Number.parseInt(period, 10) || 2000;
		this.txt = "";
		this.tick();
		this.isDeleting = false;
	}

	tick() {
		const i = this.loopNum % this.toRotate.length;
		const fullTxt = this.toRotate[i];

		if (this.isDeleting) {
			this.txt = fullTxt.substring(0, this.txt.length - 1);
		} else {
			this.txt = fullTxt.substring(0, this.txt.length + 1);
		}

		this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

		let delta = 200 - Math.random() * 100;

		if (this.isDeleting) {
			delta /= 2;
		}

		if (!this.isDeleting && this.txt === fullTxt) {
			delta = this.period;
			this.isDeleting = true;
		} else if (this.isDeleting && this.txt === "") {
			this.isDeleting = false;
			this.loopNum++;
			delta = 500;
		}

		setTimeout(() => this.tick(), delta);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const elements = document.getElementsByClassName("typewrite");
	for (let i = 0; i < elements.length; i++) {
		const toRotate = elements[i].getAttribute("data-type");
		const period = elements[i].getAttribute("data-period");
		if (toRotate) {
			new TxtType(elements[i], JSON.parse(toRotate), period);
		}
	}

	// INJECT CSS
	const css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = ".typewrite > .wrap { border-right: 0.06em solid #a04cff}";
	document.body.appendChild(css);

	// Make the Home nav item active by default
	if (navLinks.length > 0) {
		navLinks[0].classList.add("active"); // Add active class to the first link (Home)
	}
});

// Add this part to handle the active nav item
navLinks.forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault(); // Prevent default link behavior
		const src = link.getAttribute("data-src");
		if (src) {
			mainFrame.src = src;
		}

		// Remove active class from all links
		navLinks.forEach((navLink) => navLink.classList.remove("active"));

		// Add active class to the clicked link
		link.classList.add("active");
	});
});
