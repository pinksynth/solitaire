const Deck = require("./Deck")

test("contains 52 cards", () => {
  expect(new Deck().cards).toHaveProperty("length", 52)
})
