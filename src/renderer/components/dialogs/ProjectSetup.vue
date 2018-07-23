<template>
  <div id="dialogBody">
    <h2>Project setup</h2>
    <p><strong>Novel languages:</strong></p>
    <editable-list />
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
      workspaceDirectory: ''
    }
  },
  computed: {
    checkName: function () {
      return (this.projectName !== '')
    }
  },
  methods: {
    cancel: function () {
      this.$emit('cancel')
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
  margin: -250px 0 0 -200px;
  background: white;
  border-radius: 10px;
  border: 1px solid rgb(124, 124, 124);
  padding-left: 20px;
}


</style>
