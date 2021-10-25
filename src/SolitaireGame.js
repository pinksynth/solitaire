const { RED } = require("./constants")
const Deck = require("./Deck")
const Stack = require("./Stack")
const TableauPile = require("./TableauPile")
const { ANSI } = require("./util")

const STR_TABLEAU = "Tableau"
const STR_FOUNDATION = "Foundation"
const STR_DRAW_PILE = "Draw Pile"

class SolitaireGame {
  constructor({ deck, gameConsole = globalThis.console, showRowNumber } = {}) {
    this.gameConsole = gameConsole

    this.deck = deck || new Deck()
    this.foundations = this.generateFoundations()
    this.tableau = this.generateTableau()
    // Only shuffle the deck if a specific deck has not been provided
    if (!deck) this.deck.shuffle()

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

  // Get a list of all cards that could be moved if an eligible place was found
  __getMovables() {
    const movables = []

    // First potential move is from the top of the draw pile
    const drawPileCard = this.drawPile.peek()
    if (drawPileCard)
      movables.push({
        pile: { kind: STR_DRAW_PILE, order: 0 },
        card: drawPileCard,
      })

    // Other potential moves may be at the tops of foundations
    let order = 1
    let kind = STR_FOUNDATION
    for (const stack of this.foundations) {
      const card = stack.peek()
      if (card) movables.push({ pile: { kind, order }, card })
      order++
    }

    // All face-up cards in the tableau are potential moves
    order = 1
    kind = STR_TABLEAU
    for (const tableauPile of this.tableau) {
      for (const card of tableauPile.faceUpStack) {
        movables.push({ pile: { kind, order }, card })
      }
      order++
    }

    return movables
  }

  __getMove({ from, to }) {
    return {
      from,
      to,
      label: `Move ${from.card.getName()} to ${to.card.getName()}`,
    }
  }

  __getEligiblePlaces() {
    const eligiblePlaces = []

    // Foundations are always placeable cards (except Kings)
    let order = 1
    let kind = STR_FOUNDATION
    for (const stack of this.foundations) {
      const card = stack.peek()
      if (card) eligiblePlaces.push({ pile: { kind, order }, card })
      order++
    }

    // Face-up cards which are at the bottom of the tableau pile are always placeable
    order = 1
    kind = STR_TABLEAU
    for (const tableauPile of this.tableau) {
      for (const card of tableauPile.faceUpStack) {
        eligiblePlaces.push({ pile: { kind, order }, card })
      }
      order++
    }

    return eligiblePlaces
  }

  availableMoves() {
    const moves = []
    const movables = this.__getMovables()
    const eligiblePlaces = this.__getEligiblePlaces()
    for (const movable of movables) {
      const {
        pile: { kind: movableKind, order: movableOrder },
        card: movableCard,
      } = movable
      for (const eligiblePlace of eligiblePlaces) {
        const {
          pile: { kind: eligiblePlaceKind, order: eligiblePlaceOrder },
          card: eligiblePlaceCard,
        } = eligiblePlace
        const move = this.__getMove({
          from: movable,
          to: eligiblePlace,
        })
        if (movableCard.isSameCard(eligiblePlaceCard)) continue
        // Can never move a card from the foundations to another place in the foundations.
        if (
          movableKind === STR_FOUNDATION &&
          eligiblePlaceKind === STR_FOUNDATION
        ) {
          continue
        }
        // If moving a card to the foundations...
        else if (eligiblePlaceKind === STR_FOUNDATION) {
          // The move is eligible if the suits are the same and the card moving is 1 greater than the receiving stack
          if (
            movableCard.suit === eligiblePlaceCard.suit &&
            movableCard.rank === eligiblePlaceCard.rank + 1
          ) {
            moves.push(move)
          }
        } else if (eligiblePlaceKind === STR_TABLEAU) {
          if (
            movableCard.getColor() !== eligiblePlaceCard.getColor() &&
            movableCard.rank === eligiblePlaceCard.rank - 1
          ) {
            moves.push(move)
          }
        }
      }
    }
    return moves
  }

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

  getANSICardShortName(card) {
    if (card.getColor() === RED) {
      return ANSI.FgRed + card.getShortName() + ANSI.Reset
    } else {
      return card.getShortName()
    }
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
        tableuPileCards[tableauIdx].push(this.getANSICardShortName(c))
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

  getFoundationsString(color = true) {
    let strOutput = ""
    this.foundations.forEach((f) => {
      const card = f.peek()
      if (card) {
        const name = color
          ? this.getANSICardShortName(card)
          : card.getShortName()
        strOutput += name + " "
      } else strOutput += "   "
    })
    return strOutput
  }

  getDrawPileString(color = true) {
    const card = this.drawPile.peek()
    if (!card) return "   "
    const name = color ? this.getANSICardShortName(card) : card.getShortName()
    return name
  }
}

module.exports = SolitaireGame
