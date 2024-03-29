'use strict'

import Vector2 from './Vector2.js'

class PlotNode {
  constructor (x, y, title, text, color, type) {
    this.location = new Vector2(x, y)
    this.text = text
    this.title = title
    this.color = color
    this.type = type
    this.ui = [
      {
        type: 'combobox',
        caption: 'Test',
        items: ['Lol', 'Kek', 'Cheburek']
      }
    ]
    this.height = 85

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
