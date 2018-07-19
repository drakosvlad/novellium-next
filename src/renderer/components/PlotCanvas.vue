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
      themes: [
        {
          background: '#ffffff',
          arrow: '#000000',
          nodeBackground: '#dddddd',
          nodeTitle: '#000000',
          nodeText: '#333333'
        }
      ],
      selectedTheme: 0,
      localNodes: []
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

    this.renderCanvas()
  },
  methods: {
    renderCanvas: function () {
      this.ctx.fillStyle = this.themes[this.selectedTheme].background
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      this.renderNode(this.localRoot)
    },
    renderNode: function (node) {
      this.localNodes.push(node)
      let canvasCoords = node.location.multiplyScalar(this.scale / 100).substract(this.scroll)

      this.ctx.fillStyle = this.themes[this.selectedTheme].nodeBackground
      this.ctx.fillRect(canvasCoords.x, canvasCoords.y, 200 * this.scale / 100, 85 * this.scale / 100)

      this.ctx.fillStyle = node.color
      this.ctx.fillRect(canvasCoords.x, canvasCoords.y, 200 * this.scale / 100, 15 * this.scale / 100)

      let headerCoords = canvasCoords.add((new Vector2(5, 37)).multiplyScalar(this.scale / 100))
      this.ctx.fillStyle = this.themes[this.selectedTheme].nodeTitle
      this.ctx.font = 'italic bold 17px sans-serif'
      this.ctx.fillText(node.title, headerCoords.x, headerCoords.y)

      let textCoords = canvasCoords.add((new Vector2(5, 58)).multiplyScalar(this.scale / 100))
      this.ctx.fillStyle = this.themes[this.selectedTheme].nodeText
      this.ctx.font = '17px sans-serif'
      this.ctx.fillText(node.text, textCoords.x, textCoords.y)
    },
    renderArrow: function (nodeFrom, nodeTo, outputIndex) {

    },
    initDrag: function (e) {
      // TODO - split node sizes into separate const
      let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).add(this.scroll)

      for (let i in this.localNodes) {
        let node = this.localNodes[i]
        let nodeCoords = node.location.multiplyScalar(this.scale / 100).substract(this.scroll)
        let diff = clickCoord.substract(nodeCoords)

        if (diff.x >= 0 && diff.x <= 200 * this.scale / 100 && diff.y >= 0 && diff.y <= 15 * this.scale / 100) {
          this.drag = { node: node, diff: diff }
          this.state = 'dragging'
        }
      }
    },
    canvasMouseMove: function (e) {
      if (this.state === 'dragging') {
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).add(this.scroll).substract(this.drag.diff)
        this.drag.node.location = clickCoord
        this.renderCanvas()
      }
    },
    canvasMouseUp: function (e) {
      this.state = 'idle'
      this.drag = undefined
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
