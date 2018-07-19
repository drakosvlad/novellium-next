'use strict'

import Vector2 from './Vector2.js'

class PlotNode {
  constructor (x, y, title, text, color) {
    this.location = new Vector2(x, y)
    this.text = text
    this.title = title
    this.color = color

    this.parents = []
    this.children = []
    this.outputs = 0
  }
}

export default PlotNode
