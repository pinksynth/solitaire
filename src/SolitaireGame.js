const {
  RED,
  ACE,
  KING,
  STR_TABLEAU,
  STR_FOUNDATION,
  STR_DRAW_PILE,
} = require("./constants")
const Card = require("./Card")
const Deck = require("./Deck")
const Stack = require("./Stack")
const TableauPile = require("./TableauPile")
const { ANSI } = require("./util")

class SolitaireGame {
  constructor({
    deck,
    gameConsole = globalThis.console,
    loadFoundations: foundationsConfig,
    showRowNumber,
  } = {}) {
    this.init = { foundationsConfig }
    this.gameConsole = gameConsole
    this.deck = deck || new Deck()
    this.foundations = this.#generateFoundations()
    this.tableau = this.#generateTableau()
    // Only shuffle the deck if a specific deck has not been provided
    if (!deck) this.deck.shuffle()

    this.drawPile = new Stack({ cards: this.deck.cards })
    this.showRowNumber = !!showRowNumber
  }

  start() {
    const foundationsConfig = this.init.foundationsConfig
    if (foundationsConfig) this.#loadFoundationsFromConfig(foundationsConfig)

    this.#dealTableau()
    // this.play()
  }

  async play() {
    this.gameConsole.clear()
    // this.foundations[0].push()
    this.displayGame()
  }

  availableMoves() {
    const moves = []
    const movables = this.#getMovables()
    const eligiblePlaces = this.#getEligiblePlaces()

    // Iterate through cards which could be moved to others
    for (const movable of movables) {
      const {
        pile: { kind: movableKind },
        card: movableCard,
        isTopOfStack,
      } = movable

      // For each card, iterate through places onto which cards could be moved
      for (const eligiblePlace of eligiblePlaces) {
        const {
          pile: { kind: eligiblePlaceKind },
          card: eligiblePlaceCard,
        } = eligiblePlace
        const move = this.#getMove({
          from: movable,
          to: eligiblePlace,
        })
        let moveIsEligible = false
        // Don't compare card to self.
        if (eligiblePlaceCard && movableCard.isSameCard(eligiblePlaceCard)) {
          continue
        }

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
          const movingToExistingFoundationStack =
            eligiblePlaceCard &&
            movableCard.suit === eligiblePlaceCard.suit &&
            movableCard.rank === eligiblePlaceCard.rank + 1

          // The move is eligible if we're moving an ace onto an empty foundation.
          const movingAceOntoEmptyFoundation =
            eligiblePlaceCard === undefined && movableCard.rank === ACE

          // A move from the tableau is only eligible to move to the foundations if it was the top of its stack.
          if (
            isTopOfStack &&
            (movingToExistingFoundationStack || movingAceOntoEmptyFoundation)
          ) {
            moveIsEligible = true
          }

          // Else, if we're moving a card to the tableau
        } else if (eligiblePlaceKind === STR_TABLEAU) {
          // The move is eligible if we're stacking an inferior rank card (i.e., Black 4) onto a superior rank card of another color (i.e., Red 5).
          const movingToExistingTableauStack =
            eligiblePlaceCard &&
            movableCard.getColor() !== eligiblePlaceCard.getColor() &&
            movableCard.rank === eligiblePlaceCard.rank - 1

          // The move is eligible if we're putting a king on an empty tableau spot.
          const movingKingOntoEmptyTableau =
            eligiblePlaceCard === undefined && movableCard.rank === KING

          if (movingToExistingTableauStack || movingKingOntoEmptyTableau) {
            moveIsEligible = true
          }
        }

