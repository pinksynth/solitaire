class Stack {
  constructor({ cards, faceUp } = {}) {
    this.cards = cards || []
    this.faceUp = faceUp === undefined ? true : faceUp
  }

  take(n = 1) {
    return this.cards.splice(0, n)
  }
}

module.exports = Stack
