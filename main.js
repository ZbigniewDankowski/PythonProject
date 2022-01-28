const start = document.querySelector(".startBtn");
const menu = document.querySelector(".menu");
const content = document.querySelector(".gameContent");
const container = document.querySelector(".container");
const loadingScreen = document.querySelector(".loading");
const percentCounter = document.querySelector(".percent");

const loadingScreenFun = () => {
  loadingScreen.classList.remove("unactive");
  counter = 0;

  const counterInterval = setInterval(() => {
    counter++;
    percentCounter.textContent = `Loading ${counter}%`;
    if (counter === 100) {
      clearInterval(counterInterval);
      loadingScreen.classList.add("unactive");
      content.classList.remove("unactive");
      container.classList.add("container--playable");
      counter = 0;
    }
  }, 30);
};
start.addEventListener("click", () => {
  menu.classList.add("unactive");
  loadingScreenFun();
});
