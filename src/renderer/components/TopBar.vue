<template>
    <div class="toolbar">
        <icons-bar v-for="toolbar in toolbars" v-bind:bg="toolbar.bg" v-bind:icons="toolbar.icons" :key="toolbar.bg"></icons-bar>
    </div>
</template>

<script>
import IconsBar from './IconsBar.vue'

export default {
  name: 'TopBar',
  components: {
    IconsBar
  },
  data: function () {
    return {
      toolbars: [
        {
          bg: '#007d1d',
          icons: [
            '/static/icons/newfile.png',
            '/static/icons/open.png'
          ]
        }
      ]
    }
  }
}
</script>

<style>

</style>
