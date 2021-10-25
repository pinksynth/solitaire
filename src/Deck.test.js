const { CLUB, DIAMOND, FIVE, HEART, JACK, TWO } = require("./constants")
const Deck = require("./Deck")

test("contains 52 cards", () => {
  expect(new Deck().cards).toHaveProperty("length", 52)
})

test("allows cards to be brought to the top", () => {
  const deck = new Deck()
  deck.shuffle()
  deck.bringCardToTop({ suit: DIAMOND, rank: FIVE })
  deck.bringCardToTop({ suit: CLUB, rank: JACK })
  deck.bringCardToTop({ suit: HEART, rank: TWO })
  expect(deck.cards).toHaveProperty("length", 52)

  expect(deck.cards[51].getShortName()).toBe("2♥︎")
  expect(deck.cards[50].getShortName()).toBe("J♣︎")
  expect(deck.cards[49].getShortName()).toBe("5♦︎")
})
