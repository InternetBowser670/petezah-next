const API_KEY = "22e40eda03c997570e3dbc0c3a30edbc";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const resultsContainer = document.querySelector(".results");
const nextPageButton = document.getElementById("next-page");

let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
	fetchPopularMovies(currentPage);
});

nextPageButton.addEventListener("click", () => {
	currentPage++;
	fetchPopularMovies(currentPage);
});

async function fetchPopularMovies(page) {
	try {
		const response = await fetch(
			`${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
		);
		const data = await response.json();
		const filteredMovies = data.results.filter((movie) => !movie.adult);
		displayMovies(filteredMovies);
	} catch (error) {
		console.error("Error fetching movies:", error);
		alert("Failed to fetch movies. Please try again later.");
	}
}

function displayMovies(movies) {
	resultsContainer.innerHTML = "";

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
}
