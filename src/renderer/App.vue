<template>
  <div id="app">
    <new-project v-if="dialog === 'new'" v-on:cancel="hideDialogs"/>
    <div id="veil" v-if="dialog !== 'none'" v-on:click="hideDialogs"></div>
    <div v-bind:class="blurclass">
      <div class="r1">
        <top-bar v-on:btnclick="toolbarClick"></top-bar>
      </div>
      <table cellspacing="0">
        <tr class="r2">
          <td class="col1"></td>
          <td class="col2">
          <PlotCanvas id="canvas"/>
          </td>
        </tr>
        <tr class="r3">
          <td class id="status">Ready</td>
          <td class></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import PlotCanvas from './components/PlotCanvas.vue'
import TopBar from './components/TopBar.vue'
import NewProject from './components/dialogs/NewProject.vue'

export default {
  name: 'app',
  components: {
    PlotCanvas,
    TopBar,
    NewProject
  },
  data: function () {
    return {
      dialog: 'none',
      blurclass: ''
    }
  },
  methods: {
    toolbarClick: function (e) {
      switch (e) {
        case 'newproject':
          this.showDialog('new')
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

.form-button-main {
  background: #00a74b;
  padding: 10px 15px 10px 15px;
  color: white;
  border: none
}

.form-button-main:disabled {
  background: #34c576;
}

</style>
