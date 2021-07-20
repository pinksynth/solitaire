const SolitaireGame = require("./SolitaireGame")

test("starts games with a shuffled deck", () => {
  const gameDeckStrings = new Set()
  for (let x = 0; x < 100; x++) {
    const game = new SolitaireGame()
    const gameDeckString = game.deck.cards
      .map(({ rank, suit }) => `${rank}$${suit}`)
      .join(":")
    gameDeckStrings.add(gameDeckString)
  }
  // If any dupes exist, the size would be less than 100.
  expect(gameDeckStrings.size).toBe(100)
})

test("has 'start' function and 'availableMoves' functions", () => {
  const game = new SolitaireGame()
  game.start()
  game.availableMoves()
})
