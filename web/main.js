// przypisanie do zmiennych potrzebnych elementów html

const start = document.getElementById("startBtn");
const inputSubmit = document.querySelector(".inputBtn");
const nameMessage = document.querySelector(".playerNameBox");
const counterBox = document.getElementById("counter");
const menu = document.querySelector(".menu");
const content = document.querySelector(".gameContent");
const container = document.querySelector(".container");
const loadingScreen = document.querySelector(".loading");
const percentCounter = document.querySelector(".percent");
const playerColors = [...document.querySelectorAll(".color")];
const AiColors = [...document.querySelectorAll(".color--ai")];
const modes = [...document.querySelectorAll(".level")];
const messageBox = document.querySelector(".message");
const messageInfo = document.querySelector(".info");
const messageBtn = document.querySelector(".again");

//tablica dla porównania elementów kliniętych
let isReady = false;
let activeCards = [];
let AiColorsForCompare = [];
let timeForInterval = 20;
let activeIndex = [];
let activeIndexNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

let playerPairCounter = AiColors.length / 2;
let aiPairCounter = AiColors.length / 2;
let isFinished = false;
let activeMode = null;
let YourName = "";

// funkcja ukrywa/pokazuje elementy
function SetVisibleElement(elementToHide, elementToShow) {
  elementToHide.classList.add("unactive");
  elementToShow.classList.remove("unactive");
}

//funkcja zamyka okno jako argument przyjmuje przycisk który zamyka oraz element do zamknięcia
function closeMessage(btn, elementToClose) {
  btn.addEventListener("click", () => {
    elementToClose.classList.add("unactive");
  });
}

//funkcja wysyła imię gracza do Pythona
function sendPlayerName() {
  let playerName = "";
  inputSubmit.addEventListener("click", async () => {
    playerName = document.querySelector(".inputPlayerName").value;
    if (playerName.length >= 1) {
      YourName = playerName;
      closeMessage(inputSubmit, nameMessage);
      isReady = true;
    } else return;
  });
}
//funkcja wysyła wybrany poziom do Pythona
async function sendMode(mode) {
  await eel.getMode(mode)();
}

//funkcja zwraca wybrany przez gracza poziom
function chooseMode() {
  modes.forEach((mode) => {
    mode.addEventListener("click", () => {
      activeMode = mode.dataset.level;
      modes.forEach((mode) => {
        mode.classList.remove("level--active");
      });
      mode.classList.add("level--active");
    });
  });
  sendMode(activeMode);

  return activeMode;
}

// funkcja pobiera kolor do każdego diva
async function getColors() {
  for (i = 0; i < playerColors.length; i++) {
    color = await eel.setColors("player")();
    playerColors[i].style.background = color;
  }
  getColorsAi();
}
async function getColorsAi() {
  for (i = 0; i < AiColors.length; i++) {
    color = await eel.setColors("ai")();
    AiColors[i].style.background = color;
  }
}

//funkcja nadaje lub odbiera event dla wszystkich elementów
function eventForDivs(eventValue) {
  if (eventValue === "add") {
    playerColors.forEach((color) => {
      color.addEventListener("click", clickElements);
    });
  }
  if (eventValue === "remove") {
    playerColors.forEach((div) => {
      div.removeEventListener("click", clickElements);
    });
  }
}

