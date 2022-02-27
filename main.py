

import eel
import random

eel.init('web')

colors = ['red', 'red', 'blue', 'blue', 'yellow', 'yellow', 'green', 'green',
          'orange', 'orange', 'purple', 'purple', 'pink', 'pink', 'royalblue', 'royalblue']
colorsForAi = ['red', 'red', 'blue', 'blue', 'yellow', 'yellow', 'green', 'green',
               'orange', 'orange', 'purple', 'purple', 'pink', 'pink', 'royalblue', 'royalblue']

clickedColors = []
clickedColorsAi = []


modeofGame = ''
playerName = ''
colorsAiSaved = {}
valueToSend = None
startTimer = ''
endTimer = ''
gameTime = ''

# zwraca czas gry


# ustawia kolory dla gracza i dla komputera


@eel.expose
def setColors(mode):
    if(mode == 'player'):
        randomIndex = random.randint(0, (len(colors)-1))
        randomColor = colors[randomIndex]
        colors.pop(randomIndex)
        return randomColor
    if(mode == 'ai'):
        randomIndex = random.randint(0, (len(colorsForAi)-1))
        randomColor = colorsForAi[randomIndex]
        colorsForAi.pop(randomIndex)
        return randomColor
    else:
        return

# funkcja przyjmuje jako argument kolor oraz gracza (przechowujemy kolory w dwoch listach) gdy są dwa kolory porównuje je i zwraca True bądź false zaleznie czy są takie same po czym czyści liste


@eel.expose
def getColorFromJs(color, player):
    if(player == 'player'):
        clickedColors.append(color)
        if(len(clickedColors) == 2):
            if(clickedColors[0] == clickedColors[1]):
                clickedColors.clear()
                return True
            else:
                clickedColors.clear()
                return False
    if(player == 'ai'):
        clickedColorsAi.append(color)
        if(len(clickedColorsAi) == 2):
            if(clickedColorsAi[0] == clickedColorsAi[1]):
                clickedColorsAi.clear()
                return True
            else:
                clickedColorsAi.clear()
                return False

# funckja sprawdza kolor przesyłany jako argument jezeli jest w słowniku zwraca jego indeks jesli niema zapisuje do slownika


@eel.expose
def HardModeCheck(colorToCheck, index):

    check = colorsAiSaved.get(colorToCheck, False)
    if(check):
        return check
    if index in colorsAiSaved.values():
        return
    else:
        colorsAiSaved[colorToCheck] = index


@eel.expose
def getPlayerName(name):

    return name


@eel.expose
def getMode(mode):
    return mode


eel.start('index.html')
