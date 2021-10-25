const Card = require("./Card")
const { HEART, RED, BLACK, DIAMOND, CLUB, SPADE } = require("./constants")

test("colors of suits are correct", () => {
  expect(new Card({ suit: HEART, rank: 5 }).getColor()).toEqual(RED)
  expect(new Card({ suit: DIAMOND, rank: 5 }).getColor()).toEqual(RED)
  expect(new Card({ suit: CLUB, rank: 5 }).getColor()).toEqual(BLACK)
  expect(new Card({ suit: SPADE, rank: 5 }).getColor()).toEqual(BLACK)
})

test("cards can be compared with isSameCard", () => {
  const cardA = new Card({ suit: HEART, rank: 1 })
  const cardB = new Card({ suit: HEART, rank: 1 })
  const cardC = new Card({ suit: HEART, rank: 2 })
  expect(cardA.isSameCard(cardB)).toBeTruthy()
  expect(cardA.isSameCard(cardC)).toBeFalsy()
})