//funkcja obsługuje logikę kliknięcia w elementy
async function clickElements() {
  //po kliknięciu w element dodawana jest do niego klasa 'clicked' jeżelielement już ją posiada funkcja sie zatrzymie co powoduje że nie sprawdzi koloru przy kliknięciu 2 razy tego samego elementu
  if (!this.classList.contains("clicked")) {
    this.classList.add("clicked");
    this.classList.remove("clickable");
    //dodajemy do tablicy kliknęte elementy  a także wysyłamy kliknięty kolor do Pythona w celu porównania
    activeCards.push(this);
    let isTheSame = await eel.getColorFromJs(this.style.background, "player")();
    //jeżeli w tablicy są 2 elementy usuwamy event ze wszystkich kart i sprawdzamy czy elementy są takie same
    if (activeCards.length == 2) {
      eventForDivs("remove");
      //jeżeli Python zwrócił True czyli są takie same po 0.5s dodajemy z powrotem event na wszystkie karty i usuwamy z nich kolor, czyścimy tablice aktywnych elementów i obniżamy licznik par o 1 .Karty wciąż będą miały klase 'clicked' więc funkcja nie będzie ich brała pod uwagę.
      if (isTheSame) {
        playerPairCounter--;
        if (playerPairCounter === 0) {
          setTimeout(() => {
            getCounter("end");
            finishGame();
          }, 500);
        }
        setTimeout(() => {
          eventForDivs("add");
          activeCards.forEach((div) => {
            div.style.background = "transparent";
          });
          activeCards = [];
        }, 500);
      }
      //jeżeli kolory są inne po 0.5s dodajemy im klasę clickable która zakrywa kolor ,czycimy tablicę,dodajemy event oraz usuwamy z nich klasę 'clicked' co powoduje że elementy są znów aktywne
      else {
        setTimeout(() => {
          activeCards.forEach((div) => {
            div.classList.add("clickable");
            div.classList.remove("clicked");
          });
          eventForDivs("add");
          activeCards = [];
        }, 500);
      }

      {
      }
    }
  }
}
async function autoGameAi() {
  if (isFinished == false) {
    //index zawiera losową liczbę z przedziału 0-długośc tablicy z indeksami
    index = randomIndex(0, activeIndexNumbers.length);
    //do zmiennej indexFromArray przypisujemy liczbę która znajduje się pod wylosowanych wcześniej indeksem
    indexFromArray = activeIndexNumbers[index];
    //usuwamy  wylosowany index z tablicyi przypisujemy do tablicy która przetrzymuje te wylosowane indeksy
    activeIndexNumbers.splice(index, 1);
    activeIndex.push(indexFromArray);
    //przypisujemy do zmiennej wylosowany element o danym indeksie i wysyłamy do tablicy dla porównaniaz następnym
    activeElement = AiColors[indexFromArray];
    AiColorsForCompare.push(activeElement);
    //z wylosowanego elementu usuwamy klasę która zakrywa element
    activeElement.classList.remove("clickable");

    // zmienna pobiera dane z funkcji Pythona która porównuje oba elementy
    isTheSame = await eel.getColorFromJs(
      activeElement.style.background,
      "ai"
    )();
    // jeżeli w tablicy porównań są 2 elementy sprawdza czy są takie same wykorzystując zmienna z funkcją Pythona
    if (AiColorsForCompare.length === 2) {
      //jeżeli są takie same usuwa z nich kolor , czyści tablicę porównań oraz obniza licznik aktywnych par o 1
      if (isTheSame) {
        setTimeout(() => {
          AiColorsForCompare.forEach((div) => {
            div.style.background = "transparent";
          });
          AiColorsForCompare = [];
          aiPairCounter--;
          activeIndex = [];
          if (aiPairCounter === 0) {
            finishGame();
          }
        }, 300);
      }
      //jezeli nie są takie same dodaje klase zakrywającą , uzupełnia tablice z indeksami o wycięte wcześniej i czyści tablice porównań
      if (!isTheSame) {
        setTimeout(() => {
          AiColorsForCompare.forEach((div) => {
            div.classList.add("clickable");
          });
          activeIndexNumbers = [...activeIndexNumbers, ...activeIndex];

          activeIndex = [];
          AiColorsForCompare = [];
        }, 300);
      }
    }
  }
}

