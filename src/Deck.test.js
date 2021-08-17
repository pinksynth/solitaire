const { CLUB, DIAMOND, FIVE, HEART, JACK, TWO } = require("./constants")
const Deck = require("./Deck")

test("contains 52 cards", () => {
  expect(new Deck().cards).toHaveProperty("length", 52)
})

test("allows cards to be brought to the top", () => {
  const deck = new Deck()
  deck.shuffle()
  deck.bringCardToFront({ suit: DIAMOND, rank: FIVE })
  deck.bringCardToFront({ suit: CLUB, rank: JACK })
  deck.bringCardToFront({ suit: HEART, rank: TWO })
  expect(deck.cards).toHaveProperty("length", 52)
  const [a, b, c] = deck.cards
  expect(a.getShortName()).toBe(" 2H")
  expect(b.getShortName()).toBe("11C")
  expect(c.getShortName()).toBe(" 5D")
})
