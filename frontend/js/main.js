const mainWishTexts = document.querySelectorAll(".main-wish-txt");
let currentMainWishIndex = 0;

const displayNextMainWish = () => {
  mainWishTexts[currentMainWishIndex].classList.remove("visible");

  currentMainWishIndex = (currentMainWishIndex + 1) % mainWishTexts.length;

  mainWishTexts[currentMainWishIndex].classList.add("visible");
};

// Initial display
mainWishTexts[currentMainWishIndex].classList.add("visible");

// Display the next main wish every 3 seconds
const mainWishInterval = setInterval(displayNextMainWish, 3000);
