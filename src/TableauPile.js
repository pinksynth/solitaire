const Stack = require("./Stack")

class TableauPile {
  constructor() {
    this.faceUpStack = new Stack({ faceUp: true })
    this.faceDownStack = new Stack({ faceUp: false })
  }

  isEmpty() {
    return this.faceDownStack.size === 0 && this.faceUpStack.size === 0
  }
}

module.exports = TableauPile
