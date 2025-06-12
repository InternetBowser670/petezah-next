const API_KEY = "22e40eda03c997570e3dbc0c3a30edbc";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("search");
const discoverButton = document.getElementById("discover");
const main = document.querySelector("main");

discoverButton.addEventListener("click", () => {
	const query = searchInput.value.trim();
	if (query) {
		searchMovies(query);
	} else {
		alert("Please enter a search term.");
	}
});

async function searchMovies(query) {
	try {
		const response = await fetch(
			`${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
		);
		const data = await response.json();
		displayMovies(data.results);
	} catch (error) {
		console.error("Error fetching movies:", error);
		alert("Failed to fetch movies. Please try again later.");
	}
}

function displayMovies(movies) {
	const resultsContainer = document.createElement("div");
	resultsContainer.classList.add("results");

	movies.forEach((movie) => {
		const movieDiv = document.createElement("div");
		movieDiv.classList.add("movie");

		const movieImage = document.createElement("img");
		movieImage.src = movie.poster_path
			? `${IMAGE_BASE_URL}${movie.poster_path}`
			: "https://via.placeholder.com/200x300?text=No+Image";
		movieImage.alt = movie.title;

		const movieTitle = document.createElement("h2");
		movieTitle.textContent = movie.title;

		const watchButton = document.createElement("button");
		watchButton.textContent = "Watch Now";
		watchButton.classList.add("watch-btn");
		watchButton.addEventListener("click", () => {
			window.location.href = `player.html?tmdbid=${movie.id}`;
		});

		movieDiv.appendChild(movieImage);
		movieDiv.appendChild(movieTitle);
		movieDiv.appendChild(watchButton);

		resultsContainer.appendChild(movieDiv);
	});

	// Clear previous results and add new ones
	main.innerHTML = `<h1>szvyflix</h1><p>free movies, at any time</p><input id="search" placeholder="Search for a movie..."><button id="discover">Discover</button>`;
	main.appendChild(resultsContainer);
}
