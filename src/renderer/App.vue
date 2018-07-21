<template>
  <div id="app">
    <div class="r1">
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Launch demo modal
      </button>
    </div>
    <table cellspacing="0">
      <tr class="r2">
        <td class="col1"></td>
        <td class="col2">
        <PlotCanvas id="canvas"/>
        </td>
      </tr>
      <tr class="r3">
        <td class></td>
        <td class></td>
      </tr>
    </table>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import PlotCanvas from './components/PlotCanvas.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    PlotCanvas
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
}

</style>