        if (moveIsEligible) moves.push(move)
      }
    }
    return moves
  }

  performMove(moveIdx) {
    const { from, to } = this.availableMoves()[moveIdx]
    const { pile: fromPile, card: fromCard } = from
    const { pile: toPile, card: toCard } = to
    // console.log("from", from)
    // console.log("to", to)
    if (toPile.kind === STR_FOUNDATION) {
      if (fromPile.kind === STR_TABLEAU) {
        // Store tableau pile as variable
        const tableauStack = this.#getFaceupTableauStack(fromPile.order)
        // Store foundation as variable
        const foundationStack = this.#getFoundationStack(toPile.order)
        // Take from tableau pile
        const card = tableauStack.take(1)
        // Place on foundation
        foundationStack.push(card)
      }
    }
    // SAMMY! This is where the magic happens. Perform the move here. Start with a move from Tableau to Foundations (See failing test)
  }

  countCardsInTableau() {
    let count = 0
    for (const tableauPile of this.tableau) {
      count += tableauPile.totalSize()
    }
    return count
  }

  displayGame() {
    const drawPileString = this.getDrawPileString()
    const foundationsString = this.getFoundationsString()
    const tableauString = this.#getTableauString()
    const output =
      foundationsString + "  |  " + drawPileString + "\n\n" + tableauString
    this.gameConsole.log(output)
  }

  getFoundationsString(color = true) {
    let strOutput = ""
    this.foundations.forEach((f) => {
      const card = f.peek()
      if (card) {
        const name = color
          ? this.#getANSICardShortName(card)
          : card.getShortName()
        strOutput += name + " "
      } else strOutput += "   "
    })
    return strOutput
  }

  getDrawPileString(color = true) {
    const card = this.drawPile.peek()
    if (!card) return "   "
    const name = color ? this.#getANSICardShortName(card) : card.getShortName()
    return name
  }

  // Get a list of all cards that could be moved if an eligible place was found
  #getMovables() {
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
      for (
        let cardIdx = 0;
        cardIdx < tableauPile.faceUpStack.size();
        cardIdx++
      ) {
        const card = tableauPile.faceUpStack.getCard(cardIdx)
        const isTopOfStack = cardIdx === tableauPile.faceUpStack.size() - 1
        movables.push({ pile: { kind, order }, card, isTopOfStack })
      }
      order++
    }

    return movables
  }

  #getMove({ from, to }) {
    const destination = to.card
      ? to.card.getName()
      : to.pile.kind + " " + to.pile.order
    return {
      from,
      to,
      label: `Move ${from.card.getName()} to ${destination}`,
    }
  }

  #getEligiblePlaces() {
    const eligiblePlaces = []

    // Foundations are always placeable cards (except Kings)
    let order = 1
    let kind = STR_FOUNDATION
    for (const stack of this.foundations) {
      eligiblePlaces.push({
        pile: { kind, order },
        // If the foundation is empty, the card will be undefined, which is desired.
        card: stack.peek(),
      })
      order++
    }

    // Face-up cards which are at the bottom of the tableau pile are always placeable
    order = 1
    kind = STR_TABLEAU
    for (const tableauPile of this.tableau) {
      for (const card of tableauPile.faceUpStack) {
        eligiblePlaces.push({ pile: { kind, order }, card })
      }

      // If there are no cards in the tableau pile, it is an eligible move (for a King)
      if (tableauPile.isEmpty()) {
        eligiblePlaces.push({ pile: { kind, order }, card: undefined })
      }
      order++
    }

    return eligiblePlaces
  }

  #loadFoundationsFromConfig(foundationsConfig) {
    console.log("this.drawPile.size()", this.drawPile.size())
    for (const [strSuit, foundationRank] of Object.entries(foundationsConfig)) {
      const suit = parseInt(strSuit)
      for (let rank = 1; rank <= foundationRank; rank++) {
        console.log("---------------------\n---------------------")
        console.log("given card", new Card({ suit, rank }))
        this.drawPile.bringCardToTop({ suit, rank })
        // The available move will be to move the next card (starting with ace) to the eligible foundation.
        this.performMove(0)
      }
    }
  }

  #getFaceupTableauStack(order) {
    const index = order - 1
    return this.tableau[index].faceUpStack
  }

  #getFoundationStack(order) {
    const index = order - 1
    return this.foundations[index]
  }

  #generateFoundations() {
    return this.#generate(4, () => new Stack())
  }

  #generateTableau() {
    return this.#generate(7, () => new TableauPile())
  }

  #generate(count, getObj) {
    const objs = []
    for (let obj = 1; obj <= count; obj++) objs.push(getObj())
    return objs
  }

  #dealTableau() {
    for (let tableauIdx = 0; tableauIdx < this.tableau.length; tableauIdx++) {
      const faceDownCards = this.drawPile.take(tableauIdx)
      const oneFaceUpCard = this.drawPile.take(1)
      this.tableau[tableauIdx].faceUpStack = oneFaceUpCard
      this.tableau[tableauIdx].faceDownStack = faceDownCards
    }
  }

  #getANSICardShortName(card) {
    if (card.getColor() === RED) {
      return ANSI.FgRed + card.getShortName() + ANSI.Reset
    } else {
      return card.getShortName()
    }
  }

  #getTableauString() {
    // At most we can have 6 face down cards and a full suit (13 cards) on top.
    const BOARD_HEIGHT = 20
    let strOutput = ""
    const tableuPileCards = []
    for (let tableauIdx = 0; tableauIdx < this.tableau.length; tableauIdx++) {
      const tableauPile = this.tableau[tableauIdx]
      tableuPileCards[tableauIdx] = []
      tableauPile.faceUpStack.cards.forEach((c) =>
        tableuPileCards[tableauIdx].push(this.#getANSICardShortName(c))
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
}

module.exports = SolitaireGame
