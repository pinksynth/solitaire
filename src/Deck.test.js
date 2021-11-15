const Card = require("./Card")
const {
  CLUB,
  DIAMOND,
  EIGHT,
  FIVE,
  HEART,
  JACK,
  SPADE,
  TWO,
} = require("./constants")
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

  expect(deck.cards[51]).toEqual(new Card({ rank: TWO, suit: HEART }))
  expect(deck.cards[50]).toEqual(new Card({ rank: JACK, suit: CLUB }))
  expect(deck.cards[49]).toEqual(new Card({ rank: FIVE, suit: DIAMOND }))
})

test("allows card to be brought to a given index", () => {
  const deck = new Deck()
  deck.shuffle()

  for (const [rank, suit, newIndex] of [
    [FIVE, DIAMOND, 0],
    [JACK, CLUB, 6],
    [EIGHT, SPADE, 35],
    [TWO, HEART, 51],
  ]) {
    deck.bringCardToIndex({ suit, rank }, newIndex)
    expect(deck.cards[newIndex]).toEqual(new Card({ suit, rank }))
  }

  expect(deck.cards).toHaveProperty("length", 52)
})
