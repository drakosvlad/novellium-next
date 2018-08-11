<template>
  <div id="dialogBody">
    <h2>New Project</h2>
    <p><strong>Project name:</strong></p>
    <input type="text" id="nameInput" class="form-input" v-model="projectName" />
    <p><strong>Workspace directory: </strong>{{ workspaceDirectory }}<a href="#">(change)</a></p>
    <div id="bottomDiv">
      <p v-if="checkName">Your project will be created under <strong>{{ workspaceDirectory + projectName }}</strong> directory</p>
      <p v-if="!checkName">Invalid name</p>
      <button id="createButton" class="form-button form-button-main" v-on:click="pathSelected" :disabled="!checkName">Create project</button>
      <button id="cancelButton" class="form-button" v-on:click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>

export default {
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
    },
    pathSelected: function () {
      this.$emit('done', {
        name: this.projectName,
        directory: this.workspaceDirectory
      })
    }
  }
}
</script>

<style scoped>

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

button {
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

#nameInput {
  width: calc(100% - 35px);
}

p {
  margin-bottom: 5px;
  padding-left: 5px;
  width: calc(100% - 35px);
}

a {
  float: right;
}
</style>
