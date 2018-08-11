<template>
  <div id="dialogBody">
    <h2>Project setup</h2>
    <p><strong>Novel languages:</strong></p>
    <editable-list v-model="languages" />
    <div id="bottomDiv">
      <p v-if="!check">You need at least one language</p>
      <button id="createButton" class="form-button form-button-main bottombutton" v-on:click="done" :disabled="!check">Done</button>
    </div>
  </div>
</template>

<script>
import EditableList from '../EditableList.vue'

export default {
  name: 'ProjectSetup',
  components: {
    EditableList
  },
  mounted: function () {
    let app = require('electron').remote.app
    this.workspaceDirectory = app.getPath('documents') + '/'
  },
  data: function () {
    return {
      projectName: '',
      workspaceDirectory: '',
      languages: []
    }
  },
  computed: {
    check: function () {
      return (this.languages.length > 0)
    }
  },
  methods: {
    cancel: function () {
      this.$emit('cancel')
    },
    done: function () {
      this.$emit('done', {
        languages: this.languages
      })
    }
  }
}
</script>

<style>

#dialogBody {
  position: absolute;
  width: 500px;
  height: 400px;
  z-index: 15;
  top: 50%;
  left: 50%;
  margin: -200px 0 0 -250px;
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

#bottomDiv {
  position: absolute;
  bottom: 15px;
  width: calc(100% - 35px);
}

</style>
