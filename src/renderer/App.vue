<template>
  <div id="app">
    <PlotCanvas id="canvas"/>
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
  text-align: center;
  color: #2c3e50;
  position: absolute;
  left: 0px;
  top: 0px;
}

#canvas {
  width: 100%;
  height: 100%;
}
</style>
