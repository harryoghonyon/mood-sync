const fetchFromServer = async (type) => {
    try {
      const response = await fetch(`http://localhost:3000/data?type=${type}`); // Replace the URL with the actual URL of your Node.js server
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      renderTrack(data);
      // Use the data in your frontend as needed
    } catch (error) {
      console.error("Error fetching data from the server:", error.message);
    }
  };
  
  // Call the function to fetch data from the server
  fetchFromServer();
  
  const renderTrack = (data) => {
    const artists = data.track.artists.map((artist) => artist.name).join(", ");
    const musicCoverImage = data.track.album.images.find(
      (image) => image.height === 300
    ).url;
    const songName = data.track.name;
    songName[0].toUpperCase() + songName.slice(1);
  
    const trackContainer = document.createElement("div");
    trackContainer.innerHTML = `
        <img src="${musicCoverImage}" alt="Music Cover Image">
        <p>${songName}</p>
        <p>${artists}</p>
        <button class="preview-button">Preview</button>
      `;
  
    const previewButton = trackContainer.querySelector(".preview-button");
    const audio = new Audio(data.track.preview_url);
  
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
  
    // document.body.style.backgroundImage = `url(${musicCoverImage})`;
    // document.body.style.backgroundSize = "cover";
    // document.body.style.backgroundRepeat = "no-repeat";
    // document.body.style.backgroundPosition = "center";
  
    document.body.appendChild(trackContainer);
    document.querySelector("#song-container").appendChild(trackContainer);
  };
  
  const liElements = document.querySelectorAll("li");
  
  liElements.forEach((li) => {
    li.addEventListener("click", () => {
      const type = li.dataset.type;
      fetchFromServer(type);
    });
  });
  