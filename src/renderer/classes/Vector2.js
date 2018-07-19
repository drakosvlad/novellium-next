'use strict'

class Vector2 {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  substract (vec) {
    return new Vector2(this.x - vec.x, this.y - vec.y)
  }

  add (vec) {
    return new Vector2(this.x + vec.x, this.y + vec.y)
  }

  multiplyScalar (scalar) {
    return new Vector2(this.x * scalar, this.y * scalar)
  }
}

export default Vector2
