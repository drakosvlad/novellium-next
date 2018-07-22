<template>
  <div id="dialogBody">
    <h2>New Project</h2>
    <p><strong>Project name:</strong></p>
    <input type="text" id="nameInput" class="form-input" v-model="projectName" />
    <p><strong>Workspace directory: </strong>{{ workspaceDirectory }}<a href="#">(change)</a></p>
    <div id="bottomDiv">
      <p>Your project will be created under <strong>{{ workspaceDirectory + projectName }}</strong> directory</p>
      <button id="createButton" class="form-button">Create project</button>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      projectName: '',
      workspaceDirectory: '/home/'
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

#createButton {
  float: right;
  margin-top: 5px;
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
