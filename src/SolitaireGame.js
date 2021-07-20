const Deck = require("./Deck")
const Stack = require("./Stack")
const TableauPile = require("./TableauPile")

class SolitaireGame {
  constructor() {
    this.deck = new Deck()
    this.foundations = this.generateFoundations()
    this.tableau = this.generateTableau()
    this.drawPile = new Stack({ cards: this.deck.cards })
    this.deck.shuffle()
  }

  start() {
    this.dealTableau()
    this.foundations[0].push()
    // console.log("this.tableau", this.tableau)
    this.displayGame()
  }

  availableMoves() {}

  generateFoundations() {
    return this.generate(4, () => new Stack())
  }

  generateTableau() {
    return this.generate(7, () => new TableauPile())
  }

  generate(n, getObj) {
    const stacks = []
    for (let x = 1; x <= n; x++) {
      stacks.push(getObj())
    }
    return stacks
  }

  dealTableau() {
    for (let tableauIdx = 0; tableauIdx < this.tableau.length; tableauIdx++) {
      const faceDownCards = this.drawPile.take(tableauIdx)
      const oneFaceUpCard = this.drawPile.take(1)
      this.tableau[tableauIdx].faceUpStack = oneFaceUpCard
      this.tableau[tableauIdx].faceDownStack = faceDownCards
    }
  }

  displayGame() {
    let strOutput = ""
    strOutput += this.getFoundationsAndDrawPileString()
    strOutput += this.getTableauString()
    console.log(strOutput)
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
      strOutput += `ROW ${row.toString().padStart(2, " ")}`
      for (let tableauIdx = 0; tableauIdx < this.tableau.length; tableauIdx++) {
        strOutput += tableuPileCards[tableauIdx][row] || "   "
        strOutput += " "
      }
      strOutput += "\n"
    }
    return strOutput
  }

  getFoundationsAndDrawPileString() {
    let strOutput = ""
    this.foundations.forEach((f) => {
      const card = f.peek()
      if (card) strOutput += card.getShortName()
      else strOutput += "   "
    })
    strOutput += "\n"
    return strOutput
  }
}

module.exports = SolitaireGame
