<template>
    <div>
        <canvas id="plotCanvas" v-on:mousedown="initDrag" v-on:mousemove="canvasMouseMove" v-on:mouseup="canvasMouseUp"></canvas>
    </div>
</template>

<script>
import PlotNode from '../classes/PlotNode.js'
import Vector2 from '../classes/Vector2.js'

export default {
  name: 'PlotCanvas',
  props: {
    root: PlotNode
  },
  data: function () {
    return {
      state: 'idle',
      drag: undefined,
      scale: 100,
      scroll: new Vector2(0, 0),
      canvas: undefined,
      ctx: undefined,
      localRoot: undefined,
      orphanedNodes: [],
      themes: [
        {
          background: '#ffffff',
          arrow: '#000000',
          nodeBackground: '#dddddd',
          nodeTitle: '#000000',
          nodeText: '#333333',
          outputText: '#999999'
        },
        {
          background: '#355f6e',
          arrow: '#ffffff',
          nodeBackground: '#567F8C',
          nodeTitle: '#ffffff',
          nodeText: '#e8e8e8'
        }
      ],
      selectedTheme: 0,
      localNodes: [],
      nodeDimensions: {
        width: 200,
        height: 85,
        dragRect: 15,
        titlePosition: new Vector2(5, 37),
        textPosition: new Vector2(5, 58),
        fontSize: 17
      }
    }
  },
  mounted: function () {
    this.canvas = document.getElementById('plotCanvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    window.addEventListener('resize', function (e) {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.renderCanvas()
    }.bind(this), false)

    this.ctx = this.canvas.getContext('2d')
    this.localRoot = new PlotNode(100, 100, 'Kek', 'Mdems', '#ff0000')
    this.localRoot.setOutputs(2)
    let childNode = new PlotNode(300, 300, 'Kek', 'Mdems', '#00aa00')
    childNode.parents.push(this.localRoot)
    this.localRoot.children.push(childNode)

    this.renderCanvas()
  },
  methods: {
    renderCanvas: function () {
      this.ctx.fillStyle = this.themes[this.selectedTheme].background
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      this.renderNode(this.localRoot)
      this.orphanedNodes.forEach(node => this.renderNode(node))
    },
    renderNode: function (node) {
      this.localNodes.push(node)
      let canvasCoords = node.location.multiplyScalar(this.scale / 100).substract(this.scroll)

      this.ctx.fillStyle = this.themes[this.selectedTheme].nodeBackground
      this.ctx.fillRect(canvasCoords.x, canvasCoords.y, this.nodeDimensions.width * this.scale / 100, this.nodeDimensions.height * this.scale / 100)

      this.ctx.fillStyle = node.color
      this.ctx.fillRect(canvasCoords.x, canvasCoords.y, this.nodeDimensions.width * this.scale / 100, this.nodeDimensions.dragRect * this.scale / 100)

      let fontSize = this.nodeDimensions.fontSize * this.scale / 100
      let headerCoords = canvasCoords.add((this.nodeDimensions.titlePosition.multiplyScalar(this.scale / 100)))
      this.ctx.fillStyle = this.themes[this.selectedTheme].nodeTitle
      this.ctx.font = 'italic bold ' + fontSize + 'px sans-serif'
      this.ctx.fillText(node.title, headerCoords.x, headerCoords.y)

      let textCoords = canvasCoords.add(this.nodeDimensions.textPosition.multiplyScalar(this.scale / 100))
      this.ctx.fillStyle = this.themes[this.selectedTheme].nodeText
      this.ctx.font = fontSize + 'px sans-serif'
      this.ctx.fillText(node.text, textCoords.x, textCoords.y)

      if (node.outputs > 0) {
        let shift = this.nodeDimensions.width / (node.outputs)
        this.ctx.fillStyle = this.themes[this.selectedTheme].outputText
        let outputCoords = canvasCoords.add(new Vector2(shift / 2, 80).multiplyScalar(this.scale / 100))
        for (let i = 0; i < node.outputs; i++) {
          let textWidth = this.ctx.measureText((i + 1) + '').width
          this.ctx.fillText((i + 1) + '', outputCoords.x - textWidth / 2, outputCoords.y)
          outputCoords = outputCoords.add(new Vector2(shift * this.scale / 100, 0))
        }
      }

      for (let i in node.children) {
        let child = node.children[i]
        if (child === undefined) {
          continue
        }

        let outRelative = new Vector2(this.nodeDimensions.width / node.outputs / 2 + i * this.nodeDimensions.width / node.outputs, this.nodeDimensions.height)
        let outCoord = node.location.add(outRelative)
        if (!(this.state === 'draggingArrow' && this.drag.node === node && this.drag.output === i)) {
          // console.log(this.drag.output)
          this.renderArrow(outCoord, child.location.add(new Vector2(this.nodeDimensions.width / 2, 0)))
        }
        this.renderNode(child)
      }
    },
    renderArrow: function (coordFrom, coordTo) {
      let realFrom = coordFrom.multiplyScalar(this.scale / 100).substract(this.scroll)
      let realTo = coordTo.multiplyScalar(this.scale / 100).substract(this.scroll)

      this.ctx.strokeStyle = this.themes[this.selectedTheme].arrow
      this.ctx.beginPath()
      this.ctx.moveTo(realFrom.x, realFrom.y)
      this.ctx.bezierCurveTo(realFrom.x, (realFrom.y + realTo.y) / 2, realTo.x, (realFrom.y + realTo.y) / 2, realTo.x, realTo.y)
      this.ctx.stroke()
    },
    initDrag: function (e) {
      // TODO - split node sizes into separate const
      let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).add(this.scroll)

      for (let i in this.localNodes) {
        let node = this.localNodes[i]
        let nodeCoords = node.location.multiplyScalar(this.scale / 100).substract(this.scroll)
        let diff = clickCoord.substract(nodeCoords).multiplyScalar(100 / this.scale)

        if (diff.x >= 0 && diff.x <= 200 && diff.y >= 0 && diff.y <= 15) {
          this.drag = { node: node, diff: diff.multiplyScalar(this.scale / 100) }
          this.state = 'dragging'
        }

        if (diff.x >= 0 && diff.x <= 200 && diff.y >= 63 && diff.y <= 85 && node.outputs > 0) {
          let outputShift = this.nodeDimensions.width / node.outputs
          let output = Math.floor(diff.x / outputShift)
          this.drag = { node: node, output: output }
          this.state = 'draggingArrow'
        }
      }
    },
    canvasMouseMove: function (e) {
      if (this.state === 'dragging') {
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).add(this.scroll).substract(this.drag.diff).multiplyScalar(100 / this.scale)
        this.drag.node.location = clickCoord

        this.renderCanvas()
      }
      if (this.state === 'draggingArrow') {
        let node = this.drag.node
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).add(this.scroll).multiplyScalar(100 / this.scale)
        let outRelative = new Vector2(this.nodeDimensions.width / node.outputs / 2 + this.drag.output * this.nodeDimensions.width / node.outputs, this.nodeDimensions.height)
        let outCoord = node.location.add(outRelative)
        this.renderCanvas()
        this.renderArrow(outCoord, clickCoord)
      }
    },
    canvasMouseUp: function (e) {
      if (this.state === 'draggingArrow') {
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).add(this.scroll).multiplyScalar(100 / this.scale)

        let nodeFound = false
        for (let i in this.localNodes) {
          let node = this.localNodes[i]
          let nodeCoords = node.location.multiplyScalar(this.scale / 100).substract(this.scroll)
          let diff = clickCoord.substract(nodeCoords).multiplyScalar(100 / this.scale)

          if (diff.x >= 0 && diff.x <= 200 && diff.y >= 0 && diff.y <= 15) {
            nodeFound = true



            this.drag.node.children[this.drag.output] = node
            node.parents.push(this.drag.node)

            if (this.orphanedNodes.indexOf(node) >= 0) {
              this.orphanedNodes.splice(this.orphanedNodes.indexOf(node), 1)
            }
            break
          }
        }

        if (!nodeFound && this.drag.node.children[this.drag.output] !== undefined) {
          let parentIndex = this.drag.node.children[this.drag.output].parents.indexOf(this.drag.node)
          this.drag.node.children[this.drag.output].parents.splice(parentIndex, 1)
          if (this.drag.node.children[this.drag.output].parents.length === 0) {
            this.orphanedNodes.push(this.drag.node.children[this.drag.output])
            console.log('new orphan')
          }

          this.drag.node.children[this.drag.output] = undefined
        }
      }

      this.state = 'idle'
      this.drag = undefined
      this.renderCanvas()
    },
    link: function(parent, child) {
      
    },
    unlink: function(parent, output) {
      let parentIndex = parent.children[output].parents.indexOf(parent)
          this.drag.node.children[this.drag.output].parents.splice(parentIndex, 1)
          if (this.drag.node.children[this.drag.output].parents.length === 0) {
            this.orphanedNodes.push(this.drag.node.children[this.drag.output])
            console.log('new orphan')
          }

          this.drag.node.children[this.drag.output] = undefined
    },
    coordsToCanvas: function (x, y) {
      let bbox = this.canvas.getBoundingClientRect()
      return new Vector2(x - bbox.left * (this.canvas.width / bbox.width),
        y - bbox.top * (this.canvas.height / bbox.height))
    }
  }
}
</script>

<style>
canvas {
    width: 100%;
    height: 100%;
}
</style>
