<template>
  <div id="dialogBody">
    <h2>Plot editor - {{ node.title }}</h2>
    <p><strong>Node name:</strong></p>
    <input type="text" class="form-input" v-model="node.title" />
    <p><strong>Plot:</strong></p>
    <textarea class="form-input code" v-model="node.plot" />
  </div>
</template>

<script>
import PlotNode from '../../classes/PlotNode'

export default {
  name: 'PlotNodeEditor',
  props: {
    node: PlotNode
  },
  methods: {
    cancel: function () {
      this.$emit('cancel')
    },
    done: function () {
      let description = ''
      let color = '#000000'
      if (this.type === 'plot') {
        description = 'Plot node'
        color = '#AAC3FF'
      } else {
        description = 'Container node'
        color = '#FFAAAB'
      }
      this.$emit('done', new PlotNode(0, 0, this.caption, description, color, this.type))
    }
  }
}
</script>

<style>

#dialogBody {
  position: absolute;
  width: 500px;
  height: 600px;
  z-index: 15;
  top: 50%;
  left: 50%;
  margin: -300px 0 0 -250px;
  background: white;
  border-radius: 10px;
  border: 1px solid rgb(124, 124, 124);
  padding-left: 20px;
}

h2 {
  margin-left: 5px;
}

p {
  margin-bottom: 10px;
}

.code {
  font-family: monospace;
  height: 380px;
  width: 470px;
}

</style>
