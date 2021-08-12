const Card = require("./Card")

class Stack {
  constructor({ cards, faceUp } = {}) {
    this.cards = cards || []
    if (this.cards.some((c) => !(c instanceof Card))) {
      throw new Error(
        'Stack constructor expected "cards" to be an array of Cards.'
      )
    }
    this.faceUp = faceUp === undefined ? true : faceUp
  }

  take(takeCount = 1) {
    let cards
    // Prevent splice(0)
    if (takeCount > 0) {
      const spliceIdx = -takeCount
      cards = this.cards.splice(spliceIdx)
    } else {
      cards = []
    }
    return new Stack({ faceUp: this.faceUp, cards })
  }

  peek() {
    return this.cards[0]
  }

  size() {
    return this.cards.length
  }

  push(cardsOrStack) {
    let cards = cardsOrStack
    if (cardsOrStack instanceof Stack) cards = cardsOrStack.cards
    this.cards.push(cardsOrStack)
  }
}
module.exports = Stack