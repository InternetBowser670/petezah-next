const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function replacePlayer() {
  document.querySelector( 'video' ).pause();
  //remove current youtube player
  document.getElementById("player").onLoad =
    "await sleep(3000) document.getElementById('player').innerHTML = ''";
  document.getElementById("player").innerHTML = "";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "firefox lmao",
      Accept: "application/json",
    },
    body:
      '{"url": "' +
      location.href +
      '","filenameStyle":"pretty"}',
  };
  console.log(options.body);
  console.log("[Ghost.service] Requesting player from Ghost Api!");
  fetch("https://immortal2willlose.xyz/api/dl/v1/", options)
    .then((response) => response.json())
    .then(async (data) => {
      await sleep(500);
      console.log(data);
      const ccurl = data.url.replace(
        "http://152.53.80.20:9000/",
        "https://immortal2willlose.xyz/api/dl/v1/"
      );
      document.getElementById("player").innerHTML =
        "<video controls width='100%' style='border-radius: 10px;' id='ghost_player' autoplay><source src='" +
        ccurl +
        "' type='video/mp4'></video>";
      console.log("[Ghost.complete] Youtube Player Replaced!");
    })
    .catch((err) => console.error(err));
}

if(localStorage.getItem("youtube_alert") === null) {
  alert("janky youtube bypass by the ghost network team, if no video appears, refresh")
  localStorage.setItem("youtube_alert", "true")
}
//keep checking the player to avoid youtube going schizo
setInterval(async function () {
  if (document.getElementById("cinematics-container")) {
    await replacePlayer();
  }
}, 2000);

let pUrl = "";
const observer = new MutationObserver(async function (mutations) {
  if (window.location.href !== pUrl) {
    pUrl = window.location.href;
    await replacePlayer();
  }
});
const config = { subtree: true, childList: true };
observer.observe(document, config);

document.addEventListener("navigate", async (event) => {
  location.reload();
});