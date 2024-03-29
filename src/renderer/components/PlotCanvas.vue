<template>
    <div>
        <canvas id="plotCanvas" v-on:mousedown="initDrag" v-on:mousemove="canvasMouseMove" v-on:mouseup="canvasMouseUp" v-on:mousewheel="scrollCanvas"></canvas>
    </div>
</template>

<script>
import Vector2 from '../classes/Vector2.js'
import PlotNode from '../classes/PlotNode.js'

export default {
  name: 'PlotCanvas',
  props: {
    plot: undefined,
    newnode: PlotNode,
    action: String
  },
  data: function () {
    return {
      state: 'idle',
      drag: undefined,
      scale: 100,
      scroll: new Vector2(0, 0),
      canvas: undefined,
      ctx: undefined,
      orphanedNodes: [],
      themes: [
        {
          background: '#ffffff',
          arrow: '#444444',
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
        uiPosition: new Vector2(5, 84),
        fontSize: 17,
        uiFontSize: 14
      },
      ctrlPressed: false
    }
  },
  watch: {
    plot: function () {
      this.renderCanvas()
    },
    action: function () {
      this.renderCanvas()
    }
  },
  mounted: function () {
    this.canvas = document.getElementById('plotCanvas')
    this.canvas.width = window.innerWidth - 300
    this.canvas.height = window.innerHeight - 800

    window.addEventListener('resize', function (e) {
      this.canvas.width = window.innerWidth - 300
      this.canvas.height = window.innerHeight - 80
      this.renderCanvas()
    }.bind(this), false)

    window.addEventListener('keydown', function (e) {
      this.ctrlPressed = e.ctrlKey
    }.bind(this))

    window.addEventListener('keyup', function (e) {
      this.ctrlPressed = false
    }.bind(this))

    this.ctx = this.canvas.getContext('2d')

    this.renderCanvas()
  },
  methods: {
    scrollCanvas: function (e) {
      if (!this.ctrlPressed) {
        this.scroll.x -= e.deltaX
        this.scroll.y -= e.deltaY
      } else {
        this.scale -= e.deltaY * this.scale / 100
      }
      this.renderCanvas()
    },
    renderCanvas: function () {
      this.ctx.fillStyle = this.themes[this.selectedTheme].background
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      if (this.plot !== undefined) {
        this.renderNode(this.plot.root)
        this.orphanedNodes.forEach(node => this.renderNode(node))

        if (this.newnode !== undefined) {
          this.ctx.globalAlpha = 0.5
          this.renderNode(this.newnode)
          this.ctx.globalAlpha = 1.0
        }

        if (this.action === 'delete') {
          this.ctx.fillStyle = this.themes[this.selectedTheme].nodeTitle
          this.ctx.font = '25px sans-serif'
          this.ctx.fillText('Click on node to remove it, or right-click to cancel', 25, 50)
        }
      } else {
        this.ctx.fillStyle = '#333333'
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        this.ctx.fillStyle = '#ffffff'
        this.ctx.font = '50px sans-serif'
        this.ctx.fillText('No plot to display', 50, 100)
      }
    },
    renderNode: function (node) {
      this.localNodes.push(node)

      if (node.ui !== undefined) {
        node.height = this.nodeDimensions.height + node.ui.length * 24 + 5
      }

      let canvasCoords = node.location.multiplyScalar(this.scale / 100).add(this.scroll)

      this.ctx.fillStyle = this.themes[this.selectedTheme].nodeBackground
      this.ctx.fillRect(canvasCoords.x, canvasCoords.y, this.nodeDimensions.width * this.scale / 100, node.height * this.scale / 100)

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

      if (node.ui !== undefined) {
        let uiFontSize = this.nodeDimensions.uiFontSize * this.scale / 100
        let uiPosition = this.nodeDimensions.uiPosition.y
        for (let i in node.ui) {
          let textCoords = canvasCoords.add((new Vector2(10, uiPosition)).multiplyScalar(this.scale / 100))
          this.ctx.fillStyle = this.themes[this.selectedTheme].nodeText
          this.ctx.font = uiFontSize + 'px sans-serif'
          this.ctx.fillText(node.ui[i].caption, textCoords.x, textCoords.y)

          switch (node.ui[i].type) {
            case 'combobox':
              this.ctx.fillStyle = '#ffffff'
              this.ctx.fillRect(textCoords.x - 10 * this.scale / 100 + this.nodeDimensions.width / 2 * this.scale / 100, textCoords.y - 14 * this.scale / 100, (this.nodeDimensions.width / 2 - 5) * this.scale / 100, 20 * this.scale / 100)
              this.ctx.fillStyle = '#777777'
              this.ctx.beginPath()
              this.ctx.moveTo(textCoords.x - 20 * this.scale / 100 + this.nodeDimensions.width * this.scale / 100, textCoords.y - 8 * this.scale / 100)
              this.ctx.lineTo(textCoords.x - 30 * this.scale / 100 + this.nodeDimensions.width * this.scale / 100, textCoords.y - 8 * this.scale / 100)
              this.ctx.lineTo(textCoords.x - 25 * this.scale / 100 + this.nodeDimensions.width * this.scale / 100, textCoords.y)
              this.ctx.fill()

              this.ctx.fillRect(canvasCoords.x + 1, textCoords.y - 12 * this.scale / 100, 3 * this.scale / 100, 14 * this.scale / 100)

              this.ctx.fillStyle = this.themes[this.selectedTheme].nodeText
              this.ctx.font = uiFontSize + 'px sans-serif'
              this.ctx.fillText(node.ui[i].selecteditem, textCoords.x + this.nodeDimensions.width / 2 * this.scale / 100, textCoords.y)
          }

          uiPosition += 24
        }
      }

      if (node.outputs > 0) {
        let shift = this.nodeDimensions.width / (node.outputs)
        this.ctx.fillStyle = this.themes[this.selectedTheme].outputText
        let outputCoords = canvasCoords.add(new Vector2(shift / 2, node.height - 5).multiplyScalar(this.scale / 100))
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

        let outRelative = new Vector2(this.nodeDimensions.width / node.outputs / 2 + i * this.nodeDimensions.width / node.outputs, node.height)
        let outCoord = node.location.add(outRelative)
        if (!(this.state === 'draggingArrow' && this.drag.node === node && this.drag.output === Number(i))) {
          this.renderArrow(outCoord, child.location.add(new Vector2(this.nodeDimensions.width / 2, 0)), true)
        }
        this.renderNode(child)
      }
    },
    renderArrow: function (coordFrom, coordTo, cap) {
      let realFrom = coordFrom.multiplyScalar(this.scale / 100).add(this.scroll)
      let realTo = coordTo.multiplyScalar(this.scale / 100).add(this.scroll)

      this.ctx.lineWidth = this.scale / 100
      this.ctx.strokeStyle = this.themes[this.selectedTheme].arrow
      this.ctx.beginPath()
      this.ctx.moveTo(realFrom.x, realFrom.y)
      this.ctx.bezierCurveTo(realFrom.x, (realFrom.y + realTo.y) / 2, realTo.x, (realFrom.y + realTo.y) / 2, realTo.x, realTo.y)
      if (realFrom.y < realTo.y && cap) {
        this.ctx.moveTo(realTo.x - 5, realTo.y - 7)
        this.ctx.lineTo(realTo.x, realTo.y)
        this.ctx.moveTo(realTo.x + 5, realTo.y - 7)
        this.ctx.lineTo(realTo.x, realTo.y)
      }
      this.ctx.stroke()
    },
    initDrag: function (e) {
      // TODO - split node sizes into separate const
      let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).substract(this.scroll).multiplyScalar(100 / this.scale)

      for (let i in this.localNodes) {
        let node = this.localNodes[i]
        let nodeCoords = node.location
        let diff = clickCoord.substract(nodeCoords)

        if (diff.x >= 0 && diff.x <= 200 && diff.y >= 0 && diff.y <= 15) {
          this.drag = { node: node, diff: diff.multiplyScalar(this.scale / 100) }
          this.state = 'dragging'
        }

        if (diff.x >= 0 && diff.x <= 200 && diff.y >= node.height - 22 && diff.y <= node.height && node.outputs > 0) {
          let outputShift = this.nodeDimensions.width / node.outputs
          let output = Math.floor(diff.x / outputShift)
          this.drag = { node: node, output: output }
          this.state = 'draggingArrow'
        }
      }
    },
    canvasMouseMove: function (e) {
      if (this.state === 'dragging') {
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).substract(this.scroll).substract(this.drag.diff).multiplyScalar(100 / this.scale)
        this.drag.node.location = clickCoord

        this.renderCanvas()
      }
      if (this.state === 'draggingArrow') {
        let node = this.drag.node
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).substract(this.scroll).multiplyScalar(100 / this.scale)
        let outRelative = new Vector2(this.nodeDimensions.width / node.outputs / 2 + this.drag.output * this.nodeDimensions.width / node.outputs, node.height)
        let outCoord = node.location.add(outRelative)
        this.renderCanvas()
        this.renderArrow(outCoord, clickCoord, false)
      }
      if (this.newnode !== undefined) {
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).substract(this.scroll).multiplyScalar(100 / this.scale)
        this.newnode.location = clickCoord.add(this.scroll)

        this.renderCanvas()
      }
    },
    canvasMouseUp: function (e) {
      if (this.state === 'draggingArrow') {
        let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).substract(this.scroll).multiplyScalar(100 / this.scale)

        let nodeFound = false
        for (let i in this.localNodes) {
          let node = this.localNodes[i]
          let nodeCoords = node.location
          let diff = clickCoord.substract(nodeCoords.multiplyScalar(100 / this.scale))

          if (diff.x >= 0 && diff.x <= 200 && diff.y >= 0 && diff.y <= 15) {
            nodeFound = true
            this.link(this.drag.node, this.drag.output, node)
            break
          }
        }

        if (!nodeFound && this.drag.node.children[this.drag.output] !== undefined) {
          this.unlink(this.drag.node, this.drag.output)
        }
      }

      if (this.newnode !== undefined) {
        this.orphanedNodes.push(this.newnode)
        this.$emit('newnodeplaced')
      }

      if (this.action === 'delete') {
        if (e.button === 2) {
          this.$emit('actionperformed')
        } else if (e.button === 0) {
          let clickCoord = this.coordsToCanvas(e.clientX, e.clientY).substract(this.scroll).multiplyScalar(100 / this.scale)

          for (let i in this.localNodes) {
            let node = this.localNodes[i]
            let nodeCoords = node.location
            let diff = clickCoord.substract(nodeCoords).multiplyScalar(100 / this.scale)

            if (diff.x >= 0 && diff.x <= 200 && diff.y >= 0 && diff.y <= node.height) {
              node.children.forEach(function (el) {
                this.unlink(node, el)
              }.bind(this))

              // Remove this node from everyone`s child
              for (let i2 in this.localNodes) {
                let node2 = this.localNodes[i2]
                for (let c in node2.children) {
                  if (node2.children[c] === node) {
                    node2.children[c] = undefined
                  }
                }
              }

              for (let il in this.localNodes) {
                if (this.localNodes[il] === node) {
                  this.localNodes.splice(il, 1)
                }
              }

              if (node.parents === 0) {
                for (let io in this.orphanedNodes) {
                  if (this.orphanedNodes[io] === node) {
                    this.orphanedNodes.splice(io, 1)
                  }
                }
              }
            }
          }

          this.$emit('actionperformed')
        }
      }
      this.state = 'idle'
      this.drag = undefined
      this.renderCanvas()
    },
    link: function (parent, index, child) {
      this.unlink(parent, index)
      parent.children[index] = child
      child.parents++
      let orphanIndex = this.orphanedNodes.indexOf(child)
      if (orphanIndex >= 0) {
        this.orphanedNodes.splice(orphanIndex, 1)
        console.log('orphan adopted')
      }
    },
    unlink: function (parent, output) {
      if (parent.children[output] === undefined) {
        return
      }
      parent.children[output].parents--
      if (parent.children[output].parents === 0) {
        this.orphanedNodes.push(parent.children[output])
        console.log('new orphan')
      }

      parent.children[output] = undefined
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
