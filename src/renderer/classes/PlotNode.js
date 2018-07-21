'use strict'

import Vector2 from './Vector2.js'

class PlotNode {
  constructor (x, y, title, text, color) {
    this.location = new Vector2(x, y)
    this.text = text
    this.title = title
    this.color = color

    this.parents = 0
    this.children = []
    this.outputs = 0
  }

  setOutputs (n) {
    let newChildren = []

    for (let i = 0; i < Math.min(this.outputs, n); i++) {
      newChildren.push(this.children[i])
    }

    this.children = newChildren
    this.outputs = n
  }
}

export default PlotNode