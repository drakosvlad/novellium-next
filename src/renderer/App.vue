<template>
  <div id="app">
    <new-project class="dialog"  v-if="dialog === 'new'" v-on:cancel="hideDialogs" v-on:done="newProjectPathSelected"/>
    <project-setup class="dialog" v-if="dialog === 'project-setup'" v-on:done="newProjectConfigured"/>
    <new-node class="dialog" v-if="dialog === 'new-node'" v-on:done="newNodeCreated" />
    <div id="veil" v-if="dialog !== 'none'" v-on:click="hideDialogsUser"></div>
    <div v-bind:class="blurclass" id="workspace">
      <div class="r1">
        <top-bar v-on:btnclick="toolbarClick"></top-bar>
      </div>
      <table cellspacing="0">
        <tr class="r2">
          <td class="col1"></td>
          <td class="col2">
          <PlotCanvas id="canvas" :plot="project.plot" :newnode="newnode" :action="canvasAction" v-on:actionperformed="canvasActionPerformed" v-on:newnodeplaced="newNodePlaced"/>
          </td>
        </tr>
        <tr class="r3">
          <td class id="status">{{ status || 'Ready' }}</td>
          <td class></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Project from './classes/Project.js'
import PlotNode from './classes/PlotNode.js'
import Vector2 from './classes/Vector2.js'

import PlotCanvas from './components/PlotCanvas.vue'
import TopBar from './components/TopBar.vue'

import NewProject from './components/dialogs/NewProject.vue'
import ProjectSetup from './components/dialogs/ProjectSetup.vue'
import NewNode from './components/dialogs/NewNode.vue'

import fs from 'fs'
import { clearTimeout, setTimeout } from 'timers'
const {dialog} = require('electron').remote

export default {
  name: 'app',
  components: {
    PlotCanvas,
    TopBar,
    NewProject,
    ProjectSetup,
    NewNode
  },
  data: function () {
    return {
      status: undefined,
      statusTimeoutHandler: undefined,
      dialog: 'none',
      blurclass: '',
      project: new Project(),
      newnode: undefined,
      canvasAction: ''
    }
  },
  methods: {
    canvasActionPerformed: function () {
      this.canvasAction = ''
    },
    newNodeCreated: function (node) {
      this.newnode = node
      this.hideDialogs()
    },
    newNodePlaced: function () {
      this.newnode = undefined
    },
    statusMessage: function (msg, duration) {
      if (this.statusTimeoutHandler !== undefined) {
        clearTimeout(this.statusTimeoutHandler)
      }

      if (duration === 0) {
        this.statusTimeoutHandler = undefined
      } else {
        this.statusTimeoutHandler = setTimeout(function () {
          this.status = undefined
          this.statusTimeoutHandler = undefined
        }.bind(this), duration * 1000)
      }

      this.status = msg
    },
    writeProject: function () {
      this.statusMessage('Writing project...', 0)
      if (!fs.existsSync(this.project.path)) {
        fs.mkdirSync(this.project.path)
      }
      fs.writeFile(this.project.path + 'project.nov', JSON.stringify(this.project), (error) => {
        if (error) {
          this.statusMessage('Error writing project', 10)
        } else {
          this.statusMessage('Saved successfully', 5)
        }
      })
    },
    readProject: function (filename) {
      this.statusMessage('Reading project...')
      fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
          this.statusMessage('Could not read project', 10)
        } else {
          let tempProject = Object.assign(new Project(), JSON.parse(data))
          this.assignProjectClasses(tempProject)
          this.project = tempProject
          this.statusMessage('Opened successfully', 5)
        }
      }.bind(this))
    },
    assignProjectClasses: function (project) {
      for (let n in project.plot.orphanedNodes) {
        project.plot.orphanedNodes[n] = Object.assign(new PlotNode(), project.plot.orphanedNodes[n])
        this.assignNodeClasses(project.plot.orphanedNodes[n])
      }
      project.plot.root = Object.assign(new PlotNode(), project.plot.root)
      this.assignNodeClasses(project.plot.root)
    },
    assignNodeClasses: function (node) {
      node.location = Object.assign(new Vector2(), node.location)
      for (let n in node.children) {
        node.children[n] = Object.assign(new PlotNode(), node.children[n])
        this.assignNodeClasses(node.children[n])
      }
    },
    selectProject: function () {
      dialog.showOpenDialog({
        properties: ['openDirectory']
      }, function (directory) {
        if (directory !== '') {
          this.readProject(directory + '/project.nov')
        }
      }.bind(this))
    },
    toolbarClick: function (e) {
      switch (e) {
        case 'newproject':
          this.showDialog('new')
          break
        case 'saveproject':
          this.writeProject()
          break
        case 'openproject':
          this.selectProject()
          break
        case 'newnode':
          this.showDialog('new-node')
          break
        case 'delnode':
          this.canvasAction = 'delete'
          break
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

@keyframes appear {
    0% { opacity: 0;}
    100% { opacity: 1;}
}

.blur {
  filter: blur(5px);
}

#workspace {
  transition: 0.2s linear all;
}

.caption {
  color: #444444;
  margin-top: 7px;
  font-style: italic;
  margin-left: 5px;
}

.dialog {
  animation: appear 0.2s;
}

#canvas {
  height: calc(100vh - 80px);
}

td {
  padding: 0;
}

table {
  table-layout: fixed;
  width: 100%;
  height: calc(100vh - 50px);
}

.col1 {
  width: 300px;

  box-shadow: inset -10px 0 10px -10px #444444;
}

.col2 {
  width: calc(100vw - 300px); 
  height: calc(100vh - 80px);
}

.r1 {
  height: 50px;
}

.r2 {
  height: calc(100vh - 80px);
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
  background: #ffffff;
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
