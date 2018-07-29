<template>
  <div id="app">
    <new-project v-if="dialog === 'new'" v-on:cancel="hideDialogs" v-on:done="newProjectPathSelected"/>
    <project-setup v-if="dialog === 'project-setup'" v-on:done="newProjectConfigured"/>
    <div id="veil" v-if="dialog !== 'none'" v-on:click="hideDialogsUser"></div>
    <div v-bind:class="blurclass">
      <div class="r1">
        <top-bar v-on:btnclick="toolbarClick"></top-bar>
      </div>
      <table cellspacing="0">
        <tr class="r2">
          <td class="col1"></td>
          <td class="col2">
          <PlotCanvas id="canvas" :plot="project.plot"/>
          </td>
        </tr>
        <tr class="r3">
          <td class id="status">{{ status }}</td>
          <td class></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import fs from 'fs'

import Project from './classes/Project.js'
import PlotNode from './classes/PlotNode.js'

import PlotCanvas from './components/PlotCanvas.vue'
import TopBar from './components/TopBar.vue'

import NewProject from './components/dialogs/NewProject.vue'
import ProjectSetup from './components/dialogs/ProjectSetup.vue'

export default {
  name: 'app',
  components: {
    PlotCanvas,
    TopBar,
    NewProject,
    ProjectSetup
  },
  data: function () {
    return {
      status: 'Ready',
      dialog: 'none',
      blurclass: '',
      project: new Project()
    }
  },
  methods: {
    writeProject: function () {
      this.status = 'Writing project...'
      if (!fs.existsSync(this.project.path)) {
        fs.mkdirSync(this.project.path)
      }
      fs.writeFile(this.project.path + 'project.nov', JSON.stringify(this.project), (error) => {
        if (error) {
          alert(error)
          this.status = 'Error writing project'
        } else {
          this.status = 'Ready'
        }
      })
    },
    toolbarClick: function (e) {
      switch (e) {
        case 'newproject':
          this.showDialog('new')
          break
        case 'saveproject':
          this.writeProject()
      }
    },
    showDialog: function (dialog) {
      this.blurclass = 'blur'
      this.dialog = dialog
    },
    hideDialogs: function () {
      this.blurclass = ''
      this.dialog = 'none'
    },
    hideDialogsUser: function () {
      if (this.dialog !== 'project-setup') {
        this.hideDialogs()
      }
    },
    newProjectPathSelected: function (data) {
      this.project = new Project(data.name, data.directory + data.name + '/')
      this.showDialog('project-setup')
    },
    newProjectConfigured: function (data) {
      this.hideDialogs()
      this.project.languages = data.languages
      this.project.content = []
      this.project.phrases = []

      let rootNode = new PlotNode(100, 100, 'Root', 'Novel starts here', '#db9600')
      rootNode.setOutputs(1)

      this.project.plot = {
        root: rootNode,
        orphanedNodes: []
      }

      this.writeProject()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100vh;
  width: 100vw;
  background: #edfff5;
}

#veil {
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.blur {
  filter: blur(5px);
}

#canvas {
  height: calc(100vh - 130px);
}

td {
  padding: 0;
}

table {
  table-layout: fixed;
  width: 100%;
  height: calc(100vh - 100px);
}

.col1 {
  width: 300px;
}

.col2 {
  width: calc(100vw - 300px); 
  height: calc(100vh - 130px);
}

.r1 {
  height: 100px;
}

.r2 {
  height: calc(100vh - 130px);
}

.r3 {
  height: 30px;
  background: #00a74b;
  color: white;
}

#status {
  padding-left: 10px;
}

.form-input {
  border-radius: 3px;
  border: solid 1px #c5c5c5;
  font-size: 14pt;
  padding: 5px;
}

.form-button {
  border-radius: 5px;
  border: 1px solid #aaaaaa;
  font-size: 14pt;
  padding: 9px 15px 9px 15px;
  color: #333333;
  background: white;
}

.form-button-small {
  border-radius: 5px;
  border: 1px solid #aaaaaa;
  font-size: 14pt;
  padding: 5px 15px 5px 15px;
  color: #333333;
  background: white;
}

.form-button-main {
  background: #00a74b;
  padding: 10px 15px 10px 15px;
  color: white;
  border: none
}

.form-button-small-main {
  background: #00a74b;
  padding: 6px 15px 6px 15px;
  color: white;
  border: none
}

.form-button-ultrasmall {
  border-radius: 5px;
  color: #333333;
  background: white;
  padding: 4px;
  border: 1px solid #aaaaaa;
  font-weight: bold;
}

.form-button-main:disabled {
  background: #34c576;
}

</style>