async function HardGameAi() {
  //funckja usuwa elmenty z gry
  removeFromGame = () => {
    setTimeout(() => {
      AiColorsForCompare.forEach((div) => {
        div.style.background = "transparent";
      });
      AiColorsForCompare = [];
      aiPairCounter--;
      activeIndex = [];
      if (aiPairCounter === 0) {
        finishGame();
      }
    }, 500);
  };
  //funckja dodaje elementy z gry na nowo
  addAgainToGame = () => {
    setTimeout(() => {
      AiColorsForCompare.forEach((div) => {
        div.classList.add("clickable");
      });
      activeIndexNumbers = [...activeIndexNumbers, ...activeIndex];

      activeIndex = [];
      AiColorsForCompare = [];
    }, 500);
  };
  //jeżeli flaga jest flase (po ukonczeniu zamieniana na true)
  if (!isFinished) {
    //jest to drugie odkrycie elementu przekazujemy pierwszy odkryty element do porównania
    if (AiColorsForCompare.length === 1) {
      checkedIndex = await eel.HardModeCheck(
        AiColorsForCompare[0].style.background,
        null
      )();
      //jezeli nie jest wylosowany ten sam element a kolor jest identyczny to funkcja pythona zwraca indeks iodkrywany jest element o tym indeksie  a pozniej usuwane z gry są oba i nastepuje czyszczenie  wartosci w zmiennych
      if (typeof checkedIndex === "number" && checkedIndex !== activeIndex[0]) {
        for (i = 0; i < activeIndexNumbers.length; i++) {
          if (activeIndexNumbers[i] === checkedIndex) {
            activeIndexNumbers.splice(i, 1);
          }
        }
        activeElement = AiColors[checkedIndex];
        AiColorsForCompare.push(activeElement);
        activeElement.classList.remove("clickable");
        removeFromGame();

        //a jezeli odkryty jest ten sam element bądź funkcja wyszukiwania w pythonie zwraca false wtedy losujemy element
      } else {
        index = randomIndex(0, activeIndexNumbers.length);

        indexFromArray = activeIndexNumbers[index];

        activeIndexNumbers.splice(index, 1);
        activeIndex.push(indexFromArray);

        activeElement = AiColors[indexFromArray];
        checkedIndex = await eel.HardModeCheck(
          activeElement.style.background,
          indexFromArray
        )();
        AiColorsForCompare.push(activeElement);
        activeElement.classList.remove("clickable");
        if (
          AiColorsForCompare[0].style.background ===
          AiColorsForCompare[1].style.background
        ) {
          removeFromGame();
        } else {
          addAgainToGame();
        }
        //z wylosowanego elementu usuwamy klasę która zakrywa element
      }
    }
    if (AiColorsForCompare.length === 0) {
      index = randomIndex(0, activeIndexNumbers.length);

      indexFromArray = activeIndexNumbers[index];

      activeIndexNumbers.splice(index, 1);
      activeIndex.push(indexFromArray);

      activeElement = AiColors[indexFromArray];
      checkedIndex = await eel.HardModeCheck(
        activeElement.style.background,
        indexFromArray
      )();
      AiColorsForCompare.push(activeElement);

      activeElement.classList.remove("clickable");
    }
  }
}

//funkcja obsługująca ekran ładowania
function loading(timeForInterval) {
  counter = 0;

  const counterInterval = setInterval(() => {
    counter++;
    percentCounter.textContent = `Loading ${counter}%`;
    if (counter === 100) {
      clearInterval(counterInterval);
      SetVisibleElement(loadingScreen, content);
      container.classList.add("container--playable");
      counter = 0;
    }
  }, timeForInterval);
}
//losowanie indeksu z przedziału podanego w argumentach
function randomIndex(min, max) {
  index = Math.floor(Math.random() * (max - min)) + min;
  return index;
}
//iustawia flage na true (zatrzymuje gre) i wyswietla stosowny komunikat
function finishGame() {
  isFinished = true;
  message =
    playerPairCounter === 0
      ? `Gratulacje ${YourName} wygrałeś`
      : "Niestety przegrałeś";
  setTimeout(() => {
    messageBox.classList.remove("unactive");
    messageInfo.textContent = message;
    messageBtn.addEventListener("click", () => {
      location.reload();
    });
    closeMessage(messageBtn, messageBox);
  }, 500);
}

//uruchamia automatyczna gre w wybranym trybie
function startAi() {
  setTimeout(() => {
    setInterval(() => {
      activeMode === "easy" ? autoGameAi() : HardGameAi();
    }, 1000);
  }, 1000);
}
//
async function getCounter(mode) {
  counterTime = await eel.getTime(mode)();
  console.log(counterTime);
  return counterTime;
}
//funkcja uruchamia grę
function startGame() {
  sendPlayerName();
  chooseMode();

  start.addEventListener("click", () => {
    if (isReady && activeMode !== null) {
      SetVisibleElement(menu, loadingScreen);
      loading();
      getColors();
      eventForDivs("add");
      startAi();
      getCounter("start");
    }
  });
}

startGame();
