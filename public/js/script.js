document.addEventListener("DOMContentLoaded", () => {
  const images = [
    "dc1.jpg",
    "FF4.jpg",
    "shield 1.jpg",
    "spider.jpg",
    "t-dd-53.jpg",
    "worlds.jpg",
  ];

  function shuffleArray(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const shuffledImages = shuffleArray(images);
  const imageSize = "200px 300px";
  let backgroundImages = "";

  for (let i = 0; i < shuffledImages.length; i++) {
    backgroundImages += `url('/assets/${shuffledImages[i]}') ${
      i % 2 === 0 ? "center" : "left"
    } repeat, `;
  }
  backgroundImages = backgroundImages.slice(0, -2);
  console.log("Bsckground images:", backgroundImages);
  document.body.style.backgroundImage = backgroundImages;
  document.body.style.backgroundSize = imageSize;
  document.body.style.backgroundRepeat = "repeat";
});
