const Deck = require("./Deck")
const Stack = require("./Stack")
const TableauPile = require("./TableauPile")

class SolitaireGame {
  constructor({ deck, gameConsole = globalThis.console, showRowNumber } = {}) {
    this.gameConsole = gameConsole

    this.deck = deck || new Deck()
    this.foundations = this.generateFoundations()
    this.tableau = this.generateTableau()
    this.deck.shuffle()

    this.drawPile = new Stack({ cards: this.deck.cards })
    this.showRowNumber = !!showRowNumber
  }

  start() {
    this.dealTableau()
    // this.play()
  }

  async play() {
    this.gameConsole.clear()
    // this.foundations[0].push()
    this.displayGame()
  }

  availableMoves() {}

  generateFoundations() {
    return this.generate(4, () => new Stack())
  }

  generateTableau() {
    return this.generate(7, () => new TableauPile())
  }

  generate(count, getObj) {
    const objs = []
    for (let obj = 1; obj <= count; obj++) objs.push(getObj())
    return objs
  }

  dealTableau() {
    // gameConsole.log("this.drawPile", this.drawPile)
    // gameConsole.log("this.drawPile.size()", this.drawPile.size())
    for (let tableauIdx = 0; tableauIdx < this.tableau.length; tableauIdx++) {
      const faceDownCards = this.drawPile.take(tableauIdx)
      const oneFaceUpCard = this.drawPile.take(1)
      this.tableau[tableauIdx].faceUpStack = oneFaceUpCard
      this.tableau[tableauIdx].faceDownStack = faceDownCards
    }
  }

  displayGame() {
    const drawPileString = this.getDrawPileString()
    const foundationsString = this.getFoundationsString()
    const tableauString = this.getTableauString()
    const output =
      foundationsString + "  |  " + drawPileString + "\n\n" + tableauString
    this.gameConsole.log(output)
  }

  getTableauString() {
    // At most we can have 6 face down cards and a full suit (13 cards) on top.
    const BOARD_HEIGHT = 20
    let strOutput = ""
    const tableuPileCards = []
    for (let tableauIdx = 0; tableauIdx < this.tableau.length; tableauIdx++) {
      const tableauPile = this.tableau[tableauIdx]
      tableuPileCards[tableauIdx] = []
      tableauPile.faceUpStack.cards.forEach((c) =>
        tableuPileCards[tableauIdx].push(c.getShortName())
      )
      tableauPile.faceDownStack.cards.forEach(() =>
        tableuPileCards[tableauIdx].push(" x ")
      )
      // Reverse the cards for each pile because we're rendering from the top-down.
      tableuPileCards[tableauIdx] = tableuPileCards[tableauIdx].reverse()
    }
    for (let row = 1; row <= BOARD_HEIGHT; row++) {
      const pileIdx = row - 1
      // Show row number if desired.
      if (this.showRowNumber) {
        strOutput += `ROW ${row.toString().padStart(2, " ")}  `
      }
      for (let tableauIdx = 0; tableauIdx < this.tableau.length; tableauIdx++) {
        strOutput += tableuPileCards[tableauIdx][pileIdx] || "   "
        strOutput += " "
      }
      strOutput += "\n"
    }
    return strOutput
  }

  getFoundationsString() {
    let strOutput = ""
    this.foundations.forEach((f) => {
      const card = f.peek()
      if (card) strOutput += card.getShortName() + " "
      else strOutput += "   "
    })
    return strOutput
  }

  getDrawPileString() {
    const card = this.drawPile.peek()
    if (!card) return "   "
    return card.getShortName()
  }
}

module.exports = SolitaireGame
