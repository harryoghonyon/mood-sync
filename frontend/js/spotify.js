const { json } = require("express");

const global = {
  currentPage: window.location.pathname,
};

const showLoader = () => {
  const loader = document.querySelector("#loader-con");
  console.log(loader);
  if (loader) {
    loader.style.display = "block";
  } else {
    console.error("Error: loader element not found");
  }
};

const hideLoader = () => {
  const loader = document.querySelector("#loader-con");
  if (loader) {
    loader.style.display = "none";
  } else {
    console.error("Error: loader element not found");
  }
};

const fetchFromServer = async (type) => {
  console.log(type);
  showLoader();
  try {
    const response = await fetch(`http://localhost:3000/data?type=${type}`); // Replace the URL with the actual URL of your Node.js server
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    hideLoader();
    await renderTrack(data);
    // Use the data in your frontend as needed
  } catch (error) {
    console.error("Error fetching data from the server:", error.message);
  }
};

// Call the function to fetch data from the server
const renderTrack = async (data) => {
  const artists = data.track.artists.map((artist) => artist.name).join(", ");
  const musicCoverImage = data.track.album.images.find(
    (image) => image.height === 300
  ).url;
  const songName = data.track.name;
  songName[0].toUpperCase() + songName.slice(1);

  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(${musicCoverImage})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  const trackContainer = document.createElement("div");
  trackContainer.innerHTML = `
      <img src="${musicCoverImage}" alt="Music Cover Image">
      <p class="song-name">${songName}</p>
      <p class="artist-name">${artists}</p>
      <button class="preview-button">Preview</button>
    `;

  const previewButton = trackContainer.querySelector(".preview-button");
  let url = data.track.preview_url;
  if (!url) {
    console.log();
    url = await getTrackUrl(data.track.href);
  }

  const audio = new Audio(url);

  previewButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      previewButton.textContent = "Pause";
    } else {
      audio.pause();
      previewButton.textContent = "Preview";
    }
  });

  audio.addEventListener("ended", () => {
    previewButton.textContent = "Preview";
  });

  document.body.appendChild(overlayDiv); // Append the overlay div first
  document.body.appendChild(trackContainer);
  document.querySelector("#song-container").appendChild(trackContainer);
};

const moodOpts = document.querySelectorAll(".mood-opt");

moodOpts.forEach((mood) => {
  mood.addEventListener("click", () => {
    const type = mood.dataset.type;
    fetchFromServer(type);
  });
});

const gettingMessages = document.querySelectorAll(".getting-mssg");
let currentIndex = 0;

const displayNextMessage = () => {
  gettingMessages[currentIndex].classList.remove("visible");

  currentIndex = (currentIndex + 1) % gettingMessages.length;

  gettingMessages[currentIndex].classList.add("visible");
};

// Initial display
gettingMessages[currentIndex].classList.add("visible");

// Display the next message every 5 seconds
const interval = setInterval(displayNextMessage, 5000);

const getTrackUrl = async (url) => {
  try {
    const response = await fetch(`http://localhost:3000/track`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    console.log(response);
    return "";
  } catch (error) {
    console.log(error.message);
    return "";
  }
};

// const init = () => {
//   switch (global.pathname) {
//     case "/track.html":
//       fetchFromServer();
//       renderTrack();
//       displayNextMessage();
//       break; // Don't forget to add the "break" statement to exit the switch case
//   }
// };

// document.addEventListener("DOMContentLoaded", () => {
//   init();
// });
