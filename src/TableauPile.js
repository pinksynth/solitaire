const Stack = require("./Stack")

class TableauPile {
  constructor() {
    this.faceUpStack = new Stack({ faceUp: true })
    this.faceDownStack = new Stack({ faceUp: false })
  }
}

module.exports = TableauPile
