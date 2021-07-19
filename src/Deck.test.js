const Deck = require("./Deck")

const { HEART, RED, BLACK, DIAMOND, CLUB, SPADE } = require("./constants")

test("contains 52 cards", () => {
  expect(new Deck().cards).toHaveProperty("length", 52)
})
