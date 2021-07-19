const Card = require("./Card")
const { HEART, RED, BLACK, DIAMOND, CLUB, SPADE } = require("./constants")

test("colors of suits are correct", () => {
  expect(new Card({ suit: HEART, rank: 5 })).toHaveProperty("color", RED)
  expect(new Card({ suit: DIAMOND, rank: 5 })).toHaveProperty("color", RED)
  expect(new Card({ suit: CLUB, rank: 5 })).toHaveProperty("color", BLACK)
  expect(new Card({ suit: SPADE, rank: 5 })).toHaveProperty("color", BLACK)
})
