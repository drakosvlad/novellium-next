<template>
  <div id="dialogBody">
    <h2>New node</h2>
    <p><strong>Node type:</strong></p>
    <select class="form-input" v-model="type">
      <option value="plot">Plot node</option>
      <option value="container">Container node</option>
    </select>
    <p class="caption" v-if="type == 'plot'">Basic node that stores partial script</p>
    <p class="caption" v-if="type == 'container'">Node that can store a plot graph inside it</p>

    <p><strong>Node caption:</strong></p>
    <input type="text" class="form-input" v-model="caption" />
    <div id="bottomDiv">
      <button id="createButton" class="form-button form-button-main bottombutton" v-on:click="done">Create</button>
      <button id="cancelButton" class="form-button" v-on:click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import PlotNode from '../../classes/PlotNode'

export default {
  name: 'NewNode',
  data: function () {
    return {
      type: 'plot',
      caption: ''
    }
  },
  computed: {
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
  height: 300px;
  z-index: 15;
  top: 50%;
  left: 50%;
  margin: -250px 0 0 -150px;
  background: white;
  border-radius: 10px;
  border: 1px solid rgb(124, 124, 124);
  padding-left: 20px;
}

.bottombutton {
  float: right;
  margin-top: 5px;
  margin-left: 5px;
}

h2 {
  margin-left: 5px;
}

p {
  margin-bottom: 10px;
}

#bottomDiv {
  position: absolute;
  bottom: 15px;
  width: calc(100% - 35px);
}

</style>
